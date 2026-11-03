import { expect, test } from '@playwright/test';
import { days, pdfPath, places } from '../src/itinerary';
import { guides, pageForPlace, placePath } from '../src/guides';
import { chengduEveningMalls } from '../src/chengdu-evening';

test('the build publishes a newly generated PDF separately from the archived source', async ({ page, request }) => {
  await page.goto('/');
  const download = await page.locator('footer a[download]').getAttribute('href');
  const downloadUrl = new URL(download!, 'http://127.0.0.1:4173');
  expect(downloadUrl.pathname).toBe(`/${pdfPath}`);
  expect(downloadUrl.searchParams.get('v')).toMatch(/^\d+$/);
  await expect(page.locator('.site-navigation a[href*=".pdf"]')).toHaveCount(0);
  const response = await request.get(downloadUrl.href);
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('pdf');
  const document = await response.body();
  expect(document.subarray(0, 5).toString()).toBe('%PDF-');
  expect(document.length).toBeGreaterThan(10_000);
  const pageCounts = [...document.toString('latin1').matchAll(/\/Type\s*\/Pages\b[\s\S]*?\/Count\s+(\d+)/g)].map(match => Number(match[1]));
  expect(Math.max(...pageCounts)).toBeGreaterThanOrEqual(14);
  const archive = await request.get('/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf');
  expect(archive.ok()).toBe(true);
  expect(document.equals(await archive.body())).toBe(false);
});

test('the printable document preserves all days, current stops, guide costs, sources, and Chengdu evening choices without application scripts', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') externalRequests.push(request.url());
  });
  await page.goto('/print/');
  await expect(page.locator('script')).toHaveCount(0);
  await expect(page.locator('[data-print-date]')).toHaveCount(14);
  await expect(page.locator('meta[name="itinerary-pdf-path"]')).toHaveAttribute('content', pdfPath);
  await expect(page.locator('.print-cover')).toContainText('© @muhammad_yana');

  for (const day of days) {
    const section = page.locator(`[data-print-date="${day.date}"]`);
    await expect(section.locator('header h2')).toHaveText(day.title);
    if (day.overnight) await expect(section.locator('.print-essentials')).toContainText(day.overnight.name);
    await expect(section.locator('.print-essentials')).toContainText(day.transport);
    for (const event of day.events) {
      await expect(section).toContainText(event.kind === 'stop' ? places[event.place].name : event.title);
      if (event.kind === 'stop') {
        if (event.note) await expect(section).toContainText(event.note);
        const target = pageForPlace.get(event.place);
        if (target) await expect(section.locator(`a[href="https://china.muhammadyana.me${placePath(target.slug)}"]`).first()).toBeAttached();
      }
    }
  }

  for (const guide of guides) {
    const section = page.locator(`[data-print-guide="${guide.slug}"]`);
    await expect(section).toHaveCount(1);
    for (const cost of guide.costs) await expect(section).toContainText(cost.label);
    for (const source of guide.sources) await expect(section.locator(`a[href="${source.url}"]`).first()).toBeAttached();
  }
  for (const mall of chengduEveningMalls) {
    const option = page.locator(`[data-print-date="2026-11-08"] [data-evening-mall="${mall.id}"]`);
    await expect(option).toHaveCount(1);
    await expect(option).toContainText(mall.name);
  }
  const prices = await page.locator('main').evaluate(root => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let sourceAmounts = 0;
    while (walker.nextNode()) sourceAmounts += [...(walker.currentNode.textContent ?? '').matchAll(/\bCNY\s+\d/g)].length;
    return { sourceAmounts, estimates: root.querySelectorAll('.currency-estimate').length };
  });
  expect(prices.sourceAmounts).toBeGreaterThan(0);
  expect(prices.estimates).toBe(prices.sourceAmounts);
  expect(externalRequests).toEqual([]);
});
