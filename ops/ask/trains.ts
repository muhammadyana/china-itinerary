// Live China rail timetable, fares and seat availability from Ctrip's train list page (the same inventory
// Trip.com sells). The page is a Next.js app whose server-rendered state sits in <script id="__NEXT_DATA__">.
import { decodeBody, FetchError, safeFetch } from './safe-fetch.ts';
import type { ToolOutput } from './tool-types.ts';

const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const MAX_ROWS = 40;
// Ctrip reports 99 for "plenty" (有票); smaller numbers are the exact seats left.
const PLENTY = 99;

interface Seat {
  seatName?: unknown;
  seatPrice?: unknown;
  price?: unknown;
  seatInventory?: unknown;
  inventory?: unknown;
  seatBookable?: unknown;
  bookable?: unknown;
  isHBSeat?: unknown;
}

interface TrainRow {
  trainNumber?: unknown;
  departureStationName?: unknown;
  departureTime?: unknown;
  arrivalStationName?: unknown;
  arrivalTime?: unknown;
  duration?: unknown;
  runTime?: unknown;
  takeDays?: unknown;
  isBookable?: unknown;
  isSaleStop?: unknown;
  seatItemInfoList?: unknown;
}

export interface TrainQuery {
  from: string;
  to: string;
  date: string;
  departAfter?: string;
  departBefore?: string;
}

const text = (value: unknown): string => (typeof value === 'string' ? value : typeof value === 'number' ? String(value) : '');
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function availability(seat: Seat): string {
  const count = Number(seat.seatInventory ?? seat.inventory ?? NaN);
  const bookable = seat.seatBookable === true || seat.bookable === true;
  if (Number.isFinite(count) && count > 0) return count >= PLENTY ? '有票 (banyak)' : `${count}张`;
  if (bookable) return '有票';
  return seat.isHBSeat === true ? '无票 (bisa 候补/waitlist)' : '无票';
}

function seatText(seat: Seat): string {
  const price = Number(seat.seatPrice ?? seat.price ?? NaN);
  return `${text(seat.seatName) || '?'} ${Number.isFinite(price) && price > 0 ? `¥${price}` : '¥?'} ${availability(seat)}`;
}

function durationText(row: TrainRow): string {
  const minutes = Number(row.runTime);
  if (Number.isFinite(minutes) && minutes > 0) return `${Math.floor(minutes / 60)}j${String(minutes % 60).padStart(2, '0')}m`;
  return text(row.duration);
}

function rowText(row: TrainRow): string {
  const days = Number(row.takeDays) > 0 ? ` (+${Number(row.takeDays)} hari)` : '';
  const seats = Array.isArray(row.seatItemInfoList) ? (row.seatItemInfoList as Seat[]).map(seatText).join('; ') : 'kursi ?';
  const status = row.isSaleStop === true ? ' [penjualan ditutup]' : row.isBookable === false ? ' [tidak bisa dipesan sekarang]' : '';
  return `${text(row.trainNumber)} ${text(row.departureStationName)} ${text(row.departureTime)} → ${text(row.arrivalStationName)} ${text(row.arrivalTime)}${days} (${durationText(row)})${status} | ${seats}`;
}

export function trainListUrl(from: string, to: string, date: string): string {
  const params = new URLSearchParams({ ticketType: '0', dStation: from, aStation: to, dDate: date });
  return `https://trains.ctrip.com/webapp/train/list?${params}`;
}

export function validateTrainQuery(input: Record<string, unknown>): TrainQuery | string {
  const from = typeof input.from === 'string' ? input.from.trim() : '';
  const to = typeof input.to === 'string' ? input.to.trim() : '';
  const date = typeof input.date === 'string' ? input.date.trim() : '';
  if (!from || !to || from.length > 30 || to.length > 30) return 'from and to must be station or city names (Chinese, e.g. 成都东, 大理).';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) return 'date must be YYYY-MM-DD.';
  const query: TrainQuery = { from, to, date };
  for (const [key, field] of [['depart_after', 'departAfter'], ['depart_before', 'departBefore']] as const) {
    const value = input[key];
    if (value === undefined || value === '') continue;
    if (typeof value !== 'string' || !TIME.test(value.trim())) return `${key} must be HH:MM (24-hour).`;
    query[field] = value.trim();
  }
  return query;
}

