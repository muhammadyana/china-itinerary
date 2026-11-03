import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { shell } from './src/render.ts';
import { guideView, placesIndex } from './src/guide-render.ts';
import { pageBySlug, placePages, type PlacePage } from './src/guides.ts';
import { escapeHtml } from './src/render.ts';
import { renderPrintDocument } from './src/print-render.ts';
import { pdfPath } from './src/itinerary.ts';
import { generatePdfFromUrl } from './ops/generate-pdf.mjs';

const printStyles = readFileSync(new URL('./src/print.css', import.meta.url), 'utf8');

function destinationHtml(html: string, page?: PlacePage) {
 const title = page ? `${page.name}: rute, biaya & galeri | China 2026` : 'Panduan tempat di Sichuan & Yunnan | China 2026';
 const description = page ? (page.placeId ? `Cara menuju ${page.name}, biaya kawasan, galeri, dan tips perjalanan November 2026.` : page.guide.summary) : 'Panduan setiap tempat wisata dalam itinerary Sichuan dan Yunnan, 8 sampai 21 November 2026.';
 const url = `https://china.muhammadyana.me/places/${page ? `${page.slug}/` : ''}`;
 return html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
  .replace(/<meta (property="og:title"|name="twitter:title") content="[^"]*">/g, (_match, attribute) => `<meta ${attribute} content="${escapeHtml(title)}">`)
  .replace(/<meta (name="description"|property="og:description"|name="twitter:description") content="[^"]*">/g, (_match, attribute) => `<meta ${attribute} content="${escapeHtml(description)}">`)
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
  .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
  .replace(/<!--page-start-->[\s\S]*?<!--page-end-->/, `<!--page-start--><div id="app">${page ? guideView(page) : placesIndex()}</div><!--page-end-->`);
}
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
    for (const page of placePages) {
     this.emitFile({ type: 'asset', fileName: `places/${page.slug}/index.html`, source: destinationHtml(template, page) });
    }
   },
  },
 }],
});
