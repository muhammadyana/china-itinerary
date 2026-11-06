import {
  escapeHtml as e, icon, siteCredit, renderPhotoDialog, pickerItems, timelineEvent, stopCard, daySchedule, dayBookings, dayBooking, bookingRow,
  transportSection, dayDateLine, dayTitleRow, sleepSummary, staysLink, transportSummary, dayRoute, stopsSection, practicalSection, nightDetail,
  pickDayButton, daySidebar, mobileDaybar, dayPickerDialog, copyDialog, statusMessage, openTripItem, costLabel, userGallery, type Overnight,
} from './render.ts';
import { currencyText } from './currency.ts';
import { openTripsForDate } from './open-trips.ts';
import { planSwitch, renderSiteNavigation } from './site-navigation.ts';
import { renderChengduEvening } from './chengdu-evening.ts';
import { daysByDate, type Day } from './itinerary.ts';
import { calmDays, calmGlance, calmItineraryPath, calmPlaces, calmPreparePath, calmPath, placeFor, type CalmDay, type CalmStop } from './calm-route.ts';
import { calmStayBaseForDate, calmStaysHref } from './calm-stays.ts';
import { calmDayBookings } from './calm-prepare.ts';
import { noteItem } from './calm-render.ts';

// Day-by-day view of the active santai plan. Every day is prerendered so the page reads in order without JavaScript;
// calm-itinerary-main.ts then shows one day at a time. `homeItineraryView` is bare `/`. `calmItineraryView` keeps
// `/places/calm-itinerary/` for older links. 8 and 18–21 November render the main plan's own day (timeline, bookings,
// stops, practical notes) through the shared day components, so those days cannot drift apart.

const keyFor = (date: string) => `-${date}`;
const mainDay = (day: CalmDay): Day | undefined => day.fromMain ? daysByDate.get(day.date) : undefined;

// Every night, shared ones included, links to its section on the calm stays page so the reader stays in the calm option.
const bookedHotel = (day: CalmDay) => {
  const base = calmStayBaseForDate(day.date);
  return base?.booked ? base.hotel.name : undefined;
};
const stayLinks = (day: CalmDay) => day.overnight ? staysLink(calmStaysHref(day.date), bookedHotel(day) ? 'Detail hotel yang dipesan' : 'Rekomendasi hotel & hostel santai') : '';

// The calm data names the base, not its area; the calm stays page describes it.
function overnightFor(day: CalmDay): Overnight | null {
  if (!day.overnight) return null;
  const booked = bookedHotel(day);
  if (booked) return { ...day.overnight, area: `${booked}, sudah dipesan` };
  const main = mainDay(day)?.overnight;
  return main ?? { ...day.overnight, area: calmStayBaseForDate(day.date)?.area ?? '' };
}

function transportRows(day: CalmDay) {
  if (day.fromMain) return dayBookings(day.date).map(dayBooking);
  return calmDayBookings(day.date).map(item => bookingRow(item.mode, item.item, item.cost ? costLabel(item.cost) : '', item.price, item.channel, item.link));
}

// Multi-day open trips are the Sichuan group tours the calm option says not to buy; the one-day ones on shared days still apply.
const openTrips = (day: CalmDay) => day.fromMain ? openTripsForDate(day.date).filter(trip => !trip.until).map(openTripItem) : [];

// Calm stops carry no clock time; a stop's own note replaces the general description, as on the calm page.
function calmStop({ place: id, note }: CalmStop, index: number, key: string) {
  const place = placeFor(id)!;
  return stopCard(id, { ...place, description: note ?? place.description }, index + 1, `stop-${id}-${index}${key}`, {}, !calmPlaces[id]);
}

function stops(day: CalmDay, key: string) {
  const main = mainDay(day);
  if (main) return stopsSection(main.events.map((event, index, events) => timelineEvent(event, index, events, key)).join(''), key);
  return stopsSection(day.stops.map((stop, index) => calmStop(stop, index, key)).join(''), key, '');
}

