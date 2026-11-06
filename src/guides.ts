import { days, highlights, photos, places, userPhotos } from './itinerary.ts';
import { northernGuides } from './guides/sichuan-north.ts';
import { westernGuides } from './guides/sichuan-west.ts';
import { yunnanGuides } from './guides/yunnan.ts';
import { chengduGuides } from './guides/chengdu.ts';
import type { DestinationGuide } from './guide-types.ts';

const transitStops = new Set(['zhaguanbeng', 'cable-car']);
export const guides = [...chengduGuides, ...northernGuides, ...westernGuides, ...yunnanGuides].map(guide => ({
  ...guide, placeIds: guide.placeIds.filter(id => !transitStops.has(id)),
}));

export interface PlacePage {
  slug: string;
  name: string;
  guide: DestinationGuide;
  placeId?: string;
}

export const placePages: PlacePage[] = guides.flatMap(guide => {
  const pages: PlacePage[] = [{ slug: guide.slug, name: guide.name, guide }];
  for (const id of guide.placeIds) {
    if (id !== guide.slug && (guide.placeIds.length > 1 || places[id].name !== guide.name)) {
      pages.push({ slug: id, name: places[id].name, guide, placeId: id });
    }
  }
  return pages;
});

export const pageBySlug = new Map(placePages.map(page => [page.slug, page]));
export const pageForPlace = new Map(guides.flatMap(guide => guide.placeIds.map(id => [id, pageBySlug.get(id) ?? pageBySlug.get(guide.slug)!] as const)));
export const guideForPlace = new Map(guides.flatMap(guide => guide.placeIds.map(id => [id, guide] as const)));
export const placePath = (slug: string) => `/places/${slug}/`;
export const guideDates = (page: PlacePage) => days.filter(day => day.events.some(event => event.kind === 'stop' && (page.placeId ? event.place === page.placeId : page.guide.placeIds.includes(event.place))));
// Guides the main plan visits; a calm-option-only guide stays out of the print journal and the PDF.
export const mainPlanGuides = guides.filter(guide => guideDates(pageBySlug.get(guide.slug)!).length);

export interface GalleryPhoto { id: string; title: string; alt: string; note?: string }
const extraPhotos: Record<string, GalleryPhoto[]> = {
  'impression-lijiang': Object.values(userPhotos).filter(photo => photo.location === 'Impression Lijiang, Yulong, Lijiang').map(photo => ({ id: photo.id, title: photo.title, alt: photo.alt })),
  bipenggou: Object.values(userPhotos).filter(photo => photo.location === 'Bipenggou').map(photo => ({ id: photo.id, title: photo.title, alt: photo.alt })),
  chengdu: [{ id: 'chengdu-taikoo', title: 'Malam di Taikoo Li', alt: 'Jalur pejalan kaki dan bangunan Taikoo Li diterangi cahaya malam, dengan gedung tinggi di belakangnya.', note: photos['chengdu-taikoo'].photoNote }],
  huanglong: [
    { id: 'tripcom-huanglong-terraces', title: 'Teras kolam Huanglong', alt: 'Kolam-kolam dangkal hijau toska dibatasi dinding travertin keemasan, dengan hutan pinus dan lereng gunung di belakangnya.' },
    { id: 'tripcom-huanglong', title: 'Kolam dan kuil di Huanglong', alt: 'Teras travertin keemasan berisi kolam dangkal hijau pucat di lembah gunung, dengan dua bangunan kuil beratap abu-abu dan langit biru berawan.' },
    { id: 'tripcom-huanglong-snow', title: 'Teras kolam saat bersalju', alt: 'Dilihat dari atas, kolam-kolam toska bertingkat dikelilingi pepohonan berselimut salju, dengan kuil di ujung lembah.' },
  ],
  jiuzhaigou: [{ id: 'highlight-jiuzhaigou', title: 'Musim gugur di Jiuzhaigou', alt: 'Hutan musim gugur memantul di danau Jiuzhaigou.' }],
  siguniangshan: [{ id: 'highlight-siguniang', title: 'Panorama Siguniangshan', alt: 'Puncak bersalju di kawasan Siguniangshan.' }],
  lijiang: [{ id: 'dayan', title: 'Kanal Kota Tua Lijiang', alt: 'Kanal dan jalan batu di Kota Tua Lijiang.' }],
  'blue-moon-valley': [{ id: 'blue-moon', title: 'Danau Blue Moon Valley', alt: 'Danau di kaki Jade Dragon Snow Mountain.' }],
  erhai: [{ id: 'erhai', title: 'Danau Erhai', alt: 'Bentang Danau Erhai di Dali.' }],
  dali: [{ id: 'dali-old-town', title: 'Kota Tua Dali', alt: 'Bangunan tradisional di Kota Tua Dali.' }],
};

export function galleryPhotos(page: PlacePage): GalleryPhoto[] {
  const ids = page.placeId ? [page.placeId] : page.guide.placeIds;
  const titles: Record<string, string> = { caicun: 'Danau Erhai (foto referensi)', 'kangding-mosque': 'Foto masjid pada PDF', wuhua: 'Panorama dari Menara Wuhua' };
  const items: GalleryPhoto[] = ids.flatMap(id => {
    const place = places[id];
    return place.photo && photos[place.photo] ? [{ id: place.photo, title: titles[id] ?? place.name, alt: place.alt || place.name, note: place.photoNote }] : [];
  });
  if (!page.placeId) items.push(...(extraPhotos[page.guide.slug] ?? []));
  return items.filter((item, index) => items.findIndex(other => other.id === item.id) === index);
}

export function coverPhoto(page: PlacePage): GalleryPhoto | undefined {
  if (!page.placeId) {
    const highlight = highlights.find(item => page.guide.placeIds.includes(item.place));
    if (highlight) {
      const place = places[highlight.place];
      return { id: highlight.photo || place.photo!, title: highlight.title, alt: highlight.alt || place.alt || place.name, note: place.photoNote };
    }
  }
  const gallery = galleryPhotos(page);
  return gallery.find(item => item.id === places[page.slug]?.photo) ?? gallery[0];
}
