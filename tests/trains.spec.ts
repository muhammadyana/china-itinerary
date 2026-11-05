import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { timeline, trainBookings, trainsPath } from '../src/trains';

test.beforeEach(async ({ page }) => {
  await page.route('https://api.open-meteo.com/**', route => route.abort());
  await page.route('https://api.frankfurter.dev/**', route => route.abort());
});

test('every train links to its Trip.com route page', () => {
  expect(trainBookings.map(item => item.tripDate)).toEqual(['2026-11-09', '2026-11-10', '2026-11-18', '2026-11-19', '2026-11-20']);
  for (const item of trainBookings) expect(item.link?.url, item.item).toMatch(/^https:\/\/id\.trip\.com\/trains\/china\/route\/[a-z-]+\/$/);
});

test('the trains page shows tickets, the Jiuzhaigou slots and the 8-10 November timeline without JavaScript', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto(trainsPath);
  await expect(plain.locator('#trains .prepare-booking')).toHaveCount(trainBookings.length);
  await expect(plain.locator('#jiuzhaigou tbody tr')).toHaveCount(2);
  await expect(plain.locator('.day-timeline')).toHaveCount(timeline.length);
  await expect(plain.locator('#back-to-chengdu')).toContainText('Ya. Rute Sichuan sekarang memakai transportasi umum');
  await context.close();

  await page.goto('/');
  await page.locator('.itinerary-menu > summary').click();
  await expect(page.locator('.itinerary-menu-panel').getByRole('link', { name: 'Kereta & timeline, rencana utama' })).toHaveAttribute('href', trainsPath);
});

for (const width of [320, 390, 1440]) {
  test(`${width}px: the trains page fits the viewport with usable targets and accessible contrast`, async ({ page }) => {
    await mkdir('artifacts', { recursive: true });
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(trainsPath);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    // In-sentence links are exempt from the target-size rule, as in WCAG 2.5.8.
    const tooSmall = await page.locator('main a:not(.prepare-section-lead a),main button,main summary').evaluateAll(nodes => nodes.filter(node => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
    }).map(node => node.textContent?.trim()));
    expect(tooSmall).toEqual([]);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    await writeFile(`artifacts/trains-axe-${width}.json`, JSON.stringify(axe.violations, null, 2));
    expect(axe.violations).toEqual([]);
    await page.screenshot({ path: `artifacts/trains-${width}.png`, fullPage: width !== 1440 });
  });
}
