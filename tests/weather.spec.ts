import { expect, test, type Locator, type Page, type Route } from '@playwright/test';
import { days } from '../src/itinerary';

const weatherApi = /^https:\/\/api\.open-meteo\.com\/v1\/forecast(?:\?|$)/;
const chengduCoordinates = [30.66667, 104.06667];
const jiuzhaigouCoordinates = [33.29597, 103.86495];
const ganhaiziCoordinates = [27.1006879, 100.2564517];

test.use({ viewport: { width: 390, height: 844 } });
test.beforeEach(async ({ page }) => {
  await page.route('https://api.frankfurter.dev/**', route => route.abort());
});

function signal() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}

function coordinates(url: string) {
  const query = new URL(url).searchParams;
  return [Number(query.get('latitude')), Number(query.get('longitude'))];
}

async function fulfillWeather(route: Route, temperature: number | null, feelsLike = 10, timestamp = Math.floor(Date.now() / 1000)) {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify({
      timezone: 'Asia/Shanghai', utc_offset_seconds: 28800,
      current_units: { time: 'unixtime', temperature_2m: '°C', apparent_temperature: '°C' },
      current: { time: timestamp, temperature_2m: temperature, apparent_temperature: feelsLike },
    }),
  });
}

async function chooseDay(page: Page, date: string) {
  await page.getByRole('button', { name: 'Pilih hari', exact: true }).click();
  await page.locator(`#picker-days [data-date="${date}"]`).click();
  await expect(page.locator('#day-view .day-header time')).toHaveAttribute('datetime', date);
}

async function expectReading(panel: Locator, location: string, temperature: string, feelsLike: string) {
  await expect(panel).toHaveAttribute('data-weather-location', location);
  await expect(panel).toHaveAttribute('data-weather-state', 'ready');
  await expect(panel.locator('[data-weather-temperature]')).toHaveText(`${temperature}°C`);
  await expect(panel.locator('[data-weather-feels-like]')).toHaveText(`${feelsLike}°C`);
  await expect(panel.locator('[data-weather-placeholder]')).toBeHidden();
  await expect(panel.locator('[data-weather-label]')).toBeHidden();
  await expect(panel.locator('[data-weather-stale]')).toBeHidden();
}

async function openWeather(panel: Locator) {
  const details = panel.locator('[data-weather-details]');
  if (!await details.isVisible()) await panel.locator('[data-weather-open]').click();
  await expect(details).toBeVisible();
  return details;
}

async function expectCompactOverlay(panel: Locator, photo: Locator) {
  const trigger = panel.locator('[data-weather-open]');
  await trigger.scrollIntoViewIfNeeded();
  const [badgeBox, photoBox] = await Promise.all([trigger.boundingBox(), photo.boundingBox()]);
  expect(badgeBox!.width).toBeGreaterThanOrEqual(44);
  expect(badgeBox!.height).toBeGreaterThanOrEqual(44);
  expect(badgeBox!.x).toBeGreaterThanOrEqual(photoBox!.x);
  expect(badgeBox!.y).toBeGreaterThanOrEqual(photoBox!.y);
  expect(badgeBox!.x + badgeBox!.width).toBeLessThanOrEqual(photoBox!.x + photoBox!.width);
  expect(badgeBox!.y + badgeBox!.height).toBeLessThanOrEqual(photoBox!.y + photoBox!.height);
  expect(badgeBox!.width * badgeBox!.height).toBeLessThan(photoBox!.width * photoBox!.height / 4);
  await expect(panel.locator('[data-weather-details]')).toBeHidden();
  await expect(panel.locator('[data-weather-time]')).toBeHidden();
  await expect(panel.locator('.weather-source')).toBeHidden();
}

