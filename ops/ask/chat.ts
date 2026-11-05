import Anthropic from '@anthropic-ai/sdk';
import type { AskConfig } from './config.ts';
import type { Corpus } from './corpus.ts';
import { INSTRUCTIONS, dynamicContext, type PageContext } from './prompt.ts';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  page: PageContext;
}

export type ChatEvent =
  | { type: 'status'; text: string }
  | { type: 'text'; text: string }
  | { type: 'sources'; items: { url: string; title: string }[] }
  | { type: 'done'; stopReason: string }
  | { type: 'error'; message: string };

const MODEL = 'claude-haiku-5-5';
const MAX_TOKENS = 16_000;
const MAX_CONTINUATIONS = 2;
const MAX_SOURCES = 8;
const LIMITS = { messages: 40, user: 4000, assistant: 20_000, total: 60_000, path: 300, title: 300, detail: 500 };

const INVALID = 'Format permintaan tidak valid.';
const BUSY = 'AI sedang sibuk, coba lagi sebentar.';
const NOT_CONFIGURED = 'Layanan AI belum dikonfigurasi dengan benar.';
const CONNECTION = 'Koneksi ke layanan AI terputus. Coba lagi sebentar.';
const FAILED = 'Maaf, terjadi kesalahan saat menjawab. Coba lagi sebentar.';
const SEARCHING = 'Mencari di web…';
const REFUSED = 'Maaf, aku tidak bisa membantu pertanyaan itu. Coba tanyakan dengan cara lain.';
const STOP_NOTES: Record<string, string> = {
  max_tokens: 'Jawabannya terpotong karena terlalu panjang. Ketik "lanjut" untuk sambungannya.',
  pause_turn: 'Pencarian web belum selesai. Coba tanyakan lagi sebentar lagi.',
  model_context_window_exceeded: 'Percakapan sudah terlalu panjang. Mulai percakapan baru, ya.',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parsePage(value: unknown): PageContext | undefined {
  if (!isRecord(value)) return undefined;
  const { path, title, detail } = value;
  if (typeof path !== 'string' || !path.startsWith('/') || path.length > LIMITS.path) return undefined;
  if (typeof title !== 'string' || title.length > LIMITS.title) return undefined;
  if (detail !== undefined && (typeof detail !== 'string' || detail.length > LIMITS.detail)) return undefined;
  return detail ? { path, title, detail } : { path, title };
}

/** Returns the request, or an Indonesian error message for a 400 response. */
export function parseChatRequest(body: unknown): ChatRequest | string {
  if (!isRecord(body) || !Array.isArray(body.messages)) return INVALID;
  const page = parsePage(body.page);
  if (!page) return INVALID;
  const raw: unknown[] = body.messages;
  if (!raw.length || raw.length % 2 === 0) return INVALID; // alternating, starting and ending with "user"
  if (raw.length > LIMITS.messages) return 'Percakapan terlalu panjang. Mulai percakapan baru, ya.';
  const messages: ChatMessage[] = [];
  let total = 0;
  for (const [index, item] of raw.entries()) {
    const role = index % 2 === 0 ? 'user' : 'assistant';
    if (!isRecord(item) || item.role !== role || typeof item.content !== 'string') return INVALID;
    const content = item.content;
    if (role === 'user' && !content.trim()) return INVALID;
    if (content.length > LIMITS[role]) return role === 'user' ? 'Pertanyaan terlalu panjang (maksimal 4.000 karakter).' : INVALID;
    total += content.length;
    // An empty earlier answer (for example after an error) would make the API reject the whole conversation.
    messages.push({ role, content: content.trim() ? content : '(tidak ada jawaban)' });
  }
  if (total > LIMITS.total) return 'Percakapan terlalu panjang. Mulai percakapan baru, ya.';
  return { messages, page };
}

function failureMessage(error: unknown): string {
  if (error instanceof Anthropic.RateLimitError || error instanceof Anthropic.InternalServerError) return BUSY;
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) return NOT_CONFIGURED;
  if (error instanceof Anthropic.APIConnectionError) return CONNECTION; // includes timeouts
  // Errors sent inside an already-open stream carry no HTTP status, only the error type.
  if (error instanceof Anthropic.APIError && error.status === undefined
    && (error.type === 'overloaded_error' || error.type === 'rate_limit_error' || error.type === 'api_error')) return BUSY;
  return FAILED;
}

function logFailure(error: unknown): void {
  if (error instanceof Anthropic.APIError) {
    console.error(`ask: chat failed ${error.constructor.name} status=${error.status ?? '-'} type=${error.type ?? '-'} request=${error.requestID ?? '-'} message=${JSON.stringify(error.apiMessage ?? error.message)}`);
  } else {
    console.error(`ask: chat failed ${error instanceof Error ? `${error.name}: ${error.message}` : String(error)}`);
  }
}

