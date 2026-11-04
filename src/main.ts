import './style.css';
import './glass.css';
import './date-picker.css';
import './weather.css';
import { initializeWeather } from './weather.ts';
import './currency.css';
import './site-navigation.css';
import './destination-cards.css';
import './chengdu-evening.css';
import './stays.css';
import './route-map.css';
import './prepare.css';
import './costs.css';
import './calm.css';
import './overland.css';
import './site-search.css';
import { initializeCurrency } from './currency.ts';
import { initializeSiteNavigation } from './site-navigation.ts';
import { initializeSiteSearch } from './site-search.ts';
import { initializeGuide } from './guide-main.ts';
import { initializeRouteMap } from './route-map-main.ts';
import { initializePhotoLoading } from './photo-loading.ts';
import { updatePhotoContent } from './photo-viewer.ts';
import { days, daysByDate, places, userPhotos } from './itinerary.ts';
import { dayView, pickerItems, photoDetail, userPhotoDetail, overviewContent, icon, fullDate } from './render.ts';

function initializeItinerary() {
const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
let current = dateFromHash();
const dayRoot = $('#day-view');
const picker = $<HTMLDialogElement>('#day-picker');
const photoDialog = $<HTMLDialogElement>('#photo-dialog');
const photoCounter = $('#photo-count');
const photoNavigation = Array.from(photoDialog.querySelectorAll<HTMLButtonElement>('[data-action="photo-previous"], [data-action="photo-next"]'));
const userPhotoIds = Object.keys(userPhotos);
let userPhotoIndex: number | null = null;
const overview = $<HTMLDialogElement>('#overview-dialog');
const copyDialog = $<HTMLDialogElement>('#copy-dialog');
const returnFocus = new WeakMap<HTMLDialogElement, HTMLElement>();
let statusTimer: ReturnType<typeof setTimeout>;
const heroTrack = $('.hero-track');
const heroSlides = Array.from(document.querySelectorAll<HTMLElement>('.hero-slide'));
let heroIndex = 0;
heroTrack.addEventListener('scroll', () => {
  const index = Math.round(heroTrack.scrollLeft / heroTrack.clientWidth);
  if(index === heroIndex || !heroSlides[index]) return;
  heroIndex=index;
  heroSlides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===index);slide.inert=i!==index;});
  $('#hero-counter').textContent=`${index+1} / ${heroSlides.length}`;
}, {passive:true});
// In-page jumps glide unless the reader asked for reduced motion.
const glide = (): ScrollBehavior => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
function moveHero(direction: number) {
  const next=(heroIndex+direction+heroSlides.length)%heroSlides.length;
  heroTrack.scrollTo({left:next*heroTrack.clientWidth,behavior:glide()});
}

