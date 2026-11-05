import { escapeHtml as e, icon, siteCredit, dayBookings } from './render.ts';
import { currencyText, renderExchangeRate } from './currency.ts';
import { renderSiteNavigation } from './site-navigation.ts';
import { preparePath } from './bookings.ts';
import {
  bookingRules, checkedOn, diqingHospital, doneList, ganziHospitalSource, link, list, mainBookingCard, planSections, prepareSources, section, sourcesSection, urgencySections,
  type BookingCard, type PlanNotes,
} from './prepare.ts';
import {
  calmBookingGroups, calmCheckedAt, calmDays, calmDoNotBuy, calmDoNotBuyLead, calmItineraryPath, calmPath, calmSources, type CalmBooking,
} from './calm-route.ts';

// The calm option's own bookings from calm-route.ts, plus the main plan's bookings for the days the two plans share.
export const calmCard = (item: CalmBooking, id?: string): BookingCard => ({
  date: item.date, until: item.until, title: item.item, urgency: item.urgency, link: item.link, id,
  facts: [['Harga', currencyText(item.price)], ['Cara pesan', currencyText(item.channel)], ['Dibuka', currencyText(item.opens)]],
});
const covers = (item: CalmBooking, date: string) => item.date <= date && date <= (item.until ?? item.date);
const stayItems = calmBookingGroups.filter(group => group.id === 'stays').flatMap(group => group.items);
/** The calm stay booked for a night, and the id its card carries on the calm preparation page. */
export const calmStayFor = (date: string) => stayItems.find(item => covers(item, date));
export const stayCardId = (item: CalmBooking) => `stay-${item.date}`;
/** Tickets and transport for one calm-only date; stays have their own link in the day header, as on the homepage.
 * A ticket or car with `until` is two one-way trips (the Maoxian–Bipenggou car), so it shows on those two dates only. */
export const calmDayBookings = (date: string) => calmBookingGroups.filter(group => group.id !== 'stays').flatMap(group => group.items.filter(item => item.date === date || item.until === date));

const sharedDates = calmDays.filter(day => day.fromMain).map(day => day.date);
// The main plan's own items for the shared dates: the same transport and ticket rows its day panels list.
const sharedBookings = [...new Set(sharedDates.flatMap(dayBookings))];
const calmCards = () => [
  ...sharedBookings.map(mainBookingCard),
  ...calmBookingGroups.flatMap(group => group.items.map(item => calmCard(item, group.id === 'stays' ? stayCardId(item) : undefined))),
].sort((a, b) => a.date.localeCompare(b.date));

// The route-specific lines of the shared sections, from the calm research (calm-route.ts) and the main plan's 19 November.
const calmPlanNotes: PlanNotes = {
  cash: 'Bawa uang tunai cadangan untuk kota kecil di Aba; belum ada data penerimaan kartu di Songpan atau Bipenggou. ATM Bank of China menerima Visa dan Mastercard, maksimal CNY 3000 per penarikan.',
  signal: '',
  hospitals: [diqingHospital],
  altitude: 'Rute ini naik ke Yanziyan 3.837 m di Bipenggou, tidur dua malam di Shangri-La 3.300 m, dan naik ke gletser Jade Dragon pada 19 November.',
  ascent: 'Malam 16 November naik sekitar 900 m dari Lijiang ke Shangri-La, jadi sore itu dibuat ringan dan 17 November santai.',
};

const pageLink = (url: string, label: string) => link({ url, label });

function intro() {
  return `<div class="prepare-intro">
      <h1 id="prepare-title">Persiapan opsi santai, satu halaman.</h1>
      <p class="lead">Kalau memilih opsi santai: yang sudah beres, yang harus dipesan beserta jam bukanya, cara tetap online, dan nomor penting. Diperiksa <time datetime="${calmCheckedAt}">4–5 November 2026</time>.</p>
      <p class="prepare-link calm-page-links">${pageLink(calmItineraryPath, 'Itinerary santai, hari demi hari')}${pageLink(calmPath, 'Bandingkan dengan rencana utama')}</p>
      ${doneList()}
    </div>`;
}

const bookingsSection = () => section('bookings', 'Pesan dan kapan', `<p class="prepare-section-lead">${bookingRules} Pemesanan 8 dan 18–21 November sama dengan rencana utama; 9–17 November dari riset opsi santai.</p>
      <p class="prepare-link">${pageLink(`${preparePath}#bookings`, 'Pemesanan rencana utama')}</p>
      ${urgencySections(calmCards())}`);

const doNotBuySection = () => section('do-not-buy', 'Jangan dibeli kalau pilih opsi ini', `<p class="prepare-section-lead">${e(calmDoNotBuyLead)}</p>${list(calmDoNotBuy.map(currencyText))}`);

// Costs stay uncomputed: most car and hotel prices for the new dates are still unknown.
const costsSection = () => section('costs', 'Perkiraan biaya', `<p class="prepare-section-lead">Rincian biaya belum dihitung untuk opsi santai: harga semua mobil dan hotel untuk tanggal-tanggal baru belum diketahui.</p>
      <p class="prepare-link">${pageLink(`${calmPath}#unknowns`, 'Yang belum diketahui')}</p>
      ${renderExchangeRate()}`);

// The calm page shows no Ganzi hospital, so it drops that source.
const sources = () => sourcesSection(`Opsi santai diperiksa ${checkedOn(calmCheckedAt)}; bagian umum serta 8 dan 18–21 November memakai sumber rencana utama, diperiksa 4 November 2026. Harga, jam rilis dan aturan dapat berubah; ikuti pengumuman resmi saat memesan.`, [...calmSources, ...prepareSources.filter(source => source !== ganziHospitalSource)]);

export function calmPrepareView() {
  return `<a class="skip-link" href="#prepare-title">Langsung ke persiapan</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation()}</header>
  <main class="container prepare-page" data-prepare>
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="${calmPath}">Opsi santai</a>${icon('right')}<span>Persiapan santai</span></nav>
    ${intro()}
    ${bookingsSection()}
    ${doNotBuySection()}
    ${costsSection()}
    ${planSections(calmPlanNotes)}
    ${sources()}
  </main>
  <footer class="container guide-footer"><a href="${calmItineraryPath}">Kembali ke itinerary santai</a>${siteCredit()}</footer>`;
}
