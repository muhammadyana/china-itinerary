import { escapeHtml as e, icon, siteCredit } from './render.ts';
import { renderSiteNavigation } from './site-navigation.ts';
import { formatRupiah } from './currency.ts';
import { expensesPath } from './expenses.ts';
import { calmPath } from './calm-route.ts';
import {
  sharedExpenseItems,
  sharedExpenseSettlement,
  sharedExpensesPath,
  type SharedExpenseItem,
  type SharedPayer,
} from './shared-expenses.ts';

export { sharedExpensesPath } from './shared-expenses.ts';

const dateLabel = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Shanghai',
});
const yuanExact = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const yuanWhole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

const formatDate = (date: string) => dateLabel.format(new Date(`${date}T12:00:00+08:00`));

function formatYuan(item: SharedExpenseItem): string {
  if (item.cny === undefined) return '—';
  const amount = item.cnyApproximate ? yuanWhole.format(item.cny) : yuanExact.format(item.cny);
  return `${item.cnyApproximate ? '≈ ' : ''}¥${amount}`;
}

const payerPill = (payer: SharedPayer) =>
  `<span class="shared-payer shared-payer-${payer === 'Yana' ? 'yana' : 'friend'}">${e(payer)}</span>`;

const cell = (label: string, value: string, className = '') =>
  `<td${className ? ` class="${className}"` : ''} data-label="${e(label)}">${value}</td>`;

function settlementCard() {
  const { transferFrom, transferTo, transferAmount } = sharedExpenseSettlement;
  if (!transferFrom || !transferTo) {
    return `<section class="shared-settle" aria-labelledby="shared-settle-title">
    <p class="shared-settle-kicker" id="shared-settle-title">Hasil akhir</p>
    <p class="shared-settle-amount">Impas</p>
    <p class="shared-settle-note">Tidak ada yang perlu transfer.</p>
  </section>`;
  }
  return `<section class="shared-settle" aria-labelledby="shared-settle-title">
    <p class="shared-settle-kicker" id="shared-settle-title">Hasil akhir</p>
    <p class="shared-settle-line"><span>${e(transferFrom)}</span><span class="shared-settle-arrow" aria-hidden="true">→</span><span>${e(transferTo)}</span></p>
    <p class="shared-settle-amount">${e(formatRupiah(transferAmount))}</p>
    <p class="shared-settle-note">${e(`${transferFrom} transfer ke ${transferTo} ${formatRupiah(transferAmount)}.`)}</p>
  </section>`;
}

const tile = (label: string, value: string) =>
  `<div class="shared-tile"><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`;

function summaryTiles() {
  const { totalIdr, perPerson, paidByYana, paidByFriend } = sharedExpenseSettlement;
  return `<section class="shared-summary" aria-labelledby="shared-summary-title">
    <h2 id="shared-summary-title">Ringkasan pembagian</h2>
    <dl class="shared-tiles">
      ${tile('Total pengeluaran bersama', formatRupiah(totalIdr))}
      ${tile('Bagian per orang', formatRupiah(perPerson))}
      ${tile('Dibayar pakai uang Yana', formatRupiah(paidByYana))}
      ${tile('Dibayar pakai uang Teman', formatRupiah(paidByFriend))}
    </dl>
  </section>`;
}

function itemRow(item: SharedExpenseItem) {
  return `<tr>
    ${cell('No', e(String(item.no)), 'shared-col-no')}
    ${cell('Tanggal', e(formatDate(item.date)), 'shared-col-date')}
    ${cell('Kategori', e(item.category))}
    ${cell('Keterangan', e(item.label), 'shared-col-label')}
    ${cell('Total (CNY)', e(formatYuan(item)), 'shared-col-num')}
    ${cell('Total (IDR)', e(formatRupiah(item.idr)), 'shared-col-num')}
    ${cell('Bagian per orang', e(formatRupiah(item.idr * 0.5)), 'shared-col-num')}
    ${cell('Pakai uang siapa', payerPill(item.paidBy), 'shared-col-payer')}
  </tr>`;
}

function itemsSection() {
  const { totalIdr, perPerson } = sharedExpenseSettlement;
  return `<section class="shared-items" aria-labelledby="shared-items-title">
    <h2 id="shared-items-title">Semua item</h2>
    <div class="shared-table-wrap">
      <table class="shared-table">
        <caption class="visually-hidden">Pengeluaran bersama 17–21 November 2026, dibagi 50/50</caption>
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Tanggal</th>
            <th scope="col">Kategori</th>
            <th scope="col">Keterangan</th>
            <th scope="col" class="shared-col-num">Total (CNY)</th>
            <th scope="col" class="shared-col-num">Total (IDR)</th>
            <th scope="col" class="shared-col-num">Bagian per orang</th>
            <th scope="col">Pakai uang siapa</th>
          </tr>
        </thead>
        <tbody>${sharedExpenseItems.map(itemRow).join('')}</tbody>
        <tfoot>
          <tr>
            <th scope="row" colspan="5" data-label="Ringkasan">TOTAL</th>
            <td class="shared-col-num" data-label="Total (IDR)">${e(formatRupiah(totalIdr))}</td>
            <td class="shared-col-num" data-label="Bagian per orang">${e(formatRupiah(perPerson))}</td>
            <td data-label=""></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>`;
}

function notes() {
  return `<section class="shared-notes" aria-labelledby="shared-notes-title">
    <h2 id="shared-notes-title">Catatan</h2>
    <ul>
      <li>Nilai IDR adalah total yang dibayar untuk 2 orang. Bagian per orang = 50% dari total.</li>
      <li>Angka CNY bertanda ≈ hanya perkiraan harga kamar dari situs; yang dibayar adalah nilai IDR. Tanda — berarti tidak ada data CNY.</li>
      <li>Belum termasuk biaya bersama di lokasi yang tidak tercatat (misalnya tiket Songzanlin 19 Nov).</li>
    </ul>
  </section>`;
}

export function sharedExpensesView() {
  return `<a class="skip-link" href="#shared-expenses-title">Langsung ke pengeluaran bersama</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation(sharedExpensesPath)}</header>
  <main class="container prepare-page shared-expenses-page">
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="${calmPath}">Opsi santai</a>${icon('right')}<a href="${expensesPath}">Pengeluaran trip</a>${icon('right')}<span>Pengeluaran bersama</span></nav>
    <div class="prepare-intro">
      <h1 id="shared-expenses-title">Pengeluaran bersama.</h1>
      <p class="lead">Biaya yang dibagi 50/50 antara Yana dan Teman untuk trip Yunnan, 17–21 November 2026. Isinya sama dengan catatan pembagian, plus rekap siapa transfer ke siapa.</p>
    </div>
    <div class="shared-layout">
      ${settlementCard()}
      ${summaryTiles()}
      ${itemsSection()}
      ${notes()}
    </div>
  </main>
  <footer class="container guide-footer"><a href="${expensesPath}">Kembali ke pengeluaran trip</a>${siteCredit()}</footer>`;
}
