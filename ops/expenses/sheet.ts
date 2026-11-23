import { randomUUID } from 'node:crypto';
import { createSheetsClient, type SheetsClient } from './google.ts';
import type { ExpenseItem, Payer, StoreFile, Tombstone } from './store.ts';

export interface SheetSettings {
  spreadsheetId: string;
  tab: string;
  friendLabel: string;
  pollMs: number;
  credentials: Parameters<typeof createSheetsClient>[0];
}

export interface SheetRow extends ExpenseItem {
  row: number;
  notes: string;
}

const HEADER_ROW = 4;
const DATA_START = 5;
const COLS = { no: 0, date: 1, category: 2, label: 3, cny: 4, idr: 5, share: 6, paidBy: 7, notes: 8, id: 9, updatedAt: 10 };
const SHEETS_EPOCH = Date.UTC(1899, 11, 30);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TOMBSTONE_MS = 30 * 24 * 60 * 60 * 1000;

function a1(tab: string, range: string): string {
  const escaped = tab.replace(/'/g, "''");
  return `'${escaped}'!${range}`;
}

function cell(row: unknown[] | undefined, index: number): unknown {
  return row && index < row.length ? row[index] : undefined;
}

function text(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function parseDate(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const iso = new Date(SHEETS_EPOCH + Math.round(value) * 86_400_000).toISOString().slice(0, 10);
    return DATE.test(iso) ? iso : undefined;
  }
  const raw = text(value);
  if (DATE.test(raw)) return raw;
  const match = raw.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (!match) return undefined;
  const months = 'JanFebMarAprMayJunJulAugSepOctNovDec';
  const month = months.indexOf(match[2]) / 3 + 1;
  if (month < 1) return undefined;
  const iso = `${match[3]}-${String(month).padStart(2, '0')}-${match[1].padStart(2, '0')}`;
  return DATE.test(iso) ? iso : undefined;
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const raw = text(value).replace(/[Rp¥≈~\s]/g, '').replace(/\./g, '').replace(',', '.');
  const cleaned = text(value).replace(/[Rp¥≈~\s,]/g, '');
  const asIs = Number(cleaned);
  if (Number.isFinite(asIs)) return asIs;
  const fallback = Number(raw);
  return Number.isFinite(fallback) ? fallback : undefined;
}

function parseIdr(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value);
  const digits = text(value).replace(/[^\d-]/g, '');
  if (!digits) return undefined;
  const idr = Number(digits);
  return Number.isInteger(idr) && idr >= 0 ? idr : undefined;
}

function timestamp(value: unknown): string {
  const raw = text(value);
  if (!raw) return '';
  const time = Date.parse(raw);
  return Number.isFinite(time) ? new Date(time).toISOString() : '';
}


