import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { seedItems, type SeedItem } from './seed.ts';

export type Payer = 'Yana' | 'Teman';

export interface ExpenseItem {
  id: string;
  date: string;
  category: string;
  label: string;
  cny?: number;
  cnyApproximate?: boolean;
  idr: number;
  paidBy: Payer | null;
}

export interface ExpenseInput {
  date: string;
  category: string;
  label: string;
  cny?: number;
  cnyApproximate?: boolean;
  idr: number;
  paidBy: Payer | null;
}

export interface Settlement {
  totalIdr: number;
  perPerson: number;
  paidByYana: number;
  paidByFriend: number;
  yanaShare: number;
  friendShare: number;
  net: number;
  transferFrom: Payer | null;
  transferTo: Payer | null;
  transferAmount: number;
}

interface StoreFile {
  version: 1;
  items: ExpenseItem[];
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_LABEL = 500;
const MAX_CATEGORY = 80;

export function settle(items: ExpenseItem[]): Settlement {
  const totalIdr = items.reduce((sum, item) => sum + item.idr, 0);
  const paidByYana = items.filter(item => item.paidBy === 'Yana').reduce((sum, item) => sum + item.idr, 0);
  const paidByFriend = items.filter(item => item.paidBy === 'Teman').reduce((sum, item) => sum + item.idr, 0);
  const yanaShare = paidByYana * 0.5;
  const friendShare = paidByFriend * 0.5;
  const rawNet = yanaShare - friendShare;
  const transferAmount = Math.round(Math.abs(rawNet));
  const net = rawNet > 0 ? transferAmount : rawNet < 0 ? -transferAmount : 0;
  return {
    totalIdr,
    perPerson: totalIdr * 0.5,
    paidByYana,
    paidByFriend,
    yanaShare,
    friendShare,
    net,
    transferFrom: transferAmount === 0 ? null : net > 0 ? 'Teman' : 'Yana',
    transferTo: transferAmount === 0 ? null : net > 0 ? 'Yana' : 'Teman',
    transferAmount,
  };
}

function sortItems(items: ExpenseItem[]): ExpenseItem[] {
  return [...items].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

export function numbered(items: ExpenseItem[]): Array<ExpenseItem & { no: number }> {
  return sortItems(items).map((item, index) => ({ ...item, no: index + 1 }));
}

function isPayer(value: unknown): value is Payer | null {
  return value === 'Yana' || value === 'Teman' || value === null;
}

function isItem(value: unknown): value is ExpenseItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== 'string' || !item.id || typeof item.date !== 'string' || !DATE.test(item.date)) return false;
  if (typeof item.category !== 'string' || typeof item.label !== 'string') return false;
  if (typeof item.idr !== 'number' || !Number.isFinite(item.idr)) return false;
  if (item.cny !== undefined && (typeof item.cny !== 'number' || !Number.isFinite(item.cny))) return false;
  if (item.cnyApproximate !== undefined && typeof item.cnyApproximate !== 'boolean') return false;
  return isPayer(item.paidBy);
}

