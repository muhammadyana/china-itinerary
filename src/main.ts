import './style.css';
import './glass.css';
import { initializeGuide } from './guide-main.ts';
import { days, daysByDate, places } from './itinerary.ts';
import { dayView, pickerItems, photoDetail, userPhotoDetail, overviewContent, icon, fullDate } from './render.ts';

function initializeItinerary() {
const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
let current = dateFromHash();
const dayRoot = $('#day-view');
const picker = $<HTMLDialogElement>('#day-picker');
const photoDialog = $<HTMLDialogElement>('#photo-dialog');
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
function moveHero(direction: number) {
  const next=(heroIndex+direction+heroSlides.length)%heroSlides.length;
  heroTrack.scrollTo({left:next*heroTrack.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}

function dateFromHash() {
  const date = window.location.hash.slice(1);
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
  updateNavigation();
  if (scroll) dayRoot.scrollIntoView({block:'start', behavior:'instant'});
  if (announceChange) announce(`${fullDate(date)}. ${daysByDate.get(date)!.overnight ? `Menginap di ${daysByDate.get(date)!.overnight!.name}.` : 'Penerbangan pulang ke Jakarta.'}`);
}
function openDialog(dialog: HTMLDialogElement, opener: HTMLElement) {
  returnFocus.set(dialog, opener);
  dialog.showModal();
  document.documentElement.classList.add('dialog-open');
}
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
    if (!dateLink.closest('dialog') || matchMedia('(min-width: 960px)').matches) $('#day-heading').focus({preventScroll:true});
    return;
  }
  const button = event.target.closest<HTMLElement>('[data-action]');
  if (!button || (button instanceof HTMLButtonElement && button.disabled)) return;
  const action = button.dataset.action;
  if (action === 'skip') { event.preventDefault(); $('#day-heading').focus(); }
  else if (action === 'hero-next') moveHero(1);
  else if (action === 'hero-previous') moveHero(-1);
  else if (action === 'region') {
    const section = document.getElementById(`region-${button.dataset.region?.toLowerCase()}`);
    section?.scrollIntoView({block:'start',behavior:'instant'});
    section?.querySelector<HTMLElement>('h3')?.focus({preventScroll:true});
  }
  else if (action === 'pick-day') {
    $('#picker-days').innerHTML = pickerItems(current,'modal'); openDialog(picker,button);
  } else if (action === 'close') button.closest('dialog')?.close();
  else if (action === 'gallery') { const gallery=$<HTMLDetailsElement>('#user-gallery'); gallery.open=true; gallery.scrollIntoView({block:'start',behavior:'instant'}); $('#gallery-heading').focus({preventScroll:true}); }
  else if (action === 'user-photo') { $('#photo-content').innerHTML=userPhotoDetail(button.dataset.photo!); openDialog(photoDialog,button); }
  else if (action === 'overview') { $('#overview-content').innerHTML = overviewContent(current); openDialog(overview,button); }
  else if (action === 'photo') { $('#photo-content').innerHTML = photoDetail(button.dataset.place!); openDialog(photoDialog,button); }
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
const historyChanged = () => { const date = dateFromHash(); if(date !== current) showDay(date,{scroll:true}); };
window.addEventListener('popstate',historyChanged);
window.addEventListener('hashchange',historyChanged);
document.documentElement.classList.add('js');
showDay(current,{scroll:daysByDate.has(location.hash.slice(1)),announceChange:false});

}

if (document.getElementById('day-view')) initializeItinerary();
else initializeGuide();
document.documentElement.classList.add('js');
