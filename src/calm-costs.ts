import { bookingLine, stayLine, type CostLine, type CostPlan } from './costs.ts';
import type { Booking } from './bookings.ts';
import { dayBookings } from './render.ts';
import { calmBookingGroups, calmDays, calmItineraryPath, type CalmBooking } from './calm-route.ts';
import { calmStayBases, calmStaysPath } from './calm-stays.ts';

export const calmCostsPath = '/places/calm-costs/';

// The main plan's own transport and ticket rows for the dates the two plans share (8 and 18–21 November): the same rows
// its day panels list, and the set the calm preparation page shows.
// The main plan's Lijiang driver also meets its 13.40 train on 18 November; the calm option arrives at 20.15 by taxi, so it
// keeps only the 19 November day.
const lijiangDriver = (item: Booking): Booking => item.tripDate === '2026-11-18' && item.until === '2026-11-19' && item.mode === 'car' ? {
  ...item, item: 'Mobil + sopir di Lijiang 19 November', tripDate: '2026-11-19', until: undefined,
  opens: 'Pesan sebelum 19 November; kirim jadwal 19 November dan nama hotel di kota tua. 18 November malam cukup taksi dari stasiun (C442 tiba 20.15).',
  note: item.note.replace(/^18 November:.*?(?=19 November:)/, '').replace('harga 18–19 November', 'harga 19 November'),
} : item;
export const calmSharedFor = (date: string) => dayBookings(date).map(lijiangDriver);
export const calmSharedBookings = [...new Set(calmDays.filter(day => day.fromMain).flatMap(day => dayBookings(day.date)))].map(lijiangDriver);

// A calm booking in the main plan's shape, so the same rules apply: shares by date, and the price text's own caveat as the note.
const asBooking = (item: CalmBooking): Booking => ({
  item: item.item, tripDate: item.date, until: item.until, urgency: item.urgency, channel: item.channel, opens: item.opens, note: item.price,
  mode: item.mode, cost: item.cost, link: item.link,
});

// Stays come night by night from calm-stays.ts, not from the stays booking cards; alternatives stay out of the totals.
export const calmCostLines: CostLine[] = [
  ...calmSharedBookings.map(item => bookingLine(item)),
  ...calmBookingGroups.filter(group => group.id !== 'stays').flatMap(group => group.items).filter(item => !item.alternative).map(item => bookingLine(asBooking(item))),
  ...calmStayBases.flatMap(base => base.nights.map(date => stayLine(base, date))),
];

export const calmCostPlan: CostPlan = { lines: calmCostLines, days: calmDays, staysPath: calmStaysPath, dayHref: date => `${calmItineraryPath}#${date}` };
