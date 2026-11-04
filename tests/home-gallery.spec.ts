import { expect, test, type Locator, type Page, type Route } from '@playwright/test';
import { photos, places, userPhotos } from '../src/itinerary';

const galleryPhotos = Object.values(userPhotos);

test.use({ viewport: { width: 390, height: 844 } });

async function expectGalleryPhoto(page: Page, index: number) {
  const photo = galleryPhotos[index];
  const dialog = page.locator('#photo-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('#photo-count')).toHaveText(`${index + 1} / ${galleryPhotos.length}`);
  await expect(dialog.locator('#photo-title')).toHaveText(photo.title);
  await expect(dialog.locator('figcaption > p')).toHaveText(photo.caption);
  await expect(dialog.locator('.photo-credit')).toContainText(photo.credit);
  await expect(dialog.locator('img')).toHaveAttribute('alt', photo.alt);
  await expect(dialog.locator('img')).toHaveAttribute('src', new RegExp(`/photos/${photo.id}-\\d+\\.webp$`));
}

async function expectSideNavigation(dialog: Locator, viewportWidth: number) {
  const image = dialog.locator('.photo-stage img');
  await image.evaluate(node => (node as HTMLImageElement).decode());
  const previous = dialog.getByRole('button', { name: 'Foto sebelumnya', exact: true });
  const next = dialog.getByRole('button', { name: 'Foto berikutnya', exact: true });
  const close = dialog.getByRole('button', { name: 'Tutup foto', exact: true });
  for (const control of [previous, next, close]) await expect(control).toBeInViewport({ ratio: 1 });
  const [imageBox, previousBox, nextBox, closeBox] = await Promise.all([
    image.boundingBox(), previous.boundingBox(), next.boundingBox(), close.boundingBox(),
  ]);
  expect(imageBox!.width).toBeGreaterThan(0);
  expect(imageBox!.height).toBeGreaterThan(0);
  for (const box of [previousBox!, nextBox!]) {
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth);
    expect(Math.abs(box.y + box.height / 2 - imageBox!.y - imageBox!.height / 2)).toBeLessThanOrEqual(2);
  }
  expect(previousBox!.x + previousBox!.width).toBeLessThanOrEqual(imageBox!.x + 1);
  expect(nextBox!.x).toBeGreaterThanOrEqual(imageBox!.x + imageBox!.width - 1);
  expect(closeBox!.y + closeBox!.height).toBeLessThanOrEqual(imageBox!.y + 1);
}

