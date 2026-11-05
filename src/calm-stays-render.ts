import { staysView, type StayNights, type StaysPage } from './stays-render.ts';
import { stayBudget } from './stays.ts';
import { checkedOn } from './prepare.ts';
import { calmDays, calmItineraryPath, calmPath } from './calm-route.ts';
import { calmStayBaseForDate, calmStayBases, calmStaysCheckedAt, calmStaysPath } from './calm-stays.ts';

export { calmStaysPath } from './calm-stays.ts';

// The main stays page's sections and cards, fed with the calm nights; each night's date links to the calm itinerary.
const calmNights: StayNights = {
  nights: base => calmDays.filter(day => calmStayBaseForDate(day.date)?.id === base.id),
  dayHref: date => `${calmItineraryPath}#${date}`,
};
const checked = checkedOn(calmStaysCheckedAt);

const calmStaysPage: StaysPage = {
  path: calmStaysPath, bases: calmStayBases, source: calmNights, parent: { label: 'Opsi santai', url: calmPath }, current: 'Hotel & hostel santai', title: 'Tempat tidur opsi santai, malam demi malam.',
  intro: `<p class="lead">Satu hotel hemat dan satu hostel atau guesthouse untuk setiap malam opsi santai, dengan batas ${stayBudget.rupiah} per malam. Harga 9–17 November dicek ${checked} untuk tanggal dan jumlah tamunya; 8 dan 18–20 November sama dengan rencana utama.</p>
      <p>Harga adalah perkiraan per malam dan belum dipesan; yang melewati batas ditandai. Promo menginap pertama Trip.com belum pasti berlaku untuk lebih dari satu pemesanan per akun. Bandingkan di penyedia sebelum membayar, dan buka galeri penyedia untuk foto properti.</p>`,
  method: `<p>Malam 9–17 November diperiksa <time datetime="${calmStaysCheckedAt}">${checked}</time> dari daftar Trip.com untuk tanggal dan jumlah tamu yang tepat, halaman kebijakan tiap properti, dan ulasan tamu, lalu dicek ulang secara terpisah pada hari yang sama. Jarak adalah garis lurus dari pin peta kecuali disebut lain; waktu berkendara dari OSRM tanpa macet. Malam 8 dan 18–20 November memakai riset rencana utama, diperiksa 4 November 2026. Izin pendaftaran tamu asing di China dapat berubah; konfirmasikan saat memesan.</p><p>Tidak ada penginapan yang sudah dipesan.</p>`,
  footer: { label: 'Kembali ke itinerary santai', url: calmItineraryPath },
};

export const calmStaysView = () => staysView(calmStaysPage);
