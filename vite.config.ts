import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { shell } from './src/render.ts';
import { guideView, placesIndex } from './src/guide-render.ts';
import { coverPhoto, pageBySlug, placePages, placePath, type GalleryPhoto, type PlacePage } from './src/guides.ts';
import { staysView } from './src/stays-render.ts';
import { staysPath } from './src/stays.ts';
import { routeMapView } from './src/route-map.ts';
import { routeMapPath } from './src/route-map-main.ts';
import { prepareView, preparePath } from './src/prepare.ts';
import { escapeHtml } from './src/render.ts';
import { renderPrintDocument } from './src/print-render.ts';
import { pdfPath } from './src/itinerary.ts';
import { socialImage } from './src/social-image.ts';
import { generatePdfFromUrl } from './ops/generate-pdf.mjs';

const printStyles = readFileSync(new URL('./src/print.css', import.meta.url), 'utf8');

// Link previews show the same photograph as the page hero instead of the site-wide Jiuzhaigou card.
function socialMeta(html: string, cover?: GalleryPhoto) {
 if (!cover) return html;
 const image = socialImage(cover.id);
 return html.replace(/<meta (property="og:image"|name="twitter:image") content="[^"]*">/g, (_match, attribute) => `<meta ${attribute} content="https://china.muhammadyana.me${image.path}">`)
  .replace(/<meta (property="og:image:alt"|name="twitter:image:alt") content="[^"]*">/g, (_match, attribute) => `<meta ${attribute} content="${escapeHtml(cover.alt)}">`)
  .replace(/<meta property="og:image:width" content="[^"]*">/, `<meta property="og:image:width" content="${image.width}">`)
  .replace(/<meta property="og:image:height" content="[^"]*">/, `<meta property="og:image:height" content="${image.height}">`);
}

function pageHtml(html: string, title: string, description: string, path: string, body: string) {
 const url = `https://china.muhammadyana.me${path}`;
 return html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
  .replace(/<meta (property="og:title"|name="twitter:title") content="[^"]*">/g, (_match, attribute) => `<meta ${attribute} content="${escapeHtml(title)}">`)
  .replace(/<meta (name="description"|property="og:description"|name="twitter:description") content="[^"]*">/g, (_match, attribute) => `<meta ${attribute} content="${escapeHtml(description)}">`)
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
  .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
  .replace(/<!--page-start-->[\s\S]*?<!--page-end-->/, `<!--page-start--><div id="app">${body}</div><!--page-end-->`);
}

function destinationHtml(html: string, page?: PlacePage) {
 const title = page ? `${page.name}: rute, biaya & galeri | China 2026` : 'Panduan tempat di Sichuan & Yunnan | China 2026';
 const description = page ? (page.placeId ? `Cara menuju ${page.name}, biaya kawasan, galeri, dan tips perjalanan November 2026.` : page.guide.summary) : 'Panduan setiap tempat wisata dalam itinerary Sichuan dan Yunnan, 8 sampai 21 November 2026.';
 return socialMeta(pageHtml(html, title, description, page ? placePath(page.slug) : '/places/', page ? guideView(page) : placesIndex()), page && coverPhoto(page));
}

