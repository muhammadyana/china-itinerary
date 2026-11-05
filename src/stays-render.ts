import { photos } from './itinerary.ts';
import { stayBaseForDate, stayBases, stayBudget, stayNights, staysCheckedAt, staysPath, type Stay, type StayBase } from './stays.ts';
import type { Link } from './bookings.ts';
import { escapeHtml as e, icon, photoImage, siteCredit } from './render.ts';
import { currencyText, renderExchangeRate } from './currency.ts';
import { planSwitch, renderSiteNavigation } from './site-navigation.ts';

const external = (label: string, url: string) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)}<span class="visually-hidden"> (buka tab baru)</span>${icon('share')}</a>`;
const shortDate = (date: string) => `${Number(date.slice(-2))} November`;
const checked = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${staysCheckedAt}T12:00:00Z`));
/** The nights a base covers and where each night's day plan lives; the main plan's itinerary by default. */
export interface StayNights { nights: (base: StayBase) => { date: string; title: string }[]; dayHref: (date: string) => string }
const mainNights: StayNights = { nights: stayNights, dayHref: date => `/#${date}` };

const nightLabel = (base: StayBase, source = mainNights) => {
  const nights = source.nights(base);
  return `${nights.map(day => shortDate(day.date)).join(' & ')} · ${nights.length} malam`;
};

function stayCard(stay: Stay, base: StayBase, compact = false) {
  const photo = stay.photo ? photos[stay.photo.id] : undefined;
  const id = `stay-${base.id}-${stay.kind.toLowerCase()}`;
  const headingId = `${id}-name${compact ? '-compact' : ''}`;
  const gallery = stay.links.find(link => link.gallery) ?? stay.links[0];
  const links = compact ? [] : stay.links.filter(link => photo || link !== gallery);
  return `<article class="stay-card${compact ? ' stay-card-compact' : ''}"${compact ? '' : ` id="${id}"`} aria-labelledby="${headingId}">
    ${photo ? `<figure class="stay-photo">${photoImage(stay.photo!.id, stay.photo!.alt, false, compact ? '(min-width: 960px) 360px, 92vw' : '(min-width: 960px) 560px, 92vw')}<figcaption>Foto properti: ${external(photo.author, photo.source)} · ${photo.licenseUrl === photo.source ? e(photo.license) : external(photo.license, photo.licenseUrl)}</figcaption></figure>` : ''}
    <div class="stay-card-body">
      <h3 id="${headingId}">${e(stay.name)}</h3>
      ${stay.chinese ? `<p class="stay-chinese" lang="zh-Hans">${e(stay.chinese)}</p>` : ''}
      <p class="stay-meta"><span class="state${stay.kind === 'Hotel' ? ' confirmed' : ''}">${e(stay.kind)}</span><span class="stay-room">${e(stay.room)}</span>${stay.overBudget ? `<span class="state stay-over-budget">Di atas ${stayBudget.rupiah}</span>` : ''}<strong>${currencyText(stay.price)}</strong></p>
      <p class="stay-reason">${e(stay.reason)}</p>
      ${compact ? '' : `<dl class="stay-facts">
        <div><dt>${icon('pin')}Lokasi</dt><dd>${e(stay.location)}${stay.chineseAddress ? `<span lang="zh-Hans">${e(stay.chineseAddress)}</span>` : ''}</dd></div>
        <div><dt>${icon('wallet')}Harga</dt><dd>${currencyText(stay.priceNote)}</dd></div>
        <div><dt>${icon('check')}Paspor asing</dt><dd>${e(stay.foreignGuests)}</dd></div>
        ${stay.rooms ? `<div><dt>${icon('bed')}Kamar</dt><dd>${e(stay.rooms)}</dd></div>` : ''}
        ${stay.halal ? `<div><dt>${icon('info')}Makan halal</dt><dd>${e(stay.halal)}</dd></div>` : ''}
      </dl>`}
      <div class="stay-links">${photo || !gallery ? '' : external(`Lihat foto ${stay.kind.toLowerCase()} di ${gallery.label}`, gallery.url)}${links.map(link => external(link.label, link.url)).join('')}${compact ? `<a href="${staysPath}#${id}">Detail & sumber${icon('right')}</a>` : ''}</div>
      ${compact ? '' : `<details class="stay-sources"><summary>Sumber pemeriksaan${icon('down')}</summary><ul>${stay.sources.map(source => `<li>${external(source.title, source.url)}</li>`).join('')}</ul></details>`}
    </div>
  </article>`;
}

