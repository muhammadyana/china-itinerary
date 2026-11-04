import { expect, test } from '@playwright/test';
import { days } from '../src/itinerary';
import { pageForPlace, placePath } from '../src/guides';

const excludedStops = new Set([
  'tfu', 'chengdu-east', 'huanglongjiuzhai', 'jiuzhaigou-hotel', 'bipenggou-gate', 'rilong', 'danba',
  'kangding-road', 'riwa', 'zhaguanbeng', 'shangrila-station', 'lijiang-station',
  'cable-car', 'dali-station', 'kunming-station', 'kmg',
]);
const sightseeingStops = [...new Set(days.flatMap(day => day.events.flatMap(event =>
  event.kind === 'stop' && !excludedStops.has(event.place) ? [event.place] : [],
)))];

test.use({ viewport: { width: 390, height: 844 } });
test.beforeEach(async ({ page }) => {
  await page.route('https://api.open-meteo.com/**', route => route.abort());
  await page.route('https://api.frankfurter.dev/**', route => route.abort());
});

test('the daily navigation stays compact when the mobile safe area changes during scrolling', async ({ page, context }) => {
  const session = await context.newCDPSession(page);
  await session.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 0, right: 0, bottom: 0, left: 0 } });
  await page.goto('/#2026-11-08');
  await page.evaluate(() => document.fonts.ready);
  const bar = page.locator('.mobile-daybar');
  const initial = (await bar.boundingBox())!;

  for (const [width, height, bottom, scroll] of [[390, 844, 34, 300], [390, 700, 0, 1800], [320, 844, 34, 2500], [844, 390, 21, 1800]]) {
    await page.setViewportSize({ width, height });
    await session.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 0, right: 0, bottom, left: 0 } });
    await page.evaluate(y => scrollTo(0, y), scroll);
    await expect.poll(async () => (await bar.boundingBox())!.height).toBeCloseTo(initial.height, 1);
    const bounds = (await bar.boundingBox())!;
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(height - bottom - 8);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    for (const button of await bar.locator('button').all()) {
      const control = (await button.boundingBox())!;
      expect(control.width).toBeGreaterThanOrEqual(44);
      expect(control.height).toBeGreaterThanOrEqual(44);
      expect(Math.abs(control.y + control.height / 2 - bounds.y - bounds.height / 2)).toBeLessThan(1);
    }
  }

  await page.setViewportSize({ width: 320, height: 760 });
  await page.locator('#mobile-picker').click();
  await expect(page.locator('#day-picker')).toBeVisible();
  await page.locator('#day-picker [data-date="2026-11-19"]').click();
  await expect(page.locator('#current-date')).toHaveText('19 November');
  await bar.getByRole('button', { name: 'Hari berikutnya', exact: true }).click();
  await expect(page.locator('#current-date')).toHaveText('20 November');
  expect((await bar.boundingBox())!.height).toBeCloseTo(initial.height, 1);
  await bar.getByRole('button', { name: 'Hari sebelumnya', exact: true }).click();
  await expect(page.locator('#current-date')).toHaveText('19 November');
});

test('all three page types expose every sightseeing stop once in regional itinerary order', async ({ page }) => {
  expect(sightseeingStops).toHaveLength(46);
  for (const id of sightseeingStops) expect(pageForPlace.has(id), id).toBe(true);

  for (const path of ['/', '/places/', '/places/impression-lijiang/']) {
    await page.goto(path);
    const navigation = page.getByRole('navigation', { name: 'Navigasi utama', exact: true });
    await expect(navigation.getByRole('link', { name: 'Beranda', exact: true })).toHaveAttribute('href', '/');
    await expect(navigation.getByRole('link', { name: 'Itinerary', exact: true })).toHaveAttribute('href', '/#itinerary');
    await navigation.locator('summary').click();
    await expect(navigation.getByRole('link', { name: 'Lihat semua tempat' })).toHaveAttribute('href', '/places/');
    const links = await navigation.locator('.place-menu-group a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
    expect(links).toHaveLength(46);
    expect(new Set(links).size).toBe(46);
    expect(links).toEqual(sightseeingStops.map(id => placePath(pageForPlace.get(id)!.slug)));
    await expect(navigation.locator('.place-menu-group h2')).toHaveText(['Sichuan', 'Yunnan']);

    for (const region of ['Sichuan', 'Yunnan']) {
      const group = navigation.locator('.place-menu-group').filter({ has: page.getByRole('heading', { name: region, exact: true }) });
      const expected = sightseeingStops.filter(id => pageForPlace.get(id)!.guide.region === region).map(id => placePath(pageForPlace.get(id)!.slug));
      expect(await group.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))).toEqual(expected);
    }
  }
});

