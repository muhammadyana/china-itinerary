import { escapeHtml as e } from './render.ts';
import { section } from './prepare.ts';

// Open items from the 6 November 2026 calm-option gap audit. Ids stay stable so a phone keeps its ticks.
interface ChecklistItem { id: string; label: string }
interface ChecklistGroup { id: string; title: string; items: ChecklistItem[] }

const checklistGroups: ChecklistGroup[] = [
  {
    id: 'tickets',
    title: 'Tiket belum dipesan',
    items: [
      { id: 'c5756-9nov', label: 'C5756 Chengdu East 17.05 → Huanglongjiuzhai 19.10 (9 Nov, 1 kursi)' },
      { id: 'jiuzhaigou-10nov', label: 'Jiuzhaigou + bus taman 10 Nov, slot 08.00–10.00' },
      { id: 'c5754-11nov', label: 'C5754 Huanglongjiuzhai 14.14 → Maoxian 15.00 (11 Nov)' },
      { id: 'bipenggou-12nov', label: 'Bipenggou + bus + mobil listrik 12 Nov' },
      { id: 'panda-base-14nov', label: 'Panda Base pagi 14 Nov' },
      { id: 'd239-15nov', label: 'D239 Chengdu South 08.33 → Lijiang 17.46 (15 Nov)' },
      { id: 'upper-gorge-16nov', label: 'Upper Tiger Leaping Gorge 16 Nov' },
      { id: 'c984-songzanlin-18nov', label: 'C984 Shangri-La → Lijiang 18 Nov (2 kursi) + Songzanlin 18 Nov (2 tiket)' },
      { id: 'impression-jade-19nov', label: 'Impression Lijiang 13.20 + Jade Dragon kawasan/shuttle/Big Cable Car 15.00–15.30 (19 Nov, 2 orang)' },
      { id: 'c442-19nov', label: 'C442 Lijiang → Dali 19 Nov (2 kursi)' },
      { id: 'd8704-20nov', label: 'D8704 Dali → Kunming站 20 Nov (2 kursi)' },
    ],
  },
  {
    id: 'hotels',
    title: 'Hotel belum dikonfirmasi',
    items: [
      { id: 'pudong-7nov', label: 'Pudong / Aerotel transit 7 Nov' },
      { id: 'jiuzhaigou-9-10', label: 'Jiuzhaigou 9–10' },
      { id: 'bipenggou-11-12', label: 'Bipenggou 11–12' },
      { id: 'chengdu-13-14', label: 'Chengdu 13–14' },
      { id: 'lijiang-15-18', label: 'Lijiang 15 dan 18' },
      { id: 'shangri-la-16-18', label: 'Shangri-La twin 16–18 (teman daftar 17 Nov)' },
      { id: 'dali-19', label: 'Dali 19' },
      { id: 'kunming-20', label: 'Kunming 20' },
    ],
  },
  {
    id: 'cars',
    title: 'Mobil & transfer',
    items: [
      { id: 'songpan-11nov', label: 'Mobil Songpan (11 Nov Jiuzhaigou→Songpan→stasiun)' },
      { id: 'maoxian-bipenggou', label: 'Mobil Maoxian→Bipenggou + Bipenggou→Chengdu' },
      { id: 'lijiang-gorge-dukezong', label: 'Mobil Lijiang→Upper Gorge→Dukezong' },
      { id: 'tfu-hotel-8nov', label: 'Transfer TFU→hotel 8 Nov' },
    ],
  },
  {
    id: 'site',
    title: 'Info / perbaikan situs',
    items: [
      { id: 'day1-c5756', label: 'Hari 1 Info praktis masih teks utama (C5746 subuh) — perlu diselaraskan ke C5756' },
      { id: 'friday-prayer', label: 'Jam khotbah Jumat Huangcheng (13) & Dali (20)' },
      { id: 'g213-status', label: 'Status G213 Maoxian–Wenchuan sebelum 11 Nov' },
      { id: 'friend-train-17nov', label: 'Kereta teman Kunming→Shangri-La 17 Nov (saran C118/C86)' },
    ],
  },
];

const storageKey = 'calm-prepare-checklist';

const checklistItem = (item: ChecklistItem) => `<li><label class="prepare-check"><input type="checkbox" data-check-id="${e(item.id)}"><span>${e(item.label)}</span></label></li>`;

const checklistGroup = (group: ChecklistGroup) => `<fieldset class="prepare-checklist-group"><legend id="checklist-${e(group.id)}-title">${e(group.title)}</legend><ul class="prepare-checklist">${group.items.map(checklistItem).join('')}</ul></fieldset>`;

/** The calm preparation page's tick list. Checked state is restored in the browser; the prerender starts clear. */
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
  for (const box of boxes) box.checked = saved.has(box.dataset.checkId ?? '');
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
