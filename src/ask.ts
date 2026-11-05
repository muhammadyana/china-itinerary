import { AskError, logout, sessionActive, unreachableMessage } from './ask-api.ts';
import { createChat, expiredMessage, type ChatController } from './ask-chat.ts';
import { askWidget } from './ask-render.ts';
import { isUnlocked, setUnlocked } from './ask-state.ts';

// The floating button shows on every page; the password is asked inside it, so nobody needs /places/ask/ first.
export function initializeAsk(): void {
  const panel = document.querySelector<HTMLElement>('[data-ask-page] [data-ask-root]');
  if (panel) mountPage(panel);
  else mountWidget();
}

// Without the flag the session is never checked, so a browser makes no request until someone logs in.
async function checkSession(chat: ChatController, onExpired: () => void) {
  try {
    if (await sessionActive()) return;
    onExpired();
    chat.showLogin(expiredMessage);
    chat.focus();
  } catch {
    // Unreachable for now: keep the chat; sending a question reports the problem.
  }
}

function mountPage(panel: HTMLElement) {
  panel.hidden = false;
  const chat = createChat(panel, { onUnauthorized: () => setUnlocked(false) });
  if (!isUnlocked()) chat.showLogin();
  else {
    chat.showChat();
    void checkSession(chat, () => setUnlocked(false));
  }
  panel.querySelector('[data-ask="lock"]')?.addEventListener('click', async () => {
    try {
      await logout();
      setUnlocked(false);
      chat.reset();
      chat.showLogin();
      chat.focus();
    } catch (error) {
      chat.notify(`Belum terkunci. ${error instanceof AskError ? error.message : unreachableMessage}`);
    }
  });
}

function fitToVisualViewport(dialog: HTMLDialogElement) {
  const viewport = window.visualViewport;
  if (!viewport) return () => undefined;
  // iOS keeps the layout viewport under the keyboard; sizing to the visual viewport keeps the composer above it.
  const fit = () => {
    dialog.style.setProperty('--ask-viewport-height', `${viewport.height}px`);
    dialog.style.setProperty('--ask-viewport-top', `${viewport.offsetTop}px`);
  };
  fit();
  viewport.addEventListener('resize', fit);
  viewport.addEventListener('scroll', fit);
  return () => {
    viewport.removeEventListener('resize', fit);
    viewport.removeEventListener('scroll', fit);
  };
}

function mountWidget() {
  document.body.insertAdjacentHTML('beforeend', askWidget());
  document.documentElement.classList.add('ask-widget');
  const button = document.querySelector<HTMLButtonElement>('.ask-fab')!;
  const dialog = document.querySelector<HTMLDialogElement>('#ask-dialog')!;
  const chat = createChat(dialog, { onUnauthorized: () => setUnlocked(false) });
  let checked = false;
  let unfit: () => void = () => undefined;
  if (isUnlocked()) chat.showChat();
  else chat.showLogin();

  button.addEventListener('click', () => {
    chat.refreshContext();
    dialog.showModal();
    document.documentElement.classList.add('dialog-open');
    unfit = fitToVisualViewport(dialog);
    // Touch screens open on the conversation, not the keyboard.
    if (matchMedia('(hover: hover) and (pointer: fine)').matches || chat.isLoginShown()) chat.focus();
    else dialog.querySelector<HTMLElement>('[data-ask="close"]')!.focus();
    if (!checked && isUnlocked()) {
      checked = true;
      void checkSession(chat, () => setUnlocked(false));
    }
  });
  dialog.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    // A site link in an answer may only change the hash (a day on the homepage): show that page.
    if (event.target.closest('[data-ask="close"], .ask-bubble a[href^="/"]')) dialog.close();
    else if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    unfit();
    if (!document.querySelector('dialog[open]')) document.documentElement.classList.remove('dialog-open');
    button.focus({ preventScroll: true });
  });
}
