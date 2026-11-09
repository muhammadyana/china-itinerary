import { bookingLine, stayLine, type CostLine, type CostPlan } from './costs.ts';
import type { Booking } from './bookings.ts';
import { dayBookings } from './render.ts';
import { calmBookingGroups, calmDays, calmItineraryPath, type CalmBooking } from './calm-route.ts';
import { calmStayBases, calmStaysPath } from './calm-stays.ts';

export const calmCostsPath = '/places/calm-costs/';

// The main plan's own transport and ticket rows for the date the two plans share (8 November): the same rows
// its day panels list, and the set the calm preparation page shows.
export const calmSharedFor = (date: string) => dayBookings(date);
export const calmSharedBookings = [...new Set(calmDays.filter(day => day.fromMain).flatMap(day => dayBookings(day.date)))];

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
