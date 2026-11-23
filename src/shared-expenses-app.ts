import { itemsSectionHtml, settlementCardHtml, summaryTilesHtml } from './shared-expenses-render.ts';
import {
  sharedExpenseCategories,
  sharedExpensesApi,
  type SharedExpenseInput,
  type SharedExpenseItem,
  type SharedExpenseSettlement,
  type SharedPayer,
} from './shared-expenses.ts';

const unreachableMessage = 'Layanan pengeluaran bersama belum bisa dihubungi.';
const jsonHeaders = { 'Content-Type': 'application/json' };

class ExpensesError extends Error {
  readonly status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}


/** Indonesian grouping for a rupiah integer: 704795 → "704.795". */
export function formatIdrGroup(value: number | string): string {
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function parseIdrGroup(value: string): number {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : NaN;
}

function keepIdrCaret(input: HTMLInputElement): void {
  const caret = input.selectionStart ?? input.value.length;
  const digitsBefore = input.value.slice(0, caret).replace(/\D/g, '').length;
  const formatted = formatIdrGroup(input.value);
  input.value = formatted;
  let seen = 0;
  let pos = formatted.length;
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i])) seen += 1;
    if (seen >= digitsBefore) {
      pos = i + 1;
      break;
    }
  }
  input.setSelectionRange(pos, pos);
}

interface Ledger {
  items: SharedExpenseItem[];
  settlement: SharedExpenseSettlement;
}

async function call(path: string, init: RequestInit = {}): Promise<Response> {
  try {
    return await fetch(`${sharedExpensesApi}${path}`, { credentials: 'same-origin', cache: 'no-store', ...init });
  } catch {
    throw new ExpensesError(unreachableMessage);
  }
}

async function failure(response: Response): Promise<ExpensesError> {
  let message = '';
  try {
    const body = await response.json() as { error?: unknown };
    if (typeof body.error === 'string') message = body.error;
  } catch {
    message = '';
  }
  if (!message) {
    if (response.status === 401) message = 'Kata sandi salah.';
    else if (response.status === 429) message = 'Terlalu banyak percobaan. Tunggu sebentar, lalu coba lagi.';
    else if (response.status >= 500) message = unreachableMessage;
    else message = 'Permintaan gagal. Coba lagi.';
  }
  return new ExpensesError(message, response.status);
}

async function sessionActive(): Promise<boolean> {
  const response = await call('/session');
  if (!response.ok) throw await failure(response);
  const body = await response.json().catch(() => null) as { authenticated?: unknown } | null;
  return body?.authenticated === true;
}

async function login(password: string): Promise<void> {
  const response = await call('/login', { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ password }) });
  if (!response.ok) throw await failure(response);
}

async function logout(): Promise<void> {
  const response = await call('/logout', { method: 'POST', headers: jsonHeaders, body: '{}' });
  if (!response.ok) throw await failure(response);
}

async function fetchLedger(): Promise<Ledger> {
  const response = await call('/items');
  if (!response.ok) throw await failure(response);
  return parseLedger(await response.json());
}

async function saveItem(id: string | undefined, input: SharedExpenseInput): Promise<Ledger> {
  const response = await call(id ? `/items/${encodeURIComponent(id)}` : '/items', {
    method: id ? 'PUT' : 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  });
  if (!response.ok) throw await failure(response);
  return parseLedger(await response.json());
}

