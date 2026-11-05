import { days, places, pdfDownloadUrl, type Day } from './itinerary.ts';
import { coverPhoto, galleryPhotos, guideDates, guides, mainPlanGuides, pageBySlug, pageForPlace, placePath, type PlacePage } from './guides.ts';
import { escapeHtml as e, icon, photoImage, siteCredit, renderPhotoDialog, amapLink } from './render.ts';
import { renderWeather } from './weather.ts';
import { weatherLocationForGuide } from './weather-locations.ts';
import { currencyText, hasCnyAmount, renderExchangeRate } from './currency.ts';
import { renderSiteNavigation } from './site-navigation.ts';
import { amapIdsForPage } from './amap.ts';
import { CHENGDU_EVENING_DATE, renderChengduEvening } from './chengdu-evening.ts';
import { renderDestinationCard } from './destination-card.ts';
import { renderStaySummary } from './stays-render.ts';
import { external } from './guide-photo.ts';
import { calmItineraryPath, calmVisitDays, type CalmDay } from './calm-route.ts';

const shareButton = `<button type="button" class="guide-share" data-guide-action="share" hidden>${icon('share')}<span data-share-label aria-live="polite">Bagikan</span></button>`;
const shortDate = (date: string) => `${Number(date.slice(-2))} November`;
const fullDate = (date: string) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
// The day a page links to: its main-plan day, or the calm day for a place only the calm option visits.
interface Visit { date: string; title: string; overnight: { name: string } | null; href: string; label: string }
const mainVisit = (day: Day): Visit => ({ date: day.date, title: day.title, overnight: day.overnight, href: `/#${day.date}`, label: `Buka jadwal ${shortDate(day.date)}` });
const calmVisit = (day: CalmDay): Visit => ({ date: day.date, title: day.title, overnight: day.overnight, href: `${calmItineraryPath}#${day.date}`, label: `Buka jadwal santai ${shortDate(day.date)}` });

