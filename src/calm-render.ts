import { escapeHtml as e, icon, siteCredit, amapLink, timelineList } from './render.ts';
import { currencyText } from './currency.ts';
import { planSwitch, renderSiteNavigation } from './site-navigation.ts';
import { pageForPlace, placePath } from './guides.ts';
import { preparePath, type Link } from './bookings.ts';
import { dayModes, mapLegs, mapPoints, overnightPoint, routeMapLayout, type RouteDefinition } from './route-map.ts';
import {
  calmBadgeShifts, calmBookingGroups, calmCheckedAt, calmComparison, calmDays, calmDoNotBuy, calmDoNotBuyLead, calmItineraryPath, calmLegs, calmLocalModes, calmPath,
  calmMapPoints, calmPlaces, calmPreparePath, calmSources, calmTradeOffs, calmUnknowns, placeFor, type CalmDay, type CalmNote, type CalmStop,
} from './calm-route.ts';
import { bookingCard } from './prepare.ts';
import { calmCard } from './calm-prepare.ts';

export { calmPath } from './calm-route.ts';

// The calm map shares the main map's towns and frame; 8 and 18–21 November reuse the main plan's legs.
const sharedPoints = ['chengdu', 'jiuzhaigou', 'huanglongjiuzhai', 'bipenggou', 'shangri-la', 'lijiang', 'ganhaizi', 'dali', 'kunming'];
const legsFor = (date: string) => calmLegs[date] ?? mapLegs[date];

export const calmRoute: RouteDefinition = {
  points: { ...Object.fromEntries(sharedPoints.map(id => [id, mapPoints[id]])), ...calmMapPoints },
  days: calmDays.map((day, index) => ({
    date: day.date, title: day.shortTitle, route: day.route, transport: day.transport, overnight: day.overnight,
    night: day.overnight ? overnightPoint[day.overnight.name] : undefined, badgeShift: calmBadgeShifts[day.date], legs: legsFor(day.date),
    modes: [...dayModes(day.date, legsFor(day.date)), ...(calmLocalModes[day.date] ?? [])],
    href: `#calm-${day.date}`, linkLabel: `Lihat hari ${index + 1}`,
  })),
};

/** Build-time check: every stop resolves to a place, and each day's legs run from the previous night to its own. */
export function calmRouteProblems(): string[] {
  const problems = calmDays.flatMap(day => day.stops.filter(stop => !placeFor(stop.place)).map(stop => `${day.date}: unknown place "${stop.place}"`));
  calmRoute.days.forEach((day, index) => {
    if (day.overnight && !calmRoute.points[day.night ?? '']) problems.push(`${day.date}: no map point for the night in ${day.overnight.name}`);
    for (const leg of day.legs) for (const id of [leg.from, leg.to]) if (!calmRoute.points[id]) problems.push(`${day.date}: no map point "${id}"`);
    if (!day.legs.length) return;
    if (day.legs[0].from !== calmRoute.days[index - 1]?.night) problems.push(`${day.date}: the first leg does not start at the previous night`);
    if (day.legs[day.legs.length - 1].to !== day.night) problems.push(`${day.date}: the last leg does not end at the night`);
  });
  return problems;
}

const dateFormat = (options: Intl.DateTimeFormatOptions) => (date: string) => new Intl.DateTimeFormat('id-ID', { ...options, timeZone: 'Asia/Shanghai' }).format(new Date(`${date}T12:00:00+08:00`));
const longDate = dateFormat({ weekday: 'long', day: 'numeric', month: 'long' });
const dayMonth = dateFormat({ day: 'numeric', month: 'long' });
const fullDay = dateFormat({ day: 'numeric', month: 'long', year: 'numeric' });

const externalLink = (link: Link) => `<a href="${e(link.url)}" target="_blank" rel="noopener noreferrer">${e(link.label)}<span class="visually-hidden"> (buka tab baru)</span>${icon('share')}</a>`;
const internalLink = (href: string, label: string) => `<a href="${e(href)}">${e(label)}${icon('right')}</a>`;
const textList = (items: string[]) => `<ul class="calm-list" role="list">${items.map(item => `<li>${currencyText(item)}</li>`).join('')}</ul>`;
const fact = (term: string, detail: string) => `<div><dt>${term}</dt><dd>${currencyText(detail)}</dd></div>`;