/** Parses the Ctrip list page HTML into compact lines; throws FetchError when the page has no train data. */
export function parseTrainPage(html: string, query: TrainQuery, url: string): string {
  const json = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  if (!json) throw new FetchError('Ctrip page had no train data (blocked or the page format changed)');
  let state: Record<string, unknown>;
  try {
    const data = JSON.parse(json) as { props?: { pageProps?: { initialState?: Record<string, unknown> } } };
    state = data.props?.pageProps?.initialState ?? {};
  } catch {
    throw new FetchError('Ctrip train data was not valid JSON');
  }
  const info = (state.trainSearchInfo ?? {}) as Record<string, unknown>;
  const header = [`Live dari Ctrip/Trip.com (dicek barusan): ${query.from} → ${query.to}, ${query.date}. Sumber: ${url}`];
  if (info.noMatchChineseDepart === true) header.push(`Stasiun/kota asal "${query.from}" tidak dikenali Ctrip; pakai nama Mandarin.`);
  if (info.noMatchChineseArrive === true) header.push(`Stasiun/kota tujuan "${query.to}" tidak dikenali Ctrip; pakai nama Mandarin.`);
  if (typeof state.dDate === 'string' && state.dDate && state.dDate !== query.date) header.push(`Perhatian: Ctrip menampilkan tanggal ${state.dDate}.`);
  const all = Array.isArray(info.trainInfoList) ? (info.trainInfoList as TrainRow[]) : [];
  const rows = all.filter(row => {
    const time = text(row.departureTime);
    if (query.departAfter && time < query.departAfter) return false;
    if (query.departBefore && time > query.departBefore) return false;
    return true;
  });
  if (!all.length) {
    header.push('Tidak ada kereta langsung yang ditemukan untuk rute dan tanggal ini (bisa juga di luar masa penjualan, biasanya 15 hari ke depan).');
    return header.join('\n');
  }
  const filter = query.departAfter || query.departBefore ? ` berangkat ${query.departAfter ?? '00:00'}–${query.departBefore ?? '23:59'}` : '';
  header.push(`${all.length} kereta total, ${rows.length} cocok${filter}${rows.length > MAX_ROWS ? `, ditampilkan ${MAX_ROWS} pertama (persempit dengan depart_after/depart_before)` : ''}.`);
  header.push('Kursi: "N张" = sisa N kursi, "有票" = masih ada (Ctrip menulis 99 untuk "banyak"), "无票" = habis. Ketersediaan berubah tiap menit dan tidak dijamin sampai checkout.');
  return [...header, '', ...rows.slice(0, MAX_ROWS).map(rowText)].join('\n');
}

export async function checkTrains(input: Record<string, unknown>, signal: AbortSignal): Promise<ToolOutput> {
  const query = validateTrainQuery(input);
  if (typeof query === 'string') return { content: query, isError: true };
  const url = trainListUrl(query.from, query.to, query.date);
  const response = await safeFetch(url, {
    signal,
    timeoutMs: 15_000,
    maxBytes: 6 * 1024 * 1024,
    headers: { 'User-Agent': MOBILE_UA, Accept: 'text/html', 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.5' },
  });
  if (response.status !== 200) throw new FetchError(`Ctrip answered HTTP ${response.status}`);
  if (response.truncated) throw new FetchError('Ctrip page too large');
  return {
    content: parseTrainPage(decodeBody(response.body, response.contentType), query, url),
    source: { url, title: `Ctrip kereta ${query.from} → ${query.to}, ${query.date}` },
  };
}
