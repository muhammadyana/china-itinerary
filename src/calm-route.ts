import { days, type Day } from './itinerary.ts';
import { dayTimelines, type TimelineStep } from './day-timelines.ts';
import { at, go, type MapLeg, type MapPoint, type Mode } from './route-map.ts';
import type { Booking, Link, TransportMode, Urgency } from './bookings.ts';
import { placePath } from './guides.ts';
import { calmStayBases, calmStayPicks, calmStaysHref, calmStaysPath, nightList, stayPicksText, type CalmStayBase } from './calm-stays.ts';

// The calm option ("opsi santai"): a one-way alternative to the main plan, researched and re-checked on 5 November 2026.
// 8 and 18–21 November are read from the main plan's days and timelines, so the two pages cannot drift apart.
// The Tiger Leaping Gorge High Trail is formally prohibited, so 16 November is the lawful Upper Gorge viewpoint by car.
export const calmCheckedAt = '2026-11-05';
export const calmPath = '/places/calm/';
export const calmItineraryPath = '/places/calm-itinerary/';
export const calmPreparePath = '/places/calm-prepare/';

export interface CalmStop { place: string; note?: string }
export interface CalmNote { text: string; links: Link[] }
export interface CalmDay {
  date: string; title: string; shortTitle: string; route: string[];
  overnight: { name: string; elevation?: string; detail: string } | null;
  transport: string; intro: string; steps: TimelineStep[]; stops: CalmStop[];
  notes: CalmNote[]; risks: string[];
  /** Read from the main plan. */
  fromMain: boolean;
  /** A borrowed day the calm option changes (8 November's evening); labelled as adjusted, not as the same. */
  adjusted?: boolean;
}
/** `urgency` follows the `opens` text, as on the main preparation page; `mode` marks transport legs. `price` is the text
 * shown; `cost` is the same figure as numbers for the cost breakdown, set only when the text gives a price or estimate.
 * An `alternative` is a fallback or optional item: listed for booking, left out of the totals. `booked` is the owner's
 * confirmed purchase (from their own screenshot); a booked item leaves the to-book lists and `cost` is what was paid.
 * `paid` is the amount charged in rupiah, as the order screenshot shows it; it feeds the expenses page. */
export interface CalmBooking {
  date: string; until?: string; item: string; price: string; channel: string; opens: string; urgency: Urgency; mode?: TransportMode; link?: Link;
  cost?: Booking['cost']; alternative?: boolean; booked?: string;
  paid?: number;
}
/** `stays` items are the nights; the day panels list only the other groups, like the homepage. */
export interface CalmBookingGroup { id: 'tickets' | 'cars' | 'stays'; title: string; lead: string; items: CalmBooking[] }

export { calmPlaces, placeFor } from './calm-places.ts';

// New map points (WGS84 from OpenStreetMap, checked 5 November 2026); the shared towns reuse the main map's points.
export const calmMapPoints: Record<string, MapPoint> = {
  // Unlabelled: on a 390px map it sits close to the Huanglongjiuzhai station point, and every label side collides or clips.
  huanglong: { name: 'Huanglong', latitude: 32.7571, longitude: 103.82939 },
  'long-lake': { name: 'Long Lake', latitude: 33.0436025, longitude: 103.9318624 },
  // Tea Horse and MoYe sit 2–4 km from this point, under one pixel at map scale, so they get no points of their own.
  'upper-gorge': { name: 'Upper Gorge', latitude: 27.1926037, longitude: 100.112808, label: 'w' },
  // Pudacuo National Park, OSM way 832323147 (checked 7 November 2026). Unlabelled: about 10 px from Shangri-La on a 390px map.
  pudacuo: { name: 'Pudacuo', latitude: 27.9128041, longitude: 99.9030771 },
  dujiangyan: at('dujiangyan', 'Dujiangyan'),
  rilong: at('rilong', 'Siguniangshan', 'w'),
};

// Legs for the calm days; 8 and 19–21 November use the main map's legs.
export const calmLegs: Record<string, MapLeg[]> = {
  '2026-11-09': [...go('car', 'chengdu', 'dujiangyan', 'chengdu'), ...go('train', 'chengdu', 'huanglongjiuzhai'), ...go('car', 'huanglongjiuzhai', 'jiuzhaigou')],
  '2026-11-10': go('bus', 'jiuzhaigou', 'long-lake', 'jiuzhaigou'),
  '2026-11-11': [...go('car', 'jiuzhaigou', 'huanglong', 'huanglongjiuzhai'), ...go('train', 'huanglongjiuzhai', 'chengdu')],
  '2026-11-12': [],
  '2026-11-13': go('bus', 'chengdu', 'bipenggou', 'chengdu'),
  '2026-11-14': go('bus', 'chengdu', 'rilong', 'chengdu'),
  '2026-11-15': go('train', 'chengdu', 'lijiang'),
  '2026-11-16': go('car', 'lijiang', 'upper-gorge', 'shangri-la'),
  '2026-11-17': [],
  '2026-11-18': [...go('car', 'shangri-la', 'pudacuo', 'shangri-la'), ...go('train', 'shangri-la', 'lijiang')],
};
// Day numbers moved off other numbers and legs on the calm map, in map pixels.
export const calmBadgeShifts: Record<string, readonly [number, number]> = { '2026-11-08': [10, -19], '2026-11-09': [18, 60], '2026-11-10': [36, -4], '2026-11-12': [-40, 62], '2026-11-16': [-8, -14], '2026-11-17': [-22, -17] };
// Days that stay in one place name their local transport in the day list.
export const calmLocalModes: Record<string, Mode[]> = {};

// Short bold actions for the main plan's steps on the shared days, in step order; the main plan's text becomes the detail.
// Only the calm view uses them, so the main plan's own pages keep their single-line steps.
const mainStepTitles: Record<string, string[]> = {
  '2026-11-08': ['Subuh & sarapan di Pudong', 'Check-in Juneyao', 'Terbang ke Chengdu', 'Mendarat di Tianfu', 'Taksi ke hotel Chunxi Road', 'Check-in & Zuhur', 'Makan siang halal', 'Asar di hotel', 'DiDi ke Chengdu SKP', 'Keliling SKP selagi terang', 'Foto cahaya keemasan', 'Maghrib', 'Langit biru & lampu menara', 'Bila lampu telat menyala', 'Twin Towers (opsional)', 'DiDi ke hotel', 'Isya di hotel', 'Cek tiket besok', 'Tidur'],
  '2026-11-19': ['Subuh', 'Mobil ke Jade Dragon', 'Ganhaizi (opsional)', 'Masuk kawasan', 'Blue Moon Valley', 'Shuttle kembali', 'Masuk teater', 'Impression Lijiang', 'Ke halte shuttle', 'Slot kereta gantung', 'Glacier Park', 'Turun', 'Mobil ke Stasiun Lijiang', 'Maghrib + Isya', 'Kereta C442 ke Dali', 'Taksi ke penginapan'],
  '2026-11-20': ['Subuh', 'Ke Dermaga Caicun', 'Erhai pagi', 'Sarapan halal', 'Check-out, titip koper', 'Menara Wuhua & kota tua', 'Salat Jumat', 'Makan siang halal', 'Kota tua sore', 'Asar, ke Stasiun Dali', 'Kereta D8704 ke Kunming', 'Ke penginapan Kunming', 'Maghrib & Isya', 'Atur transfer bandara'],
  '2026-11-21': ['Subuh', 'Green Lake & camar', 'Sarapan halal & check-out', 'Jinma Biji & kota tua', 'Zuhur di Masjid Nancheng', 'Museum atau camar Haigeng', 'Ambil koper, Asar', 'Ke Bandara Changshui', 'Check-in Xiamen Airlines', 'Terbang ke Xiamen, lalu Jakarta'],
};

function titledSteps(date: string): TimelineStep[] {
  const steps = dayTimelines[date] ?? [];
  const titles = mainStepTitles[date];
  if (!titles) return steps;
  if (titles.length !== steps.length) throw new Error(`calm-route.ts: ${titles.length} titles for ${steps.length} steps on ${date}`);
  return steps.map(([time, text], index) => [time, titles[index], text]);
}

function fromMainPlan(date: string): CalmDay {
  const day: Day | undefined = days.find(item => item.date === date);
  if (!day) throw new Error(`The main plan has no day ${date}`);
  return {
    date, title: day.title, shortTitle: day.shortTitle, route: day.route, overnight: day.overnight, transport: day.transport, intro: day.intro,
    steps: titledSteps(date), stops: day.events.flatMap(event => event.kind === 'stop' ? [{ place: event.place, note: event.note }] : []),
    notes: [], risks: [], fromMain: true,
  };
}

const highTrailNotice = { label: 'Pemberitahuan kota, 10 Februari', url: 'https://www.sohu.com/a/986025656_120815119' };
const highTrailOperator = { label: 'Pengelola, 1 Mei', url: 'https://m.gmw.cn/2026-05/09/content_1304450375.htm' };
const zhongshugeHours = { label: 'Trip.com: Zhongshu Ge Dujiangyan buka 10.00–21.00 (dicek 5 November 2026)', url: 'https://www.trip.com/moments/poi-zhongshuge-101876802/' };
const routeGateToBookstore = { label: 'OSRM (FOSSGIS): gerbang Bipenggou ke Zhongshu Ge Dujiangyan, 144 km, 1 jam 40 menit tanpa macet (5 November 2026)', url: 'https://routing.openstreetmap.de/routed-car/route/v1/driving/102.9849,31.4155;103.6218853,30.9582302?overview=false' };