function collectSources(message: Anthropic.Message, sources: Map<string, string>): void {
  for (const block of message.content) {
    if (block.type !== 'text') continue;
    for (const citation of block.citations ?? []) {
      if (citation.type !== 'web_search_result_location' || !/^https?:\/\//i.test(citation.url)) continue;
      if (!sources.has(citation.url)) sources.set(citation.url, citation.title || citation.url);
    }
  }
}

export type ChatRunner = (request: ChatRequest, corpus: Corpus, send: (event: ChatEvent) => void, signal: AbortSignal) => Promise<void>;

export function createChat(config: AskConfig): ChatRunner {
  const client = new Anthropic({ apiKey: config.apiKey, maxRetries: 2, timeout: 120_000 });
  // Checked 5 Nov 2026 at https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool:
  // claude-haiku-5-5 is in the tool's supportedModels. web_search_20260209/20260318 add dynamic filtering
  // ("Claude 4.6 and later models", run through code execution); web_search_20250305 is basic search that
  // every listed model and platform accepts. Basic search keeps the stream to plain server_tool_use /
  // web_search_tool_result blocks, which is all this endpoint streams and parses.
  const tools: Anthropic.ToolUnion[] = config.webSearchMaxUses > 0
    ? [{
      type: 'web_search_20250305',
      name: 'web_search',
      max_uses: config.webSearchMaxUses,
      user_location: { type: 'approximate', country: 'CN', timezone: 'Asia/Shanghai' },
    }]
    : [];

  return async (request, corpus, send, signal) => {
    const started = Date.now();
    const usage = { input: 0, cacheRead: 0, cacheWrite: 0, output: 0, searches: 0 };
    const sources = new Map<string, string>();
    const system: Anthropic.TextBlockParam[] = [
      { type: 'text', text: `${corpus.text}\n\n${INSTRUCTIONS}`, cache_control: { type: 'ephemeral', ttl: '1h' } },
      { type: 'text', text: dynamicContext(request.page, corpus.urls) },
    ];
    let messages: Anthropic.MessageParam[] = request.messages.map(message => ({ role: message.role, content: message.content }));
    let stopReason = 'unknown';
    let wroteText = false;
    // Text after a web search is a new text block; without a break it runs into the sentence before the search.
    let breakBeforeText = false;
    try {
      for (let turn = 0; turn <= MAX_CONTINUATIONS; turn++) {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          output_config: { effort: 'medium' },
          system,
          messages,
          ...(tools.length ? { tools } : {}),
        }, { signal });
        for await (const event of stream) {
          if (event.type === 'content_block_start' && event.content_block.type !== 'text') {
            // Consecutive text blocks (split by citations) join as they are; any other block between them is a break.
            breakBeforeText ||= wroteText;
            if (event.content_block.type === 'server_tool_use' && event.content_block.name === 'web_search') send({ type: 'status', text: SEARCHING });
          } else if (event.type === 'content_block_delta' && event.delta.type === 'text_delta' && event.delta.text) {
            send({ type: 'text', text: breakBeforeText ? `\n\n${event.delta.text}` : event.delta.text });
            wroteText = true;
            breakBeforeText = false;
          }
        }
        const message = await stream.finalMessage();
        usage.input += message.usage.input_tokens;
        usage.cacheRead += message.usage.cache_read_input_tokens ?? 0;
        usage.cacheWrite += message.usage.cache_creation_input_tokens ?? 0;
        usage.output += message.usage.output_tokens;
        usage.searches += message.usage.server_tool_use?.web_search_requests ?? 0;
        collectSources(message, sources);
        stopReason = message.stop_reason ?? 'unknown';
        if (stopReason === 'refusal') {
          // A refusal can come mid-answer; an error event makes the client drop the partial text instead of keeping it.
          send({ type: 'error', message: REFUSED });
          return;
        }
        if (stopReason !== 'pause_turn') break;
        // The API resumes a paused server-tool turn when the paused assistant content is sent back unchanged.
        messages = [...messages, { role: 'assistant', content: message.content }];
      }
      const note = STOP_NOTES[stopReason];
      if (note) send({ type: 'text', text: wroteText ? `\n\n${note}` : note });
      if (sources.size) {
        send({ type: 'sources', items: [...sources].slice(0, MAX_SOURCES).map(([url, title]) => ({ url, title })) });
      }
      send({ type: 'done', stopReason });
    } catch (error) {
      if (signal.aborted) {
        stopReason = 'client_closed';
      } else {
        stopReason = 'error';
        logFailure(error);
        send({ type: 'error', message: failureMessage(error) });
      }
    } finally {
      console.log(`ask: chat ms=${Date.now() - started} stop=${stopReason} input=${usage.input} cache_read=${usage.cacheRead} cache_write=${usage.cacheWrite} output=${usage.output} searches=${usage.searches} corpus_chars=${corpus.text.length}`);
    }
  };
}