const routeMapHtml = (html: string) => pageHtml(html, 'Peta rute 14 hari | China 2026', 'Peta titik ke titik perjalanan Sichuan dan Yunnan, 8 sampai 21 November 2026: urutan hari, moda, dan tempat menginap.', routeMapPath, routeMapView());
const prepareHtml = (html: string) => pageHtml(html, 'Persiapan & pemesanan | China 2026', 'Yang sudah beres, yang harus dipesan dan kapan, perkiraan biaya, internet, serta nomor darurat untuk perjalanan Sichuan dan Yunnan 8–21 November 2026.', preparePath, prepareView());
const staysHtml = (html: string) => pageHtml(html, 'Hotel & hostel per malam | China 2026', 'Satu hotel dan satu hostel untuk setiap kota menginap di Sichuan dan Yunnan, 8 sampai 20 November 2026, dengan harga perkiraan dan bukti menerima paspor asing.', staysPath, staysView());
export default defineConfig({
 base: '/',
 plugins: [{
  name: 'prerender-itinerary',
  configureServer(server) {
   let pendingPdf: ReturnType<typeof generatePdfFromUrl> | undefined;
   server.middlewares.use(async (request, response, next) => {
    const path = (request.url ?? '/').split('?')[0];
    const isPrintPage = /^\/print\/?$/.test(path);
    if (!isPrintPage && path !== `/${pdfPath}`) return next();
    if (request.method !== 'GET' && request.method !== 'HEAD') {
     response.writeHead(405).end();
     return;
    }
    try {
     response.setHeader('Cache-Control', 'no-store');
     if (isPrintPage) {
      // SSR loads the latest source without injecting the development client into print output.
      const current = await server.ssrLoadModule('/src/print-render.ts');
      const stylesheets = ['style', 'currency', 'chengdu-evening'].map(name => `<link rel="stylesheet" href="/src/${name}.css">`).join('');
      const document = current.renderPrintDocument(readFileSync(new URL('./src/print.css', import.meta.url), 'utf8'), stylesheets, new Date().toISOString());
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(request.method === 'HEAD' ? undefined : document);
      return;
     }
     response.setHeader('Content-Type', 'application/pdf');
     response.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);
     if (request.method === 'HEAD') {
      response.end();
      return;
     }
     const address = server.httpServer?.address();
     if (!address || typeof address === 'string') throw new Error('Development print server is not listening');
     const hostname = address.address === '::1' ? '[::1]' : '127.0.0.1';
     pendingPdf ??= generatePdfFromUrl(`http://${hostname}:${address.port}/print/`).finally(() => { pendingPdf = undefined; });
     const { buffer } = await pendingPdf;
     response.end(buffer);
    } catch (error) {
     server.config.logger.error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
     response.statusCode = 500;
     response.removeHeader('Content-Disposition');
     response.setHeader('Content-Type', 'text/plain; charset=utf-8');
     response.end('PDF belum dapat dibuat. Coba lagi.');
    }
   });
  },
  transformIndexHtml(html, context) {
   const path = (context.originalUrl || context.path).split('?')[0];
   if (/^\/places\/?$/.test(path)) return destinationHtml(html);
   if (path === staysPath || `${path}/` === staysPath) return staysHtml(html);
   if (path === routeMapPath || `${path}/` === routeMapPath) return routeMapHtml(html);
   if (path === preparePath || `${path}/` === preparePath) return prepareHtml(html);
   const slug = path.match(/^\/places\/([a-z0-9-]+)\/?$/)?.[1];
   const page = slug ? pageBySlug.get(slug) : undefined;
   return page ? destinationHtml(html, page) : html.replace('<!--app-->', shell());
  },
  generateBundle: {
   order: 'post',
   handler(_options, bundle) {
    const index = bundle['index.html'];
    if (!index || index.type !== 'asset') throw new Error('Missing prerendered homepage');
    // Rocket Loader must not postpone image-loading UI until the images finish.
    const template = String(index.source).replace(/<script type="module"/g, '<script data-cfasync="false" type="module"');
    index.source = template;
    const stylesheetLinks = Array.from(template.matchAll(/<link\b(?=[^>]*\brel="stylesheet")[^>]*>/g), match => match[0]).join('');
    this.emitFile({ type: 'asset', fileName: 'print/index.html', source: renderPrintDocument(printStyles, stylesheetLinks, new Date().toISOString()) });
    this.emitFile({ type: 'asset', fileName: 'places/index.html', source: destinationHtml(template) });
    if (pageBySlug.has('stays')) throw new Error('A place guide cannot use the reserved stays slug');
    this.emitFile({ type: 'asset', fileName: 'places/stays/index.html', source: staysHtml(template) });
    if (pageBySlug.has('map')) throw new Error('A place guide cannot use the reserved map slug');
    this.emitFile({ type: 'asset', fileName: 'places/map/index.html', source: routeMapHtml(template) });
    if (pageBySlug.has('prepare')) throw new Error('A place guide cannot use the reserved prepare slug');
    this.emitFile({ type: 'asset', fileName: 'places/prepare/index.html', source: prepareHtml(template) });
    for (const page of placePages) {
     this.emitFile({ type: 'asset', fileName: `places/${page.slug}/index.html`, source: destinationHtml(template, page) });
    }
   },
  },
 }],
});
