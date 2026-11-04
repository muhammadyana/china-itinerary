export const routeMapPath = '/places/map/';

// Hovering or focusing a day in the timeline spotlights its legs on the prerendered map.
// On narrow screens the timeline is a strip at the bottom: a tap selects a day, and tapping a day on the map scrolls the strip to it.
export function initializeRouteMap(): void {
  const page = document.querySelector<HTMLElement>('[data-route-map]');
  if (!page) return;
  const svg = page.querySelector<SVGSVGElement>('.route-map');
  if (!svg) return;
  const entries = Array.from(page.querySelectorAll<HTMLElement>('.route-timeline [data-day]'));
  const strip = matchMedia('(max-width: 959px)');
  let selected: string | null = null;
  const spotlight = (date: string | null) => {
    svg.classList.toggle('has-active', Boolean(date));
    for (const group of svg.querySelectorAll<SVGGElement>('.route-day,.route-badge')) group.classList.toggle('is-active', group.dataset.day === date);
  };
  const select = (date: string, reveal: boolean) => {
    selected = date;
    for (const entry of entries) entry.classList.toggle('is-selected', entry.dataset.day === date);
    spotlight(date);
    const entry = entries.find(item => item.dataset.day === date);
    if (reveal && entry) entry.scrollIntoView({ block: 'nearest', inline: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  for (const entry of entries) {
    entry.addEventListener('pointerenter', () => spotlight(entry.dataset.day ?? null));
    entry.addEventListener('pointerleave', () => spotlight(selected));
    entry.addEventListener('focusin', () => spotlight(entry.dataset.day ?? null));
    entry.addEventListener('focusout', () => spotlight(selected));
    entry.addEventListener('click', event => {
      if (!strip.matches || (event.target instanceof Element && event.target.closest('a'))) return;
      select(entry.dataset.day!, false);
    });
  }
  svg.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest<SVGAElement>('a') : null;
    const date = link?.getAttribute('href')?.replace('#day-', '');
    if (!strip.matches || !date || !entries.some(entry => entry.dataset.day === date)) return;
    event.preventDefault();
    select(date, true);
  });
}
