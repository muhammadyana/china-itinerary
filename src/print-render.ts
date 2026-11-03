import { bookingOptions, days, highlights, pdfPath, photos, places, userPhotos, type Day, type Event, type Photo, type UserPhoto } from './itinerary.ts';
import { coverPhoto, guides, pageBySlug, pageForPlace, placePath } from './guides.ts';
import { currencyText, renderExchangeRate } from './currency.ts';
import { escapeHtml as e, fullDate, icon } from './render.ts';
import { CHENGDU_EVENING_DATE, renderChengduEvening } from './chengdu-evening.ts';

const siteOrigin = 'https://china.muhammadyana.me';
const COVER_PHOTO_ID = 'highlight-jiuzhaigou';
// Rendition targets by printed size; ops/generate-pdf.mjs then resamples each image to its printed box.
const RENDITION = { cover: 1600, band: 1440, guideBand: 960, thumbnail: 480 } as const;
const MAX_PRINTED_URL = 56;
// Visual-check override: the rule picks the TFU terminal interior, a weak opener for the Chengdu evening walk.
const leadOverrides: Record<string, string> = { '2026-11-08': 'chengdu' };
const sourceLink = (label: string, url: string) => `<a href="${e(url)}">${e(label)}</a>`;
const paragraph = (text: string) => `<p>${currencyText(text)}</p>`;
const list = (items: string[]) => `<ul>${items.map(item => `<li>${currencyText(item)}</li>`).join('')}</ul>`;
const transportNames: Record<Extract<Event, { kind: 'transfer' }>['mode'], string> = {
  car: 'Mobil', train: 'Kereta', bus: 'Bus', walk: 'Jalan kaki', plane: 'Pesawat', cable: 'Kereta gantung',
};
const costStatus = { published: 'Tarif terpublikasi', estimate: 'Anggaran acuan', unconfirmed: 'Perlu konfirmasi' } as const;
const indexDate = (date: string) => new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Shanghai' }).format(new Date(`${date}T12:00:00+08:00`));
const twoDigits = (value: number) => String(value).padStart(2, '0');

type PrintPhoto = Photo | UserPhoto;
const photoById = (id: string): PrintPhoto | undefined => photos[id] ?? userPhotos[id];
// Stops only show catalogued place photos, matching the website timeline.
const placePhoto = (placeId: string) => {
  const id = places[placeId].photo;
  return id && photos[id] ? photos[id] : undefined;
};

/** Records every embedded photograph so the credits appendix lists each one exactly once. */
function createPhotoLedger() {
  const labels = new Map<string, string[]>();
  return {
    image(id: string, alt: string, target: number, label: string): string {
      const photo = photoById(id);
      if (!photo) return '';
      const known = labels.get(id) ?? [];
      labels.set(id, known.includes(label) ? known : [...known, label]);
      const width = photo.sizes.find(size => size >= target) ?? photo.sizes[photo.sizes.length - 1];
      return `<img src="/photos/${id}-${width}.webp" width="${photo.width}" height="${photo.height}" alt="${e(alt)}">`;
    },
    entries: () => [...labels],
  };
}
type PhotoLedger = ReturnType<typeof createPhotoLedger>;

/** Lead photo: landscape first, then the widest available rendition; ties keep the earliest stop. */
function leadPlace(day: Day): string | undefined {
  if (leadOverrides[day.date]) return leadOverrides[day.date];
  const isLandscape = (photo: Photo) => photo.width > photo.height;
  const widest = (photo: Photo) => photo.sizes[photo.sizes.length - 1];
  const beats = (candidate: Photo, best: Photo) => isLandscape(candidate) !== isLandscape(best) ? isLandscape(candidate) : widest(candidate) > widest(best);
  const candidates = day.events.flatMap(event => event.kind === 'stop' && placePhoto(event.place) ? [event.place] : []);
  return candidates.reduce<string | undefined>((best, placeId) => best === undefined || beats(placePhoto(placeId)!, placePhoto(best)!) ? placeId : best, undefined);
}

function photoCaption(text?: string) {
  return text ? `<p class="print-photo-note">${e(text)}</p>` : '';
}

function printTransfer(event: Extract<Event, { kind: 'transfer' }>): string {
  return `<li class="print-transfer"><p class="print-transfer-line"><span class="print-mode">${icon(event.mode)}${transportNames[event.mode]}</span><strong>${e(event.title)}</strong>${event.status ? `<span class="print-status">${e(event.status)}</span>` : ''}</p>${event.detail ? `<p class="print-transfer-detail">${currencyText(event.detail)}</p>` : ''}</li>`;
}

