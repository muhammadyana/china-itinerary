// The homepage's own controls: the hero slider, and the gallery, itinerary and region jumps from the hero and menu.
// The day panels below are wired by initializeCalmItinerary.
const glide = (): ScrollBehavior => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
const modified = (event: MouseEvent) => event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;

export function initializeHome() {
  const heroTrack = document.querySelector<HTMLElement>('.hero-track');
  if (!heroTrack) return;
  const heroSlides = Array.from(document.querySelectorAll<HTMLElement>('.hero-slide'));
  const counter = document.querySelector<HTMLElement>('#hero-counter');
  let heroIndex = 0;
  heroTrack.addEventListener('scroll', () => {
    const index = Math.round(heroTrack.scrollLeft / heroTrack.clientWidth);
    if (index === heroIndex || !heroSlides[index]) return;
    heroIndex = index;
    heroSlides.forEach((slide, i) => { slide.classList.toggle('is-active', i === index); slide.inert = i !== index; });
    if (counter) counter.textContent = `${index + 1} / ${heroSlides.length}`;
  }, { passive: true });
  const moveHero = (direction: number) => {
    const next = (heroIndex + direction + heroSlides.length) % heroSlides.length;
    heroTrack.scrollTo({ left: next * heroTrack.clientWidth, behavior: glide() });
  };
  const openGallery = () => {
    const gallery = document.querySelector<HTMLDetailsElement>('#user-gallery');
    if (gallery) gallery.open = true;
  };

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLElement>('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'hero-next') moveHero(1);
    else if (action === 'hero-previous') moveHero(-1);
    else if ((action === 'itinerary' || action === 'gallery') && !modified(event)) {
      const target = document.getElementById(action === 'gallery' ? 'user-gallery' : 'itinerary');
      if (!target) return;
      event.preventDefault();
      if (target instanceof HTMLDetailsElement) target.open = true;
      if (location.hash !== `#${target.id}`) history.pushState(history.state, '', `#${target.id}`);
      target.scrollIntoView({ block: 'start', behavior: glide() });
      target.querySelector<HTMLElement>('summary, h2')?.focus({ preventScroll: true });
    }
    else if (action === 'region') {
      const section = document.getElementById(`region-${button.dataset.region?.toLowerCase()}`);
      section?.scrollIntoView({ block: 'start', behavior: glide() });
      section?.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true });
    }
  });
  if (location.hash === '#user-gallery') openGallery();
  window.addEventListener('hashchange', () => { if (location.hash === '#user-gallery') openGallery(); });
}
