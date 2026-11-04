import { bookings } from './prepare.ts';
import { days } from './itinerary.ts';
import { escapeHtml as e, icon, siteCredit, timelineList } from './render.ts';
import { dayTimelines, type TimelineStep } from './day-timelines.ts';
import { currencyText } from './currency.ts';
import { renderSiteNavigation } from './site-navigation.ts';

export const trainsPath = '/places/trains/';

// Train rows reuse the booking checklist so links, seats and release times live in one place.
export const trainBookings = bookings.filter(item => item.link?.url.includes('/trains/china/route/'));

export const jiuzhaigouSlots = [
  { trains: 'C5746 06.14 (C5782 06.45 tidak sempat shuttle 08.30)', arrive: '07.53', gate: '±10.00–10.45', slot: '10:00–12:00' },
  { trains: 'C5772 07.30 atau C6362 08.12', arrive: '09.31 / 10.01', gate: '±11.30–12.00', slot: '12:00–14:00' },
];

// The 7 November flight has no day panel, so it lives here; the other days come from the day timelines.
const departure = { date: '2026-11-07', title: 'Sabtu, 7 November · Jakarta ke Shanghai', steps: [
    ['15.45 WIB', 'Juneyao HO1568 dari Jakarta (CGK).'],
    ['23.20', 'Mendarat di Terminal 2 Shanghai Pudong (PVG). Imigrasi di sini; bila bagasi tidak langsung ke Chengdu, ambil dan lewati bea cukai. Tes roaming dan WhatsApp.'],
    ['±00.30–06.00', 'Istirahat di Aerotel (Terminal 2 lantai 6) atau area istirahat gratis lantai 3 dekat island M. Bawa bekal halal.'],
] as TimelineStep[] };
const timelineTitles: Record<string, string> = { '2026-11-08': 'Minggu, 8 November · Chengdu & Menara Vitality', '2026-11-09': 'Senin, 9 November · Jiuzhaigou', '2026-11-10': 'Selasa, 10 November · Kereta dan bus ke Lixian' };
export const timeline = [departure, ...Object.entries(timelineTitles).map(([date, title]) => ({ date, title, steps: dayTimelines[date] }))];

const external = (label: string, url: string) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)}<span class="visually-hidden"> (buka tab baru)</span>${icon('share')}</a>`;
const shortDate = (date: string) => `${Number(date.slice(-2))} Nov`;

export function trainsView() {
  return `<a class="skip-link" href="#trains-title">Langsung ke kereta</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation()}</header>
  <main class="container prepare-page trains-page">
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="/places/">Tempat</a>${icon('right')}<span>Kereta & timeline</span></nav>
    <div class="prepare-intro">
      <h1 id="trains-title">Kereta, lalu tiga hari pertama jam demi jam.</h1>
      <p class="lead">Link Trip.com untuk semua kereta, cara memilih slot Jiuzhaigou, dan timeline 7–10 November dari Jakarta sampai kota Lixian.</p>
    </div>
    <section class="prepare-section" id="trains" aria-labelledby="trains-list-title"><h2 id="trains-list-title">Tiket kereta</h2>
      <p class="prepare-section-lead">Jam rilis tiket dalam WIB; jam kereta memakai waktu China (WIB + 1 jam). Di Sichuan kamu sendiri, jadi satu kursi; mulai Shangri-La temanmu ikut, jadi dua kursi atas nama paspor masing-masing.</p>
      <div class="prepare-bookings">${trainBookings.map(item => `<article class="prepare-booking">
        <p class="prepare-booking-date"><time datetime="${item.tripDate}">${shortDate(item.tripDate)}</time>${item.cost ? `<strong>${currencyText(item.cost.min === item.cost.max ? `CNY ${item.cost.min} / orang` : `CNY ${item.cost.min}–${item.cost.max} / orang`)}</strong>` : ''}</p>
        <h3>${e(item.item.replace('Kereta ', ''))}</h3>
        <dl><div><dt>Dibuka</dt><dd>${e(item.opens)}</dd></div><div><dt>Pilihan</dt><dd>${currencyText(item.note)}</dd></div></dl>
        ${item.link ? `<p class="prepare-link">${external(item.link.label, item.link.url)}</p>` : ''}
      </article>`).join('')}</div>
    </section>
    <section class="prepare-section" id="jiuzhaigou" aria-labelledby="jiuzhaigou-title"><h2 id="jiuzhaigou-title">Tiket Jiuzhaigou</h2>
      <p class="prepare-section-lead">Di Trip.com pilih <strong>Ticket + Sightseeing Bus Ticket (Adult, Non-Chinese mainland visitors)</strong>. Itu tiket masuk taman ditambah bus di dalam taman, ${currencyText('CNY 280')} untuk 9 November; bukan bus dari Chengdu. Batas masuk pukul 14.00, jadi pilih slot sesuai kereta:</p>
      <table class="prepare-costs"><thead><tr><th scope="col">Kereta</th><th scope="col">Tiba di stasiun</th><th scope="col">Di gerbang</th><th scope="col">Slot</th></tr></thead><tbody>${jiuzhaigouSlots.map(row => `<tr><th scope="row">${e(row.trains)}</th><td>${e(row.arrive)}</td><td>${e(row.gate)}</td><td><strong>${e(row.slot)}</strong></td></tr>`).join('')}</tbody></table>
    </section>
    <section class="prepare-section" id="timeline" aria-labelledby="timeline-title"><h2 id="timeline-title">Timeline 7–10 November</h2>
      <p class="prepare-section-lead">Jam memakai waktu China (WIB + 1 jam), kecuali yang ditandai WIB.</p>
      ${timeline.map(day => `<div class="prepare-group"><h3>${e(day.title)}</h3>${timelineList(day.steps)}${days.some(item => item.date === day.date) ? `<p class="prepare-link"><a href="/#${day.date}">Buka jadwal ${e(shortDate(day.date))}${icon('right')}</a></p>` : ''}</div>`).join('')}
    </section>
    <section class="prepare-section" id="back-to-chengdu" aria-labelledby="back-title"><h2 id="back-title">Balik ke Chengdu?</h2>
      <p class="prepare-section-lead">Ya. Rute Sichuan sekarang memakai transportasi umum: dari Jiuzhaigou kembali ke Chengdu naik kereta ${external('Huanglongjiuzhai ke Chengdu', 'https://id.trip.com/trains/china/route/huanglongjiuzhai-to-chengdu/')}, lalu bus dari terminal Chadianzi ke Lixian. Mobil sewa baru dipakai 11–12 November, karena tidak ada bus dari Bipenggou lewat 理小路 ke Rilong.</p>
    </section>
  </main>
  <footer class="container guide-footer"><a href="/">Kembali ke itinerary 14 hari</a>${siteCredit()}</footer>`;
}
