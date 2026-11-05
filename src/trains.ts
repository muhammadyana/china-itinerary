import { bookings, type Booking } from './prepare.ts';
import type { Link } from './bookings.ts';
import { days } from './itinerary.ts';
import { escapeHtml as e, icon, siteCredit, timelineList } from './render.ts';
import { dayTimelines, type TimelineStep } from './day-timelines.ts';
import { currencyText } from './currency.ts';
import { planSwitch, renderSiteNavigation } from './site-navigation.ts';

export const trainsPath = '/places/trains/';

// Train rows reuse the booking checklist so links, seats and release times live in one place.
export const trainBookings = bookings.filter(item => item.link?.url.includes('/trains/china/route/'));

export interface SlotRow { trains: string; arrive: string; gate: string; slot: string }
export const jiuzhaigouSlots: SlotRow[] = [
  { trains: 'C5746 06.14 (C5782 06.45 tidak sempat shuttle 08.30)', arrive: '07.53', gate: '±10.00–10.45', slot: '10:00–12:00' },
  { trains: 'C5772 07.30', arrive: '09.31', gate: '±11.30–12.00', slot: '12:00–14:00' },
];

// The 7 November flight has no day panel, so it lives here; the other days come from the day timelines.
const departure = { date: '2026-11-07', title: 'Sabtu, 7 November · Jakarta ke Shanghai', steps: [
    ['15.45 WIB', 'Juneyao HO1568 dari Jakarta (CGK).'],
    ['23.20', 'Mendarat di Terminal 2 Shanghai Pudong (PVG). Imigrasi di sini; bila bagasi tidak langsung ke Chengdu, ambil dan lewati bea cukai. Tes roaming dan WhatsApp.'],
    ['±00.30–06.00', 'Istirahat di Aerotel (Terminal 2 lantai 6) atau area istirahat gratis lantai 3 dekat island M. Bawa bekal halal.'],
] as TimelineStep[] };
const timelineTitles: Record<string, string> = { '2026-11-08': 'Minggu, 8 November · Chengdu & Menara Vitality', '2026-11-09': 'Senin, 9 November · Jiuzhaigou', '2026-11-10': 'Selasa, 10 November · Kereta dan bus ke Lixian' };
export const timeline = [departure, ...Object.entries(timelineTitles).map(([date, title]) => ({ date, title, steps: dayTimelines[date] }))];

