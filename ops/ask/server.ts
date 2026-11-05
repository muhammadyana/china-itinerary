import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { loadConfig } from './config.ts';
import { createAuth, expiredSessionCookie, readSessionCookie, sessionCookie } from './auth.ts';
import { loginFailures, takeChatSlot } from './limits.ts';
import { getCorpus, type Corpus } from './corpus.ts';
import { createChat, parseChatRequest, type ChatEvent } from './chat.ts';

const MAX_BODY_BYTES = 64 * 1024;
const HEARTBEAT_MS = 15_000; // Cloudflare drops proxied connections idle for 100 s
const SHUTDOWN_GRACE_MS = 10_000;
const DEV_ORIGIN = /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/;
const INVALID = 'Format permintaan tidak valid.';
const BASE_HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

type Headers = Record<string, string>;
type Handler = (req: IncomingMessage, res: ServerResponse) => Promise<void> | void;

class HttpError extends Error {
  readonly status: number;
  readonly headers: Headers;

  constructor(status: number, message: string, headers: Headers = {}) {
    super(message);
    this.status = status;
    this.headers = headers;
  }
}

const config = loadConfig();
const auth = createAuth(config.passwordHash, config.sessionSecret);
const runChat = createChat(config);

function sendJson(res: ServerResponse, status: number, body?: unknown, headers: Headers = {}): void {
  const payload = body === undefined ? '' : JSON.stringify(body);
  res.writeHead(status, { ...BASE_HEADERS, ...(payload ? { 'Content-Type': 'application/json; charset=utf-8' } : {}), ...headers });
  res.end(payload);
}

function minutesText(seconds: number): string {
  return `${Math.max(1, Math.ceil(seconds / 60))} menit`;
}

function isAllowedOrigin(origin: string): boolean {
  return origin === config.origin || (config.dev && DEV_ORIGIN.test(origin));
}

/** Rejects cross-site and non-JSON POSTs before any body is read. */
function checkPost(req: IncomingMessage): void {
  const origin = req.headers.origin;
  if (origin !== undefined && !isAllowedOrigin(origin)) throw new HttpError(403, 'Akses ditolak.');
  const type = (req.headers['content-type'] ?? '').split(';')[0].trim().toLowerCase();
  if (type !== 'application/json') throw new HttpError(415, 'Permintaan harus berformat JSON.');
}

function readJson(req: IncomingMessage): Promise<unknown> {
  const tooLarge = new HttpError(413, 'Permintaan terlalu besar.', { Connection: 'close' });
  if (Number(req.headers['content-length'] ?? 0) > MAX_BODY_BYTES) return Promise.reject(tooLarge);
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      if (size > MAX_BODY_BYTES) return; // already rejected; the rest is discarded
      size += chunk.length;
      if (size > MAX_BODY_BYTES) reject(tooLarge);
      else chunks.push(chunk);
    });
    req.on('end', () => {
      if (size > MAX_BODY_BYTES) return;
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new HttpError(400, INVALID));
      }
    });
    req.on('close', () => {
      if (!req.complete) reject(new HttpError(400, INVALID));
    });
  });
}

function isAuthenticated(req: IncomingMessage): boolean {
  return auth.isValidToken(readSessionCookie(req.headers.cookie));
}

const health: Handler = (_req, res) => sendJson(res, 200, { ok: true });

const session: Handler = (req, res) => sendJson(res, 200, { authenticated: isAuthenticated(req) });

const login: Handler = async (req, res) => {
  checkPost(req);
  const body = await readJson(req);
  const password = typeof body === 'object' && body !== null && 'password' in body ? body.password : undefined;
  if (typeof password !== 'string') throw new HttpError(400, INVALID);
  const wait = loginFailures.retryAfter();
  if (wait) {
    throw new HttpError(429, `Terlalu banyak percobaan. Coba lagi dalam ${minutesText(wait)}.`, { 'Retry-After': String(wait) });
  }
  // Counted as a failure until proven otherwise, so parallel guesses cannot slip past the limit.
  const attempt = loginFailures.add();
  if (!await auth.verifyPassword(password)) {
    console.warn('ask: login failed');
    throw new HttpError(401, 'Kata sandi salah.');
  }
  loginFailures.remove(attempt);
  sendJson(res, 204, undefined, { 'Set-Cookie': sessionCookie(auth.issueToken()) });
};

