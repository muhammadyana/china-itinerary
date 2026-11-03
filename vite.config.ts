import { defineConfig } from 'vite';
import { shell } from './src/render.ts';
import { guideView, placesIndex } from './src/guide-render.ts';
import { pageBySlug, placePages, type PlacePage } from './src/guides.ts';
import { escapeHtml } from './src/render.ts';

function destinationHtml(html: string, page?: PlacePage) {
 const title = page ? `${page.name}: rute, biaya & galeri | China 2026` : 'Panduan tempat di Sichuan & Yunnan | China 2026';
 const description = page ? (page.placeId ? `Cara menuju ${page.name}, biaya kawasan, galeri, dan tips perjalanan November 2026.` : page.guide.summary) : 'Panduan setiap tempat wisata dalam itinerary Sichuan dan Yunnan, 8 sampai 21 November 2026.';
 return html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(description)}">`)
  .replace(/<!--page-start-->[\s\S]*?<!--page-end-->/, `<!--page-start--><div id="app">${page ? guideView(page) : placesIndex()}</div><!--page-end-->`);
}
export default defineConfig({
 base: '/',
 plugins: [{
  name: 'prerender-itinerary',
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
    const template = String(index.source);
    this.emitFile({ type: 'asset', fileName: 'places/index.html', source: destinationHtml(template) });
    for (const page of placePages) {
     this.emitFile({ type: 'asset', fileName: `places/${page.slug}/index.html`, source: destinationHtml(template, page) });
    }
   },
  },
 }],
});
