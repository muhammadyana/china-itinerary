import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { loadConfig } from './config.ts';
import { createAuth, expiredSessionCookie, readSessionCookie, sessionCookie } from './auth.ts';
import { loginFailures } from './limits.ts';
import { createStore, parseInput, settle } from './store.ts';
import { createSheetSync, type SheetSync } from './sheet.ts';

const PREFIX = '/api/shared-expenses';
const MAX_BODY = 16_384;
const CONTENT_TYPE = { 'Content-Type': 'application/json; charset=utf-8' };
const NO_STORE = { 'Cache-Control': 'no-store' };

const config = loadConfig();
const auth = createAuth(config.passwordHash, config.sessionSecret);
const store = createStore(config.dataFile);
const cookieSecure = !config.dev;
const sheet: SheetSync | undefined = config.sheet ? createSheetSync(config.sheet) : undefined;
const sheetPollMs = config.sheet?.pollMs ?? 60_000;

async function pushItem(item: Parameters<NonNullable<SheetSync['pushItem']>>[0]): Promise<void> {
  if (!sheet) return;
  try {
    await sheet.pushItem(item);
  } catch (error) {
    console.error('expenses: sheet push failed');
    console.error(error);
  }
}

async function deleteOnSheet(id: string): Promise<void> {
  if (!sheet) return;
  try {
    await sheet.deleteItem(id);
  } catch (error) {
    console.error('expenses: sheet delete failed');
    console.error(error);
  }
}

async function pullSheet(): Promise<void> {
  if (!sheet) return;
  try {
    await store.applySheetPull(data => sheet.pullAndReconcile(data));
  } catch (error) {
    console.error('expenses: sheet pull failed');
    console.error(error);
  }
}

function requestOrigin(req: IncomingMessage): string | undefined {
  const origin = req.headers.origin;
  if (typeof origin === 'string' && origin) return origin;
  const referer = req.headers.referer;
  if (typeof referer !== 'string' || !referer) return undefined;
  try {
    return new URL(referer).origin;
  } catch {
    return undefined;
  }
}

function allowedOrigin(req: IncomingMessage): boolean {
  if (req.method === 'GET' || req.method === 'HEAD') return true;
  const origin = requestOrigin(req);
  if (!origin) return false;
  if (origin === config.origin) return true;
  if (config.dev && (origin === 'http://127.0.0.1:5173' || origin === 'http://localhost:5173')) return true;
  return false;
}

function send(res: ServerResponse, status: number, body: unknown, extra: Record<string, string> = {}): void {
  const payload = `${JSON.stringify(body)}\n`;
  res.writeHead(status, { ...CONTENT_TYPE, ...NO_STORE, 'Content-Length': Buffer.byteLength(payload), ...extra });
  res.end(payload);
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY) {
        req.destroy();
        reject(new Error('payload too large'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

function client(req: IncomingMessage): { authed: boolean } {
  return { authed: auth.isValidToken(readSessionCookie(req.headers.cookie)) };
}

function ledger(items: Awaited<ReturnType<typeof store.list>>) {
  return { items, settlement: settle(items) };
}

function route(url: string): { path: string; id?: string } | null {
  if (!url.startsWith(PREFIX)) return null;
  const path = url.slice(PREFIX.length) || '/';
  const item = path.match(/^\/items\/([^/?#]+)$/);
  if (item) return { path: '/items/:id', id: decodeURIComponent(item[1]) };
  return { path: path.split('?')[0] || '/' };
}

const server = createServer(async (req, res) => {
  try {
    const url = req.url ?? '/';
    const method = req.method ?? 'GET';
    const matched = route(url.split('?')[0] ?? '/');
    if (!matched) {
      send(res, 404, { error: 'not found' });
      return;
    }

    if (matched.path === '/health' && method === 'GET') {
      send(res, 200, { ok: true });
      return;
    }

    if (!allowedOrigin(req)) {
      send(res, 403, { error: 'forbidden' });
      return;
    }

    if (matched.path === '/session' && method === 'GET') {
      send(res, 200, { authenticated: client(req).authed });
      return;
    }

    if (matched.path === '/login' && method === 'POST') {
      const retryAfter = loginFailures.retryAfter();
      if (retryAfter) {
        send(res, 429, { error: 'too many attempts' }, { 'Retry-After': String(retryAfter) });
        return;
      }
      let body: unknown;
      try {
        body = await readBody(req);
      } catch {
        send(res, 400, { error: 'invalid request' });
        return;
      }
      const password = body && typeof body === 'object' ? String((body as { password?: unknown }).password ?? '') : '';
      const hit = loginFailures.add();
      if (!await auth.verifyPassword(password)) {
        send(res, 401, { error: 'unauthorized' });
        return;
      }
      loginFailures.remove(hit);
      const token = auth.issueToken();
      send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(token, cookieSecure) });
      return;
    }

    if (matched.path === '/logout' && method === 'POST') {
      send(res, 200, { ok: true }, { 'Set-Cookie': expiredSessionCookie(cookieSecure) });
      return;
    }

    if (!client(req).authed) {
      send(res, 401, { error: 'unauthorized' });
      return;
    }

    if (matched.path === '/items' && method === 'GET') {
      send(res, 200, ledger(await store.list()));
      return;
    }

    if (matched.path === '/items' && method === 'POST') {
      let body: unknown;
      try {
        body = await readBody(req);
      } catch {
        send(res, 400, { error: 'invalid request' });
        return;
      }
      const parsed = parseInput(body);
      if (typeof parsed === 'string') {
        send(res, 400, { error: parsed });
        return;
      }
      const created = await store.create(parsed);
      await pushItem(created.record);
      send(res, 201, ledger(created.items));
      return;
    }

    if (matched.path === '/items/:id' && (method === 'PUT' || method === 'DELETE')) {
      const id = matched.id ?? '';
      if (method === 'DELETE') {
        const removed = await store.remove(id);
        if (!removed) {
          send(res, 404, { error: 'not found' });
          return;
        }
        await deleteOnSheet(removed.id);
        send(res, 200, ledger(removed.items));
        return;
      }
      let body: unknown;
      try {
        body = await readBody(req);
      } catch {
        send(res, 400, { error: 'invalid request' });
        return;
      }
      const parsed = parseInput(body);
      if (typeof parsed === 'string') {
        send(res, 400, { error: parsed });
        return;
      }
      const updated = await store.update(id, parsed);
      if (!updated) {
        send(res, 404, { error: 'not found' });
        return;
      }
      await pushItem(updated.record);
      send(res, 200, ledger(updated.items));
      return;
    }

    send(res, 404, { error: 'not found' });
  } catch (error) {
    console.error('expenses:', error);
    if (!res.headersSent) send(res, 500, { error: 'internal error' });
  }
});

void store.list().catch(error => {
  console.error('expenses: failed to open store', error);
  process.exit(1);
}).then(() => {
  server.listen(config.port, config.host, () => {
    console.log(`expenses listening on ${config.host}:${config.port}`);
    if (sheet) {
      console.log(`expenses: sheet sync every ${sheetPollMs / 1000}s`);
      void pullSheet();
      setInterval(() => { void pullSheet(); }, sheetPollMs).unref();
    }
  });
});

function shutdown(): void {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5_000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
