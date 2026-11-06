import { fullDate } from './render.ts';
import { clipboardCopy, modalDialogs, photoViewer, showPhotoErrors, statusAnnouncer } from './day-controls.ts';

const dayMonth = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', timeZone: 'Asia/Shanghai' });
const modified = (event: MouseEvent) => event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
const glide = (): ScrollBehavior => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

// Every calm day is prerendered, so the page reads top to bottom without JavaScript.
// Here one day shows at a time, kept in the hash, with the homepage's picker, dialogs and copy buttons.
export function initializeCalmItinerary(root: HTMLElement) {
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-calm-day]'));
  const dates = panels.map(panel => panel.dataset.calmDay!);
  const picker = document.querySelector<HTMLDialogElement>('#day-picker')!;
  const photoDialog = document.querySelector<HTMLDialogElement>('#photo-dialog')!;
  const copyDialog = document.querySelector<HTMLDialogElement>('#copy-dialog')!;
  const mobilePicker = document.querySelector<HTMLElement>('#mobile-picker')!;
  const dialogs = modalDialogs([picker, photoDialog, copyDialog]);
  const announce = statusAnnouncer(document.querySelector<HTMLElement>('#status')!);
  const photos = photoViewer(photoDialog, dialogs.open);
  const copyText = clipboardCopy(copyDialog, dialogs, announce);
  const panelFor = (date: string) => panels[dates.indexOf(date)];
  const heading = (date: string) => panelFor(date).querySelector<HTMLElement>('.day-title-row h2')!;
  // Day links live in the sidebar, the picker and the pagination; search results keep their own targets.
  const dayLinks = () => document.querySelectorAll<HTMLAnchorElement>('.day-sidebar [data-date], #day-picker [data-date]');
  let current = '';

  // `#2026-11-11` and in-day anchors such as `#day-transport-2026-11-11` both select their date.
  function dateFromHash() {
    const date = location.hash.match(/\d{4}-\d{2}-\d{2}$/)?.[0];
    if (date && dates.includes(date)) return date;
    return dates.includes(history.state?.date) ? history.state.date as string : dates[0];
  }
  function showDay(date: string, { push = false, scroll = false, announceChange = true } = {}) {
    if (!dates.includes(date)) return;
    current = date;
    if (push && location.hash !== `#${date}`) history.pushState({ date }, '', `#${date}`);
    const index = dates.indexOf(date);
    panels.forEach(panel => { panel.hidden = panel.dataset.calmDay !== date; });
    dayLinks().forEach(link => {
      if (link.dataset.date === date) link.setAttribute('aria-current', 'date');
      else link.removeAttribute('aria-current');
    });
    document.querySelectorAll<HTMLButtonElement>('.mobile-daybar [data-action="previous"]').forEach(button => { button.disabled = index === 0; });
    document.querySelectorAll<HTMLButtonElement>('.mobile-daybar [data-action="next"]').forEach(button => { button.disabled = index === dates.length - 1; });
    document.querySelector('#current-date')!.textContent = dayMonth.format(new Date(`${date}T12:00:00+08:00`));
    document.querySelector('#current-count')!.textContent = `Hari ${index + 1} dari ${dates.length}`;
    const titleSuffix = root.hasAttribute('data-home-itinerary') ? 'Musim Gugur di China' : 'Itinerary santai';
    document.title = `${heading(date).textContent} | ${fullDate(date)} | ${titleSuffix}`;
    if (scroll) panelFor(date).scrollIntoView({ block: 'start', behavior: 'instant' });
    if (announceChange) announce(`${fullDate(date)}. ${panelFor(date).querySelector('.sleep-summary strong')?.textContent ?? ''}.`);
  }

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const dayLink = event.target.closest<HTMLAnchorElement>('a[data-date]');
    if (dayLink && (root.contains(dayLink) || picker.contains(dayLink)) && !modified(event)) {
      event.preventDefault();
      const fromPicker = picker.contains(dayLink);
      const desktop = matchMedia('(min-width: 960px)').matches;
      if (picker.open) { dialogs.returnFocus.set(picker, desktop ? heading(dayLink.dataset.date!) : mobilePicker); picker.close(); }
      showDay(dayLink.dataset.date!, { push: true, scroll: true });
      if (!fromPicker || desktop) heading(current).focus({ preventScroll: true });
      return;
    }
    const button = event.target.closest<HTMLElement>('[data-action]');
    if (!button || (button instanceof HTMLButtonElement && button.disabled)) return;
    const action = button.dataset.action;
    if (action === 'skip') { event.preventDefault(); heading(current).focus(); }
    else if (action === 'transport' && !modified(event)) {
      event.preventDefault();
      const section = panelFor(current).querySelector<HTMLElement>('.day-transport');
      section?.scrollIntoView({ block: 'start', behavior: glide() });
      section?.focus({ preventScroll: true });
    }
    else if (action === 'pick-day') dialogs.open(picker, button);
    else if (action === 'close') button.closest('dialog')?.close();
    else if (action === 'previous' || action === 'next') {
      const next = dates[dates.indexOf(current) + (action === 'next' ? 1 : -1)];
      if (next) showDay(next, { push: true, scroll: true });
    }
    else if (action === 'photo') photos.openPlace(button);
    else if (action === 'user-photo') photos.openUser(button);
    else if (action === 'photo-previous' || action === 'photo-next') photos.step(action === 'photo-next' ? 1 : -1);
    else if (action === 'copy-place') {
      // Calm-only places are not in the main place list, so the button's own Chinese name is the source.
      const value = button.dataset.copy || button.querySelector('[lang="zh-Hans"]')?.textContent;
      if (value) void copyText(value, button, 'Nama Mandarin tersalin. Tempel di Amap.');
    }
    else if (action === 'share') {
      const url = new URL(location.href); url.hash = current;
      void copyText(url.href, button, 'Tautan hari ini tersalin.');
    }
  });
  const historyChanged = () => {
    const date = dateFromHash();
    if (date !== current) showDay(date, { scroll: true });
  };
  window.addEventListener('popstate', historyChanged);
  window.addEventListener('hashchange', historyChanged);
  showPhotoErrors();
  showDay(dateFromHash(), { scroll: /\d{4}-\d{2}-\d{2}$/.test(location.hash), announceChange: false });
  // Hands the panels from calm.css's :target rule to `hidden`; pushState does not move :target.
  root.dataset.ready = '';
}
