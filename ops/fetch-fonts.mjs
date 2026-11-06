// Satoshi (Fontshare, ITF Free Font License) may be self-hosted but not redistributed through a public repository, so
// the build downloads it into the gitignored fonts/ folder instead of committing it. Vite then bundles it into assets/.
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

const target = new URL('../fonts/Satoshi-Variable.woff2', import.meta.url);
const cssUrl = 'https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap';

if (!existsSync(target)) {
  const css = await (await fetch(cssUrl)).text();
  const path = css.match(/url\('(\/\/cdn\.fontshare\.com\/[^']+\.woff2)'\)/)?.[1];
  if (!path) throw new Error(`No Satoshi woff2 URL in ${cssUrl}`);
  const response = await fetch(`https:${path}`);
  if (!response.ok) throw new Error(`Satoshi download failed: ${response.status}`);
  await mkdir(new URL('../fonts/', import.meta.url), { recursive: true });
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
  console.log(`Downloaded Satoshi to ${target.pathname}`);
}
