import { days, places } from './itinerary.ts';
import { pageForPlace, placePath } from './guides.ts';
import { planningPages, renderSiteSearch, searchTrigger } from './site-search.ts';

const initializedDocuments = new WeakSet<Document>();
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]!);

interface NavLink { href: string; label: string; action?: string }
type Region = 'Sichuan' | 'Yunnan';
interface Destination { slug: string; name: string; region: Region }

const topLinks: { before: NavLink[]; after: NavLink[] } = {
  before: [{ href: '/', label: 'Beranda' }],
  after: [
    { href: '/#user-gallery', label: 'Galeri', action: 'gallery' },
    { href: '/#route', label: 'Rute', action: 'overview' },
  ],
};

const itineraryLinks: NavLink[] = [
  { href: '/#itinerary', label: 'Lihat itinerary 14 hari', action: 'itinerary' },
  ...planningPages,
];

// One menu entry per guide page, in the order the itinerary first visits it.
function destinations(): Destination[] {
  const seen = new Set<string>();
  return days.flatMap(day => day.events.flatMap(event => {
    if (event.kind !== 'stop') return [];
    const page = pageForPlace.get(event.place);
    if (!page || seen.has(page.slug)) return [];
    seen.add(page.slug);
    return [{ slug: page.slug, name: places[event.place].name, region: page.guide.region }];
  }));
}

const actionAttribute = (action?: string) => action ? ` data-action="${escapeHtml(action)}"` : '';

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

const itineraryMenu = () => navMenu('itinerary', 'Itinerary', itineraryLinks.map(panelLink).join(''));

function placeMenu() {
  const places = destinations();
  return navMenu('place', 'Tempat', [panelLink({ href: '/places/', label: 'Lihat semua tempat' }), regionGroup('Sichuan', places), regionGroup('Yunnan', places)].join(''));
}

export function renderSiteNavigation(): string {
  const items = [...topLinks.before.map(topLink), itineraryMenu(), placeMenu(), ...topLinks.after.map(topLink), searchTrigger()].join('');
  return `<nav class="site-navigation" aria-label="Navigasi utama">${items}</nav>${renderSiteSearch()}`;
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
}
