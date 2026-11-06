import { places, userPhotos, type Place } from './itinerary.ts';
import { icon, photoDetail, userPhotoDetail } from './render.ts';
import { updatePhotoContent } from './photo-viewer.ts';

// Dialogs, status messages, clipboard and photo viewer shared by the homepage day view and the calm itinerary.
export type OpenDialog = (dialog: HTMLDialogElement, opener: HTMLElement) => void;
export interface ModalDialogs { open: OpenDialog; returnFocus: WeakMap<HTMLDialogElement, HTMLElement> }

/** Native modal dialogs that hand focus back to their opener and close on a backdrop click. */
export function modalDialogs(dialogs: HTMLDialogElement[]): ModalDialogs {
  const returnFocus = new WeakMap<HTMLDialogElement, HTMLElement>();
  const open: OpenDialog = (dialog, opener) => {
    returnFocus.set(dialog, opener);
    dialog.showModal();
    document.documentElement.classList.add('dialog-open');
  };
  for (const dialog of dialogs) {
    dialog.addEventListener('close', () => {
      const anotherDialogOpen = dialogs.some(item => item.open);
      document.documentElement.classList.toggle('dialog-open',anotherDialogOpen);
      if (anotherDialogOpen) return;
      const opener = returnFocus.get(dialog);
      if (opener?.isConnected) opener.focus({preventScroll:true});
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
  }
  return { open, returnFocus };
}

export function statusAnnouncer(status: HTMLElement) {
  let timer: ReturnType<typeof setTimeout>;
  return (message: string) => {
    clearTimeout(timer);
    status.textContent = message;
    timer = setTimeout(() => { status.textContent = ''; }, 4500);
  };
}

/** Copies to the clipboard, or opens the manual copy dialog where the browser refuses. */
export function clipboardCopy(copyDialog: HTMLDialogElement, { open, returnFocus }: ModalDialogs, announce: (message: string) => void) {
  const input = copyDialog.querySelector<HTMLInputElement>('#manual-copy')!;
  return async (text: string, button: HTMLElement, success: string) => {
    const original = button.innerHTML;
    button.setAttribute('aria-busy','true');
    try {
      await navigator.clipboard.writeText(text);
      button.innerHTML = `${icon('check')}<span>Tersalin</span>`;
      announce(success);
      setTimeout(() => { if(button.isConnected) button.innerHTML = original; },2200);
    } catch {
      input.value = text;
      const sourceDialog = button.closest('dialog');
      const opener = sourceDialog ? returnFocus.get(sourceDialog) ?? button : button;
      sourceDialog?.close();
      open(copyDialog,opener);
      input.focus(); input.select();
    } finally { button.removeAttribute('aria-busy'); }
  };
}

/** Stop photos open alone; the traveller's own photos page through the whole user gallery, also with the arrow keys. */
/** `place` resolves a stop's place; the calm page passes one that also knows its own stops. */
export function photoViewer(dialog: HTMLDialogElement, open: OpenDialog, place: (id: string) => Place | undefined = id => places[id]) {
  const counter = dialog.querySelector<HTMLElement>('#photo-count')!;
  const navigation = Array.from(dialog.querySelectorAll<HTMLButtonElement>('[data-action="photo-previous"], [data-action="photo-next"]'));
  const ids = Object.keys(userPhotos);
  let index: number | null = null;
  const showUserPhoto = (next: number) => {
    index = (next + ids.length) % ids.length;
    updatePhotoContent(dialog, userPhotoDetail(ids[index]));
    counter.textContent = `${index + 1} / ${ids.length}`;
    navigation.forEach(button => { button.hidden = false; button.disabled = ids.length < 2; });
  };
  dialog.addEventListener('keydown', event => {
    if (index === null || (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft')) return;
    event.preventDefault();
    showUserPhoto(index + (event.key === 'ArrowRight' ? 1 : -1));
  });
  dialog.addEventListener('close', () => { index = null; });
  return {
    openUser(button: HTMLElement) {
      const start = ids.indexOf(button.dataset.photo!);
      if (start < 0) return;
      showUserPhoto(start);
      open(dialog,button);
    },
    step(direction: number) { if (index !== null) showUserPhoto(index + direction); },
    openPlace(button: HTMLElement) {
      index = null;
      counter.textContent = '';
      navigation.forEach(control => { control.hidden = true; });
      updatePhotoContent(dialog, photoDetail(button.dataset.place!, place(button.dataset.place!)));
      open(dialog,button);
    },
  };
}

/** A photo that fails to load says so instead of leaving an empty frame. */
export function showPhotoErrors() {
  document.addEventListener('error', event => {
    if (!(event.target instanceof HTMLImageElement)) return;
    const image = event.target; image.hidden = true;
    const message = document.createElement('span'); message.className = 'photo-error';
    message.textContent = 'Foto belum termuat. Ketuk untuk melihat keterangan dan sumbernya.';
    image.parentElement?.append(message);
  },true);
}
