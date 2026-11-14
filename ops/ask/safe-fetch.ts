// Outbound HTTP for the assistant's tools: http(s) only, ports 80/443, every resolved address checked against
// private, loopback, link-local and other special ranges at connect time (so DNS rebinding cannot slip past),
// redirects followed by hand and re-checked per hop, a per-request timeout and capped response sizes.
import { request as httpRequest, type IncomingMessage, type RequestOptions } from 'node:http';
import { request as httpsRequest, type RequestOptions as HttpsRequestOptions } from 'node:https';
import { lookup as dnsLookup, type LookupAddress } from 'node:dns';
import { BlockList, isIP } from 'node:net';
import { createBrotliDecompress, createGunzip, createInflate } from 'node:zlib';
import type { Readable } from 'node:stream';

export interface FetchedResponse {
  url: string;
  status: number;
  contentType: string;
  body: Buffer;
  truncated: boolean;
}

export interface SafeFetchOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
  maxBytes?: number;
  maxRedirects?: number;
  headers?: Record<string, string>;
}

export class FetchError extends Error {}

const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_MAX_BYTES = 3 * 1024 * 1024;
const DEFAULT_MAX_REDIRECTS = 4;

const blocked = new BlockList();
for (const [network, prefix] of [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16], ['172.16.0.0', 12],
  ['192.0.0.0', 24], ['192.0.2.0', 24], ['192.88.99.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15],
  ['198.51.100.0', 24], ['203.0.113.0', 24], ['224.0.0.0', 4], ['240.0.0.0', 4],
] as const) blocked.addSubnet(network, prefix, 'ipv4');
for (const [network, prefix] of [
  ['::', 128], ['::1', 128], ['64:ff9b::', 96], ['64:ff9b:1::', 48], ['100::', 64], ['2001::', 23], ['2001:db8::', 32],
  ['2002::', 16], ['fc00::', 7], ['fe80::', 10], ['fec0::', 10], ['ff00::', 8],
] as const) blocked.addSubnet(network, prefix, 'ipv6');

