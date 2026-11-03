import { expect, test, type Page } from '@playwright/test';
import { galleryPhotos, guideDates, pageForPlace } from '../src/guides';
import { days, photos, places, userPhotos } from '../src/itinerary';

const visitDate = '2026-11-19';
const placeId = 'impression-lijiang';
const guidePath = '/places/impression-lijiang/';
const uploadedPhotoIds = ['user-impression-lijiang-1', 'user-impression-lijiang-2'];
const tripBookingUrl = 'https://id.trip.com/travel-guide/attraction/yulong/impressions-lijiang-performance-10758688/';

test.use({ viewport: { width: 390, height: 844 } });

async function expectGuidePhoto(page: Page, index: number) {
  const gallery = galleryPhotos(pageForPlace.get(placeId)!);
  const item = gallery[index];
  const photo = photos[item.id] || userPhotos[item.id];
  const dialog = page.locator('#guide-photo-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('#guide-photo-count')).toHaveText(`${index + 1} / ${gallery.length}`);
  await expect(dialog.locator('#guide-photo-title')).toHaveText(item.title);
  await expect(dialog.locator('img')).toHaveAttribute('src', new RegExp(`/photos/${photo.id}-\\d+\\.webp$`));
  await expect(dialog.locator('img')).toHaveAttribute('alt', item.alt);
  await expect(dialog.locator('img')).toHaveAttribute('data-photo-state', 'loaded');
  expect(await dialog.locator('img').evaluate(node => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  if ('author' in photo) {
    await expect(dialog.locator('.guide-photo-credit')).toContainText(photo.author);
    await expect(dialog.locator(`a[href="${photo.source}"]`)).toBeVisible();
  } else {
    await expect(dialog.locator('.photo-credit')).toContainText(photo.credit);
  }
}

test('Impression Lijiang is required between the glacier and valley without changing the trip dates or Dali overnight', () => {
  expect(days.map(day => day.date)).toEqual(Array.from({ length: 14 }, (_, index) => `2026-11-${String(index + 8).padStart(2, '0')}`));
  expect(days.filter(day => day.overnight)).toHaveLength(13);
  const day = days.find(item => item.date === visitDate)!;
  expect(day.overnight?.name).toBe('Dali');
  const sequence = day.events.flatMap(event => {
    if (event.kind === 'stop' && ['jade-dragon', placeId, 'blue-moon'].includes(event.place)) return [event.place];
    if (event.kind === 'transfer' && event.mode === 'train' && /Dali/.test(event.title)) return ['train-to-dali'];
    return [];
  });
  expect(sequence).toEqual(['jade-dragon', placeId, 'blue-moon', 'train-to-dali']);
  const stop = day.events.find(event => event.kind === 'stop' && event.place === placeId)!;
  expect(stop.status).toBe('Wajib');
  if (stop.kind === 'stop') {
    expect(stop.time).toContain('13.20');
    expect(stop.time).toContain('14.50');
    expect(stop.note).toMatch(/belum dipesan/i);
  }
  expect(places[placeId].page).toBeUndefined();
  expect(day.sourceNote).toContain('Impression Lijiang');

  const destination = pageForPlace.get(placeId)!;
  expect(destination.slug).toBe(placeId);
  expect(guideDates(destination).map(item => item.date)).toEqual([visitDate]);
  const photoId = places[placeId].photo!;
  expect(photoId).toBeTruthy();
  expect(photoId).not.toBe(places['jade-dragon'].photo);
  expect(photoId).not.toBe(places['blue-moon'].photo);
  const galleryIds = galleryPhotos(destination).map(item => item.id);
  expect(galleryIds).toContain(photoId);
  expect((photos[photoId] || userPhotos[photoId]).origin).not.toBe('PDF');
  for (const id of uploadedPhotoIds) {
    expect(userPhotos[id]).toBeDefined();
    expect(galleryIds).toContain(id);
  }
  const tripCost = destination.guide.costs.find(cost => cost.source === tripBookingUrl)!;
  expect(tripCost.amount).toContain('Rp462.162');
  expect(tripCost.status).toBe('estimate');
});

test('phone visitors choose 19 November, open the sourced show guide and gallery, then return to the same day', async ({ page }) => {
  await page.goto('/');
  for (const id of uploadedPhotoIds) {
    const thumbnail = page.locator(`.gallery-photo[data-photo="${id}"]`);
    await expect(thumbnail).toBeAttached();
    await expect(thumbnail.locator('img')).toHaveAttribute('src', new RegExp(`/photos/${id}-\\d+\\.webp$`));
    await expect(thumbnail.locator('img')).toHaveAttribute('alt', userPhotos[id].alt);
  }
  await page.getByRole('button', { name: 'Pilih hari', exact: true }).click();
  await page.locator(`#picker-days [data-date="${visitDate}"]`).click();
  const stop = page.locator(`#day-view li[id^="stop-${placeId}-"]`);
  await expect(stop.locator('h3')).toHaveText(places[placeId].name);
  await expect(stop.locator('.state')).toHaveText('Wajib');
  await expect(stop.locator('.state.confirmed')).toHaveCount(0);
  await expect(stop.locator('.stop-time')).toContainText('13.20');
  await expect(stop.locator('.stop-time')).toContainText('14.50');
  await expect(stop.locator('.stop-note')).toContainText(/sesi|jadwal/i);
  await expect(stop.locator('.stop-note')).toContainText(/tiket/i);
  await expect(stop.locator('.stop-note')).toContainText(/belum dipesan/i);
  await expect(stop.locator('.stop-note')).toContainText('UTC+8');
  await expect(page.locator('.day-source-note')).toContainText('Impression Lijiang');
  await expect(page.locator('#day-view .sleep-summary')).toContainText('Menginap di Dali');
  await stop.locator('.stop-guide-link').click();
  await expect(page).toHaveURL(new RegExp(`${guidePath}$`));
  await expect(page.locator('#place-title')).toHaveText(places[placeId].name);
  await expect(page.locator('.guide-date-link')).toContainText('Malamnya di Dali');

  const guide = pageForPlace.get(placeId)!.guide;
  const sourcedCosts = guide.costs.filter(cost => cost.source);
  expect(sourcedCosts.length).toBeGreaterThan(0);
  for (const cost of sourcedCosts) {
    const row = page.locator('.guide-costs > div').filter({ has: page.locator('dt', { hasText: cost.label }) });
    await expect(row).toContainText(cost.amount);
    await expect(row.locator('a')).toHaveAttribute('href', cost.source!);
    await expect(page.locator(`#sources a[href="${cost.source}"]`)).toBeVisible();
  }
  expect(guide.gettingThere.sources.length).toBeGreaterThan(0);
  for (const source of guide.gettingThere.sources) {
    await expect(page.locator(`#getting-there a[href="${source}"]`)).toBeVisible();
  }
  const tripCost = page.locator('.guide-costs > div').filter({ hasText: 'Rp462.162' });
  await expect(tripCost.locator('.cost-status')).toHaveText('Anggaran acuan');
  await expect(tripCost.locator('a')).toHaveAttribute('href', tripBookingUrl);
  await expect(tripCost).toContainText(/bukan harga final|belum dipesan/i);
  await expect(page.locator('#getting-there')).toContainText('13:20');
  await expect(page.locator('#getting-there')).toContainText('14:50');
  await expect(page.locator('#getting-there')).toContainText('UTC+8');
  await expect(page.locator('#getting-there')).toContainText(/belum dipesan/i);
  await expect(page.locator('.guide-caution')).toContainText(/konfirmasi|belum|cek/i);
  await expect(page.locator('#sources')).toContainText('Impression Lijiang');

  const gallery = galleryPhotos(pageForPlace.get(placeId)!);
  const galleryItem = page.locator('#gallery [data-gallery-index="0"]');
  await galleryItem.click();
  const dialog = page.locator('#guide-photo-dialog');
  for (let index = 0; index < gallery.length; index++) {
    if (index > 0) await dialog.getByRole('button', { name: 'Foto berikutnya', exact: true }).click();
    await expectGuidePhoto(page, index);
  }
  await dialog.getByRole('button', { name: 'Foto sebelumnya', exact: true }).click();
  await expectGuidePhoto(page, gallery.length - 2);
  await page.keyboard.press('Escape');
  await expect(galleryItem).toBeFocused();

  await page.locator('.guide-date-link').click();
  await expect(page).toHaveURL(new RegExp(`/#${visitDate}$`));
  await expect(page.locator('.day-header time')).toHaveAttribute('datetime', visitDate);
  await expect(page.locator(`#day-view li[id^="stop-${placeId}-"] .state`)).toHaveText('Wajib');
  await expect(page.locator('#day-view .sleep-summary')).toContainText('Menginap di Dali');
});

test('the show guide is a directly reloadable document with useful directions, prices, photos and revision provenance without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    const response = await page.goto(new URL(guidePath, baseURL).href);
    expect(response?.status()).toBe(200);
    await expect(page.locator('#place-title')).toHaveText(places[placeId].name);
    await expect(page.locator('.guide-steps li').first()).toBeVisible();
    await expect(page.locator('.guide-references a').first()).toBeVisible();
    await expect(page.locator('.guide-costs > div').first()).toBeVisible();
    await expect(page.locator('#costs a').first()).toBeVisible();
    await expect(page.locator('#costs')).toContainText('Rp462.162');
    await expect(page.locator('#getting-there')).toContainText('13:20');
    await expect(page.locator('#getting-there')).toContainText('14:50');
    await expect(page.locator('#getting-there')).toContainText(/belum dipesan/i);
    await expect(page.locator('#tips li').first()).toBeVisible();
    await expect(page.locator('.guide-provenance time')).toBeVisible();
    await expect(page.locator('#sources')).toContainText(days.find(day => day.date === visitDate)!.sourceNote!);
    await expect(page.locator('#sources li a').first()).toBeVisible();
    await expect(page.locator('.guide-date-link')).toHaveAttribute('href', `/#${visitDate}`);
    for (const photoId of uploadedPhotoIds) {
      const image = page.locator(`#gallery img[src*="/photos/${photoId}-"]`);
      await image.scrollIntoViewIfNeeded();
      expect(await image.evaluate(async node => {
        const photo = node as HTMLImageElement;
        await photo.decode();
        return photo.naturalWidth;
      })).toBeGreaterThan(0);
    }
    await page.reload();
    await expect(page.locator('#place-title')).toHaveText(places[placeId].name);
    await expect(page.locator('.guide-date-link')).toContainText('Malamnya di Dali');
  } finally {
    await context.close();
  }
});
