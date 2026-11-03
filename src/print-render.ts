import { bookingOptions, days, pdfPath, places, type Day, type Event } from './itinerary.ts';
import { guides, pageForPlace, placePath } from './guides.ts';
import { currencyText, renderExchangeRate } from './currency.ts';
import { escapeHtml as e, fullDate } from './render.ts';
import { CHENGDU_EVENING_DATE, renderChengduEvening } from './chengdu-evening.ts';

const siteOrigin = 'https://china.muhammadyana.me';
const sourceLink = (label: string, url: string) => `<a href="${e(url)}">${e(label)}</a>`;
const paragraph = (text: string) => `<p>${currencyText(text)}</p>`;
const list = (items: string[]) => `<ul>${items.map(item => `<li>${currencyText(item)}</li>`).join('')}</ul>`;
const transportNames: Record<Extract<Event, { kind: 'transfer' }>['mode'], string> = {
  car: 'Mobil', train: 'Kereta', bus: 'Bus', walk: 'Jalan kaki', plane: 'Pesawat', cable: 'Kereta gantung',
};

function printEvent(event: Event): string {
  if (event.kind === 'transfer') {
    return `<li class="print-transfer"><h3>${e(event.title)}</h3><p>${transportNames[event.mode]}</p>${event.status ? `<p class="print-status">${e(event.status)}</p>` : ''}${event.detail ? paragraph(event.detail) : ''}</li>`;
  }
  const place = places[event.place];
  const page = pageForPlace.get(event.place);
  return `<li class="print-stop"><div class="print-event-heading"><h3>${e(place.name)}</h3><span>${e(event.time)}</span></div>${place.chinese ? `<p lang="zh-Hans">${e(place.chinese)}</p>` : ''}${event.status ? `<p class="print-status">${e(event.status)}</p>` : ''}${paragraph(place.description)}${event.note ? paragraph(event.note) : ''}${page ? `<p class="print-guide-link">${sourceLink('Panduan tempat', `${siteOrigin}${placePath(page.slug)}`)}</p>` : ''}</li>`;
}