const logout: Handler = (req, res) => {
  checkPost(req);
  req.resume();
  sendJson(res, 204, undefined, { 'Set-Cookie': expiredSessionCookie() });
};

function streamChat(res: ServerResponse, run: (send: (event: ChatEvent) => void, signal: AbortSignal) => Promise<void>): Promise<void> {
  res.writeHead(200, { ...BASE_HEADERS, 'Content-Type': 'text/event-stream', 'X-Accel-Buffering': 'no' });
  res.flushHeaders();
  const controller = new AbortController();
  res.on('close', () => {
    if (!res.writableEnded) controller.abort(); // browser went away: stop paying for the upstream stream
  });
  const writable = (): boolean => !res.writableEnded && !res.destroyed;
  const heartbeat = setInterval(() => {
    if (writable()) res.write(': ping\n\n');
  }, HEARTBEAT_MS);
  const send = (event: ChatEvent): void => {
    if (writable()) res.write(`data: ${JSON.stringify(event)}\n\n`);
  };
  return run(send, controller.signal).finally(() => {
    clearInterval(heartbeat);
    if (writable()) res.end();
  });
}

const chat: Handler = async (req, res) => {
  checkPost(req);
  if (!isAuthenticated(req)) throw new HttpError(401, 'Sesi berakhir. Masukkan kata sandi lagi.');
  const request = parseChatRequest(await readJson(req));
  if (typeof request === 'string') throw new HttpError(400, request);
  let corpus: Corpus;
  try {
    corpus = await getCorpus(config.siteRoot);
  } catch {
    throw new HttpError(503, 'Isi situs belum bisa dibaca. Coba lagi sebentar.');
  }
  const wait = takeChatSlot();
  if (wait) {
    throw new HttpError(429, `Batas pertanyaan tercapai. Coba lagi dalam ${minutesText(wait)}.`, { 'Retry-After': String(wait) });
  }
  await streamChat(res, (send, signal) => runChat(request, corpus, send, signal));
};

const routes: Record<string, Record<string, Handler>> = {
  '/api/ask/health': { GET: health },
  '/api/ask/session': { GET: session },
  '/api/ask/login': { POST: login },
  '/api/ask/logout': { POST: logout },
  '/api/ask/chat': { POST: chat },
};

async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const path = new URL(req.url ?? '/', 'http://localhost').pathname;
  const methods = routes[path];
  if (!methods) throw new HttpError(404, 'Tidak ditemukan.');
  const handler = methods[req.method ?? ''];
  if (!handler) throw new HttpError(405, 'Metode tidak didukung.', { Allow: Object.keys(methods).join(', ') });
  await handler(req, res);
}

const server = createServer((req, res) => {
  handle(req, res).catch((error: unknown) => {
    if (res.headersSent) {
      res.end();
      return;
    }
    if (error instanceof HttpError) {
      sendJson(res, error.status, { error: error.message }, error.headers);
      return;
    }
    console.error(`ask: request failed ${error instanceof Error ? `${error.name}: ${error.message}` : String(error)}`);
    sendJson(res, 500, { error: 'Terjadi kesalahan di server.' });
  });
});
server.requestTimeout = 30_000; // time to receive a request; streamed responses are not limited by it

server.listen(config.port, config.host, () => {
  console.log(`ask: listening on ${config.host}:${config.port} site_root=${config.siteRoot} origin=${config.origin} web_search_max_uses=${config.webSearchMaxUses} dev=${config.dev}`);
  getCorpus(config.siteRoot).catch(() => undefined); // warm the cache; failures are logged by getCorpus
});

function shutdown(signal: string): void {
  console.log(`ask: ${signal} received, shutting down`);
  server.close(() => process.exit(0));
  server.closeIdleConnections();
  setTimeout(() => process.exit(0), SHUTDOWN_GRACE_MS).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
