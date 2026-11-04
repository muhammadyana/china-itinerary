import { days, type Day } from './itinerary.ts';
import { placePages, placePath } from './guides.ts';
import { preparePath, type Link } from './bookings.ts';
import { staysPath } from './stays.ts';
import { preparedAt } from './prepare.ts';
import { escapeHtml as e, icon, siteCredit } from './render.ts';
import { currencyText, renderExchangeRate } from './currency.ts';
import { renderSiteNavigation } from './site-navigation.ts';
import { categoryTotals, cnyRange as range, costCategories, costLines, friendShare, linesForDate, sumLines, tripcomFee, type CostLine, type Range } from './costs.ts';

export { costsPath } from './costs.ts';

const tripDate = (date: string) => new Date(`${date}T12:00:00+08:00`);
const weekdayDate = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Shanghai' });
const shortWeekday = new Intl.DateTimeFormat('id-ID', { weekday: 'short', timeZone: 'Asia/Shanghai' });
const checked = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${preparedAt}T12:00:00Z`));
const dayNumber = (date: string) => Number(date.slice(-2));
const dayId = (date: string) => `nov-${dayNumber(date)}`;
const categoryLabel = (line: CostLine) => costCategories.find(item => item.id === line.category)!.label;

// Longest names first, so "Kota Tua Dali" wins over a shorter name inside it.
const placesByName = [...placePages].sort((a, b) => b.name.length - a.name.length);
// Booking link first; otherwise the stays card for a night, the guide of the place a leg heads to, or that day in the itinerary.
function lineTarget(line: CostLine): Link {
  if (line.base) return { label: 'Pilihan hotel & hostel', url: `${staysPath}#${line.base.id}` };
  if (line.booking?.link) return line.booking.link;
  const destination = line.label.split(/→|↔/).pop()!;
  const page = placesByName.find(item => destination.includes(item.name));
  return page ? { label: `Panduan ${page.name}`, url: placePath(page.slug) } : { label: `Jadwal ${dayNumber(line.date)} November`, url: `/#${line.date}` };
}

function lineAction(target: Link) {
  const external = !target.url.startsWith('/');
  return `<span class="cost-line-action">${e(target.label)}${external ? `<span class="visually-hidden"> (buka tab baru)</span>${icon('share')}` : icon('right')}</span>`;
}

function lineMeta(line: CostLine) {
  const dates = line.until ? `${dayNumber(line.date)}–${dayNumber(line.until)} November` : '';
  // Most multi-day names already carry their dates.
  const span = dates && (line.label.includes(dates) ? 'dihitung sekali' : `dihitung sekali untuk ${dates}`);
  return `<span class="cost-line-meta">${[categoryLabel(line), line.basis, span].filter(Boolean).map(e).join(' · ')}</span>`;
}

function costLine(line: CostLine) {
  const target = lineTarget(line);
  const newTab = target.url.startsWith('/') ? '' : ' target="_blank" rel="noopener noreferrer"';
  const amount = line.cost ? currencyText(range(line.cost)) : 'Harga belum ada';
  return `<li><a class="cost-line" href="${e(target.url)}"${newTab}>
    <span class="cost-line-name">${e(line.label)}</span>${lineMeta(line)}
    <span class="cost-line-amount${line.cost ? '' : ' is-missing'}">${amount}</span>
    ${line.note ? `<span class="cost-line-note">${currencyText(line.note)}</span>` : ''}${lineAction(target)}
  </a></li>`;
}

function dayTotal(lines: CostLine[]) {
  const missing = lines.filter(line => !line.cost).length;
  return `<p class="costs-day-total"><span>Subtotal</span><strong>${currencyText(range(sumLines(lines)))}</strong>${missing ? `<small>${missing} pos belum ada harganya</small>` : ''}</p>`;
}

function daySection(day: Day) {
  const id = dayId(day.date);
  const lines = linesForDate(day.date);
  return `<section class="costs-day" id="${id}" aria-labelledby="${id}-title">
    <div class="costs-day-header"><h3 id="${id}-title"><span class="costs-day-date">${e(weekdayDate.format(tripDate(day.date)))}</span> ${e(day.shortTitle)}</h3>${dayTotal(lines)}</div>
    <ul class="costs-lines" role="list">${lines.map(costLine).join('')}</ul>
    <p class="prepare-link"><a href="/#${day.date}">Buka jadwal ${dayNumber(day.date)} November${icon('right')}</a></p>
  </section>`;
}

const jumpItem = (day: Day) =>
  `<li><a href="#${dayId(day.date)}"><span>${dayNumber(day.date)}</span> ${e(shortWeekday.format(tripDate(day.date)))}</a></li>`;
const jumpList = () => `<nav class="costs-jump" aria-label="Lompat ke tanggal"><ol role="list">${days.map(jumpItem).join('')}</ol></nav>`;