function printStop(event: Extract<Event, { kind: 'stop' }>, sequence: number, photoSide: 'left' | 'right' | undefined, ledger: PhotoLedger): string {
  const place = places[event.place];
  const page = pageForPlace.get(event.place);
  const figure = photoSide
    ? `<figure class="print-stop-photo">${ledger.image(place.photo!, place.alt || place.name, RENDITION.thumbnail, place.name)}${place.photoNote ? `<figcaption>${e(place.photoNote)}</figcaption>` : ''}</figure>`
    : '';
  const classes = ['print-stop', photoSide ? `print-with-photo print-photo-${photoSide}` : 'print-text-stop'].join(' ');
  return `<li class="${classes}"><div class="print-stop-text"><p class="print-stop-meta"><span class="print-sequence" aria-label="Pemberhentian ${sequence}">${twoDigits(sequence)}</span><span class="print-time">${e(event.time)}</span>${event.status ? `<span class="print-status">${e(event.status)}</span>` : ''}</p><h3>${e(place.name)}</h3>${place.chinese ? `<p class="print-chinese" lang="zh-Hans">${e(place.chinese)}</p>` : ''}<p class="print-description">${currencyText(place.description)}</p>${event.note ? `<p class="print-note">${currencyText(event.note)}</p>` : ''}${page ? `<p class="print-guide-link">${sourceLink('Panduan tempat', `${siteOrigin}${placePath(page.slug)}`)}</p>` : ''}</div>${figure}</li>`;
}

function printEvents(day: Day, lead: string | undefined, ledger: PhotoLedger): string {
  let sequence = 0;
  let photoStops = 0;
  return day.events.map(event => {
    if (event.kind === 'transfer') return printTransfer(event);
    sequence += 1;
    const showsPhoto = event.place !== lead && placePhoto(event.place) !== undefined;
    const side = showsPhoto ? (photoStops++ % 2 === 0 ? 'right' : 'left') : undefined;
    return printStop(event, sequence, side, ledger);
  }).join('');
}

function printDayHeader(day: Day, index: number, lead: string | undefined, ledger: PhotoLedger): string {
  const meta = `<span class="print-day-count">Hari ${index + 1} dari ${days.length}</span><time datetime="${day.date}">${e(fullDate(day.date))}</time>`;
  if (!lead) return `<header class="print-day-header"><p class="print-day-meta">${meta}</p><h2>${e(day.title)}</h2></header>`;
  const place = places[lead];
  return `<header class="print-day-header"><figure class="print-band">${ledger.image(place.photo!, place.alt || place.name, RENDITION.band, place.name)}<figcaption><span class="print-band-meta">${meta}</span><span class="print-band-place">${e(place.name)}</span></figcaption></figure>${photoCaption(place.photoNote)}<h2>${e(day.title)}</h2></header>`;
}

function printEssentials(day: Day): string {
  const stay = day.overnight
    ? `<dt>${icon('bed')}Menginap</dt><dd><strong>${e(day.overnight.name)}</strong><span>${e(day.overnight.area)}</span>${day.overnight.elevation ? `<span class="print-elevation">${e(day.overnight.elevation)}</span>` : ''}</dd>`
    : `<dt>${icon('plane')}Kepulangan</dt><dd><strong>Pulang ke Jakarta</strong></dd>`;
  return `<dl class="print-essentials"><div>${stay}</div><div><dt>${icon('train')}Transportasi</dt><dd>${e(day.transport)}</dd></div></dl>`;
}

