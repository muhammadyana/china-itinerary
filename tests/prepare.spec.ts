import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { days } from '../src/itinerary';
import { bookings, costRows, doneItems, preparePath, stayTotal } from '../src/prepare';
import { stayBases, stayNights } from '../src/stays';

test.beforeEach(async ({ page }) => {
  await page.route('https://api.open-meteo.com/**', route => route.abort());
  await page.route('https://api.frankfurter.dev/**', route => route.abort());
});

test('booking checklist covers trip dates with channels, and the cost total adds up', () => {
  const tripDates = new Set(days.map(day => day.date));
  for (const item of bookings) {
    expect(tripDates.has(item.tripDate), item.item).toBe(true);
    expect(item.channel.trim(), item.item).not.toBe('');
    expect(item.opens.trim(), item.item).not.toBe('');
    if (item.cost) expect(item.cost.min, item.item).toBeLessThanOrEqual(item.cost.max);
    if (item.link && !item.link.url.startsWith('/')) expect(item.link.url, item.item).toMatch(/^https:\/\//);
  }
  expect(stayBases.reduce((nights, base) => nights + stayNights(base).length, 0)).toBe(days.filter(day => day.overnight).length);
  const { rows, total } = costRows();
  expect(rows[2]).toMatchObject(stayTotal());
  expect(total.min).toBe(rows.reduce((sum, row) => sum + row.min, 0));
  expect(total.max).toBe(rows.reduce((sum, row) => sum + row.max, 0));
  expect(total.min).toBeLessThanOrEqual(total.max);
});

test('the preparation page works without JavaScript and is reachable from the places menu', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto(preparePath);
  await expect(plain.getByRole('heading', { level: 1 })).toHaveText('Sebelum berangkat, satu halaman.');
  await expect(plain.locator('.prepare-done li')).toHaveCount(doneItems.length);
  await expect(plain.locator('.prepare-group h3')).toHaveCount(3);
  await expect(plain.locator('.prepare-booking')).toHaveCount(bookings.length);
  await expect(plain.locator('.prepare-costs tfoot')).toContainText('Total jika berangkat sendiri');
  await expect(plain.locator('.prepare-contacts a[href="tel:+8618610455488"]')).toBeVisible();
  await context.close();

  await page.goto('/');
  await page.locator('.place-menu > summary').click();
  await expect(page.locator('.place-menu-panel').getByRole('link', { name: 'Persiapan & pemesanan' })).toHaveAttribute('href', preparePath);
});

for (const width of [320, 390, 1440]) {
  test(`${width}px: the preparation page fits the viewport with usable targets and accessible contrast`, async ({ page }) => {
    await mkdir('artifacts', { recursive: true });
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(preparePath);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    // In-sentence links are exempt from the target-size rule, as in WCAG 2.5.8.
    const tooSmall = await page.locator('main a:not(.prepare-list a, .prepare-section-lead a),main button,main summary').evaluateAll(nodes => nodes.filter(node => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
    }).map(node => node.textContent?.trim()));
    expect(tooSmall).toEqual([]);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    await writeFile(`artifacts/prepare-axe-${width}.json`, JSON.stringify(axe.violations, null, 2));
    expect(axe.violations).toEqual([]);
    await page.screenshot({ path: `artifacts/prepare-${width}.png`, fullPage: width !== 1440 });
  });
}
