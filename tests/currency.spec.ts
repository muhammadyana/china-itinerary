import { expect, test, type Locator, type Page } from '@playwright/test';
import { currencyText, hasCnyAmount } from '../src/currency';

const exchangeApi = 'https://api.frankfurter.dev/v2/providers/ecb/rate/CNY/IDR';
const impressionPath = '/places/impression-lijiang/';
const snapshotEstimates = { '280': 'Rp763.823', '346': 'Rp943.867', '100': 'Rp272.794', '20': 'Rp54.559' };

test.use({ viewport: { width: 390, height: 844 } });

async function blockWeather(page: Page) {
  await page.route('https://api.open-meteo.com/**', route => route.abort());
}

async function expectSnapshot(annotation: Locator, state: 'snapshot' | 'fallback') {
  await expect(annotation).toHaveAttribute('data-exchange-state', state);
  await expect(annotation.locator('[data-exchange-summary]')).toHaveText('1 CNY ≈ Rp2.728 · kurs 2 Nov 2026');
  await expect(annotation.getByRole('link', { name: 'ECB', exact: true })).toHaveAttribute('href', /^https:\/\/www\.ecb\.europa\.eu\//);
  await expect(annotation.getByRole('link', { name: 'Frankfurter', exact: true })).toHaveAttribute('href', 'https://frankfurter.dev/');
  await expect(annotation).toContainText('Kurs pembayaran dapat berbeda.');
}

test('currency text preserves CNY ranges and units, escapes content, and leaves existing rupiah prices alone', () => {
  const text = 'Transfer CNY 100–200 / mobil; tiket CNY 0 / anak; Rp462.162; <img src=x onerror="alert(1)"> & "catatan".';
  const html = currencyText(text);
  expect(hasCnyAmount(text)).toBe(true);
  expect(html).toContain('CNY 100–200');
  expect(html).toContain('data-cny-amount="100" data-cny-maximum="200"');
  expect(html).toContain('(≈ Rp272.794–Rp545.588)</span> / mobil');
  expect(html).toContain('data-cny-amount="0">(≈ Rp0)</span> / anak');
  expect(html.match(/data-cny-amount=/g)).toHaveLength(2);
  expect(html).toContain('Rp462.162');
  expect(html).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &quot;catatan&quot;');
  expect(html).not.toMatch(/<img\b/);
  expect(hasCnyAmount('Mulai Rp462.162 / orang, 19 November')).toBe(false);
  expect(currencyText('Mulai Rp462.162 / orang, 19 November')).toBe('Mulai Rp462.162 / orang, 19 November');
});

test('the server-rendered guide keeps its original CNY costs and dated rupiah estimates without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  let exchangeRequests = 0;
  await context.route(exchangeApi, async route => { exchangeRequests++; await route.abort(); });
  try {
    const page = await context.newPage();
    const response = await page.goto(new URL(impressionPath, baseURL).href);
    expect(response?.status()).toBe(200);
    const html = await response!.text();
    for (const [amount, estimate] of Object.entries(snapshotEstimates)) {
      expect(html).toContain(`data-cny-amount="${amount}"`);
      await expect(page.locator('#costs')).toContainText(`CNY ${amount}`);
      await expect(page.locator(`#costs [data-cny-amount="${amount}"]`)).toHaveText(`(≈ ${estimate})`);
    }
    await expectSnapshot(page.locator('[data-exchange-rate]'), 'snapshot');
    await expect(page.locator('[data-exchange-status]')).toHaveText('Menggunakan kurs tersimpan.');
    const tripPrice = page.locator('.guide-costs > div').filter({ hasText: 'Rp462.162' });
    await expect(tripPrice.locator('[data-cny-amount]')).toHaveCount(0);
    expect(exchangeRequests).toBe(0);
  } finally {
    await context.close();
  }
});

