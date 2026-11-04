export const routeMapPath = '/places/map/';

// Hovering or focusing a day in the timeline spotlights its legs on the prerendered map.
export function initializeRouteMap(): void {
  const page = document.querySelector<HTMLElement>('[data-route-map]');
  if (!page) return;
  const svg = page.querySelector<SVGSVGElement>('.route-map');
  if (!svg) return;
  const spotlight = (date: string | null) => {
    svg.classList.toggle('has-active', Boolean(date));
    for (const group of svg.querySelectorAll<SVGGElement>('.route-day,.route-badge')) group.classList.toggle('is-active', group.dataset.day === date);
  };
  for (const entry of page.querySelectorAll<HTMLElement>('.route-timeline [data-day]')) {
    entry.addEventListener('pointerenter', () => spotlight(entry.dataset.day ?? null));
    entry.addEventListener('pointerleave', () => spotlight(null));
    entry.addEventListener('focusin', () => spotlight(entry.dataset.day ?? null));
    entry.addEventListener('focusout', () => spotlight(null));
  }
}
