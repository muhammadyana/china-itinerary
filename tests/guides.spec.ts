import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { guides, placePages, pageForPlace, galleryPhotos, guideDates, placePath } from '../src/guides';
import { days, places, photos } from '../src/itinerary';

const nonSightseeingStops = new Set([
  'tfu', 'chengdu-east', 'huanglongjiuzhai', 'jiuzhaigou-hotel', 'rilong', 'danba',
  'kangding-road', 'riwa', 'zhaguanbeng', 'shangrila-station', 'lijiang-station',
  'cable-car', 'dali-station', 'kunming-station', 'kmg',
]);

test('destination coverage preserves every sightseeing stop and research provenance', () => {
  const stops = new Set(days.flatMap(day => day.events.flatMap(event => event.kind === 'stop' ? [event.place] : [])));
  for (const id of stops) {
    if (nonSightseeingStops.has(id)) continue;
    const destination = pageForPlace.get(id);
    expect(destination, `Missing destination page for ${id}`).toBeDefined();
    expect(destination!.guide.placeIds).toContain(id);
    expect(destination!.guide.stopAccess?.[id], `Missing final approach for ${id}`).toBeTruthy();
    expect(guideDates(destination!).some(day => day.events.some(event => event.kind === 'stop' && event.place === id))).toBe(true);
  }
  expect(new Set(placePages.map(page => page.slug)).size).toBe(placePages.length);
  for (const guide of guides) {
    expect(guide.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(guide.sources.length, guide.slug).toBeGreaterThan(0);
    expect(guide.gettingThere.steps.length, guide.slug).toBeGreaterThan(0);
    expect(guide.costs.length, guide.slug).toBeGreaterThan(0);
    expect(guide.tips.length, guide.slug).toBeGreaterThan(0);
    expect(guide.checkedAt, guide.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const cost of guide.costs) {
      if (cost.status === 'published') expect(cost.source, `${guide.slug}: ${cost.label}`).toMatch(/^https:\/\//);
    }
    for (const source of guide.sources) expect(new URL(source.url).protocol).toBe('https:');
  }
  for (const destination of placePages) {
    expect(galleryPhotos(destination).length, `${destination.slug}: empty gallery`).toBeGreaterThan(0);
    for (const item of galleryPhotos(destination)) {
      expect(photos[item.id], `${destination.slug}: ${item.id}`).toBeDefined();
      expect(item.alt.trim()).not.toBe('');
    }
  }
  expect(guideDates(pageForPlace.get('dali-old-town')!).map(day => day.date)).toEqual(['2026-11-20']);
  expect(guideDates(pageForPlace.get('dayan')!).map(day => day.date)).toEqual(['2026-11-18']);
  expect(pageForPlace.get('songzanlin')!.guide.region).toBe('Yunnan');
  expect(pageForPlace.get('five-flower')!.guide.region).toBe('Sichuan');
});

test('every destination is a distinct server-rendered document with root-relative assets', async ({ request }) => {
  for (const destination of placePages) {
    const response = await request.get(placePath(destination.slug));
    expect(response.status(), destination.slug).toBe(200);
    const html = await response.text();
    expect(html, destination.slug).toContain(`data-guide="${destination.slug}"`);
    expect(html, destination.slug).toContain('id="place-title"');
    expect(html, destination.slug).toContain('id="getting-there"');
    expect(html, destination.slug).toContain('id="costs"');
    expect(html, destination.slug).toContain('id="gallery"');
    expect(html, destination.slug).toContain('id="tips"');
    expect(html, destination.slug).not.toContain('id="day-view"');
    for (const match of html.matchAll(/<(?:img|script)\b[^>]*\bsrc="([^"]+)"/g)) {
      expect(match[1], destination.slug).toMatch(/^\/(?:photos|assets)\//);
    }
  }
  const index = await request.get('/places/');
  expect(index.status()).toBe(200);
  const indexHtml = await index.text();
  for (const guide of guides) expect(indexHtml).toContain(`href="${placePath(guide.slug)}"`);
});

test('a nested destination works without JavaScript, reloads directly, and links to its itinerary', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4173/places/guishan/');
    await expect(page.locator('#place-title')).toHaveText(places.guishan.name);
    await expect(page.locator('.guide-last-leg')).toContainText('龟山公园');
    await expect(page.locator('#costs')).toContainText('Tarif kawasan');
    await expect(page.locator('.guide-date-link')).toHaveAttribute('href', '/#2026-11-17');
    await page.reload();
    await expect(page.locator('#place-title')).toHaveText(places.guishan.name);
    await page.goto('http://127.0.0.1:4173/places/');
    await page.locator('a[href="/places/dali/"]').first().click();
    await expect(page.locator('#place-title')).toHaveText('Kota Tua Dali & Menara Wuhua');
    await expect(page.locator('#getting-there')).toContainText('Caicun');
    await expect(page.locator('#costs')).toContainText('Gratis');
    const image = page.locator('.guide-hero img');
    expect(await image.evaluate(async node => { await (node as HTMLImageElement).decode(); return (node as HTMLImageElement).naturalWidth; })).toBeGreaterThan(0);
  } finally {
    await context.close();
  }
});