test('a valid live rate updates guide amounts, details, cautions and newly selected daily costs without converting existing Rp prices twice', async ({ page }) => {
  await blockWeather(page);
  let requests = 0;
  await page.route(exchangeApi, async route => {
    requests++;
    await route.fulfill({
      status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ date: new Date().toISOString().slice(0, 10), base: 'CNY', quote: 'IDR', rate: 3000 }),
    });
  });
  await page.goto(impressionPath);
  await expect(page.locator('[data-exchange-rate]')).toHaveAttribute('data-exchange-state', 'ready');
  await expect(page.locator('[data-exchange-summary]')).toContainText('1 CNY ≈ Rp3.000');
  for (const [amount, estimate] of Object.entries({ '280': 'Rp840.000', '346': 'Rp1.038.000', '100': 'Rp300.000', '20': 'Rp60.000' })) {
    await expect(page.locator(`#costs [data-cny-amount="${amount}"]`)).toHaveText(`(≈ ${estimate})`);
    await expect(page.locator('#costs')).toContainText(`CNY ${amount}`);
  }
  const tripPrice = page.locator('.guide-costs > div').filter({ hasText: 'Rp462.162' });
  await expect(tripPrice.locator('dd strong')).toHaveText('Mulai Rp462.162');
  await expect(tripPrice.locator('[data-cny-amount]')).toHaveCount(0);
  expect(requests).toBe(1);

  await page.goto('/places/jiuzhaigou/');
  await expect(page.locator('[data-exchange-rate]')).toHaveAttribute('data-exchange-state', 'ready');
  await expect(page.locator('.guide-costs strong [data-cny-amount="190"]')).toHaveText('(≈ Rp570.000)');
  await expect(page.locator('.guide-costs strong [data-cny-amount="90"]')).toHaveText('(≈ Rp270.000)');
  await expect(page.locator('.guide-costs dd p [data-cny-amount="280"]')).toHaveText('(≈ Rp840.000)');
  await expect(page.locator('.guide-caution [data-cny-amount="90"]')).toHaveText('(≈ Rp270.000)');
  expect(requests).toBe(2);

  await page.goto('/');
  await page.getByRole('button', { name: 'Pilih hari', exact: true }).click();
  await page.locator('#picker-days [data-date="2026-11-09"]').click();
  const costs = page.locator('#day-view .practical-list details').filter({ hasText: 'CNY 190' });
  await costs.locator('summary').click();
  for (const [amount, estimate] of Object.entries({ '190': 'Rp570.000', '90': 'Rp270.000', '280': 'Rp840.000' })) {
    await expect(costs.locator(`[data-cny-amount="${amount}"]`)).toHaveText(`(≈ ${estimate})`);
    await expect(costs).toContainText(`CNY ${amount}`);
  }
  await expect(page.locator('#day-view [data-exchange-rate]')).toHaveAttribute('data-exchange-state', 'ready');
  expect(requests).toBe(3);
  await page.getByRole('button', { name: 'Pilih hari', exact: true }).click();
  await page.locator('#picker-days [data-date="2026-11-08"]').click();
  await page.getByRole('button', { name: 'Pilih hari', exact: true }).click();
  await page.locator('#picker-days [data-date="2026-11-09"]').click();
  await expect(page.locator('#day-view [data-cny-amount="190"]')).toHaveText('(≈ Rp570.000)');
  expect(requests).toBe(3);
});

test('provider failures and null, older or future rates retain the dated snapshot with a clear fallback message', async ({ page }) => {
  await blockWeather(page);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const cases = [
    { name: 'provider failure', status: 503, payload: {} },
    { name: 'null rate', status: 200, payload: { date: '2026-11-02', base: 'CNY', quote: 'IDR', rate: null } },
    { name: 'older rate', status: 200, payload: { date: '2026-11-01', base: 'CNY', quote: 'IDR', rate: 3000 } },
    { name: 'future rate', status: 200, payload: { date: tomorrow, base: 'CNY', quote: 'IDR', rate: 3000 } },
  ];
  let scenario = cases[0];
  await page.route(exchangeApi, route => route.fulfill({
    status: scenario.status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(scenario.payload),
  }));
  for (scenario of cases) {
    await test.step(scenario.name, async () => {
      await page.goto(impressionPath);
      await expectSnapshot(page.locator('[data-exchange-rate]'), 'fallback');
      await expect(page.locator('[data-exchange-status]')).toHaveText('Kurs terbaru belum bisa dimuat; memakai kurs tersimpan.');
      for (const [amount, estimate] of Object.entries(snapshotEstimates)) {
        await expect(page.locator(`#costs [data-cny-amount="${amount}"]`)).toHaveText(`(≈ ${estimate})`);
      }
    });
  }
});
