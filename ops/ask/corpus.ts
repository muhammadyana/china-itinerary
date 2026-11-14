import { readdir, readFile, realpath } from 'node:fs/promises';
import { join } from 'node:path';

export interface Corpus {
  text: string;
  pages: number;
  revision: string;
  /** The <page url="..."> values in text, for example "/" and "/places/chengdu/". */
  urls: ReadonlySet<string>;
}

// Extractor for this site's own generated HTML (vite.config.ts prerender + print page), not for arbitrary HTML.
// Nested elements of the same dropped tag do not occur in that output, so non-greedy block matches are enough.
// Buttons are UI controls (share, close, gallery, day picker); their labels repeat content shown elsewhere.
const DROPPED_BLOCKS = ['head', 'script', 'style', 'template', 'noscript', 'svg', 'dialog', 'nav', 'footer', 'button'];
// Class-name patterns of pure noise: photo credits and notes, the live weather widget, exchange-rate load status.
const NOISE_CLASSES = ['print-photo-credits', 'print-photo-note', 'print-credit', 'print-stop-photo', 'stay-area', 'credits', 'credit-note',
  'weather-[a-z-]+', 'exchange-status'];
const BLOCK_TAGS = 'address|article|aside|blockquote|br|dd|details|div|dl|dt|figcaption|figure|h[1-6]|header|hr|li|main|ol|p|section|summary|table|tr|ul';
const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
// Lines this long carry content; shorter ones are mostly headings and labels (dt, h3, "Pilihan").
const MIN_DEDUPED_LINE = 61;
const SKIPPED_PREFIX = 'places/ask/';
// The owner travels the calm option; the old main plan's pages stay out so the assistant never answers from them.
const MAIN_PLAN_FILES = new Set(['print/index.html', 'places/main-itinerary/index.html', 'places/map/index.html',
  'places/stays/index.html', 'places/prepare/index.html', 'places/costs/index.html', 'places/trains/index.html']);
// The homepage carries the calm option's 14 days, so it comes first and whole.
const HOME_FILE = 'index.html';

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
    if (name[0] !== '#') return ENTITIES[name.toLowerCase()] ?? entity;
    const code = name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : Number(name.slice(1));
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  });
}

function inlineText(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

// Percent-encoded Chinese in Amap links costs nine characters per glyph; browsers re-encode it on click.
function readableUrl(href: string): string {
  try {
    const decoded = decodeURI(href);
    return /[\s()<>"]/.test(decoded) ? href : decoded; // keep "label (href)" and markdown links parseable
  } catch {
    return href;
  }
}

function linkText(attributes: string, inner: string): string {
  const label = inlineText(inner);
  const href = readableUrl(decodeEntities(attributes.match(/\bhref="([^"]*)"/)?.[1] ?? ''));
  const keep = /^https?:\/\//i.test(href) || (href.startsWith('/') && !href.startsWith('//'));
  if (!label) return ' ';
  return keep ? ` ${label} (${href}) ` : ` ${label} `;
}

export function extractPage(html: string): { title: string; text: string } {
  const title = inlineText(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  // Site header, footer and search dialog sit outside <main>; day and guide headers inside it carry plan facts.
  let body = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  body = body.replace(/<!--[\s\S]*?-->/g, '');
  for (const tag of DROPPED_BLOCKS) body = body.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, 'gi'), '\n');
  for (const name of NOISE_CLASSES) {
    body = body.replace(new RegExp(`<([a-z]+)\\b[^>]*\\bclass="(?:[^"]*\\s)?${name}(?:\\s[^"]*)?"[^>]*>[\\s\\S]*?</\\1>`, 'gi'), '\n');
  }
  body = body
    .replace(/<span class="visually-hidden"> \(buka tab baru\)<\/span>/g, '')
    .replace(/ \(buka tab baru\)/g, '')
    .replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_, attributes: string, inner: string) => linkText(attributes, inner))
    .replace(new RegExp(`</?(?:${BLOCK_TAGS})\\b[^>]*>`, 'gi'), '\n')
    .replace(/<[^>]*>/g, ' ');
  const text = decodeEntities(body)
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
  return { title, text };
}

function pageUrl(file: string): string {
  const directory = file.slice(0, -'index.html'.length);
  return `/${directory}`;
}

function pageOrder(file: string): string {
  if (file === HOME_FILE) return '0';
  if (file.startsWith('places/calm') || file.startsWith('places/expenses/')) return `1${file}`;
  return `2${file}`;
}

// A block is a run of short lines (a heading or label) with the long lines under it.
function blocks(lines: string[]): string[][] {
  const result: string[][] = [];
  for (const line of lines) {
    const last = result.at(-1);
    if (last && (line.length >= MIN_DEDUPED_LINE || last.at(-1)!.length < MIN_DEDUPED_LINE)) last.push(line);
    else result.push([line]);
  }
  return result;
}

async function readRevision(siteRoot: string): Promise<string> {
  try {
    const release = JSON.parse(await readFile(join(siteRoot, 'release.json'), 'utf8')) as { revision?: unknown };
    return typeof release.revision === 'string' ? release.revision : 'unknown';
  } catch {
    return 'unknown';
  }
}

export async function buildCorpus(siteRoot: string): Promise<Corpus> {
  const entries = await readdir(siteRoot, { recursive: true });
  const files = entries
    .map(entry => entry.split('\\').join('/'))
    .filter(file => (file === 'index.html' || file.endsWith('/index.html')) && !file.startsWith(SKIPPED_PREFIX) && !MAIN_PLAN_FILES.has(file))
    .sort((a, b) => pageOrder(a) < pageOrder(b) ? -1 : 1);
  const seen = new Set<string>();
  const pages: string[] = [];
  const urls = new Set<string>();
  for (const file of files) {
    const { title, text } = extractPage(await readFile(join(siteRoot, file), 'utf8'));
    const all = text.split('\n');
    // The homepage comes first, whole: its 14 days repeat items on purpose. A later page drops a block only when
    // every line of it, heading included, already appeared, so no heading or label is left without its content.
    const lines = file === HOME_FILE
      ? all
      : blocks(all).filter(block => !(block.some(line => line.length >= MIN_DEDUPED_LINE) && block.every(line => seen.has(line)))).flat();
    for (const line of all) seen.add(line);
    if (!lines.length) continue;
    urls.add(pageUrl(file));
    pages.push(`<page url="${pageUrl(file)}" title="${title.replace(/"/g, "'")}">\n${lines.join('\n')}\n</page>`);
  }
  // An empty tree (a build in progress locally) must not be cached as the knowledge base.
  if (!pages.length) throw new Error('no index.html pages found');
  const revision = await readRevision(siteRoot);
  const text = `<site url="https://china.muhammadyana.me" revision="${revision}">\n${pages.join('\n')}\n</site>`;
  return { text, pages: pages.length, revision, urls };
}

let cached: { key: string; corpus: Promise<Corpus> } | undefined;

// Deploys switch the `current` symlink, so its resolved path identifies the release; rebuild only when it changes.
export async function getCorpus(siteRoot: string): Promise<Corpus> {
  const key = await realpath(siteRoot);
  if (cached?.key !== key) {
    const corpus = buildCorpus(key);
    cached = { key, corpus };
    corpus.then(
      built => console.log(`ask: corpus built release=${key} revision=${built.revision} pages=${built.pages} chars=${built.text.length}`),
      error => {
        if (cached?.corpus === corpus) cached = undefined;
        console.error(`ask: corpus build failed for ${key}: ${error instanceof Error ? error.message : String(error)}`);
      },
    );
  }
  return cached.corpus;
}
