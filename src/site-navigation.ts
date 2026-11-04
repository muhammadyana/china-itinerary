import { days, places } from './itinerary.ts';
import { pageForPlace, placePath } from './guides.ts';
import { staysPath } from './stays.ts';
import { routeMapPath } from './route-map-main.ts';
// Kept as literals so the navigation does not pull page data into every page.
const preparePath = '/places/prepare/';
const trainsPath = '/places/trains/';

const initializedDocuments = new WeakSet<Document>();
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]!);

interface NavLink { href: string; label: string; action?: string; className?: string }
type Region = 'Sichuan' | 'Yunnan';
interface Destination { slug: string; name: string; region: Region }

const topLinks: { before: NavLink[]; after: NavLink[] } = {
  before: [
    { href: '/', label: 'Beranda' },
    { href: '/#itinerary', label: 'Itinerary', action: 'itinerary' },
  ],
  after: [
    // Hidden below 360px, where the Places panel carries the same link.
    { href: staysPath, label: 'Hotel', className: 'site-navigation-stays' },
    { href: '/#user-gallery', label: 'Galeri', action: 'gallery' },
    { href: '/#route', label: 'Rute', action: 'overview' },
  ],
};

const panelLinks: NavLink[] = [
  { href: '/places/', label: 'Lihat semua tempat' },
  { href: staysPath, label: 'Hotel & hostel per malam' },
  { href: routeMapPath, label: 'Peta rute 14 hari' },
  { href: preparePath, label: 'Persiapan & pemesanan' },
  { href: trainsPath, label: 'Kereta & timeline' },
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

const topLink = ({ href, label, action, className }: NavLink) =>
  `<a class="site-navigation-link${className ? ` ${className}` : ''}" href="${escapeHtml(href)}"${action ? ` data-action="${action}"` : ''}>${escapeHtml(label)}</a>`;

const panelLink = ({ href, label }: NavLink) =>
  `<a class="place-menu-all" href="${escapeHtml(href)}">${escapeHtml(label)}<span aria-hidden="true">↗</span></a>`;

const destinationItem = (place: Destination) =>
  `<li><a href="${escapeHtml(placePath(place.slug))}">${escapeHtml(place.name)}</a></li>`;

const regionGroup = (region: Region, places: Destination[]) =>
  `<section class="place-menu-group"><h2>${region}</h2><ol role="list">${places.filter(place => place.region === region).map(destinationItem).join('')}</ol></section>`;

function placeMenu() {
  const places = destinations();
  const summary = '<summary>Tempat<span class="place-menu-chevron" aria-hidden="true"></span></summary>';
  const panel = [...panelLinks.map(panelLink), regionGroup('Sichuan', places), regionGroup('Yunnan', places)].join('');
  return `<details class="place-menu">${summary}<div class="place-menu-panel">${panel}</div></details>`;
}

export function renderSiteNavigation(): string {
  const items = [...topLinks.before.map(topLink), placeMenu(), ...topLinks.after.map(topLink)].join('');
  return `<nav class="site-navigation" aria-label="Navigasi utama">${items}</nav>`;
}

export function initializeSiteNavigation(root: ParentNode = document): void {
  const navigation = root instanceof HTMLElement && root.matches('.site-navigation')
    ? root : root.querySelector<HTMLElement>('.site-navigation');
  if (!navigation) return;
  const ownerDocument = navigation.ownerDocument;
  if (initializedDocuments.has(ownerDocument)) return;
  initializedDocuments.add(ownerDocument);

  const openMenus = () => Array.from(ownerDocument.querySelectorAll<HTMLDetailsElement>('.site-navigation .place-menu[open]'));

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