function stopItem({ place: id, note }: CalmStop) {
  const place = placeFor(id)!;
  const page = calmPlaces[id] ? undefined : pageForPlace.get(id);
  const chinese = place.chinese ? ` <span lang="zh-Hans">${e(place.chinese)}</span>` : '';
  const pageLink = page ? `<a class="text-link" href="${e(placePath(page.slug))}">Panduan tempat<span class="visually-hidden">: ${e(place.name)}</span>${icon('right')}</a>` : '';
  return `<li class="calm-stop"><h5>${e(place.name)}${chinese}</h5><p>${currencyText(note || place.description)}</p><p class="calm-stop-links">${amapLink(id, place.name)}${pageLink}</p></li>`;
}

export const noteItem = (note: CalmNote) => `<div class="calm-day-note"><p>${currencyText(note.text)}</p>${note.links.length ? `<p class="prepare-link">${note.links.map(externalLink).join('')}</p>` : ''}</div>`;

function overnightText(day: CalmDay) {
  if (!day.overnight) return 'Terbang pulang ke Jakarta.';
  return `${day.overnight.name}${day.overnight.elevation ? ` · ${day.overnight.elevation}` : ''}. ${day.overnight.detail}`;
}

const risksBlock = (risks: string[]) => risks.length ? `<details class="calm-risks"><summary>Risiko hari ini${icon('down')}</summary>${textList(risks)}</details>` : '';

function dayCard(day: CalmDay, index: number) {
  const id = `calm-${day.date}`;
  const same = day.fromMain ? `<span class="calm-day-same">${day.adjusted ? 'Dari rencana utama, malam disesuaikan' : 'Sama dengan rencana utama'}</span>` : '';
  const mainLink = day.fromMain ? internalLink(`/#${day.date}`, `Buka hari ${index + 1} di itinerary utama`) : '';
  const dayLink = internalLink(`${calmItineraryPath}#${day.date}`, `Buka hari ${index + 1} di itinerary santai`);
  return `<article class="calm-day" id="${id}" aria-labelledby="${id}-title">
    <header class="calm-day-header"><p class="calm-day-date"><time datetime="${day.date}">${e(longDate(day.date))}</time><span>Hari ${index + 1}</span>${same}</p><h3 id="${id}-title">${e(day.title)}</h3><p class="calm-day-intro">${currencyText(day.intro)}</p>${day.notes.map(noteItem).join('')}</header>
    <div class="calm-day-schedule"><h4>Timeline</h4>${timelineList(day.steps)}</div>
    <div class="calm-day-side">
      <dl class="calm-day-facts">${fact('Menginap', overnightText(day))}${fact('Transport', day.transport)}</dl>
      <h4>Tempat</h4><ul class="calm-stops" role="list">${day.stops.map(stopItem).join('')}</ul>
      ${risksBlock(day.risks)}<p class="prepare-link calm-page-links">${dayLink}${mainLink}</p>
    </div>
  </article>`;
}

const bookingGroup = (group: typeof calmBookingGroups[number]) => `<div class="prepare-group"><h3>${e(group.title)}<span>${e(group.lead)}</span></h3><div class="prepare-bookings">${group.items.map(item => bookingCard(calmCard(item))).join('')}</div></div>`;

const compareColumn = (title: string, items: string[]) => `<div class="calm-compare-column"><h3>${title}</h3>${textList(items)}</div>`;

