import { galleryPhotos, guideForPlace, pageForPlace, placePath } from './guides.ts';
import { dayTimelines, type TimelineStep } from './day-timelines.ts';
import { bookingsForDate, preparePath, type Booking, type Link } from './bookings.ts';
import { openTripsForDate, type OpenTrip } from './open-trips.ts';
import { routeMapPath } from './route-map-main.ts';
import { renderWeather } from './weather.ts';
import { weatherLocationForGuide } from './weather-locations.ts';
import { currencyText, hasCnyAmount, renderExchangeRate } from './currency.ts';
import type { PhotoContent } from './photo-viewer.ts';
import { planSwitch, renderSiteNavigation } from './site-navigation.ts';
import { calmItineraryPath } from './calm-route.ts';
import { logoPaths } from './logo.ts';
import { renderChengduEvening } from './chengdu-evening.ts';
import { stayBaseForDate, staysPath } from './stays.ts';
import { renderOverland } from './overland.ts';
import { amapUrl } from './amap.ts';
import {days, places, photos, userPhotos, highlights, pdfDownloadUrl, bookingOptions, type Day, type Event, type Highlight, type Place, type Practical} from './itinerary.ts';
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const e = escapeHtml;
const paths: Record<string,string> = {
 wallet:'<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 8V6l14-3v5m4 4h-5v5h5m-3-2h.01"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m21 15-6-6L3 21"/>',
 bulb:'<path d="M9 18h6m-6 3h6M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z"/>',
 calendar:'<path d="M8 2v4m8-4v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 14h2m4 0h2m-8 4h2"/>',
 right:'<path d="m9 5 7 7-7 7"/>',left:'<path d="m15 5-7 7 7 7"/>',down:'<path d="m6 9 6 6 6-6"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',
 bed:'<path d="M2 4v16m20-8v8M2 16h20M2 8h6v8m0-6h10a4 4 0 0 1 4 4v2"/>',
 car:'<path d="m5 8 2-5h10l2 5M3 16v3m18-3v3M3 8h18v8H3zM6 12h2m8 0h2"/>',
 train:'<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 10h14m-7-7v7m-4 8-2 3m10-3 2 3M8 14h.01M16 14h.01"/>',
 bus:'<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M8 19v2m8-2v2M8 15h.01M16 15h.01"/>',
 walk:'<circle cx="13" cy="4" r="2"/><path d="m7 21 3-6m6 6-2-7-3-3 1-4m-6 5 3-4h3l3 4h4"/>',
 plane:'<path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2"/>',cable:'<path d="M2 5 22 2M12 4v5"/><rect x="4" y="9" width="16" height="12" rx="2"/><path d="M4 16h16m-8-7v7"/>',
 pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>',share:'<path d="M12 16V3m-5 5 5-5 5 5M5 13v8h14v-8"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',check:'<path d="m5 12 4 4L19 6"/>',
 // The mountain entry is the site logo.
 mountain:logoPaths,info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
 chat:'<path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l.9-4.3A8 8 0 1 1 20 12Z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
 send:'<path d="M12 19V5m-6 6 6-6 6 6"/>',stop:'<rect x="7" y="7" width="10" height="10" rx="2"/>',plus:'<path d="M12 5v14M5 12h14"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
};
export function icon(name: string) {return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.pin}</svg>`;}
const dateObject = (date: string) => new Date(`${date}T12:00:00+08:00`);
export function fullDate(date: string) {return new Intl.DateTimeFormat('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Shanghai'}).format(dateObject(date));}
const weekday = (date: string) => new Intl.DateTimeFormat('id-ID',{weekday:'short',timeZone:'Asia/Shanghai'}).format(dateObject(date));
const external = (label: string, url: string) => `<a class="text-link" href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)}<span class="visually-hidden"> (buka tab baru)</span></a>`;
export function siteCredit() {
 return '<p class="site-credit">© 2026 <a href="https://muhammadyana.me" target="_blank" rel="noopener noreferrer">@muhammad_yana<span class="visually-hidden"> (buka tab baru)</span></a></p>';
}
export function renderPhotoDialog(kind: 'home' | 'guide') {
 const isGuide = kind === 'guide';
 const prefix = isGuide ? 'guide-photo' : 'photo';
 const actionAttribute = isGuide ? 'data-guide-action' : 'data-action';
 const previousAction = isGuide ? 'previous-photo' : 'photo-previous';
 const nextAction = isGuide ? 'next-photo' : 'photo-next';
 const closeAction = isGuide ? 'close-photo' : 'close';
 const hidden = isGuide ? '' : ' hidden';
 return `<dialog id="${prefix}-dialog" class="photo-dialog${isGuide ? ' guide-photo-dialog' : ''}" aria-labelledby="${prefix}-title"><header class="photo-toolbar"><span id="${prefix}-count" aria-live="polite" aria-atomic="true"></span><button type="button" class="icon-button" ${actionAttribute}="${closeAction}" aria-label="Tutup foto" autofocus>${icon('close')}</button></header><div id="${prefix}-content"><figure class="${isGuide ? 'guide-photo-detail' : 'photo-detail-figure'}"><div class="photo-stage"><button type="button" class="icon-button photo-previous" ${actionAttribute}="${previousAction}" aria-label="Foto sebelumnya"${hidden}>${icon('left')}</button><div class="photo-frame" data-photo-frame></div><button type="button" class="icon-button photo-next" ${actionAttribute}="${nextAction}" aria-label="Foto berikutnya"${hidden}>${icon('right')}</button></div><figcaption data-photo-caption></figcaption></figure></div></dialog>`;
}
export function photoImage(id: string, alt: string, eager = false, sizes = '(min-width: 960px) 340px, calc(100vw - 48px)') {
 const p = photos[id] || userPhotos[id]; if(!p) return '';
 const max = p.sizes[p.sizes.length-1];
 return `<img data-photo-state="loading" src="/photos/${id}-${max}.webp" srcset="${p.sizes.map(w=>`/photos/${id}-${w}.webp ${w}w`).join(', ')}" sizes="${sizes}" width="${p.width}" height="${p.height}" alt="${e(alt)}" ${eager?'fetchpriority="high" loading="eager"':'loading="lazy"'} decoding="async">`;
}
function copyPlace(id: string, p: Place = places[id]) {return p.chinese ? `<button type="button" class="copy-place" data-action="copy-place" data-place="${id}" aria-label="Salin nama Mandarin ${e(p.name)}">${icon('copy')}<span lang="zh-Hans">${e(p.chinese)}</span><span class="copy-label">Salin</span></button>`:'';}
export const amapLink = (id: string, name: string, showName = false) => `<a class="text-link amap-link" href="${e(amapUrl(id))}" target="_blank" rel="noopener noreferrer">${icon('pin')}Buka di Amap${showName ? `: ${e(name)}<span class="visually-hidden">` : `<span class="visually-hidden">: ${e(name)}`} (buka tab baru)</span></a>`;
// The traveller's own photos of a stop (the newest on the site) sit under its description and open in the photo viewer.
const stopUserPhoto = (id: string, title: string, alt: string) => `<li><button class="stop-user-photo" type="button" data-action="user-photo" data-photo="${e(id)}" aria-label="Perbesar ${e(title)}">${photoImage(id, alt, false, '96px')}</button></li>`;
function stopUserPhotos(placeId: string) {
 const page = pageForPlace.get(placeId);
 const shots = page ? galleryPhotos(page).filter(item => userPhotos[item.id]) : [];
 return shots.length ? `<ul class="stop-user-photos" role="list" aria-label="Foto kirimanmu">${shots.map(shot => stopUserPhoto(shot.id, shot.title, shot.alt)).join('')}</ul>` : '';
}
function status(value?: string) {return value ? `<span class="state ${value==='Terkonfirmasi'?'confirmed':''}">${e(value)}</span>`:'';}
// The homepage lists the main plan's days; the calm itinerary passes its own.
export function pickerItems(current: string, variant = 'sidebar', list: Pick<Day,'date'|'title'|'shortTitle'>[] = days) {
 return list.map((day,index) => `<li><a class="date-choice" href="#${day.date}" data-date="${day.date}" ${current===day.date?'aria-current="date"':''} aria-label="${fullDate(day.date)}, ${e(day.title)}"><span class="date-number">${day.date.slice(-2)}</span><span class="date-choice-text"><span class="choice-meta">${weekday(day.date)}${variant==='sidebar'?` / Hari ${index+1}`:''}</span><span class="choice-title">${e(day.shortTitle)}</span></span>${icon('right')}</a></li>`).join('');
}
// Day panel pieces shared by the homepage and the calm itinerary. `key` keeps ids unique when one page holds several panels; the homepage leaves it empty.
export interface StopDetails { time?: string; note?: string; status?: string }
/** One stop card. `covered` is false for places without a guide page, weather or photos (the calm option's own stops). */
export function stopCard(id: string, p: Place, sequence: number, elementId: string, details: StopDetails, covered = true) {
 const hasPhoto=covered && p.photo && photos[p.photo];
 const guide = covered ? guideForPlace.get(id) : undefined;
 const page = covered ? pageForPlace.get(id) : undefined;
 const weather = hasPhoto && guide ? renderWeather(weatherLocationForGuide[guide.slug], elementId) : '';
 return `<li class="stop ${hasPhoto?'has-photo':'text-stop'} ${sequence%2===0?'stop-even':''}" id="${elementId}"><div class="stop-content"><div class="stop-meta"><span class="stop-sequence" aria-label="Pemberhentian ${sequence}">${String(sequence).padStart(2,'0')}</span>${details.time===undefined?'':`<span class="stop-time">${e(details.time)}</span>`}${status(details.status)}</div><h3>${e(p.name)}</h3><p class="stop-description">${currencyText(p.description)}</p>${details.note?`<p class="stop-note">${e(details.note)}</p>`:''}${covered?stopUserPhotos(id):''}<div class="stop-actions">${copyPlace(id,p)}${amapLink(id,p.name)}</div>${page?`<a class="stop-guide-link" href="${placePath(page.slug)}">Panduan tempat${icon('right')}</a>`:''}</div>${hasPhoto?`<div class="stop-visual"><button class="stop-photo" type="button" data-action="photo" data-place="${id}" aria-label="Perbesar foto ${e(p.name)}">${photoImage(p.photo!,p.alt||p.name,false,'(min-width: 960px) 520px, calc(100vw - 32px)')}<span class="photo-open">${icon('expand')}<span>Lihat foto</span></span></button>${weather}</div>`:''}</li>`;
}
export function timelineEvent(event: Event, index: number, events: Event[], key = '') {
 if(event.kind==='transfer') return `<li class="transfer"><div class="transfer-icon">${icon(event.mode)}</div><div><p class="transfer-title">${e(event.title)}</p>${event.detail?`<p class="transfer-detail">${e(event.detail)}</p>`:''}${status(event.status)}</div></li>`;
 const sequence=events.slice(0,index+1).filter(item=>item.kind==='stop').length;
 return stopCard(event.place, places[event.place], sequence, `stop-${event.place}-${index}${key}`, event);
}
const timelineText = (text: string, detail?: string) => detail ? `<strong class="day-timeline-title">${currencyText(text)}</strong><span class="day-timeline-detail">${currencyText(detail)}</span>` : currencyText(text);
export const timelineList = (steps: TimelineStep[]) => `<ol class="day-timeline" role="list">${steps.map(([time, text, detail]) => `<li><span class="day-timeline-time">${e(time)}</span><span>${timelineText(text, detail)}</span></li>`).join('')}</ol>`;
export const daySchedule = (steps: TimelineStep[] | undefined, key = '') => steps?.length ? `<section class="day-schedule" aria-labelledby="schedule-heading${key}"><div class="section-heading"><h3 id="schedule-heading${key}">Timeline</h3><span>Waktu China (UTC+8)</span></div>${timelineList(steps)}</section>` : '';
// Transport legs plus priced tickets for one date; stays have their own link in the day header.
export const dayBookings = (date: string) => bookingsForDate(date).filter(item => item.mode || item.cost);
const bookingIcon = (mode?: Booking['mode']) => icon(mode === 'train' || mode === 'metro' ? 'train' : mode === 'bus' || mode === 'shuttle' ? 'bus' : mode === 'plane' ? 'plane' : mode ? 'car' : 'wallet');
export const costLabel = (cost: NonNullable<Booking['cost']>) => cost.min === cost.max ? `CNY ${cost.min} / ${cost.per}` : `CNY ${cost.min}–${cost.max} / ${cost.per}`;
const bookingLink = (link: Link) => link.url.startsWith('/') ? `<a class="text-link" href="${e(link.url)}">${e(link.label)}</a>` : external(link.label, link.url);
/** One row under "Transport & pemesanan": plain text in, `price` beside the title. */
export const bookingRow = (mode: Booking['mode'], title: string, price: string, text: string, channel: string, link?: Link) =>
 `<li class="day-booking">${bookingIcon(mode)}<div><p class="day-booking-title"><strong>${e(title)}</strong>${price ? `<span>${currencyText(price)}</span>` : ''}</p><p>${currencyText(text)}</p><p class="day-booking-channel">${currencyText(channel)}</p>${link ? bookingLink(link) : ''}</div></li>`;
export const dayBooking = (item: Booking) => bookingRow(item.mode, item.item, item.cost ? costLabel(item.cost) : '', item.note, item.channel, item.link);
export function openTripItem(trip: OpenTrip) {
 return `<li class="day-booking">${icon('bus')}<div><p class="day-booking-title"><strong>${e(trip.name)}</strong><span>${currencyText(trip.price)}</span></p><p>${currencyText(trip.fit)}</p><p class="day-booking-channel">${e(trip.platform)}</p>${bookingLink(trip.link)}</div></li>`;
}
export interface TransportOptions { key?: string; checked?: string; more?: string }
export function transportSection(rows: string[], trips: string[], { key = '', checked = 'Harga dicek 4 November', more = `${preparePath}#bookings` }: TransportOptions = {}) {
 if (!rows.length && !trips.length) return '';
 const list = (entries: string[]) => `<ul class="day-bookings" role="list">${entries.join('')}</ul>`;
 return `<section class="day-transport" id="day-transport${key}" aria-labelledby="transport-heading${key}" tabindex="-1"><div class="section-heading"><h3 id="transport-heading${key}">Transport & pemesanan</h3><span>${e(checked)}</span></div>${rows.length ? list(rows) : ''}${trips.length ? `<h4 class="day-open-trips-title">Alternatif open trip & tur</h4>${list(trips)}` : ''}<p class="day-transport-more"><a class="text-link" href="${e(more)}">Semua pemesanan dan jam bukanya</a></p></section>`;
}
const dayTransport = (date: string) => transportSection(dayBookings(date).map(dayBooking), openTripsForDate(date).map(openTripItem));
export function printTransport(date: string) {
 const items = dayBookings(date); const trips = openTripsForDate(date);
 if (!items.length && !trips.length) return '';
 const row = (title: string, price: string, text: string) => `<li><strong>${e(title)}</strong>${price ? ` · ${currencyText(price)}` : ''}<span>${currencyText(text)}</span></li>`;
 return `<section class="print-transport"><h3>Transport & pemesanan</h3><ul>${items.map(item => row(item.item, item.cost ? costLabel(item.cost) : '', `${item.note} ${item.channel}`)).join('')}${trips.map(trip => row(`Open trip: ${trip.name}`, trip.price, trip.fit)).join('')}</ul></section>`;
}
export const dayDateLine = (date: string, index: number, chips = '') => `<div class="date-line"><time datetime="${date}">${fullDate(date)}</time><span>Hari ${index+1} / 14</span>${chips}</div>`;
export const dayTitleRow = (title: string, key = '') => `<div class="day-title-row"><h2 id="day-heading${key}" tabindex="-1">${e(title)}</h2><button type="button" class="icon-button share-button" data-action="share" aria-label="Salin tautan hari ini">${icon('share')}</button></div>`;
export interface Overnight { name: string; area: string; elevation?: string; detail: string }
// `label` is literal interface copy (it may hold a raw ampersand), never data.
export const staysLink = (href: string, label: string) => `<a class="sleep-stays-link" href="${e(href)}">${label}${icon('right')}</a>`;
/** `stays` is the link (and any note) under the night's area. */
export const sleepSummary = (overnight: Overnight | null, stays: string) => `<div class="sleep-summary">${icon(overnight?'bed':'plane')}<div><strong>${overnight?`Menginap di ${e(overnight.name)}`:'Pulang ke Jakarta'}</strong><p>${overnight?e(overnight.area):'Jam penerbangan mengikuti tiket'}</p>${overnight?.elevation?`<span class="elevation">${e(overnight.elevation)}</span>`:''}${stays}</div></div>`;
export const transportSummary = (transport: string, detailHref: string) => `<div class="transport-summary">${icon('train')}<div><span>Perjalanan hari ini</span><p>${currencyText(transport)}</p>${detailHref ? `<a class="transport-detail-link" href="${e(detailHref)}" data-action="transport">Detail transport & pemesanan${icon('right')}</a>` : ''}</div></div>`;
export const dayRoute = (route: string[]) => `<div class="day-route" aria-label="Rute hari ini">${route.map((place,i)=>`${i?icon('right'):''}<span>${e(place)}</span>`).join('')}</div>`;
export const stopsSection = (items: string, key = '', aside = '<span>Waktu China (UTC+8)</span>') => `<section class="daily-stops" aria-labelledby="stops-heading${key}"><div class="section-heading"><h3 id="stops-heading${key}">Cerita hari ini</h3>${aside}</div><ol class="timeline">${items}</ol></section>`;
export const practicalSection = (notes: Practical[], key = '') => `<section class="practical" aria-labelledby="practical-heading${key}"><div class="section-heading"><h3 id="practical-heading${key}">Info praktis</h3>${icon('info')}</div>${notes.some(note => hasCnyAmount(note.text)) ? renderExchangeRate() : ''}<div class="practical-list">${notes.map(n=>`<details><summary>${e(n.title)}${icon('down')}</summary><div class="practical-content"><p>${currencyText(n.text)}</p>${n.link?external(n.link.label,n.link.url):''}${n.copy?`<button type="button" class="copy-place" data-action="copy-place" data-copy="${e(n.copy)}">${icon('copy')}<span lang="zh-Hans">${e(n.copy)}</span><span>Salin</span></button>`:''}</div></details>`).join('')}</div></section>`;
/** `detail` is HTML when given; the homepage leaves it out and gets the escaped text. */
export const nightDetail = (overnight: { detail: string } | null, detail?: string) => `<div class="night-detail">${icon(overnight?'bed':'plane')}<p>${overnight?(detail ?? e(overnight.detail)):'Tidak ada malam hotel tambahan dalam itinerary. Periksa tiket dan ketentuan check-in maskapai.'}</p></div>`;
export function dayView(day: Day) {
 const index=days.indexOf(day);const stayBase=day.overnight?stayBaseForDate(day.date):undefined;
 return `<header class="day-header">${dayDateLine(day.date,index)}${dayTitleRow(day.title)}<div class="day-essentials">${sleepSummary(day.overnight,stayBase?staysLink(`${staysPath}#${stayBase.id}`,'Rekomendasi hotel & hostel'):'')}${transportSummary(day.transport,dayBookings(day.date).length || openTripsForDate(day.date).length ? '#day-transport' : '')}</div><p class="day-intro">${e(day.intro)}</p>${dayRoute(day.route)}</header>
 ${daySchedule(dayTimelines[day.date])}${dayTransport(day.date)}${stopsSection(day.events.map((event,i,events)=>timelineEvent(event,i,events)).join(''))}
 ${renderChengduEvening(day.date)}${practicalSection(day.practical)}
 ${nightDetail(day.overnight)}
 ${day.sourceNote ? `<p class="stop-note day-source-note">${e(day.sourceNote)}</p>` : ''}<div class="day-end"><a class="text-link" href="${pdfDownloadUrl}" target="_blank" rel="noopener noreferrer">Unduh itinerary terbaru<span class="visually-hidden"> (buka tab baru)</span></a><span>PDF dari konten website</span></div>
 <nav class="day-pagination" aria-label="Pindah hari"><button type="button" class="quiet-button" data-action="previous" ${index===0?'disabled':''}>${icon('left')}<span>Hari sebelumnya</span></button><button type="button" class="quiet-button" data-action="next" ${index===days.length-1?'disabled':''}><span>Hari berikutnya</span>${icon('right')}</button></nav>`;
}
export function overviewContent(current: string) {
 return `<p class="dialog-intro">14 hari, 13 malam. Sembilan malam di Sichuan, empat di Yunnan. <a href="${routeMapPath}">Lihat di peta</a></p><ol class="overview-list">${days.map(day=>`<li><a href="#${day.date}" data-date="${day.date}" ${current===day.date?'aria-current="date"':''}><time datetime="${day.date}">${day.date.slice(-2)} Nov</time><span><strong>${e(day.title)}</strong><span>${day.overnight?`Menginap di ${e(day.overnight.name)}`:'Penerbangan pulang'}</span></span>${icon('right')}</a></li>`).join('')}</ol><details class="booking-options"><summary>Mobil & alternatif paket${icon('down')}</summary>${bookingOptions.map((o,i)=>`<div class="booking-option"><h3>${e(o.title)}</h3><p>${e(o.description)}</p>${external(i===0?'Lihat penyedia mobil':'Lihat paket alternatif',o.url)}</div>`).join('')}</details>`;
}
export function photoDetail(placeId: string): PhotoContent {
 const p=places[placeId];const photo=p.photo?photos[p.photo]:undefined;
 if(!photo) return { image: '', caption: `<h2 id="photo-title">${e(p.name)}</h2><p>Foto belum tersedia.</p>` };
 return {
  image: photoImage(photo.id,p.alt||p.name,true,'(min-width: 960px) 850px, calc(100vw - 40px)'),
  caption: `<h2 id="photo-title">${e(p.name)}</h2><p>${e(p.description)}</p>${p.photoNote?`<p class="photo-note">${e(p.photoNote)}</p>`:''}${photo.photoNote?`<p class="photo-note">${e(photo.photoNote)}</p>`:''}<p class="photo-note">Foto referensi; warna daun dan kondisi lapangan dapat berbeda saat perjalanan.</p>${copyPlace(placeId)}<div class="photo-credit" data-credits>Foto: ${e(photo.author)}. ${photo.licenseUrl===photo.source?e(photo.license):external(photo.license,photo.licenseUrl)}<br>${external('Buka sumber foto',photo.source)}<span>Diubah ukurannya ke WebP; tampilan daftar dipotong sesuai bingkai. Lisensi asal tetap berlaku.</span></div>`,
 };
}
export function userPhotoDetail(id: string, titleId = 'photo-title'): PhotoContent {
 const photo=userPhotos[id]; if(!photo) return { image: '', caption: '' };
 return {
  image: photoImage(id,photo.alt,true,'(min-width: 960px) 850px, calc(100vw - 128px)'),
  caption: `<h2 id="${e(titleId)}">${e(photo.title)}</h2><p>${e(photo.caption)}</p><div class="photo-credit">${e(photo.credit)}<span>Foto dikirim dan disetujui pengguna untuk halaman ini. Tanggal pengambilan tidak dicantumkan.</span><span>Ukuran disesuaikan ke WebP; warna foto dipertahankan.</span></div>`,
 };
}
function userGallery() {
 return `<details class="journey-gallery" id="user-gallery" open><summary id="gallery-heading"><span>Galeri pilihanmu</span><span>${Object.keys(userPhotos).length} foto ${icon('down')}</span></summary><p class="gallery-intro">Warna yang ingin ditemui di perjalanan. Geser untuk melihat koleksi foto pilihanmu.</p><div class="gallery-track" role="region" aria-label="Koleksi foto musim gugur">${Object.values(userPhotos).map(p=>`<button class="gallery-photo" type="button" data-action="user-photo" data-photo="${p.id}" aria-label="Perbesar ${e(p.title)}">${photoImage(p.id,p.alt,false,'(min-width: 960px) 300px, 260px')}<span>${e(p.title)}</span></button>`).join('')}</div></details>`;
}
function credits() {
 return `<details class="credits"><summary>Sumber & kredit foto${icon('down')}</summary><p>Itinerary website menjadi acuan perjalanan 8–21 November 2026: menginap di Chengdu pada 8 November, menuju Jiuzhaigou pada 9 November, dan wajib menonton Impression Lijiang pada 19 November. PDF disimpan sebagai arsip rute awal. Foto menggambarkan tempat, bukan jaminan cuaca atau akses saat kunjungan. Penginapan adalah area rencana, bukan nama hotel yang sudah dipesan.</p><ul data-credits>${Object.values(photos).map(p=>`<li>${external(p.id.replaceAll('-',' '),p.source)}: ${e(p.author)}, ${p.licenseUrl===p.source?e(p.license):external(p.license,p.licenseUrl)}. WebP, ukuran disesuaikan; crop hanya pada tampilan.${p.photoNote?`<span class="credit-note">${e(p.photoNote)}</span>`:''}</li>`).join('')}</ul><details><summary>Tempat yang belum memiliki foto${icon('down')}</summary><p>${Object.values(places).filter(p=>!p.photo||!photos[p.photo]).map(p=>e(p.name)).join('; ')}.</p><p>Izin pakai atau kecocokan foto belum cukup jelas. Deskripsi dari PDF tetap tersedia.</p></details></details>`;
}
function resolveHighlightImage(highlight: Highlight) {
 const place = places[highlight.place];
 return {id: highlight.photo || place.photo!, alt: highlight.alt || place.alt || highlight.title};
}
function renderHighlightCard(highlight: Highlight) {
 const image = resolveHighlightImage(highlight);
 return `<a class="highlight-card" href="${placePath(guideForPlace.get(highlight.place)!.slug)}" data-highlight="${highlight.place}" aria-label="Buka panduan ${e(highlight.title)}"><div class="highlight-image">${photoImage(image.id,image.alt,false,'(min-width: 960px) 580px, 300px')}<span class="highlight-date">${icon('calendar')}${Number(highlight.date.slice(-2))} November</span></div><div class="highlight-copy"><div><h4>${e(highlight.title)}</h4><p>${e(highlight.caption)}</p></div><span class="highlight-go" aria-hidden="true">${icon('right')}</span></div></a>`;
}
function renderHeroSlide(highlight: Highlight, index: number, total: number) {
 const image = resolveHighlightImage(highlight);
 return `<figure class="hero-slide ${index===0?'is-active':''}" role="group" aria-roledescription="slide" aria-label="${index+1} dari ${total}: ${e(highlight.title)}" ${index===0?'':'inert'}>${photoImage(image.id,image.alt,index===0,'(min-width: 1280px) 1200px, calc(100vw - 32px)')}<figcaption><a href="#${highlight.date}" data-date="${highlight.date}"><span>${e(highlight.title)}</span><span class="hero-region">${highlight.region}</span><span>${Number(highlight.date.slice(-2))} November${icon('right')}</span></a></figcaption></figure>`;
}
function tripHighlights() {
 const regions = [
  {name:'Sichuan',description:'Jiuzhaigou, Bipenggou, Siguniangshan, Tagong, dan Yading. Dari hutan berwarna sampai dataran tinggi Ganzi.'},
  {name:'Yunnan',description:'Shangri-La, Lijiang, dan Dali. Biara di bukit, kota tua, serta danau di kaki pegunungan.'},
 ] as const;
 return `<section class="trip-highlights" aria-labelledby="highlights-heading"><div class="highlights-heading"><h2 id="highlights-heading">Jelajahi Sichuan<br>& Yunnan.</h2><p>Dari pegunungan Sichuan sampai kota tua di Yunnan. Pilih wilayahnya, lalu buka panduan tempat untuk melihat rute, biaya, dan galeri.</p></div><nav class="region-navigation" aria-label="Pilih wilayah destinasi">${regions.map(region=>`<button type="button" class="region-link" data-action="region" data-region="${region.name}" aria-controls="region-${region.name.toLowerCase()}"><span>${region.name}</span>${icon('down')}</button>`).join('')}</nav>${regions.map(region=>`<section class="region-highlights" data-region="${region.name}" id="region-${region.name.toLowerCase()}" aria-labelledby="region-heading-${region.name.toLowerCase()}"><header class="region-heading"><h3 id="region-heading-${region.name.toLowerCase()}" tabindex="-1">${region.name}</h3><p>${region.description}</p></header><div class="highlights-grid" role="region" aria-label="Sorotan destinasi ${region.name}">${highlights.filter(highlight=>highlight.region===region.name).map(renderHighlightCard).join('')}</div><p class="highlights-hint">Geser untuk melihat destinasi ${region.name}.</p></section>`).join('')}</section>`;
}
function arrivalSummary() {
 const day=days[0];
 return `<a class="home-arrival" href="#${day.date}" data-date="${day.date}" aria-label="Buka hari pertama, 8 November, menginap di ${e(day.overnight!.name)}"><div class="arrival-date"><strong>08</strong><span>Nov</span></div><div class="arrival-copy"><strong>Mulai dari Chengdu</strong><span class="arrival-stay">${icon('bed')}Menginap di ${e(day.overnight!.name)}</span></div><span class="arrival-open">Buka hari pertama${icon('right')}</span></a>`;
}
function tripHero() {
 return `<section class="hero" aria-labelledby="trip-title" aria-roledescription="slider foto destinasi"><div class="hero-track" tabindex="0" aria-label="Foto destinasi; geser ke samping untuk menjelajah">${highlights.map((highlight,index)=>renderHeroSlide(highlight,index,highlights.length)).join('')}</div><div class="hero-controls"><span id="hero-counter" aria-live="polite">1 / ${highlights.length}</span><button type="button" class="icon-button" data-action="hero-previous" aria-label="Foto destinasi sebelumnya">${icon('left')}</button><button type="button" class="icon-button" data-action="hero-next" aria-label="Foto destinasi berikutnya">${icon('right')}</button></div><div class="hero-copy"><h1 id="trip-title" lang="en">Autumn and Winter in China</h1><p class="hero-subtitle">Sichuan & Yunnan<span>8–21 November 2026</span><span>14 hari, 13 malam</span></p><button type="button" class="primary-button" data-action="pick-day">${icon('calendar')}<span>Pilih hari</span>${icon('down')}</button></div></section>`;
}
// Day-switching chrome shared by the homepage and the calm itinerary; each page has one of each.
export const pickDayButton = () => `<button type="button" class="quiet-button" data-action="pick-day">${icon('calendar')}<span>Jelajahi 14 hari</span></button>`;
export const daySidebar = (items: string, footer: string) => `<aside class="day-sidebar" aria-label="Daftar hari perjalanan"><div class="sidebar-title"><h2>November 2026</h2>${icon('calendar')}</div><ol class="sidebar-days">${items}</ol>${footer}</aside>`;
export const mobileDaybar = (className = 'mobile-daybar') => `<nav class="${className}" aria-label="Pemilih hari"><button type="button" class="icon-button" data-action="previous" aria-label="Hari sebelumnya" disabled>${icon('left')}</button><button type="button" class="mobile-picker" id="mobile-picker" data-action="pick-day"><span><strong id="current-date">8 November</strong><span id="current-count">Hari 1 dari 14</span></span>${icon('down')}</button><button type="button" class="icon-button" data-action="next" aria-label="Hari berikutnya">${icon('right')}</button></nav>`;
export const dayPickerDialog = (items: string) => `<dialog id="day-picker" class="day-picker" aria-labelledby="picker-title"><header class="dialog-header"><div><h2 id="picker-title">Pilih hari perjalanan</h2><p>November 2026</p></div><button type="button" class="icon-button" data-action="close" aria-label="Tutup pemilih hari" autofocus>${icon('close')}</button></header><ol id="picker-days" class="picker-days">${items}</ol></dialog>`;
export const copyDialog = () => `<dialog id="copy-dialog" class="copy-dialog" aria-labelledby="copy-title"><header class="dialog-header"><h2 id="copy-title">Salin secara manual</h2><button type="button" class="icon-button" data-action="close" aria-label="Tutup salin manual">${icon('close')}</button></header><p>Penyalinan otomatis tidak tersedia. Pilih teks di bawah, lalu salin.</p><label for="manual-copy">Teks untuk disalin</label><input id="manual-copy" readonly></dialog>`;
export const statusMessage = '<div class="status-message" id="status" role="status" aria-live="polite" aria-atomic="true"></div>';
const earlyCalmRedirect = `<script data-default-calm-redirect>(()=>{try{const q=new URLSearchParams(location.search);if(q.get('plan')==='utama')return;if(location.pathname==='/'||location.pathname==='')location.replace('/places/calm-itinerary/'+location.hash);}catch{}})();</script>`;
export function shell() {
 return `${earlyCalmRedirect}<a class="skip-link" href="#day-heading" data-action="skip">Langsung ke jadwal</a><header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation('/')}</header>
 <main class="container">${tripHero()}${userGallery()}
 ${arrivalSummary()}${tripHighlights()}<div class="itinerary-intro" id="itinerary"><p class="plan-switch"><a class="text-link" href="${calmItineraryPath}">Rencana aktif: opsi santai — buka itinerary santai</a></p><h2 tabindex="-1">Rencana utama,<br>hari demi hari.</h2><div class="itinerary-actions">${pickDayButton()}<button type="button" class="quiet-button" data-action="overview">Rute${icon('right')}</button>${planSwitch('/')}</div></div>
 <div class="journey-layout">${daySidebar(pickerItems(days[0].date),`<button class="route-link" type="button" data-action="overview">Lihat seluruh rute${icon('right')}</button>`)}<article id="day-view" class="day-view" aria-label="Jadwal hari terpilih">${dayView(days[0])}</article></div>
 <noscript><p class="no-script">Pemilih hari memerlukan JavaScript. Jadwal hari pertama tetap tersedia di sini. <a href="${pdfDownloadUrl}">PDF memuat itinerary terbaru 14 hari</a>, dibuat otomatis dari konten website.</p></noscript>${renderOverland()}</main>
 <footer class="site-footer container"><div class="footer-top"><p>Perjalanan yang sudah ditata.<br>Tinggal menikmati jalannya.</p><a class="quiet-button" href="${pdfDownloadUrl}" download>${icon('download')}<span>Unduh PDF terbaru</span></a></div>${credits()}<div class="footer-bottom"><span>Sichuan & Yunnan, November 2026</span><span>Semua jam dalam UTC+8</span>${siteCredit()}</div></footer>
 ${mobileDaybar()}
 ${dayPickerDialog(pickerItems(days[0].date,'modal'))}
 <dialog id="overview-dialog" class="overview-dialog" aria-labelledby="overview-title"><header class="dialog-header"><h2 id="overview-title">Dari Chengdu ke Kunming</h2><button type="button" class="icon-button" data-action="close" aria-label="Tutup ringkasan rute" autofocus>${icon('close')}</button></header><div id="overview-content"></div></dialog>
 ${renderPhotoDialog('home')}
 ${copyDialog()}
 ${statusMessage}`;
}