test('gallery buttons update the complete photo, wrap both ends, and preserve navigation and opener focus', async ({ page }) => {
  await page.goto('/');
  const opener = page.locator(`.gallery-photo[data-photo="${galleryPhotos[0].id}"]`);
  await opener.click();
  await expectGalleryPhoto(page, 0);
  const previous = page.getByRole('button', { name: 'Foto sebelumnya', exact: true });
  const next = page.getByRole('button', { name: 'Foto berikutnya', exact: true });

  await next.click();
  await expectGalleryPhoto(page, 1);
  await expect(next).toBeFocused();
  await previous.click();
  await expectGalleryPhoto(page, 0);
  await expect(previous).toBeFocused();
  await previous.click();
  await expectGalleryPhoto(page, galleryPhotos.length - 1);
  await expect(previous).toBeFocused();
  await next.click();
  await expectGalleryPhoto(page, 0);
  await expect(next).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.locator('#photo-dialog')).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('arrow keys wrap user photos but never reuse gallery state for an itinerary stop', async ({ page }) => {
  await page.goto('/');
  const opener = page.locator(`.gallery-photo[data-photo="${galleryPhotos[0].id}"]`);
  await opener.click();
  await page.keyboard.press('ArrowLeft');
  await expectGalleryPhoto(page, galleryPhotos.length - 1);
  await page.keyboard.press('ArrowRight');
  await expectGalleryPhoto(page, 0);
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#photo-dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Pilih hari', exact: true }).click();
  await page.locator('#picker-days [data-date="2026-11-12"]').click();
  const stopOpener = page.locator('#day-view [data-action="photo"][data-place="jiaju"]');
  await stopOpener.click();
  const dialog = page.locator('#photo-dialog');
  const stop = places.jiaju;
  const photo = photos[stop.photo!];
  await expect(dialog.locator('#photo-title')).toHaveText(stop.name);
  await expect(dialog.locator('[data-action="photo-previous"]')).toBeHidden();
  await expect(dialog.locator('[data-action="photo-next"]')).toBeHidden();
  await expect(dialog.locator('#photo-count')).toBeEmpty();

  for (const key of ['ArrowLeft', 'ArrowRight']) {
    await page.keyboard.press(key);
    await expect(dialog.locator('#photo-title')).toHaveText(stop.name);
    await expect(dialog.locator('img')).toHaveAttribute('src', new RegExp(`/photos/${photo.id}-\\d+\\.webp$`));
    await expect(dialog.locator('.photo-credit')).toContainText(photo.author);
    await expect(dialog.locator('#photo-count')).toBeEmpty();
  }
  await page.keyboard.press('Escape');
  await expect(stopOpener).toBeFocused();

  const selectedOpener = page.locator(`.gallery-photo[data-photo="${galleryPhotos[7].id}"]`);
  await selectedOpener.click();
  await expectGalleryPhoto(page, 7);
  await page.keyboard.press('ArrowRight');
  await expectGalleryPhoto(page, 8);
  await page.keyboard.press('Escape');
  await expect(selectedOpener).toBeFocused();
});

test('a newly paged photo settles from a real pending image request without replacing its controls', async ({ page }) => {
  const pendingPhoto = galleryPhotos[1];
  let releaseRequest!: () => void;
  let notifyRequest!: () => void;
  const released = new Promise<void>(resolve => { releaseRequest = resolve; });
  const requested = new Promise<void>(resolve => { notifyRequest = resolve; });
  const pattern = new RegExp(`/photos/${pendingPhoto.id}-\\d+\\.webp$`);
  const holdRequest = async (route: Route) => {
    notifyRequest();
    await released;
    await route.continue();
  };
  await page.route(pattern, holdRequest);

  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator(`.gallery-photo[data-photo="${galleryPhotos[0].id}"]`).click();
    const next = page.getByRole('button', { name: 'Foto berikutnya', exact: true });
    await next.click();
    await requested;
    await expectGalleryPhoto(page, 1);
    const image = page.locator('#photo-dialog img');
    await expect(image).toHaveAttribute('data-photo-state', 'loading');
    await expect(image).toHaveJSProperty('complete', false);
    await expect(next).toBeFocused();

    releaseRequest();
    await expect(image).toHaveAttribute('data-photo-state', 'loaded');
    expect(await image.evaluate(async node => {
      const photo = node as HTMLImageElement;
      await photo.decode();
      return photo.naturalWidth;
    })).toBeGreaterThan(0);
    await expect(next).toBeFocused();
    await expect(page.locator('#photo-dialog .photo-error')).toHaveCount(0);
  } finally {
    releaseRequest();
    await page.unrouteAll({ behavior: 'wait' });
  }
});

for (const width of [320, 390, 1440]) {
  test(`${width}px: home and destination gallery arrows align with the image midpoint without covering the photograph`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.route('https://api.open-meteo.com/**', route => route.abort());
    await page.route('https://api.frankfurter.dev/**', route => route.abort());
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const portraitIndex = galleryPhotos.findIndex(photo => photo.height > photo.width);
    expect(portraitIndex).toBeGreaterThanOrEqual(0);
    const opener = page.locator(`.gallery-photo[data-photo="${galleryPhotos[portraitIndex].id}"]`);
    await opener.click();
    const homeDialog = page.locator('#photo-dialog');
    await expectGalleryPhoto(page, portraitIndex);
    await expectSideNavigation(homeDialog, width);
    const next = homeDialog.getByRole('button', { name: 'Foto berikutnya', exact: true });
    await next.click();
    await expectGalleryPhoto(page, (portraitIndex + 1) % galleryPhotos.length);
    await expect(next).toBeFocused();
    await expectSideNavigation(homeDialog, width);
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();

    await page.goto('/places/jiuzhaigou/');
    await page.locator('[data-gallery-index="0"]').click();
    const guideDialog = page.locator('#guide-photo-dialog');
    await expectSideNavigation(guideDialog, width);
    const guideNext = guideDialog.getByRole('button', { name: 'Foto berikutnya', exact: true });
    const firstSource = await guideDialog.locator('img').getAttribute('src');
    await guideNext.click();
    await expect(guideDialog.locator('img')).not.toHaveAttribute('src', firstSource!);
    await expect(guideNext).toBeFocused();
    await expectSideNavigation(guideDialog, width);
    const guidePrevious = guideDialog.getByRole('button', { name: 'Foto sebelumnya', exact: true });
    await guidePrevious.click();
    await expect(guideDialog.locator('img')).toHaveAttribute('src', firstSource!);
    await expect(guidePrevious).toBeFocused();
  });
}
