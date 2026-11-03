import { expect, test } from '@playwright/test';
import { coverPhoto, placePages, placePath } from '../src/guides';
import { socialImage } from '../src/social-image';

const origin = 'https://china.muhammadyana.me';
const siteImage = { path: '/social/jiuzhaigou.jpg', width: 1200, height: 630, alt: /Jiuzhaigou/ as string | RegExp };
const routes = [
  { path: '/', image: siteImage },
  { path: '/places/', image: siteImage },
  ...placePages.map(page => {
    const cover = coverPhoto(page);
    if (!cover) throw new Error(`Place page without a cover photo: ${page.slug}`);
    return { path: placePath(page.slug), image: { ...socialImage(cover.id), alt: cover.alt as string | RegExp } };
  }),
];

test('sharing crawlers receive route-specific metadata and each place previews its own cover photo without JavaScript', async ({ browser, baseURL }) => {
  test.setTimeout(120_000);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const { path, image } of routes) {
      await page.goto(`${baseURL}${path}`);
      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
      await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description!);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${origin}${path}`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}${path}`);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${origin}${image.path}`);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', `${origin}${image.path}`);
      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', image.alt);
      await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute('content', image.alt);
      await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute('content', 'image/jpeg');
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', String(image.width));
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', String(image.height));
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    }

    const images = new Map(routes.map(({ image }) => [image.path, image]));
    for (const image of images.values()) {
      const response = await page.request.get(`${baseURL}${image.path}`);
      expect(response.status(), image.path).toBe(200);
      expect(response.headers()['content-type']).toContain('image/jpeg');
      const body = await response.body();
      expect(body.subarray(0, 3).toString('hex')).toBe('ffd8ff');
      expect(body.length, image.path).toBeLessThan(600_000);
      await page.goto(`${baseURL}${image.path}`);
      await expect(page.locator('img')).toHaveJSProperty('naturalWidth', image.width);
      await expect(page.locator('img')).toHaveJSProperty('naturalHeight', image.height);
    }
  } finally {
    await context.close();
  }
});

test('the Impression Lijiang preview shows the show itself, not the site-wide Jiuzhaigou card', async ({ request, baseURL }) => {
  const html = await (await request.get(`${baseURL}/places/impression-lijiang/`)).text();
  expect(html).toContain(`<meta property="og:image" content="${origin}/social/user-impression-lijiang-2.jpg">`);
  expect(html).toMatch(/<meta property="og:image:alt" content="[^"]*Impression Lijiang/);
});
