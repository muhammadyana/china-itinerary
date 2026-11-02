import { defineConfig } from 'vite';
import { shell } from './src/render.ts';
export default defineConfig({
 base: './',
 plugins: [{name:'prerender-itinerary',transformIndexHtml(html) { return html.replace('<!--app-->',shell()); }}],
});