// "Sekilas hari ini": where you sleep, what to book, what to carry and the one thing not to miss, before the timeline.
const bookingName = (item: string) => item.split(/[:,]/)[0].trim();
function glanceBookings(day: CalmDay) {
  const items = day.fromMain ? dayBookings(day.date).map(item => item.item) : calmDayBookings(day.date).filter(item => !item.alternative).map(item => item.item);
  return items.map(bookingName);
}
const glanceRow = (label: string, value: string) => value ? `<div><dt>${e(label)}</dt><dd>${currencyText(value)}</dd></div>` : '';
function glance(day: CalmDay, key: string) {
  const facts = calmGlance[day.date];
  const booked = bookedHotel(day);
  const sleep = day.overnight ? `${day.overnight.name}${day.overnight.elevation ? `, ${day.overnight.elevation}` : ''}${booked ? `: ${booked} (sudah dipesan)` : ''}` : '';
  const book = glanceBookings(day);
  const rows = [
    glanceRow('Tidur', sleep),
    book.length ? `<div><dt>Pesan</dt><dd><ul role="list">${book.map(item => `<li>${currencyText(item)}</li>`).join('')}</ul></dd></div>` : '',
    glanceRow('Bawa', facts?.bring ?? ''),
    glanceRow('Ingat', facts?.remember ?? ''),
  ].join('');
  return rows ? `<section class="day-glance" aria-labelledby="glance-heading${key}"><h3 id="glance-heading${key}">Sekilas hari ini</h3><dl>${rows}</dl></section>` : '';
}

const notes = (day: CalmDay) => day.notes.length ? `<div class="calm-panel-notes">${day.notes.map(noteItem).join('')}</div>` : '';

const risks = (day: CalmDay, key: string) => day.risks.length ? `<section class="practical calm-panel-risks" aria-labelledby="risks-heading${key}"><div class="section-heading"><h3 id="risks-heading${key}">Risiko hari ini</h3>${icon('info')}</div><ul class="calm-list" role="list">${day.risks.map(risk => `<li>${currencyText(risk)}</li>`).join('')}</ul></section>` : '';

// Links, not buttons, so each step also works as a plain anchor without JavaScript.
function pagination(index: number) {
  const step = (offset: number) => {
    const target = calmDays[index + offset];
    const content = offset < 0 ? `${icon('left')}<span>Hari sebelumnya</span>` : `<span>Hari berikutnya</span>${icon('right')}`;
    return target ? `<a class="quiet-button" href="#${target.date}" data-date="${target.date}">${content}</a>` : `<button type="button" class="quiet-button" disabled>${content}</button>`;
  };
  return `<nav class="day-pagination" aria-label="Pindah dari hari ${index + 1}">${step(-1)}${step(1)}</nav>`;
}

function dayHeader(day: CalmDay, index: number, key: string, hasTransport: boolean) {
  const same = day.fromMain ? '<span class="calm-same-chip">Sama dengan rencana utama</span>' : '';
  return `<header class="day-header">${dayDateLine(day.date, index, same)}${dayTitleRow(day.title, key)}<div class="day-essentials">${sleepSummary(overnightFor(day), stayLinks(day))}${transportSummary(day.transport, hasTransport ? `#day-transport${key}` : '')}</div><p class="day-intro">${currencyText(day.intro)}</p>${dayRoute(day.route)}</header>`;
}

function dayPanel(day: CalmDay, index: number) {
  const key = keyFor(day.date);
  const main = mainDay(day);
  const rows = transportRows(day);
  const trips = openTrips(day);
  const transport = transportSection(rows, trips, { key, more: `${calmPreparePath}#bookings`, checked: day.fromMain ? undefined : 'Harga dicek 4–5 November' });
  const night = day.overnight ? nightDetail(day.overnight, currencyText(day.overnight.detail)) : nightDetail(null);
  return `<article class="day-view calm-day-view" id="${day.date}" data-calm-day="${day.date}" aria-labelledby="day-heading${key}">${dayHeader(day, index, key, rows.length + trips.length > 0)}
 ${glance(day, key)}${daySchedule(day.steps, key)}${transport}${stops(day, key)}
 ${main ? renderChengduEvening(day.date) : ''}${notes(day)}${main ? practicalSection(main.practical, key) : ''}${risks(day, key)}
 ${night}
 ${main?.sourceNote ? `<p class="stop-note day-source-note">${e(main.sourceNote)}</p>` : ''}${pagination(index)}</article>`;
}