function printDay(day: Day, index: number): string {
  return `<section class="print-day" id="print-${day.date}" data-print-date="${day.date}">
    <header><p>Hari ${index + 1} dari ${days.length}</p><h2>${e(day.title)}</h2><p><time datetime="${day.date}">${e(fullDate(day.date))}</time></p></header>
    <dl class="print-essentials"><div><dt>${day.overnight ? 'Menginap' : 'Kepulangan'}</dt><dd>${day.overnight ? `${e(day.overnight.name)}<br>${e(day.overnight.area)}${day.overnight.elevation ? `<br>${e(day.overnight.elevation)}` : ''}` : 'Pulang ke Jakarta'}</dd></div><div><dt>Transportasi</dt><dd>${e(day.transport)}</dd></div></dl>
    ${paragraph(day.intro)}<p class="print-route">${day.route.map(e).join(' → ')}</p>
    <ol class="print-events">${day.events.map(printEvent).join('')}</ol>
    <section class="print-practical"><h3>Info praktis</h3>${day.practical.map(item => `<div><h4>${e(item.title)}</h4>${paragraph(item.text)}${item.copy ? `<p lang="zh-Hans">${e(item.copy)}</p>` : ''}${item.link ? `<p>${sourceLink(item.link.label, item.link.url)}</p>` : ''}</div>`).join('')}</section>
    ${day.overnight ? `<p class="print-night">${e(day.overnight.detail)}</p>` : ''}
    ${day.date === CHENGDU_EVENING_DATE ? renderChengduEvening() : ''}
    ${day.sourceNote ? `<p class="print-revision">${e(day.sourceNote)}</p>` : ''}
    <p>${sourceLink('Buka hari ini di website', `${siteOrigin}/#${day.date}`)}</p>
  </section>`;
}

function printGuides(): string {
  return `<section class="print-appendix" id="print-guides"><h2>Panduan tempat & sumber</h2><p>Informasi berikut berasal dari data panduan website pada saat PDF dibuat. Status tarif, tanggal pemeriksaan, dan sumber dipertahankan; tiket dan jadwal yang belum dikonfirmasi tetap perlu diperiksa.</p>
  ${guides.map(guide => `<article class="print-guide" data-print-guide="${e(guide.slug)}">
    <h3>${e(guide.name)}</h3><p>${sourceLink('Buka panduan lengkap', `${siteOrigin}${placePath(guide.slug)}`)}</p>${paragraph(guide.summary)}
    <h4>Cara ke sana</h4><p>Dari ${e(guide.gettingThere.origin)}</p><ol>${guide.gettingThere.steps.map(step => `<li>${currencyText(step)}</li>`).join('')}</ol>${paragraph(guide.gettingThere.duration)}
    <p><strong>Waktu di lokasi:</strong> ${e(guide.visitDuration)}<br><strong>Waktu terbaik:</strong> ${e(guide.bestTime)}</p>
    <h4>Biaya</h4><dl class="print-costs">${guide.costs.map(cost => `<div><dt>${e(cost.label)} <span>(${cost.status === 'published' ? 'Tarif terpublikasi' : cost.status === 'estimate' ? 'Anggaran acuan' : 'Perlu konfirmasi'})</span></dt><dd><strong>${currencyText(cost.amount)}</strong>${paragraph(cost.detail)}${cost.source ? sourceLink('Sumber tarif', cost.source) : ''}</dd></div>`).join('')}</dl>
    <h4>Tips di lapangan</h4>${list(guide.tips)}${guide.cautions.length ? `<h4>Sebelum berangkat</h4>${list(guide.cautions)}` : ''}
    <h4>Sumber & pembaruan</h4><p>Diperiksa <time datetime="${guide.checkedAt}">${e(guide.checkedAt)}</time>.</p><ul class="print-sources">${guide.sources.map(source => `<li>${sourceLink(source.title, source.url)}${source.publishedAt ? `<p>Terbit ${e(source.publishedAt)}.</p>` : '<p>Tanggal terbit belum terverifikasi.</p>'}${source.note ? paragraph(source.note) : ''}</li>`).join('')}</ul>
  </article>`).join('')}</section>`;
}

export function renderPrintDocument(styles: string, stylesheetLinks: string, generatedAt: string): string {
  const generatedLabel = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(generatedAt));
  const nights = days.filter(day => day.overnight).length;
  const content = `<header class="print-cover"><p class="print-credit">© @muhammad_yana</p><h1>Musim Gugur di China</h1><p>Sichuan & Yunnan<br>8–21 November 2026<br>${days.length} hari, ${nights} malam</p><p>PDF dibuat otomatis dari itinerary website pada ${e(generatedLabel)} WIB. Revisi website menjadi acuan perjalanan; PDF sumber awal disimpan sebagai arsip.</p><p>${sourceLink('china.muhammadyana.me', siteOrigin)}</p>${renderExchangeRate()}<p>Perkiraan rupiah memakai kurs tersimpan yang tercantum di atas. PDF tidak mengambil kurs atau cuaca langsung saat dicetak.</p></header>
    <section class="print-overview"><h2>Ringkasan perjalanan</h2><table><thead><tr><th>Tanggal</th><th>Rencana</th><th>Malam</th></tr></thead><tbody>${days.map(day => `<tr><td><a href="#print-${day.date}">${Number(day.date.slice(-2))} November</a></td><td>${e(day.title)}</td><td>${e(day.overnight?.name ?? 'Pulang')}</td></tr>`).join('')}</tbody></table></section>
    ${days.map(printDay).join('')}
    ${printGuides()}
    <section class="print-booking"><h2>Rujukan transportasi</h2>${bookingOptions.map(option => `<article><h3>${e(option.title)}</h3>${paragraph(option.description)}<p>${sourceLink('Buka penyedia', option.url)}</p></article>`).join('')}</section>
    <footer class="print-credit">© @muhammad_yana</footer>`;
  const absoluteContent = content.replace(/href="\/(?!\/)([^"]*)"/g, `href="${siteOrigin}/$1"`);
  return `<!doctype html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta name="itinerary-pdf-path" content="${e(pdfPath)}"><meta name="itinerary-day-count" content="${days.length}"><meta name="itinerary-generated-at" content="${e(generatedAt)}"><meta name="description" content="Versi cetak itinerary website Sichuan dan Yunnan selama 14 hari."><title>Itinerary Sichuan & Yunnan, 8–21 November 2026</title><link rel="icon" href="data:,">${stylesheetLinks}<style>${styles}</style></head><body class="print-document"><main>${absoluteContent}</main></body></html>`;
}
