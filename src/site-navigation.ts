import { days, places } from './itinerary.ts';
import { mainPlanGuides, pageForPlace, placePages, placePath } from './guides.ts';
import { calmItineraryPage, planTopics, renderSiteSearch, searchTrigger } from './site-search.ts';
import { logoMark } from './logo.ts';

const initializedDocuments = new WeakSet<Document>();
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]!);

interface NavLink { href: string; label: string; action?: string }
type Region = 'Sichuan' | 'Yunnan';
interface Destination { slug: string; name: string; region: Region }

const home: NavLink = { href: '/', label: 'Beranda' };

const topLinks: NavLink[] = [
  { href: '/#user-gallery', label: 'Galeri', action: 'gallery' },
  { href: '/#route', label: 'Rute', action: 'overview' },
];

// One row per planning topic, each with the main plan and the calm option. The 14-day itinerary is the homepage:
// Santai is `/#itinerary`, Utama is `/?plan=utama#itinerary`. Search still reaches each day on its own.
const legacyCalmItinerary = '/places/calm-itinerary/';
interface PlanRow { topic: string; main: NavLink; calm: NavLink }
const planRows: PlanRow[] = [
  { topic: 'Itinerary 14 hari', main: { href: '/?plan=utama#itinerary', label: 'Itinerary 14 hari' }, calm: calmItineraryPage },
  ...planTopics,
];
const plans = { main: { short: 'Utama', name: 'rencana utama' }, calm: { short: 'Santai', name: 'opsi santai' } };
type Plan = keyof typeof plans;
const pagePath = (href: string) => { const path = href.split('#')[0].split('?')[0]; return path || '/'; };

// One menu entry per guide page, in the order the itinerary first visits it; pages only the calm option visits follow.
function destinations(): Destination[] {
  const seen = new Set<string>();
  const mainPlan = days.flatMap(day => day.events.flatMap(event => {
    if (event.kind !== 'stop') return [];
    const page = pageForPlace.get(event.place);
    if (!page || seen.has(page.slug)) return [];
    seen.add(page.slug);
    return [{ slug: page.slug, name: places[event.place].name, region: page.guide.region }];
  }));
  const calmOnly = placePages.filter(page => !mainPlanGuides.includes(page.guide))
    .map(page => ({ slug: page.slug, name: `${page.name} (opsi santai)`, region: page.guide.region }));
  return [...mainPlan, ...calmOnly];
}

const actionAttribute = (action?: string) => action ? ` data-action="${escapeHtml(action)}"` : '';

// The logo stands in for the visible label; aria-label keeps the link's name.
const homeLink = ({ href, label }: NavLink) =>
  `<a class="site-navigation-link site-navigation-home" href="${escapeHtml(href)}" aria-label="${escapeHtml(label)}">${logoMark()}</a>`;

const topLink = ({ href, label, action }: NavLink) =>
  `<a class="site-navigation-link" href="${escapeHtml(href)}"${actionAttribute(action)}>${escapeHtml(label)}</a>`;

const panelLink = ({ href, label, action }: NavLink) =>
  `<a class="nav-menu-link" href="${escapeHtml(href)}"${actionAttribute(action)}>${escapeHtml(label)}<span aria-hidden="true">↗</span></a>`;

const destinationItem = (place: Destination) =>
  `<li><a href="${escapeHtml(placePath(place.slug))}">${escapeHtml(place.name)}</a></li>`;

const regionGroup = (region: Region, places: Destination[]) =>
  `<section class="place-menu-group"><h2>${region}</h2><ol role="list">${places.filter(place => place.region === region).map(destinationItem).join('')}</ol></section>`;

// A native disclosure, so both menus open without JavaScript.
const navMenu = (name: string, label: string, panel: string) =>
  `<details class="nav-menu ${name}-menu"><summary>${label}<span class="nav-menu-chevron" aria-hidden="true"></span></summary><div class="nav-menu-panel ${name}-menu-panel">${panel}</div></details>`;

// Both plans as a pair of real links; the visible "Utama"/"Santai" gains its topic in the accessible name.
function planChoice(row: PlanRow, plan: Plan, current: string) {
  const link = row[plan];
  const linkPath = pagePath(link.href);
  // Homepage `/` is shared. Utama links carry `?plan=utama`, so bare `/` selects Santai, not Utama.
  const isUtamaQueryHome = plan === 'main' && linkPath === '/' && link.href.includes('plan=utama');
  const isSantaiHome = plan === 'calm' && linkPath === '/' && current === legacyCalmItinerary;
  const matches = (linkPath === current && !(isUtamaQueryHome && current === '/')) || isSantaiHome;
  const currentPage = matches ? ' aria-current="page"' : '';
  return `<a class="plan-choice" href="${escapeHtml(link.href)}"${actionAttribute(link.action)} aria-label="${escapeHtml(`${row.topic}, ${plans[plan].name}`)}"${currentPage}>${plans[plan].short}</a>`;
}

