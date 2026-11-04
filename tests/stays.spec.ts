import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { days, photos } from '../src/itinerary';
import { guideDates, pageBySlug, placePages, placePath } from '../src/guides';
import { stayBaseForDate, stayBases, stayBudget, stayNights, staysPath } from '../src/stays';

test.beforeEach(async ({ page }) => {
  await page.route('https://api.open-meteo.com/**', route => route.abort());
  await page.route('https://api.frankfurter.dev/**', route => route.abort());
});

test('every overnight night maps to one researched base with a hotel and a hostel that accept foreign passports', () => {
  const nights = days.filter(day => day.overnight);
  expect(stayBases.flatMap(base => stayNights(base).map(day => day.date)).sort()).toEqual(nights.map(day => day.date));
  for (const base of stayBases) {
    expect(base.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(photos[base.areaPhoto.id], `${base.id} area photo`).toBeDefined();
    // Dali has no hotel under the cap near the old-town gates, so its hotel slot is a private-room guesthouse.
    expect(['Hotel', 'Guesthouse']).toContain(base.hotel.kind);
    expect(['Hostel', 'Guesthouse']).toContain(base.hostel.kind);
    for (const stay of [base.hotel, base.hostel]) {
      expect(stay.price, stay.name).toMatch(/CNY \d/);
      const amounts = [...stay.price.matchAll(/\d+/g)].map(match => Number(match[0]));
      if (!stay.overBudget) expect(Math.max(...amounts), `${stay.name} exceeds the nightly budget`).toBeLessThanOrEqual(stayBudget.cny);
      expect(stay.foreignGuests, stay.name).toBeTruthy();
      expect(stay.links.length, stay.name).toBeGreaterThan(0);
      expect(stay.sources.length, stay.name).toBeGreaterThan(0);
      for (const link of [...stay.links, ...stay.sources]) expect(link.url, stay.name).toMatch(/^https:\/\//);
      if (stay.photo) expect(photos[stay.photo.id], `${stay.name} photo`).toBeDefined();
    }
  }
  expect(stayBaseForDate('2026-11-21')).toBe(stayBaseForDate('2026-11-20'));
});

test('the stays page is a no-JavaScript document with every base, both options, prices, links, and honest photo labels', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    const response = await page.goto(`${baseURL}${staysPath}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Tempat tidur, malam demi malam.');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://china.muhammadyana.me${staysPath}`);
    await expect(page.locator('.stays-index a')).toHaveCount(stayBases.length);
    for (const base of stayBases) {
      const section = page.locator(`section.stay-base#${base.id}`);
      await expect(section.locator('h2')).toHaveText(base.name);
      await expect(section.locator('.stay-area figcaption')).toHaveText(base.areaPhoto.label);
      for (const day of stayNights(base)) await expect(section.locator(`a[href="/#${day.date}"]`)).toBeAttached();
      const cards = section.locator('.stay-card');
      await expect(cards).toHaveCount(2);
      for (const [index, stay] of [base.hotel, base.hostel].entries()) {
        const card = cards.nth(index);
        await expect(card.locator('h3')).toHaveText(stay.name);
        await expect(card.locator('.stay-meta .state')).toHaveText(stay.kind);
        await expect(card.locator('.stay-meta .currency-estimate').first()).toBeAttached();
        await expect(card.locator('.stay-facts')).toContainText(stay.foreignGuests);
        await expect(card.locator('.stay-links a[target="_blank"]').first()).toBeVisible();
        if (stay.photo) {
          await expect(card.locator('.stay-photo img')).toHaveAttribute('alt', stay.photo.alt);
          await expect(card.locator('.stay-photo figcaption a[href]')).toHaveCount(2);
        } else {
          await expect(card.locator('.stay-photo')).toHaveCount(0);
          await expect(card.locator('.stay-links a').first()).toContainText('Lihat foto');
        }
      }
    }
  } finally {
    await context.close();
  }
});

test('each place page recommends the stays for its own night and links into the stays page', async ({ page }) => {
  for (const slug of ['chengdu', 'jiuzhaigou', 'impression-lijiang', 'yading', 'green-lake']) {
    const placePage = pageBySlug.get(slug)!;
    const date = guideDates(placePage)[0].date;
    const base = stayBaseForDate(date)!;
    await page.goto(placePath(slug));
    const section = page.locator('.guide-stays');
    await expect(section.locator('h2')).toHaveText(`Menginap di ${base.name}.`);
    await expect(section.locator('.stay-card h3')).toHaveText([base.hotel.name, base.hostel.name]);
    await expect(section.locator(`a[href="${staysPath}#${base.id}"]`)).toBeVisible();
  }
  expect(placePages.every(placePage => stayBaseForDate((guideDates(placePage)[0] ?? days[0]).date))).toBe(true);
  await page.goto(`${staysPath}#${stayBaseForDate('2026-11-19')!.id}`);
  await expect(page.locator(`#${stayBaseForDate('2026-11-19')!.id} h2`)).toBeInViewport();
});

test('the day panel and navigation reach the stays, including the 320px places panel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#2026-11-15');
  const link = page.locator('.day-essentials .sleep-stays-link');
  await expect(link).toHaveAttribute('href', `${staysPath}#${stayBaseForDate('2026-11-15')!.id}`);
  await page.goto('/#2026-11-21');
  await expect(page.locator('.day-essentials .sleep-stays-link')).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 760 });
  await page.locator('.itinerary-menu > summary').click();
  await page.locator('.itinerary-menu-panel').getByRole('link', { name: 'Hotel & hostel per malam' }).click();
  await expect(page).toHaveURL(new RegExp(`${staysPath}$`));
});

for (const width of [320, 390, 1440]) {
  test(`${width}px: the stays page fits the viewport with usable targets and accessible contrast`, async ({ page }) => {
    await mkdir('artifacts', { recursive: true });
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(staysPath);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const tooSmall = await page.locator('main button,main a,main summary').evaluateAll(nodes => nodes.filter(node => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
    }).map(node => node.textContent?.trim()));
    expect(tooSmall).toEqual([]);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    await writeFile(`artifacts/stays-axe-${width}.json`, JSON.stringify(axe.violations, null, 2));
    expect(axe.violations).toEqual([]);
    await page.screenshot({ path: `artifacts/stays-${width}.png`, fullPage: width !== 1440 });
  });
}