/** True for any address a public-web fetch must never reach. */
export function isBlockedAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return blocked.check(address, 'ipv4');
  if (family !== 6) return true;
  const lower = address.toLowerCase();
  // IPv4-mapped (::ffff:a.b.c.d or ::ffff:hhhh:hhhh) and IPv4-compatible forms carry an IPv4 address to check.
  const mapped = lower.match(/^(?:0{0,4}:){0,5}(?:ffff:)?(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isBlockedAddress(mapped[1]);
  const hexMapped = lower.match(/^(?:0{0,4}:){0,5}ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hexMapped) {
    const high = parseInt(hexMapped[1], 16);
    const low = parseInt(hexMapped[2], 16);
    return isBlockedAddress(`${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`);
  }
  if (/^::ffff:/.test(lower) || /^::\d/.test(lower)) return true;
  return blocked.check(address, 'ipv6');
}

type LookupCallback = (error: NodeJS.ErrnoException | null, address: string | LookupAddress[], family?: number) => void;

// Passed to http(s).request as `lookup`: resolves, then refuses the host if any address is special.
function guardedLookup(hostname: string, options: { family?: number | string; all?: boolean }, callback: LookupCallback): void {
  const family = options.family === 'IPv4' ? 4 : options.family === 'IPv6' ? 6 : typeof options.family === 'number' ? options.family : 0;
  dnsLookup(hostname, { family, all: true, verbatim: true }, (error, addresses) => {
    if (error) return callback(error, '');
    const list = addresses as LookupAddress[];
    if (!list.length || list.some(entry => isBlockedAddress(entry.address))) {
      const refused: NodeJS.ErrnoException = new FetchError(`refused: ${hostname} resolves to a private or reserved address`);
      refused.code = 'EBLOCKED';
      return callback(refused, '');
    }
    if (options.all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
}

function checkUrl(raw: string | URL): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new FetchError('invalid URL');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new FetchError('only http and https URLs are allowed');
  if (url.username || url.password) throw new FetchError('URLs with credentials are not allowed');
  if (url.port && url.port !== '80' && url.port !== '443') throw new FetchError('only ports 80 and 443 are allowed');
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    throw new FetchError('local host names are not allowed');
  }
  // Literal IPs skip DNS (and so the guarded lookup); check them here.
  if (isIP(host) && isBlockedAddress(host)) throw new FetchError('private or reserved addresses are not allowed');
  return url;
}

function decoded(response: IncomingMessage): Readable {
  const encoding = String(response.headers['content-encoding'] ?? '').trim().toLowerCase();
  if (encoding === 'gzip' || encoding === 'x-gzip') return response.pipe(createGunzip());
  if (encoding === 'deflate') return response.pipe(createInflate());
  if (encoding === 'br') return response.pipe(createBrotliDecompress());
  return response;
}

function once(url: URL, options: SafeFetchOptions, signal: AbortSignal, maxBytes: number): Promise<{ response: IncomingMessage; body?: Buffer; truncated: boolean }> {
  return new Promise((resolve, reject) => {
    const requestOptions: RequestOptions = {
      method: 'GET',
      headers: { 'Accept-Encoding': 'gzip, deflate, br', ...options.headers },
      lookup: guardedLookup as unknown as RequestOptions['lookup'],
      signal,
    };
    // Offer ALPN like browsers and undici do; some bot filters (Ctrip's) send TLS clients without it to a captcha.
    const req = url.protocol === 'https:'
      ? httpsRequest(url, { ...requestOptions, ALPNProtocols: ['http/1.1'] } as HttpsRequestOptions, onResponse)
      : httpRequest(url, requestOptions, onResponse);
    function onResponse(response: IncomingMessage): void {
      const status = response.statusCode ?? 0;
      if (status >= 300 && status < 400 && response.headers.location) {
        response.resume();
        resolve({ response, truncated: false });
        return;
      }
      const chunks: Buffer[] = [];
      let size = 0;
      let truncated = false;
      const stream = decoded(response);
      const finish = () => resolve({ response, body: Buffer.concat(chunks), truncated });
      stream.on('data', (chunk: Buffer) => {
        if (truncated) return;
        size += chunk.length;
        if (size > maxBytes) {
          chunks.push(chunk.subarray(0, chunk.length - (size - maxBytes)));
          truncated = true;
          response.destroy();
          finish();
          return;
        }
        chunks.push(chunk);
      });
      stream.on('end', finish);
      stream.on('error', error => (truncated ? undefined : reject(error)));
      response.on('error', error => (truncated ? undefined : reject(error)));
    }
    req.on('error', reject);
    req.end();
  });
}

/** GET a public URL. Throws FetchError (or a network error) on refusal, timeout or too many redirects. */
export async function safeFetch(raw: string | URL, options: SafeFetchOptions = {}): Promise<FetchedResponse> {
  const timeout = AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  let url = checkUrl(raw);
  for (let hop = 0; ; hop++) {
    let result;
    try {
      result = await once(url, options, signal, maxBytes);
    } catch (error) {
      if (timeout.aborted) throw new FetchError(`timed out after ${Math.round((options.timeoutMs ?? DEFAULT_TIMEOUT_MS) / 1000)} s`);
      throw error;
    }
    const { response, body, truncated } = result;
    if (!body) {
      if (hop >= (options.maxRedirects ?? DEFAULT_MAX_REDIRECTS)) throw new FetchError('too many redirects');
      url = checkUrl(new URL(String(response.headers.location), url));
      continue;
    }
    return { url: url.href, status: response.statusCode ?? 0, contentType: String(response.headers['content-type'] ?? ''), body, truncated };
  }
}

/** Decodes a body using the Content-Type charset or an HTML meta charset, falling back to UTF-8. */
export function decodeBody(body: Buffer, contentType: string): string {
  const declared = contentType.match(/charset=["']?([\w-]+)/i)?.[1]
    ?? body.subarray(0, 2048).toString('latin1').match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1];
  if (declared) {
    try {
      return new TextDecoder(declared.toLowerCase()).decode(body);
    } catch {
      // unknown label: fall through to UTF-8
    }
  }
  return new TextDecoder('utf-8').decode(body);
}

export async function fetchJson(url: string, options: SafeFetchOptions = {}): Promise<unknown> {
  const response = await safeFetch(url, { ...options, headers: { Accept: 'application/json', ...options.headers } });
  if (response.status < 200 || response.status >= 300) throw new FetchError(`HTTP ${response.status} from ${new URL(url).host}`);
  if (response.truncated) throw new FetchError('response too large');
  try {
    return JSON.parse(decodeBody(response.body, response.contentType));
  } catch {
    throw new FetchError(`invalid JSON from ${new URL(url).host}`);
  }
}