export function guideView(page: PlacePage) {
  const { guide } = page;
  const dates = guideDates(page);
  const revisionNotes = [...new Set(dates.flatMap(day => day.sourceNote ? [day.sourceNote] : []))];
  const names = page.placeId ? [page.placeId] : guide.placeIds;
  const guideMainDates = guideDates(pageBySlug.get(guide.slug)!);
  const visits = guideMainDates.length ? dates.map(mainVisit) : calmVisitDays(names).map(calmVisit);
  const date = visits[0] ?? mainVisit(guideMainDates[0] ?? days[0]);
  const photo = coverPhoto(page);
  const gallery = galleryPhotos(page);
  const description = page.placeId ? places[page.placeId].description : guide.summary;
  const publishedCost = guide.costs.find(cost => cost.status !== 'unconfirmed');
  const hasChinesePrices = guide.costs.some(cost => hasCnyAmount(cost.amount) || hasCnyAmount(cost.detail)) || guide.cautions.some(hasCnyAmount);
  const checked = fullDate(guide.checkedAt);
  const sourceTitle = (url: string) => guide.sources.find(source => source.url === url)?.title ?? new URL(url).hostname.replace(/^www\./, '');
  const sourceLinks = guide.gettingThere.sources.map(url => external(sourceTitle(url), url)).join('');
  const nearby = mainPlanGuides.filter(item => item.region === guide.region && item !== guide).slice(0, 4);
  return `<a class="skip-link" href="#guide-info">Langsung ke info praktis</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation()}</header>
  <main class="container guide-page" data-guide="${e(page.slug)}">
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="/places/#${guide.region.toLowerCase()}">${guide.region}</a>${page.placeId ? `${icon('right')}<a href="${placePath(guide.slug)}">${e(guide.name)}</a>` : ''}</nav>
    <section class="guide-hero ${photo ? '' : 'guide-hero-text'}" aria-labelledby="place-title">
      ${photo ? photoImage(photo.id, photo.alt, true, '(min-width: 1280px) 1200px, calc(100vw - 32px)') : ''}
      ${renderWeather(weatherLocationForGuide[guide.slug], `guide-${page.slug}`)}
      <div class="guide-hero-content"><h1 id="place-title">${e(page.name)}</h1><div class="guide-hero-meta"><span>${guide.region}</span><a href="${e(date.href)}">${icon('calendar')}${shortDate(date.date)}${icon('right')}</a>${gallery.length ? `<a href="#gallery">${icon('expand')}${gallery.length} foto</a>` : ''}${shareButton}</div></div>
    </section>
    ${photo?.note ? `<p class="guide-location-note">${e(photo.note)}</p>` : ''}
    <div class="guide-intro"><p>${e(description)}</p><a class="guide-date-link" href="${e(date.href)}">${icon('bed')}<span>${date.overnight ? `Malamnya di ${e(date.overnight.name)}` : 'Hari kepulangan'}<small>${e(date.label)}</small></span>${icon('right')}</a></div>
    <div class="guide-provenance"><a href="#sources">${icon('info')}Sumber & pembaruan</a><span>Riset diperiksa <time datetime="${e(guide.checkedAt)}">${checked}</time></span></div>
    <nav class="guide-section-nav glass-surface" aria-label="Bagian panduan"><a href="#getting-there">${icon('car')}Cara ke sana</a><a href="#costs">${icon('wallet')}Biaya</a><a href="#gallery">${icon('image')}Galeri</a><a href="#tips">${icon('bulb')}Tips</a></nav>
    ${guide.slug === 'chengdu' ? renderChengduEvening(CHENGDU_EVENING_DATE) : ''}
    <div class="guide-body" id="guide-info">
      <div class="guide-main-column">
        <section class="guide-panel" id="getting-there" aria-labelledby="transport-heading"><h2 id="transport-heading">${icon('pin')}Cara ke sana</h2><p class="guide-amap">${amapIdsForPage(page.slug).map((id, _, ids) => ids.length > 1 ? amapLink(id, places[id].name, true) : amapLink(id, page.name)).join('')}</p><p class="guide-origin">Dari ${e(guide.gettingThere.origin)}</p><ol class="guide-steps">${guide.gettingThere.steps.map(step => `<li>${e(step)}</li>`).join('')}</ol>${page.placeId && guide.stopAccess?.[page.placeId] ? `<div class="guide-last-leg"><h3>Menuju ${e(page.name)}</h3><p>${e(guide.stopAccess[page.placeId])}</p></div>` : ''}<p class="guide-duration">${icon('clock')}<span>${e(guide.gettingThere.duration)}</span></p><div class="guide-references"><h3>Sumber rute</h3><div>${sourceLinks}</div></div></section>
        <section class="guide-panel" id="costs" aria-labelledby="cost-heading"><h2 id="cost-heading">${icon('wallet')}Biaya kunjungan</h2>${page.placeId ? `<p class="guide-cost-context">Tarif kawasan ${e(guide.name)}. Tiket bersama tidak perlu dihitung ulang untuk tiap pemberhentian.</p>` : ''}<p class="guide-cost-note">Mata uang tercantum pada setiap harga. ${publishedCost ? 'Perhatikan komponen, musim, dan status harga.' : 'Tarif yang belum memiliki rujukan pasti ditandai untuk konfirmasi.'}</p>${hasChinesePrices ? renderExchangeRate() : ''}<dl class="guide-costs">${guide.costs.map(cost => `<div><dt>${e(cost.label)}<span class="cost-status ${cost.status}">${cost.status === 'published' ? 'Tarif terpublikasi' : cost.status === 'estimate' ? 'Anggaran acuan' : 'Perlu konfirmasi'}</span></dt><dd><strong>${currencyText(cost.amount)}</strong><p>${currencyText(cost.detail)}</p>${cost.source ? external(`Sumber tarif: ${sourceTitle(cost.source)}`, cost.source) : ''}</dd></div>`).join('')}</dl><p class="guide-checked">Diperiksa ${checked}. Harga dan operasional dapat berubah; cocokkan dengan tanggal kunjungan sebelum membayar.</p></section>
      </div>
      <aside class="guide-side-column" aria-label="Rencana kunjungan">
        <section class="guide-panel guide-timing" aria-labelledby="timing-heading"><h2 id="timing-heading">Rencanakan waktumu</h2><dl><div><dt>${icon('clock')}${page.placeId ? 'Waktu untuk kawasan' : 'Waktu di lokasi'}</dt><dd>${e(guide.visitDuration)}</dd></div><div><dt>${icon('sun')}Waktu terbaik</dt><dd>${e(guide.bestTime)}</dd></div></dl><p class="guide-editorial-note">Alokasi waktu adalah saran untuk itinerary ini. <a href="#sources">Rujukan jam buka & akses</a></p></section>
        <section class="guide-panel" id="tips" aria-labelledby="tips-heading"><h2 id="tips-heading">${icon('bulb')}Tips di lapangan</h2><ul class="guide-tips">${guide.tips.map(tip => `<li>${e(tip)}</li>`).join('')}</ul><p class="guide-editorial-note">Tips disusun untuk perjalanan ini. <a href="#sources">Rujukan aturan kawasan</a></p></section>
        ${guide.cautions.length ? `<section class="guide-panel guide-caution" aria-labelledby="caution-heading"><h2 id="caution-heading">${icon('info')}Sebelum berangkat</h2><ul class="guide-tips">${guide.cautions.map(caution => `<li>${currencyText(caution)}</li>`).join('')}</ul></section>` : ''}
      </aside>
    </div>
    <section class="place-gallery" id="gallery" aria-labelledby="place-gallery-heading"><div class="guide-section-heading"><h2 id="place-gallery-heading">Lihat lebih dekat.</h2><p>${gallery.length ? `${gallery.length} foto ${e(page.name)}. Ketuk untuk melihat foto utuh dan sumbernya.` : `Foto khusus ${e(page.name)} belum terverifikasi. Lihat deskripsi dan panduan kawasan di bawah.`}</p></div>${gallery.length ? `<div class="place-gallery-track">${gallery.map((item, index) => `<button class="place-gallery-item" type="button" data-gallery-index="${index}" aria-label="Perbesar foto ${index + 1}: ${e(item.title)}">${photoImage(item.id, item.alt, false, '(min-width: 960px) 580px, 85vw')}<span>${e(item.title)}${icon('expand')}</span>${item.note ? `<small>${e(item.note)}</small>` : ''}</button>`).join('')}</div><noscript><p class="no-script">Galeri tetap dapat dilihat. Pembesaran foto memerlukan JavaScript.</p></noscript>` : ''}</section>
    ${!page.placeId && guide.placeIds.length > 1 ? `<section class="guide-stop-index" aria-labelledby="guide-stops-heading"><h2 id="guide-stops-heading">Tempat dalam kawasan ini</h2><div class="guide-stop-links">${guide.placeIds.map(id => { const stop = places[id]; const target = pageForPlace.get(id); return target ? `<a href="${placePath(target.slug)}"><span><strong>${e(stop.name)}</strong>${stop.chinese ? `<small lang="zh-Hans">${e(stop.chinese)}</small>` : ''}</span>${icon('right')}</a>` : ''; }).join('')}</div></section>` : ''}
    ${guideMainDates.length ? renderStaySummary(date.date) : ''}
    <section class="guide-source-section" id="sources" aria-labelledby="sources-heading"><h2 id="sources-heading">Sumber & pembaruan</h2><p>Riset diperiksa <time datetime="${e(guide.checkedAt)}">${checked}</time>. Tanggal pemeriksaan berbeda dari tanggal terbit sumber. Tarif lama tetap diberi label acuan; harga tanpa bukti terbaru perlu dikonfirmasi.</p><ul>${guide.sources.map(source => `<li>${external(source.title, source.url)}<small>${source.kind === 'official' ? 'Pengelola / pemerintah' : source.kind === 'operator' ? 'Operator perjalanan' : 'Referensi tambahan'}${source.publishedAt ? ` — Terbit <time datetime="${e(source.publishedAt)}">${fullDate(source.publishedAt)}</time>` : ' — Tanggal terbit belum terverifikasi'}</small>${source.note ? `<p class="guide-source-note">${e(source.note)}</p>` : ''}</li>`).join('')}</ul><p>${guideMainDates.length ? 'PDF unduhan dibuat otomatis dari jadwal dan panduan di website. ' : ''}Waktu tempuh yang disebut sebagai alokasi itinerary adalah rencana perjalanan.</p>${revisionNotes.map(note => `<p>${e(note)}</p>`).join('')}<dl class="guide-place-names">${names.map(id => `<div><dt>${e(places[id].name)}</dt><dd${places[id].chinese ? ' lang="zh-Hans"' : ''}>${e(places[id].chinese ?? 'Cocokkan pin dengan sopir setempat.')}</dd></div>`).join('')}</dl>${guideMainDates.length ? `<p>${external('Unduh PDF itinerary terbaru', pdfDownloadUrl)}</p>` : ''}</section>
    <section class="guide-next"><div><h2>Lanjutkan perjalanan.</h2><p>Kembali ke tanggal kunjungan untuk melihat transportasi dan lokasi menginap.</p></div><div class="guide-visit-dates">${visits.map(visit => `<a class="quiet-button" href="${e(visit.href)}">${icon('calendar')}<span>${shortDate(visit.date)}<small>${e(visit.title)}</small></span>${icon('right')}</a>`).join('')}</div></section>
  </main>
  <footer class="container guide-footer"><a class="wordmark" href="/">${icon('mountain')}China 2026</a><nav aria-label="Destinasi lainnya">${nearby.map(item => `<a href="${placePath(item.slug)}">${e(item.name)}</a>`).join('')}</nav>${siteCredit()}</footer>
  ${renderPhotoDialog('guide')}`;
}

export function placesIndex() {
  return `<a class="skip-link" href="#places-title">Langsung ke daftar tempat</a><header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation()}</header><main class="container places-index"><h1 id="places-title">Tempat yang akan kita jelajahi.</h1><p class="lead">Cara ke sana, biaya, foto, dan bekal praktis untuk setiap pemberhentian wisata.</p>${(['Sichuan', 'Yunnan'] as const).map(region => `<section id="${region.toLowerCase()}"><h2>${region}</h2><div class="destination-index">${guides.filter(guide => guide.region === region).map(guide => renderDestinationCard(pageBySlug.get(guide.slug)!)).join('')}</div></section>`).join('')}</main><footer class="container guide-footer"><a href="/">Kembali ke itinerary 14 hari</a>${siteCredit()}</footer>`;
}
