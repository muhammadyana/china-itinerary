import { homeTop, icon, siteFooter } from './render.ts';
import { renderSiteNavigation } from './site-navigation.ts';
import { calmEarlyScript, homeItineraryChrome, homeItinerarySection } from './calm-itinerary.ts';

/** The homepage: the destination hero and gallery, then the calm option's days, which is the plan being travelled. */
export function homeView() {
  return `${calmEarlyScript}<a class="skip-link" href="#calm-itinerary-days" data-action="skip">Langsung ke jadwal</a><header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation('/')}</header>
  <main class="container">${homeTop()}${homeItinerarySection()}</main>
  ${siteFooter()}
  ${homeItineraryChrome()}`;
}
