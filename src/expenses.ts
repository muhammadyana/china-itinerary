import { escapeHtml as e, icon, siteCredit } from './render.ts';
import { renderSiteNavigation } from './site-navigation.ts';
import { formatRupiah } from './currency.ts';
import { calmBookingGroups, calmItineraryPath, calmPath } from './calm-route.ts';
import { calmStayBases } from './calm-stays.ts';
import { calmCostsPath } from './calm-costs.ts';

// The trip's spending page: what was paid before leaving (from the owner's order screenshots, already on the site) and a
// tracker for what is spent on the road, kept in this phone's browser only so personal entries never reach the public repo.
export const expensesPath = '/places/expenses/';

/** `date` is empty for costs paid before the trip without a trip date (the visa). */
export interface PaidItem { date: string; label: string; idr: number }

// Only the visa and the flights (outbound and return) live outside the calm booking and stay data (owner's figures, 7–8 November 2026).
const beforeTrip: PaidItem[] = [
  { date: '', label: 'Visa China', idr: 1500000 },
  { date: '2026-11-07', label: 'Tiket pesawat Juneyao CGK → Shanghai Pudong → Chengdu Tianfu', idr: 2460880 },
  { date: '2026-11-21', label: 'Tiket pulang Xiamen Airlines KMG → Xiamen → Jakarta', idr: 3076210 },
];

export const paidItems: PaidItem[] = [
  ...beforeTrip,
  ...calmBookingGroups.flatMap(group => group.items).flatMap(item => item.paid ? [{ date: item.date, label: item.item, idr: item.paid }] : []),
  ...calmStayBases.flatMap(base => base.paid ? [{ date: base.nights[0], label: `${base.hotel.name}, ${base.nights.length} malam`, idr: base.paid }] : []),
].sort((a, b) => a.date.localeCompare(b.date));

export const paidTotal = paidItems.reduce((sum, item) => sum + item.idr, 0);

/** Spending categories; the id is stored with each entry, the label is shown. */
export const expenseCategories = [
  { id: 'food', label: 'Makan & minum' },
  { id: 'transport', label: 'Transport' },
  { id: 'tickets', label: 'Tiket & tur' },
  { id: 'stay', label: 'Penginapan' },
  { id: 'shopping', label: 'Belanja & oleh-oleh' },
  { id: 'other', label: 'Lainnya' },
] as const;

const shortDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Shanghai' });
export const dayLabel = (date: string) => shortDate.format(new Date(`${date}T12:00:00+08:00`));

const paidRow = (item: PaidItem) =>
  `<li class="expense-row"><span class="expense-date">${e(item.date ? dayLabel(item.date) : 'Pra-trip')}</span><span class="expense-label">${e(item.label)}</span><span class="expense-amount">${e(formatRupiah(item.idr))}</span></li>`;

const summaryTile = (id: string, label: string, value: string) =>
  `<div class="expense-tile"><dt>${e(label)}</dt><dd id="${id}">${e(value)}</dd></div>`;

function summary() {
  return `<section class="expense-summary" aria-labelledby="expense-summary-title">
    <h2 id="expense-summary-title">Total pengeluaran</h2>
    <p class="expense-grand" id="expense-grand">${e(formatRupiah(paidTotal))}</p>
    <dl class="expense-tiles">${summaryTile('expense-paid-total', 'Dibayar sebelum berangkat', formatRupiah(paidTotal))}${summaryTile('expense-trip-total', 'Selama perjalanan', formatRupiah(0))}</dl>
    <p class="expense-note">Yuan dihitung ke rupiah dengan kurs referensi ECB; kurs kartu atau Alipay bisa sedikit berbeda.</p>
  </section>`;
}

const categoryOption = ({ id, label }: { id: string; label: string }) => `<option value="${id}">${e(label)}</option>`;

const field = (id: string, label: string, control: string, wide = false) =>
  `<div class="expense-field${wide ? ' expense-field-wide' : ''}"><label for="${id}">${e(label)}</label>${control}</div>`;

function entryForm() {
  return `<form class="expense-form" id="expense-form" novalidate>
    ${field('expense-date', 'Tanggal', '<input id="expense-date" name="date" type="date" min="2026-11-07" max="2026-11-21" value="2026-11-08" required>')}
    ${field('expense-category', 'Kategori', `<select id="expense-category" name="category">${expenseCategories.map(categoryOption).join('')}</select>`)}
    ${field('expense-note', 'Keterangan', '<input id="expense-note" name="note" type="text" maxlength="80" placeholder="Misalnya: makan malam di Songpan" required>', true)}
    ${field('expense-amount', 'Jumlah', '<input id="expense-amount" name="amount" type="number" inputmode="decimal" min="0" step="0.01" required>')}
    ${field('expense-currency', 'Mata uang', '<select id="expense-currency" name="currency"><option value="CNY">CNY (yuan)</option><option value="IDR">IDR (rupiah)</option></select>')}
    <p class="expense-error" id="expense-error" role="alert" hidden></p>
    <button class="expense-submit" type="submit">Tambah</button>
  </form>`;
}

const backup = () => `<div class="expense-backup">
  <button type="button" class="quiet-button" data-expense-action="export">Simpan cadangan (.json)</button>
  <label class="quiet-button expense-import">Pulihkan cadangan<input type="file" accept="application/json,.json" data-expense-action="import"></label>
</div>`;

export function expensesView() {
  return `<a class="skip-link" href="#expenses-title">Langsung ke pengeluaran</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation(expensesPath)}</header>
  <main class="container prepare-page expenses-page" data-expenses>
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="${calmPath}">Opsi santai</a>${icon('right')}<span>Pengeluaran trip</span></nav>
    <div class="prepare-intro">
      <h1 id="expenses-title">Pengeluaran trip.</h1>
      <p class="lead">Yang sudah dibayar sebelum berangkat, ditambah catatan belanja harian selama 8–21 November. Catatan harian tersimpan di browser ponsel ini saja.</p>
    </div>
    <div class="expenses-layout">
      ${summary()}
      <section class="prepare-section" aria-labelledby="expense-add-title"><h2 id="expense-add-title">Catat pengeluaran</h2>${entryForm()}</section>
      <section class="prepare-section" aria-labelledby="expense-trip-title">
        <h2 id="expense-trip-title">Selama perjalanan</h2>
        <dl class="expense-categories" id="expense-categories"></dl>
        <div id="expense-days"><p class="expense-empty">Belum ada catatan. Tambahkan pengeluaran pertama lewat formulir di atas.</p></div>
        ${backup()}
      </section>
      <section class="prepare-section" aria-labelledby="expense-paid-title">
        <h2 id="expense-paid-title">Dibayar sebelum berangkat</h2>
        <ul class="expense-list" role="list">${paidItems.map(paidRow).join('')}</ul>
        <p class="expense-note">Dari bukti pemesanan Trip.com dan biaya visa. Perkiraan sisa biaya ada di <a class="text-link" href="${calmCostsPath}">rincian biaya santai</a>.</p>
      </section>
    </div>
  </main>
  <footer class="container guide-footer"><a href="${calmItineraryPath}">Kembali ke itinerary santai</a>${siteCredit()}</footer>`;
}
