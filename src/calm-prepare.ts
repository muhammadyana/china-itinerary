import { escapeHtml as e, icon, siteCredit } from './render.ts';
import { currencyText } from './currency.ts';
import { planSwitch, renderSiteNavigation } from './site-navigation.ts';
import { preparePath } from './bookings.ts';
import {
  bookingRules, checkedOn, costSummary, diqingHospital, doneList, ganziHospitalSource, link, list, mainBookingCard, planSections, prepareSources, section, sourcesSection, urgencySections,
  type BookingCard, type PlanNotes,
} from './prepare.ts';
import { cnyRange } from './costs.ts';
import { calmCostLines, calmCostsPath, calmSharedBookings } from './calm-costs.ts';
import {
  calmBookingGroups, calmCheckedAt, calmDoNotBuy, calmDoNotBuyLead, calmItineraryPath, calmPath, calmPreparePath, calmSources, type CalmBooking,
} from './calm-route.ts';
import { calmChecklistSection } from './calm-checklist.ts';

/** The "Status" row a booked item's card leads with. */
export const bookedFact = (item: CalmBooking): [string, string][] => item.booked ? [['Status', currencyText(item.booked)]] : [];

// The calm option's own bookings from calm-route.ts, plus the main plan's bookings for the days the two plans share.
export const calmCard = (item: CalmBooking, id?: string): BookingCard => ({
  date: item.date, until: item.until, title: item.booked ? `${item.item} (sudah dipesan)` : item.item, urgency: item.urgency, link: item.link, id, price: item.cost && `${cnyRange(item.cost)} / ${item.cost.per}`,
  facts: [...bookedFact(item), ['Harga', currencyText(item.price)], ['Cara pesan', currencyText(item.channel)], ['Dibuka', currencyText(item.opens)]],
});
/** The id a stays card carries on the calm preparation page. */
const stayCardId = (item: CalmBooking) => `stay-${item.date}`;
/** Tickets and transport for one calm-only date; stays have their own link in the day header, as on the homepage.
 * A ticket or car with `until` is two one-way trips (the Maoxian–Bipenggou car), so it shows on those two dates only. */
export const calmDayBookings = (date: string) => calmBookingGroups.filter(group => group.id !== 'stays').flatMap(group => group.items.filter(item => item.date === date || item.until === date));

// Booked items are listed as done in the intro, not as something to book.
const calmBooked = () => calmBookingGroups.flatMap(group => group.items).flatMap(item => item.booked ? [{ title: item.item, detail: item.booked }] : []);

const calmCards = () => [
  ...calmSharedBookings.map(mainBookingCard),
  ...calmBookingGroups.flatMap(group => group.items.filter(item => !item.booked).map(item => calmCard(item, group.id === 'stays' ? stayCardId(item) : undefined))),
].sort((a, b) => a.date.localeCompare(b.date));

// The route-specific lines of the shared sections, from the calm research (calm-route.ts) and the main plan's 19 November.
const calmPlanNotes: PlanNotes = {
  cash: 'Bawa uang tunai cadangan untuk kota kecil di Aba; belum ada data penerimaan kartu di Huanglong atau Bipenggou. ATM Bank of China menerima Visa dan Mastercard, maksimal CNY 3000 per penarikan.',
  signal: '',
  hospitals: [diqingHospital],
  altitude: 'Rute ini naik ke Yanziyan 3.837 m di Bipenggou, tidur dua malam di Shangri-La 3.300 m, dan naik ke gletser Jade Dragon pada 19 November.',
  ascent: 'Malam 18 November naik sekitar 900 m dari Lijiang ke Shangri-La; 19 November pagi Songzanlin dengan langkah pelan, lalu sore turun lagi ke Lijiang.',
};

const pageLink = (url: string, label: string) => link({ url, label });

function intro() {
  return `<div class="prepare-intro">
      <h1 id="prepare-title">Persiapan opsi santai, satu halaman.</h1>
      <p class="lead">Kalau memilih opsi santai: yang sudah beres, yang harus dipesan beserta jam bukanya, perkiraan biaya, cara tetap online, dan nomor penting. Diperiksa <time datetime="${calmCheckedAt}">4–5 November 2026</time>.</p>
      <p class="prepare-link calm-page-links">${pageLink(`${calmPreparePath}#checklist`, 'Checklist pemesanan')}${pageLink(calmItineraryPath, 'Itinerary santai, hari demi hari')}${pageLink(calmPath, 'Bandingkan dengan rencana utama')}</p>
      ${doneList(calmBooked())}
    </div>`;
}

const bookingsSection = () => section('bookings', 'Pesan dan kapan', `<p class="prepare-section-lead">${bookingRules} Pemesanan 8 dan 18–21 November sama dengan rencana utama; 9–17 November dari riset opsi santai.</p>
      <p class="prepare-link">${pageLink(`${preparePath}#bookings`, 'Pemesanan rencana utama')}</p>
      ${urgencySections(calmCards())}`);

const doNotBuySection = () => section('do-not-buy', 'Jangan dibeli kalau pilih opsi ini', `<p class="prepare-section-lead">${e(calmDoNotBuyLead)}</p>${list(calmDoNotBuy.map(currencyText))}`);

// The main preparation page's cost table, summed from the calm option's own lines (calm-costs.ts).
const costsSection = () => section('costs', 'Perkiraan biaya', `<p class="prepare-section-lead">Dijumlahkan dari harga di halaman ini dan pilihan penginapan termurah sampai termahal per malam di halaman Hotel &amp; hostel santai. Mobil Jade Dragon 20 November baru perkiraan dari tarif sewa per jam Trip.com. Dihitung untuk bagianmu: sendiri sampai 16 November, lalu kamar mulai malam 17 November dan mobil mulai 18 November dibagi dua dengan temanmu. Belum termasuk makan, oleh-oleh, makan dan menginap sopir, biaya kembali kosong mobil, pilihan cadangan, taksi kota yang belum terdaftar, serta biaya pemesanan Trip.com.</p>
      ${costSummary(calmCostLines, calmCostsPath)}`);

// The calm page shows no Ganzi hospital, so it drops that source.
const sources = () => sourcesSection(`Opsi santai diperiksa ${checkedOn(calmCheckedAt)}; bagian umum serta 8 dan 18–21 November memakai sumber rencana utama, diperiksa 4 November 2026. Harga, jam rilis dan aturan dapat berubah; ikuti pengumuman resmi saat memesan.`, [...calmSources, ...prepareSources.filter(source => source !== ganziHospitalSource)]);

export function calmPrepareView() {
  return `<a class="skip-link" href="#prepare-title">Langsung ke persiapan</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation(calmPreparePath)}</header>
  <main class="container prepare-page" data-prepare>
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="${calmPath}">Opsi santai</a>${icon('right')}<span>Persiapan santai</span></nav>
    ${planSwitch(calmPreparePath)}
    ${intro()}
    ${calmChecklistSection()}
    ${bookingsSection()}
    ${doNotBuySection()}
    ${costsSection()}
    ${planSections(calmPlanNotes)}
    ${sources()}
  </main>
  <footer class="container guide-footer"><a href="${calmItineraryPath}">Kembali ke itinerary santai</a>${siteCredit()}</footer>`;
}