function stayBaseSection(base: StayBase, source: StayNights) {
  return `<section class="stay-base" id="${e(base.id)}" aria-labelledby="${e(base.id)}-title ${e(base.id)}-nights">
    <div class="stay-base-header">
      ${photos[base.areaPhoto.id] ? `<figure class="stay-area">${photoImage(base.areaPhoto.id, base.areaPhoto.alt, false, '(min-width: 960px) 420px, 92vw')}<figcaption>${e(base.areaPhoto.label)}</figcaption></figure>` : ''}
      <div class="stay-base-copy">
        <h2 id="${e(base.id)}-title">${e(base.name)}</h2>
        <p class="stay-nights" id="${e(base.id)}-nights">${icon('calendar')}${nightLabel(base, source)}</p>
        <p>${e(base.area)}</p>
        ${base.notes.map(note => `<p class="stay-base-note">${currencyText(note)}</p>`).join('')}
        <div class="stay-base-dates">${source.nights(base).map(day => `<a class="quiet-button" href="${e(source.dayHref(day.date))}">${icon('calendar')}<span>${shortDate(day.date)}<small>${e(day.title)}</small></span>${icon('right')}</a>`).join('')}</div>
      </div>
    </div>
    <div class="stay-pair">${stayCard(base.hotel, base)}${stayCard(base.hostel, base)}</div>
  </section>`;
}

/** What one stays page says around the shared sections. `intro` and `method` are literal interface HTML; the other text fields are escaped. */
export interface StaysPage { path: string; bases: StayBase[]; source: StayNights; parent: Link; current: string; title: string; intro: string; method: string; footer: Link }

const mainStaysPage: StaysPage = {
  path: staysPath, bases: stayBases, source: mainNights, parent: { label: 'Tempat', url: '/places/' }, current: 'Hotel & hostel', title: 'Tempat tidur, malam demi malam.',
  intro: `<p class="lead">Satu hotel hemat dan satu hostel untuk setiap kota menginap, dari Chengdu sampai Kunming, dengan batas ${stayBudget.rupiah} per malam. Semua pilihan menerima tamu berpaspor asing menurut sumber yang dicek ${checked}.</p>
      <p>Harga adalah perkiraan kamar per malam dan belum dipesan. Bandingkan tanggal 2026 langsung di penyedia sebelum membayar. Foto properti hanya ditampilkan bila lisensinya mengizinkan; selebihnya, buka galeri penyedia.</p>`,
  method: `<p>Riset diperiksa <time datetime="${staysCheckedAt}">${checked}</time> dari halaman penyedia, situs resmi, dan ulasan tamu 2024–2026. Setiap pilihan dicek ulang secara terpisah: properti masih beroperasi, berada di kawasan menginap itinerary, dan menerima paspor non-Tiongkok. Izin pendaftaran tamu asing di China dapat berubah; konfirmasikan saat memesan.</p><p>Tidak ada penginapan yang sudah dipesan. Nama penginapan di halaman jadwal tetap berupa area rencana.</p>`,
  footer: { label: 'Kembali ke itinerary 14 hari', url: '/' },
};

const indexItem = (base: StayBase, source: StayNights) => `<li><a href="#${e(base.id)}"><span>${source.nights(base).map(day => day.date.slice(-2)).join('–')}</span>${e(base.name)}</a></li>`;

export function staysView(page = mainStaysPage) {
  return `<a class="skip-link" href="#stays-title">Langsung ke daftar penginapan</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation(page.path)}</header>
  <main class="container stays-page" data-stays>
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="${e(page.parent.url)}">${e(page.parent.label)}</a>${icon('right')}<span>${e(page.current)}</span></nav>
    ${planSwitch(page.path)}
    <div class="stays-intro">
      <h1 id="stays-title">${e(page.title)}</h1>
      ${page.intro}
      ${renderExchangeRate()}
    </div>
    <nav class="stays-index" aria-label="Lompat ke malam"><ol role="list">${page.bases.map(base => indexItem(base, page.source)).join('')}</ol></nav>
    ${page.bases.map(base => stayBaseSection(base, page.source)).join('')}
    <section class="guide-source-section" id="sources" aria-labelledby="stays-sources-heading"><h2 id="stays-sources-heading">Cara memilih</h2>${page.method}</section>
  </main>
  <footer class="container guide-footer"><a href="${e(page.footer.url)}">${e(page.footer.label)}</a>${siteCredit()}</footer>`;
}

export function renderStaySummary(date: string) {
  const base = stayBaseForDate(date);
  if (!base) return '';
  return `<section class="guide-stays" aria-labelledby="guide-stays-heading"><div class="guide-section-heading"><h2 id="guide-stays-heading">Menginap di ${e(base.name)}.</h2><p>${nightLabel(base)}. Satu hotel hemat dan satu hostel di bawah ${stayBudget.rupiah} per malam yang menerima paspor asing.</p></div><div class="stay-pair">${stayCard(base.hotel, base, true)}${stayCard(base.hostel, base, true)}</div><a class="text-link stays-all-link" href="${staysPath}#${e(base.id)}">Semua penginapan di rute${icon('right')}</a></section>`;
}