const categoryRow = (row: { label: string } & Range) => `<div><dt>${e(row.label)}</dt><dd>${currencyText(range(row))}</dd></div>`;

function summary() {
  const missing = costLines.filter(line => !line.cost).length;
  return `<section class="costs-summary" id="summary" aria-labelledby="summary-title">
    <h2 id="summary-title">Total bagianmu</h2>
    <p class="costs-total">${currencyText(range(sumLines(costLines)))}</p>
    <p class="costs-summary-note">Perjalanan ${days.length} hari, ${days.filter(day => day.overnight).length} malam. Sebanyak ${missing} pos belum ada harganya, jadi belum ikut dijumlah.</p>
    <dl class="costs-categories">${categoryTotals().map(categoryRow).join('')}</dl>
    <p class="costs-friend"><span>Bagian temanmu mulai 17 November</span><strong>${currencyText(range(friendShare()))}</strong><span>Tiket Yunnan, separuh kamar, dan separuh mobil atau taksi.</span></p>
    <a class="text-link" href="#not-included">Yang belum termasuk${icon('down')}</a>
  </section>`;
}

const notIncluded = [
  'Makan, minum, dan bekal halal.',
  'Oleh-oleh dan belanja pribadi.',
  'Makan dan menginap sopir mobil sewa, serta biaya kembali kosong (返空费) bila sewa satu arah.',
  'Tiket pesawat dan visa (sudah dibayar).',
  `Biaya pemesanan Trip.com per tiket. Contohnya ${tripcomFee.fee} untuk kereta C5746 tanggal 9 November, di atas harga tiket ${tripcomFee.ticket}.`,
];

const methodNotes = [
  'Tiket dan kursi per orang kamu bayar penuh. Mulai 18 November temanmu membeli tiketnya sendiri.',
  'Mobil dan taksi sampai 17 November kamu tanggung sendiri, mulai 18 November dibagi dua.',
  'Kamar privat mulai malam 17 November dibagi dua; ranjang dorm tetap per orang.',
  'Satu malam dihitung dari tarif terendah pilihan yang lebih murah sampai tarif tertinggi pilihan yang lebih mahal, hotel atau hostel.',
  'Sewa beberapa hari dihitung sekali, di hari pertama.',
  'Bagianmu di setiap pos dibulatkan ke yuan terdekat, lalu dijumlahkan. Subtotal hari, total kategori, dan total di halaman Persiapan memakai angka yang sama.',
  'Pos tanpa harga tetap tampil di harinya, tetapi tidak ikut dijumlah.',
];

const list = (items: string[]) => `<ul class="prepare-list" role="list">${items.map(item => `<li>${e(item)}</li>`).join('')}</ul>`;
const pageLink = (label: string, href: string) => `<a class="text-link" href="${e(href)}">${e(label)}${icon('right')}</a>`;

export function costsView() {
  return `<a class="skip-link" href="#costs-title">Langsung ke rincian biaya</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation()}</header>
  <main class="container prepare-page costs-page">
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="/places/">Tempat</a>${icon('right')}<span>Rincian biaya</span></nav>
    <div class="prepare-intro">
      <h1 id="costs-title">Rincian biaya, hari demi hari.</h1>
      <p class="lead">Tiket, kereta, mobil, dan penginapan per tanggal, dihitung untuk bagianmu. Harga dicek <time datetime="${preparedAt}">${checked}</time>.</p>
    </div>
    <div class="costs-layout">
      ${summary()}
      <section class="prepare-section costs-days" id="days" aria-labelledby="days-title"><h2 id="days-title">Per hari</h2>
        <p class="prepare-section-lead">Ketuk pos untuk membuka tempat memesan, pilihan penginapan, atau panduan tempatnya.</p>
        ${jumpList()}
        ${days.map(daySection).join('')}
      </section>
    </div>
    <section class="prepare-section" id="not-included" aria-labelledby="not-included-title"><h2 id="not-included-title">Belum termasuk</h2>${list(notIncluded)}</section>
    <section class="guide-source-section costs-method" id="method" aria-labelledby="method-title"><h2 id="method-title">Cara menghitung</h2>
      <p>Harga diambil dari daftar pemesanan di halaman Persiapan dan pilihan di halaman Hotel & hostel. Semuanya perkiraan dan bisa berubah saat memesan.</p>
      ${list(methodNotes)}
      ${renderExchangeRate()}
      <p class="costs-method-links">${pageLink('Persiapan & pemesanan', preparePath)}${pageLink('Hotel & hostel per malam', staysPath)}</p>
    </section>
  </main>
  <footer class="container guide-footer"><a href="/">Kembali ke itinerary 14 hari</a>${siteCredit()}</footer>`;
}