test('destination gallery supports keyboard paging, close, source attribution, and focus return', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/places/jiuzhaigou/');
  const opener = page.locator('[data-gallery-index="0"]');
  const count = await page.locator('[data-gallery-index]').count();
  expect(count).toBeGreaterThan(1);
  await opener.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('#guide-photo-dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#guide-photo-count')).toHaveText(`1 / ${count}`);
  await expect(dialog.getByRole('button', { name: 'Tutup foto' })).toBeFocused();
  const firstImage = await dialog.locator('img').getAttribute('src');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#guide-photo-count')).toHaveText(`2 / ${count}`);
  await expect(dialog.locator('img')).not.toHaveAttribute('src', firstImage!);
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#guide-photo-count')).toHaveText(`1 / ${count}`);
  await expect(dialog.locator('.guide-photo-credit')).toContainText('Foto:');
  expect(await dialog.locator('img').evaluate(async node => { await (node as HTMLImageElement).decode(); return (node as HTMLImageElement).naturalWidth; })).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass(/dialog-open/);
  expect(errors).toEqual([]);
});

for (const width of [360, 390, 1440]) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`${width}px ${colorScheme}: destination layout, usable controls, and accessible contrast`, async ({ page }) => {
      await mkdir('artifacts', { recursive: true });
      await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto('/places/jiuzhaigou/');
      await page.evaluate(() => document.fonts.ready);
      await page.locator('.guide-hero img').evaluate(node => (node as HTMLImageElement).decode());
      await expect(page.locator('#place-title')).toContainText('Jiuzhaigou');
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      await page.locator('.guide-references summary').click();
      await page.locator('.guide-source-section summary').click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      const tooSmall = await page.locator('button,a,summary').evaluateAll(nodes => nodes.filter(node => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && !node.closest('dialog:not([open])') && (rect.width < 44 || rect.height < 44);
      }).map(node => ({ text: node.textContent?.trim(), rect: node.getBoundingClientRect().toJSON() })));
      expect(tooSmall).toEqual([]);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      await writeFile(`artifacts/guide-axe-${width}-${colorScheme}.json`, JSON.stringify(axe.violations, null, 2));
      expect(axe.violations).toEqual([]);
      await page.locator('#place-title').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `artifacts/guide-${width}-${colorScheme}.png` });
    });
  }
}

test('reduced transparency removes backdrop effects from destination navigation', async ({ page, context }) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
  await page.goto('/places/dali/');
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches)).toBe(true);
  const effects = await page.locator('.guide-section-nav').evaluate(node => {
    const style = getComputedStyle(node);
    return { filter: style.backdropFilter, background: style.backgroundColor };
  });
  expect(effects.filter).toBe('none');
  expect(effects.background).toMatch(/^rgb\(/);
  await expect(page.locator('.guide-section-nav a')).toHaveCount(4);
});