function printDay(day: Day, index: number, ledger: PhotoLedger): string {
  const lead = leadPlace(day);
  return `<section class="print-day" id="print-${day.date}" data-print-date="${day.date}">
    ${printDayHeader(day, index, lead, ledger)}
    ${printEssentials(day)}
    <p class="print-intro">${currencyText(day.intro)}</p><ol class="print-route" aria-label="Rute hari ini">${day.route.map((stop, i) => `<li>${i ? icon('right') : ''}<span>${e(stop)}</span></li>`).join('')}</ol>
    <ol class="print-events">${printEvents(day, lead, ledger)}</ol>
    <section class="print-practical"><h3>Info praktis</h3><div class="print-practical-grid">${day.practical.map(item => `<div><h4>${e(item.title)}</h4>${paragraph(item.text)}${item.copy ? `<p lang="zh-Hans">${e(item.copy)}</p>` : ''}${item.link ? `<p>${sourceLink(item.link.label, item.link.url)}</p>` : ''}</div>`).join('')}</div></section>
    ${day.overnight ? `<p class="print-night">${icon('bed')}<span>${e(day.overnight.detail)}</span></p>` : ''}
    ${day.date === CHENGDU_EVENING_DATE ? renderChengduEvening() : ''}
    ${day.sourceNote ? `<p class="print-revision">${e(day.sourceNote)}</p>` : ''}
    <p class="print-day-link">${sourceLink('Buka hari ini di website', `${siteOrigin}/#${day.date}`)}</p>
  </section>`;
}

function printIndex(ledger: PhotoLedger): string {
  return `<section class="print-overview" aria-labelledby="print-overview-heading"><h2 id="print-overview-heading">Ringkasan perjalanan</h2><ol class="print-index">${days.map((day, index) => {
    const lead = leadPlace(day);
    const place = lead ? places[lead] : undefined;
    const thumbnail = place ? ledger.image(place.photo!, place.alt || place.name, RENDITION.thumbnail, place.name) : '';
    return `<li><a href="#print-${day.date}"><span class="print-index-number">${twoDigits(index + 1)}</span><span class="print-index-copy"><time datetime="${day.date}">${e(indexDate(day.date))}</time><strong>${e(day.title)}</strong><span>${day.overnight ? `Menginap di ${e(day.overnight.name)}` : 'Pulang ke Jakarta'}</span></span>${thumbnail}</a></li>`;
  }).join('')}</ol></section>`;
}

function printGuides(ledger: PhotoLedger): string {
  return `<section class="print-appendix" id="print-guides"><h2>Panduan tempat & sumber</h2><p class="print-section-intro">Informasi berikut berasal dari data panduan website pada saat PDF dibuat. Status tarif, tanggal pemeriksaan, dan sumber dipertahankan; tiket dan jadwal yang belum dikonfirmasi tetap perlu diperiksa.</p>
  ${guides.map(guide => {
    const cover = coverPhoto(pageBySlug.get(guide.slug)!);
    const image = cover ? ledger.image(cover.id, cover.alt, RENDITION.guideBand, `Panduan ${guide.name}`) : '';
    return `<article class="print-guide" data-print-guide="${e(guide.slug)}">
    <header class="print-guide-header${image ? ' print-with-photo' : ''}">${image}<h3>${e(guide.name)}</h3></header>
    <div class="print-guide-lead">${paragraph(guide.summary)}<p>${sourceLink('Buka panduan lengkap', `${siteOrigin}${placePath(guide.slug)}`)}</p></div>
    <div class="print-guide-body">
    <h4>Cara ke sana</h4><p>Dari ${e(guide.gettingThere.origin)}</p><ol>${guide.gettingThere.steps.map(step => `<li>${currencyText(step)}</li>`).join('')}</ol>${paragraph(guide.gettingThere.duration)}
    <p><strong>Waktu di lokasi:</strong> ${e(guide.visitDuration)}<br><strong>Waktu terbaik:</strong> ${e(guide.bestTime)}</p>
    <h4>Biaya</h4><dl class="print-costs">${guide.costs.map(cost => `<div><dt>${e(cost.label)} <span>(${costStatus[cost.status]})</span></dt><dd><strong>${currencyText(cost.amount)}</strong>${paragraph(cost.detail)}${cost.source ? sourceLink('Sumber tarif', cost.source) : ''}</dd></div>`).join('')}</dl>
    <h4>Tips di lapangan</h4>${list(guide.tips)}${guide.cautions.length ? `<h4>Sebelum berangkat</h4>${list(guide.cautions)}` : ''}
    <h4>Sumber & pembaruan</h4><p>Diperiksa <time datetime="${guide.checkedAt}">${e(guide.checkedAt)}</time>.</p><ul class="print-sources">${guide.sources.map(source => `<li>${sourceLink(source.title, source.url)}${source.publishedAt ? `<p>Terbit ${e(source.publishedAt)}.</p>` : '<p>Tanggal terbit belum terverifikasi.</p>'}${source.note ? paragraph(source.note) : ''}</li>`).join('')}</ul>
    </div>
  </article>`;
  }).join('')}</section>`;
}

function creditEntry(id: string, labels: string[]): string {
  const photo = photoById(id)!;
  const title = `<p class="print-photo-credit-title">${e(labels.join(', '))}</p>`;
  if (!('author' in photo)) {
    return `<li data-credit-photo="${e(id)}">${title}<p>${e(photo.credit)}</p><p>Asal: ${e(photo.origin)}. Foto dikirim dan disetujui pengguna untuk halaman ini; tanggal pengambilan tidak dicantumkan.</p></li>`;
  }
  const origin = photo.origin === 'PDF' ? 'materi dokumen pengguna dari PDF sumber arsip, bukan foto lapangan yang baru diverifikasi' : photo.origin;
  return `<li data-credit-photo="${e(id)}">${title}<p>Foto: ${e(photo.author)}</p><p>Lisensi: ${sourceLink(photo.license, photo.licenseUrl)}</p><p>${sourceLink('Sumber foto', photo.source)}</p><p>Asal: ${e(origin)}</p>${photo.photoNote ? `<p class="print-photo-note">${e(photo.photoNote)}</p>` : ''}</li>`;
}

function printCredits(ledger: PhotoLedger): string {
  return `<section class="print-photo-credits" id="print-photo-credits"><h2>Kredit foto</h2><p class="print-section-intro">Setiap foto dalam PDF ini tercantum sekali di bawah. Ukuran foto disesuaikan dan dipotong mengikuti bingkai cetak; lisensi asal tetap berlaku. Foto menggambarkan tempat, bukan jaminan cuaca atau akses saat kunjungan.</p><ol>${ledger.entries().map(([id, labels]) => creditEntry(id, labels)).join('')}</ol></section>`;
}

function printCover(ledger: PhotoLedger): string {
  const highlight = highlights.find(item => item.photo === COVER_PHOTO_ID);
  const nights = days.filter(day => day.overnight).length;
  const image = ledger.image(COVER_PHOTO_ID, highlight?.alt ?? 'Musim gugur di Jiuzhaigou', RENDITION.cover, `Sampul: ${highlight?.title ?? 'Jiuzhaigou'}`);
  return `<header class="print-cover">${image}<div class="print-cover-copy"><h1>Musim Gugur di China</h1><p class="print-cover-meta">Sichuan & Yunnan · 8–21 November 2026 · ${days.length} hari, ${nights} malam</p><p class="print-credit">© @muhammad_yana</p></div></header>`;
}

function printColophon(generatedLabel: string): string {
  return `<section class="print-colophon" aria-label="Tentang PDF ini"><div><p>PDF dibuat otomatis dari itinerary website pada ${e(generatedLabel)} WIB. Revisi website menjadi acuan perjalanan; PDF sumber awal disimpan sebagai arsip.</p><p>${sourceLink('china.muhammadyana.me', siteOrigin)}</p></div><div>${renderExchangeRate()}<p>Perkiraan rupiah memakai kurs tersimpan yang tercantum di atas. PDF tidak mengambil kurs atau cuaca langsung saat dicetak.</p></div></section>`;
}

function readablePath(pathname: string): string {
  try {
    return decodeURI(pathname);
  } catch {
    return pathname; // Malformed escapes stay encoded; the href is unchanged either way.
  }
}

/** Short, protocol-free label printed after external links; the full address stays in href. */
function printedUrl(href: string): string {
  const url = new URL(href.replaceAll('&amp;', '&'));
  const text = `${url.hostname.replace(/^www\./, '')}${url.pathname === '/' ? '' : readablePath(url.pathname)}${url.hash}`;
  return text.length > MAX_PRINTED_URL ? `${text.slice(0, MAX_PRINTED_URL - 1)}…` : text;
}

export function renderPrintDocument(styles: string, stylesheetLinks: string, generatedAt: string): string {
  const generatedLabel = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(generatedAt));
  const ledger = createPhotoLedger();
  const body = `${printCover(ledger)}
    ${printColophon(generatedLabel)}
    ${printIndex(ledger)}
    ${days.map((day, index) => printDay(day, index, ledger)).join('')}
    ${printGuides(ledger)}
    <section class="print-booking"><h2>Rujukan transportasi</h2>${bookingOptions.map(option => `<article><h3>${e(option.title)}</h3>${paragraph(option.description)}<p>${sourceLink('Buka penyedia', option.url)}</p></article>`).join('')}</section>`;
  // Credits render last so the ledger already holds every photograph above.
  const content = `${body}${printCredits(ledger)}<footer class="print-credit">© @muhammad_yana</footer>`;
  const absoluteContent = content
    .replace(/href="\/(?!\/)([^"]*)"/g, `href="${siteOrigin}/$1"`)
    .replace(/<a\b([^>]*?)\shref="(https?:\/\/[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (match, before: string, href: string, after: string, label: string) => {
      const printed = printedUrl(href);
      // Skip the printed address when the link text already shows it.
      return label.replace(/<[^>]*>/g, '').trim() === printed ? match : `<a${before} href="${href}" data-print-url="${e(printed)}"${after}>${label}</a>`;
    });
  return `<!doctype html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta name="itinerary-pdf-path" content="${e(pdfPath)}"><meta name="itinerary-day-count" content="${days.length}"><meta name="itinerary-generated-at" content="${e(generatedAt)}"><meta name="description" content="Versi cetak itinerary website Sichuan dan Yunnan selama 14 hari."><title>Itinerary Sichuan & Yunnan, 8–21 November 2026</title><link rel="icon" href="data:,">${stylesheetLinks}<style>${styles}</style></head><body class="print-document"><main>${absoluteContent}</main></body></html>`;
}
