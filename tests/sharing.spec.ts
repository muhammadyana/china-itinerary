import { expect, test } from '@playwright/test';

test('sharing crawlers receive the Jiuzhaigou image and route-specific metadata without JavaScript', async ({ browser, request }) => {
  const origin = 'https://china.muhammadyana.me';
  const imagePath = '/social/jiuzhaigou.jpg';
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const path of ['/', '/places/', '/places/jiuzhaigou/', '/places/dali/']) {
      await page.goto(`http://127.0.0.1:4173${path}`);
      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
      await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description!);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${origin}${path}`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}${path}`);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${origin}${imagePath}`);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', `${origin}${imagePath}`);
      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /Jiuzhaigou/);
      await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute('content', 'image/jpeg');
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    }
    const response = await request.get(imagePath);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/jpeg');
    expect((await response.body()).subarray(0, 3).toString('hex')).toBe('ffd8ff');
    await page.goto(`http://127.0.0.1:4173${imagePath}`);
    await expect(page.locator('img')).toHaveJSProperty('naturalWidth', 1200);
    await expect(page.locator('img')).toHaveJSProperty('naturalHeight', 630);
  } finally {
    await context.close();
  }
});
