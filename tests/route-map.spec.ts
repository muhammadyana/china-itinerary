import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { days } from '../src/itinerary';
import { mapLegs, mapPoints, overnightPoint } from '../src/route-map';
import { routeMapPath } from '../src/route-map-main';

test.beforeEach(async ({ page }) => {
  await page.route('https://api.open-meteo.com/**', route => route.abort());
  await page.route('https://api.frankfurter.dev/**', route => route.abort());
});

test('map legs connect every overnight base in itinerary order', () => {
  expect(Object.keys(mapLegs)).toEqual(days.map(day => day.date));
  for (const day of days) if (day.overnight) expect(mapPoints[overnightPoint[day.overnight.name]], day.overnight.name).toBeDefined();
  days.forEach((day, index) => {
    const legs = mapLegs[day.date];
    for (const leg of legs) {
      expect(mapPoints[leg.from], `${day.date} ${leg.from}`).toBeDefined();
      expect(mapPoints[leg.to], `${day.date} ${leg.to}`).toBeDefined();
    }
    legs.slice(1).forEach((leg, legIndex) => expect(leg.from, day.date).toBe(legs[legIndex].to));
    const transferModes = new Set(day.events.flatMap(event => event.kind === 'transfer' ? [event.mode] : []));
    for (const leg of legs) expect(transferModes, `${day.date} draws a ${leg.mode} leg the day does not use`).toContain(leg.mode);
    if (!legs.length) return;
    expect(legs[0].from, `${day.date} starts at the previous night`).toBe(overnightPoint[days[index - 1].overnight!.name]);
    expect(legs[legs.length - 1].to, `${day.date} ends at its own night`).toBe(overnightPoint[day.overnight!.name]);
  });
  // The arrival and departure flights are drawn as off-map arrows instead of legs.
  expect(mapLegs[days[0].date]).toEqual([]);
  expect(mapLegs[days[days.length - 1].date]).toEqual([]);
});

test('the map page is a no-JavaScript document with the map, every day and links into the itinerary', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(routeMapPath);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Rute ${days.length} hari, titik demi titik.`);
  await expect(page.locator('.route-map .route-day')).toHaveCount(days.length);
  await expect(page.locator('.route-map .map-province')).not.toHaveCount(0);
  const entries = page.locator('.route-timeline .route-entry');
  await expect(entries).toHaveCount(days.length);
  for (const [index, day] of days.entries()) {
    const entry = entries.nth(index);
    await expect(entry).toHaveAttribute('id', `day-${day.date}`);
    await expect(entry.getByRole('heading', { level: 3 })).toHaveText(day.shortTitle);
    await expect(entry.getByRole('link', { name: `Buka jadwal hari ${index + 1}` })).toHaveAttribute('href', `/#${day.date}`);
    await expect(page.locator(`.route-day[data-day="${day.date}"] a`)).toHaveAttribute('href', `#day-${day.date}`);
  }
  await expect(entries.nth(2)).toContainText('Menginap di Bipenggou');
  await expect(page.locator('.route-legend')).toContainText('Kereta');
  await context.close();
});

test('the places menu and the route overview open the map, and a timeline day spotlights its legs', async ({ page }) => {
  await page.goto('/');
  await page.locator('.itinerary-menu > summary').click();
  await expect(page.locator('.itinerary-menu-panel').getByRole('link', { name: 'Peta rute, rencana utama' })).toHaveAttribute('href', routeMapPath);
  await page.keyboard.press('Escape');
  await page.locator('.site-navigation [data-action="overview"]').click();
  await page.locator('#overview-dialog').getByRole('link', { name: 'Lihat di peta' }).click();
  await expect(page).toHaveURL(new RegExp(`${routeMapPath}$`));
  const third = days[2].date;
  await page.locator(`.route-entry[data-day="${third}"]`).hover();
  await expect(page.locator('.route-map')).toHaveClass(/has-active/);
  await expect(page.locator(`.route-day[data-day="${third}"]`)).toHaveClass(/is-active/);
  await expect(page.locator(`.route-day[data-day="${days[3].date}"]`)).not.toHaveClass(/is-active/);
  await page.mouse.move(2, 2);
  await expect(page.locator('.route-map')).not.toHaveClass(/has-active/);
});

for (const width of [320, 390, 1440]) {
  test(`${width}px: the map page fits the viewport with usable targets and accessible contrast`, async ({ page }) => {
    await mkdir('artifacts', { recursive: true });
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(routeMapPath);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const box = await page.locator('.route-map').boundingBox();
    expect(box!.width).toBeGreaterThan(Math.min(width - 48, 400));
    const tooSmall = await page.locator('main a:not(svg a),main button,main summary').evaluateAll(nodes => nodes.filter(node => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
    }).map(node => node.textContent?.trim()));
    expect(tooSmall).toEqual([]);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    await writeFile(`artifacts/route-map-axe-${width}.json`, JSON.stringify(axe.violations, null, 2));
    expect(axe.violations).toEqual([]);
    await page.screenshot({ path: `artifacts/route-map-${width}.png`, fullPage: width !== 1440 });
  });
}
