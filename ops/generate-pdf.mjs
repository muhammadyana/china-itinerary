import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat, writeFile, rename, rm } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
// 182 mm A4 content width at 96 CSS px per inch, so measured image boxes match their printed size.
const PRINT_VIEWPORT = { width: 688, height: 1123 };
const PRINT_PIXEL_RATIO = 2; // about 192 dpi at the printed size
const JPEG_QUALITY = 0.7;
// The deploy archive is capped; the photographic journal targets 8 MB and must never exceed 10 MB.
const MAX_PDF_BYTES = 10_000_000;

export async function generatePdfFromUrl(url) {
 const origin = new URL(url).origin;
 const browser = await chromium.launch({ headless: true, channel: process.env.CI ? undefined : 'chrome' });
 try {
  const page = await browser.newPage({ viewport: PRINT_VIEWPORT });
  const failures = [];
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    failures.push(`External resource rejected: ${route.request().url()}`);
    return route.abort();
  });
  page.on('response', response => { if (!response.ok()) failures.push(`Resource returned ${response.status()}: ${response.url()}`); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async ({ pixelRatio, quality }) => {
    document.querySelectorAll('details').forEach(details => { details.open = true; });
    document.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
    await document.fonts.ready;
    await Promise.all(Array.from(document.images, image => image.decode()));
    // Chrome embeds WebP losslessly, so re-encode each photo as a JPEG cropped and sized to its printed box.
    await Promise.all(Array.from(document.images, async image => {
      const box = image.getBoundingClientRect();
      if (!box.width || !box.height) throw new Error(`Printable image has no size: ${image.currentSrc}`);
      const { naturalWidth, naturalHeight } = image;
      const style = getComputedStyle(image);
      const aspect = style.objectFit === 'cover' ? box.width / box.height : naturalWidth / naturalHeight;
      const [focusX, focusY] = style.objectPosition.split(' ').map(value => {
        if (!value.endsWith('%')) throw new Error(`Printable image object-position must use percentages: ${image.currentSrc}`);
        return parseFloat(value) / 100;
      });
      const sourceWidth = Math.min(naturalWidth, naturalHeight * aspect);
      const sourceHeight = sourceWidth / aspect;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(Math.min(sourceWidth, box.width * pixelRatio));
      canvas.height = Math.round(canvas.width / aspect);
      const context = canvas.getContext('2d');
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, (naturalWidth - sourceWidth) * focusX, (naturalHeight - sourceHeight) * focusY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
      image.src = canvas.toDataURL('image/jpeg', quality);
      await image.decode();
    }));
  }, { pixelRatio: PRINT_PIXEL_RATIO, quality: JPEG_QUALITY });
  const dayCount = Number(await page.locator('meta[name="itinerary-day-count"]').getAttribute('content'));
  if (dayCount !== 14 || await page.locator('[data-print-date]').count() !== dayCount) throw new Error('Printable itinerary must contain all 14 days');
  if (!(await page.locator('.print-credit').first().textContent())?.includes('© @muhammad_yana')) throw new Error('Printable itinerary is missing its author credit');
  // The page footer (credit and page count) exists only if this browser parsed the @page margin boxes.
  const footer = await page.evaluate(() => {
    const pageRule = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules]).find(rule => rule instanceof CSSPageRule && !rule.selectorText);
    const margins = Object.fromEntries([...(pageRule?.cssRules ?? [])].map(rule => [rule.name, rule.style.content]));
    return Boolean(margins['bottom-left']?.includes('© @muhammad_yana') && margins['bottom-right']?.includes('counter(pages)'));
  });
  if (!footer) throw new Error('Browser does not support the @page footer with the author credit and page count');
  if (failures.length) throw new Error(failures.join('\n'));
  const filename = await page.locator('meta[name="itinerary-pdf-path"]').getAttribute('content');
  if (!filename || !/^[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/.test(filename)) throw new Error('Invalid generated PDF filename');
  // Page size, margins, and the footer come from @page rules in src/print.css so the cover can print edge to edge.
  const buffer = await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
  if (!buffer.subarray(0, 5).equals(Buffer.from('%PDF-')) || buffer.length < 10_000) throw new Error('Browser did not generate a complete PDF');
  if (buffer.length > MAX_PDF_BYTES) throw new Error(`Generated PDF is ${buffer.length} bytes, above the ${MAX_PDF_BYTES}-byte limit`);
  return { buffer, filename, dayCount };
 } finally {
  await browser.close();
 }
}

async function generateBuildPdf() {
 const distRoot = await realpath(fileURLToPath(new URL('../dist/', import.meta.url)));
 const server = createServer(async (request, response) => {
  try {
   if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405).end();
    return;
   }
   const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
   const candidate = resolve(distRoot, `.${pathname}${pathname.endsWith('/') ? 'index.html' : ''}`);
   const path = await realpath(candidate);
   if (!path.startsWith(`${distRoot}${sep}`) || !(await stat(path)).isFile()) {
    response.writeHead(404).end();
    return;
   }
   response.writeHead(200, { 'Content-Type': contentTypes[extname(path)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
   if (request.method === 'HEAD') response.end();
   else createReadStream(path).on('error', () => response.destroy()).pipe(response);
  } catch {
   response.writeHead(404).end();
  }
 });
 let temporaryPath;
 try {
  await new Promise((resolveListening, reject) => {
   server.once('error', reject);
   server.listen(0, '127.0.0.1', resolveListening);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Local print server did not start');
  const { buffer, filename, dayCount } = await generatePdfFromUrl(`http://127.0.0.1:${address.port}/print/`);
  const outputPath = resolve(distRoot, filename);
  temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, buffer);
  await rename(temporaryPath, outputPath);
  console.log(`Generated ${filename} from ${dayCount} itinerary days (${buffer.length} bytes).`);
 } finally {
  server.closeAllConnections();
  await new Promise(resolveClosed => server.close(resolveClosed));
  if (temporaryPath) await rm(temporaryPath, { force: true });
 }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generateBuildPdf();
