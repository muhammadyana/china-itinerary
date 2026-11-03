import { pageBySlug, galleryPhotos } from './guides.ts';
import { guidePhotoDetail } from './guide-render.ts';
import { updatePhotoContent } from './photo-viewer.ts';

export function initializeGuide() {
  const slug = document.querySelector<HTMLElement>('[data-guide]')?.dataset.guide;
  const page = slug ? pageBySlug.get(slug) : undefined;
  if (!page) return;
  const dialog = document.querySelector<HTMLDialogElement>('#guide-photo-dialog')!;
  const counter = document.querySelector<HTMLElement>('#guide-photo-count')!;
  const gallery = galleryPhotos(page);
  let current = 0;
  let opener: HTMLElement | null = null;

  const showPhoto = (index: number) => {
    current = (index + gallery.length) % gallery.length;
    updatePhotoContent(dialog, guidePhotoDetail(page, current));
    counter.textContent = `${current + 1} / ${gallery.length}`;
    dialog.querySelectorAll<HTMLButtonElement>('[data-guide-action$="-photo"]').forEach(button => {
      if (button.dataset.guideAction !== 'close-photo') button.disabled = gallery.length < 2;
    });
  };
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const photo = event.target.closest<HTMLButtonElement>('[data-gallery-index]');
    if (photo) {
      opener = photo;
      showPhoto(Number(photo.dataset.galleryIndex));
      dialog.showModal();
      document.documentElement.classList.add('dialog-open');
    }
    const action = event.target.closest<HTMLElement>('[data-guide-action]')?.dataset.guideAction;
    if (action === 'close-photo') dialog.close();
    if (action === 'next-photo') showPhoto(current + 1);
    if (action === 'previous-photo') showPhoto(current - 1);
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('dialog-open');
    opener?.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}
