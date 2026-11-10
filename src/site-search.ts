import { days, places, type Day } from './itinerary.ts';
import { guideDates, mainPlanGuides, placePages, placePath, type PlacePage } from './guides.ts';
import { staysPath } from './stays.ts';
import { routeMapPath } from './route-map-main.ts';
import { preparePath } from './bookings.ts';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]!);

// Index: plain data built from the itinerary and guides, no DOM.

// `date` marks a day result, so the homepage's day navigation handles it in place.
interface SearchEntry { href: string; title: string; detail: string; names: string[]; fields: string[]; date?: string }
interface IndexedEntry { entry: SearchEntry; names: string[]; text: string }
export interface PlanningPage { href: string; label: string; keywords: string }

const resultLimit = 20;
const tripTimeZone = 'Asia/Shanghai';
const searchLabel = 'Cari tempat dan itinerary';

/** A planning topic, with its main-plan page and its calm-option twin. */
export interface PlanTopic { topic: string; main: PlanningPage; calm: PlanningPage }

// The planning pages in pairs. They feed search, the Itinerary menu (one row per topic, after the 14-day itinerary itself)
// and the links between twins. The trains, costs and calm pages import the navigation, and costs.ts computes every line
// on load, so their paths stay literals here.
export const mainItineraryPath = '/places/main-itinerary/';
export const calmItineraryPage: PlanningPage = { href: '/places/calm-itinerary/', label: 'Itinerary santai', keywords: 'opsi santai calm hari demi hari jadwal timeline per hari alternatif' };
export const planTopics: PlanTopic[] = [
  {
    topic: 'Peta rute',
    main: { href: `${routeMapPath}?plan=utama`, label: 'Peta rute 14 hari', keywords: 'map perjalanan' },
    calm: { href: '/places/calm/', label: 'Opsi santai: kereta ke Yunnan', keywords: 'peta rute santai calm alternatif pilihan Jiuzhaigou dua malam Songpan Maoxian Bipenggou Panda Base Huangcheng Jumat Zhongshu Ge Zhongshuge 钟书阁 Dujiangyan toko buku D239 Lijiang Tiger Leaping Gorge Upper Gorge Napahai' },
  },
  {
    topic: 'Hotel & hostel',
    main: { href: `${staysPath}?plan=utama`, label: 'Hotel & hostel per malam', keywords: 'penginapan menginap akomodasi' },
    calm: { href: '/places/calm-stays/', label: 'Hotel & hostel santai', keywords: 'opsi santai calm penginapan menginap akomodasi hotel hostel guesthouse per malam paspor asing' },
  },
  {
    topic: 'Persiapan & pemesanan',
    main: { href: `${preparePath}?plan=utama`, label: 'Persiapan & pemesanan', keywords: 'booking tiket biaya pembayaran internet darurat KBRI asuransi' },
    calm: { href: '/places/calm-prepare/', label: 'Persiapan santai', keywords: 'opsi santai calm booking pesan tiket kereta mobil hotel jangan dibeli persiapan pemesanan checklist centang' },
  },
  {
    topic: 'Rincian biaya',
    main: { href: '/places/costs/?plan=utama', label: 'Rincian biaya', keywords: 'biaya harga budget anggaran rupiah yuan total per hari' },
    calm: { href: '/places/calm-costs/', label: 'Rincian biaya santai', keywords: 'opsi santai calm biaya harga budget anggaran rupiah yuan total per hari' },
  },
  {
    topic: 'Kereta & timeline',
    main: { href: '/places/trains/?plan=utama', label: 'Kereta & timeline', keywords: 'tiket kereta train stasiun jadwal jam' },
    calm: { href: '/places/calm-trains/', label: 'Kereta & timeline santai', keywords: 'opsi santai calm tiket kereta train stasiun jadwal jam bagasi koper transfer bus C5772 C5754 D239' },
  },
];
// The trip's own spending page has no plan twin.
export const expensesPage: PlanningPage = { href: '/places/expenses/', label: 'Pengeluaran trip', keywords: 'pengeluaran expense catat uang belanja dibayar total visa pesawat' };
export const planningPages: PlanningPage[] = [...planTopics.map(topic => topic.main), calmItineraryPage, ...planTopics.map(topic => topic.calm), expensesPage];

const tripDate = (date: string) => new Date(`${date}T12:00:00+08:00`);
const dayMonth = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', timeZone: tripTimeZone });
const weekdayDayMonth = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', timeZone: tripTimeZone });

