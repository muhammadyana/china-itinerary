import { statSync } from 'node:fs';

export interface PasswordHash {
  N: number;
  r: number;
  p: number;
  salt: Buffer;
  hash: Buffer;
  raw: string;
}

export interface AskConfig {
  apiKey: string;
  passwordHash: PasswordHash;
  sessionSecret: Buffer;
  siteRoot: string;
  host: string;
  port: number;
  origin: string;
  webSearchMaxUses: number;
  dev: boolean;
}

const DEFAULT_SITE_ROOT = '/home/deploy/apps/china.muhammadyana.me/current/public';
const DEFAULT_ORIGIN = 'https://china.muhammadyana.me';
const MIN_SESSION_SECRET_BYTES = 32;
const MAX_WEB_SEARCH_USES = 10;

class ConfigError extends Error {}

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new ConfigError(`${name} is required`);
  return value;
}

function integer(env: NodeJS.ProcessEnv, name: string, fallback: number, min: number, max: number): number {
  const text = env[name]?.trim();
  if (!text) return fallback;
  const value = Number(text);
  if (!/^\d+$/.test(text) || value < min || value > max) throw new ConfigError(`${name} must be an integer from ${min} to ${max}`);
  return value;
}

// Format written by install.sh: scrypt$<N>$<r>$<p>$<salt base64>$<hash base64>.
export function parsePasswordHash(raw: string): PasswordHash {
  const parts = raw.split('$');
  const [scheme, n, r, p, salt, hash] = parts;
  const numbers = [n, r, p].map(Number);
  const [N, blockSize, parallel] = numbers;
  const base64 = /^[A-Za-z0-9+/]+={0,2}$/;
  if (parts.length !== 6 || scheme !== 'scrypt' || ![n, r, p].every(part => /^\d+$/.test(part))
    || N < 1024 || (N & (N - 1)) !== 0 || blockSize < 1 || parallel < 1 || !base64.test(salt) || !base64.test(hash)) {
    throw new ConfigError('ASK_PASSWORD_HASH must look like scrypt$<N>$<r>$<p>$<salt base64>$<hash base64>');
  }
  const saltBytes = Buffer.from(salt, 'base64');
  const hashBytes = Buffer.from(hash, 'base64');
  if (saltBytes.length < 16 || hashBytes.length < 32) throw new ConfigError('ASK_PASSWORD_HASH salt or hash is too short');
  return { N, r: blockSize, p: parallel, salt: saltBytes, hash: hashBytes, raw };
}

function parseOrigin(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ConfigError('ASK_ORIGIN must be an origin such as https://china.muhammadyana.me');
  }
  if (url.origin !== value) throw new ConfigError('ASK_ORIGIN must be an origin such as https://china.muhammadyana.me');
  return value;
}

function readConfig(env: NodeJS.ProcessEnv): AskConfig {
  const apiKey = required(env, 'ANTHROPIC_API_KEY');
  if (!apiKey.startsWith('sk-ant-')) throw new ConfigError('ANTHROPIC_API_KEY must start with sk-ant-');
  const secretHex = required(env, 'ASK_SESSION_SECRET');
  if (!/^(?:[0-9a-fA-F]{2})+$/.test(secretHex) || secretHex.length < MIN_SESSION_SECRET_BYTES * 2) {
    throw new ConfigError(`ASK_SESSION_SECRET must be hex, at least ${MIN_SESSION_SECRET_BYTES} bytes`);
  }
  const siteRoot = env.ASK_SITE_ROOT?.trim() || DEFAULT_SITE_ROOT;
  let isDirectory = false;
  try {
    isDirectory = statSync(siteRoot).isDirectory();
  } catch {
    isDirectory = false;
  }
  if (!isDirectory) throw new ConfigError(`ASK_SITE_ROOT is not a readable directory: ${siteRoot}`);
  return {
    apiKey,
    passwordHash: parsePasswordHash(required(env, 'ASK_PASSWORD_HASH')),
    sessionSecret: Buffer.from(secretHex, 'hex'),
    siteRoot,
    host: env.ASK_HOST?.trim() || '127.0.0.1',
    port: integer(env, 'ASK_PORT', 8790, 1, 65535),
    origin: parseOrigin(env.ASK_ORIGIN?.trim() || DEFAULT_ORIGIN),
    webSearchMaxUses: integer(env, 'ASK_WEB_SEARCH_MAX_USES', 3, 0, MAX_WEB_SEARCH_USES),
    dev: env.ASK_DEV === '1',
  };
}

// Exits the process with a clear message instead of starting half-configured.
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AskConfig {
  try {
    return readConfig(env);
  } catch (error) {
    if (!(error instanceof ConfigError)) throw error;
    console.error(`ask: configuration error: ${error.message}`);
    process.exit(78); // EX_CONFIG: systemd shows it as a configuration failure
  }
}
