import { createSign } from 'node:crypto';

export interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

interface Token {
  accessToken: string;
  expiresAt: number;
}

const SHEETS = 'https://sheets.googleapis.com/v4/spreadsheets';
const DEFAULT_TOKEN_URI = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

export class SheetsError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}

export function parseServiceAccount(raw: unknown): ServiceAccount {
  if (!raw || typeof raw !== 'object') throw new SheetsError('sheet credentials must be a JSON object');
  const record = raw as Record<string, unknown>;
  const client_email = typeof record.client_email === 'string' ? record.client_email : '';
  const private_key = typeof record.private_key === 'string' ? record.private_key : '';
  if (!client_email || !private_key.includes('BEGIN')) throw new SheetsError('sheet credentials are missing client_email or private_key');
  const token_uri = typeof record.token_uri === 'string' && record.token_uri ? record.token_uri : undefined;
  return { client_email, private_key, token_uri };
}

function base64Url(data: Buffer | string): string {
  const buffer = typeof data === 'string' ? Buffer.from(data) : data;
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function signJwt(account: ServiceAccount): string {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(JSON.stringify({
    iss: account.client_email,
    scope: SCOPE,
    aud: account.token_uri || DEFAULT_TOKEN_URI,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  return `${unsigned}.${base64Url(signer.sign(account.private_key))}`;
}

export function createSheetsClient(account: ServiceAccount) {
  let cached: Token | undefined;

  async function accessToken(): Promise<string> {
    if (cached && cached.expiresAt > Date.now() + 30_000) return cached.accessToken;
    const body = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signJwt(account),
    });
    const response = await fetch(account.token_uri || DEFAULT_TOKEN_URI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const text = await response.text();
    if (!response.ok) throw new SheetsError(`token request failed (${response.status})`, response.status);
    const parsed = JSON.parse(text) as { access_token?: string; expires_in?: number };
    if (!parsed.access_token) throw new SheetsError('token response was missing access_token');
    cached = { accessToken: parsed.access_token, expiresAt: Date.now() + (parsed.expires_in ?? 3600) * 1000 };
    return cached.accessToken;
  }

  async function request(method: string, url: string, payload?: unknown): Promise<unknown> {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${await accessToken()}`,
        ...(payload !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    });
    const text = await response.text();
    if (!response.ok) throw new SheetsError(`Sheets API ${method} failed (${response.status})`, response.status);
    return text ? JSON.parse(text) : {};
  }

  return {
    getSpreadsheet(spreadsheetId: string): Promise<{ sheets?: Array<{ properties?: { sheetId?: number; title?: string } }> }> {
      const query = new URLSearchParams({ fields: 'sheets.properties(sheetId,title,hidden)' });
      return request('GET', `${SHEETS}/${encodeURIComponent(spreadsheetId)}?${query}`) as Promise<{
        sheets?: Array<{ properties?: { sheetId?: number; title?: string } }>;
      }>;
    },
    getValues(spreadsheetId: string, range: string, render: 'UNFORMATTED_VALUE' | 'FORMATTED_VALUE' | 'FORMULA'): Promise<unknown[][]> {
      const query = new URLSearchParams({ valueRenderOption: render, dateTimeRenderOption: 'SERIAL_NUMBER', majorDimension: 'ROWS' });
      return request('GET', `${SHEETS}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?${query}`).then(data => {
        const values = (data as { values?: unknown[][] }).values;
        return Array.isArray(values) ? values : [];
      });
    },
    updateValues(spreadsheetId: string, range: string, values: unknown[][], userEntered = false): Promise<void> {
      const query = new URLSearchParams({ valueInputOption: userEntered ? 'USER_ENTERED' : 'RAW' });
      return request('PUT', `${SHEETS}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?${query}`, {
        range,
        majorDimension: 'ROWS',
        values,
      }).then(() => undefined);
    },
    batchUpdate(spreadsheetId: string, requests: unknown[]): Promise<void> {
      if (requests.length === 0) return Promise.resolve();
      return request('POST', `${SHEETS}/${encodeURIComponent(spreadsheetId)}:batchUpdate`, { requests }).then(() => undefined);
    },
  };
}

export type SheetsClient = ReturnType<typeof createSheetsClient>;