function timeMs(value: string): number {
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

function sameItem(a: ExpenseItem, b: ExpenseItem): boolean {
  return a.date === b.date && a.category === b.category && a.label === b.label && a.idr === b.idr
    && a.paidBy === b.paidBy && a.cny === b.cny && Boolean(a.cnyApproximate) === Boolean(b.cnyApproximate);
}

function toPayer(value: string, friendLabel: string): Payer | null {
  if (!value) return null;
  if (value === 'Yana') return 'Yana';
  if (value === 'Teman' || value === friendLabel) return 'Teman';
  return 'Teman';
}

function fromPayer(value: Payer | null, friendLabel: string): string {
  if (value === 'Yana') return 'Yana';
  if (value === 'Teman') return friendLabel;
  return '';
}

function parseRow(row: unknown[], formatted: unknown[] | undefined, rowNumber: number, friendLabel: string): SheetRow | undefined {
  const date = parseDate(cell(row, COLS.date));
  const category = text(cell(row, COLS.category));
  const label = text(cell(row, COLS.label));
  const idr = parseIdr(cell(row, COLS.idr));
  if (!date || !category || !label || idr === undefined) return undefined;
  const cny = parseNumber(cell(row, COLS.cny));
  const formattedCny = text(cell(formatted, COLS.cny));
  const item: SheetRow = {
    id: text(cell(row, COLS.id)),
    date,
    category,
    label,
    idr,
    paidBy: toPayer(text(cell(row, COLS.paidBy)), friendLabel),
    updatedAt: timestamp(cell(row, COLS.updatedAt)),
    row: rowNumber,
    notes: text(cell(row, COLS.notes)),
  };
  if (cny !== undefined) {
    item.cny = cny;
    if (formattedCny.includes('≈') || formattedCny.includes('~')) item.cnyApproximate = true;
  }
  return item;
}

function dataValues(item: ExpenseItem, no: number, notes: string, friendLabel: string): unknown[] {
  return [
    no,
    item.date,
    item.category,
    item.label,
    item.cny === undefined ? '' : item.cny,
    item.idr,
    `=F${itemRowPlaceholder} * 50%`,
    fromPayer(item.paidBy, friendLabel),
    notes,
    item.id,
    item.updatedAt,
  ];
}

// Placeholder replaced when the actual row number is known.
const itemRowPlaceholder = '__ROW__';

function valuesForRow(item: ExpenseItem, no: number, row: number, notes: string, friendLabel: string): unknown[] {
  const values = dataValues(item, no, notes, friendLabel);
  values[COLS.share] = `=F${row}*50%`;
  return values;
}

export function createSheetSync(settings: SheetSettings, client: SheetsClient = createSheetsClient(settings.credentials)) {
  let sheetId: number | undefined;
  let hidden = false;
  let queue: Promise<void> = Promise.resolve();

  function run<T>(work: () => Promise<T>): Promise<T> {
    const next = queue.then(work, work);
    queue = next.then(() => undefined, () => undefined);
    return next;
  }

  async function tabId(): Promise<number> {
    if (sheetId !== undefined) return sheetId;
    const meta = await client.getSpreadsheet(settings.spreadsheetId);
    const match = meta.sheets?.find(sheet => sheet.properties?.title === settings.tab);
    const id = match?.properties?.sheetId;
    if (typeof id !== 'number') throw new Error('expenses: the configured sheet tab was not found');
    sheetId = id;
    return id;
  }

  async function hideIdColumns(): Promise<void> {
    if (hidden) return;
    await client.batchUpdate(settings.spreadsheetId, [{
      updateDimensionProperties: {
        range: { sheetId: await tabId(), dimension: 'COLUMNS', startIndex: COLS.id, endIndex: COLS.updatedAt + 1 },
        properties: { hiddenByUser: true, pixelSize: 20 },
        fields: 'hiddenByUser,pixelSize',
      },
    }]);
    hidden = true;
  }

  async function load(): Promise<{ rows: SheetRow[]; totalRow: number; raw: unknown[][]; formatted: unknown[][] }> {
    const range = a1(settings.tab, `A${HEADER_ROW}:K`);
    const [raw, formatted] = await Promise.all([
      client.getValues(settings.spreadsheetId, range, 'UNFORMATTED_VALUE'),
      client.getValues(settings.spreadsheetId, range, 'FORMATTED_VALUE'),
    ]);
    let totalRow = -1;
    const rows: SheetRow[] = [];
    for (let i = 1; i < raw.length; i += 1) {
      const rowNumber = HEADER_ROW + i;
      if (text(cell(raw[i], COLS.no)) === 'TOTAL') {
        totalRow = rowNumber;
        break;
      }
      const parsed = parseRow(raw[i], formatted[i], rowNumber, settings.friendLabel);
      if (parsed) rows.push(parsed);
    }
    if (totalRow < 0) throw new Error('expenses: could not find the TOTAL row in the sheet');
    return { rows, totalRow, raw, formatted };
  }

  async function writeRow(item: ExpenseItem, no: number, row: number, notes: string): Promise<void> {
    await client.updateValues(
      settings.spreadsheetId,
      a1(settings.tab, `A${row}:K${row}`),
      [valuesForRow(item, no, row, notes, settings.friendLabel)],
      true,
    );
  }

  async function writeIds(updates: Array<{ row: number; id: string; updatedAt: string }>): Promise<void> {
    for (const update of updates) {
      await client.updateValues(
        settings.spreadsheetId,
        a1(settings.tab, `J${update.row}:K${update.row}`),
        [[update.id, update.updatedAt]],
        false,
      );
    }
  }

  async function renumber(totalRow: number): Promise<void> {
    const last = totalRow - 1;
    if (last < DATA_START) return;
    const numbers = Array.from({ length: last - DATA_START + 1 }, (_, i) => [i + 1]);
    await client.updateValues(settings.spreadsheetId, a1(settings.tab, `A${DATA_START}:A${last}`), numbers, false);
  }

  async function assignMissingIds(rows: SheetRow[]): Promise<SheetRow[]> {
    const missing = rows.filter(row => !row.id);
    if (missing.length === 0) return rows;
    const now = new Date().toISOString();
    await writeIds(missing.map(row => {
      row.id = randomUUID();
      if (!row.updatedAt) row.updatedAt = now;
      return { row: row.row, id: row.id, updatedAt: row.updatedAt };
    }));
    return rows;
  }

  return {
    async pullAndReconcile(data: StoreFile): Promise<StoreFile> {
      return run(async () => {
        await hideIdColumns();
        const loaded = await load();
        const rows = await assignMissingIds(loaded.rows);
        const now = new Date().toISOString();
        const pulledAt = now;
        const localById = new Map(data.items.map(item => [item.id, item]));
        const deletedById = new Map(data.deleted.map(entry => [entry.id, entry]));
        const nextItems: ExpenseItem[] = [];
        const keptIds = new Set<string>();
        const pushed: ExpenseItem[] = [];
        const staleRows = rows
          .filter(remote => {
            const tombstone = deletedById.get(remote.id);
            return !!(tombstone && timeMs(tombstone.deletedAt) >= timeMs(remote.updatedAt));
          })
          .sort((a, b) => b.row - a.row);
        for (const remote of staleRows) {
          await client.batchUpdate(settings.spreadsheetId, [{
            deleteDimension: {
              range: { sheetId: await tabId(), dimension: 'ROWS', startIndex: remote.row - 1, endIndex: remote.row },
            },
          }]);
        }
        const staleIds = new Set(staleRows.map(row => row.id));

        for (const remote of rows) {
          if (staleIds.has(remote.id)) continue;
          const local = localById.get(remote.id);
          if (!local) {
            nextItems.push(copyItem(remote));
            keptIds.add(remote.id);
            continue;
          }
          if (timeMs(remote.updatedAt) > timeMs(local.updatedAt)) {
            nextItems.push(mergeFromRemote(local, remote));
          } else if (timeMs(local.updatedAt) > timeMs(remote.updatedAt)) {
            nextItems.push(local);
            pushed.push(local);
          } else {
            nextItems.push(sameItem(local, remote) ? local : local);
          }
          keptIds.add(remote.id);
        }

        const lastPulledAt = data.sheetSync?.lastPulledAt ?? '';
        for (const local of data.items) {
          if (keptIds.has(local.id)) continue;
          if (timeMs(local.updatedAt) > timeMs(lastPulledAt)) {
            nextItems.push(local);
            pushed.push(local);
            keptIds.add(local.id);
            continue;
          }
          deletedById.set(local.id, { id: local.id, deletedAt: local.updatedAt || pulledAt });
        }

        let totalRow = loaded.totalRow;
        // Re-load after any deletions so inserted rows land above the current TOTAL.
        if (pushed.length || deletedById.size !== data.deleted.length) {
          const fresh = await load();
          totalRow = fresh.totalRow;
          const notesById = new Map(fresh.rows.map(row => [row.id, row.notes]));
          const rowById = new Map(fresh.rows.map(row => [row.id, row.row]));
          for (const item of pushed) {
            const existingRow = rowById.get(item.id);
            if (existingRow) {
              const no = nextItems.slice().sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)).findIndex(entry => entry.id === item.id) + 1;
              await writeRow(item, no, existingRow, notesById.get(item.id) ?? '');
            } else {
              await client.batchUpdate(settings.spreadsheetId, [{
                insertDimension: {
                  range: { sheetId: await tabId(), dimension: 'ROWS', startIndex: totalRow - 1, endIndex: totalRow },
                  inheritFromBefore: true,
                },
              }]);
              const no = nextItems.slice().sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)).findIndex(entry => entry.id === item.id) + 1;
              await writeRow(item, no, totalRow, '');
              totalRow += 1;
            }
          }
          await renumber(totalRow);
        }

        const cutoff = Date.now() - TOMBSTONE_MS;
        const deleted: Tombstone[] = [...deletedById.values()].filter(entry => timeMs(entry.deletedAt) >= cutoff);
        return { version: 2, items: nextItems, deleted, sheetSync: { lastPulledAt: pulledAt } };
      });
    },

    async pushItem(item: ExpenseItem): Promise<void> {
      await run(async () => {
        await hideIdColumns();
        const loaded = await load();
        const existing = loaded.rows.find(row => row.id === item.id);
        if (existing) {
          await writeRow(item, Number(text(cell(loaded.raw[existing.row - HEADER_ROW], COLS.no))) || existing.row - DATA_START + 1, existing.row, existing.notes);
          return;
        }
        await client.batchUpdate(settings.spreadsheetId, [{
          insertDimension: {
            range: { sheetId: await tabId(), dimension: 'ROWS', startIndex: loaded.totalRow - 1, endIndex: loaded.totalRow },
            inheritFromBefore: true,
          },
        }]);
        await writeRow(item, loaded.rows.length + 1, loaded.totalRow, '');
        await renumber(loaded.totalRow + 1);
      });
    },

    async deleteItem(id: string): Promise<void> {
      await run(async () => {
        const loaded = await load();
        const existing = loaded.rows.find(row => row.id === id);
        if (!existing) return;
        await client.batchUpdate(settings.spreadsheetId, [{
          deleteDimension: {
            range: { sheetId: await tabId(), dimension: 'ROWS', startIndex: existing.row - 1, endIndex: existing.row },
          },
        }]);
        await renumber(loaded.totalRow - 1);
      });
    },
  };
}

function copyItem(row: SheetRow): ExpenseItem {
  return {
    id: row.id,
    date: row.date,
    category: row.category,
    label: row.label,
    idr: row.idr,
    paidBy: row.paidBy,
    updatedAt: row.updatedAt || new Date().toISOString(),
    ...(row.cny !== undefined ? { cny: row.cny } : {}),
    ...(row.cnyApproximate ? { cnyApproximate: true } : {}),
  };
}

function mergeFromRemote(local: ExpenseItem, remote: SheetRow): ExpenseItem {
  const merged = copyItem(remote);
  if (merged.cny === local.cny && local.cnyApproximate && merged.cnyApproximate === undefined) merged.cnyApproximate = true;
  return merged;
}

export type SheetSync = ReturnType<typeof createSheetSync>;