function intro() {
  const nights = calmDays.filter(day => day.overnight).length;
  const bases = new Set(calmDays.flatMap(day => day.overnight ? [day.overnight.name] : []));
  const same = calmDays.filter(day => day.fromMain && !day.adjusted).map(day => `${dayMonth(day.date)}: ${day.title}.`);
  return `<div class="route-map-intro calm-intro">
      <h1 id="calm-title">Opsi santai, sekali jalan ke Yunnan.</h1>
      <p class="lead">Alternatif yang lebih tenang untuk 8–21 November: dua malam dan satu hari penuh di Jiuzhaigou, Huanglong seharian, lalu empat malam di Chengdu dengan tur sehari ke Bipenggou dan Siguniangshan, lalu kereta D239 ke Lijiang. ${nights} malam di ${bases.size} tempat menginap.</p>
      <p>Rencana utama tidak berubah. Halaman ini untuk membandingkan dan memilih; 19–21 November diambil langsung dari rencana utama; 8 November memakai pagi dan sore rencana utama dengan malam sendiri. Diperiksa <time datetime="${calmCheckedAt}">${fullDay(calmCheckedAt)}</time>.</p>
      <p class="prepare-link calm-page-links">${internalLink(calmItineraryPath, 'Itinerary santai, hari demi hari')}${internalLink(calmPreparePath, 'Persiapan santai')}</p>
    </div>
    <section class="prepare-section calm-compare" aria-labelledby="calm-compare-title"><h2 id="calm-compare-title">Dibanding rencana utama</h2>
      <div class="calm-compare-grid">${compareColumn('Hilang', calmComparison.dropped)}${compareColumn('Bertambah', calmComparison.added)}${compareColumn('Tetap sama', [...same, 'Temanmu bergabung 17 November malam di Shangri-La.'])}</div>
      <h3>Yang perlu ditimbang</h3>${textList(calmTradeOffs)}
    </section>`;
}

export function calmView() {
  return `<a class="skip-link" href="#calm-days-title">Langsung ke hari demi hari</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation(calmPath)}</header>
  <main class="container route-map-page calm-page" data-route-map>
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="/places/">Tempat</a>${icon('right')}<span>Opsi santai</span></nav>
    ${planSwitch(calmPath)}
    ${intro()}
    <div id="calm-map">${routeMapLayout(calmRoute)}</div>
    <section class="prepare-section calm-days" aria-labelledby="calm-days-title"><h2 id="calm-days-title">Hari demi hari</h2>
      <p class="prepare-section-lead">Jam memakai waktu China (WIB + 1 jam). Waktu salat dihitung dengan kriteria Kemenag untuk kota tempat kamu berada.</p>
      <p class="prepare-link">${internalLink(calmItineraryPath, 'Buka sebagai itinerary hari demi hari')}</p>
      ${calmDays.map(dayCard).join('')}
    </section>
    <section class="prepare-section" id="choose" aria-labelledby="choose-title"><h2 id="choose-title">Kalau pilih opsi ini</h2>
      <p class="prepare-section-lead">Yang dibeli atau diminta sekarang. Harga dan jam buka dicek 4–5 November 2026 dari sumber yang disebut di tiap kartu; harga yang dilihat untuk tanggal lain ditandai. Pemesanan 8 dan 18–21 November tetap seperti rencana utama.</p>
      <p class="prepare-link calm-page-links">${internalLink(calmPreparePath, 'Semua pemesanan opsi ini per jam buka')}${internalLink(preparePath, 'Persiapan & pemesanan rencana utama')}</p>
      ${calmBookingGroups.map(bookingGroup).join('')}
      <div class="prepare-group"><h3>Jangan dibeli<span>${e(calmDoNotBuyLead)}</span></h3>${textList(calmDoNotBuy)}</div>
    </section>
    <section class="prepare-section" id="unknowns" aria-labelledby="unknowns-title"><h2 id="unknowns-title">Yang belum diketahui</h2>
      <p class="prepare-section-lead">Belum ada jawabannya per ${fullDay(calmCheckedAt)}; cek sebelum memesan. Hal yang belum diketahui untuk 18–21 November sama dengan rencana utama.</p>
      ${textList(calmUnknowns)}
    </section>
    <section class="guide-source-section" id="sources" aria-labelledby="calm-sources-title"><h2 id="calm-sources-title">Sumber</h2><p>Diperiksa ${fullDay(calmCheckedAt)}. Titik baru di peta (Songpan, Maoxian, Long Lake, Upper Gorge) dari OpenStreetMap; kota lain memakai titik peta rute utama, dan garis menghubungkan titik menurut urutan kunjungan, bukan jalur jalan. Harga, jadwal, dan aturan bisa berubah; ikuti pengumuman resmi saat memesan.</p><ul class="prepare-sources" role="list">${calmSources.map(source => `<li>${externalLink(source)}</li>`).join('')}</ul></section>
  </main>
  <footer class="container guide-footer"><a href="/">Kembali ke itinerary 14 hari</a>${siteCredit()}</footer>`;
}
