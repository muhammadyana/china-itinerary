import { photos, userPhotos } from './itinerary.ts';
import { galleryPhotos, type PlacePage } from './guides.ts';
import { escapeHtml as e, icon, photoImage, userPhotoDetail } from './render.ts';
import type { PhotoContent } from './photo-viewer.ts';

// The guide page's photo dialog, the only guide markup built in the browser; kept apart from guide-render.ts so the
// client bundle does not pull in the build-only page modules (the calm option's data among them).
export const external = (label: string, url: string) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)}<span class="visually-hidden"> (buka tab baru)</span>${icon('share')}</a>`;

export function guidePhotoDetail(page: PlacePage, index: number): PhotoContent {
  const gallery = galleryPhotos(page);
  const item = gallery[index];
  if (!item) return { image: '', caption: '' };
  if (userPhotos[item.id]) return userPhotoDetail(item.id, 'guide-photo-title');
  const photo = photos[item.id];
  return {
    image: photoImage(item.id, item.alt, true, '(min-width: 960px) 1000px, calc(100vw - 128px)'),
    caption: `<h2 id="guide-photo-title">${e(item.title)}</h2>${item.note ? `<p>${e(item.note)}</p>` : ''}${photo.photoNote && photo.photoNote !== item.note ? `<p>${e(photo.photoNote)}</p>` : ''}<p>Foto referensi. Warna daun, cuaca, dan akses dapat berbeda saat kunjungan.</p><div class="guide-photo-credit">${external(`Foto: ${photo.author}`, photo.source)}${photo.licenseUrl === photo.source ? `<p>${e(photo.license)}</p>` : external(photo.license, photo.licenseUrl)}<p>Ukuran disesuaikan ke WebP. Pemotongan hanya pada bingkai galeri.</p></div>`,
  };
}
