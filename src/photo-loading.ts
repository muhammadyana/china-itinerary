export function initializePhotoLoading() {
  const settle = (image: HTMLImageElement) => {
    image.dataset.photoState = image.naturalWidth > 0 ? 'loaded' : 'error';
  };
  const onSettled = (event: Event) => {
    if (event.target instanceof HTMLImageElement && event.target.hasAttribute('data-photo-state')) {
      settle(event.target);
    }
  };

  // Capture also covers photos inserted by date navigation and gallery dialogs.
  document.addEventListener('load', onSettled, true);
  document.addEventListener('error', onSettled, true);
  document.querySelectorAll<HTMLImageElement>('img[data-photo-state]').forEach(image => {
    if (image.complete) settle(image);
  });
}
