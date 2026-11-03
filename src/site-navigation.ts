import { days, places } from './itinerary.ts';
import { pageForPlace, placePath } from './guides.ts';
import { staysPath } from './stays.ts';

const initializedDocuments = new WeakSet<Document>();
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]!);

export function renderSiteNavigation(): string {
  const seen = new Set<string>();
  const destinations = days.flatMap(day => day.events.flatMap(event => {
    if (event.kind !== 'stop') return [];
    const page = pageForPlace.get(event.place);
    if (!page || seen.has(page.slug)) return [];
    seen.add(page.slug);
    return [{ slug: page.slug, name: places[event.place].name, region: page.guide.region }];
  }));

  const groups = (['Sichuan', 'Yunnan'] as const).map(region => `<section class="place-menu-group"><h2>${region}</h2><ol role="list">${destinations.filter(place => place.region === region).map(place => `<li><a href="${escapeHtml(placePath(place.slug))}">${escapeHtml(place.name)}</a></li>`).join('')}</ol></section>`).join('');

  return `<nav class="site-navigation" aria-label="Navigasi utama"><a class="site-navigation-link" href="/">Beranda</a><a class="site-navigation-link" href="/#itinerary" data-action="itinerary">Itinerary</a><details class="place-menu"><summary>Tempat<span class="place-menu-chevron" aria-hidden="true"></span></summary><div class="place-menu-panel"><a class="place-menu-all" href="/places/">Lihat semua tempat<span aria-hidden="true">↗</span></a><a class="place-menu-all" href="${staysPath}">Hotel & hostel per malam<span aria-hidden="true">↗</span></a>${groups}</div></details><a class="site-navigation-link site-navigation-stays" href="${staysPath}">Hotel</a><a class="site-navigation-link" href="/#user-gallery" data-action="gallery">Galeri</a><a class="site-navigation-link" href="/#route" data-action="overview">Rute</a></nav>`;
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