// Santai first: calm is the active plan (AGENTS.md). Utama stays reachable as the second choice.
const planRow = (row: PlanRow, current: string) =>
  `<li class="plan-row"><span class="plan-row-topic">${escapeHtml(row.topic)}</span><span class="plan-row-choices">${planChoice(row, 'calm', current)}${planChoice(row, 'main', current)}</span></li>`;

const itineraryMenu = (current: string) =>
  navMenu('itinerary', 'Itinerary', `<ol class="plan-rows" role="list">${planRows.map(row => planRow(row, current)).join('')}</ol>`);

/** On a planning page (or the homepage itinerary), a quiet link to the same topic in the other plan; empty elsewhere.
 * Both itinerary choices share the path `/`, so `active` says which one this page is showing. */
export function planSwitch(current: string, active: Plan = 'main'): string {
  const row = planRows.find(item => pagePath(item.main.href) === current || pagePath(item.calm.href) === current)
    ?? (current === legacyCalmItinerary ? planRows[0] : undefined);
  if (!row) return '';
  const mainPath = pagePath(row.main.href);
  const calmPath = pagePath(row.calm.href);
  const showingMain = current === legacyCalmItinerary ? false
    : mainPath !== calmPath ? mainPath === current
    : active === 'main';
  const [target, label] = showingMain ? [row.calm, 'Lihat versi opsi santai'] : [row.main, 'Lihat versi rencana utama'];
  return `<p class="plan-switch"><a class="text-link" href="${escapeHtml(target.href)}">${label}</a></p>`;
}

function placeMenu() {
  const places = destinations();
  return navMenu('place', 'Tempat', [panelLink({ href: '/places/', label: 'Lihat semua tempat' }), regionGroup('Sichuan', places), regionGroup('Yunnan', places)].join(''));
}

/** `current` is the page's path, so the Itinerary menu can mark it. */
export function renderSiteNavigation(current = ''): string {
  const items = [homeLink(home), itineraryMenu(current), placeMenu(), ...topLinks.map(topLink), searchTrigger()].join('');
  return `<nav class="site-navigation" aria-label="Navigasi utama">${items}</nav>${renderSiteSearch()}`;
}


/** Mark Santai current by default; Utama only when this page was opened with ?plan=utama. */
function syncPlanChoiceCurrent(ownerDocument: Document) {
  const location = ownerDocument.defaultView?.location;
  if (!location) return;
  const wantsMain = new URLSearchParams(location.search).get('plan') === 'utama';
  const here = pagePath(location.pathname);
  for (const link of ownerDocument.querySelectorAll<HTMLAnchorElement>('.plan-choice')) {
    link.removeAttribute('aria-current');
  }
  for (const row of ownerDocument.querySelectorAll('.plan-row')) {
    const choices = [...row.querySelectorAll<HTMLAnchorElement>('.plan-choice')];
    if (choices.length < 2) continue;
    const [calm, main] = choices;
    const calmPath = pagePath(calm.getAttribute('href') || '');
    const mainPath = pagePath(main.getAttribute('href') || '');
    // Bare `/` is Santai. Utama is current only with ?plan=utama. The old calm-itinerary URL counts as Santai too.
    if (calmPath === '/' && mainPath === '/' && here === '/') {
      (wantsMain ? main : calm).setAttribute('aria-current', 'page');
    } else if ((here === legacyCalmItinerary && calmPath === '/') || calmPath === here || (mainPath === here && !wantsMain)) {
      calm.setAttribute('aria-current', 'page');
    } else if (mainPath === here && wantsMain) {
      main.setAttribute('aria-current', 'page');
    }
  }
}

export function initializeSiteNavigation(root: ParentNode = document): void {
  const navigation = root instanceof HTMLElement && root.matches('.site-navigation')
    ? root : root.querySelector<HTMLElement>('.site-navigation');
  if (!navigation) return;
  const ownerDocument = navigation.ownerDocument;
  if (initializedDocuments.has(ownerDocument)) return;
  initializedDocuments.add(ownerDocument);

  const openMenus = () => Array.from(ownerDocument.querySelectorAll<HTMLDetailsElement>('.site-navigation .nav-menu[open]'));

  ownerDocument.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    for (const menu of openMenus()) {
      const selectedLink = target instanceof Element && target.closest('a');
      if (!menu.contains(target) || selectedLink) menu.open = false;
    }
  });

  ownerDocument.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const menus = openMenus();
    if (!menus.length) return;
    const activeMenu = menus.find(menu => menu.contains(ownerDocument.activeElement)) ?? menus[0];
    for (const menu of menus) menu.open = false;
    activeMenu.querySelector('summary')?.focus();
    event.preventDefault();
  });

  syncPlanChoiceCurrent(ownerDocument);
}