async function deleteItem(id: string): Promise<Ledger> {
  const response = await call(`/items/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!response.ok) throw await failure(response);
  return parseLedger(await response.json());
}

function isPayer(value: unknown): value is SharedPayer | null {
  return value === 'Yana' || value === 'Teman' || value === null;
}

function isItem(value: unknown): value is SharedExpenseItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string' && typeof item.no === 'number' && typeof item.date === 'string'
    && typeof item.category === 'string' && typeof item.label === 'string'
    && typeof item.idr === 'number' && isPayer(item.paidBy);
}

function isSettlement(value: unknown): value is SharedExpenseSettlement {
  if (!value || typeof value !== 'object') return false;
  const settlement = value as Record<string, unknown>;
  return typeof settlement.totalIdr === 'number' && typeof settlement.perPerson === 'number'
    && typeof settlement.paidByYana === 'number' && typeof settlement.paidByFriend === 'number'
    && typeof settlement.transferAmount === 'number' && isPayer(settlement.transferFrom) && isPayer(settlement.transferTo);
}

function parseLedger(value: unknown): Ledger {
  if (!value || typeof value !== 'object') throw new ExpensesError('Data tidak valid.');
  const raw = value as { items?: unknown; settlement?: unknown };
  if (!Array.isArray(raw.items) || !raw.items.every(isItem) || !isSettlement(raw.settlement)) {
    throw new ExpensesError('Data tidak valid.');
  }
  return { items: raw.items, settlement: raw.settlement };
}

function readInput(form: HTMLFormElement): SharedExpenseInput {
  const data = new FormData(form);
  const date = String(data.get('date') ?? '');
  const category = String(data.get('category') ?? '').trim();
  const label = String(data.get('label') ?? '').trim();
  const idr = parseIdrGroup(String(data.get('idr') ?? ''));
  const cnyText = String(data.get('cny') ?? '').trim();
  const paidRaw = String(data.get('paidBy') ?? '');
  const paidBy: SharedPayer | null = paidRaw === 'Yana' || paidRaw === 'Teman' ? paidRaw : null;
  const input: SharedExpenseInput = { date, category, label, idr, paidBy };
  if (cnyText) {
    input.cny = Number(cnyText);
    input.cnyApproximate = form.querySelector<HTMLInputElement>('[name="cnyApproximate"]')?.checked === true;
  }
  return input;
}


function navigationClearance(): number {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;height:var(--site-navigation-clearance)';
  document.body.append(probe);
  const value = probe.getBoundingClientRect().height;
  probe.remove();
  return value || 80;
}

function watchStickyToolbar(toolbar: HTMLElement): void {
  const update = () => {
    const clearance = navigationClearance();
    toolbar.classList.toggle('is-stuck', toolbar.getBoundingClientRect().top <= clearance + 1);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

export function initializeSharedExpenses(): void {
  const page = document.querySelector<HTMLElement>('[data-shared-expenses-page]');
  const root = page?.querySelector<HTMLElement>('[data-shared-root]');
  if (!page || !root) return;
  const view = page;

  const loginForm = root.querySelector<HTMLFormElement>('[data-shared-login]')!;
  const loginError = root.querySelector<HTMLElement>('[data-shared-login-error]')!;
  const ledger = root.querySelector<HTMLElement>('[data-shared-ledger]')!;
  const status = root.querySelector<HTMLElement>('[data-shared-status]')!;
  const settleSlot = root.querySelector<HTMLElement>('[data-shared-settle]')!;
  const summarySlot = root.querySelector<HTMLElement>('[data-shared-summary]')!;
  const itemsSlot = root.querySelector<HTMLElement>('[data-shared-items]')!;
  const dialog = root.querySelector<HTMLDialogElement>('[data-shared-form-dialog]')!;
  const form = root.querySelector<HTMLFormElement>('[data-shared-form]')!;
  const formTitle = root.querySelector<HTMLElement>('[data-shared-form-title]')!;
  const formError = root.querySelector<HTMLElement>('[data-shared-form-error]')!;
  const categorySelect = form.querySelector<HTMLSelectElement>('[name="category"]')!;

  let items: SharedExpenseItem[] = [];
  root.hidden = false;
  const toolbar = root.querySelector<HTMLElement>('.shared-toolbar');
  if (toolbar) watchStickyToolbar(toolbar);

  const lead = page.querySelector<HTMLElement>('.prepare-intro .lead');
  const lockedLead = lead?.textContent ?? '';
  const openLead = 'Biaya yang dibagi 50/50 antara Yana dan Teman untuk trip Yunnan, 17–21 November 2026. Tambah, ubah, atau hapus item di bawah; total dan hasil transfer dihitung ulang otomatis.';

  function showLogin(message = '') {
    view.classList.remove('is-unlocked');
    if (lead) lead.textContent = lockedLead;
    ledger.hidden = true;
    loginForm.hidden = false;
    loginError.textContent = message;
    loginForm.querySelector<HTMLInputElement>('[name="password"]')?.focus();
  }

  function showLedger() {
    view.classList.add('is-unlocked');
    if (lead) lead.textContent = openLead;
    loginForm.hidden = true;
    ledger.hidden = false;
  }

  function render(next: Ledger) {
    items = next.items;
    settleSlot.innerHTML = settlementCardHtml(next.settlement);
    summarySlot.innerHTML = summaryTilesHtml(next.settlement);
    itemsSlot.innerHTML = itemsSectionHtml(next.items, next.settlement);
    showLedger();
  }

  async function load() {
    render(await fetchLedger());
    status.textContent = '';
  }

  function ensureCategory(category: string) {
    if ([...categorySelect.options].some(option => option.value === category)) return;
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  }

  function openForm(item?: SharedExpenseItem) {
    form.reset();
    formError.textContent = '';
    form.querySelector<HTMLInputElement>('[name="id"]')!.value = item?.id ?? '';
    formTitle.textContent = item ? 'Ubah item' : 'Tambah item';
    if (item) {
      ensureCategory(item.category);
      form.querySelector<HTMLInputElement>('[name="date"]')!.value = item.date;
      categorySelect.value = item.category;
      form.querySelector<HTMLInputElement>('[name="label"]')!.value = item.label;
      form.querySelector<HTMLInputElement>('[name="cny"]')!.value = item.cny === undefined ? '' : String(item.cny);
      form.querySelector<HTMLInputElement>('[name="cnyApproximate"]')!.checked = item.cnyApproximate === true;
      form.querySelector<HTMLInputElement>('[name="idr"]')!.value = formatIdrGroup(item.idr);
      form.querySelector<HTMLSelectElement>('[name="paidBy"]')!.value = item.paidBy ?? '';
    }
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    form.querySelector<HTMLInputElement>('[name="date"]')?.focus();
  }

  function closeForm() {
    if (dialog.open) dialog.close();
    form.reset();
    formError.textContent = '';
  }

  form.querySelector<HTMLInputElement>('[name="idr"]')?.addEventListener('input', event => {
    keepIdrCaret(event.currentTarget as HTMLInputElement);
  });

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const password = loginForm.querySelector<HTMLInputElement>('[name="password"]')!.value;
    loginError.textContent = '';
    try {
      await login(password);
      loginForm.reset();
      await load();
    } catch (error) {
      loginError.textContent = error instanceof ExpensesError ? error.message : unreachableMessage;
    }
  });

  root.querySelector('[data-shared-logout]')?.addEventListener('click', async () => {
    try {
      await logout();
      items = [];
      settleSlot.replaceChildren();
      summarySlot.replaceChildren();
      itemsSlot.replaceChildren();
      status.textContent = '';
      showLogin();
    } catch (error) {
      status.textContent = error instanceof ExpensesError ? error.message : unreachableMessage;
    }
  });

  root.querySelector('[data-shared-add]')?.addEventListener('click', () => openForm());
  root.querySelector('[data-shared-form-cancel]')?.addEventListener('click', () => closeForm());

  itemsSlot.addEventListener('click', async event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const editId = target.closest<HTMLElement>('[data-shared-edit]')?.dataset.sharedEdit;
    if (editId) {
      const item = items.find(row => row.id === editId);
      if (item) openForm(item);
      return;
    }
    const deleteId = target.closest<HTMLElement>('[data-shared-delete]')?.dataset.sharedDelete;
    if (!deleteId) return;
    const item = items.find(row => row.id === deleteId);
    if (!item || !window.confirm(`Hapus “${item.label}”?`)) return;
    try {
      render(await deleteItem(deleteId));
      status.textContent = 'Item dihapus.';
    } catch (error) {
      if (error instanceof ExpensesError && error.status === 401) {
        showLogin('Sesi sudah habis. Masuk lagi.');
        return;
      }
      status.textContent = error instanceof ExpensesError ? error.message : unreachableMessage;
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    formError.textContent = '';
    const id = form.querySelector<HTMLInputElement>('[name="id"]')!.value || undefined;
    const input = readInput(form);
    if (!sharedExpenseCategories.includes(input.category as typeof sharedExpenseCategories[number]) && !items.some(item => item.category === input.category)) {
      formError.textContent = 'Kategori tidak valid.';
      return;
    }
    try {
      render(await saveItem(id, input));
      closeForm();
      status.textContent = id ? 'Item diubah.' : 'Item ditambahkan.';
    } catch (error) {
      if (error instanceof ExpensesError && error.status === 401) {
        closeForm();
        showLogin('Sesi sudah habis. Masuk lagi.');
        return;
      }
      formError.textContent = error instanceof ExpensesError ? error.message : unreachableMessage;
    }
  });

  void (async () => {
    try {
      if (await sessionActive()) await load();
      else showLogin();
    } catch {
      showLogin(unreachableMessage);
    }
  })();
}
