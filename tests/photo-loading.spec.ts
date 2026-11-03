import { expect, test, type Locator, type Page, type Route } from '@playwright/test';
import { coverPhoto, pageBySlug } from '../src/guides';
import { places } from '../src/itinerary';

async function holdPhotoRequests(page: Page, photoId: string) {
  let resolveRequest!: () => void;
  let resolveResponse!: (outcome: 'load' | 'error') => void;
  const requested = new Promise<void>(resolve => { resolveRequest = resolve; });
  const response = new Promise<'load' | 'error'>(resolve => { resolveResponse = resolve; });
  const pattern = new RegExp(`/photos/${photoId}-\\d+\\.webp$`);
  const handler = async (route: Route) => {
    resolveRequest();
    if (await response === 'error') await route.abort('failed');
    else await route.continue();
  };
  await page.route(pattern, handler);
  return {
    requested,
    release: () => resolveResponse('load'),
    fail: () => resolveResponse('error'),
    cleanup: async () => {
      resolveResponse('load');
      await page.unrouteAll({ behavior: 'wait' });
    },
  };
}

async function imageBounds(image: Locator) {
  return image.evaluate(node => {
    const { x, y, width, height } = node.getBoundingClientRect();
    return { x, y, width, height };
  });
}

async function runningAnimations(image: Locator) {
  return image.evaluate(node => node.getAnimations().filter(animation => animation.playState === 'running').length);
}

const heroPhoto = coverPhoto(pageBySlug.get('jiuzhaigou')!)!;
test.use({ viewport: { width: 390, height: 844 } });

test('guide hero shows a loading skeleton until its real image arrives without moving its frame', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const gate = await holdPhotoRequests(page, heroPhoto.id);
  try {
    await page.goto('/places/jiuzhaigou/', { waitUntil: 'domcontentloaded' });
    await gate.requested;
    await page.evaluate(() => document.fonts.ready);
    const image = page.locator('.guide-hero img');
    await expect(image).toHaveAttribute('data-photo-state', 'loading');
    await expect(image).toHaveJSProperty('complete', false);
    await expect.poll(() => runningAnimations(image)).toBeGreaterThan(0);
    const before = await imageBounds(image);
    expect(before.width).toBeGreaterThan(0);
    expect(before.height).toBeGreaterThan(0);

    gate.release();
    await expect(image).toHaveAttribute('data-photo-state', 'loaded');
    expect(await image.evaluate(async node => {
      const photo = node as HTMLImageElement;
      await photo.decode();
      return photo.naturalWidth;
    })).toBeGreaterThan(0);
    expect(await imageBounds(image)).toEqual(before);
    expect(await runningAnimations(image)).toBe(0);
  } finally {
    await gate.cleanup();
  }
});

test('date-switched photos settle after loading and remain ready when opened in a fresh dialog', async ({ page }) => {
  const gate = await holdPhotoRequests(page, places.shuangqiao.photo!);
  try {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole('button', { name: 'Pilih hari', exact: true }).click();
    await page.locator('#picker-days [data-date="2026-11-11"]').click();
    const opener = page.locator('#day-view [data-action="photo"][data-place="shuangqiao"]');
    const image = opener.locator('img');
    await image.scrollIntoViewIfNeeded();
    await gate.requested;
    await expect(image).toHaveAttribute('data-photo-state', 'loading');
    await expect(image).toHaveJSProperty('complete', false);
    const before = await imageBounds(image);

    gate.release();
    await expect(image).toHaveAttribute('data-photo-state', 'loaded');
    expect(await imageBounds(image)).toEqual(before);
    const loadedSource = await image.evaluate(node => (node as HTMLImageElement).currentSrc);
    await opener.click();
    const dialogImage = page.locator('#photo-dialog img');
    await expect(page.locator('#photo-dialog')).toBeVisible();
    await expect(dialogImage).toHaveAttribute('data-photo-state', 'loaded');
    expect(await dialogImage.evaluate(node => (node as HTMLImageElement).currentSrc)).toBe(loadedSource);
    expect(await dialogImage.evaluate(node => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(await runningAnimations(dialogImage)).toBe(0);
  } finally {
    await gate.cleanup();
  }
});

test('reduced-motion loading stays still and a failed photo preserves its description without an endless skeleton', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const gate = await holdPhotoRequests(page, heroPhoto.id);
  try {
    await page.goto('/places/jiuzhaigou/', { waitUntil: 'domcontentloaded' });
    await gate.requested;
    const image = page.locator('.guide-hero img');
    await expect(image).toHaveAttribute('data-photo-state', 'loading');
    await expect(image).toHaveJSProperty('complete', false);
    expect(await runningAnimations(image)).toBe(0);
    const description = await image.getAttribute('alt');
    expect(description?.trim()).toBeTruthy();

    gate.fail();
    await expect(image).toHaveAttribute('data-photo-state', 'error');
    await expect(image).toHaveJSProperty('complete', true);
    await expect(image).toHaveJSProperty('naturalWidth', 0);
    await expect(image).toHaveAttribute('alt', description!);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    expect(await runningAnimations(image)).toBe(0);
  } finally {
    await gate.cleanup();
  }
});
