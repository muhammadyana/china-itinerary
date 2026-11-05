import { createHmac, scrypt, timingSafeEqual } from 'node:crypto';
import type { PasswordHash } from './config.ts';

export const SESSION_COOKIE = 'ask_session';
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const COOKIE_ATTRIBUTES = 'HttpOnly; Secure; SameSite=Strict; Path=/api/ask';
const MAX_PASSWORD_LENGTH = 1024;

export interface Auth {
  verifyPassword(password: string): Promise<boolean>;
  issueToken(nowSeconds?: number): string;
  isValidToken(token: string | undefined, nowSeconds?: number): boolean;
}

function scryptAsync(password: string, hash: PasswordHash): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, hash.salt, hash.hash.length, { N: hash.N, r: hash.r, p: hash.p, maxmem: 256 * hash.N * hash.r },
      (error, key) => error ? reject(error) : resolve(key));
  });
}

function base64url(buffer: Buffer): string {
  return buffer.toString('base64url');
}

export function createAuth(passwordHash: PasswordHash, sessionSecret: Buffer): Auth {
  // Bound to both secrets: rotating either the session secret or the password invalidates every session.
  const signingKey = createHmac('sha256', sessionSecret).update(`ask-session-v1\0${passwordHash.raw}`).digest();
  const sign = (expires: number): Buffer => createHmac('sha256', signingKey).update(String(expires)).digest();
  const now = (): number => Math.floor(Date.now() / 1000);

  return {
    async verifyPassword(password) {
      if (!password || password.length > MAX_PASSWORD_LENGTH) return false;
      const candidate = await scryptAsync(password, passwordHash);
      return timingSafeEqual(candidate, passwordHash.hash);
    },
    issueToken(nowSeconds = now()) {
      const expires = nowSeconds + SESSION_MAX_AGE_SECONDS;
      return `${expires}.${base64url(sign(expires))}`;
    },
    isValidToken(token, nowSeconds = now()) {
      const match = token?.match(/^(\d{1,12})\.([A-Za-z0-9_-]{43})$/);
      if (!match) return false;
      const expires = Number(match[1]);
      if (expires <= nowSeconds || expires > nowSeconds + SESSION_MAX_AGE_SECONDS) return false;
      const given = Buffer.from(match[2], 'base64url');
      const expected = sign(expires);
      return given.length === expected.length && timingSafeEqual(given, expected);
    },
  };
}

export function readSessionCookie(header: string | undefined): string | undefined {
  for (const part of (header ?? '').split(';')) {
    const [name, ...value] = part.trim().split('=');
    if (name === SESSION_COOKIE) return value.join('=');
  }
  return undefined;
}

export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; ${COOKIE_ATTRIBUTES}; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

export function expiredSessionCookie(): string {
  return `${SESSION_COOKIE}=; ${COOKIE_ATTRIBUTES}; Max-Age=0`;
}
