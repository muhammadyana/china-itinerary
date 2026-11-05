import { bookings, type Booking } from './bookings.ts';
import { stayBases, stayNights, staysPath, type Stay, type StayBase } from './stays.ts';

export const costsPath = '/places/costs/';

// The friend joins in Shangri-La on 17 November: private rooms from that night on, and cars and taxis from 18 November, are split two ways.
export const sharedFrom = '2026-11-17';

export interface Range { min: number; max: number }
export type CostCategory = 'transit' | 'tickets' | 'cars' | 'stays';
export interface CostLine {
  date: string; until?: string; label: string; category: CostCategory; basis: string;
  /** Your share in whole CNY, rounded once per line; missing when no price was found. */
  cost?: Range;
  /** The friend pays the same amount on this line. */
  withFriend: boolean;
  note?: string; booking?: Booking; base?: StayBase;
}

export const costCategories: { id: CostCategory; label: string }[] = [
  { id: 'transit', label: 'Kereta & bus' },
  { id: 'tickets', label: 'Tiket masuk & pertunjukan' },
  { id: 'cars', label: 'Mobil & taksi' },
  { id: 'stays', label: 'Penginapan' },
];

// The traveller's Trip.com checkout for C5746 on 9 November (second class, one adult), seen 4 November 2026.
export const tripcomFee = { date: '2026-11-09', ticket: 'Rp388.587', fee: 'Rp54.433', total: 'Rp443.020' };

const priceRange = (text: string) => {
  const amounts = [...text.matchAll(/\d+/g)].map(match => Number(match[0]));
  return { min: Math.min(...amounts), max: Math.max(...amounts) };
};
const share = (value: Range, people: number) => ({ min: Math.round(value.min / people), max: Math.round(value.max / people) });
const nightShare = (stay: Stay, date: string) => share(priceRange(stay.price), date >= sharedFrom && stay.room === 'Kamar privat' ? 2 : 1);
const sentences = (text: string) => text.split(/(?<=\.)\s+/);

const category = (item: Booking): CostCategory => !item.mode ? 'tickets' : item.mode === 'car' || item.mode === 'taxi' ? 'cars' : 'transit';

export function bookingLine(item: Booking): CostLine {
  const people = item.cost?.per === 'mobil' && item.tripDate > sharedFrom ? 2 : 1;
  // The checkout was seen for the main plan's own 9 November train; the calm option's C5772 shows its own caveat instead.
  const fee = bookings.includes(item) && item.mode === 'train' && item.tripDate === tripcomFee.date
    ? `Halaman pembayaran Trip.com untuk C5746 kelas dua, dilihat 4 November: tiket ${tripcomFee.ticket} ditambah biaya pemesanan ${tripcomFee.fee}, total ${tripcomFee.total}.` : undefined;
  // The note's own sentence about a missing or unsure fare, priced or not; an unpriced line without one points to where to book.
  const caveat = sentences(item.note).find(sentence => /\bbelum\b/.test(sentence)) ?? (item.cost ? undefined : sentences(item.channel)[0]);
  return {
    date: item.tripDate, until: item.until, label: item.item, category: category(item),
    basis: !item.cost ? '' : people === 2 ? 'per mobil dibagi dua' : `per ${item.cost.per}`,
    cost: item.cost && share(item.cost, people), withFriend: item.tripDate > sharedFrom, note: fee ?? caveat, booking: item,
  };
}

// A night spans the cheaper pick's lowest rate to the dearer pick's highest rate.
export function stayLine(base: StayBase, date: string): CostLine {
  const [hotel, hostel] = [nightShare(base.hotel, date), nightShare(base.hostel, date)];
  const split = date >= sharedFrom && [base.hotel, base.hostel].some(stay => stay.room === 'Kamar privat');
  return {
    date, label: `Menginap di ${base.name}`, category: 'stays', basis: split ? 'per malam, kamar dibagi dua' : 'per malam',
    cost: { min: Math.min(hotel.min, hostel.min), max: Math.max(hotel.max, hostel.max) }, withFriend: date >= sharedFrom,
    note: `${base.hotel.name} atau ${base.hostel.name}`, base,
  };
}

// The "Hotel 13 malam" checklist row is the stays page itself; its nights are priced one by one from stays.ts.
export const costLines: CostLine[] = [
  ...bookings.filter(item => item.link?.url !== staysPath).map(bookingLine),
  ...stayBases.flatMap(base => stayNights(base).map(day => stayLine(base, day.date))),
];

export const sumLines = (lines: CostLine[]): Range => lines.reduce((total, line) => line.cost ? { min: total.min + line.cost.min, max: total.max + line.cost.max } : total, { min: 0, max: 0 });

// currencyText() reads plain digits, so CNY amounts carry no thousands separator.
export const cnyRange = (value: Range) => value.min === value.max ? `CNY ${value.min}` : `CNY ${value.min}–${value.max}`;

// Each helper takes a plan's lines and defaults to the main plan's.
// Your share of all nights.
export const stayTotal = (lines = costLines) => sumLines(lines.filter(line => line.category === 'stays'));
// What the friend pays from Shangri-La on: Yunnan tickets, their room share and their half of each car or taxi.
export const friendShare = (lines = costLines) => sumLines(lines.filter(line => line.withFriend));

export const linesForDate = (date: string, lines = costLines) => lines.filter(line => line.date === date)
  .sort((a, b) => costCategories.findIndex(item => item.id === a.category) - costCategories.findIndex(item => item.id === b.category));
export const categoryTotals = (lines = costLines) => costCategories.map(item => ({ ...item, ...sumLines(lines.filter(line => line.category === item.id)) }));

/** One plan's breakdown: its lines and days, and where a night's stays card and a day's schedule live. */
export interface CostPlan { lines: CostLine[]; days: { date: string; shortTitle: string; overnight: object | null }[]; staysPath: string; dayHref: (date: string) => string }
