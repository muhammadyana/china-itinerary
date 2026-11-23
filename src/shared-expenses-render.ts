import { escapeHtml as e, icon, siteCredit } from './render.ts';
import { renderSiteNavigation } from './site-navigation.ts';
import { formatRupiah } from './currency.ts';
import { expensesPath } from './expenses.ts';
import { calmPath } from './calm-route.ts';
import {
  sharedExpenseCategories,
  sharedExpensesPath,
  type SharedExpenseItem,
  type SharedExpenseSettlement,
  type SharedPayer,
} from './shared-expenses.ts';

export { sharedExpensesPath } from './shared-expenses.ts';

const dateLabel = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Shanghai',
});
const yuanExact = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const yuanWhole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const formatSharedDate = (date: string) => dateLabel.format(new Date(`${date}T12:00:00+08:00`));

export function formatYuan(item: Pick<SharedExpenseItem, 'cny' | 'cnyApproximate'>): string {
  if (item.cny === undefined) return '—';
  const amount = item.cnyApproximate ? yuanWhole.format(item.cny) : yuanExact.format(item.cny);
  return `${item.cnyApproximate ? '≈ ' : ''}¥${amount}`;
}

const payerPill = (payer: SharedPayer | null) =>
  payer
    ? `<span class="shared-payer shared-payer-${payer === 'Yana' ? 'yana' : 'friend'}">${e(payer)}</span>`
    : '—';

const cell = (label: string, value: string, className = '') =>
  `<td${className ? ` class="${className}"` : ''} data-label="${e(label)}"><div class="shared-cell-clip"><div class="shared-cell-inner">${value}</div></div></td>`;