const calmOwnDays: CalmDay[] = [
  {
    date: '2026-11-09', title: 'Zhongshu Ge pagi, Taikoo Li sore, kereta ke Jiuzhaigou', shortTitle: 'Zhongshu Ge, Taikoo Li, ke Jiuzhaigou',
    route: ['Chunxi Road', 'Zhongshu Ge Dujiangyan', 'Taikoo Li', 'Chengdu East', 'Jiuzhaigou'],
    overnight: { name: 'Jiuzhaigou', elevation: '±2.000 m', detail: `Malam pertama dari dua di Leyu Youth Hostel (乐鱼青年旅舍), Desa Longkang, sekitar 1,8 km dari gerbang. ${calmStayPicks('2026-11-09')}` },
    transport: 'Pagi DiDi pulang-pergi ke Zhongshu Ge Dujiangyan, ±58 km sekali jalan. Sore jalan kaki di Chunxi / Taikoo Li / IFS dekat hotel, lalu DiDi atau metro ke Chengdu East. Kereta C5756 17.05 → Huanglongjiuzhai 19.10, lalu taksi/shuttle ke gukou. Cadangan: C5786 18.38, atau shuttle Trip.com 14.00 dari Xinnanmen bila kursi kereta habis.',
    intro: 'Pagi untuk toko buku Zhongshu Ge Dujiangyan (wajib), tepat saat buka pukul 10.00 di hari kerja, jam yang menurut pengunjung paling sepi. Siang kembali ke hotel Chunxi, Zuhur, lalu sore santai di Taikoo Li dan IFS sebelum kereta sore ke Jiuzhaigou. Tiket taman baru dipakai besok pagi, jadi hari ini tidak ada batas jam masuk.',
    steps: [
      ['±05.55', 'Subuh & sarapan', 'Subuh di hotel; sarapan.'],
      ['±08.30', 'Check-out, titip koper', 'Check-out dan titip koper di resepsionis. Bawa kamera, baterai cadangan, kain lap lensa, dan air.'],
      ['±08.45–10.00', 'DiDi ke Dujiangyan', 'DiDi ke 钟书阁(融创茂店), lantai 2 成都融创茂 (Sunac Mall), Dujiangyan, sekitar 58 km: ±45 menit tanpa macet menurut OSRM, 60–90 menit menurut pengunjung. Senin pagi jam berangkat kerja, jadi lihat estimasi di aplikasi.'],
      ['10.00–11.15', 'Toko Buku Zhongshu Ge', 'Toko Buku Zhongshu Ge (钟书阁都江堰店), masuk gratis, buka 10.00 menurut Trip.com. Menurut pengunjung, hari kerja saat toko baru buka adalah jam paling sepi. Cari sudut menara buku dan tangga spiral. Belum ditemukan aturan tertulis soal tripod atau gimbal: tanyakan di kasir, dan bila ragu rekam dengan tangan.'],
      ['±11.15–12.30', 'DiDi kembali ke hotel', 'DiDi kembali ke hotel di Chunxi Road, sekitar 58 km.'],
      ['±12.30–13.20', 'Zuhur & makan siang halal', 'Zuhur (sekitar 12.48) lalu makan siang 清真. Pilihan utama dekat Masjid Huangcheng (±1–1,5 km dari hotel): 皇城坝牛肉 Huangchengba Beef, 三桂前街49号, buka sekitar 10.30–22.00 (Google Maps, dicek 6 November 2026). Cadangan di kawasan yang sama: 悦香村牛肉. Beli bekal 清真 untuk makan malam di kereta atau di penginapan. Sebagai musafir, Asar boleh dijamak dengan Zuhur.'],
      ['±13.20–14.30', 'Taikoo Li & Daci Temple', 'Jalan kaki dari hotel ke Chengdu Taikoo Li (成都太古里) dan halaman Daci Temple di tengahnya. Area outdoor mall + rumah kayu: bagus untuk foto siang–sore. Masuk gratis; temple biasanya tutup sekitar 17.00.'],
      ['±14.30–15.15', 'The Sultan atau kopi foto', 'Makan ringan / resto santai 清真 di Taikoo Li: 苏坦·中东料理 The Sultan, lantai 2 unit 2307B (IslamiChina: Middle Eastern/Turkish, sekitar CNY 135 per orang, jam 11.00–22.00; dicek 6 November 2026). Di IFS belum ditemukan cafe atau resto 清真 terverifikasi. Bila hanya kopi/foto, % Arabica atau M Stand di Taikoo Li tetap opsi desain. Jangan jauh dari Chunxi supaya buffer ke East Station longgar.'],
      ['±15.15–16.00', 'IFS panda & rooftop', 'Jalan ke IFS di sebelah Taikoo Li (skywalk). Foto panda climbing di fasad dan rooftop/sky garden; opsional Ralph’s Coffee atau Grid Coffee. Asar bila belum dijamak.'],
      ['±16.00–16.20', 'Ambil koper di hotel', 'Balik hotel ambil koper yang dititip. Cek e-tiket C5756 dan paspor.'],
      ['±16.20–16.45', 'Ke Chengdu East', 'DiDi atau metro ke Chengdu East (成都东站), sekitar 6–8 km dari Chunxi / Taikoo Li: DiDi ±15–25 menit, sisakan buffer macet Senin sore. Target di stasiun ±16.45.'],
      ['17.05', 'Kereta C5756 ke Huanglongjiuzhai', 'C5756 Chengdu East 17.05 → Huanglongjiuzhai 19.10, tiket sudah dibeli (Trip.com, 6 November). Maghrib sekitar 18.09 jatuh di kereta; jamak takhir dengan Isya di penginapan.'],
      ['±19.10–20.30', 'Tiba stasiun, ke gukou & check-in', 'Tiba Huanglongjiuzhai 19.10. Bus 团子出行 terakhir hari itu 17.30 sudah lewat, jadi naik taksi/DiDi dari area resmi stasiun ke Leyu Youth Hostel (乐鱼青年旅舍, 边边街25号, Desa Longkang; sekitar 1,5–2 jam / ±90 km; acuan mobil Mei 2026 CNY 220–280) atau shuttle stasiun Trip.com bila tersedia. Check-in di Leyu (mulai 14.00, jadi tiba malam tidak masalah).'],
      ['Malam', 'Salat & makan malam', 'Maghrib dan Isya dijamak takhir. Makan bekal, atau di restoran 清真 Pengfeng (ulasan September 2025). Bila masih kuat dan pasar buka, Jiuzhai Night Market (九寨夜市) di Zhangzha bisa dilihat sebentar; jam buka November belum ketemu dan jajanannya belum tentu halal.'],
      ['±21.30', 'Siapkan besok, tidur', 'Cek tiket 10 November (slot 08.00–10.00), isi baterai, lalu tidur.'],
    ],
    stops: [
      { place: 'zhongshuge-bookstore', note: 'Wajib. Sekitar 10.00–11.15, saat toko baru buka. Masuk gratis. Jam buka 10.00–21.00 menurut Trip.com; sumber lain berbeda.' },
      { place: 'chengdu', note: 'Sore di Chunxi / Taikoo Li / IFS dekat hotel; koper diambil ±16.00 sebelum ke Chengdu East.' },
      { place: 'chengdu-east', note: 'C5756 17.05 → Huanglongjiuzhai 19.10.' },
      { place: 'jiuzhaigou-hotel', note: 'Dua malam, 9 dan 10 November, di Leyu Youth Hostel (sudah dipesan), sekitar 1,8 km dari gerbang.' },
    ],
    notes: [
      { text: 'Toko buku dipindah dari Jumat 13 November ke pagi ini. Senin 9 November hari kerja dan belum masuk libur sekolah Chengdu (11–13 November), sedangkan Jumat sore jatuh di hari terakhir libur sekolah.', links: [zhongshugeHours] },
      { text: 'Sore kota sengaja di Taikoo Li / IFS dekat hotel, bukan Kuanzhai atau Doll House (Manhattan Nature), supaya buffer ke Chengdu East untuk C5756 17.05 tetap longgar.', links: [] },
      { text: 'Resto 清真 9 November (dicek 6 November 2026): Huangchengba Beef dekat masjid untuk Zuhur; The Sultan di Taikoo Li lantai 2 untuk sore. Cek label 清真 di pintu. Sumber: Google Maps (Huangchengba jam 10.30–22.00) dan IslamiChina (The Sultan).', links: [{ label: 'IslamiChina: The Sultan Taikoo Li', url: 'https://www.islamichinatravel.com/destination-guide/chengdu/chengdu-halal-restaurants/the-sultan-taikoo-li-branch/' }] },
    ],
    risks: [
      'C5756 tiba 19.10, setelah bus 团子出行 terakhir (17.30). Siapkan taksi/DiDi dari area resmi stasiun atau shuttle stasiun Trip.com; sepakati harga sebelum naik. Belum pasti 团子出行 menerima paspor asing pada bus siang (bila suatu saat ganti ke C6376).',
      'Bila DiDi kembali dari Dujiangyan terlambat, persingkat Taikoo Li / IFS; prioritas koper dan buffer ke East sebelum 16.45.',
      'Bila C5756 terlewat atau batal: C5786 Chengdu East 18.38 → 20.48 (CNY 143), atau cadangan lebih awal C6376 14.34 → 16.58 lalu bus 团子出行 17.30 (CNY 51), atau shuttle Trip.com 14.00 dari Xinnanmen Bus Station.',
      'Jam buka toko berbeda antarsumber: 10.00–21.00 (Trip.com), 09.00–20.00 (Third Eye Traveller, Juni 2026), 10.00–22.00 (9sc.cn, Mei 2025). Telepon toko +86 28 6142 7881 (Trip.com) sebelum berangkat.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-10', title: 'Jiuzhaigou seharian: Mirror Lake pagi, Five Flower Lake siang', shortTitle: 'Jiuzhaigou seharian',
    route: ['Jiuzhaigou', 'Mirror Lake', 'Long Lake', 'Nuorilang', 'Five Flower Lake', 'Pearl Shoals', 'Shuzheng', 'Jiuzhaigou'],
    overnight: { name: 'Jiuzhaigou', elevation: '±2.000 m', detail: 'Leyu Youth Hostel lagi, malam kedua dari dua (sudah dipesan).' },
    transport: 'Jalan kaki 20–30 menit atau taksi dari Leyu Youth Hostel ke gerbang; bus taman (cabang Rize dan Zechawa berpisah di Nuorilang). Lama perjalanan bus belum dicek.',
    intro: 'Satu hari penuh di taman dengan satu tiket, masuk saat gerbang buka. Mirror Lake selagi angin pagi pelan, Long Lake dan Five-Colour Pond menjelang siang, Five Flower Lake dan Pearl Shoals saat matahari tinggi, lalu Shuzheng menjelang sore.',
    steps: [
      ['±05.58', 'Subuh & sarapan', 'Subuh di Leyu Youth Hostel; sarapan dari bekal halal (hostel tanpa sarapan). Bawa bekal makan siang dan air; jangan mengandalkan makanan di taman.'],
      ['±07.30', 'Jalan ke gerbang', 'Dari Leyu sekitar 1,8 km: jalan kaki 20–30 menit, atau taksi supaya pasti di gerbang 08.00. Matahari terbit 07.31.'],
      ['08.00', 'Masuk taman, bus ke Mirror Lake', 'Masuk saat gerbang buka, slot 08.00–10.00. Bus taman ke Nuorilang, lalu bus Rize sedikit ke atas sampai Mirror Lake (镜海).'],
      ['±08.40–09.15', 'Foto Mirror Lake', 'Pantulan Mirror Lake. Menurut Ctrip waktu terbaiknya sebelum 09.00 atau setelah 17.00 saat angin pelan; lewat ±09.00 angin biasanya memecah pantulan.'],
      ['±09.15–10.00', 'Bus ke Long Lake', 'Bus kembali ke Nuorilang, lalu bus Zechawa sampai ujungnya di Long Lake (长海).'],
      ['±10.00–11.30', 'Long Lake & Five-Colour Pond', 'Long Lake, lalu jalur kayu turun ke Five-Colour Pond (五彩池). Di sini dingin: simpan baterai cadangan di dalam jaket dan waspadai es di jalur kayu.'],
      ['±11.30–12.15', 'Air terjun Nuorilang', 'Bus turun ke Nuorilang. Air terjun Nuorilang (诺日朗瀑布) dekat halte; singgah sebentar bila antrean bus pendek.'],
      ['±12.15–12.45', 'Bus ke Five Flower Lake', 'Bus Rize ke arah 原始森林; turun di 五花海.'],
      ['±12.45–14.15', 'Five Flower Lake & Zuhur', 'Five Flower Lake saat matahari tinggi dan warna air paling kuat. Zuhur (mulai 12.51) di sudut tenang dengan bekal makan siang; sebagai musafir kamu boleh menjamaknya dengan Asar.'],
      ['±14.15–15.00', 'Pearl Shoals', 'Jalur kayu turun ke Pearl Shoals (珍珠滩) dan air terjunnya, lalu naik bus dari halte Pearl Shoals. Lama berjalan belum dicek.'],
      ['±15.00–16.45', 'Shuzheng', 'Bus turun ke Shuzheng. Pantulan di danau lebih tenang menjelang sore, dan dasar lembah mulai teduh ±16.30. Asar 15.47 bila tidak dijamak. Persingkat atau lewati bila jadwal mundur.'],
      ['±16.45–17.30', 'Keluar taman', 'Bus ke gerbang; keluar paling lambat 17.30, taman tutup 18.00.'],
      ['18.08', 'Maghrib & makan malam', 'Maghrib; Isya 19.33. Makan malam halal di Pengfeng. Beli sarapan, bekal makan siang, dan camilan untuk 11 November.'],
      ['±20.30', 'Cek perjalanan besok', 'Pastikan tur Huanglong 07.30 (sudah dipesan) dan tiket kereta C6364 sore besok. Siapkan bekal makan siang untuk di taman.'],
    ],
    stops: [
      { place: 'mirror-lake', note: 'Sekitar 08.40–09.15, sebelum angin datang.' },
      { place: 'long-lake' },
      { place: 'five-colour-pond' },
      { place: 'nuorilang' },
      { place: 'five-flower', note: 'Sekitar 12.45–14.15, saat matahari tinggi.' },
      { place: 'pearl-shoals' },
      { place: 'shuzheng', note: 'Menjelang sore, saat pantulan lebih tenang.' },
    ],
    notes: [],
    risks: [
      'Hanya satu hari di taman. Tiket 10 November slot 08.00–10.00 sudah dipesan (Trip.com, dikonfirmasi 6 November); bawa paspor yang dipakai saat memesan.',
      'Pemesanan atas nama asli (人证合一): paspor harus cocok, satu tiket per identitas per tanggal.',
      'Seluruh taman dibuka lagi 30 Juli 2026 setelah longsor 26 Juli. Jalur masih bisa ditutup karena cuaca.',
      'Lama perjalanan bus taman dan jalur kayu belum dicek, jadi urutan ini padat. Bila mundur, persingkat Shuzheng lebih dulu.',
      'Angin bisa datang sebelum 09.00; pantulan Mirror Lake tidak dijamin.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-11', title: 'Huanglong seharian, kereta sore ke Chengdu', shortTitle: 'Huanglong, ke Chengdu',
    route: ['Jiuzhaigou', 'Huanglong', 'Five-Colour Pool', 'Huanglongjiuzhai', 'Chengdu'],
    overnight: { name: 'Chengdu', detail: `Kembali ke Chunxi Road untuk empat malam, 11–14 November. ${calmStayPicks('2026-11-11')}` },
    transport: 'Tur kecil Trip.com (sudah dipesan): jemput 07.30 di Leyu, tiket dan ropeway naik termasuk, selesai di Stasiun Huanglongjiuzhai ±14.50; lalu kereta C6364 16.25 ke Chengdu East (tiba 18.07) dan Metro atau DiDi ke Chunxi Road.',
    intro: 'Satu hari penuh di Huanglong, teras kolam travertin kuning dan biru di 3.100–3.576 m. Naik ropeway, berjalan ke Five-Colour Pool saat matahari tinggi, lalu turun lewat jalur kayu. Sore langsung kereta ke Chengdu, yang jadi basis empat malam untuk dua tur sehari ke Bipenggou dan Siguniangshan.',
    steps: [
      ['±05.59', 'Subuh, sarapan, check-out', 'Subuh di Leyu Youth Hostel; sarapan; check-out. Bawa bekal makan siang dan air: belum ada makanan halal yang terverifikasi di Huanglong.'],
      ['07.30', 'Dijemput tur ke Huanglong', 'Tur kecil Trip.com (sudah dipesan, paket 07.30 dari Jiuzhaigou) menjemput di Leyu Youth Hostel, Desa Longkang; CS Trip.com mengonfirmasi jemput di hotel. Lewat Chuanzhusi dan terowongan Xueshanliang (雪山梁隧道). Matahari terbit 07.32.'],
      ['±07.30–10.00', 'Perjalanan ke Huanglong', 'Sekitar 107 km: OSRM 85 menit tanpa macet, operator Trip.com menyebut ±2½ jam. Minum obat antimabuk dan banyak minum air.'],
      ['±10.00–10.30', 'Masuk & ropeway naik', 'Tiket masuk dan ropeway naik sudah termasuk tur; bawa paspor yang dipakai memesan. Penjualan tiket ropeway berhenti 16.30 menurut pengumuman Mei 2026; November 2024 pernah dimajukan ke 16.00.'],
      ['±10.30–12.30', 'Ke Five-Colour Pool', 'Dari stasiun atas sekitar 2,9 km ke Five-Colour Pool (五彩池, ±3.576 m), jalan pelan di jalur kayu. Kolam paling berwarna saat matahari tinggi. Pos oksigen gratis ada di sepanjang jalur. Bus wisata di atas (CNY 15) hanya dijual di abatour.com.'],
      ['±12.30–13.00', 'Makan siang dari bekal', 'Makan siang dari bekal di tempat duduk dekat Huanglong Temple (黄龙古寺). Zuhur dijamak takhir dengan Asar di stasiun.'],
      ['±13.00–14.30', 'Jalan turun ke gerbang', 'Turun lewat jalur kayu utama melewati teras kolam ke gerbang; panduan menyebut putaran utama ±7 km, 3–4 jam. Persingkat foto bila lelah.'],
      ['±14.30–15.10', 'Mobil tur ke stasiun', 'Mobil tur mengantar ke Stasiun Huanglongjiuzhai (黄龙九寨站), tiba sekitar 14.50 menurut halaman tur; tur selesai di sana.'],
      ['±15.10–16.15', 'Stasiun, Zuhur + Asar', 'Masuk stasiun dengan paspor; Zuhur dan Asar dijamak takhir di sudut tenang ruang tunggu.'],
      ['16.25', 'Kereta C6364 ke Chengdu East', 'C6364 dari 黄龙九寨 16.25, tiba Chengdu East 18.07 (12306, dicek 8 November 2026: kursi kelas dua dan satu tersedia). Pilih yang berangkat dari 黄龙九寨, bukan dari stasiun 松潘. Cadangan: C6374 17.30 → 20.09, C5798 18.19 → 20.39.'],
      ['±18.10–19.00', 'Ke Chunxi Road', 'Metro jalur 2 dari 成都东客站 ke 春熙路, atau DiDi; lama perjalanan belum dicek. Maghrib di hotel (cek jam di aplikasi salat).'],
      ['±19.00', 'Check-in & makan malam halal', 'Check-in di Chunxi Road; ambil koper besar bila dititip sejak 9 November. Makan malam halal di kawasan Huangchengba, dekat 皇城清真寺.'],
    ],
    stops: [
      { place: 'huanglong', note: 'Sekitar 10.00–14.30, dengan tur kecil Trip.com yang sudah dipesan (tiket dan ropeway naik termasuk).' },
      { place: 'huanglongjiuzhai', note: 'Tur selesai ±14.50; kereta C6364 16.25 ke Chengdu East.' },
    ],
    notes: [
      { text: 'Pengumuman resmi terakhir (15 September 2026) tidak menyebut penutupan. Musim ramai Huanglong 1 Juni–15 Desember, jadi 11 November masih harga penuh. Dinas pariwisata Sichuan menulis 3 November 2026 bahwa kolam sedang di musim air penuh (丰水期).', links: [{ label: 'Huanglong: jam ropeway mulai 1 Juni 2026 (The Paper, 26 Mei 2026)', url: 'https://m.thepaper.cn/newsDetail_forward_33234257' }, { label: 'Weibo dinas pariwisata Sichuan (3 November 2026)', url: 'https://www.sina.cn/weibo/detail/5361149462970929.html' }] },
    ],
    risks: [
      'Jam November 2026 belum diumumkan. Pada 1 November 2024 penjualan ropeway dimajukan ke 16.00 dan pada 25 November 2024 taman baru buka 09.00; rencana ini naik ±10.15, jadi masih aman.',
      'Ketinggian 3.100–3.576 m (angka panduan, bukan resmi). Jalan pelan; bila pusing berat, turun dan pakai pos oksigen.',
      'Salju atau es pada 11 November belum diketahui; cek prakiraan 7 hari, atau telepon taman 0837-7249958.',
      'Ropeway sempat rusak 4 Oktober 2025 dan jalan lagi siang itu. Bila berhenti, naik jalur kayu dari bawah dan persingkat sampai Huanglong Temple.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-12', title: 'Istirahat di Chengdu', shortTitle: 'Istirahat di Chengdu',
    route: ['Chunxi Road', 'Huangchengba', 'Chunxi Road'],
    overnight: { name: 'Chengdu', detail: 'Malam kedua dari empat di Chunxi Road.' },
    transport: 'Jalan kaki, Metro, atau DiDi di pusat kota; tidak ada perjalanan antarkota hari ini.',
    intro: 'Hari kosong setelah Huanglong, sebelum dua tur sehari yang berangkat subuh. Pagi istirahat, siang makan halal dan Zuhur di Masjid Huangcheng, sore belanja bekal untuk Bipenggou dan Siguniangshan, lalu tidur awal.',
    steps: [
      ['Pagi', 'Istirahat', 'Bangun tanpa alarm; cuci baju dan isi baterai.'],
      ['±12.00–13.30', 'Makan siang & Zuhur', 'Makan siang halal di kawasan Huangchengba, lalu Zuhur di Masjid Huangcheng (皇城清真寺).'],
      ['Sore', 'Beli bekal halal', 'Beli makanan berlabel 清真 dan roti untuk makan siang di Bipenggou (13 November) dan Siguniangshan (14 November); keduanya tidak termasuk makan.'],
      ['Malam', 'Siapkan tur, tidur awal', 'Pastikan pesan dari pengelola bus Bipenggou: titik dan jam kumpul dikirim sehari sebelumnya. Siapkan paspor, baju hangat, bekal; tidur paling lambat 21.30.'],
    ],
    stops: [
      { place: 'huangcheng-mosque', note: 'Zuhur dan makan siang halal di sekitarnya.' },
      { place: 'chengdu', note: 'Basis empat malam; sore santai di sekitar hotel.' },
    ],
    notes: [],
    risks: ['Bus Bipenggou harus sudah dipesan; batal gratis sampai beberapa hari sebelumnya menurut halaman produk, jadi cek tanggal batasnya saat memesan.'],
    fromMain: false,
  },
  {
    date: '2026-11-13', title: 'Bipenggou sehari dari Chengdu', shortTitle: 'Bipenggou dari Chengdu',
    route: ['Chengdu', 'Bipenggou', 'Danau Panyang', 'Chengdu'],
    overnight: { name: 'Chengdu', detail: 'Malam ketiga dari empat di Chunxi Road.' },
    transport: 'Bus bersama Trip.com 100144400 (paket B): kumpul 05.40 di Yatai Building (亚太大厦), Jinjiang; sekitar 4 jam di taman; kembali ke titik kumpul ±19.15. Tiket masuk termasuk.',
    intro: 'Satu hari penuh ke Bipenggou dan kembali ke Chengdu malamnya, tanpa menginap di lembah. Hari ini Jumat dan hari terakhir libur sekolah Chengdu, jadi taman bisa ramai, dan salat Jumat terlewat karena bus baru kembali malam.',
    steps: [
      ['±05.20', 'Ke titik kumpul', 'Jalan atau DiDi ke Yatai Building (亚太大厦), Jinjiang; titik dan jam pasti dikirim pengelola sehari sebelumnya. Bawa paspor, bekal, baju hangat berlapis.'],
      ['05.40', 'Bus berangkat', 'Bus bersama ke Bipenggou. Subuh masuk sekitar pukul 06.00: salat di kursi atau saat bus berhenti.'],
      ['Pagi–siang', 'Perjalanan ke Bipenggou', 'Lewat Dujiangyan dan Lixian; tur sejenis menyebut sekitar 3 jam, lama perjalanan paket ini belum tercantum.'],
      ['±4 jam', 'Di dalam Bipenggou', 'Bus taman naik ke Shanghaizi, lalu Danau Panyang (±3.680 m) dan Yanziyan (3.837 m) bila waktu cukup. Zuhur dijamak dengan Asar, dengan bekal makan siang. Mobil listrik di atas belum tentu termasuk; cek di halaman paket.'],
      ['Sore', 'Bus kembali', 'Kembali ke Chengdu; tiba di titik kumpul sekitar 19.15 menurut halaman tur. Maghrib dan Isya dijamak takhir di hotel.'],
      ['±19.30', 'Makan malam, tidur awal', 'Makan malam halal dekat hotel; besok kumpul 06.00 untuk Siguniangshan.'],
    ],
    stops: [
      { place: 'bipenggou', note: 'Sekitar 4 jam di taman, dengan bus taman dari gerbang.' },
    ],
    notes: [],
    risks: [
      'Sebagian besar sekolah di Chengdu libur 11–13 November, jadi hari ini masih ramai; siap antre bus taman.',
      'Bus naik sekitar 1.300 m dalam satu pagi; bergerak pelan di 3.600–3.800 m.',
      'Pertengahan November adalah akhir warna musim gugur; salju pertama dan es tipis di jalur kayu mungkin terjadi.',
      'Pertunjukan Twin Towers Jumat 20.00 terlewat karena bus baru tiba ±19.15.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-14', title: 'Siguniangshan sehari dari Chengdu', shortTitle: 'Siguniang dari Chengdu',
    route: ['Chengdu', 'Terowongan Balang', 'Shuangqiao Valley', 'Chengdu'],
    overnight: { name: 'Chengdu', detail: `Malam keempat di Chunxi Road, sebelum D239 besok pagi. ${calmStayPicks('2026-11-14')}` },
    transport: 'Tur gabung Trip.com 89377156 (paket J): kumpul 06.00 di Asia Pacific Building (亚太大厦) atau Zongfu Building, Jinjiang; bus besar sekitar 4 jam sekali jalan lewat terowongan Balang; tiket, bus wisata Shuangqiao Valley, dan pemandu termasuk.',
    intro: 'Tur sehari ke Siguniangshan, ke Shuangqiao Valley (双桥沟) di balik terowongan Balang: lembah dengan puncak salju dan hutan larch. Makan siang bayar sendiri, jadi bawa bekal. Malam ini tidur awal karena D239 berangkat 08.33 besok.',
    steps: [
      ['±05.30', 'Ke titik kumpul', 'Ke titik kumpul di Jinjiang; detail dikirim lewat SMS pukul 19.00–21.00 malam sebelumnya. Bawa paspor, bekal, baju hangat.'],
      ['06.00', 'Bus berangkat', 'Bus besar ke Siguniangshan. Subuh di kursi atau saat bus berhenti.'],
      ['Pagi', 'Perjalanan', 'Sekitar 4 jam lewat Dujiangyan, Wolong, dan terowongan Balang (perkiraan dari tur sejenis).'],
      ['Siang', 'Shuangqiao Valley', 'Bus wisata di dalam lembah sudah termasuk. Zuhur dijamak dengan Asar, dengan bekal makan siang. Lama di lembah belum tercantum di halaman tur.'],
      ['Sore–malam', 'Kembali ke Chengdu', 'Kembali ke titik kumpul; jam tiba belum tercantum. Maghrib dan Isya dijamak takhir di hotel.'],
      ['Malam', 'Siapkan D239', 'Beli bekal halal untuk kereta 9 jam besok dan untuk 16–17 November di Shangri-La. Kemas koper besar; check-out 07.30.'],
    ],
    stops: [
      { place: 'maobiliang', note: 'Siguniangshan: tur ke Shuangqiao Valley; titik pandang Maobiliang hanya bila bus berhenti di sana (tidak disebut paket ini).' },
      { place: 'chengdu', note: 'Malam terakhir di Chunxi Road sebelum D239.' },
    ],
    notes: [],
    risks: [
      'Dua tur subuh berturut-turut, lalu D239 08.33: hari yang berat. Bila lelah, batalkan salah satu sebelum batas pembatalan.',
      'Larch mungkin sudah lewat puncak warna pada pertengahan November; laporan 2026 belum dicari.',
      'Jalan gunung lewat Balang bisa bersalju; jam pulang belum tercantum.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-15', title: 'D239 dari Chengdu South ke Lijiang', shortTitle: 'Kereta D239 ke Lijiang',
    route: ['Chengdu South', 'D239', 'Lijiang', 'Dayan'],
    overnight: { name: 'Lijiang', elevation: '2.400 m', detail: `Dekat Kota Tua Lijiang; 166 Hotel juga pilihan rencana utama untuk 18 November. ${calmStayPicks('2026-11-15')}` },
    transport: 'DiDi 8,3 km ke Chengdu South (sisihkan 20–30 menit); D239 08.33–17.46 (kelas dua CNY 376); taksi ke kota tua, sekitar 10 km, 25–40 menit, CNY 30–50 per mobil.',
    intro: 'Sembilan jam kereta pemandangan dari cekungan Sichuan ke Yunnan. Malam ini di Lijiang dulu, bukan langsung ke Shangri-La, supaya tidak naik dari 500 m ke 3.300 m dalam sehari.',
    steps: [
      ['±05.59', 'Subuh', 'Subuh di hotel.'],
      ['±07.30', 'Check-out, ke Chengdu South', 'Check-out; DiDi dengan koper ke Chengdu South.'],
      ['±07.50', 'Pemeriksaan paspor', 'Pemeriksaan paspor dan keamanan. Menurut China Railway, setiap barang bawaan paling besar 160 cm (panjang + lebar + tinggi) dan bagasi gratis 20 kg; koper 28–30 inci yang penuh biasanya lebih dulu melewati 20 kg, jadi timbang sebelum berangkat.'],
      ['08.33', 'Kereta D239 ke Lijiang', 'D239 ke Lijiang, 9 jam 13 menit. Rekam video dari jendela; makan dari bekal halal.'],
      ['±12.51–13.10', 'Zuhur + Asar di kereta', 'Zuhur di kereta (12.51 di Chengdu, 13.06 di Lijiang), dijamak takdim dengan Asar.'],
      ['17.46', 'Tiba di Lijiang', 'Tiba di Stasiun Lijiang. Matahari terbenam 18.29.'],
      ['±18.00–18.45', 'Ke hotel, Maghrib', 'Taksi atau DiDi ke hotel. Maghrib 18.31; bila perlu dijamak dengan Isya (19.51) di hotel.'],
      ['±19.15–20.30', 'Makan malam halal', 'Makan malam di kedai Hui bertanda 清真 dekat kota tua (belum diverifikasi, sama seperti rencana utama). Beli bekal halal untuk sarapan dan makan siang 16 November, juga siang 17 November.'],
      ['Malam', 'Siapkan mobil besok', 'Pastikan mobil 08.30 dan tempat untuk koper.'],
    ],
    stops: [
      { place: 'chengdu-south', note: 'D239 berangkat 08.33; tiba 30–45 menit lebih awal.' },
      { place: 'lijiang-station', note: 'Tiba 17.46.' },
      { place: 'dayan', note: 'Malam pertama di Lijiang, hotel yang sama dengan 18 November.' },
    ],
    notes: [],
    risks: [
      'Koper 28–30 inci yang penuh bisa melewati 20 kg. Halaman Trip.com menulis batas 130 cm per barang, lebih ketat dari 160 cm menurut China Railway.',
      'D239 satu-satunya kereta langsung Chengdu–Lijiang di Trip.com; bila batal, harus ganti kereta di Kunming.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-16', title: 'Upper Tiger Leaping Gorge, dua kafe tebing, lalu Shangri-La', shortTitle: 'Upper Gorge & kafe tebing',
    route: ['Lijiang', 'Hutiaoxia', 'Upper Tiger Leaping Gorge', 'Tea Horse', 'MoYe', 'Shangri-La'],
    overnight: { name: 'Shangri-La', elevation: '3.300 m', detail: `Dukezong, malam pertama dari dua, dalam satu kamar untuk 16–18 November. ${calmStayPicks('2026-11-16')} Duge punya resepsionis 24 jam dan pemanas tanpa oksigen; Jianyi punya oksigen tetapi hanya satu ranjang queen.` },
    transport: 'Mobil sewa dengan koper, ±211 km: Lijiang → Upper Gorge 81 km (OSRM 1 jam 17 menit); → Tea Horse 7 km (13 menit); → MoYe 12 km (16 menit); → Dukezong 111 km (OSRM 1 jam 43 menit). Waktu OSRM tanpa macet; jalan desa dan gunung bisa lebih lama.',
    intro: 'Hari darat di Tiger Leaping Gorge sisi Shangri-La: pagi ke tepi sungai di Upper Gorge, lalu dua kafe di atas ngarai, Tea Horse Guesthouse dengan teras menghadap Jade Dragon dan kafe tebing MoYe, sebelum naik ke Shangri-La. Kedua kafe dicapai dengan mobil; jalur High Trail di antaranya tetap tidak didaki.',
    steps: [
      ['±06.12', 'Subuh & sarapan', 'Subuh. Sarapan dari bekal yang dibeli semalam. Matahari terbit 07.40.'],
      ['08.00', 'Berangkat dengan mobil sewa', 'Mobil sewa dari hotel dengan koper, setengah jam lebih awal karena hari ini ada dua kafe. Taksi bisa sampai ke pintu 166 Hotel menurut ulasan September 2026.'],
      ['±08.00–09.30', 'Ke Upper Tiger Leaping Gorge', 'Lijiang → kota Hutiaoxia (Qiaotou) → Upper Tiger Leaping Gorge (上虎跳, sisi Shangri-La), 81 km; OSRM 1 jam 17 menit tanpa macet.'],
      ['±09.30–11.30', 'Upper Tiger Leaping Gorge', 'Upper Gorge: tiket CNY 45 (FieldGuide); eskalator CNY 80 pulang-pergi (Qunar dan Trip.com); buka 08.00–18.00 dengan masuk terakhir 18.00 (Ctrip dan Trip.com). Belum diketahui apakah sinar matahari langsung sampai ke sungai; menjelang siang lebih mungkin daripada 08.30, tetapi belum diverifikasi.'],
      ['±11.30–11.45', 'Mobil ke Tea Horse', 'Naik jalan desa ke Tea Horse Guesthouse (茶马客栈), sekitar 7 km dan 13 menit menurut OSRM. Sebuah panduan 2026 menyebut mobil dari Qiaotou ke sini sekitar 20 menit.'],
      ['±11.45–12.45', 'Teras kopi Tea Horse', 'Teras kayu Tea Horse menghadap puncak Jade Dragon di seberang ngarai: minum teh atau kopi, makan siang dari bekal halal. Trip.com mencantumkan kafe, restoran, dan bar; harga minuman belum dicek. Jangan jalan ke High Trail di sekitarnya: jalur itu dilarang.'],
      ['±12.45–13.00', 'Mobil ke MoYe', 'Lanjut sekitar 12 km dan 16 menit (OSRM) ke hotel MoYe di samping Jembatan Shenchuan, Desa Bendiwan.'],
      ['±13.00–14.15', 'Kafe tebing MoYe', 'Kafe dan restoran MoYe (墨野·雪山悬崖酒店): jendela kaca dua lantai di tebing ngarai. Tamu luar boleh minum dan memotret menurut ulasan 2026; restoran buka 11.00–21.00 menurut Trip.com. Parkir khusus tamu hotel, jadi sopir menurunkan lalu menunggu. Telepon dulu (+86 186 8797 3666) untuk memastikan tamu luar diterima hari itu.'],
      ['±14.15–16.00', 'Ke Shangri-La', 'MoYe → Dukezong, sekitar 111 km (OSRM 1 jam 43 menit tanpa macet).'],
      ['±16.00–16.30', 'Check-in, Zuhur + Asar', 'Check-in di Dukezong. Zuhur dijamak takhir dengan Asar (Asar mulai 16.10).'],
      ['±16.30–17.30', 'Istirahat, adaptasi ketinggian', 'Istirahat. Kamu tidur sekitar 900 m lebih tinggi dari semalam, lebih dari batas 500 m per malam dalam panduan CDC.'],
      ['±17.30–18.55', 'Dukezong sore', 'Dukezong dekat hotel saja: cahaya emas mulai 17.55, matahari terbenam 18.29, langit biru sampai ±18.53.'],
      ['18.31', 'Maghrib & makan malam', 'Maghrib; Isya 19.52. Makan malam dari bekal halal. Belum ada kedai halal yang terverifikasi buka: dua daftar Ctrip (阿润清真小吃, 友兴回族牛肉馆) berstatus "merchant offline" pada 5 November.'],
    ],
    stops: [
      { place: 'upper-tiger-leaping-gorge', note: 'Sekitar 09.30–11.30. Tiket CNY 45, eskalator CNY 80 pulang-pergi (tarif tidak resmi).' },
      { place: 'tea-horse-guesthouse', note: 'Sekitar 11.45–12.45: teras kopi dan makan siang dari bekal. Masih menerima tamu (Trip.com menjual kamar untuk 16 November); harga kafe belum dicek.' },
      { place: 'moye-cliff-cafe', note: 'Sekitar 13.00–14.15: kafe tebing, tamu luar boleh menurut ulasan 2026. Harga dan aturan belanja minimum belum dicek.' },
      { place: 'dukezong', note: 'Sore ini dekat hotel saja; dua malam di sini.' },
    ],
    notes: [
      { text: 'Trek High Trail tidak dimasukkan karena resmi dilarang: pemberitahuan Pemerintah Kota Shangri-La 10 Februari 2026 mengancam denda CNY 100–5000, dan pengelola menutup seluruh High Trail sejak 1 Mei 2026.', links: [highTrailNotice, highTrailOperator] },
    ],
    risks: [
      'Belum ada penawaran untuk mobil satu arah ini, dan harga di rincian biaya hanya perkiraan. Minta penawaran tertulis yang mencantumkan lama berhenti dan tempat untuk koper 28–30 inci.',
      'Naik sekitar 900 m dalam semalam: sore ini dibuat ringan dan 17 November santai.',
      'Hari panjang, ±8 jam dengan mobil sewa: bila terlambat, lewati MoYe lebih dulu, karena jaraknya paling jauh dari jalan ke Shangri-La.',
      'Kedua kafe ada di kawasan High Trail. Pendakian di jalur itu dilarang sejak 2026; mampir dengan mobil ke penginapan di desa tidak disebut dalam larangan, tetapi aturan di lapangan bisa berbeda. Ikuti petugas bila diminta putar balik.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-17', title: 'Hari santai di Shangri-La, Napahai sore, temanmu tiba', shortTitle: 'Shangri-La santai',
    route: ['Dukezong', 'Napahai', 'Dukezong'],
    overnight: { name: 'Shangri-La', elevation: '3.300 m', detail: 'Hotel dan kamar twin yang sama di Dukezong, malam kedua dari dua, berdua mulai malam ini.' },
    transport: 'Jalan kaki; taksi opsional ke Napahai, 11,5 km (OSRM 15 menit).',
    intro: 'Hari penuh pertama di 3.300 m, jadi sengaja ringan. Napahai sore hanya bila tidak pusing. Temanmu tiba dari Kunming dan bergabung untuk makan malam, sama seperti rencana utama.',
    steps: [
      ['±06.16', 'Subuh, tidur lagi', 'Subuh. Tidur lagi; ini hari penuh pertamamu di 3.300 m.'],
      ['±08.30–13.00', 'Santai & sunting foto', 'Sarapan, istirahat, sunting dan cadangkan foto. Tanyakan ke hotel pintu masuk Napahai yang gratis. Menurut catatan Ctrip (Maret 2025) ada titik berbayar di padang Yila; Travelofchina memperingatkan pungutan "tiket kamera" yang tidak resmi.'],
      ['13.09', 'Zuhur', 'Zuhur; Asar 16.10. Menjamak boleh selama masih musafir.'],
      ['Siang', 'Temanmu tiba', 'Kereta temanmu dari Kunming (12306, 4–5 November): sarankan C118 (tiba 14.25) atau C86 (15.00) supaya sempat istirahat sebelum makan malam. C638 tiba 18.40; C642 (22.25) hanya pilihan terakhir.'],
      ['±15.30–18.30', 'Napahai (opsional)', 'Opsional, hanya bila tidak pusing: cagar alam Napahai (纳帕海), sekitar 8 km barat laut Dukezong. Cahaya emas mulai 17.55, matahari terbenam 18.28. Temanmu ikut bila datang dengan C118 atau C86 dan merasa sehat.'],
      ['18.31', 'Maghrib', 'Maghrib di Napahai, atau dijamak dengan Isya (19.52) di hotel.'],
      ['±19.15–20.30', 'Makan malam berdua', 'Makan malam berdua dari bekal; belum ada kedai halal terverifikasi. Selesaikan pembayaran dan urusan koper untuk berangkat 07.30 besok; Duge punya resepsionis 24 jam, resepsionis Jianyi baru buka 08.30.'],
    ],
    stops: [
      { place: 'napahai', note: 'Opsional, sore. Masuk gratis menurut catatan Ctrip (Maret 2025) dan Travelofchina (2025); WestChinaGo (tanpa tanggal) menulis CNY 60. Taksi dari kota CNY 15–30 (Ctrip) atau CNY 40–60 (Travelofchina). Pada musim kering danau menyusut, bahkan menjadi rawa.' },
      { place: 'dukezong', note: 'Temanmu bergabung malam ini.' },
    ],
    notes: [],
    risks: [
      'Temanmu naik dari ±1.900 m (Kunming) ke 3.300 m dalam sehari, lalu ke ±4.506 m di Glacier Park 19 November setelah dua malam di ketinggian, sama seperti rencana utama.',
      'Dengan C642 (tiba 22.25), temanmu baru sampai hotel sekitar 23.00 untuk berangkat 07.30.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-18', title: 'Songzanlin pagi, jalur kayu Pudacuo, kereta sore ke Lijiang', shortTitle: 'Songzanlin & Pudacuo',
    route: ['Dukezong', 'Songzanlin', 'Pudacuo', 'Stasiun Shangri-La', 'Lijiang'],
    overnight: { name: 'Lijiang', elevation: '2.400 m', detail: `Dekat Kota Tua Dayan, tiba malam. ${calmStayPicks('2026-11-18')} Sepakati dengan sopir: jemput 06.30 besok, koper ikut di mobil seharian.` },
    transport: 'Taksi atau DiDi Dukezong ↔ Songzanlin (±6 km, OSRM 7 menit); shuttle Trip.com pulang-pergi Dukezong ↔ Pudacuo (sekitar 40 menit sekali jalan), bus taman di dalam Pudacuo; taksi ke Stasiun Shangri-La (±6 km); C442 19.02 → Lijiang 20.15; taksi ke kota tua.',
    intro: 'Hari kedua bersama temanmu. Pagi atap emas Songzanlin, lalu jalan santai di jalur kayu tepi Danau Shudu di Pudacuo, hutan dan padang rumput di ±3.600 m. Sore di Lijiang dilepas karena kota tua sudah dikunjungi 15 November; kereta sore baru berangkat setelah gelap.',
    steps: [
      ['±06.15', 'Subuh & sarapan', 'Subuh (±06.14). Sarapan dari bekal halal yang dibeli semalam; siapkan juga bekal makan siang untuk di Pudacuo, karena belum ada makanan halal yang ditemukan di sana.'],
      ['±07.15', 'Check-out, titip koper', 'Check-out dan titip koper di hotel sampai sore. Bayar dan atur titipan semalam bila resepsionis baru buka siang.'],
      ['±07.30', 'Taksi ke Songzanlin', 'Taksi atau DiDi ke 松赞林景区游客中心, sekitar 6 km dan 7 menit tanpa macet (OSRM).'],
      ['±07.45–08.30', 'Danau Lamuyangcuo', 'Validasi dua tiket dengan paspor, shuttle ke biara, lalu Danau Lamuyangcuo (拉姆央措湖) lebih dulu selagi matahari rendah; cahaya emas di danau habis ±08.20.'],
      ['±08.30–09.45', 'Aula biara Songzanlin', 'Naik tangga ke aula Zhacang dan Jikang pelan-pelan, ±3.300 m. Di dalam aula jangan memotret; pakai celana yang menutup lutut.'],
      ['±10.00–10.45', 'Kembali ke Dukezong', 'Shuttle turun, lalu taksi ke Dukezong. Istirahat sebentar dan cek jam shuttle Pudacuo di voucher.'],
      ['±11.00', 'Shuttle ke Pudacuo', 'Shuttle Trip.com dari Dukezong ke pintu Pudacuo, sekitar 40 menit. Jam 11.00 dari daftar produk Qunar; pakai jam di voucher.'],
      ['±11.45–15.30', 'Jalur kayu Danau Shudu', 'Bus taman ke Danau Shudu (属都湖, ±3.595 m), lalu jalan santai di jalur kayu tepi danau, sekitar 3,3 km, 2–3 jam. Padang Militang (弥里塘) dilihat dari bus. Kawasan Danau Bita (碧塔海) diumumkan tutup di Trip.com; ikuti petunjuk di gerbang. Makan siang dari bekal; Zuhur (±13.05) dijamak takdim dengan Asar di tempat kering.'],
      ['±15.30–16.30', 'Shuttle kembali', 'Shuttle kembali ke Dukezong; jam pulangnya belum dicek, jadi tanyakan saat naik. Masuk terakhir taman 16.00.'],
      ['±16.30–17.45', 'Ambil koper, makan', 'Ambil koper, makan hangat, dan beli bekal halal untuk malam ini dan besok pagi.'],
      ['±17.45–18.15', 'Taksi ke stasiun', 'Taksi atau DiDi ke Stasiun Shangri-La (香格里拉站), sekitar 6 km dan 8 menit tanpa macet.'],
      ['±18.30', 'Maghrib', 'Maghrib di stasiun, atau dijamak takhir dengan Isya di hotel Lijiang.'],
      ['19.02', 'Kereta C442 ke Lijiang', 'C442 Shangri-La 19.02 → Lijiang 20.15, kelas dua CNY 70, dua kursi (12306, 6 November). Lebih awal bila Pudacuo selesai cepat: C88 17.25 → 18.35.'],
      ['±20.15–21.00', 'Ke kota tua, check-in', 'Taksi dari Stasiun Lijiang ke gerbang kota tua terdekat hotel (±10 km, 25–40 menit), lalu jalan kaki dengan koper. Check-in, Isya, makan dari bekal.'],
      ['Malam', 'Siapkan besok', 'Pastikan sopir 06.30 dengan koper di mobil seharian, tiket kawasan dan shuttle Jade Dragon untuk dua paspor, slot kereta gantung 15.00–15.30, dan tiket Impression Lijiang 13.20.'],
    ],
    stops: [
      { place: 'songzanlin', note: 'Sekitar 07.45–09.45: danau dulu, lalu aula.' },
      { place: 'pudacuo', note: 'Sekitar 11.45–15.30: jalur kayu Danau Shudu. Paket Trip.com CNY 178 per orang termasuk shuttle dari Dukezong.' },
      { place: 'shangrila-station', note: 'C442 19.02 ke Lijiang.' },
    ],
    notes: [
      { text: 'Pudacuo menggantikan sore di Kota Tua Dayan dari rencana utama, karena opsi santai sudah bermalam di kota tua Lijiang pada 15 November. Tiket masuk saja hanya dijual lewat akun WeChat resmi taman; paket Trip.com menyertakan tiket, bus taman, dan shuttle dari Dukezong.', links: [{ label: 'Trip.com: Pudacuo (dicek 6 November 2026)', url: 'https://www.trip.com/travel-guide/attraction/shangri-la/potatso-national-park-85835/?scene=ticket' }] },
    ],
    risks: [
      'Temanmu baru semalam di ±3.300 m, dan jalur Pudacuo ±3.600 m: jalan pelan, banyak minum, dan putar balik bila pusing.',
      'Jam shuttle pulang dari Pudacuo belum dicek; C442 19.02 memberi jeda lebih dari dua jam, dan C990 20.25 jadi cadangan terakhir.',
      'Jam buka November berbeda antarsumber (08.00–16.00 atau 08.30–16.00); Trip.com menulis masuk terakhir 16.00.',
    ],
    fromMain: false,
  },
];

// 8 November's plan and practical notes prepare the main plan's C5746 06.14; the calm option spends 9 November morning in Dujiangyan and enters the park on 10 November.
const mondayTrainNote: CalmNote = { text: 'Di opsi santai, Senin pagi dipakai ke toko buku Zhongshu Ge Dujiangyan, sore di Taikoo Li dekat hotel, lalu kereta C5756 17.05 dari Chengdu East ke Huanglongjiuzhai (lihat Hari 2). Kereta C5746 06.14 di Info praktis milik rencana utama dan tidak dipakai di sini.', links: [] };

// The main plan's first night ends early for the 06.14 train; the calm option leaves late on 9 November, so its evening differs.
const mainFirstDay = fromMainPlan('2026-11-08');
const calmFirstEvening: TimelineStep[] = [
  ['±21.10–21.40', 'Siapkan tas untuk besok', 'Pisahkan tas kecil untuk 9–13 November (Jiuzhaigou dan Bipenggou, bawa baju hangat) dari koper besar, yang dititip di hotel bila hotel setuju. Cek e-tiket C5756 17.05 Chengdu East → Huanglongjiuzhai dan isi semua baterai.'],
  ['±21.45', 'Tidur', 'Tidur. Besok tanpa kereta subuh: check-out ±08.30, DiDi ke Zhongshu Ge 08.45; sore Taikoo Li lalu kereta 17.05.'],
];
const chengduHalalDay1Note: CalmNote = {
  text: 'Resto 清真 dekat Chunxi / Taikoo Li untuk 8 November (dicek 6 November 2026): 苏坦·中东料理 The Sultan di Taikoo Li lantai 2 unit 2307B (Middle Eastern/Turkish, sekitar CNY 135 per orang, jam 11.00–22.00 menurut IslamiChina) untuk makan siang telat atau makan malam sebelum / sesudah SKP; 皇城坝牛肉 Huangchengba Beef di 三桂前街49号 dekat Masjid Huangcheng (buka sekitar 10.30–22.00, Google Maps) bila mau 清真 klasik. Di IFS belum ditemukan cafe/resto 清真 terverifikasi. Cek label 清真 di pintu.',
  links: [{ label: 'IslamiChina: The Sultan Taikoo Li', url: 'https://www.islamichinatravel.com/destination-guide/chengdu/chengdu-halal-restaurants/the-sultan-taikoo-li-branch/' }],
};
const calmFirstDayLunch: TimelineStep = ['±15.00–15.45', 'Makan siang halal', 'Makan siang telat 清真 dekat Chunxi / Taikoo Li. Pilihan utama di mall: 苏坦·中东料理 The Sultan, lantai 2 Taikoo Li unit 2307B (IslamiChina: Middle Eastern/Turkish, sekitar CNY 135 per orang, 11.00–22.00; dicek 6 November 2026). Alternatif klasik dekat Masjid Huangcheng: 皇城坝牛肉 Huangchengba Beef, 三桂前街49号, sekitar 10.30–22.00 (Google Maps, 6 November 2026). Di IFS belum ada opsi 清真 terverifikasi. Sekalian beli bekal berlabel 清真 untuk makan malam di SKP dan 9–10 November, ditambah cadangan tahan lama untuk 11–13 November. Belum ada kedai 清真 terverifikasi di dekat SKP.'];
const calmFirstDay: CalmDay = {
  ...mainFirstDay, adjusted: true,
  intro: 'Tiba dari Shanghai setelah transit semalam di Pudong. Check-in di Mcsrh Hotel dekat Chunxi Road (sudah dipesan), makan siang telat 清真 di Taikoo Li atau Huangchengba, lalu sore sampai malam di Menara Vitality, Chengdu SKP. Besok tidak ada kereta subuh: pagi ke Zhongshu Ge, sore Taikoo Li, lalu kereta C5756 ke Jiuzhaigou.',
  steps: [...mainFirstDay.steps.slice(0, -calmFirstEvening.length).map(step => step[0] === '±15.00–15.45' ? calmFirstDayLunch : step), ...calmFirstEvening],
  notes: [...(mainFirstDay.notes ?? []), chengduHalalDay1Note, mondayTrainNote],
};

export const calmDays: CalmDay[] = [{ ...calmFirstDay, overnight: { name: 'Chengdu', detail: 'Mcsrh Hotel Chunxi Road Taikoo Li (Mcsrh麦嘉·拾趣酒店, 春熙路太古里店), sudah dipesan untuk satu malam: Room M1, Rp292.719. Besok pagi koper bisa dititip di sini sebelum ke Zhongshu Ge.' } }, ...calmOwnDays, ...['2026-11-19', '2026-11-20', '2026-11-21'].map(fromMainPlan)];
/** "Sekilas hari ini": what to carry and the one thing not to miss, each restating a fact from that day's plan. */
export interface CalmGlance { bring: string; remember: string }
export const calmGlance: Record<string, CalmGlance> = {
  '2026-11-08': { bring: 'Paspor, bekal halal, power bank', remember: 'Menara Vitality wajib: datang selagi masih terang.' },
  '2026-11-09': { bring: 'Kamera, baterai cadangan, bekal makan malam', remember: 'C5756 17.05 di Chengdu East: di stasiun ±16.45.' },
  '2026-11-10': { bring: 'Bekal siang, air, jaket, baterai cadangan', remember: 'Keluar taman paling lambat 17.30.' },
  '2026-11-11': { bring: 'Paspor, bekal siang, air, jaket, baterai cadangan', remember: 'Tur jemput 07.30 di Leyu; kereta C6364 16.25 dari 黄龙九寨 ke Chengdu.' },
  '2026-11-12': { bring: 'Uang tunai untuk bekal', remember: 'Beli bekal halal untuk dua tur; tidur paling lambat 21.30.' },
  '2026-11-13': { bring: 'Paspor, bekal siang, baju hangat berlapis, baterai cadangan', remember: 'Kumpul 05.40 di Yatai Building, Jinjiang.' },
  '2026-11-14': { bring: 'Paspor, bekal siang, baju hangat', remember: 'Kumpul 06.00 di Jinjiang; malam kemas koper untuk D239 08.33.' },
  '2026-11-15': { bring: 'Bekal halal untuk 9 jam di kereta', remember: 'D239 berangkat 08.33 dari Chengdu South.' },
  '2026-11-16': { bring: 'Bekal makan siang dan air', remember: 'Mobil 08.00; malam ini tidur di ±3.300 m, jalan pelan dan banyak minum.' },
  '2026-11-17': { bring: 'Jaket dan air', remember: 'Napahai hanya bila tidak pusing.' },
  '2026-11-18': { bring: 'Paspor untuk dua tiket, bekal makan siang', remember: 'Kereta C442 berangkat 19.02 ke Lijiang.' },
  '2026-11-19': { bring: 'Jaket tebal, bekal, dan paspor', remember: 'Mobil 06.30; slot kereta gantung 15.00–15.30.' },
  '2026-11-20': { bring: 'Koper siap sebelum 10.45', remember: 'D8704 berangkat 17.42 dari 大理站 (Xiaguan).' },
  '2026-11-21': { bring: 'Paspor dan tiket pesawat', remember: 'MF8426 20.05: ke bandara ±16.30; koper diteruskan sampai Jakarta.' },
};

export const calmStopIds = calmDays.flatMap(day => day.stops.map(stop => stop.place));
/** The calm option's own days that stop at any of these places; a guide the main plan never visits links to them. */
export const calmVisitDays = (placeIds: string[]) => calmDays.filter(day => !day.fromMain && day.stops.some(stop => placeIds.includes(stop.place)));

export const calmComparison = {
  dropped: [
    'Sichuan barat: 理小路 ke Rilong dan Siguniangshan, Danba, Moshi Park, Tagong, Xinduqiao, Kangding, dan G318 ke Litang (11–14 November).',
    'Daocheng dan Yading: Haizi Shan, Riwa, Chonggu, Luorong, Milk Lake, Five-Colour Lake, dan Pearl Lake (15–16 November), lalu jalan Xiangcheng dan Daxueshan ke Shangri-La (17 November).',
    'Kereta kembali ke Chengdu dan bus ke Lixian pada 10 November, juga malam di Lixian.',
    'Berangkat 05.15 pada 9 November di rencana utama: opsi santai pagi ke Zhongshu Ge, sore Taikoo Li, kereta C5756 17.05, dan baru masuk taman keesokan paginya.',
  ],
  added: [
    'Malam kedua di Jiuzhaigou: 9 November tiba malam, lalu 10 November seharian di taman dengan satu tiket. Selain Five Flower Lake dan Shuzheng, hari itu juga ke Mirror Lake, Long Lake, Five-Colour Pond, Nuorilang, dan Pearl Shoals.',
    'Huanglong seharian dengan tur kecil (11 November), lalu kereta sore ke Chengdu.',
    'Empat malam di Chengdu (11–14 November): hari istirahat 12 November, tur sehari ke Bipenggou (13 November) dan ke Siguniangshan, Shuangqiao Valley (14 November).',
    'Toko buku Zhongshu Ge di Dujiangyan, wajib: Senin 9 November pagi saat toko baru buka; sore Taikoo Li / IFS; lalu C5756 ke Jiuzhaigou.',
    'Kereta pemandangan D239 Chengdu South → Lijiang (15 November).',
    'Upper Tiger Leaping Gorge di perjalanan darat ke Shangri-La (16 November).',
    'Dua malam di Shangri-La, dengan 17 November sebagai hari santai dan Napahai opsional.',
  ],
};

export const calmTradeOffs = [
  'Dataran tinggi Sichuan barat dan Yading hilang seluruhnya: tidak ada Litang (4.014 m), danau Yading, atau G318. Risiko ketinggian dan jalan tanah ikut berkurang.',
  'Bipenggou dan Siguniangshan jadi tur sehari dari Chengdu, sekitar 3–4 jam sekali jalan: tidak ada pagi atau sore di lembah, tetapi tanpa mobil pribadi dan tanpa pindah penginapan. Salat Jumat 13 November terlewat karena bus Bipenggou baru kembali ±19.15.',
  '9 November jadi hari panjang: DiDi pulang-pergi sekitar 58 km sekali jalan ke Zhongshu Ge pagi, sore di Taikoo Li, lalu C5756 17.05 (tiba Huanglongjiuzhai 19.10) dan taksi ke gukou.',
  'Libur sekolah Chengdu 11–13 November, ditambah akhir pekan, jatuh tepat di Huanglong dan Bipenggou: siap antre dan beli tiket lebih dulu.',
  'Malam 16 November naik sekitar 900 m sekaligus dari Lijiang ke Shangri-La, jadi 17 November dibuat ringan.',
  'Penginapan dekat gerbang Bipenggou di atas batas Rp500.000 selama libur sekolah; yang di bawah batas sekitar 10 menit berkendara dari gerbang.',
];

const tripcomTrain = (from: string, to: string) => `https://id.trip.com/trains/china/route/${from}-to-${to}/`;


// Stays are derived from calm-stays.ts: one card per calm base, and one for the nights shared with the main plan.
const stayBooking = (base: CalmStayBase): CalmBooking => ({
  date: base.nights[0], until: base.nights.length > 1 ? base.nights[base.nights.length - 1] : undefined,
  item: `${base.name}, malam ${nightList(base.nights)}`, urgency: 'now',
  price: base.booked ? base.hotel.price : stayPicksText(base), booked: base.booked ? base.hotel.priceNote : undefined,
  channel: `${[...new Set([base.hotel, base.hostel].map(stay => stay.links[0].label))].join(' atau ')}; dua pilihan per malam beserta sumbernya di halaman Hotel & hostel santai.`,
  opens: 'Bisa dipesan sekarang.', link: { label: 'Hotel & hostel santai', url: calmStaysHref(base.nights[0]) },
});
const sharedNights = calmStayBases.filter(base => base.fromMain).flatMap(base => base.nights);

export const calmBookingGroups: CalmBookingGroup[] = [
  {
    id: 'tickets', title: 'Tiket dan kereta', lead: 'Yang paling cepat habis di atas.',
    items: [
      { date: '2026-11-10', item: 'Jiuzhaigou + bus taman, 10 November', paid: 756757, urgency: 'now', price: 'CNY 280 (CNY 190 + bus CNY 90), tarif musim ramai sampai 15 November menurut halaman tiket resmi; Trip.com menjualnya untuk 10 November pada 5 November. Slot 08.00–10.00. Satu tiket cukup karena 9 November tidak masuk taman.', cost: { min: 277, max: 277, per: 'orang' }, booked: 'Sudah dipesan di Trip.com pada 6 November: Admission + Sightseeing Bus, Adult (Non-Chinese mainland visitors), 10 November, slot 08.00–10.00, Rp756.757 (sekitar CNY 277), status dikonfirmasi.', channel: 'Trip.com: Admission + Sightseeing Bus, Adult (Non-Chinese mainland visitors); cadangan mini program 九寨沟旅游官方平台, dengan daftar tunggu bila habis.', opens: 'Sudah dijual; kuota 41.000 per hari dan pernah habis. Stok dirilis setiap hari 08.00 dan 17.00, dan tiket yang dibatalkan kembali ke stok (Guangming, 4 Oktober 2026).', link: { label: 'Trip.com: Jiuzhaigou', url: 'https://www.trip.com/travel-guide/attraction/jiuzhaigou/jiuzhaigou-national-park-89895/?scene=ticket' } },
      { date: '2026-11-09', item: 'C5756 Chengdu East 17.05 → Huanglongjiuzhai 19.10, satu kursi', paid: 441861, urgency: 'now', mode: 'train', price: 'CNY 143 kelas dua, CNY 230 kelas satu (12306 / Trip.com, dicek 6 November; kursi kelas dua dan satu tersedia). Setelah tiba 19.10, bus 团子出行 terakhir (17.30) sudah lewat: siapkan taksi/DiDi dari area resmi stasiun ke gukou (acuan CNY 220–280) atau shuttle stasiun Trip.com bila ada.', cost: { min: 162, max: 162, per: 'orang' }, booked: 'Sudah dibeli di Trip.com pada 6 November: satu kursi, Rp441.861 (sekitar CNY 162).', channel: 'Trip.com, atau 12306 sebagai cadangan.', opens: 'Sudah dijual. Pesan segera; Senin sore East sering penuh mendekati tanggal.', link: { label: 'Trip.com: Chengdu ke Huanglongjiuzhai', url: tripcomTrain('chengdu', 'huanglongjiuzhai') } },
      { date: '2026-11-09', item: 'Cadangan: C5786 Chengdu East 18.38 → Huanglongjiuzhai 20.48, atau C6376 14.34 + bus 17.30', urgency: 'now', mode: 'train', alternative: true, price: 'C5786 CNY 143 kelas dua (12306, 6 November). C6376 14.34 → 16.58 CNY 143 + bus 团子出行 17.30 CNY 51 (bus terakhir) bila berangkat lebih awal dari East.', cost: { min: 143, max: 194, per: 'orang' }, channel: 'Kereta: Trip.com atau 12306. Bus: 团子出行 dengan nama asli; belum pasti menerima paspor asing.', opens: 'Sudah dijual.', link: { label: 'Trip.com: Chengdu ke Huanglongjiuzhai', url: tripcomTrain('chengdu', 'huanglongjiuzhai') } },
      { date: '2026-11-09', item: 'Cadangan: shuttle Trip.com Chengdu → Jiuzhaigou, jemput Xinnanmen 14.00', urgency: 'now', mode: 'shuttle', alternative: true, price: 'IDR 328.648 untuk 9 November, sekitar CNY 120 (Trip.com, 6 November). Ordinary car tersedia; Nanny car tidak. OSRM 418 km / ±4 jam 48 menit tanpa macet.', cost: { min: 120, max: 120, per: 'orang' }, channel: 'Trip.com shuttle Individual, titik jemput Xinnanmen Bus Station (新南门汽车站).', opens: 'Sudah dijual. Hanya bila kursi kereta habis atau ingin tiba siang–sore.', link: { label: 'Trip.com: Jiuzhaigou, bagian shuttle', url: 'https://www.trip.com/travel-guide/attraction/jiuzhaigou/jiuzhaigou-national-park-89895/?scene=ticket' } },
      { date: '2026-11-11', item: 'C6364 Huanglongjiuzhai 16.25 → Chengdu East 18.07, satu kursi', urgency: 'now', mode: 'train', price: 'Kursi kelas dua dan satu tersedia (12306, dicek 8 November 2026); harga belum dicek, arah sebaliknya (C5756) kelas dua CNY 143. Cadangan: C6374 17.30 → 20.09, C5798 18.19 → 20.39.', channel: 'Trip.com, atau 12306 sebagai cadangan; pilih stasiun 黄龙九寨, bukan 松潘.', opens: 'Sudah dijual.', link: { label: 'Trip.com: Huanglongjiuzhai ke Chengdu', url: tripcomTrain('huanglongjiuzhai', 'chengdu') } },
      { date: '2026-11-13', item: 'Bus bersama Chengdu → Bipenggou → Chengdu, tiket masuk termasuk', urgency: 'now', mode: 'bus', price: 'CNY 407 per orang untuk 13 November (Trip.com 100144400 paket B, dicek 8 November 2026): bus 43 kursi, tiket Bipenggou, sopir berbahasa Mandarin; kumpul 05.40 Yatai Building, Jinjiang; ±4 jam di taman; kembali ±19.15.', cost: { min: 407, max: 407, per: 'orang' }, channel: 'Trip.com.', opens: 'Sudah dijual.', link: { label: 'Trip.com: bus Chengdu–Bipenggou', url: 'https://id.trip.com/things-to-do/detail/100144400?locale=en-ID&curr=IDR' } },
      { date: '2026-11-14', item: 'Tur gabung Chengdu → Siguniangshan (Shuangqiao Valley) → Chengdu', urgency: 'now', mode: 'bus', price: 'CNY 359 per orang untuk 14 November (Trip.com 89377156 paket J, dicek 8 November 2026): bus besar, tiket, bus wisata lembah, dan pemandu; makan siang tidak termasuk; kumpul 06.00 di Jinjiang.', cost: { min: 359, max: 359, per: 'orang' }, channel: 'Trip.com; pilih paket J (Group Tour), bukan paket K (privat).', opens: 'Sudah dijual.', link: { label: 'Trip.com: tur Siguniangshan', url: 'https://id.trip.com/things-to-do/detail/89377156?locale=en-ID&curr=IDR' } },
      { date: '2026-11-18', item: 'Pudacuo: tiket + bus taman + shuttle pulang-pergi dari Dukezong, 2 orang', urgency: 'week', price: 'CNY 178 per orang di Trip.com (harga normal CNY 270), dicek 6 November 2026. Tiket masuk saja hanya dijual lewat akun WeChat resmi taman; paket dengan perahu Danau Shudu CNY 243, paket dengan Songzanlin CNY 353.', cost: { min: 178, max: 178, per: 'orang' }, channel: 'Trip.com, paket shuttle; cek jam shuttle di voucher.', opens: 'Bisa dipesan sampai sehari sebelumnya; pembatalan bersyarat. Masuk terakhir 16.00.', link: { label: 'Trip.com: Pudacuo', url: 'https://www.trip.com/travel-guide/attraction/shangri-la/potatso-national-park-85835/?scene=ticket' } },
      { date: '2026-11-18', item: 'Songzanlin, 2 orang', urgency: 'onsite', price: 'Trip.com CNY 55, atau CNY 75 dengan shuttle pulang-pergi; acuan loket CNY 90. Tarif shuttle di loket belum pasti sejak pengumuman 27 Agustus 2026.', cost: { min: 55, max: 90, per: 'orang' }, channel: 'Trip.com (pesan paling lambat 17 November) atau loket dengan paspor.', opens: 'Tidak perlu reservasi; buka sekitar 07.30.', link: { label: 'Trip.com: Songzanlin', url: 'https://www.trip.com/travel-guide/attraction/shangri-la/songzanlin-scenic-spot-76335/?scene=ticket' } },
      { date: '2026-11-18', item: 'C442 Shangri-La 19.02 → Lijiang 20.15, dua kursi', urgency: 'now', mode: 'train', price: 'CNY 70 kelas dua per orang (12306, 6 November 2026; kursi tersedia). Cadangan sama harga: C88 17.25 → 18.35 (tinggal 18 kursi) dan C990 20.25 → 21.51.', cost: { min: 70, max: 70, per: 'orang' }, channel: 'Trip.com, atau 12306 sebagai cadangan; dua kursi atas nama paspor masing-masing.', opens: 'Sudah dijual.', link: { label: 'Trip.com: Shangri-La ke Lijiang', url: tripcomTrain('shangri-la', 'lijiang') } },
      { date: '2026-11-15', item: 'D239 Chengdu South 08.33 → Lijiang 17.46, satu kursi', urgency: 'now', mode: 'train', price: 'CNY 376 kelas dua (12306, 5 November); kelas satu CNY 602, tinggal 3 kursi. Tidak ada kereta tidur.', cost: { min: 376, max: 376, per: 'orang' }, channel: 'Trip.com, atau 12306 sebagai cadangan.', opens: 'Sudah dijual: tiket dibuka 15 hari sebelumnya, dan 12306 masih menunjukkan kursi kelas dua untuk 15 November pada 5 November.', link: { label: 'Trip.com: Chengdu ke Lijiang', url: tripcomTrain('chengdu', 'lijiang') } },
      { date: '2026-11-16', item: 'Tiket Upper Tiger Leaping Gorge (sisi Shangri-La)', urgency: 'onsite', price: 'CNY 45 dewasa (FieldGuide, 2 November 2026, dan panduan Ctrip tanpa tanggal); Qunar dan Trip.com tidak menjual tiket masuk saja. Eskalator opsional CNY 80 pulang-pergi atau CNY 60 naik saja (Qunar). Di Trip.com untuk 16 November: tiket dengan shuttle pulang-pergi dari Dukezong CNY 143, ditambah eskalator CNY 223.', cost: { min: 45, max: 125, per: 'orang' }, channel: 'Di lokasi, atau lewat situs pengelola.', opens: 'Buka 08.00–18.00, masuk terakhir 18.00 (Ctrip dan Trip.com). Pengelola melaporkan buka normal; longsor 30 Juli dan 3 September berada di luar area pengunjung.', link: { label: 'Pengelola Tiger Leaping Gorge', url: 'https://www.xgllhtx.cn/' } },
      { date: '2026-11-09', item: 'Toko Buku Zhongshu Ge, Dujiangyan: masuk gratis, DiDi pulang-pergi dari hotel', urgency: 'onsite', mode: 'taxi', price: 'Masuk gratis (Trip.com dan Third Eye Traveller). DiDi belum punya tarif resmi: satu pelancong (Third Eye Traveller, artikel Juni 2026) membayar sekitar CNY 100 sekali jalan, jadi sekitar CNY 200 pulang-pergi. Sekitar 58 km sekali jalan, ±45 menit tanpa macet menurut OSRM; tarif jam sibuk Senin pagi bisa berbeda.', cost: { min: 200, max: 200, per: 'mobil' }, channel: 'DiDi ke 钟书阁(融创茂店) sekitar 08.45, kembali ±11.30. Cadangan untuk pergi: Metro jalur 2 ke 犀浦, kereta S ke 都江堰 (CNY 10 di 12306 atau Trip.com; sebagian kereta tinggal sedikit kursi), lalu DiDi 10–15 menit dari stasiun.', opens: 'Tidak perlu membeli tiket. Lihat estimasi waktu dan tarif DiDi di aplikasi sebelum memesan.', link: { label: 'Panduan Zhongshu Ge', url: placePath('zhongshuge-bookstore') } },
    ],
  },
  {
    id: 'cars', title: 'Mobil: minta penawaran tertulis', lead: 'Belum ada penawaran untuk mobil mana pun; harganya perkiraan dari tarif sewa per jam Trip.com. Minta harga all-in tertulis dari sopir berizin.',
    items: [
      { date: '2026-11-11', item: 'Tur kecil Huanglong: jemput Jiuzhaigou 07.30, tiket + ropeway naik, selesai Stasiun Huanglongjiuzhai', paid: 1091136, urgency: 'now', mode: 'car', price: 'Paket B (Jiuzhaigou car departure + admission ticket + uphill ride cableway, 07.30) di Trip.com 98479842: termasuk tiket masuk, ropeway naik, mobil wisata kawasan, dan transport; tur selesai di Stasiun Huanglongjiuzhai ±14.50. Batal gratis sampai 16.00 tanggal 10 November.', cost: { min: 400, max: 400, per: 'orang' }, booked: 'Sudah dipesan di Trip.com pada 8 November: satu orang, Rp1.091.136 (sekitar CNY 400), status Confirmed.', channel: 'Trip.com; jemput di Leyu Youth Hostel dikonfirmasi CS.', opens: 'Sudah dipesan.', link: { label: 'Trip.com: tur Huanglong 98479842', url: 'https://id.trip.com/things-to-do/detail/98479842?locale=en-ID&curr=IDR' } },
      { date: '2026-11-18', item: 'Taksi Dukezong ↔ Songzanlin, lalu Dukezong → Stasiun Shangri-La', urgency: 'onsite', mode: 'taxi', price: 'Songzanlin ±6 km sekali jalan: acuan CNY 10 dari situs Songzanlin dan CNY 15 dari catatan Ctrip (Maret 2025), jadi pulang-pergi sekitar CNY 20–30 per mobil. Ke stasiun ±6 km, tarif belum ditemukan.', cost: { min: 20, max: 30, per: 'mobil' }, channel: 'Taksi atau DiDi; cek tarif di aplikasi.', opens: 'Pesan di tempat.' },
      { date: '2026-11-18', item: 'Taksi Stasiun Lijiang → kota tua Lijiang (malam)', urgency: 'onsite', mode: 'taxi', price: '±10 km, 25–40 menit; acuan CNY 30–50 per mobil (Agustus 2026).', cost: { min: 30, max: 50, per: 'mobil' }, channel: 'DiDi atau taksi resmi di pintu keluar stasiun ke gerbang kota tua terdekat hotel; mobil tidak bisa masuk gang Dayan.', opens: 'C442 tiba 20.15.' },
      { date: '2026-11-16', item: 'Mobil sewa Lijiang 08.00 → Upper Gorge → Tea Horse → MoYe → Dukezong, satu arah (berhenti ±4½ jam)', urgency: 'week', mode: 'car', price: 'Belum ada penawaran untuk rute satu arah ini; Trip.com mengarahkan sewa multi-kota ke "Ask now". Perkiraan dari sewa per jam Trip.com di Lijiang untuk 16 November (8 jam/100 km CNY 335 untuk 5 kursi, lebih CNY 5 per km): sekitar CNY 890 untuk ±211 km dengan dua kafe tebing (CNY 725 untuk ±178 km tanpa kafe), belum termasuk biaya kembali kosong dari Shangri-La dan jam lebih bila lewat 8 jam. Halaman lalu lintas pengelola ngarai (tanpa tanggal) menyebut CNY 300–800 per mobil dari Lijiang ke ngarai.', cost: { min: 890, max: 890, per: 'mobil' }, channel: 'Trip.com Car charter (multi-city) atau hotel di Lijiang; minta penawaran yang mencantumkan lama berhenti dan tempat untuk koper 28–30 inci.', opens: 'Atur sebelum 15 November.', link: { label: 'Trip.com: charter di Lijiang', url: 'https://www.trip.com/chartered-car-seo/hourly/lijiang/?curr=CNY' } },
      { date: '2026-11-16', item: 'Alternatif: tur gabung Lijiang 06.10 → Upper Gorge → Haba → Dukezong → Napahai, berakhir di Shangri-La', urgency: 'week', mode: 'car', alternative: true, price: 'Rp457.027 per orang untuk 16 November (Trip.com 104549480 Package E, rombongan maksimal 13 orang, dicek 6 November 2026), termasuk tiket, mobil, sopir, dan makan siang jamuan Tibet yang tidak halal. Upper Gorge 1,5 jam dan Napahai 1,5 jam; Tea Horse dan MoYe tidak termasuk. Package G mobil pribadi dengan rute bisa diatur Rp2.242.865 per mobil. Nilai 4,9 dari 551 ulasan.', channel: 'Trip.com; tanyakan dulu apakah koper 28–30 inci boleh ikut seharian dan antar ke hotel di Dukezong.', opens: 'Pesan paling lambat 02.59 hari itu; batal gratis sampai 18.00 sehari sebelumnya.', link: { label: 'Trip.com: tur Shangri-La + Tiger Leaping Gorge', url: 'https://id.trip.com/things-to-do/detail/104549480?locale=en-ID&curr=IDR' } },
      { date: '2026-11-16', item: 'Alternatif: shuttle satu arah Lijiang → Upper Gorge → Dukezong', urgency: 'week', mode: 'shuttle', alternative: true, price: 'CNY 100 per orang untuk 16 November di Trip.com (produk 115857784, dicek 5 November), tanpa tiket ngarai. Menurut keterangan produk yang sama di Qunar: jemput 06.30–07.00 di sekitar kota tua Lijiang, sekitar 1,5 jam di Upper Gorge mulai ±09.00, tiba di Dukezong ±11.50–12.30. Trip.com 87712606 berangkat 07.00 dengan 2 jam di ngarai, minimal 2 orang: paket gabung CNY 128 per orang, jadi CNY 256 bila membayar untuk dua.', channel: 'Trip.com; tanyakan tertulis tempat untuk koper 28–30 inci.', opens: 'Berangkat lebih pagi daripada mobil 08.00 di jadwal dan tidak singgah di kedua kafe. Qunar: batal gratis sampai 19.00 sehari sebelumnya.', link: { label: 'Trip.com: Tiger Leaping Gorge sisi Shangri-La', url: 'https://www.trip.com/travel-guide/attraction/shangri-la/shangri-la-tiger-leaping-gorge-10558694/?curr=CNY' } },
    ],
  },
  {
    id: 'stays', title: 'Penginapan', lead: 'Harga 9–17 November dicek 5 November untuk tanggal dan jumlah tamu itu; 8 dan 18–20 November sama dengan rencana utama.',
    items: [
      ...calmStayBases.filter(base => !base.fromMain).map(stayBooking),
      { date: sharedNights[0], item: `Malam ${nightList(sharedNights)}: penginapan rencana utama`, urgency: 'now', price: 'Sama dengan rencana utama; harga per malam ada di halaman Hotel & hostel santai.', channel: 'Pilihan per malam di halaman Hotel & hostel santai. Pastikan setiap penginapan menerima paspor asing sebelum membayar.', opens: 'Bisa dipesan sekarang.', link: { label: 'Hotel & hostel santai', url: calmStaysPath } },
    ],
  },
];

export const calmDoNotBuyLead = 'Dari rencana utama atau draf lama; tidak dipakai opsi ini.';
export const calmDoNotBuy = [
  'C5784 Huanglongjiuzhai → Chengdu East, shuttle 06.20, dan bus Chadianzi → Lixian, semuanya 10 November.',
  'Hotel di Lixian (Wuyoucheng) untuk 10 November.',
  'Tiket Bipenggou bertanggal 11 atau 12 November; opsi ini berkunjung 13 November.',
  'Tiket Panda Base 14 November, mobil Jiuzhaigou → Songpan → Stasiun Huanglongjiuzhai, dan C5754 bertanggal 11 November: rencana sebelum Huanglong masuk (6 November).',
  'Hotel di Chengdu untuk 13 November; opsi ini kembali ke Chengdu 14 November.',
  'C984 Shangri-La 12.00 → Lijiang 18 November dari rencana utama; opsi santai naik C442 19.02 setelah Pudacuo.',
  'Mobil dan sopir 11–12 November untuk Bipenggou → 理小路 → Rilong → Danba → Moshi → Tagong → Xinduqiao.',
  'Hotel di Rilong (11 November), Xinduqiao (12–13 November), Litang (14 November), dan Riwa (15–16 November).',
  'Tiket Moshi Park, mobil bersama di Kangding, bus Xinduqiao → Litang, bus Litang → Daocheng, dan taksi Daocheng → Riwa.',
  'Tiket Yading, mobil listrik Chonggu–Luorong, dan transfer hotel Riwa ↔ Yading.',
  'Taksi Riwa → Xiangcheng dan bus Xiangcheng → Shangri-La 17 November.',
  'Tur kelompok Sichuan barat dari daftar open trip 8–17 November.',
  'Mobil satu arah sekitar 530 km Jiuzhaigou → Hongyuan → Bipenggou; itu hanya rencana C, diputuskan 10 November malam bila prakiraan kering.',
  'Hotel dekat Chengdu South untuk 13–15 November.',
  'Dua kamar single terpisah di Shangri-La untuk 16 dan 17 November; pesan satu kamar twin untuk kedua malam.',
  'Penginapan di High Trail, titip koper untuk trek, dan transport Middle Gorge: trek tidak termasuk opsi ini.',
];

export const calmUnknowns = [
  '9 November: lama shuttle Trip.com Chengdu → Jiuzhaigou, titik turunnya, dan apakah koper 28–30 inci muat. Untuk cadangan kereta: apakah 团子出行 menerima paspor asing untuk bus 17.30, dan lama perjalanan bus itu (tidak tercantum; 1,5–2 jam menurut panduan pihak ketiga).',
  'Penawaran nyata untuk mobil Lijiang → Upper Gorge → Shangri-La (16 November); apakah mobil Huanglong 74320777 mau mengantar ke kota tua Songpan; angka di rincian biaya hanya perkiraan dari tarif sewa per jam. Juga biaya kembali kosong, apakah titik jemput dan antar (Jiuzhaigou, Stasiun Maoxian, Bipenggou, Chengdu, Shangri-La) masuk area gratis sewa Trip.com, dan apakah satu sopir lokal bisa mengambil 12 November.',
  'Penginapan: apakah promo menginap pertama Trip.com berlaku untuk lebih dari satu pemesanan per akun, apakah Xingyun mendaftarkan paspor asing, dan apakah pemilik Xinlan mau mengantar ke gerbang 12 November pagi.',
  'Bipenggou: masuk terakhir (15.00 menurut Trip.com, 15.30 menurut Tongcheng), jam bus terakhir turun, apakah tiket mobil listrik pulang-pergi boleh turun di Moon Bay dan Red Stone Beach, dan waktu berjalan kaki.',
  'Huanglong: jam taman dan ropeway November 2026 (belum diumumkan), salju atau es 11 November, dan angka ketinggian resmi.',
  'Zhongshu Ge Dujiangyan: jam buka pasti (10.00–21.00 menurut Trip.com, 09.00–20.00 atau 10.00–22.00 menurut sumber lain), aturan tripod, gimbal, dan video, keramaian Senin pagi 9 November, tarif DiDi, lama shuttle Trip.com ke Jiuzhaigou dan titik turunnya, ada tidaknya musala di mal, dan apakah masjid di 南街 Dujiangyan aktif.',
  'Kedai halal yang benar-benar buka di Shangri-La dan Dukezong (dua daftar Ctrip offline per 5 November), dan di kota tua Lijiang, yang juga belum diverifikasi rencana utama.',
  'Upper Tiger Leaping Gorge: tarif resmi tiket dan eskalator (angka di sini dari FieldGuide, Qunar, dan Trip.com), dan apakah sinar matahari sampai ke sungai pada pertengahan November.',
  'Shuttle 16 November: apakah Trip.com mengizinkan satu orang membayar paket 87712606 yang minimal dua orang, dan tempat untuk koper 28–30 inci di kedua shuttle.',
  'Napahai: tarif resmi November 2026 (sumber 2025 menyebut gratis, WestChinaGo tanpa tanggal CNY 60) dan pintu masuk mana yang gratis.',
  'Seberapa ketat petugas menerapkan batas bagasi untuk koper 28–30 inci di C6364, D239, dan C442: 160 cm dan 20 kg menurut China Railway, 130 cm per barang menurut Trip.com.',
  'Jam lampu Menara Vitality, dan apakah pertunjukan Twin Towers 14 November benar-benar berlangsung (pemberitahuan terakhir Oktober 2025).',
  'Apakah Bipenggou 3 hari 2 malam dengan satu hari penuh di taman sesuai maksudmu.',
];

// Trains, the station transfers around them and the luggage rule; the calm trains page lists these, the calm page all.
export const calmTrainSources: Link[] = [
  { label: '12306: kereta 9 November sore Chengdu → Huanglongjiuzhai (C6366, C6376, C5796, D280), kursi dan tarif C6376, dicek 6 November 2026', url: 'https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc' },
  { label: '12306: kursi dan tarif kereta 9, 11, dan 15 November (C5772, C6362, C5746, C5754, C5764, C5804, C5784, D239), dicek 5 November 2026', url: 'https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc' },
  { label: '12306: jam, kursi, dan tarif C984 18 November dan C442 19 November; D8704 pada daftar 19 November sebagai acuan 20 November (dicek 5 November 2026)', url: 'https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc' },
  { label: 'Trip.com: Chengdu ke Lijiang, hanya D239 08.33 → 17.46 (5 November 2026)', url: 'https://id.trip.com/trains/china/route/chengdu-to-lijiang/' },
  { label: 'Trip.com: Huanglongjiuzhai ke Maoxian, termasuk C5754 (5 November 2026)', url: 'https://id.trip.com/trains/china/route/huanglongjiuzhai-to-maoxian/' },
  { label: 'Trip.com: Chengdu ke Huanglongjiuzhai, penjualan 15 hari sebelumnya (5 November 2026)', url: 'https://id.trip.com/trains/china/route/chengdu-to-huanglongjiuzhai/' },
  { label: '团子出行: bus Stasiun Huanglongjiuzhai → 九寨沟口客运站 9 November, 08.00, 08.40, 10.00, 13.50, 16.00, dan 17.30 (terakhir), CNY 51 (dicek 6 November 2026)', url: 'https://www.tz12306.com/ticket/search_513224_松潘_1_513225_九寨沟_1.html' },
  { label: 'WanderInChina: transport Jiuzhaigou, bus stasiun 1,5–2 jam dan mobil pribadi CNY 220–280 (20 Mei 2026)', url: 'https://wanderinchina.com/destinations/jiuzhaigou/transport/' },
  { label: 'Trip.com 104850127: shuttle Stasiun Huanglongjiuzhai → Jiuzhaigou, jadwal mengikuti kereta, tanpa harga atau jam yang terlihat (dicek 5 November 2026)', url: 'https://us.trip.com/things-to-do/detail/104850127/' },
  { label: 'OSRM: Stasiun Huanglongjiuzhai ke pusat pengunjung Jiuzhaigou, 91,5 km (5 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/103.6133889,32.7477854;103.9167742,33.2689518?overview=false' },
  { label: '团子出行: bus Jiuzhaigou → Songpan dan Stasiun Huanglongjiuzhai 11 November (dicek 5 November 2026)', url: 'https://www.tz12306.com/ticket/search_513225_九寨沟_1_513224_松潘_1.html' },
  { label: 'OSRM: Chunxi Road ke Stasiun Chengdu South, 8,3 km (5 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/104.0739845,30.6623577;104.0660435,30.6082704?overview=false' },
  { label: 'WanderInChina: stasiun kereta Chengdu, metro 火车南站 (30 Juli 2026)', url: 'https://wanderinchina.com/destinations/chengdu/transport/train-stations/' },
  { label: 'OSRM: Stasiun Lijiang ke Dayan, 8,4 km (5 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/100.2509280,26.8138119;100.22072,26.86879?overview=false' },
  { label: 'Ctrip: catatan perjalanan, bus 16 dan 18 serta minibus dari Stasiun Lijiang ke kota tua (29 Desember 2022)', url: 'https://gs.ctrip.com/html5/you/travels/32/4084995.html' },
  { label: 'China Railway lewat People’s Daily: barang bawaan paling besar 160 cm dan 20 kg (24 Februari 2025)', url: 'https://www.peopleapp.com/column/30048338047-500006109068' },
  { label: 'China Railway lewat Yangtse Evening Post: batas 130 cm di kereta cepat untuk tripod dan joran (4 Mei 2026)', url: 'https://www.yzwb.net/news/txs/202605/t20260504_349331.html' },
];

export const calmSources: Link[] = [
  ...calmTrainSources,
  { label: 'Huanglong: pengumuman resmi (daftar terakhir 15 September 2026, tanpa penutupan; dicek 6 November 2026)', url: 'https://webad.huanglong.com/api/res/api/content/simplifyList?siteCode=site209078&channelCode=jqgg' },
  { label: 'Huanglong: musim ramai 1 Juni–15 Desember (pengumuman resmi 2022)', url: 'https://www.huanglong.com/cn/ylfw/lyxz?id=37735' },
  { label: 'Bendibao: jam ropeway Huanglong mulai 1 November 2024 (8 November 2024)', url: 'http://cd.bendibao.com/tour/2024118/191378.shtm' },
  { label: 'OSRM: gerbang Jiuzhaigou ke gerbang Huanglong, 106,5 km (6 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/103.9194,33.2668;103.82939,32.7571?overview=false' },
  { label: 'OSRM: gerbang Huanglong ke kota tua Songpan, 41 km (6 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/103.82939,32.7571;103.5962,32.6404?overview=false' },
  { label: 'Trip.com: 伊鲜特色汤锅(清真店), Songpan (dicek 6 November 2026)', url: 'https://www.trip.com/restaurant/china/songpan/detail/rest-130767055/' },
  { label: 'Chuanguan: G213 ditutup di Dingziba, Diexi; mobil penumpang dialihkan lewat Wenchuan–Maoxian (16 September 2026)', url: 'https://cbgc.scol.com.cn/news/7961183' },
  { label: 'Jimu lewat Sohu: G213 Dingziba masih ditutup dua arah (22 Oktober 2026)', url: 'https://www.sohu.com/a/1091125891_121443915' },
  { label: 'Chuanguan: tol Jiuma G0615 sampai padang Hongyuan (11 Februari 2026)', url: 'https://cbgc.scol.com.cn/news/7273820' },
  { label: 'OSRM: Jiuzhaigou ke Songpan, 104 km (5 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/103.9167742,33.2689518;103.5961504,32.6404283?overview=false' },
  { label: 'OSRM: Stasiun Maoxian ke gerbang Bipenggou, 132 km (5 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/103.9424872,31.7279208;102.9849,31.4155?overview=false&steps=true' },
  { label: 'OSRM: gerbang Bipenggou ke Chunxi Road, 200 km (5 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/102.9849,31.4155;104.0739845,30.6623577?overview=false' },
  routeGateToBookstore,
  { label: 'OSRM (FOSSGIS): Chunxi Road ke Zhongshu Ge Dujiangyan, 58,5 km, ±45 menit tanpa macet (5 November 2026)', url: 'https://routing.openstreetmap.de/routed-car/route/v1/driving/104.0739845,30.6623577;103.6218853,30.9582302?overview=false' },
  { label: 'OpenStreetMap: Zhong Shu Ge, Dujiangyan', url: 'https://www.openstreetmap.org/node/8071545317' },
  zhongshugeHours,
  { label: 'Third Eye Traveller: Zhongshu Ge Dujiangyan, DiDi 60–90 menit dan sekitar CNY 100 (30 Juni 2026)', url: 'https://thirdeyetraveller.com/dujiangyan-zhongshuge-bookstore-chengdu/' },
  { label: '12306: kereta S 犀浦 ↔ 都江堰 13 November; kelas dua CNY 10 menurut harga 14 November (dicek 5 November 2026)', url: 'https://kyfw.12306.cn/otn/leftTicket/queryG?leftTicketDTO.train_date=2026-11-13&leftTicketDTO.from_station=CDW&leftTicketDTO.to_station=DDW&purpose_codes=ADULT' },
  { label: 'OSRM: Dayan ke Upper Tiger Leaping Gorge dan Dukezong (5 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/100.22072,26.86879;100.112808,27.1926037;99.7075855,27.8105134?overview=false' },
  { label: 'Open-Meteo: ketinggian Songpan, Stasiun Maoxian, gerbang Bipenggou, dan celah rencana C (5 November 2026)', url: 'https://api.open-meteo.com/v1/elevation?latitude=32.93,32.6404283,31.7279208,31.4155&longitude=103.31,103.5961504,103.9424872,102.9849' },
  { label: 'OpenStreetMap: Kota Tua Songpan', url: 'https://www.openstreetmap.org/way/519012579' },
  { label: 'OpenStreetMap: Stasiun Maoxian', url: 'https://www.openstreetmap.org/node/5151602754' },
  { label: 'OpenStreetMap: halte Long Lake, Jiuzhaigou', url: 'https://www.openstreetmap.org/node/12993883515' },
  { label: 'OpenStreetMap: jalur pengunjung Upper Tiger Leaping Gorge', url: 'https://www.openstreetmap.org/way/708347464' },
  { label: 'OpenStreetMap: Napahai', url: 'https://www.openstreetmap.org/way/36897816' },
  { label: 'OpenStreetMap: Masjid Huangcheng', url: 'https://www.openstreetmap.org/way/582845149' },
  { label: 'Science and Technology Daily: Jiuzhai Night Market di Zhangzha, Zhuoma Market dan tari Tibet–Qiang tiap malam (21 September 2026)', url: 'https://www.stdaily.com/web/gdxw/2026-09/21/content_585121.html' },
  { label: 'Pengelola Jiuzhaigou: tiket 2 November habis, kuota 41.000, jam masuk dan tutup (31 Oktober 2026)', url: 'https://www.jiuzhai.com/news/notice/11492-2026-10-31-09-08-46' },
  { label: 'Jiuzhaigou: halaman tiket resmi (dicek 5 November 2026)', url: 'https://www.jiuzhai.com/intelligent-service/tickets' },
  { label: 'Guangming/SCTV: stok tiket Jiuzhaigou dirilis 08.00 dan 17.00 (4 Oktober 2026)', url: 'https://m.gmw.cn/2026-10/04/content_1304571698.htm' },
  { label: 'Chuanguan: Jiuzhaigou dibuka penuh lagi (30 Juli 2026)', url: 'https://cbgc.scol.com.cn/news/7808132' },
  { label: 'Ctrip: Mirror Lake, pantulan terbaik sebelum 09.00 atau setelah 17.00 (dicek 5 November 2026)', url: 'https://gs.ctrip.com/html5/you/sight/25/55313.html' },
  { label: 'Sichuan Observation lewat Guangming: libur sekolah Chengdu 11–13 November 2026 (4 September 2026)', url: 'https://m.gmw.cn/2026-09/04/content_1304558989.htm' },
  { label: 'Tongcheng: panduan Bipenggou, jam buka, bus taman, mobil listrik, dan urutan rute (27 Oktober 2026)', url: 'https://m.ly.com/trip/detail/5951976' },
  { label: 'Qunar: harga Bipenggou untuk pengunjung non-daratan (dicek 5 November 2026)', url: 'https://touch.piao.qunar.com/touch/detail.htm?id=13696' },
  { label: 'Panda Base: halaman tiket resmi, sesi November–Februari dan platform resmi (dicek 5 November 2026)', url: 'https://www.panda.org.cn/en/service/ticket/' },
  { label: 'Chuanguan: aturan tiket Panda Base 2026 dan penjual tidak resmi (30 Januari 2026)', url: 'https://cbgc.scol.com.cn/news/7233620' },
  { label: 'WanderInChina: panduan Panda Base dan Metro jalur 3 (23 Juli 2026)', url: 'https://wanderinchina.com/destinations/chengdu/chengdu-panda-base-guide/' },
  { label: 'Wikipedia: Masjid Huangcheng Chengdu', url: 'https://en.wikipedia.org/wiki/Chengdu_Huangcheng_Mosque' },
  { label: 'Trip.com: Masjid Huangcheng, telepon dan ulasan (5 November 2026)', url: 'https://uk.trip.com/moments/poi-huangcheng-mosque-13765090' },
  { label: 'Islamichinatravel: alamat Masjid Huangcheng', url: 'https://www.islamichinatravel.com/destination-guide/chengdu/chengdu-masjid/chengdu-huangcheng-mosque/' },
  { label: 'Athancity: waktu salat Chengdu, belum ada jadwal Jumat dari masjid (dicek 5 November 2026)', url: 'https://athancity.com/en/china/chengdu' },
  { label: 'Trip.com: Masjid Utara Songpan', url: 'https://ca.trip.com/travel-guide/attraction/songpan/songpan-northern-mosque-23579280?curr=THB' },
  { label: 'NU Online: jamak dan qashar saat menginap kurang dari empat hari', url: 'https://nu.or.id/syariah/menginap-di-lokasi-tujuan-masih-bolehkah-menjama-dan-mengqashar-shalat-kZnOW' },
  { label: 'Bendibao Chengdu: pertunjukan Twin Towers hanya Jumat dan Sabtu 20.00, layar menyala 19.00–22.00 (31 Oktober 2025)', url: 'https://cd.bendibao.com/xiuxian/20251031/202848.shtm' },
  { label: 'Trip.com: Tianfu Twin Towers (dicek 5 November 2026)', url: 'https://www.trip.com/travel-guide/attraction/chengdu/tianfu-twin-towers-of-chengdu-financial-city-149994616/' },
  { label: 'Pemerintah Kota Shangri-La lewat Sohu: larangan mendaki di area Haba yang belum dibuka, termasuk High Trail (10 Februari 2026)', url: 'https://www.sohu.com/a/986025656_120815119' },
  { label: 'Xiaoxiang Morning News lewat Guangming: pengelola menutup seluruh High Trail, Upper Gorge tetap buka (9 Mei 2026)', url: 'https://m.gmw.cn/2026-05/09/content_1304450375.htm' },
  { label: 'Field Guide to China: Tiger Leaping Gorge, harga Upper Gorge, eskalator, dan mobil sewa (2 November 2026)', url: 'https://fieldguidetochina.com/places/tiger-leaping-gorge/' },
  { label: 'Pengelola Tiger Leaping Gorge: status buka dan pemberitahuan longsor (dicek 5 November 2026)', url: 'https://www.xgllhtx.cn/' },
  { label: 'WanderInChina: kereta Lijiang–Shangri-La tidak berhenti di ngarai (2026)', url: 'https://www.wanderinchina.com/zh/transport/intercity/lijiang-shangri-la/' },
  { label: 'Ctrip: 阿润清真小吃, Shangri-La, "merchant offline" (dicek 5 November 2026)', url: 'https://gs.ctrip.com/html5/you/foods/106/20347983.html' },
  { label: 'Ctrip: 友兴回族牛肉馆, Shangri-La, "merchant offline" (dicek 5 November 2026)', url: 'https://gs.ctrip.com/html5/you/foods/106/18696446.html' },
  { label: 'Trip.com: tiket Bipenggou 12 November, paket non-daratan CNY 190 (dicek 5 November 2026)', url: 'https://www.trip.com/travel-guide/attraction/li-county/bipeng-valley-89964/?curr=CNY' },
  { label: 'Chuanguan: libur musim gugur sekolah Chengdu 11–13 November, menyambung akhir pekan (28 Oktober 2026)', url: 'https://cbgc.scol.com.cn/news/8095432' },
  { label: 'Trip.com 68228592: transfer pribadi Jiuzhaigou → Stasiun Huanglongjiuzhai, CNY 338 untuk 11 November (dicek 5 November 2026)', url: 'https://www.trip.com/things-to-do/detail/68228592/' },
  { label: 'Trip.com: sewa mobil per jam di Aba, 11 November, 8 jam/100 km CNY 723 (dicek 5 November 2026)', url: 'https://www.trip.com/chartered-car/hour-detail?dptCid=1838&dptName=Aba+Prefecture&queryType=1&fromPage=hourly-seo&dptDate=2026-11-11&dptTime=07%3A30' },
  { label: 'Trip.com: sewa mobil per jam di Aba, 13 November (dicek 5 November 2026)', url: 'https://www.trip.com/chartered-car/hour-detail?dptCid=1838&dptName=Aba+Prefecture&queryType=1&fromPage=hourly-seo&dptDate=2026-11-13&dptTime=07%3A45' },
  { label: 'Trip.com: halaman sewa mobil Maoxian tidak ada (404, 5 November 2026)', url: 'https://www.trip.com/chartered-car-seo/hourly/maoxian/?curr=CNY' },
  { label: 'Trip.com: sewa mobil per jam di Lijiang, 16 November, 8 jam/100 km CNY 335 (dicek 5 November 2026)', url: 'https://www.trip.com/chartered-car/hour-detail?dptCid=37&dptName=Lijiang&queryType=1&fromPage=hourly-seo&dptDate=2026-11-16&dptTime=08%3A30' },
  { label: 'Pengelola Tiger Leaping Gorge: panduan lalu lintas, sewa mobil dari Lijiang CNY 300–800 (tanpa tanggal)', url: 'https://www.xgllhtx.cn/traffic.html' },
  { label: 'Trip.com: Tiger Leaping Gorge sisi Shangri-La, shuttle satu arah CNY 100 dan paket tiket untuk 16 November (dicek 5 November 2026)', url: 'https://www.trip.com/travel-guide/attraction/shangri-la/shangri-la-tiger-leaping-gorge-10558694/?curr=CNY' },
  { label: 'Trip.com 87712606: shuttle Lijiang → Tiger Leaping Gorge → Dukezong, minimal 2 orang (dicek 5 November 2026)', url: 'https://www.trip.com/things-to-do/detail/87712606/' },
  { label: 'Qunar: 虎跳峡 (sisi Shangri-La), eskalator dan shuttle satu arah (dicek 5 November 2026)', url: 'https://touch.piao.qunar.com/touch/detail_2561958500.html' },
  { label: 'Ctrip: Upper Tiger Leaping Gorge buka 08.00–18.00 (dicek 5 November 2026)', url: 'https://you.ctrip.com/sight/xianggelila106/12236.html' },
  { label: 'Ctrip: catatan perjalanan Napahai, masuk gratis (2 Maret 2025)', url: 'https://gs.ctrip.com/html5/you/travels/106/4078637.html' },
  { label: 'Travel of China: Napa Lake (2025)', url: 'https://www.travelofchina.com/?p=15508' },
  { label: 'WestChinaGo: Napahai, CNY 60 (tanpa tanggal)', url: 'https://westchinago.com/?p=63357' },
  { label: 'Qunar: Napahai, danau musiman yang menyusut di musim kering (dicek 5 November 2026)', url: 'https://touch.travel.qunar.com/poi/702908' },
  { label: 'Klook 194211: transfer Chengdu ↔ Bipenggou (5 November 2026)', url: 'https://www.klook.com/en-US/activity/194211-private-pick-up-and-drop-off-service-one-way-between-chengdu-and-siguniang-mountain-bipenggou/' },
];
