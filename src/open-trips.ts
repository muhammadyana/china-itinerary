import type { Link } from './bookings.ts';

// Joinable group tours, day tours and bundled packages that touch a day's places, as seen on 4 November 2026.
// Shown beside the day's own transport so the traveller can compare; `fit` says plainly where a product clashes with the plan.
export interface OpenTrip { date: string; until?: string; name: string; platform: string; price: string; fit: string; link: Link }

export const openTrips: OpenTrip[] = [];

export const openTripsForDate = (date: string) => openTrips.filter(trip => trip.date <= date && date <= (trip.until ?? trip.date));