test('selected-day weather uses its own coordinates and a late prior response cannot replace the current location', async ({ page }) => {
  const firstRequested = signal();
  const releaseFirst = signal();
  await page.route(weatherApi, async route => {
    const url = new URL(route.request().url());
    expect(url.searchParams.get('current')).toBe('temperature_2m,apparent_temperature');
    expect(url.searchParams.get('timeformat')).toBe('unixtime');
    expect(url.searchParams.get('timezone')).toBe('Asia/Shanghai');
    expect(url.searchParams.get('temperature_unit')).toBe('celsius');
    expect(url.searchParams.has('start_date')).toBe(false);
    const location = coordinates(url.href);
    if (location[0] === chengduCoordinates[0]) {
      expect(location).toEqual(chengduCoordinates);
      firstRequested.resolve();
      await releaseFirst.promise;
      await fulfillWeather(route, 31, 33);
    } else {
      expect(location).toEqual(jiuzhaigouCoordinates);
      await fulfillWeather(route, 7, 4);
    }
  });

  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await firstRequested.promise;
    const panel = page.locator('#day-view [data-weather-location]').first();
    await expect(panel).toHaveAttribute('data-weather-state', 'loading');
    await expect(panel.locator('[data-weather-placeholder]')).toBeVisible();
    await expect(panel.locator('[data-weather-reading]')).toBeHidden();
    await expect(panel.locator('[data-weather-refresh]')).toBeDisabled();
    await expect(panel.locator('[data-weather-status]')).toHaveText('Memuat estimasi cuaca…');
    await expect(panel.locator('[data-weather-details]')).toBeHidden();

    await chooseDay(page, '2026-11-09');
    await expectReading(panel, 'jiuzhaigou', '7', '4');
    const lateResponse = page.waitForResponse(response => weatherApi.test(response.url()) && coordinates(response.url())[0] === chengduCoordinates[0]);
    releaseFirst.resolve();
    await (await lateResponse).finished();
    await expectReading(panel, 'jiuzhaigou', '7', '4');
    await expect(panel).toContainText('bukan prakiraan tanggal perjalanan');
    await expect(page.locator('#day-view .sleep-summary')).toContainText('Menginap di Jiuzhaigou');
    expect(days).toHaveLength(14);
    expect(days.filter(day => day.overnight)).toHaveLength(13);
  } finally {
    releaseFirst.resolve();
    await page.unrouteAll({ behavior: 'wait' });
  }
});

test('revisiting a day shares its pending request and cached reading while manual refresh obtains new data', async ({ page }) => {
  const firstRequested = signal();
  const releaseFirst = signal();
  const refreshRequested = signal();
  const releaseRefresh = signal();
  let chengduRequests = 0;
  let jiuzhaigouRequests = 0;
  await page.route(weatherApi, async route => {
    if (coordinates(route.request().url())[0] === chengduCoordinates[0]) {
      chengduRequests++;
      if (chengduRequests === 1) {
        firstRequested.resolve();
        await releaseFirst.promise;
        await fulfillWeather(route, 22, 24);
      } else {
        refreshRequested.resolve();
        await releaseRefresh.promise;
        await fulfillWeather(route, 25, 27);
      }
    } else {
      expect(coordinates(route.request().url())).toEqual(jiuzhaigouCoordinates);
      jiuzhaigouRequests++;
      await fulfillWeather(route, 7, 4);
    }
  });

  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await firstRequested.promise;
    const panel = page.locator('#day-view [data-weather-location]').first();
    await chooseDay(page, '2026-11-09');
    await expectReading(panel, 'jiuzhaigou', '7', '4');
    const nearbyBadges = page.locator('#day-view [data-weather-location="jiuzhaigou"]');
    expect(await nearbyBadges.count()).toBeGreaterThan(1);
    for (const badge of await nearbyBadges.all()) await expectReading(badge, 'jiuzhaigou', '7', '4');
    await chooseDay(page, '2026-11-08');
    await expect(panel).toHaveAttribute('data-weather-state', 'loading');
    releaseFirst.resolve();
    await expectReading(panel, 'chengdu', '22', '24');
    expect(chengduRequests).toBe(1);

    await chooseDay(page, '2026-11-09');
    await expectReading(panel, 'jiuzhaigou', '7', '4');
    await chooseDay(page, '2026-11-08');
    await expectReading(panel, 'chengdu', '22', '24');
    expect(chengduRequests).toBe(1);
    expect(jiuzhaigouRequests).toBe(1);

    await openWeather(panel);
    await panel.getByRole('button', { name: 'Perbarui', exact: true }).click();
    await refreshRequested.promise;
    await expect(panel).toHaveAttribute('data-weather-state', 'loading');
    await expect(panel.locator('[data-weather-refresh]')).toBeDisabled();
    releaseRefresh.resolve();
    await expectReading(panel, 'chengdu', '25', '27');
    expect(chengduRequests).toBe(2);
  } finally {
    releaseFirst.resolve();
    releaseRefresh.resolve();
    await page.unrouteAll({ behavior: 'wait' });
  }
});