// Case, diacritics and apostrophes do not matter ("Gao’ersi" finds "gaoersi"); Chinese characters stay searchable.
const normalize = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
  .replace(/['‘’ʼ`]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
// Hyphenated words are indexed split and joined, so both "colour lake" and "shangrila" match.
const variants = (value: string) => value.includes('-') ? [value, value.replace(/-/g, '')] : [value];
// Words match from their start ("8" is not "18"); Han script has no spaces, so it matches anywhere.
const hasWord = (text: string, query: string) =>
  /\p{Script=Han}/u.test(query) ? text.includes(query) : ` ${text}`.includes(` ${query}`);

function placeEntry(page: PlacePage): SearchEntry {
  const dates = guideDates(page).map(day => dayMonth.format(tripDate(day.date)));
  const chinese = (page.placeId ? [page.placeId] : page.guide.placeIds).flatMap(id => places[id]?.chinese ?? []);
  return {
    href: placePath(page.slug),
    title: page.name,
    detail: ['Tempat', page.guide.region, dates.join(', '), mainPlanGuides.includes(page.guide) ? '' : 'opsi santai'].filter(Boolean).join(' · '),
    names: [page.name],
    fields: [...chinese, page.guide.name, page.guide.region, page.guide.summary, ...dates],
  };
}

function dayEntry(day: Day, index: number): SearchEntry {
  const label = `Hari ${index + 1} · ${weekdayDayMonth.format(tripDate(day.date))}`;
  const stops = day.events.flatMap(event => event.kind === 'stop' ? [places[event.place].name, places[event.place].chinese ?? ''] : []);
  return {
    href: `/#${day.date}`,
    date: day.date,
    title: label,
    detail: day.title,
    names: [label, day.title, day.shortTitle],
    fields: [...day.route, day.overnight?.name ?? '', day.transport, ...stops],
  };
}

const planningEntry = ({ href, label, keywords }: PlanningPage): SearchEntry =>
  ({ href, title: label, detail: 'Perencanaan', names: [label], fields: [keywords] });

function indexEntry(entry: SearchEntry): IndexedEntry {
  const names = entry.names.flatMap(variants).map(normalize);
  return { entry, names, text: [...names, ...entry.fields.flatMap(variants).map(normalize)].join(' ') };
}

const buildSearchIndex = (): IndexedEntry[] =>
  [...planningPages.map(planningEntry), ...placePages.map(placeEntry), ...days.map(dayEntry)].map(indexEntry);

// 0: a name starts with the query, 1: a name contains it, 2: another field contains it whole,
// 3: every word is in some name, 4: the words are spread over fields, -1: no match.
// A whole phrase beats scattered words, so "12 november" lists that date's places before "Hari 12 · 19 November".
function rank({ names, text }: IndexedEntry, tokens: string[], phrase: string): number {
  if (!tokens.every(token => hasWord(text, token))) return -1;
  if (names.some(name => name.startsWith(phrase))) return 0;
  if (names.some(name => hasWord(name, phrase))) return 1;
  if (hasWord(text, phrase)) return 2;
  return tokens.every(token => names.some(name => hasWord(name, token))) ? 3 : 4;
}

// Without a query: today's day during the trip (otherwise the first day) and the planning pages.
function suggestions(today: string): SearchEntry[] {
  const index = Math.max(0, days.findIndex(day => day.date === today));
  return [dayEntry(days[index], index), ...planningPages.map(planningEntry)];
}

function searchSite(index: IndexedEntry[], query: string, today: string): { entries: SearchEntry[]; status: string } {
  const phrase = normalize(query);
  if (!phrase) return { entries: suggestions(today), status: 'Saran untuk memulai' };
  const tokens = phrase.split(' ');
  const matches = index.map(item => ({ item, score: rank(item, tokens, phrase) }))
    .filter(match => match.score >= 0)
    .sort((a, b) => a.score - b.score);
  const entries = matches.slice(0, resultLimit).map(match => match.item.entry);
  if (!entries.length) return { entries, status: `Tidak ada hasil untuk “${query.trim()}”. Coba nama tempat, kota, atau tanggal, misalnya Dali atau 12 November.` };
  if (matches.length > entries.length) return { entries, status: `Menampilkan ${entries.length} dari ${matches.length} hasil. Tambahkan kata kunci untuk mempersempit.` };
  return { entries, status: `${entries.length} hasil` };
}

// Components: HTML strings, rendered at build time and in the browser.

const icon = (paths: string) =>
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const searchIcon = icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>');
const closeIcon = icon('<path d="m6 6 12 12M6 18 18 6"/>');

// Without JavaScript the trigger simply opens the places list.
export const searchTrigger = () =>
  `<a class="site-navigation-link site-search-trigger" href="/places/" data-action="search" aria-label="${escapeHtml(searchLabel)}">${searchIcon}</a>`;

const dateAttribute = (date?: string) => date ? ` data-date="${escapeHtml(date)}"` : '';

const resultItem = ({ href, title, detail, date }: SearchEntry) =>
  `<li><a class="site-search-result" href="${escapeHtml(href)}"${dateAttribute(date)}><span class="site-search-result-title">${escapeHtml(title)}</span><span class="site-search-result-detail">${escapeHtml(detail)}</span></a></li>`;

const searchHeader = () =>
  `<div class="dialog-header"><h2 id="site-search-title"><label for="site-search-input">${escapeHtml(searchLabel)}</label></h2><button type="button" class="icon-button" data-action="close" aria-label="Tutup pencarian">${closeIcon}</button></div>`;

const searchField = () =>
  `<div class="site-search-field">${searchIcon}<input id="site-search-input" type="search" name="q" autocomplete="off" enterkeyhint="go" placeholder="Tempat, kota, atau tanggal"></div>`;

const searchForm = () =>
  `<form class="site-search-form" role="search" aria-labelledby="site-search-title">${searchField()}<p class="site-search-status" role="status"></p><ul class="site-search-results" role="list"></ul></form>`;

export const renderSiteSearch = () =>
  `<dialog class="site-search-dialog" id="site-search" aria-labelledby="site-search-title">${searchHeader()}${searchForm()}</dialog>`;

// DOM wiring.

const hasModifier = (event: MouseEvent | KeyboardEvent) => event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
const isTyping = (element: Element | null) => element instanceof HTMLElement && (element.isContentEditable || element.matches('input, textarea, select'));
const isShortcut = (event: KeyboardEvent) => !event.altKey && (
  (event.key === '/' && !event.ctrlKey && !event.metaKey) || (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey))
);
const statusPause = 400;
const todayInChina = () => new Intl.DateTimeFormat('en-CA', { timeZone: tripTimeZone }).format(new Date());

export function initializeSiteSearch(root: Document = document): void {
  const dialog = root.querySelector<HTMLDialogElement>('#site-search');
  const trigger = root.querySelector<HTMLAnchorElement>('.site-navigation [data-action="search"]');
  if (!dialog || !trigger) return;
  const form = dialog.querySelector<HTMLFormElement>('form[role="search"]')!;
  const input = form.querySelector<HTMLInputElement>('input[type="search"]')!;
  const status = form.querySelector<HTMLElement>('[role="status"]')!;
  const list = form.querySelector<HTMLElement>('.site-search-results')!;
  let index: IndexedEntry[] | undefined;
  let statusTimer: ReturnType<typeof setTimeout> | undefined;
  let followedResult = false;

  const update = (pause = 0) => {
    const result = searchSite(index ??= buildSearchIndex(), input.value, todayInChina());
    list.innerHTML = result.entries.map(resultItem).join('');
    // The count is announced once typing pauses, not on every keystroke.
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.textContent = result.status; }, pause);
  };
  const open = () => {
    update();
    followedResult = false;
    // An open nav dropdown would otherwise take the first Escape.
    for (const menu of root.querySelectorAll<HTMLDetailsElement>('.site-navigation .nav-menu[open]')) menu.open = false;
    dialog.showModal();
    root.documentElement.classList.add('dialog-open');
    input.focus();
    input.select();
  };

  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.addEventListener('click', event => {
    if (hasModifier(event)) return;
    event.preventDefault();
    open();
  });
  root.addEventListener('keydown', event => {
    if (!isShortcut(event) || event.defaultPrevented || isTyping(root.activeElement) || root.querySelector('dialog[open]')) return;
    event.preventDefault();
    open();
  });
  input.addEventListener('input', () => update(statusPause));
  // In a search field Chrome's first Escape only clears the text; one press should close.
  input.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    dialog.close();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    list.querySelector('a')?.click();
  });

  dialog.addEventListener('keydown', event => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const items = [input, ...list.querySelectorAll<HTMLAnchorElement>('a')];
    const current = items.findIndex(item => item === root.activeElement);
    if (current < 0) return;
    event.preventDefault();
    items[(current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
  });
  dialog.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('[data-action="close"]')) dialog.close();
    else if (event.target.closest('a')) {
      if (hasModifier(event)) return;
      followedResult = true;
      dialog.close();
    }
    else if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    if (!root.querySelector('dialog[open]')) root.documentElement.classList.remove('dialog-open');
    // A followed result owns focus: a page load, or the day heading on the homepage.
    if (!followedResult) trigger.focus({ preventScroll: true });
  });
}
