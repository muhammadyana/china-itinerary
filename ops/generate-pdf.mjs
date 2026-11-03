import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat, writeFile, rename, rm } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

export async function generatePdfFromUrl(url) {
 const origin = new URL(url).origin;
 const browser = await chromium.launch({ headless: true, channel: process.env.CI ? undefined : 'chrome' });
 try {
  const page = await browser.newPage();
  const failures = [];
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    failures.push(`External resource rejected: ${route.request().url()}`);
    return route.abort();
  });
  page.on('response', response => { if (!response.ok()) failures.push(`Resource returned ${response.status()}: ${response.url()}`); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => {
    document.querySelectorAll('details').forEach(details => { details.open = true; });
    document.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
    await document.fonts.ready;
    await Promise.all(Array.from(document.images, image => image.decode()));
  });
  const dayCount = Number(await page.locator('meta[name="itinerary-day-count"]').getAttribute('content'));
  if (dayCount !== 14 || await page.locator('[data-print-date]').count() !== dayCount) throw new Error('Printable itinerary must contain all 14 days');
  if (!(await page.locator('.print-credit').first().textContent())?.includes('© @muhammad_yana')) throw new Error('Printable itinerary is missing its author credit');
  if (failures.length) throw new Error(failures.join('\n'));
  const filename = await page.locator('meta[name="itinerary-pdf-path"]').getAttribute('content');
  if (!filename || !/^[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/.test(filename)) throw new Error('Invalid generated PDF filename');
  const buffer = await page.pdf({
    preferCSSPageSize: true, printBackground: true, tagged: true, outline: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:9px;width:100%;padding:0 14mm;display:flex;justify-content:space-between"><span>© @muhammad_yana</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
    margin: { top: '16mm', right: '14mm', bottom: '20mm', left: '14mm' },
  });
  if (!buffer.subarray(0, 5).equals(Buffer.from('%PDF-')) || buffer.length < 10_000) throw new Error('Browser did not generate a complete PDF');
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