function intro(home: boolean) {
  const actions = home
    ? `${pickDayButton()}${planSwitch('/', 'calm')}`
    : `${pickDayButton()}<a class="quiet-button" href="${calmPath}#calm-map">Peta${icon('right')}</a>${planSwitch(calmItineraryPath, 'calm')}`;
  return `<div class="itinerary-intro"${home ? ' id="itinerary"' : ''}><h1 id="calm-itinerary-title">Opsi santai,<br>hari demi hari.</h1><div class="itinerary-actions">${actions}</div></div>`;
}

function dayLayout(home: boolean) {
  const first = calmDays[0].date;
  const footer = home ? '' : `<a class="route-link" href="${calmPath}#calm-map">Lihat peta rute santai${icon('right')}</a>`;
  return `<div class="journey-layout" id="${home ? 'route' : 'calm-itinerary-days'}">${daySidebar(pickerItems(first, 'sidebar', calmDays), footer)}<div class="calm-day-panels">${calmDays.map(dayPanel).join('')}</div></div>`;
}

const dayChrome = (first: string) => `${mobileDaybar('mobile-daybar calm-daybar')}
  ${dayPickerDialog(pickerItems(first, 'modal', calmDays))}
  ${renderPhotoDialog('home')}
  ${copyDialog()}
  ${statusMessage}`;

// Runs before the panels are parsed, so calm.css shows only the linked day from the first paint instead of 14 days that then collapse.
const earlyScript = '<script data-cfasync="false">document.documentElement.classList.add(\'js\')</script>';
// Same first-paint rule, plus a hide for `?plan=utama` until main.ts mounts the rencana utama shell.
// data-cfasync keeps Cloudflare Rocket Loader from rewriting the script type and delaying it.
const homeEarlyScript = '<script data-cfasync="false">document.documentElement.classList.add(\'js\');try{if(new URLSearchParams(location.search).get(\'plan\')===\'utama\'){document.documentElement.setAttribute(\'data-home-plan\',\'utama\');var s=document.createElement(\'style\');s.textContent=\'html[data-home-plan="utama"] #app{visibility:hidden}\';document.head.appendChild(s);}}catch(e){}</script>';

export function calmItineraryView() {
  const first = calmDays[0].date;
  return `${earlyScript}<a class="skip-link" href="#calm-itinerary-days" data-action="skip">Langsung ke jadwal</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation(calmItineraryPath)}</header>
  <main class="container calm-itinerary-page" data-calm-itinerary>
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="${calmPath}">Opsi santai</a>${icon('right')}<span>Itinerary santai</span></nav>
    ${intro(false)}
    ${dayLayout(false)}
  </main>
  <footer class="container guide-footer calm-itinerary-footer"><a href="${calmPath}">Kembali ke opsi santai</a>${siteCredit()}</footer>
  ${dayChrome(first)}`;
}

/** Bare `/`. The santai days are the page; nothing here sends the reader to `/places/calm-itinerary/`. */
export function homeItineraryView() {
  const first = calmDays[0].date;
  return `${homeEarlyScript}<a class="skip-link" href="#itinerary" data-action="skip">Langsung ke jadwal</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation('/')}</header>
  <main class="container calm-itinerary-page" data-calm-itinerary data-home-itinerary>
    ${intro(true)}
    ${dayLayout(true)}
    ${userGallery()}
  </main>
  <footer class="container guide-footer calm-itinerary-footer">${siteCredit()}</footer>
  ${dayChrome(first)}`;
}
