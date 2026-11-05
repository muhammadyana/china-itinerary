import { bookings, type Booking } from './bookings.ts';
import { cnyRange } from './costs.ts';
import { currencyText } from './currency.ts';
import { days } from './itinerary.ts';
import { escapeHtml as e, icon } from './render.ts';

// The overland legs from Bipenggou into Yunnan. Dates and prices come from each leg's booking, never from here.
export interface OverlandLeg {
  /** The `item` of the leg's booking in bookings.ts. */
  booking: string;
  /** Curated stops; each must be a route stop or overnight name of the booking's days in itinerary.ts. */
  stops: string[];
  /** Out and back on the same day. */
  roundTrip?: boolean;
  note?: string;
  transport: string;
  /** Read this leg's own fare (first capture group) from the booking note when the booking's range covers other legs or trains. */
  fare?: RegExp;
}

export const overlandLegs: OverlandLeg[] = [
  { booking: 'Mobil + sopir 11–12 November', stops: ['Bipenggou', 'Rilong', 'Danba', 'Moshi Park', 'Tagong', 'Xinduqiao'], transport: 'Mobil + sopir, 2 hari' },
  { booking: 'Mobil tumpangan Xinduqiao ↔ Kangding', stops: ['Xinduqiao', 'Kangding'], roundTrip: true, note: 'salat Jumat', transport: 'Mobil tumpangan' },
  { booking: 'Bus Xinduqiao → Litang', stops: ['Xinduqiao', 'Litang'], note: 'G318', transport: 'Bus' },
  { booking: 'Bus Litang → Daocheng / Yading', stops: ['Litang', 'Daocheng'], transport: 'Bus', fare: /CNY (\d+) ke Daocheng/ },
  { booking: 'Taksi atau mobil tumpangan Daocheng → Riwa', stops: ['Daocheng', 'Riwa'], transport: 'Taksi / mobil tumpangan' },
  { booking: 'Mobil listrik Chonggu ↔ Luorong (Yading)', stops: ['Yading'], transport: 'Bus taman (sudah termasuk tiket) + mobil listrik' },
  { booking: 'Taksi Riwa → Xiangcheng', stops: ['Riwa', 'Xiangcheng'], transport: 'Taksi' },
  { booking: 'Bus Xiangcheng → Shangri-La', stops: ['Xiangcheng', 'Shangri-La'], note: 'masuk Yunnan', transport: 'Bus, sekitar 5 jam' },
  { booking: 'Kereta Shangri-La → Lijiang', stops: ['Shangri-La', 'Lijiang'], transport: 'Kereta C984', fare: /C984[^()]*\(CNY (\d+)\)/ },
];

const columns = ['Tanggal', 'Rute', 'Transport', 'Harga'];
const dayNumber = (date: string) => Number(date.slice(-2));

// Renamed bookings or itinerary stops throw here, so the Node prerender fails instead of the table drifting.
function legBooking(leg: OverlandLeg): Booking {
  const booking = bookings.find(item => item.item === leg.booking);
  if (!booking) throw new Error(`overland.ts: no booking named "${leg.booking}" in bookings.ts`);
  const last = booking.until ?? booking.tripDate;
  const known = days.filter(day => day.date >= booking.tripDate && day.date <= last).flatMap(day => [...day.route, day.overnight?.name ?? '']);
  const unknown = leg.stops.filter(stop => !known.includes(stop));
  if (unknown.length) throw new Error(`overland.ts: ${unknown.join(', ')} not on the ${booking.tripDate} route in itinerary.ts`);
  return booking;
}

// The leg's own fare as its booking note states it, e.g. "C984 12.00, tiba 13.40 (CNY 63)" or "CNY 82 ke Daocheng".
function legCost(leg: OverlandLeg, booking: Booking): Booking['cost'] {
  if (!leg.fare || !booking.cost) return booking.cost;
  const fare = booking.note.match(leg.fare)?.[1];
  if (!fare) throw new Error(`overland.ts: no fare matching ${leg.fare} in the note of "${booking.item}"`);
  return { min: Number(fare), max: Number(fare), per: booking.cost.per };
}

const dateLabel = (booking: Booking) => `${dayNumber(booking.tripDate)}${booking.until ? `–${dayNumber(booking.until)}` : ''} Nov`;
const dateLink = (booking: Booking) => `<a class="text-link" href="#${e(booking.tripDate)}" data-date="${e(booking.tripDate)}">${e(dateLabel(booking))}${icon('right')}</a>`;
const routeText = (leg: OverlandLeg) => `${e(leg.stops.join(leg.roundTrip ? ' ↔ ' : ' → '))}${leg.note ? ` <span class="overland-note">(${e(leg.note)})</span>` : ''}`;

function priceText(cost: Booking['cost']) {
  if (!cost) return '<span class="overland-missing">Harga belum ada</span>';
  return `<span class="overland-price">${currencyText(cnyRange(cost))}<span class="overland-per">per ${e(cost.per)}</span></span>`;
}

// Explicit roles keep the table semantics that the phone layout's display: block would otherwise drop.
function overlandRow(leg: OverlandLeg) {
  const booking = legBooking(leg);
  return `<tr role="row"><th scope="row" role="rowheader">${dateLink(booking)}</th><td role="cell" class="overland-route">${routeText(leg)}</td><td role="cell" class="overland-transport">${e(leg.transport)}</td><td role="cell">${priceText(legCost(leg, booking))}</td></tr>`;
}

const columnHeader = (label: string) => `<th scope="col" role="columnheader">${e(label)}</th>`;

function overlandTable() {
  return `<table class="overland-table" role="table"><caption class="visually-hidden">Jalur darat per tanggal, dengan rute, transport, dan harga</caption><thead role="rowgroup"><tr role="row">${columns.map(columnHeader).join('')}</tr></thead><tbody role="rowgroup">${overlandLegs.map(overlandRow).join('')}</tbody></table>`;
}

export function renderOverland() {
  return `<section class="overland" id="overland" aria-labelledby="overland-heading"><h2 id="overland-heading">Jalur darat Sichuan ke Yunnan</h2><p class="overland-lead">Dari Bipenggou ke Yunnan kamu lewat darat dengan kendaraan yang berganti-ganti: mobil sewa dengan sopir lebih dulu, lalu bus dan mobil tumpangan, dan kereta baru dipakai dari Shangri-La.</p>${overlandTable()}<p class="overland-foot">Tiket bus Litang dan Xiangcheng dibeli di terminal pada hari keberangkatan, dengan paspor. Bus 14 November datang dari Danba (08.00) atau Chengdu (06.30) dan hanya lewat Xinduqiao, jadi sehari sebelumnya tanyakan ke hotel atau terminal jam bus itu lewat.</p></section>`;
}
