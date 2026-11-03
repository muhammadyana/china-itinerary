// Regenerates the committed Open Graph cards from tracked WebP photos. Requires ImageMagick (`magick`).
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { coverPhoto, placePages } from '../src/guides.ts';
import { socialImage } from '../src/social-image.ts';

// Portrait and off-centre photos keep their subject inside the landscape card.
const gravity = { chonggu: 'south' };

const root = fileURLToPath(new URL('../', import.meta.url));
const ids = new Set(placePages.map(page => coverPhoto(page)?.id).filter(Boolean));
for (const id of ids) {
  const { path, source, width, height } = socialImage(id);
  execFileSync('magick', [source, '-resize', `${width}x${height}^`, '-gravity', gravity[id] ?? 'center', '-extent', `${width}x${height}`,
    '-strip', '-sampling-factor', '4:4:4', '-interlace', 'JPEG', '-quality', '82', `public${path}`], { cwd: root });
  console.log(`${path} ${width}x${height} from ${source}`);
}
