const EXCHANGE_ENDPOINT = 'https://api.frankfurter.dev/v2/providers/ecb/rate/CNY/IDR';
const ECB_SOURCE = 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html';
const REQUEST_TIMEOUT_MS = 10_000;
const MAXIMUM_RATE = 1_000_000;
const CNY_AMOUNT_PATTERN = /\bCNY\s+(\d+(?:[.,]\d{1,2})?)(?:\s*([–—-])\s*(?:CNY\s+)?(\d+(?:[.,]\d{1,2})?))?(?![\w]|[.,]\d|[–—-]\s*\d)/g;

interface ExchangeRate {
  date: string;
  rate: number;
}

interface CurrencyMatch {
  index: number;
  original: string;
  amount: number;
  maximum?: number;
}

type ExchangeState = 'snapshot' | 'loading' | 'ready' | 'fallback';

// Verified against the ECB publication; provenance is recorded in source/currency-rate.json.
let currentRate: ExchangeRate = { date: '2026-11-02', rate: 2727.94 };
let exchangeState: ExchangeState = 'snapshot';
let updateRequest: Promise<void> | undefined;
const numberFormatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric',
});

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]!));
}

function currencyMatches(text: string): CurrencyMatch[] {
  return Array.from(text.matchAll(CNY_AMOUNT_PATTERN)).flatMap(match => {
    const amount = Number(match[1].replace(',', '.'));
    const maximum = match[3] === undefined ? undefined : Number(match[3].replace(',', '.'));
    const values = maximum === undefined ? [amount] : [amount, maximum];
    if (values.some(value => !Number.isFinite(value) || value < 0
      || value > Number.MAX_SAFE_INTEGER / MAXIMUM_RATE)
      || (maximum !== undefined && maximum < amount)) return [];
    return [{ index: match.index, original: match[0], amount, maximum }];
  });
}

function rupiah(amount: number): string {
  return `Rp${numberFormatter.format(Math.round(amount * currentRate.rate))}`;
}

function conversionText(amount: number, maximum?: number): string {
  return `(≈ ${rupiah(amount)}${maximum === undefined ? '' : `–${rupiah(maximum)}`})`;
}

export function hasCnyAmount(text: string): boolean {
  return currencyMatches(text).length > 0;
}

export function currencyText(text: string): string {
  let result = '';
  let cursor = 0;
  for (const match of currencyMatches(text)) {
    result += escapeHtml(text.slice(cursor, match.index));
    result += `${escapeHtml(match.original)} <span class="currency-estimate" data-cny-amount="${match.amount}"${match.maximum === undefined ? '' : ` data-cny-maximum="${match.maximum}"`}>${conversionText(match.amount, match.maximum)}</span>`;
    cursor = match.index + match.original.length;
  }
  return result + escapeHtml(text.slice(cursor));
}

function exchangeSummary(): string {
  return `1 CNY ≈ ${rupiah(1)} · kurs ${dateFormatter.format(new Date(`${currentRate.date}T00:00:00Z`))}`;
}

function statusText(): string {
  if (exchangeState === 'loading') return 'Memeriksa kurs terbaru…';
  if (exchangeState === 'ready') return 'Kurs referensi terbaru dimuat.';
  if (exchangeState === 'fallback') return 'Kurs terbaru belum bisa dimuat; memakai kurs tersimpan.';
  return 'Menggunakan kurs tersimpan.';
}

export function renderExchangeRate(): string {
  return `<aside class="exchange-rate" data-exchange-rate data-exchange-state="${exchangeState}" aria-label="Kurs perkiraan rupiah">
    <p class="exchange-summary" data-exchange-summary>${escapeHtml(exchangeSummary())}</p>
    <p class="exchange-source">Perkiraan dihitung dari kurs referensi <a href="${ECB_SOURCE}" target="_blank" rel="noopener noreferrer">ECB</a> melalui <a href="https://frankfurter.dev/" target="_blank" rel="noopener noreferrer">Frankfurter</a>. Kurs pembayaran dapat berbeda.</p>
    <p class="exchange-status" data-exchange-status role="status" aria-live="polite" aria-atomic="true">${statusText()}</p>
  </aside>`;
}

function parseExchangeRate(value: unknown): ExchangeRate {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('invalid-rate');
  const data = value as Record<string, unknown>;
  if (data.base !== 'CNY' || data.quote !== 'IDR'
    || typeof data.rate !== 'number' || !Number.isFinite(data.rate)
    || data.rate <= 0 || data.rate > MAXIMUM_RATE
    || typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    throw new Error('invalid-rate');
  }
  const date = new Date(`${data.date}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== data.date
    || data.date > new Date().toISOString().slice(0, 10) || data.date < currentRate.date) {
    throw new Error('invalid-rate-date');
  }
  return { date: data.date, rate: data.rate };
}

async function fetchExchangeRate(): Promise<void> {
  exchangeState = 'loading';
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(EXCHANGE_ENDPOINT, {
      signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer',
    });
    if (!response.ok) throw new Error('rate-request-failed');
    currentRate = parseExchangeRate(await response.json());
    exchangeState = 'ready';
  } catch {
    // Keep the verified, dated rate available when the provider cannot be used.
    exchangeState = 'fallback';
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

function matchingElements(root: ParentNode, selector: string): HTMLElement[] {
  const elements = Array.from(root.querySelectorAll<HTMLElement>(selector));
  if (root instanceof HTMLElement && root.matches(selector)) elements.unshift(root);
  return elements;
}

function updateCurrency(root: ParentNode): void {
  for (const element of matchingElements(root, '[data-cny-amount]')) {
    const amountText = element.dataset.cnyAmount;
    const maximumText = element.dataset.cnyMaximum;
    if (!amountText || (maximumText !== undefined && !maximumText)) continue;
    const amount = Number(amountText);
    const maximum = maximumText === undefined ? undefined : Number(maximumText);
    const values = maximum === undefined ? [amount] : [amount, maximum];
    if (values.some(value => !Number.isFinite(value) || value < 0
      || value > Number.MAX_SAFE_INTEGER / MAXIMUM_RATE)
      || (maximum !== undefined && maximum < amount)) continue;
    element.textContent = conversionText(amount, maximum);
  }
  for (const annotation of matchingElements(root, '[data-exchange-rate]')) {
    annotation.dataset.exchangeState = exchangeState;
    const summary = annotation.querySelector<HTMLElement>('[data-exchange-summary]');
    const status = annotation.querySelector<HTMLElement>('[data-exchange-status]');
    if (summary) summary.textContent = exchangeSummary();
    if (status) status.textContent = statusText();
  }
}

export function initializeCurrency(root: ParentNode = document): void {
  if (matchingElements(root, '[data-cny-amount], [data-exchange-rate]').length === 0) return;
  updateRequest ??= fetchExchangeRate();
  updateCurrency(root);
  void updateRequest.then(() => updateCurrency(root));
}