export function settlementCardHtml(settlement: SharedExpenseSettlement): string {
  const { transferFrom, transferTo, transferAmount } = settlement;
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

export function summaryTilesHtml(settlement: SharedExpenseSettlement): string {
  const { totalIdr, perPerson, paidByYana, paidByFriend } = settlement;
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

function itemRow(item: SharedExpenseItem): string {
  return `<tr data-item-id="${e(item.id)}">
    ${cell('No', e(String(item.no)), 'shared-col-no')}
    ${cell('Tanggal', e(formatSharedDate(item.date)), 'shared-col-date')}
    ${cell('Kategori', e(item.category), 'shared-col-category')}
    ${cell('Keterangan', e(item.label), 'shared-col-label')}
    ${cell('Total (CNY)', e(formatYuan(item)), 'shared-col-num')}
    ${cell('Total (IDR)', e(formatRupiah(item.idr)), 'shared-col-num')}
    ${cell('Bagian per orang', e(formatRupiah(item.idr * 0.5)), 'shared-col-num')}
    ${cell('Pakai uang siapa', payerPill(item.paidBy), 'shared-col-payer')}
    ${cell('Aksi', `<button type="button" class="shared-row-action shared-row-edit" data-shared-edit="${e(item.id)}" aria-label="Ubah" title="Ubah">${icon('edit')}</button><button type="button" class="shared-row-action shared-row-delete" data-shared-delete="${e(item.id)}" aria-label="Hapus" title="Hapus">${icon('trash')}</button>`, 'shared-col-actions')}
  </tr>`;
}

export function itemsSectionHtml(items: SharedExpenseItem[], settlement: SharedExpenseSettlement): string {
  const { totalIdr, perPerson } = settlement;
  return `<section class="shared-items" aria-labelledby="shared-items-title">
    <h2 id="shared-items-title">Semua item</h2>
    <div class="shared-table-wrap">
      <table class="shared-table">
        <caption class="visually-hidden">Pengeluaran bersama 17–21 November 2026, dibagi 50/50</caption>
        <thead>
          <tr>
            <th scope="col" class="shared-col-no">No</th>
            <th scope="col" class="shared-col-date">Tanggal</th>
            <th scope="col" class="shared-col-category">Kategori</th>
            <th scope="col" class="shared-col-label">Keterangan</th>
            <th scope="col" class="shared-col-num">Total (CNY)</th>
            <th scope="col" class="shared-col-num">Total (IDR)</th>
            <th scope="col" class="shared-col-num">Bagian per orang</th>
            <th scope="col" class="shared-col-payer">Pakai uang siapa</th>
            <th scope="col" class="shared-col-actions"><span class="visually-hidden">Aksi</span></th>
          </tr>
        </thead>
        <tbody>${items.map(itemRow).join('')}</tbody>
        <tfoot>
          <tr>
            <th scope="row" colspan="5" data-label="Ringkasan">TOTAL</th>
            <td class="shared-col-num" data-label="Total (IDR)">${e(formatRupiah(totalIdr))}</td>
            <td class="shared-col-num" data-label="Bagian per orang">${e(formatRupiah(perPerson))}</td>
            <td data-label=""></td>
            <td class="shared-col-actions" data-label=""></td>
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
      <li>Baris tanpa pemakai uang tidak masuk hitungan transfer.</li>
      <li>Belum termasuk biaya bersama di lokasi yang tidak tercatat (misalnya tiket Songzanlin 19 Nov).</li>
    </ul>
  </section>`;
}

const categoryOptions = sharedExpenseCategories
  .map(category => `<option value="${e(category)}">${e(category)}</option>`)
  .join('');

function itemForm() {
  return `<dialog class="shared-form-dialog" data-shared-form-dialog>
    <form class="shared-form" data-shared-form method="dialog">
      <h2 id="shared-form-title" data-shared-form-title>Tambah item</h2>
      <input type="hidden" name="id" value="">
      <p class="shared-form-error" data-shared-form-error aria-live="polite"></p>
      <label>Tanggal <input name="date" type="date" required></label>
      <label>Kategori <select name="category" required>${categoryOptions}</select></label>
      <label>Keterangan <input name="label" type="text" maxlength="500" required autocomplete="off"></label>
      <label>Total (CNY) <input name="cny" type="number" min="0" step="0.01" inputmode="decimal"></label>
      <label class="shared-form-check"><input name="cnyApproximate" type="checkbox"> CNY perkiraan (≈)</label>
      <label>Total (IDR) <input name="idr" type="text" inputmode="numeric" autocomplete="off" enterkeyhint="done" required></label>
      <label>Pakai uang siapa
        <select name="paidBy">
          <option value="">Belum dicatat</option>
          <option value="Yana">Yana</option>
          <option value="Teman">Teman</option>
        </select>
      </label>
      <div class="shared-form-actions">
        <button type="button" class="quiet-button" data-shared-form-cancel>Batal</button>
        <button type="submit" class="primary-button">Simpan</button>
      </div>
    </form>
  </dialog>`;
}

// Hidden until the script runs, so a visitor without JavaScript never sees a form that cannot work.
function appShell() {
  return `<div class="shared-app" data-shared-root hidden>
    <form class="shared-login" data-shared-login hidden>
      <input type="text" name="username" value="Pengeluaran bersama" autocomplete="username" hidden>
      <label for="shared-password">Kata sandi</label>
      <div class="shared-login-row"><input id="shared-password" name="password" type="password" autocomplete="current-password" aria-describedby="shared-password-error"><button type="submit" class="primary-button">Buka</button></div>
      <p class="shared-login-error" id="shared-password-error" data-shared-login-error aria-live="polite"></p>
    </form>
    <div class="shared-ledger" data-shared-ledger hidden>
      <div class="shared-toolbar">
        <button type="button" class="primary-button" data-shared-add>Tambah item</button>
        <button type="button" class="quiet-button" data-shared-logout>Keluar</button>
      </div>
      <p class="shared-status" data-shared-status role="status" aria-live="polite"></p>
      <div class="shared-layout">
        <div data-shared-settle></div>
        <div data-shared-summary></div>
        <div data-shared-items></div>
        ${notes()}
      </div>
    </div>
    ${itemForm()}
  </div>`;
}

export function sharedExpensesView() {
  return `<a class="skip-link" href="#shared-expenses-title">Langsung ke pengeluaran bersama</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation(sharedExpensesPath)}</header>
  <main class="container prepare-page shared-expenses-page" data-shared-expenses-page>
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="${calmPath}">Opsi santai</a>${icon('right')}<a href="${expensesPath}">Pengeluaran trip</a>${icon('right')}<span>Pengeluaran bersama</span></nav>
    <div class="prepare-intro">
      <h1 id="shared-expenses-title">Pengeluaran bersama.</h1>
      <p class="lead">Catatan pembagian biaya 50/50 antara Yana dan Teman untuk trip Yunnan, 17–21 November 2026. Halaman ini terkunci; masuk dulu untuk melihat dan mengubah item.</p>
    </div>
    <noscript><p class="no-script">Pengeluaran bersama memerlukan JavaScript. Aktifkan JavaScript di browser, lalu muat ulang halaman ini.</p></noscript>
    ${appShell()}
  </main>
  <footer class="container guide-footer"><a href="${expensesPath}">Kembali ke pengeluaran trip</a>${siteCredit()}</footer>`;
}
