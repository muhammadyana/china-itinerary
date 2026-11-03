import { places } from './itinerary.ts';
import { coverPhoto, guideDates, pageForPlace, placePath, type PlacePage } from './guides.ts';
import { escapeHtml, icon, photoImage } from './render.ts';

export function renderDestinationCard(page: PlacePage): string {
  const { guide } = page;
  const photo = coverPhoto(page);
  const dates = guideDates(page).map(day => `<time datetime="${day.date}">${Number(day.date.slice(-2))} November</time>`).join(', ');
  const stops = guide.placeIds.length > 1 ? guide.placeIds.flatMap(id => {
    const target = pageForPlace.get(id);
    return target ? [`<li><a href="${escapeHtml(placePath(target.slug))}">${escapeHtml(places[id].name)}</a></li>`] : [];
  }) : [];

  return `<article class="destination-card">
    <a class="destination-card-main" href="${escapeHtml(placePath(guide.slug))}">
      ${photo ? `<div class="destination-card-image">${photoImage(photo.id, photo.alt, false, '(min-width: 1100px) 400px, (min-width: 640px) 46vw, 92vw')}</div>` : ''}
      <div class="destination-card-body"><h3>${escapeHtml(guide.name)}</h3><p class="destination-card-date">${icon('calendar')}<span>${dates}</span></p></div>
    </a>
    ${stops.length ? `<ul class="destination-card-stops" aria-label="Pemberhentian di ${escapeHtml(guide.name)}">${stops.join('')}</ul>` : ''}
  </article>`;
}