export const external = (label: string, url: string) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)}<span class="visually-hidden"> (buka tab baru)</span>${icon('share')}</a>`;
export const shortDate = (date: string) => `${Number(date.slice(-2))} Nov`;

/** One ticket card: `price` is plain text beside the date; each fact's detail is HTML, formatted by the mapping. */
export interface TrainCard { date: string; price?: string; title: string; facts: [string, string][]; link?: Link }
export const perPerson = ({ min, max }: { min: number; max: number }) => min === max ? `CNY ${min} / orang` : `CNY ${min}–${max} / orang`;
export const mainTrainCard = (item: Booking): TrainCard => ({
  date: item.tripDate, price: item.cost && perPerson(item.cost), title: item.item.replace('Kereta ', ''),
  facts: [['Dibuka', e(item.opens)], ['Pilihan', currencyText(item.note)]], link: item.link,
});

const fact = ([term, detail]: [string, string]) => `<div><dt>${e(term)}</dt><dd>${detail}</dd></div>`;

function trainCard(card: TrainCard) {
  return `<article class="prepare-booking">
        <p class="prepare-booking-date"><time datetime="${card.date}">${shortDate(card.date)}</time>${card.price ? `<strong>${currencyText(card.price)}</strong>` : ''}</p>
        <h3>${e(card.title)}</h3>
        <dl>${card.facts.map(fact).join('')}</dl>
        ${card.link ? `<p class="prepare-link">${external(card.link.label, card.link.url)}</p>` : ''}
      </article>`;
}

/** `lead` is literal interface HTML. */
export const ticketsSection = (lead: string, cards: TrainCard[]) => `<section class="prepare-section" id="trains" aria-labelledby="trains-list-title"><h2 id="trains-list-title">Tiket kereta</h2>
      <p class="prepare-section-lead">${lead}</p>
      <div class="prepare-bookings">${cards.map(trainCard).join('')}</div>
    </section>`;

const slotRow = (row: SlotRow) => `<tr><th scope="row">${e(row.trains)}</th><td>${e(row.arrive)}</td><td>${e(row.gate)}</td><td><strong>${e(row.slot)}</strong></td></tr>`;

/** The Jiuzhaigou ticket and the slot for each train; `title` is plain text, `lead` and `after` are literal interface HTML. */
export const slotsSection = (title: string, lead: string, rows: SlotRow[], after = '') => `<section class="prepare-section" id="jiuzhaigou" aria-labelledby="jiuzhaigou-title"><h2 id="jiuzhaigou-title">${e(title)}</h2>
      <p class="prepare-section-lead">${lead}</p>
      <table class="prepare-costs"><thead><tr><th scope="col">Kereta</th><th scope="col">Tiba di stasiun</th><th scope="col">Di gerbang</th><th scope="col">Slot</th></tr></thead><tbody>${rows.map(slotRow).join('')}</tbody></table>${after}
    </section>`;

// China Railway's carry-on rule, re-checked 5 November 2026; Trip.com's route pages state a stricter 130 cm per item.
export const luggageCheckedAt = '2026-11-05';
export const luggageSources: Link[] = [
  { label: 'China Railway lewat People’s Daily: aturan barang bawaan di kereta (24 Februari 2025)', url: 'https://www.peopleapp.com/column/30048338047-500006109068' },
  { label: 'China Railway lewat Yangtse Evening Post: batas 130 cm untuk tripod dan joran di kereta cepat (4 Mei 2026)', url: 'https://www.yzwb.net/news/txs/202605/t20260504_349331.html' },
  { label: 'Trip.com: halaman rute Chengdu ke Lijiang, bagian bagasi (dicek 5 November 2026)', url: 'https://id.trip.com/trains/china/route/chengdu-to-lijiang/' },
];
const luggageRules = [
  'Menurut China Railway, setiap barang bawaan boleh berukuran paling besar 160 cm (panjang + lebar + tinggi). Bagasi gratis 20 kg per penumpang dewasa, 10 kg untuk anak.',
  'Batas 130 cm di kereta cepat (动车组, termasuk semua kereta C dan D di rute ini) berlaku untuk barang panjang seperti tripod dan joran, diukur dalam keadaan dilipat.',
  'Untuk koper 28–30 inci: ukur panjang + lebar + tinggi termasuk roda dan pegangan, lalu timbang. Koper yang penuh biasanya lebih dulu melewati 20 kg daripada 160 cm. Simpan di rak koper besar di ujung gerbong; kereta China tidak menitipkan bagasi.',
  'Halaman rute Trip.com menulis 130 cm per barang, berbeda dari aturan China Railway. Seberapa ketat petugas menerapkannya belum ada di sumber resmi.',
];
export const luggageSection = () => `<section class="prepare-section" id="luggage" aria-labelledby="luggage-title"><h2 id="luggage-title">Bagasi di kereta</h2>
      <p class="prepare-section-lead">Berlaku untuk semua kereta di rute ini. Dicek <time datetime="${luggageCheckedAt}">5 November 2026</time>.</p>
      <ul class="prepare-list" role="list">${luggageRules.map(rule => `<li>${e(rule)}</li>`).join('')}</ul>
      <ul class="prepare-sources" role="list">${luggageSources.map(source => `<li>${external(source.label, source.url)}</li>`).join('')}</ul>
    </section>`;

/** One day of the timeline; `href` opens that day's full plan. */
export interface TimelineDay { date: string; title: string; steps: TimelineStep[]; href?: string }
const timelineDay = (day: TimelineDay) => `<div class="prepare-group"><h3>${e(day.title)}</h3>${timelineList(day.steps)}${day.href ? `<p class="prepare-link"><a href="${e(day.href)}">Buka jadwal ${e(shortDate(day.date))}${icon('right')}</a></p>` : ''}</div>`;
export const timelineSection = (title: string, entries: TimelineDay[]) => `<section class="prepare-section" id="timeline" aria-labelledby="timeline-title"><h2 id="timeline-title">${e(title)}</h2>
      <p class="prepare-section-lead">Jam memakai waktu China (WIB + 1 jam), kecuali yang ditandai WIB.</p>
      ${entries.map(timelineDay).join('')}
    </section>`;

/** What one trains page says around the shared sections. `intro` and `sections` are literal HTML; the rest is plain text. */
export interface TrainsPage { path: string; parent: Link; current: string; title: string; intro: string; sections: string[]; footer: Link }

const mainTrainsPage: TrainsPage = {
  path: trainsPath, parent: { label: 'Tempat', url: '/places/' }, current: 'Kereta & timeline', title: 'Kereta, lalu tiga hari pertama jam demi jam.',
  intro: 'Link Trip.com untuk semua kereta, cara memilih slot Jiuzhaigou, aturan bagasi, dan timeline 7–10 November dari Jakarta sampai kota Lixian.',
  sections: [
    ticketsSection('Jam rilis tiket dalam WIB; jam kereta memakai waktu China (WIB + 1 jam). Di Sichuan kamu sendiri, jadi satu kursi; mulai Shangri-La temanmu ikut, jadi dua kursi atas nama paspor masing-masing.', trainBookings.map(mainTrainCard)),
    slotsSection('Tiket Jiuzhaigou', `Di Trip.com pilih <strong>Ticket + Sightseeing Bus Ticket (Adult, Non-Chinese mainland visitors)</strong>. Itu tiket masuk taman ditambah bus di dalam taman, ${currencyText('CNY 280')} untuk 9 November; bukan bus dari Chengdu. Batas masuk pukul 14.00, jadi pilih slot sesuai kereta:`, jiuzhaigouSlots),
    luggageSection(),
    timelineSection('Timeline 7–10 November', timeline.map(day => ({ ...day, href: days.some(item => item.date === day.date) ? `/#${day.date}` : undefined }))),
    `<section class="prepare-section" id="back-to-chengdu" aria-labelledby="back-title"><h2 id="back-title">Balik ke Chengdu?</h2>
      <p class="prepare-section-lead">Ya. Rute Sichuan sekarang memakai transportasi umum: dari Jiuzhaigou kembali ke Chengdu naik kereta ${external('Huanglongjiuzhai ke Chengdu', 'https://id.trip.com/trains/china/route/huanglongjiuzhai-to-chengdu/')}, lalu bus dari terminal Chadianzi ke Lixian. Mobil sewa baru dipakai 11–12 November, karena tidak ada bus dari Bipenggou lewat 理小路 ke Rilong.</p>
    </section>`,
  ],
  footer: { label: 'Kembali ke itinerary 14 hari', url: '/' },
};

export function trainsView(page = mainTrainsPage) {
  return `<a class="skip-link" href="#trains-title">Langsung ke kereta</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation(page.path)}</header>
  <main class="container prepare-page trains-page">
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="${e(page.parent.url)}">${e(page.parent.label)}</a>${icon('right')}<span>${e(page.current)}</span></nav>
    ${planSwitch(page.path)}
    <div class="prepare-intro">
      <h1 id="trains-title">${e(page.title)}</h1>
      <p class="lead">${page.intro}</p>
    </div>
    ${page.sections.join('\n    ')}
  </main>
  <footer class="container guide-footer"><a href="${e(page.footer.url)}">${e(page.footer.label)}</a>${siteCredit()}</footer>`;
}
