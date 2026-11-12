import { escapeHtml as e } from './render.ts';
import { section } from './prepare.ts';

// Open items from the 6 November 2026 calm-option gap audit. Ids stay stable so a phone keeps its ticks.
// `booked` items are bought (owner's screenshot, recorded in SOURCE-NOTES.md): they render ticked on every phone.
interface ChecklistItem { id: string; label: string; booked?: boolean }
interface ChecklistGroup { id: string; title: string; items: ChecklistItem[] }

const checklistGroups: ChecklistGroup[] = [
  {
    id: 'tickets',
    title: 'Tiket belum dipesan',
    items: [
      { id: 'c5756-9nov', label: 'C5756 Chengdu East 17.05 → Huanglongjiuzhai 19.10 (9 Nov, 1 kursi)', booked: true },
      { id: 'jiuzhaigou-10nov', label: 'Jiuzhaigou + bus taman 10 Nov, slot 08.00–10.00', booked: true },
      { id: 'huanglong-11nov', label: 'Tur Huanglong 11 Nov (tiket + ropeway naik + mobil, jemput 07.30)', booked: true },
      { id: 'c6374-11nov', label: 'C6374 Huanglongjiuzhai 17.30 → Chengdu East 20.09 (11 Nov, sudah dipesan)' },
      { id: 'bipenggou-bus-13nov', label: 'Bus PP Chengdu → Bipenggou 07.30 + tiket Bipenggou 12 Nov', booked: true },
      { id: 'siguniang-14nov', label: 'Tur Siguniangshan 14 Nov (Trip.com 89377156 paket J)', booked: true },
      { id: 'd239-15nov', label: 'D239 Chengdu South 08.33 → Lijiang 17.46 (15 Nov)' },
      { id: 'shangri-la-tour-18nov', label: 'Tur Lijiang → Shangri-La 18 Nov (Trip.com 104549480, 2 orang, turun di Dukezong)' },
      { id: 'c988-songzanlin-19nov', label: 'C988 Shangri-La 15.01 → Lijiang 19 Nov (2 kursi) + Songzanlin 19 Nov (2 tiket)' },
      { id: 'impression-jade-20nov', label: 'Impression Lijiang 13.20 + Jade Dragon kawasan/shuttle/Big Cable Car 15.00–15.30 (20 Nov, 2 orang; buka 13 Nov)' },
      { id: 'c442-20nov', label: 'C442 Lijiang 20.22 → Dali 20 Nov (2 kursi)' },
      { id: 'dali-kunming-21nov', label: 'Kereta siang Dali → Kunming 21 Nov, tiba paling lambat ±16.00 (2 kursi)' },
    ],
  },
  {
    id: 'hotels',
    title: 'Hotel belum dikonfirmasi',
    items: [
      { id: 'pudong-7nov', label: 'Pudong / Aerotel transit 7 Nov' },
      { id: 'jiuzhaigou-9-10', label: 'Jiuzhaigou 9–10 (Leyu Youth Hostel)', booked: true },
      { id: 'chengdu-11-14', label: 'Chengdu 11–13 (Mcsrh, 3 malam)', booked: true },
      { id: 'chengdu-14', label: 'Chengdu malam 14 (belum dipesan)' },
      { id: 'lijiang-15-17', label: 'Lijiang 15–17 (twin mulai 17 Nov)' },
      { id: 'shangri-la-18', label: 'Shangri-La twin 18' },
      { id: 'lijiang-19', label: 'Lijiang 19' },
      { id: 'dali-20', label: 'Dali 20' },
    ],
  },
  {
    id: 'cars',
    title: 'Mobil & transfer',
    items: [
      { id: 'lijiang-driver-20nov', label: 'Mobil + sopir Lijiang 20 Nov 06.30 (Jade Dragon → Stasiun Lijiang, dengan koper)' },
      { id: 'tfu-hotel-8nov', label: 'Transfer TFU→hotel 8 Nov' },
    ],
  },
  {
    id: 'site',
    title: 'Info / perbaikan situs',
    items: [
      { id: 'day1-c5756', label: 'Hari 1 Info praktis masih teks utama (C5746 subuh) — perlu diselaraskan ke C5756' },
    ],
  },
];

const storageKey = 'calm-prepare-checklist';

const checklistItem = (item: ChecklistItem) => `<li><label class="prepare-check"><input type="checkbox" data-check-id="${e(item.id)}"${item.booked ? ' data-booked checked' : ''}><span>${e(item.label)}</span></label></li>`;

const checklistGroup = (group: ChecklistGroup) => `<fieldset class="prepare-checklist-group"><legend id="checklist-${e(group.id)}-title">${e(group.title)}</legend><ul class="prepare-checklist">${group.items.map(checklistItem).join('')}</ul></fieldset>`;

/** The calm preparation page's tick list. Checked state is restored in the browser; the prerender ticks only booked items. */
export function calmChecklistSection() {
  const total = checklistGroups.reduce((sum, group) => sum + group.items.length, 0);
  return section('checklist', 'Checklist pemesanan', `<div data-calm-checklist>
      <p class="prepare-section-lead">Centang yang sudah selesai. Centangan tersimpan di ponsel ini, jadi tetap ada setelah halaman dimuat ulang. Mulai 18 November beli 2 kursi kalau relevan.</p>
      <p class="prepare-checklist-settled">${e('Sudah beres, tidak ada di daftar ini: visa, tiket pesawat, dan Mcsrh Hotel 8–9 November.')}</p>
      <p class="prepare-checklist-progress" data-checklist-progress aria-live="polite">0 dari ${total} selesai</p>
      ${checklistGroups.map(checklistGroup).join('')}
    </div>`);
}

function storedIds(): string[] {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function storeIds(ids: string[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(ids));
  } catch {
    // Private mode and blocked storage keep the ticks for this visit only.
  }
}

/** Restore ticks on the calm preparation page and write them back as they change. */
export function initializeCalmChecklist(root: ParentNode = document) {
  const panel = root.querySelector<HTMLElement>('[data-calm-checklist]');
  if (!panel) return;
  const boxes = [...panel.querySelectorAll<HTMLInputElement>('input[data-check-id]')];
  const saved = new Set(storedIds());
  for (const box of boxes) box.checked = box.hasAttribute('data-booked') || saved.has(box.dataset.checkId ?? '');
  const progress = panel.querySelector<HTMLElement>('[data-checklist-progress]');
  const showProgress = () => {
    if (!progress) return;
    const done = boxes.filter(box => box.checked).length;
    progress.textContent = `${done} dari ${boxes.length} selesai`;
  };
  showProgress();
  panel.addEventListener('change', event => {
    if (!(event.target instanceof HTMLInputElement) || !event.target.matches('[data-check-id]')) return;
    storeIds(boxes.filter(box => box.checked).map(box => box.dataset.checkId ?? '').filter(Boolean));
    showProgress();
  });
}