function dateFromHash() {
  const date = window.location.hash.slice(1);
  if (['itinerary', 'user-gallery', 'route'].includes(date) && daysByDate.has(history.state?.date)) return history.state.date as string;
  return daysByDate.has(date) ? date : days[0].date;
}
function announce(message: string) {
  clearTimeout(statusTimer);
  $('#status').textContent = message;
  statusTimer = setTimeout(() => { $('#status').textContent = ''; }, 4500);
}
function updateNavigation() {
  const day = daysByDate.get(current)!;
  const index = days.indexOf(day);
  document.querySelectorAll<HTMLAnchorElement>('[data-date]').forEach(link => {
    if (link.dataset.date === current) link.setAttribute('aria-current', 'date');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll<HTMLButtonElement>('[data-action="previous"]').forEach(b => { b.disabled = index === 0; });
  document.querySelectorAll<HTMLButtonElement>('[data-action="next"]').forEach(b => { b.disabled = index === days.length - 1; });
  $('#current-date').textContent = new Intl.DateTimeFormat('id-ID', {day:'numeric',month:'long',timeZone:'Asia/Shanghai'}).format(new Date(`${current}T12:00:00+08:00`));
  $('#current-count').textContent = `Hari ${index + 1} dari 14`;
  document.title = `${day.title} | ${fullDate(current)} | Musim Gugur di China`;
}
function showDay(date: string, { push = false, scroll = false, announceChange = true } = {}) {
  if (!daysByDate.has(date)) return;
  current = date;
  if (push && location.hash !== `#${date}`) history.pushState({date}, '', `#${date}`);
  dayRoot.innerHTML = dayView(daysByDate.get(date)!);
  initializeWeather(dayRoot);
  initializeCurrency(dayRoot);
  updateNavigation();
  if (scroll) dayRoot.scrollIntoView({block:'start', behavior:'instant'});
  if (announceChange) announce(`${fullDate(date)}. ${daysByDate.get(date)!.overnight ? `Menginap di ${daysByDate.get(date)!.overnight!.name}.` : 'Penerbangan pulang ke Jakarta.'}`);
}
function openDialog(dialog: HTMLDialogElement, opener: HTMLElement) {
  returnFocus.set(dialog, opener);
  dialog.showModal();
  document.documentElement.classList.add('dialog-open');
}
function openOverview(opener: HTMLElement, push = false) {
  $('#overview-content').innerHTML = overviewContent(current);
  if (push && location.hash !== '#route') history.pushState({date:current}, '', '#route');
  if (!overview.open) openDialog(overview, opener);
}
overview.addEventListener('close', () => {
  if (location.hash === '#route') history.replaceState({date:current}, '', `#${current}`);
});
function showUserPhoto(index: number) {
  userPhotoIndex = (index + userPhotoIds.length) % userPhotoIds.length;
  updatePhotoContent(photoDialog, userPhotoDetail(userPhotoIds[userPhotoIndex]));
  photoCounter.textContent = `${userPhotoIndex + 1} / ${userPhotoIds.length}`;
  photoNavigation.forEach(button => { button.hidden = false; button.disabled = userPhotoIds.length < 2; });
}
photoDialog.addEventListener('keydown', event => {
  if (userPhotoIndex === null || (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft')) return;
  event.preventDefault();
  showUserPhoto(userPhotoIndex + (event.key === 'ArrowRight' ? 1 : -1));
});
photoDialog.addEventListener('close', () => { userPhotoIndex = null; });
const dialogs = [picker,photoDialog,overview,copyDialog];
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
async function copyText(text: string, button: HTMLElement, success: string) {
  const original = button.innerHTML;
  button.setAttribute('aria-busy','true');
  try {
    await navigator.clipboard.writeText(text);
    button.innerHTML = `${icon('check')}<span>Tersalin</span>`;
    announce(success);
    setTimeout(() => { if(button.isConnected) button.innerHTML = original; },2200);
  } catch {
    const input = $<HTMLInputElement>('#manual-copy');
    input.value = text;
    const sourceDialog = button.closest('dialog');
    const opener = sourceDialog ? returnFocus.get(sourceDialog) ?? button : button;
    sourceDialog?.close();
    openDialog(copyDialog,opener);
    input.focus(); input.select();
  } finally { button.removeAttribute('aria-busy'); }
}
document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const dateLink = event.target.closest<HTMLAnchorElement>('[data-date]');
  if (dateLink && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    const date = dateLink.dataset.date!;
    const restoreTarget=matchMedia('(min-width: 960px)').matches?$('#day-heading'):$('#mobile-picker');
    if (picker.open) { returnFocus.set(picker,restoreTarget); picker.close(); }
    if (overview.open) { returnFocus.set(overview,restoreTarget); overview.close(); }
    showDay(date,{push:true,scroll:true});
    // The picker and overview return focus to the mobile picker on close; other links (the search dialog's) hand it to the day.
    if (!(picker.contains(dateLink) || overview.contains(dateLink)) || matchMedia('(min-width: 960px)').matches) $('#day-heading').focus({preventScroll:true});
    return;
  }
  const button = event.target.closest<HTMLElement>('[data-action]');
  if (!button || (button instanceof HTMLButtonElement && button.disabled)) return;
  const action = button.dataset.action;
  if (action === 'skip') { event.preventDefault(); $('#day-heading').focus(); }
  else if (action === 'transport' && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    const section = $('#day-transport');
    section.scrollIntoView({block:'start', behavior:glide()});
    section.focus({preventScroll:true});
  }
  else if ((action === 'itinerary' || action === 'gallery') && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    const target = action === 'gallery' ? $('#user-gallery') : $('#itinerary');
    if (target instanceof HTMLDetailsElement) target.open = true;
    if (location.hash !== `#${target.id}`) history.pushState({date:current}, '', `#${target.id}`);
    target.scrollIntoView({block:'start', behavior:glide()});
    target.querySelector<HTMLElement>('summary, h2')?.focus({preventScroll:true});
  }
  else if (action === 'hero-next') moveHero(1);
  else if (action === 'hero-previous') moveHero(-1);
  else if (action === 'region') {
    const section = document.getElementById(`region-${button.dataset.region?.toLowerCase()}`);
    section?.scrollIntoView({block:'start',behavior:glide()});
    section?.querySelector<HTMLElement>('h3')?.focus({preventScroll:true});
  }
  else if (action === 'pick-day') {
    $('#picker-days').innerHTML = pickerItems(current,'modal'); openDialog(picker,button);
  } else if (action === 'close') button.closest('dialog')?.close();
  else if (action === 'user-photo') {
    const index = userPhotoIds.indexOf(button.dataset.photo!);
    if (index < 0) return;
    showUserPhoto(index);
    openDialog(photoDialog,button);
  }
  else if (action === 'photo-previous' || action === 'photo-next') {
    if (userPhotoIndex !== null) showUserPhoto(userPhotoIndex + (action === 'photo-next' ? 1 : -1));
  }
  else if (action === 'overview' && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    openOverview(button, button instanceof HTMLAnchorElement);
  }
  else if (action === 'photo') {
    userPhotoIndex = null;
    photoCounter.textContent = '';
    photoNavigation.forEach(control => { control.hidden = true; });
    updatePhotoContent(photoDialog, photoDetail(button.dataset.place!));
    openDialog(photoDialog,button);
  }
  else if (action === 'previous' || action === 'next') {
    const index = days.findIndex(day => day.date === current) + (action === 'next' ? 1 : -1);
    if (days[index]) showDay(days[index].date,{push:true,scroll:true});
  } else if (action === 'copy-place') {
    const value = button.dataset.copy || places[button.dataset.place!]?.chinese;
    if (value) void copyText(value,button,'Nama Mandarin tersalin. Tempel di Amap.');
  } else if (action === 'share') {
    const url = new URL(location.href); url.hash = current;
    void copyText(url.href,button,'Tautan hari ini tersalin.');
  }
});
document.addEventListener('error', event => {
  if (!(event.target instanceof HTMLImageElement)) return;
  const image = event.target; image.hidden = true;
  const message = document.createElement('span'); message.className = 'photo-error';
  message.textContent = 'Foto belum termuat. Ketuk untuk melihat keterangan dan sumbernya.';
  image.parentElement?.append(message);
},true);
const historyChanged = () => {
  const date = dateFromHash();
  if (date !== current) showDay(date,{scroll:daysByDate.has(location.hash.slice(1))});
  if (location.hash === '#route') openOverview($('.site-navigation [data-action="overview"]'));
  else if (overview.open) overview.close();
  if (location.hash === '#user-gallery') $<HTMLDetailsElement>('#user-gallery').open = true;
};
window.addEventListener('popstate',historyChanged);
window.addEventListener('hashchange',historyChanged);
document.documentElement.classList.add('js');
showDay(current,{scroll:daysByDate.has(location.hash.slice(1)),announceChange:false});
if (location.hash === '#route') openOverview($('.site-navigation [data-action="overview"]'));

}

initializePhotoLoading();
if (document.getElementById('day-view')) initializeItinerary();
else initializeGuide();
initializeRouteMap();
initializeWeather();
initializeCurrency();
initializeSiteNavigation();
initializeSiteSearch();
document.documentElement.classList.add('js');