export function parseInput(body: unknown): ExpenseInput | string {
  if (!body || typeof body !== 'object') return 'Format permintaan tidak valid.';
  const raw = body as Record<string, unknown>;
  const date = typeof raw.date === 'string' ? raw.date.trim() : '';
  const category = typeof raw.category === 'string' ? raw.category.trim() : '';
  const label = typeof raw.label === 'string' ? raw.label.trim() : '';
  if (!DATE.test(date)) return 'Tanggal harus dalam format YYYY-MM-DD.';
  if (!category || category.length > MAX_CATEGORY) return 'Kategori wajib diisi.';
  if (!label || label.length > MAX_LABEL) return 'Keterangan wajib diisi.';
  const idr = typeof raw.idr === 'number' ? raw.idr : typeof raw.idr === 'string' ? Number(raw.idr.replace(/[^\d.-]/g, '')) : NaN;
  if (!Number.isFinite(idr) || !Number.isInteger(idr) || idr < 0) return 'Total IDR harus angka bulat 0 atau lebih.';
  let cny: number | undefined;
  if (raw.cny !== undefined && raw.cny !== null && raw.cny !== '') {
    const value = typeof raw.cny === 'number' ? raw.cny : Number(raw.cny);
    if (!Number.isFinite(value) || value < 0) return 'Total CNY tidak valid.';
    cny = value;
  }
  const cnyApproximate = raw.cnyApproximate === true;
  let paidBy: Payer | null = null;
  if (raw.paidBy === 'Yana' || raw.paidBy === 'Teman') paidBy = raw.paidBy;
  else if (raw.paidBy === '' || raw.paidBy === null || raw.paidBy === undefined) paidBy = null;
  else if (typeof raw.paidBy === 'string' && raw.paidBy.trim()) paidBy = 'Teman';
  return { date, category, label, ...(cny !== undefined ? { cny, cnyApproximate } : {}), idr, paidBy };
}

function seedRecord(): StoreFile {
  const items = seedItems.map((item: SeedItem): ExpenseItem => ({
    id: item.id,
    date: item.date,
    category: item.category,
    label: item.label,
    ...(item.cny !== undefined ? { cny: item.cny } : {}),
    ...(item.cnyApproximate ? { cnyApproximate: true } : {}),
    idr: item.idr,
    paidBy: item.paidBy,
  }));
  return { version: 1, items };
}

export function createStore(dataFile: string) {
  let queue: Promise<void> = Promise.resolve();

  async function readFileOrSeed(): Promise<StoreFile> {
    try {
      const parsed: unknown = JSON.parse(await readFile(dataFile, 'utf8'));
      if (parsed && typeof parsed === 'object' && (parsed as StoreFile).version === 1 && Array.isArray((parsed as StoreFile).items)) {
        const items = (parsed as StoreFile).items.filter(isItem);
        return { version: 1, items: sortItems(items) };
      }
    } catch (error) {
      const code = error instanceof Error && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
      if (code !== 'ENOENT') throw error;
    }
    const seeded = seedRecord();
    await writeAtomic(seeded);
    console.log('expenses: seeded an empty store');
    return seeded;
  }

  async function writeAtomic(data: StoreFile): Promise<void> {
    await mkdir(dirname(dataFile), { recursive: true });
    const temp = `${dataFile}.tmp`;
    await writeFile(temp, `${JSON.stringify({ version: 1, items: sortItems(data.items) }, null, 2)}\n`, { mode: 0o600 });
    await rename(temp, dataFile);
  }

  function run<T>(work: () => Promise<T>): Promise<T> {
    const next = queue.then(work, work);
    queue = next.then(() => undefined, () => undefined);
    return next;
  }

  return {
    list(): Promise<Array<ExpenseItem & { no: number }>> {
      return run(async () => numbered((await readFileOrSeed()).items));
    },
    create(input: ExpenseInput): Promise<Array<ExpenseItem & { no: number }>> {
      return run(async () => {
        const data = await readFileOrSeed();
        data.items.push({ id: randomUUID(), ...input });
        await writeAtomic(data);
        return numbered(data.items);
      });
    },
    update(id: string, input: ExpenseInput): Promise<Array<ExpenseItem & { no: number }> | null> {
      return run(async () => {
        const data = await readFileOrSeed();
        const index = data.items.findIndex(item => item.id === id);
        if (index < 0) return null;
        data.items[index] = { id, ...input };
        await writeAtomic(data);
        return numbered(data.items);
      });
    },
    remove(id: string): Promise<Array<ExpenseItem & { no: number }> | null> {
      return run(async () => {
        const data = await readFileOrSeed();
        const next = data.items.filter(item => item.id !== id);
        if (next.length === data.items.length) return null;
        data.items = next;
        await writeAtomic(data);
        return numbered(data.items);
      });
    },
  };
}
