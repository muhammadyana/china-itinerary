import { expect, test, type Page, type Route } from '@playwright/test';
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
  await page.locator('#picker-days [data-date="2026-11-11"]').click();
  const stopOpener = page.locator('#day-view [data-action="photo"][data-place="shuangqiao"]');
  await stopOpener.click();
  const dialog = page.locator('#photo-dialog');
  const stop = places.shuangqiao;
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