test('destination links open Impression Lijiang and Dali directly', async ({ page }) => {
  await page.goto('/');
  await page.locator('.place-menu > summary').click();
  await page.locator('.place-menu').getByRole('link', { name: 'Impression Lijiang', exact: true }).click();
  await expect(page).toHaveURL(/\/places\/impression-lijiang\/$/);
  await expect(page.locator('#place-title')).toHaveText('Impression Lijiang');

  await page.locator('.place-menu > summary').click();
  await page.locator('.place-menu').getByRole('link', { name: 'Kota Tua Dali', exact: true }).click();
  await expect(page).toHaveURL(/\/places\/dali-old-town\/$/);
  await expect(page.locator('#place-title')).toHaveText('Kota Tua Dali');
});

for (const width of [320, 390]) {
  test(`${width}px: places remain inside the viewport with usable targets and scrolling to the last stop`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ['/', '/places/', '/places/impression-lijiang/']) {
      await test.step(path, async () => {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        await page.locator('.place-menu > summary').click();
        const panel = page.locator('.place-menu-panel');
        const bounds = (await panel.boundingBox())!;
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
        expect(bounds.height).toBeLessThanOrEqual(844 * 0.6 + 1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

        const targets = await page.locator('.site-navigation a, .site-navigation summary').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).map(node => {
          const rect = node.getBoundingClientRect();
          return { label: node.textContent, width: rect.width, height: rect.height };
        }));
        for (const target of targets) {
          expect(target.width, target.label ?? '').toBeGreaterThanOrEqual(44);
          expect(target.height, target.label ?? '').toBeGreaterThanOrEqual(44);
        }
        const lastStop = page.locator('.place-menu-group a').last();
        await lastStop.scrollIntoViewIfNeeded();
        await expect(lastStop).toHaveText('Green Lake (Cuihu)');
        await expect(lastStop).toBeInViewport({ ratio: 1 });
        expect(await panel.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
      });
    }
  });
}

test('native keyboard traversal, Escape focus restoration, and outside click work together', async ({ page }) => {
  await page.goto('/');
  const summary = page.locator('.place-menu > summary');
  const menu = page.locator('.place-menu');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveJSProperty('open', true);
  await page.keyboard.press('Tab');
  await expect(menu.getByRole('link', { name: 'Lihat semua tempat' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(menu.getByRole('link', { name: 'Hotel & hostel per malam' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(menu.getByRole('link', { name: 'Peta rute 14 hari' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(menu.getByRole('link', { name: 'Persiapan & pemesanan' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(menu.getByRole('link', { name: 'Kereta & timeline' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(menu.getByRole('link', { name: 'Jalan sore di Chengdu', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveJSProperty('open', false);
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveJSProperty('open', true);
  await page.mouse.click(2, 100);
  await expect(menu).toHaveJSProperty('open', false);
});

test('the native places disclosure and destination links work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/places/`);
    await page.locator('.place-menu > summary').click();
    await expect(page.locator('.place-menu-panel')).toBeVisible();
    await page.locator('.place-menu').getByRole('link', { name: 'Impression Lijiang', exact: true }).click();
    await expect(page).toHaveURL(/\/places\/impression-lijiang\/$/);
    await expect(page.locator('#place-title')).toHaveText('Impression Lijiang');
  } finally {
    await context.close();
  }
});

test('the Itinerary anchor restores its selected day through Back and reload', async ({ page }) => {
  await page.goto('/#2026-11-19');
  const dayDate = page.locator('#day-view .date-line time');
  await expect(dayDate).toHaveAttribute('datetime', '2026-11-19');
  await page.locator('.site-navigation').getByRole('link', { name: 'Itinerary', exact: true }).click();
  await expect(page).toHaveURL(/\/#itinerary$/);
  await expect(dayDate).toHaveAttribute('datetime', '2026-11-19');
  await expect(page.locator('#itinerary')).toBeInViewport();

  await page.locator('#mobile-picker').click();
  await page.locator('#picker-days [data-date="2026-11-20"]').click();
  await expect(page).toHaveURL(/\/#2026-11-20$/);
  await expect(dayDate).toHaveAttribute('datetime', '2026-11-20');

  await page.goBack();
  await expect(page).toHaveURL(/\/#itinerary$/);
  await expect(dayDate).toHaveAttribute('datetime', '2026-11-19');

  await page.reload();
  await expect(page).toHaveURL(/\/#itinerary$/);
  await expect(dayDate).toHaveAttribute('datetime', '2026-11-19');
});