test('a guide rejects null temperatures, recovers after provider failure, and does not present future data as current', async ({ page }) => {
  let requests = 0;
  await page.route(weatherApi, async route => {
    expect(coordinates(route.request().url())).toEqual(jiuzhaigouCoordinates);
    requests++;
    if (requests === 1) await fulfillWeather(route, null);
    else if (requests === 2) await route.fulfill({ status: 503, headers: { 'access-control-allow-origin': '*' }, body: 'Unavailable' });
    else if (requests === 3) await fulfillWeather(route, 9, 6);
    else await fulfillWeather(route, 12, 10, Math.floor(Date.now() / 1000) + 10 * 60);
  });

  await page.goto('/places/jiuzhaigou/');
  const panel = page.locator('.guide-hero [data-weather-location]').first();
  await expect(panel).toHaveAttribute('data-weather-state', 'error');
  await expect(panel.locator('[data-weather-status]')).toHaveText('Data cuaca dari penyedia belum lengkap. Coba lagi.');
  await expect(panel.locator('[data-weather-temperature]')).toBeEmpty();
  await expect(panel.locator('[data-weather-reading]')).toBeHidden();
  await expect(panel.locator('[data-weather-placeholder]')).toBeHidden();
  await expect(panel.locator('[data-weather-label]')).toHaveText('Suhu belum tersedia');
  await expect(panel.locator('[data-weather-label]')).toBeVisible();
  await expect(panel.locator('[data-weather-details]')).toBeHidden();

  await openWeather(panel);
  await panel.getByRole('button', { name: 'Coba lagi', exact: true }).click();
  await expect(panel.locator('[data-weather-status]')).toHaveText('Cuaca belum bisa dimuat. Coba lagi.');
  await expect(panel.locator('[data-weather-refresh]')).toBeEnabled();
  await panel.getByRole('button', { name: 'Coba lagi', exact: true }).click();
  await expectReading(panel, 'jiuzhaigou', '9', '6');
  expect(requests).toBe(3);
  await expect(panel.locator('a[href="https://open-meteo.com/en/docs"]')).toHaveText('Open-Meteo');
  await expect(panel).toContainText('Estimasi model cuaca, bukan pengukuran langsung di lokasi.');

  await panel.getByRole('button', { name: 'Perbarui', exact: true }).click();
  await expect(panel).toHaveAttribute('data-weather-state', 'error');
  await expect(panel.locator('[data-weather-status]')).toHaveText('Waktu data cuaca belum valid. Coba lagi.');
  await expect(panel.locator('[data-weather-reading]')).toBeHidden();
  await expect(panel.locator('[data-weather-time]')).not.toHaveAttribute('datetime');
});

test('outdated model data is labeled with its actual China-time timestamp and the no-JavaScript guide explains its limitation', async ({ page, browser, baseURL }) => {
  const staleTimestamp = Math.floor(Date.now() / 1000) - 2 * 60 * 60;
  await page.route(weatherApi, route => fulfillWeather(route, -3, -7, staleTimestamp));
  await page.goto('/places/jiuzhaigou/');
  const panel = page.locator('.guide-hero [data-weather-location]').first();
  await expect(panel).toHaveAttribute('data-weather-state', 'stale');
  await expect(panel.locator('[data-weather-temperature]')).toHaveText('-3°C');
  await expect(panel.locator('[data-weather-feels-like]')).toHaveText('-7°C');
  await expect(panel.locator('[data-weather-stale]')).toHaveText('Data lama');
  await expect(panel.locator('[data-weather-stale]')).toBeVisible();
  await expect(panel.locator('[data-weather-time]')).toBeHidden();
  await openWeather(panel);
  await expect(panel.locator('[data-weather-status]')).toHaveText('Data cuaca belum terbaru. Perbarui sebelum mengandalkannya.');
  await expect(panel.locator('[data-weather-time]')).toHaveAttribute('datetime', new Date(staleTimestamp * 1000).toISOString());
  await expect(panel.locator('[data-weather-time]')).toContainText('UTC+8');
  await expect(panel.locator('[data-weather-refresh]')).toBeEnabled();
  await expect(panel).toContainText('Estimasi cuaca saat ini, bukan prakiraan tanggal perjalanan.');

  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  let unexpectedRequests = 0;
  await context.route(weatherApi, async route => { unexpectedRequests++; await route.abort(); });
  try {
    const noScriptPage = await context.newPage();
    await noScriptPage.goto(new URL('/places/jiuzhaigou/', baseURL).href);
    const noScriptPanel = noScriptPage.locator('.guide-hero [data-weather-location]').first();
    await expect(noScriptPanel).toHaveAttribute('data-weather-state', 'idle');
    await expect(noScriptPanel.locator('[data-weather-label]')).toHaveText('Suhu belum dimuat');
    await expect(noScriptPanel.locator('[data-weather-details]')).toBeHidden();
    await openWeather(noScriptPanel);
    await expect(noScriptPanel.locator('.weather-no-script')).toHaveText('Aktifkan JavaScript untuk memuat estimasi cuaca saat ini.');
    await expect(noScriptPanel.locator('.weather-no-script')).toBeVisible();
    await expect(noScriptPanel.locator('[data-weather-reading]')).toBeHidden();
    await expect(noScriptPanel.locator('[data-weather-placeholder]')).toBeHidden();
    await expect(noScriptPage.locator('.guide-date-link')).toHaveAttribute('href', '/#2026-11-09');
    expect(unexpectedRequests).toBe(0);
  } finally {
    await context.close();
  }
});

