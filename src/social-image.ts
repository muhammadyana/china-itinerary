import { photos, userPhotos } from './itinerary.ts';

// Cards keep the Open Graph 1200 x 630 ratio, never enlarge past the tracked WebP, and stay above Facebook's 600 px minimum.
export function socialImage(photoId: string) {
  const photo = photos[photoId] ?? userPhotos[photoId];
  if (!photo) throw new Error(`Missing social photo: ${photoId}`);
  const sourceWidth = photo.sizes[photo.sizes.length - 1];
  const sourceHeight = Math.round(photo.height * sourceWidth / photo.width);
  const width = Math.max(600, Math.min(1200, sourceWidth, Math.floor(sourceHeight * 1200 / 630)));
  return { path: `/social/${photoId}.jpg`, source: `public/photos/${photoId}-${sourceWidth}.webp`, width, height: Math.round(width * 630 / 1200) };
}
