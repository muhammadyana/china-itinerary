export interface PhotoContent {
  image: string;
  caption: string;
}

export function updatePhotoContent(dialog: HTMLDialogElement, content: PhotoContent): void {
  const frame = dialog.querySelector<HTMLElement>('[data-photo-frame]');
  const caption = dialog.querySelector<HTMLElement>('[data-photo-caption]');
  if (!frame || !caption) return;
  frame.innerHTML = content.image;
  caption.innerHTML = content.caption;
  dialog.scrollTop = 0;
}
