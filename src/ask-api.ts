import { isSource, type PageContext, type Source } from './ask-state.ts';
import type { SharedLocation } from './ask-location.ts';

export type ChatEvent =
  | { type: 'status'; text: string }
  | { type: 'text'; text: string }
  | { type: 'sources'; items: Source[] }
  | { type: 'done'; stopReason: string }
  | { type: 'error'; message: string };

export interface ChatMessage { role: 'user' | 'assistant'; content: string }

export const unreachableMessage = 'Layanan AI belum bisa dihubungi.';
const failedAnswer = 'Jawaban gagal dibuat. Coba lagi.';
const base = '/api/ask';
const jsonHeaders = { 'Content-Type': 'application/json' };

export class AskError extends Error {
  readonly status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}

export const isAbort = (error: unknown) => error instanceof DOMException && error.name === 'AbortError';

async function call(path: string, init: RequestInit = {}): Promise<Response> {
  try {
    return await fetch(`${base}/${path}`, { credentials: 'same-origin', cache: 'no-store', ...init });
  } catch (error) {
    if (isAbort(error)) throw error;
    throw new AskError(unreachableMessage);
  }
}

// The service answers {"error": "..."} in Indonesian; a proxy error page or an empty body gets a generic message.
async function failure(response: Response): Promise<AskError> {
  let message = '';
  try {
    const body = await response.json() as { error?: unknown };
    if (typeof body.error === 'string') message = body.error;
  } catch {
    message = '';
  }
  if (!message) message = response.status >= 500 ? unreachableMessage : response.status === 429 ? 'Terlalu banyak permintaan. Tunggu sebentar, lalu coba lagi.' : failedAnswer;
  return new AskError(message, response.status);
}

export async function sessionActive(): Promise<boolean> {
  const response = await call('session');
  if (!response.ok) throw await failure(response);
  const body = await response.json().catch(() => null) as { authenticated?: unknown } | null;
  return body?.authenticated === true;
}

export async function login(password: string): Promise<void> {
  const response = await call('login', { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ password }) });
  if (!response.ok) throw await failure(response);
}

export async function logout(): Promise<void> {
  const response = await call('logout', { method: 'POST', headers: jsonHeaders, body: '{}' });
  if (!response.ok) throw await failure(response);
}

function toEvent(value: unknown): ChatEvent | null {
  const event = value as Record<string, unknown> | null;
  switch (event?.type) {
    case 'status':
    case 'text':
      return typeof event.text === 'string' ? { type: event.type, text: event.text } : null;
    case 'sources':
      return Array.isArray(event.items) ? { type: 'sources', items: event.items.filter(isSource) } : null;
    case 'done':
      return { type: 'done', stopReason: String(event.stopReason ?? '') };
    case 'error':
      return { type: 'error', message: typeof event.message === 'string' && event.message ? event.message : failedAnswer };
    default:
      return null;
  }
}

// One server-sent event: "data:" lines joined by newlines; comments and unknown shapes are ignored.
export function parseEvent(block: string): ChatEvent | null {
  const data = block.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(line.startsWith('data: ') ? 6 : 5)).join('\n');
  if (!data) return null;
  try { return toEvent(JSON.parse(data)); } catch { return null; }
}

export async function* readEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<ChatEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = done ? '' : blocks.pop() ?? '';
      for (const block of blocks) {
        const event = parseEvent(block);
        if (event) yield event;
      }
      if (done) return;
    }
  } finally {
    // Stops the download when the reader leaves early (done event, stop button); a finished or failed stream ignores it.
    reader.cancel().catch(() => undefined);
  }
}

export async function* chat(messages: ChatMessage[], page: PageContext, signal: AbortSignal, location?: SharedLocation): AsyncGenerator<ChatEvent> {
  const response = await call('chat', { method: 'POST', headers: { ...jsonHeaders, Accept: 'text/event-stream' }, body: JSON.stringify(location ? { messages, page, location } : { messages, page }), signal });
  if (!response.ok || !response.body) throw await failure(response);
  yield* readEvents(response.body);
}
