import { costsView, methodNotes, notIncluded, type CostsPage } from './costs-render.ts';
import { costsPath } from './costs.ts';
import { checkedOn } from './prepare.ts';
import { calmBookingGroups, calmCheckedAt, calmItineraryPath, calmPath, calmPreparePath } from './calm-route.ts';
import { calmStaysPath } from './calm-stays.ts';
import { calmCostLines, calmCostPlan, calmCostsPath } from './calm-costs.ts';

export { calmCostsPath } from './calm-costs.ts';

// The main plan's breakdown, page and rules, fed with the calm option's lines; only the copy around it differs.
const alternatives = calmBookingGroups.flatMap(group => group.items).filter(item => item.alternative);
const unpriced = calmCostLines.filter(line => !line.cost);

const calmNotIncluded = [
  ...notIncluded,
  `Pilihan cadangan, yang menggantikan pos utamanya bila dipakai: ${alternatives.map(item => `${Number(item.date.slice(-2))} November, ${item.item.replace(/^[^:]+:\s*/, '')}`).join('; ')}.`,
  'Taksi dan metro dalam kota yang belum ada di daftar pemesanan: Chadianzi ke Chunxi Road 14 November, Chengdu South dan Stasiun Lijiang 15 November, serta Napahai 17 November.',
  ...(unpriced.length ? [`Pos tanpa harga: ${unpriced.map(line => line.label).join('; ')}.`] : []),
];

const calmMethodNotes = [
  ...methodNotes,
  'Mobil 12 November (Maoxian → Bipenggou) dan 16 November belum punya penawaran; angkanya dihitung dari sewa per jam Trip.com di Aba dan Lijiang. Mobil Huanglong 11 November dan shuttle 14 November memakai harga produk Trip.com untuk tanggal itu.',
  'DiDi ke toko buku Zhongshu Ge 9 November memakai satu laporan pelancong: sekitar CNY 100 sekali jalan (Third Eye Traveller, Juni 2026), dihitung dua kali untuk pulang-pergi.',
  'Shuttle Trip.com 9 November dihitung CNY 120 dari harga terendah IDR 328.648 untuk tanggal itu, dengan kurs tersimpan; harga per jenis mobil belum dilihat.',
  'Malam 9–17 November memakai harga untuk tanggal dan jumlah tamu itu; 8 dan 18–20 November memakai harga rencana utama.',
];

const calmCostsPage: CostsPage = {
  path: calmCostsPath, plan: calmCostPlan, parent: { label: 'Opsi santai', url: calmPath }, current: 'Rincian biaya santai', title: 'Rincian biaya opsi santai, hari demi hari.',
  lead: `Tiket, kereta, mobil, dan penginapan per tanggal kalau memilih opsi santai, dihitung untuk bagianmu. Harga 9–17 November dicek <time datetime="${calmCheckedAt}">${checkedOn(calmCheckedAt)}</time>; 8 dan 18–21 November sama dengan rencana utama.`,
  notIncluded: calmNotIncluded, methodNotes: calmMethodNotes,
  methodLead: 'Harga diambil dari daftar pemesanan di halaman Persiapan santai dan pilihan di halaman Hotel &amp; hostel santai. Semuanya perkiraan dan bisa berubah saat memesan.',
  links: [{ label: 'Persiapan santai', url: calmPreparePath }, { label: 'Hotel & hostel santai', url: calmStaysPath }, { label: 'Rincian biaya rencana utama', url: costsPath }],
  footer: { label: 'Kembali ke itinerary santai', url: calmItineraryPath },
};

export const calmCostsView = () => costsView(calmCostsPage);
