import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export interface PasswordHash {
  N: number;
  r: number;
  p: number;
  salt: Buffer;
  hash: Buffer;
  raw: string;
}

export interface ExpensesConfig {
  passwordHash: PasswordHash;
  sessionSecret: Buffer;
  dataFile: string;
  host: string;
  port: number;
  origin: string;
  dev: boolean;
}

const DEFAULT_ORIGIN = 'https://china.muhammadyana.me';
const MIN_SESSION_SECRET_BYTES = 32;

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

export function parsePasswordHash(raw: string): PasswordHash {
  const parts = raw.split('$');
  const [scheme, n, r, p, salt, hash] = parts;
  const numbers = [n, r, p].map(Number);
  const [N, blockSize, parallel] = numbers;
  const base64 = /^[A-Za-z0-9+/]+={0,2}$/;
  if (parts.length !== 6 || scheme !== 'scrypt' || ![n, r, p].every(part => /^\d+$/.test(part))
    || N < 1024 || (N & (N - 1)) !== 0 || blockSize < 1 || parallel < 1 || !base64.test(salt) || !base64.test(hash)) {
    throw new ConfigError('EXPENSES_PASSWORD_HASH must look like scrypt$<N>$<r>$<p>$<salt base64>$<hash base64>');
  }
  const saltBytes = Buffer.from(salt, 'base64');
  const hashBytes = Buffer.from(hash, 'base64');
  if (saltBytes.length < 16 || hashBytes.length < 32) throw new ConfigError('EXPENSES_PASSWORD_HASH salt or hash is too short');
  return { N, r: blockSize, p: parallel, salt: saltBytes, hash: hashBytes, raw };
}

function parseOrigin(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ConfigError('EXPENSES_ORIGIN must be an origin such as https://china.muhammadyana.me');
  }
  if (url.origin !== value) throw new ConfigError('EXPENSES_ORIGIN must be an origin such as https://china.muhammadyana.me');
  return value;
}

function defaultDataFile(env: NodeJS.ProcessEnv): string {
  const explicit = env.EXPENSES_DATA_FILE?.trim();
  if (explicit) return resolve(explicit);
  const stateDir = env.STATE_DIRECTORY?.trim();
  if (stateDir) return resolve(stateDir, 'data.json');
  return resolve('ops/expenses/data/data.json');
}

function readConfig(env: NodeJS.ProcessEnv): ExpensesConfig {
  const secretHex = required(env, 'EXPENSES_SESSION_SECRET');
  if (!/^(?:[0-9a-fA-F]{2})+$/.test(secretHex) || secretHex.length < MIN_SESSION_SECRET_BYTES * 2) {
    throw new ConfigError(`EXPENSES_SESSION_SECRET must be hex, at least ${MIN_SESSION_SECRET_BYTES} bytes`);
  }
  const dataFile = defaultDataFile(env);
  mkdirSync(dirname(dataFile), { recursive: true });
  return {
    passwordHash: parsePasswordHash(required(env, 'EXPENSES_PASSWORD_HASH')),
    sessionSecret: Buffer.from(secretHex, 'hex'),
    dataFile,
    host: env.EXPENSES_HOST?.trim() || '127.0.0.1',
    port: integer(env, 'EXPENSES_PORT', 8791, 1, 65535),
    origin: parseOrigin(env.EXPENSES_ORIGIN?.trim() || DEFAULT_ORIGIN),
    dev: env.EXPENSES_DEV === '1',
  };
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ExpensesConfig {
  try {
    return readConfig(env);
  } catch (error) {
    if (!(error instanceof ConfigError)) throw error;
    console.error(`expenses: configuration error: ${error.message}`);
    process.exit(78);
  }
}