test('a fresh reading becomes visibly outdated as time passes without polling the weather provider', async ({ page }) => {
  const timestamp = Math.floor(Date.now() / 1000);
  await page.clock.install({ time: new Date(timestamp * 1000) });
  let requests = 0;
  await page.route(weatherApi, async route => {
    requests++;
    await fulfillWeather(route, 12, 10, timestamp);
  });
  await page.goto('/places/jiuzhaigou/');
  const panel = page.locator('.guide-hero [data-weather-location]').first();
  await expectReading(panel, 'jiuzhaigou', '12', '10');
  await expect(panel.locator('[data-weather-time]')).toHaveAttribute('datetime', new Date(timestamp * 1000).toISOString());
  expect(requests).toBe(1);

  await page.clock.fastForward(46 * 60 * 1000);
  await expect(panel).toHaveAttribute('data-weather-state', 'stale');
  await expect(panel.locator('[data-weather-status]')).toHaveText('Data cuaca belum terbaru. Perbarui sebelum mengandalkannya.');
  await expect(panel.locator('[data-weather-temperature]')).toHaveText('12°C');
  await expect(panel.locator('[data-weather-stale]')).toBeVisible();
  await expect(panel.locator('[data-weather-details]')).toBeHidden();
  await expect(panel.locator('[data-weather-time]')).toHaveAttribute('datetime', new Date(timestamp * 1000).toISOString());
  await expect(panel.locator('[data-weather-refresh]')).toBeEnabled();
  expect(requests).toBe(1);
});

for (const width of [320, 390]) {
  test(`${width}px: compact photo weather opens metadata on demand and uses each stop's area instead of the overnight city`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const requestedLocations: number[][] = [];
    await page.route(weatherApi, async route => {
      const location = coordinates(route.request().url());
      requestedLocations.push(location);
      if (location[0] === ganhaiziCoordinates[0]) {
        expect(location).toEqual(ganhaiziCoordinates);
        await fulfillWeather(route, 1, -3);
      } else {
        expect(location).toEqual(jiuzhaigouCoordinates);
        await fulfillWeather(route, 9, 6);
      }
    });

    await page.goto('/places/jiuzhaigou/');
    const guideBadge = page.locator('.guide-hero [data-weather-location]').first();
    await expectReading(guideBadge, 'jiuzhaigou', '9', '6');
    await expectCompactOverlay(guideBadge, page.locator('.guide-hero > img'));
    const trigger = guideBadge.locator('[data-weather-open]');
    const details = await openWeather(guideBadge);
    await expect(details.locator('[data-weather-time]')).toBeVisible();
    await expect(details.getByRole('link', { name: 'Open-Meteo', exact: true })).toBeVisible();
    await expect(details).toContainText('bukan prakiraan tanggal perjalanan');
    await expect(details.locator('[data-weather-refresh]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(details).toBeHidden();
    await expect(trigger).toBeFocused();
    await openWeather(guideBadge);
    await details.locator('[data-weather-close]').click();
    await expect(details).toBeHidden();
    await expect(trigger).toBeFocused();

    await page.goto('/#2026-11-19');
    await expect(page.locator('#day-view .sleep-summary')).toContainText('Menginap di Dali');
    for (const id of ['jade-dragon', 'impression-lijiang', 'blue-moon']) {
      const stop = page.locator(`#day-view li[id^="stop-${id}-"]`);
      const badge = stop.locator('[data-weather-location]');
      await expectReading(badge, 'ganhaizi', '1', '-3');
      await expectCompactOverlay(badge, stop.locator('img').first());
    }
    await expect(page.locator('#day-view [data-weather-location="dali"]')).toHaveCount(0);
    expect(requestedLocations.filter(location => location[0] === ganhaiziCoordinates[0])).toHaveLength(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}
