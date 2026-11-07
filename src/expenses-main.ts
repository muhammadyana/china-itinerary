import { cnyToIdr, formatRupiah } from './currency.ts';
import { dayLabel, expenseCategories, paidTotal } from './expenses.ts';

// Entries typed on the road stay in this browser's localStorage; nothing is sent anywhere.
const storageKey = 'trip-expenses-v1';
type Currency = 'CNY' | 'IDR';
interface Expense { id: string; date: string; category: string; note: string; amount: number; currency: Currency }

const categoryLabel = (id: string) => expenseCategories.find(category => category.id === id)?.label ?? 'Lainnya';
const toIdr = (entry: Expense) => entry.currency === 'CNY' ? cnyToIdr(entry.amount) : entry.amount;
const yuan = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

// Accept only well-formed entries, so a damaged store or an edited backup cannot break the page.
function isExpense(value: unknown): value is Expense {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.id === 'string' && typeof entry.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.date)
    && typeof entry.category === 'string' && typeof entry.note === 'string'
    && typeof entry.amount === 'number' && Number.isFinite(entry.amount) && entry.amount >= 0
    && (entry.currency === 'CNY' || entry.currency === 'IDR');
}

function load(): Expense[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isExpense) : [];
  } catch {
    return [];
  }
}

function save(entries: Expense[]): boolean {
  try {
    localStorage.setItem(storageKey, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

const amountText = (entry: Expense) => entry.currency === 'CNY'
  ? `CNY ${yuan.format(entry.amount)} (≈ ${formatRupiah(toIdr(entry))})`
  : formatRupiah(entry.amount);

const textSpan = (className: string, text: string) => {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
};

function entryRow(entry: Expense): HTMLLIElement {
  const row = document.createElement('li');
  row.className = 'expense-row';
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'expense-remove';
  remove.dataset.expenseRemove = entry.id;
  remove.setAttribute('aria-label', `Hapus ${entry.note}`);
  remove.textContent = '×';
  row.append(textSpan('expense-date', categoryLabel(entry.category)), textSpan('expense-label', entry.note), textSpan('expense-amount', amountText(entry)), remove);
  return row;
}

function dayGroup(date: string, entries: Expense[]): HTMLElement {
  const group = document.createElement('section');
  group.className = 'expense-day';
  const heading = document.createElement('h3');
  const total = entries.reduce((sum, entry) => sum + toIdr(entry), 0);
  heading.append(textSpan('', dayLabel(date)), textSpan('expense-day-total', formatRupiah(total)));
  const list = document.createElement('ul');
  list.className = 'expense-list';
  list.setAttribute('role', 'list');
  list.append(...entries.map(entryRow));
  group.append(heading, list);
  return group;
}

function categoryRows(entries: Expense[]): HTMLElement[] {
  return expenseCategories.flatMap(({ id, label }) => {
    const total = entries.filter(entry => entry.category === id).reduce((sum, entry) => sum + toIdr(entry), 0);
    if (!total) return [];
    const row = document.createElement('div');
    const term = document.createElement('dt');
    term.textContent = label;
    const value = document.createElement('dd');
    value.textContent = formatRupiah(total);
    row.append(term, value);
    return [row];
  });
}

/** Wire the expenses page: restore entries, add and remove them, keep the totals current, back up and restore. */
export function initializeExpenses(root: ParentNode = document) {
  const page = root.querySelector<HTMLElement>('[data-expenses]');
  if (!page) return;
  const form = page.querySelector<HTMLFormElement>('#expense-form')!;
  const error = page.querySelector<HTMLElement>('#expense-error')!;
  const days = page.querySelector<HTMLElement>('#expense-days')!;
  const categories = page.querySelector<HTMLElement>('#expense-categories')!;
  const tripTotal = page.querySelector<HTMLElement>('#expense-trip-total')!;
  const grand = page.querySelector<HTMLElement>('#expense-grand')!;
  const empty = days.querySelector('.expense-empty');
  let entries = load();

  const showError = (message: string) => { error.textContent = message; error.hidden = !message; };

  function render() {
    const total = entries.reduce((sum, entry) => sum + toIdr(entry), 0);
    tripTotal.textContent = formatRupiah(total);
    grand.textContent = formatRupiah(paidTotal + total);
    categories.replaceChildren(...categoryRows(entries));
    const dates = [...new Set(entries.map(entry => entry.date))].sort().reverse();
    days.replaceChildren(...(dates.length ? dates.map(date => dayGroup(date, entries.filter(entry => entry.date === date))) : empty ? [empty] : []));
  }

  function commit(next: Expense[]) {
    if (!save(next)) { showError('Catatan tidak bisa disimpan di browser ini (mode privat atau penyimpanan diblokir).'); return; }
    entries = next;
    render();
  }

  // Default the date to today while the trip runs.
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date());
  const dateInput = form.elements.namedItem('date') as HTMLInputElement;
  if (today >= dateInput.min && today <= dateInput.max) dateInput.value = today;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const amount = Number(String(data.get('amount') ?? '').replace(',', '.'));
    const note = String(data.get('note') ?? '').trim();
    const date = String(data.get('date') ?? '');
    if (!note) return showError('Isi keterangan, misalnya "makan siang".');
    if (!Number.isFinite(amount) || amount <= 0) return showError('Isi jumlah lebih dari 0.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return showError('Pilih tanggal.');
    showError('');
    const entry: Expense = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date, category: String(data.get('category')), note, amount, currency: data.get('currency') === 'IDR' ? 'IDR' : 'CNY' };
    commit([...entries, entry]);
    (form.elements.namedItem('note') as HTMLInputElement).value = '';
    (form.elements.namedItem('amount') as HTMLInputElement).value = '';
  });

  days.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-expense-remove]');
    if (button) commit(entries.filter(entry => entry.id !== button.dataset.expenseRemove));
  });

  page.querySelector('[data-expense-action="export"]')?.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(entries, null, 1)], { type: 'application/json' }));
    link.download = `pengeluaran-china-${today}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });

  page.querySelector<HTMLInputElement>('[data-expense-action="import"]')?.addEventListener('change', async event => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!Array.isArray(parsed)) throw new Error('not a list');
      const known = new Set(entries.map(entry => entry.id));
      commit([...entries, ...parsed.filter(isExpense).filter(entry => !known.has(entry.id))]);
      showError('');
    } catch {
      showError('File cadangan tidak bisa dibaca. Pilih file .json dari tombol "Simpan cadangan".');
    }
  });

  render();
}
