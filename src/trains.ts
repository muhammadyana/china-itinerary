import { bookings } from './prepare.ts';
import { escapeHtml as e, icon, siteCredit } from './render.ts';
import { currencyText } from './currency.ts';
import { renderSiteNavigation } from './site-navigation.ts';

export const trainsPath = '/places/trains/';

// Train rows reuse the booking checklist so links, seats and release times live in one place.
export const trainBookings = bookings.filter(item => item.link?.url.includes('/trains/china/route/'));

export const jiuzhaigouSlots = [
  { trains: 'C5746 06.14 atau C5782 06.45', arrive: '07.53 / 08.30', gate: '±10.00–10.45', slot: '10:00–12:00' },
  { trains: 'C5772 07.30 atau C6362 08.12', arrive: '09.31 / 10.01', gate: '±11.30–12.00', slot: '12:00–14:00' },
];

export const timeline = [
  { date: '2026-11-08', title: 'Minggu, 8 November · Tiba di Chengdu', steps: [
    ['12.20', 'Mendarat di Tianfu (TFU). Imigrasi dan ambil bagasi; tes roaming dan WhatsApp di bandara.'],
    ['±14.00–15.30', 'DiDi atau taksi ke hotel di Chunxi Road, sekitar satu jam lebih.'],
    ['Sore–malam', 'Jalan santai di Chunxi Road dan Taikoo Li, makan malam halal. Beli bekal berlabel 清真 untuk 9–12 November, lalu tidur cepat.'],
  ] },
  { date: '2026-11-09', title: 'Senin, 9 November · Jiuzhaigou', steps: [
    ['05.15', 'DiDi dari hotel ke Chengdu East, sekitar 30 menit. Datang 30–45 menit sebelum kereta untuk pemeriksaan paspor.'],
    ['06.14 / 06.45', 'Kereta C5746 atau C5782 ke Huanglongjiuzhai.'],
    ['07.53 / 08.30', 'Tiba di Huanglongjiuzhai, lalu shuttle sekitar 2 jam ke gerbang Jiuzhaigou.'],
    ['±10.00–10.45', 'Masuk taman dengan slot 10:00–12:00.'],
    ['10.45–17.30', 'Bus taman ke Five Flower Lake, lalu turun lewat Shuzheng. Taman tutup 18.00.'],
    ['±18.00', 'Check-in hotel dekat gerbang, Pengfeng atau Goukou.'],
  ] },
  { date: '2026-11-10', title: 'Selasa, 10 November · Ke Bipenggou', steps: [
    ['07.30', 'Dijemput sopir; berangkat sebelum antrean terowongan Jiuzhai pukul 09.00–11.00.'],
    ['Siang', 'Tol Jiumian, lalu makan siang di Dujiangyan (cari 清真 di Amap).'],
    ['Sore', 'Isi bensin di Lixian.'],
    ['±16.00–17.00', 'Tiba di penginapan dekat gerbang Bipenggou atau di kota Lixian.'],
  ] },
];

const external = (label: string, url: string) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)}<span class="visually-hidden"> (buka tab baru)</span>${icon('share')}</a>`;
const shortDate = (date: string) => `${Number(date.slice(-2))} Nov`;

export function trainsView() {
  return `<a class="skip-link" href="#trains-title">Langsung ke kereta</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation()}</header>
  <main class="container prepare-page trains-page">
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="/places/">Tempat</a>${icon('right')}<span>Kereta & timeline</span></nav>
    <div class="prepare-intro">
      <h1 id="trains-title">Kereta, lalu tiga hari pertama jam demi jam.</h1>
      <p class="lead">Link Trip.com untuk keempat kereta, cara memilih slot Jiuzhaigou, dan timeline 8–10 November dari Tianfu sampai gerbang Bipenggou.</p>
    </div>
    <section class="prepare-section" id="trains" aria-labelledby="trains-list-title"><h2 id="trains-list-title">Tiket kereta</h2>
      <p class="prepare-section-lead">Jam dalam WIB. Di Sichuan kamu sendiri, jadi satu kursi; mulai Shangri-La temanmu ikut, jadi dua kursi atas nama paspor masing-masing.</p>
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
    <section class="prepare-section" id="timeline" aria-labelledby="timeline-title"><h2 id="timeline-title">Timeline 8–10 November</h2>
      ${timeline.map(day => `<div class="prepare-group"><h3>${e(day.title)}</h3><ol class="trains-timeline" role="list">${day.steps.map(([time, text]) => `<li><span class="trains-time">${e(time)}</span><span>${e(text)}</span></li>`).join('')}</ol><p class="prepare-link"><a href="/#${day.date}">Buka jadwal ${e(shortDate(day.date))}${icon('right')}</a></p></div>`).join('')}
    </section>
    <section class="prepare-section" id="back-to-chengdu" aria-labelledby="back-title"><h2 id="back-title">Balik ke Chengdu?</h2>
      <p class="prepare-section-lead">Tidak, dalam rencana sekarang. Pada 10 November sopir menjemput di Jiuzhaigou dan langsung ke Bipenggou lewat tol Jiumian, Dujiangyan dan Lixian. Rutenya melewati Dujiangyan, sekitar satu jam dari Chengdu, tetapi tidak masuk kota.</p>
      <p class="prepare-section-lead">Tanpa mobil privat, jalannya memang kembali ke arah Chengdu: kereta ${external('Huanglongjiuzhai ke Chengdu', 'https://id.trip.com/trains/china/route/huanglongjiuzhai-to-chengdu/')}, bus dari terminal Chadianzi ke Lixian, lalu mobil tumpangan ke gerbang Bipenggou. Jadwal dan harga jalur ini sedang dicek; jangan dipesan dulu.</p>
    </section>
  </main>
  <footer class="container guide-footer"><a href="/">Kembali ke itinerary 14 hari</a>${siteCredit()}</footer>`;
}
