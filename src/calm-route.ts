import { days, places, type Day, type Place } from './itinerary.ts';
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
  /** Read unchanged from the main plan. */
  fromMain: boolean;
}
/** `urgency` follows the `opens` text, as on the main preparation page; `mode` marks transport legs. `price` is the text
 * shown; `cost` is the same figure as numbers for the cost breakdown, set only when the text gives a price or estimate.
 * An `alternative` is a fallback or optional item: listed for booking, left out of the totals. */
export interface CalmBooking {
  date: string; until?: string; item: string; price: string; channel: string; opens: string; urgency: Urgency; mode?: TransportMode; link?: Link;
  cost?: Booking['cost']; alternative?: boolean;
}
/** `stays` items are the nights; the day panels list only the other groups, like the homepage. */
export interface CalmBookingGroup { id: 'tickets' | 'cars' | 'stays'; title: string; lead: string; items: CalmBooking[] }

// Stops the main plan does not visit. Names and Chinese keywords are the OpenStreetMap names used in the research.
export const calmPlaces: Record<string, Place> = {
  'mirror-lake': { name: 'Mirror Lake', chinese: '镜海', description: 'Danau panjang di lembah Rize yang memantulkan hutan dan lereng saat angin pelan.' },
  'long-lake': { name: 'Long Lake', chinese: '长海', description: 'Danau di ujung cabang Zechawa, halte terakhir bus taman di lembah itu.' },
  'five-colour-pond': { name: 'Five-Colour Pond', chinese: '五彩池', description: 'Kolam kecil biru-hijau di bawah Long Lake, dicapai lewat jalur kayu menurun.' },
  nuorilang: { name: 'Air Terjun Nuorilang', chinese: '诺日朗瀑布', description: 'Air terjun lebar di Nuorilang, tempat bus taman berganti ke cabang Rize atau Zechawa.' },
  'pearl-shoals': { name: 'Pearl Shoals', chinese: '珍珠滩瀑布', description: 'Air mengalir di atas dasar batu yang landai lalu jatuh sebagai air terjun; dilewati jalur kayu.' },
  songpan: { name: 'Kota Tua Songpan', chinese: '松潘古城', description: 'Kota bertembok sekitar 2.860 m dengan gerbang dan tembok batu, disinggahi pagi sebelum kereta ke Maoxian.' },
  'songpan-mosque': { name: 'Masjid Utara Songpan', chinese: '松潘清真北寺', description: 'Masjid di Shuncheng North Road, patokan untuk makan siang halal. Belum dicek apakah musafir boleh salat di dalam.' },
  'maoxian-station': { name: 'Stasiun Maoxian', chinese: '茂县站', description: 'Stasiun kereta sekitar 9 km dari pusat Kabupaten Maoxian. Sopir yang dipesan menjemput di sini.' },
  'huangcheng-mosque': { name: 'Masjid Huangcheng', chinese: '皇城清真寺', description: 'Masjid di Qingyang, di barat stasiun metro Tianfu Square, tempat salat Jumat 13 November.' },
  'panda-base': { name: 'Panda Base Chengdu', chinese: '成都大熊猫繁育研究基地', description: 'Pusat penangkaran panda raksasa di utara kota. November–Februari sesi pagi 08.00–12.00; panda paling aktif tak lama setelah buka.' },
  'tianfu-twin-towers': { name: 'Tianfu Twin Towers', chinese: '天府双塔', description: 'Dua menara Financial City berlayar LED, dilihat dari danau Jiaozi Park atau jembatan 交子之环. Pertunjukan tematik hanya Jumat dan Sabtu 20.00.' },
  'chengdu-south': { name: 'Stasiun Chengdu South', chinese: '成都南站', description: 'Stasiun keberangkatan D239 ke Lijiang, sekitar 8 km dari hotel di Chunxi Road.' },
  'upper-tiger-leaping-gorge': { name: 'Upper Tiger Leaping Gorge', chinese: '上虎跳峡', description: 'Bagian hulu ngarai di sisi Shangri-La. Jalur pengunjung dan eskalator turun ke tepi Sungai Jinsha.' },
  napahai: { name: 'Napahai', chinese: '纳帕海', description: 'Danau musiman dan padang rumput di cagar alam sekitar 8 km barat laut Dukezong.' },
};

export const placeFor = (id: string): Place | undefined => calmPlaces[id] ?? places[id];

// New map points (WGS84 from OpenStreetMap, checked 5 November 2026); the shared towns reuse the main map's points.
export const calmMapPoints: Record<string, MapPoint> = {
  songpan: { name: 'Songpan', latitude: 32.6404283, longitude: 103.5961504, label: 'w' },
  maoxian: { name: 'Maoxian', latitude: 31.7279208, longitude: 103.9424872, label: 'e' },
  'long-lake': { name: 'Long Lake', latitude: 33.0436025, longitude: 103.9318624 },
  'upper-gorge': { name: 'Upper Gorge', latitude: 27.1926037, longitude: 100.112808, label: 'w' },
  dujiangyan: at('dujiangyan', 'Dujiangyan'),
};

// Legs for the calm days; 8 and 18–21 November use the main map's legs.
export const calmLegs: Record<string, MapLeg[]> = {
  '2026-11-09': [...go('car', 'chengdu', 'dujiangyan', 'chengdu'), ...go('car', 'chengdu', 'jiuzhaigou')],
  '2026-11-10': go('bus', 'jiuzhaigou', 'long-lake', 'jiuzhaigou'),
  '2026-11-11': [...go('car', 'jiuzhaigou', 'songpan', 'huanglongjiuzhai'), ...go('train', 'huanglongjiuzhai', 'maoxian'), ...go('car', 'maoxian', 'bipenggou')],
  '2026-11-12': [],
  '2026-11-13': go('car', 'bipenggou', 'chengdu'),
  '2026-11-14': [],
  '2026-11-15': go('train', 'chengdu', 'lijiang'),
  '2026-11-16': go('car', 'lijiang', 'upper-gorge', 'shangri-la'),
  '2026-11-17': [],
};
// Day numbers moved off other numbers and legs on the calm map, in map pixels.
export const calmBadgeShifts: Record<string, readonly [number, number]> = { '2026-11-08': [10, -19], '2026-11-09': [25, 5], '2026-11-10': [36, -4], '2026-11-12': [-15, 37], '2026-11-13': [-16, 18], '2026-11-14': [9, 13], '2026-11-16': [-8, -14] };
// Days that stay in one place name their local transport in the day list.
export const calmLocalModes: Record<string, Mode[]> = { '2026-11-12': ['bus'], '2026-11-14': ['car'] };

// Short bold actions for the main plan's steps on the shared days, in step order; the main plan's text becomes the detail.
// Only the calm view uses them, so the main plan's own pages keep their single-line steps.
const mainStepTitles: Record<string, string[]> = {
  '2026-11-08': ['Subuh & sarapan di Pudong', 'Check-in Juneyao', 'Terbang ke Chengdu', 'Mendarat di Tianfu', 'Taksi ke hotel Chunxi Road', 'Check-in & Zuhur', 'Makan siang halal', 'Asar di hotel', 'DiDi ke Chengdu SKP', 'Keliling SKP selagi terang', 'Foto cahaya keemasan', 'Maghrib', 'Langit biru & lampu menara', 'Bila lampu telat menyala', 'Twin Towers (opsional)', 'DiDi ke hotel', 'Isya di hotel', 'Cek tiket besok', 'Tidur'],
  '2026-11-18': ['Subuh', 'Check-out, titip koper', 'Ke Songzanlin', 'Validasi tiket', 'Danau Lamuyangcuo', 'Aula biara Songzanlin', 'Turun, naik shuttle', 'Ambil koper, ke stasiun', 'Kereta C984 ke Lijiang', 'Tiba di Lijiang', 'Ke kota tua', 'Check-in, Zuhur + Asar', 'Sore bebas', 'Naik ke tempat tinggi', 'Lentera & langit senja', 'Maghrib & Isya', 'Makan malam halal', 'Dayan & Sifangjie malam', 'Siapkan besok'],
  '2026-11-19': ['Subuh', 'Mobil ke Jade Dragon', 'Ganhaizi (opsional)', 'Masuk kawasan', 'Blue Moon Valley', 'Shuttle kembali', 'Masuk teater', 'Impression Lijiang', 'Ke halte shuttle', 'Slot kereta gantung', 'Glacier Park', 'Turun', 'Mobil ke Stasiun Lijiang', 'Maghrib + Isya', 'Kereta C442 ke Dali', 'Taksi ke penginapan'],
  '2026-11-20': ['Subuh', 'Ke Dermaga Caicun', 'Erhai pagi', 'Sarapan halal', 'Check-out, titip koper', 'Menara Wuhua & kota tua', 'Salat Jumat', 'Makan siang halal', 'Kota tua sore', 'Asar, ke Stasiun Dali', 'Kereta D8704 ke Kunming', 'Ke penginapan Kunming', 'Maghrib & Isya', 'Atur transfer bandara'],
  '2026-11-21': ['Subuh', 'Green Lake (opsional)', 'Sarapan & check-out', 'Bila terbang lebih awal', 'Ke bandara', 'Terbang ke Jakarta'],
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
    overnight: { name: 'Jiuzhaigou', elevation: '±2.000 m', detail: `Malam pertama dari dua dekat gerbang (Pengfeng/Goukou). ${calmStayPicks('2026-11-09')}` },
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
      ['17.05', 'Kereta C5756 ke Huanglongjiuzhai', 'C5756 Chengdu East 17.05 → Huanglongjiuzhai 19.10, kelas dua CNY 143 (12306 / Trip.com, dicek 6 November). Maghrib sekitar 18.09 jatuh di kereta; jamak takhir dengan Isya di penginapan.'],
      ['±19.10–20.30', 'Tiba stasiun, ke gukou & check-in', 'Tiba Huanglongjiuzhai 19.10. Bus 团子出行 terakhir hari itu 17.30 sudah lewat, jadi naik taksi/DiDi dari area resmi stasiun ke penginapan dekat gerbang (sekitar 1,5–2 jam / ±90 km; acuan mobil Mei 2026 CNY 220–280) atau shuttle stasiun Trip.com bila tersedia. Check-in di Pengfeng/Goukou.'],
      ['Malam', 'Salat & makan malam', 'Maghrib dan Isya dijamak takhir. Makan bekal, atau di restoran 清真 Pengfeng (ulasan September 2025). Bila masih kuat dan pasar buka, Jiuzhai Night Market (九寨夜市) di Zhangzha bisa dilihat sebentar; jam buka November belum ketemu dan jajanannya belum tentu halal.'],
      ['±21.30', 'Siapkan besok, tidur', 'Cek tiket 10 November (slot 08.00–10.00), isi baterai, lalu tidur.'],
    ],
    stops: [
      { place: 'zhongshuge-bookstore', note: 'Wajib. Sekitar 10.00–11.15, saat toko baru buka. Masuk gratis. Jam buka 10.00–21.00 menurut Trip.com; sumber lain berbeda.' },
      { place: 'chengdu', note: 'Sore di Chunxi / Taikoo Li / IFS dekat hotel; koper diambil ±16.00 sebelum ke Chengdu East.' },
      { place: 'chengdu-east', note: 'C5756 17.05 → Huanglongjiuzhai 19.10.' },
      { place: 'jiuzhaigou-hotel', note: 'Dua malam, 9 dan 10 November, dekat zona pengunjung.' },
    ],
    notes: [
      { text: 'Toko buku dipindah dari Jumat 13 November ke pagi ini. Senin 9 November hari kerja dan belum masuk libur sekolah Chengdu (11–13 November), sedangkan Jumat sore jatuh di hari terakhir libur sekolah.', links: [zhongshugeHours] },
      { text: 'Sore kota sengaja di Taikoo Li / IFS dekat hotel, bukan Kuanzhai atau Doll House (Manhattan Nature), supaya buffer ke Chengdu East untuk C5756 17.05 tetap longgar.', links: [] },
      { text: 'Resto 清真 9 November (dicek 6 November 2026): Huangchengba Beef dekat masjid untuk Zuhur; The Sultan di Taikoo Li lantai 2 untuk sore. Cek label 清真 di pintu. Sumber: Google Maps (Huangchengba jam 10.30–22.00) dan IslamiChina (The Sultan).', links: [{ label: 'IslamiChina: The Sultan Taikoo Li', url: 'https://www.islamichinatravel.com/destination-guide/chengdu/chengdu-halal-restaurants/the-sultan-taikoo-li-branch/' }] },
    ],
    risks: [
      'C5756 tiba 19.10, setelah bus 团子出行 terakhir (17.30). Siapkan taksi/DiDi dari area resmi stasiun atau shuttle stasiun Trip.com; sepakati harga sebelum naik. Belum pasti 团子出行 menerima paspor asing pada bus siang (bila suatu saat ganti ke C6376).',
      'Bila DiDi kembali dari Dujiangyan terlambat, persingkat Taikoo Li / IFS; prioritas koper dan buffer ke East sebelum 16.45.',
      'Bila kursi C5756 habis: C5786 Chengdu East 18.38 → 20.48 (CNY 143), atau cadangan lebih awal C6376 14.34 → 16.58 lalu bus 团子出行 17.30 (CNY 51), atau shuttle Trip.com 14.00 dari Xinnanmen Bus Station.',
      'Jam buka toko berbeda antarsumber: 10.00–21.00 (Trip.com), 09.00–20.00 (Third Eye Traveller, Juni 2026), 10.00–22.00 (9sc.cn, Mei 2025). Telepon toko +86 28 6142 7881 (Trip.com) sebelum berangkat.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-10', title: 'Jiuzhaigou seharian: Mirror Lake pagi, Five Flower Lake siang', shortTitle: 'Jiuzhaigou seharian',
    route: ['Jiuzhaigou', 'Mirror Lake', 'Long Lake', 'Nuorilang', 'Five Flower Lake', 'Pearl Shoals', 'Shuzheng', 'Jiuzhaigou'],
    overnight: { name: 'Jiuzhaigou', elevation: '±2.000 m', detail: 'Penginapan yang sama, malam kedua dari dua.' },
    transport: 'Jalan kaki atau taksi ke gerbang; bus taman (cabang Rize dan Zechawa berpisah di Nuorilang). Lama perjalanan bus belum dicek.',
    intro: 'Satu hari penuh di taman dengan satu tiket, masuk saat gerbang buka. Mirror Lake selagi angin pagi pelan, Long Lake dan Five-Colour Pond menjelang siang, Five Flower Lake dan Pearl Shoals saat matahari tinggi, lalu Shuzheng menjelang sore.',
    steps: [
      ['±05.58', 'Subuh & sarapan', 'Subuh di hotel; sarapan dari bekal halal. Bawa bekal makan siang dan air; jangan mengandalkan makanan di taman.'],
      ['±07.30', 'Jalan ke gerbang', 'Jalan kaki atau taksi ke gerbang. Matahari terbit 07.31.'],
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
      ['18.08', 'Maghrib & makan malam', 'Maghrib; Isya 19.33. Makan malam halal di Pengfeng. Beli sarapan dan camilan untuk mobil 11 November.'],
      ['±20.30', 'Cek perjalanan besok', 'Pastikan mobil 07.30, tiket C5754, dan penjemputan di Maoxian. Cek pengumuman jalan Aba dan Sichuan untuk G213 Maoxian–Wenchuan. Pindah ke rencana B (C5784 09.04) hanya bila kereta, mobil, atau jalan itu batal.'],
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
      'Hanya satu hari di taman. Tiket bisa habis: 2 November dinyatakan habis pada batas 41.000 pengunjung (pengumuman 31 Oktober). Bila tiket 10 November habis, cadangannya tiket 9 November slot 12.00–14.00, karena bus 10.00 tiba di gerbang sekitar 11.30–12.00.',
      'Pemesanan atas nama asli (人证合一): paspor harus cocok, satu tiket per identitas per tanggal.',
      'Seluruh taman dibuka lagi 30 Juli 2026 setelah longsor 26 Juli. Jalur masih bisa ditutup karena cuaca.',
      'Lama perjalanan bus taman dan jalur kayu belum dicek, jadi urutan ini padat. Bila mundur, persingkat Shuzheng lebih dulu.',
      'Angin bisa datang sebelum 09.00; pantulan Mirror Lake tidak dijamin.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-11', title: 'Kota tua Songpan, kereta ke Maoxian, mobil ke Bipenggou', shortTitle: 'Songpan ke Bipenggou',
    route: ['Jiuzhaigou', 'Songpan', 'Huanglongjiuzhai', 'Maoxian', 'Bipenggou'],
    overnight: { name: 'Bipenggou', elevation: '±2.250 m', detail: `Malam pertama dari dua dekat gerbang, di tengah libur sekolah Chengdu. ${calmStayPicks('2026-11-11')} Xinlan sekitar 1,7 km dari gerbang; Xingyun sekitar 10 menit berkendara.` },
    transport: 'Mobil sewa dengan koper Jiuzhaigou → Songpan (104 km) → Stasiun Huanglongjiuzhai (13 km); C5754 14.14 → Maoxian 15.00 (kelas dua CNY 66); mobil pesanan Maoxian → Wenchuan → Lixian → gerbang Bipenggou (132 km).',
    intro: 'Pengganti mobil 530 km lewat padang rumput: total sekitar 3,5 jam menyetir dengan kereta pendek di tengahnya, tanpa celah 3.900 m. Pagi di kota tua Songpan dengan makan siang halal dekat masjid, lalu kereta pendek dan mobil ke gerbang Bipenggou. G213 masih ditutup di Diexi, utara Maoxian; ruas Maoxian–Wenchuan tetap dibuka untuk mobil penumpang.',
    steps: [
      ['±05.59', 'Subuh, sarapan, check-out', 'Subuh di hotel; sarapan; check-out.'],
      ['±07.30', 'Berangkat dengan mobil sewa', 'Mobil sewa dengan koper di bagasi. Matahari terbit 07.32; cahaya emas habis ±08.07, jadi berangkat lebih pagi tidak banyak gunanya.'],
      ['±07.30–09.15', 'Perjalanan ke Songpan', 'Jiuzhaigou → Chuanzhusi → Songpan, 104 km (OSRM 1 jam 16 menit; sisihkan ±1¾ jam di jalan gunung).'],
      ['±09.15–11.15', 'Kota tua Songpan', 'Kota tua Songpan (±2.860 m): tembok dan gerbang, lalu bagian luar Masjid Utara Songpan (松潘清真北寺, Shuncheng North Road; minta izin sebelum memotret). Sopir menjaga koper.'],
      ['±11.15–12.15', 'Makan siang halal', 'Makan siang halal di restoran 清真 dekat masjid (belum ada nama yang terverifikasi). Beli makanan hangat untuk malam ini, ditambah makanan berlabel 清真 yang bisa dipanaskan sendiri dan roti untuk 12–13 November.'],
      ['±12.52', 'Zuhur + Asar (jamak)', 'Zuhur dijamak takdim dengan Asar, karena waktu Asar (15.49) jatuh di kereta dan mobil. Salat di masjid bila musafir diizinkan (belum dicek), atau di sudut tenang.'],
      ['±13.15–13.30', 'Ke Stasiun Huanglongjiuzhai', 'Mobil ke Stasiun Huanglongjiuzhai, 13 km (OSRM 12 menit). Pemeriksaan paspor dan keamanan; koper paling besar 160 cm (panjang + lebar + tinggi) dan bagasi 20 kg menurut China Railway.'],
      ['14.14', 'Kereta C5754 ke Maoxian', 'C5754 ke Maoxian, tiba 15.00. Lebih awal: C5764 12.14 → 13.06 bila Songpan selesai ±11.00, tetapi tidak menambah waktu di taman karena masuk terakhir Bipenggou 15.00–15.30. Cadangan lebih siang: C5804 15.15 → 16.08.'],
      ['±15.00–15.15', 'Temui sopir di Maoxian', 'Temui sopir pesanan di Stasiun Maoxian (茂县站), sekitar 9 km dari pusat Kabupaten Maoxian. Belum diketahui apakah DiDi menjemput di sini.'],
      ['±15.15–17.30', 'Mobil ke Bipenggou', 'Maoxian → G213 ke selatan → Wenchuan → G4217 → Lixian → gerbang Bipenggou, 132 km (OSRM 1 jam 35 menit; sisihkan 2–2¼ jam).'],
      ['±17.30', 'Check-in', 'Check-in. Cahaya emas mulai 17.37 hanya mengenai puncak; matahari terbenam 18.12.'],
      ['18.14', 'Maghrib & makan malam', 'Maghrib; Isya 19.38. Makan malam dari bungkusan Songpan; minta air panas atau ketel ke pemilik penginapan. Atur tumpangan ke gerbang pukul 07.30.'],
      ['Rencana B', 'Bila kereta atau jalan batal', 'Bila kereta, sopir Maoxian, atau G213 Maoxian–Wenchuan batal: shuttle 06.20 dari 九寨沟口长途客运站 (CNY 51) → C5784 Huanglongjiuzhai 09.04 → Chengdu East 10.45 (ada kursi per 5 November). Lalu Klook 194211 Chengdu → Bipenggou (harganya belum terverifikasi), atau metro ke Chadianzi dan bus 13.30 ke Lixian (CNY 75). Rencana ini melewatkan Songpan dan lewat Chengdu.'],
      ['Rencana C', 'Rute padang rumput (tidak disarankan)', 'Tidak disarankan; hanya bila prakiraan kering, diputuskan 10 November malam. Mobil berangkat 06.45 lewat Songpan, Hongyuan, dan tol 久马高速 G0615 ke Bipenggou: ±537 km, 8–9 jam menyetir, celah ±3.900 m. Tiba ±17.30–18.30, bisa setelah gelap. Tanpa berhenti foto bila belum sampai Hongyuan pukul 14.00.'],
    ],
    stops: [
      { place: 'songpan', note: 'Sekitar 09.15–11.15, sopir menjaga koper.' },
      { place: 'songpan-mosque', note: 'Makan siang halal di sekitarnya, lalu Zuhur dan Asar dijamak takdim.' },
      { place: 'huanglongjiuzhai', note: 'C5754 14.14 ke Maoxian.' },
      { place: 'maoxian-station', note: 'Tiba 15.00; sopir pesanan menunggu di sini.' },
      { place: 'bipenggou-gate', note: 'Dua malam dekat gerbang: Xinlan sekitar 1,7 km, Xingyun sekitar 10 menit berkendara.' },
    ],
    notes: [],
    risks: [
      'G213 Maoxian–Wenchuan dibuka menurut pengumuman pengalihan 16 September; pengumuman yang lebih baru belum dicek. Longsor batu memindahkan hari ini ke rencana B.',
      'Tiga kendaraan dalam sehari: mobil, kereta, mobil. C5754 yang terlambat masih menyisakan sekitar 3 jam sebelum matahari terbenam.',
      'Penjemputan di Maoxian: belum ada produk di Trip.com atau Klook dan belum ada penawaran; harga di rincian biaya hanya perkiraan dari tarif sewa per jam.',
      'Belum ada restoran halal di dekat Bipenggou atau di Lixian. Sarapan penginapan tidak disebut halal, jadi belanja bekal di Songpan.',
      'Penginapan di gerbang jatuh di libur sekolah Chengdu (11–13 November): tidak ada kamar di bawah batas dalam 2 km dari gerbang, dan stok tinggal 1–3 kamar pada 5 November.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-12', title: 'Bipenggou seharian', shortTitle: 'Bipenggou seharian',
    route: ['Gerbang Bipenggou', 'Longwang Lake', 'Danau Panyang', 'Yanziyan', 'Shanghaizi', 'Gerbang Bipenggou'],
    overnight: { name: 'Bipenggou', elevation: '±2.250 m', detail: 'Penginapan yang sama, malam kedua dari dua.' },
    transport: 'Tumpangan penginapan, mobil, atau jalan kaki ke gerbang; bus taman wajib (26 km, 40–45 menit, ditambah ±20 menit berhenti di Longwang Lake saat naik); mobil listrik Shanghaizi ↔ Panyang ↔ Yanziyan.',
    intro: 'Satu hari penuh di taman, dengan dua malam di gerbang. Itulah arti "3 hari 2 malam" di opsi ini: hari pertama habis untuk perjalanan, hari ketiga untuk berangkat ke salat Jumat di Chengdu.',
    steps: [
      ['±06.02', 'Subuh & siapkan bekal', 'Subuh. Sarapan dari bekal dengan air panas. Siapkan makan siang, air, baju hangat berlapis, dan baterai cadangan.'],
      ['±07.30', 'Ke pusat pengunjung', 'Ke pusat pengunjung: dari Xinlan 1,7 km menanjak, lebih dari 30 menit jalan kaki; dari Xingyun ±10 menit naik mobil. Libur sekolah: siap antre.'],
      ['08.00', 'Gerbang buka', 'Gerbang buka (08.00–17.30 menurut Tongcheng, 27 Oktober 2026). Masuk terakhir 15.00 menurut Trip.com atau 15.30 menurut Tongcheng; anggap 15.00. Tukar voucher non-daratan dengan paspor. Minum obat antimabuk.'],
      ['±08.15–09.20', 'Bus ke Shanghaizi', 'Bus taman naik, berhenti ±20 menit untuk foto di Longwang Lake (龙王海), sampai Shanghaizi (±3.560 m). Rekam video saat naik; kendaraan kabarnya tidak berhenti saat turun.'],
      ['±09.20–10.45', 'Danau Panyang', 'Mobil listrik ke Danau Panyang (磐羊湖, ±3.680 m). Jalur kayu di tepi danau selagi air tenang: blok foto utama.'],
      ['±10.45–11.45', 'Yanziyan (3.837 m)', 'Mobil listrik Panyang → Yanziyan (燕子岩窝, 3.837 m); 30–40 menit di atas.'],
      ['±11.45–13.15', 'Moon Bay & Red Stone Beach', 'Turun melewati Moon Bay (月亮湾) dan Red Stone Beach (红石滩) ke arah Panyang; belum pasti mobil listrik pulang boleh berhenti di sana. Zuhur 12.55 di tempat kering, dengan bekal makan siang. Kamu masih musafir (menginap kurang dari empat hari, menurut NU Online), jadi Zuhur boleh dijamak dengan Asar.'],
      ['±13.15–14.45', 'Zhuoma Beach & Air Terjun Bailong', 'Panyang → Zhuoma Beach → Air Terjun Bailong → Shanghaizi, mengikuti rute Tongcheng; naik kendaraan atau jalan kaki belum dicek.'],
      ['±15.00–16.00', 'Bus turun', 'Bus taman turun. Jam bus terakhir tidak diumumkan, jadi tinggalkan Shanghaizi paling lambat ±15.15. Asar 15.53 di gerbang.'],
      ['±16.30–18.15', 'Istirahat', 'Istirahat, salin kartu memori, isi baterai. Cahaya emas mulai 17.37 hanya di puncak; matahari terbenam 18.12.'],
      ['18.14', 'Maghrib, siapkan besok', 'Maghrib; Isya 19.37. Pastikan mobil 07.45 ke Chengdu.'],
    ],
    stops: [
      { place: 'bipenggou', note: 'Danau Panyang ±3.680 m dan Yanziyan 3.837 m; bus taman wajib dari gerbang.' },
    ],
    notes: [],
    risks: [
      'Sebagian besar sekolah di Chengdu libur 11–13 November (Rabu–Jumat); Shuangliu mengumumkannya resmi (Sichuan Observation lewat Guangming, 4 September 2026). Siap antre bus taman.',
      'Bus naik sekitar 1.300 m dalam satu pagi; bergerak pelan di 3.600–3.800 m.',
      'Pertengahan November adalah akhir warna musim gugur; salju pertama dan es tipis di jalur kayu mungkin terjadi.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-13', title: 'Bipenggou ke Chengdu, salat Jumat', shortTitle: 'Salat Jumat di Chengdu',
    route: ['Bipenggou', 'Chengdu', 'Masjid Huangcheng', 'Chunxi Road'],
    overnight: { name: 'Chengdu', detail: `Chunxi Road, malam pertama dari dua, 1–1,5 km garis lurus dari Masjid Huangcheng. ${calmStayPicks('2026-11-13')}` },
    transport: 'Mobil lokal Bipenggou → Chengdu, sekitar 200 km (OSRM 2 jam 18 menit; sisihkan 3–3¼ jam); taksi atau jalan kaki ke masjid.',
    intro: 'Satu-satunya kali opsi ini kembali ke Chengdu, demi salat Jumat di Masjid Huangcheng. Toko buku Zhongshu Ge sudah dikunjungi 9 November, jadi sore sampai malam bebas untuk istirahat sebelum Panda Base besok pagi.',
    steps: [
      ['±06.03', 'Subuh, sarapan, check-out', 'Subuh di penginapan; sarapan; check-out. Matahari terbit 07.34.'],
      ['07.45', 'Berangkat ke Chengdu', 'Berangkat dengan sopir lokal, idealnya sopir Maoxian 11 November. Shuttle bersama Trip.com Bipenggou → Chengdu hanya cadangan, karena jam berangkat paling awalnya belum pasti.'],
      ['±07.45–11.00', 'Perjalanan ke Chengdu', 'Bipenggou → G4217 → Dujiangyan → Chengdu.'],
      ['±11.00–11.30', 'Titip koper di hotel', 'Turun di hotel dan titip koper. Bila mobil baru tiba lewat 11.45, langsung ke masjid dan titip koper sesudahnya.'],
      ['±11.30–12.00', 'Ke Masjid Huangcheng', 'Taksi atau jalan kaki ke Masjid Huangcheng, 1–1,5 km garis lurus dari hotel usulan (waktu jalan kaki belum dicek).'],
      ['±12.00–14.00', 'Salat Jumat', 'Salat Jumat di Masjid Huangcheng (皇城清真寺), Qingyang. Zuhur 12.50. Jam khotbah belum pasti: Athancity (5 November 2026) belum punya jadwal Jumat dari masjid mana pun di Chengdu; azan Jumat kota yang dihitungnya untuk 6 November 12.47, dan jam khotbah berbeda per masjid. Telepon +86 28 8612 7422 (halaman Trip.com).'],
      ['±14.00–15.00', 'Makan siang halal', 'Makan siang halal hangat dekat masjid; unggahan pengunjung menyebut kedai daging sapi Huangchengba (belum diverifikasi).'],
      ['±15.00–16.30', 'Check-in & istirahat', 'Check-in dan istirahat. Asar 15.49 di hotel.'],
      ['Sore–malam', 'Waktu bebas', 'Bebas. Cadangkan file Bipenggou, isi baterai, dan istirahat setelah dua hari di ketinggian. Maghrib sekitar 18.10; Isya 19.33. Makan malam halal di sekitar Huangchengba.'],
      ['±22.00', 'Tidur', 'Tidur. Besok DiDi 06.55 ke Panda Base.'],
    ],
    stops: [
      { place: 'huangcheng-mosque', note: 'Salat Jumat. Alamat berbeda antarsumber (小河街2号 di OSM, 永靖街80号 di islamichina); pakai nama 皇城清真寺.' },
      { place: 'chengdu', note: 'Hotel di Chunxi Road; dua malam di sini.' },
    ],
    notes: [],
    risks: [
      'Jam khotbah belum diketahui; tiba di masjid pukul 12.00 memberi kelonggaran bila khotbah mulai sekitar 13.00.',
      '13 November hari terakhir libur sekolah yang menyambung akhir pekan: lalu lintas dari Bipenggou ke Chengdu Jumat pagi belum diketahui.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-14', title: 'Panda Base pagi, Menara Vitality malam', shortTitle: 'Panda Base & Menara Vitality',
    route: ['Chunxi Road', 'Panda Base', 'Huangchengba', 'Chengdu SKP', 'Twin Towers'],
    overnight: { name: 'Chengdu', detail: 'Penginapan yang sama, malam kedua dari dua.' },
    transport: 'DiDi sekitar 16 km ke Panda Base (OSRM 22 menit; sisihkan 35–40 menit) atau Metro jalur 3 ke 熊猫大道 plus shuttle; sore Metro jalur 1 ke 锦城广场 (±50–55 menit dari hotel) atau DiDi; malam Metro ke 金融城.',
    intro: 'Panda pagi, siang istirahat, lalu malam santai di Menara Vitality dan pertunjukan Twin Towers yang hanya ada Jumat dan Sabtu pukul 20.00. Kunjungan wajib ke menara sudah dilakukan 8 November, sama seperti rencana utama, jadi malam ini tambahan. Bila lelah, satu kunjungan sudah cukup: lewati dan tidur lebih awal, karena D239 berangkat 08.33.',
    steps: [
      ['±05.59', 'Subuh', 'Subuh. Matahari terbit 07.29.'],
      ['±06.55', 'DiDi ke Panda Base', 'DiDi ke Panda Base (成都大熊猫繁育研究基地).'],
      ['±07.40', 'Antre masuk', 'Antre dengan paspor yang dipakai memesan.'],
      ['08.00', 'Masuk sesi pagi', 'Masuk sesi pagi. November–Februari: pagi 08.00–12.00, siang 12.00–16.30, pengunjung keluar 17.30 (halaman resmi).'],
      ['±08.00–10.00', 'Panda paling aktif', 'Jam-jam pertama setelah buka, saat panda paling aktif.'],
      ['±10.00–11.45', 'Keliling, lalu keluar', 'Sisa kawasan dengan santai, lalu keluar.'],
      ['±12.00–13.00', 'Makan siang & Zuhur', 'Makan siang halal di kawasan Huangchengba, dekat 皇城清真寺. Zuhur 12.51.'],
      ['±13.00–15.45', 'Istirahat, beli bekal', 'Istirahat dan cadangkan file. Beli bekal halal untuk kereta 9 jam besok (belum ada katering halal terverifikasi di kereta) dan untuk 16–17 November di Shangri-La. Siapkan kamera dan tripod sebelum Asar.'],
      ['±15.49–15.55', 'Asar', 'Asar 15.49 di hotel.'],
      ['±15.55–16.50', 'Metro ke Chengdu SKP', 'Jalan ±17 menit ke 天府广场, Metro jalur 1 ke selatan 10 stasiun sampai 锦城广场, lalu jalan ±9 menit ke Menara Vitality: totalnya ±50–55 menit, tanpa ganti kereta. Atau DiDi ±16.20, sekitar 12,5 km dan ±15 menit tanpa macet; Sabtu sore bisa lebih lama, jadi lihat estimasi di aplikasi.'],
      ['±16.50–17.30', 'Chengdu SKP', 'Chengdu SKP tanpa terburu-buru: taman di atas mal, tangga besar, dan plaza cekung. Mal buka 10.00–22.00.'],
      ['±17.30–18.07', 'Foto cahaya emas', 'Cahaya emas dari ±17.33 sampai matahari terbenam 18.07: siluet menara dengan Global Center di belakangnya.'],
      ['18.10', 'Maghrib', 'Maghrib di sudut tenang taman, atau dijamak takhir dengan Isya di hotel.'],
      ['±18.20–19.25', 'Langit biru & lampu menara', 'Langit biru ±18.23–18.43, lalu tunggu lampu cincin menara menyala; pengelola tidak mengumumkan jamnya. Rekam beberapa siklus warna dari tangga atau tepi kolam. Bila lampu belum menyala pukul 19.25, pilih salah satu: tetap di SKP, atau berangkat ke Twin Towers.'],
      ['±19.25–19.55', 'Ke Jiaozi Park', 'Tinggalkan SKP paling lambat 19.25. Perjalanan ke danau Jiaozi Park ±25–30 menit: jalan kaki ±2,2 km ke utara, atau Metro jalur 1 dua stasiun dari 锦城广场 ke 金融城 lalu menyeberangi 天府大道 ke danau.'],
      ['±19.55–20.30', 'Twin Towers', 'Twin Towers (天府双塔) dari danau Jiaozi Park atau jembatan 交子之环, sudah di tempat sebelum pertunjukan tematik Sabtu 20.00 (pemberitahuan Oktober 2025). Cek akun WeChat 天府双塔 hari itu.'],
      ['±20.30–21.30', 'Makan malam halal', 'Metro jalur 1 delapan stasiun ke 天府广场, lalu makan malam di kedai bertanda 清真 sekitar 皇城清真寺 (belum diverifikasi; tanyakan status halal di tempat).'],
      ['±21.30', 'Kembali ke hotel', 'Kembali ke hotel. Isya (mulai 19.33), dan Maghrib bila dijamak takhir. Isi baterai; tidur paling lambat 22.30, besok check-out 07.30.'],
    ],
    stops: [
      { place: 'panda-base', note: 'Sesi pagi 08.00–12.00; CNY 55, dengan paspor yang dipakai memesan.' },
      { place: 'chengdu-skp-tower', note: 'Kunjungan kedua, santai, Sabtu sore sampai malam. Kunjungan wajibnya 8 November.' },
      { place: 'tianfu-twin-towers', note: 'Pertunjukan tematik Sabtu 20.00, bila masih bertenaga.' },
    ],
    notes: [],
    risks: [
      'Sabtu di tengah libur sekolah lima hari (11–15 November). Batas harian 85.000 pengunjung; tiket hanya berlaku untuk tanggal dan sesi yang dipesan.',
      'Tiket dari penjual tidak resmi bisa ditolak di gerbang (Chuanguan, 30 Januari 2026).',
      'Jadwal pertunjukan Twin Towers terakhir diumumkan Oktober 2025 dan bisa berubah.',
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
    date: '2026-11-16', title: 'Lijiang ke Upper Tiger Leaping Gorge, lalu Shangri-La', shortTitle: 'Upper Gorge ke Shangri-La',
    route: ['Lijiang', 'Hutiaoxia', 'Upper Tiger Leaping Gorge', 'Shangri-La'],
    overnight: { name: 'Shangri-La', elevation: '3.300 m', detail: `Dukezong, malam pertama dari dua, dalam satu kamar untuk 16–18 November. ${calmStayPicks('2026-11-16')} Duge punya resepsionis 24 jam dan pemanas tanpa oksigen; Jianyi punya oksigen tetapi hanya satu ranjang queen.` },
    transport: 'Mobil sewa dengan koper: Lijiang → Hutiaoxia/Qiaotou → Upper Gorge, 80 km (OSRM 1 jam 16 menit); Upper Gorge → Dukezong, 98 km (OSRM 1 jam 31 menit).',
    intro: 'Hari darat dengan satu perhentian panjang di Upper Tiger Leaping Gorge sisi Shangri-La, lewat jalur pengunjung resmi ke tepi sungai. Kereta Lijiang–Shangri-La tidak bisa berhenti di ngarai, jadi hanya jalan darat yang melewatinya.',
    steps: [
      ['±06.12', 'Subuh & sarapan', 'Subuh. Sarapan dari bekal yang dibeli semalam. Matahari terbit 07.40.'],
      ['08.30', 'Berangkat dengan mobil sewa', 'Mobil sewa dari hotel dengan koper. Taksi bisa sampai ke pintu 166 Hotel menurut ulasan September 2026.'],
      ['±08.30–10.00', 'Ke Upper Tiger Leaping Gorge', 'Lijiang → kota Hutiaoxia (Qiaotou) → Upper Tiger Leaping Gorge (上虎跳, sisi Shangri-La), sekitar 1½ jam.'],
      ['±10.00–12.30', 'Upper Tiger Leaping Gorge', 'Upper Gorge: tiket CNY 45 (FieldGuide); eskalator CNY 80 pulang-pergi (Qunar dan Trip.com); buka 08.00–18.00 dengan masuk terakhir 18.00 (Ctrip dan Trip.com). Belum diketahui apakah sinar matahari langsung sampai ke sungai; menjelang siang lebih mungkin daripada 08.30, tetapi belum diverifikasi.'],
      ['±12.30–14.15', 'Lanjut ke Shangri-La', 'Lanjut ke Shangri-La; makan siang dari bekal di mobil.'],
      ['±14.15–14.45', 'Check-in & Zuhur', 'Check-in di Dukezong. Zuhur (mulai 13.08).'],
      ['±14.45–17.30', 'Istirahat, adaptasi ketinggian', 'Istirahat. Kamu tidur sekitar 900 m lebih tinggi dari semalam, lebih dari batas 500 m per malam dalam panduan CDC. Asar 16.10.'],
      ['±17.30–18.55', 'Dukezong sore', 'Dukezong dekat hotel saja: cahaya emas mulai 17.55, matahari terbenam 18.29, langit biru sampai ±18.53.'],
      ['18.31', 'Maghrib & makan malam', 'Maghrib; Isya 19.52. Makan malam dari bekal halal. Belum ada kedai halal yang terverifikasi buka: dua daftar Ctrip (阿润清真小吃, 友兴回族牛肉馆) berstatus "merchant offline" pada 5 November.'],
    ],
    stops: [
      { place: 'upper-tiger-leaping-gorge', note: 'Sekitar 10.00–12.30. Tiket CNY 45, eskalator CNY 80 pulang-pergi (tarif tidak resmi).' },
      { place: 'dukezong', note: 'Sore ini dekat hotel saja; dua malam di sini.' },
    ],
    notes: [
      { text: 'Trek High Trail tidak dimasukkan karena resmi dilarang: pemberitahuan Pemerintah Kota Shangri-La 10 Februari 2026 mengancam denda CNY 100–5000, dan pengelola menutup seluruh High Trail sejak 1 Mei 2026.', links: [highTrailNotice, highTrailOperator] },
    ],
    risks: [
      'Belum ada penawaran untuk mobil satu arah ini, dan harga di rincian biaya hanya perkiraan. Minta penawaran tertulis yang mencantumkan lama berhenti dan tempat untuk koper 28–30 inci.',
      'Naik sekitar 900 m dalam semalam: sore ini dibuat ringan dan 17 November santai.',
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
const calmFirstDayLunch: TimelineStep = ['±15.00–15.45', 'Makan siang halal', 'Makan siang telat 清真 dekat Chunxi / Taikoo Li. Pilihan utama di mall: 苏坦·中东料理 The Sultan, lantai 2 Taikoo Li unit 2307B (IslamiChina: Middle Eastern/Turkish, sekitar CNY 135 per orang, 11.00–22.00; dicek 6 November 2026). Alternatif klasik dekat Masjid Huangcheng: 皇城坝牛肉 Huangchengba Beef, 三桂前街49号, sekitar 10.30–22.00 (Google Maps, 6 November 2026). Di IFS belum ada opsi 清真 terverifikasi. Sekalian beli bekal berlabel 清真 untuk makan malam di SKP dan 9–10 November, ditambah cadangan tahan lama untuk 11–12 November. Belum ada kedai 清真 terverifikasi di dekat SKP.'];
const calmFirstDay: CalmDay = {
  ...mainFirstDay,
  intro: 'Tiba dari Shanghai setelah transit semalam di Pudong. Check-in di Mcsrh Hotel dekat Chunxi Road (sudah dipesan), makan siang telat 清真 di Taikoo Li atau Huangchengba, lalu sore sampai malam di Menara Vitality, Chengdu SKP. Besok tidak ada kereta subuh: pagi ke Zhongshu Ge, sore Taikoo Li, lalu kereta C5756 ke Jiuzhaigou.',
  steps: [...mainFirstDay.steps.slice(0, -calmFirstEvening.length).map(step => step[0] === '±15.00–15.45' ? calmFirstDayLunch : step), ...calmFirstEvening],
  notes: [...(mainFirstDay.notes ?? []), chengduHalalDay1Note, mondayTrainNote],
};

export const calmDays: CalmDay[] = [{ ...calmFirstDay, overnight: { name: 'Chengdu', detail: 'Mcsrh Hotel Chunxi Road Taikoo Li (Mcsrh麦嘉·拾趣酒店, 春熙路太古里店), sudah dipesan untuk satu malam: Room M1, Rp292.719. Besok pagi koper bisa dititip di sini sebelum ke Zhongshu Ge.' } }, ...calmOwnDays, ...['2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21'].map(fromMainPlan)];
/** "Sekilas hari ini": what to carry and the one thing not to miss, each restating a fact from that day's plan. */
export interface CalmGlance { bring: string; remember: string }
export const calmGlance: Record<string, CalmGlance> = {
  '2026-11-08': { bring: 'Paspor, bekal halal, power bank', remember: 'Menara Vitality wajib: datang selagi masih terang.' },
  '2026-11-09': { bring: 'Kamera, baterai cadangan, bekal makan malam', remember: 'C5756 17.05 di Chengdu East: di stasiun ±16.45.' },
  '2026-11-10': { bring: 'Bekal siang, air, jaket, baterai cadangan', remember: 'Keluar taman paling lambat 17.30.' },
  '2026-11-11': { bring: 'Bekal makan malam dari Songpan', remember: 'Kereta C5754 14.14; koper paling besar 160 cm dan 20 kg.' },
  '2026-11-12': { bring: 'Bekal siang, baju hangat berlapis, baterai cadangan', remember: 'Tinggalkan Shanghaizi paling lambat ±15.15.' },
  '2026-11-13': { bring: 'Sajadah dan pakaian untuk salat Jumat', remember: 'Tiba di masjid ±12.00; jam khotbah belum pasti.' },
  '2026-11-14': { bring: 'Paspor yang dipakai memesan Panda Base', remember: 'DiDi 06.55; panda paling aktif 08.00–10.00.' },
  '2026-11-15': { bring: 'Bekal halal untuk 9 jam di kereta', remember: 'D239 berangkat 08.33 dari Chengdu South.' },
  '2026-11-16': { bring: 'Bekal makan siang dan air', remember: 'Malam ini tidur di ±3.300 m: jalan pelan dan banyak minum.' },
  '2026-11-17': { bring: 'Jaket dan air', remember: 'Napahai hanya bila tidak pusing.' },
  '2026-11-18': { bring: 'Paspor untuk dua tiket Songzanlin', remember: 'Kereta C984 berangkat 12.00 ke Lijiang.' },
  '2026-11-19': { bring: 'Jaket tebal, bekal, dan paspor', remember: 'Mobil 06.30; slot kereta gantung 15.00–15.30.' },
  '2026-11-20': { bring: 'Koper siap sebelum 10.45', remember: 'D8704 berangkat 17.42 dari 大理站 (Xiaguan).' },
  '2026-11-21': { bring: 'Paspor dan tiket pesawat', remember: 'Berangkat ke bandara sesuai jam pesawat.' },
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
    'Kota tua Songpan dan Masjid Utara Songpan dengan makan siang halal, lalu kereta C5754 ke Maoxian (11 November).',
    'Bipenggou seharian penuh (12 November) dengan dua malam di gerbang.',
    'Salat Jumat di Masjid Huangcheng (13 November) dan Panda Base pagi (14 November).',
    'Toko buku Zhongshu Ge di Dujiangyan, wajib: Senin 9 November pagi saat toko baru buka; sore Taikoo Li / IFS; lalu C5756 ke Jiuzhaigou.',
    'Kereta pemandangan D239 Chengdu South → Lijiang (15 November).',
    'Upper Tiger Leaping Gorge di perjalanan darat ke Shangri-La (16 November).',
    'Dua malam di Shangri-La, dengan 17 November sebagai hari santai dan Napahai opsional.',
  ],
};

export const calmTradeOffs = [
  'Dataran tinggi Sichuan barat dan Yading hilang seluruhnya: tidak ada Litang (4.014 m), danau Yading, atau G318. Risiko ketinggian dan jalan tanah ikut berkurang.',
  'Rute kembali ke Chengdu sekali, 13 November, demi salat Jumat dan Panda Base.',
  '11 November memakai tiga kendaraan dalam sehari, dan harga kedua mobilnya baru perkiraan.',
  '9 November jadi hari panjang: DiDi pulang-pergi sekitar 58 km sekali jalan ke Zhongshu Ge pagi, sore di Taikoo Li, lalu C5756 17.05 (tiba Huanglongjiuzhai 19.10) dan taksi ke gukou.',
  'Libur sekolah Chengdu 11–13 November, ditambah akhir pekan, jatuh tepat di Bipenggou dan Panda Base: siap antre dan beli tiket lebih dulu.',
  'Malam 16 November naik sekitar 900 m sekaligus dari Lijiang ke Shangri-La, jadi 17 November dibuat ringan.',
  'Penginapan dekat gerbang Bipenggou di atas batas Rp500.000 selama libur sekolah; yang di bawah batas sekitar 10 menit berkendara dari gerbang.',
];

const tripcomTrain = (from: string, to: string) => `https://id.trip.com/trains/china/route/${from}-to-${to}/`;

const abaCharter = 'https://www.trip.com/chartered-car-seo/hourly/aba-prefecture/';
const bipenggouTickets = 'https://www.trip.com/travel-guide/attraction/li-county/bipeng-valley-89964/?scene=ticket';

// Stays are derived from calm-stays.ts: one card per calm base, and one for the nights shared with the main plan.
const stayBooking = (base: CalmStayBase): CalmBooking => ({
  date: base.nights[0], until: base.nights.length > 1 ? base.nights[base.nights.length - 1] : undefined,
  item: `${base.name}, malam ${nightList(base.nights)}`, urgency: 'now',
  price: stayPicksText(base),
  channel: `${[...new Set([base.hotel, base.hostel].map(stay => stay.links[0].label))].join(' atau ')}; dua pilihan per malam beserta sumbernya di halaman Hotel & hostel santai.`,
  opens: 'Bisa dipesan sekarang.', link: { label: 'Hotel & hostel santai', url: calmStaysHref(base.nights[0]) },
});
const sharedNights = calmStayBases.filter(base => base.fromMain).flatMap(base => base.nights);

export const calmBookingGroups: CalmBookingGroup[] = [
  {
    id: 'tickets', title: 'Tiket dan kereta', lead: 'Yang paling cepat habis di atas.',
    items: [
      { date: '2026-11-12', item: 'Tiket Bipenggou + bus taman + mobil listrik pulang-pergi', urgency: 'now', price: 'CNY 190 untuk 12 November di Trip.com, dicek 5 November: paket non-daratan berisi tiket, bus taman, dan mobil listrik pulang-pergi di kedua ruas (harga normal CNY 220). Tiket CNY 140 dengan bus taman tanpa mobil listrik hanya tercantum di Qunar, tanpa tanggal; Trip.com mengarahkan tiket biasa ke akun WeChat resmi. Mobil listrik saja CNY 60.', cost: { min: 190, max: 190, per: 'orang' }, channel: 'Trip.com, paket non-daratan; voucher ditukar dengan paspor di loket.', opens: 'Sudah dijual. Beli hari ini: libur sekolah 11–13 November, dan tahun lalu tiket 13–14 November habis. Masuk terakhir 15.00 menurut Trip.com (Tongcheng: 15.30).', link: { label: 'Trip.com: Bipenggou', url: bipenggouTickets } },
      { date: '2026-11-14', item: 'Panda Base, sesi pagi Sabtu 14 November', urgency: 'now', price: 'CNY 55 dewasa (halaman resmi; Trip.com untuk 14 November, dicek 5 November). Bus wisata di dalam taman opsional, CNY 30.', cost: { min: 55, max: 55, per: 'orang' }, channel: 'Trip.com, platform resmi menurut halaman tiket Panda Base; cadangan akun WeChat atau mini program resmi.', opens: 'Dijual sampai 14 hari sebelumnya, jadi sudah buka; berhenti saat kuota harian habis. Beli hari ini.', link: { label: 'Trip.com: Panda Base', url: 'https://www.trip.com/travel-guide/attraction/chengdu/chengdu-research-base-of-giant-panda-breeding-76342?poiType=3&locale=en-US' } },
      { date: '2026-11-10', item: 'Jiuzhaigou + bus taman, 10 November', urgency: 'now', price: 'CNY 280 (CNY 190 + bus CNY 90), tarif musim ramai sampai 15 November menurut halaman tiket resmi; Trip.com menjualnya untuk 10 November pada 5 November. Slot 08.00–10.00. Satu tiket cukup karena 9 November tidak masuk taman.', cost: { min: 280, max: 280, per: 'orang' }, channel: 'Trip.com: Admission + Sightseeing Bus, Adult (Non-Chinese mainland visitors); cadangan mini program 九寨沟旅游官方平台, dengan daftar tunggu bila habis.', opens: 'Sudah dijual; kuota 41.000 per hari dan pernah habis. Stok dirilis setiap hari 08.00 dan 17.00, dan tiket yang dibatalkan kembali ke stok (Guangming, 4 Oktober 2026).', link: { label: 'Trip.com: Jiuzhaigou', url: 'https://www.trip.com/travel-guide/attraction/jiuzhaigou/jiuzhaigou-national-park-89895/?scene=ticket' } },
      { date: '2026-11-09', item: 'C5756 Chengdu East 17.05 → Huanglongjiuzhai 19.10, satu kursi', urgency: 'now', mode: 'train', price: 'CNY 143 kelas dua, CNY 230 kelas satu (12306 / Trip.com, dicek 6 November; kursi kelas dua dan satu tersedia). Setelah tiba 19.10, bus 团子出行 terakhir (17.30) sudah lewat: siapkan taksi/DiDi dari area resmi stasiun ke gukou (acuan CNY 220–280) atau shuttle stasiun Trip.com bila ada.', cost: { min: 143, max: 143, per: 'orang' }, channel: 'Trip.com, atau 12306 sebagai cadangan.', opens: 'Sudah dijual. Pesan segera; Senin sore East sering penuh mendekati tanggal.', link: { label: 'Trip.com: Chengdu ke Huanglongjiuzhai', url: tripcomTrain('chengdu', 'huanglongjiuzhai') } },
      { date: '2026-11-09', item: 'Cadangan: C5786 Chengdu East 18.38 → Huanglongjiuzhai 20.48, atau C6376 14.34 + bus 17.30', urgency: 'now', mode: 'train', alternative: true, price: 'C5786 CNY 143 kelas dua (12306, 6 November). C6376 14.34 → 16.58 CNY 143 + bus 团子出行 17.30 CNY 51 (bus terakhir) bila berangkat lebih awal dari East.', cost: { min: 143, max: 194, per: 'orang' }, channel: 'Kereta: Trip.com atau 12306. Bus: 团子出行 dengan nama asli; belum pasti menerima paspor asing.', opens: 'Sudah dijual.', link: { label: 'Trip.com: Chengdu ke Huanglongjiuzhai', url: tripcomTrain('chengdu', 'huanglongjiuzhai') } },
      { date: '2026-11-09', item: 'Cadangan: shuttle Trip.com Chengdu → Jiuzhaigou, jemput Xinnanmen 14.00', urgency: 'now', mode: 'shuttle', alternative: true, price: 'IDR 328.648 untuk 9 November, sekitar CNY 120 (Trip.com, 6 November). Ordinary car tersedia; Nanny car tidak. OSRM 418 km / ±4 jam 48 menit tanpa macet.', cost: { min: 120, max: 120, per: 'orang' }, channel: 'Trip.com shuttle Individual, titik jemput Xinnanmen Bus Station (新南门汽车站).', opens: 'Sudah dijual. Hanya bila kursi kereta habis atau ingin tiba siang–sore.', link: { label: 'Trip.com: Jiuzhaigou, bagian shuttle', url: 'https://www.trip.com/travel-guide/attraction/jiuzhaigou/jiuzhaigou-national-park-89895/?scene=ticket' } },
      { date: '2026-11-11', item: 'C5754 Huanglongjiuzhai 14.14 → Maoxian 15.00, satu kursi', urgency: 'now', mode: 'train', price: 'CNY 66 kelas dua (12306, 5 November); kelas satu CNY 105 sudah habis.', cost: { min: 66, max: 66, per: 'orang' }, channel: 'Trip.com, atau 12306 sebagai cadangan.', opens: 'Sudah dijual; 12306 menunjukkan kursi kelas dua pada 5 November, dan halaman rute Trip.com mencantumkan C5754.', link: { label: 'Trip.com: Huanglongjiuzhai ke Maoxian', url: tripcomTrain('huanglongjiuzhai', 'maoxian') } },
      { date: '2026-11-15', item: 'D239 Chengdu South 08.33 → Lijiang 17.46, satu kursi', urgency: 'now', mode: 'train', price: 'CNY 376 kelas dua (12306, 5 November); kelas satu CNY 602, tinggal 3 kursi. Tidak ada kereta tidur.', cost: { min: 376, max: 376, per: 'orang' }, channel: 'Trip.com, atau 12306 sebagai cadangan.', opens: 'Sudah dijual: tiket dibuka 15 hari sebelumnya, dan 12306 masih menunjukkan kursi kelas dua untuk 15 November pada 5 November.', link: { label: 'Trip.com: Chengdu ke Lijiang', url: tripcomTrain('chengdu', 'lijiang') } },
      { date: '2026-11-16', item: 'Tiket Upper Tiger Leaping Gorge (sisi Shangri-La)', urgency: 'onsite', price: 'CNY 45 dewasa (FieldGuide, 2 November 2026, dan panduan Ctrip tanpa tanggal); Qunar dan Trip.com tidak menjual tiket masuk saja. Eskalator opsional CNY 80 pulang-pergi atau CNY 60 naik saja (Qunar). Di Trip.com untuk 16 November: tiket dengan shuttle pulang-pergi dari Dukezong CNY 143, ditambah eskalator CNY 223.', cost: { min: 45, max: 125, per: 'orang' }, channel: 'Di lokasi, atau lewat situs pengelola.', opens: 'Buka 08.00–18.00, masuk terakhir 18.00 (Ctrip dan Trip.com). Pengelola melaporkan buka normal; longsor 30 Juli dan 3 September berada di luar area pengunjung.', link: { label: 'Pengelola Tiger Leaping Gorge', url: 'https://www.xgllhtx.cn/' } },
      { date: '2026-11-09', item: 'Toko Buku Zhongshu Ge, Dujiangyan: masuk gratis, DiDi pulang-pergi dari hotel', urgency: 'onsite', mode: 'taxi', price: 'Masuk gratis (Trip.com dan Third Eye Traveller). DiDi belum punya tarif resmi: satu pelancong (Third Eye Traveller, artikel Juni 2026) membayar sekitar CNY 100 sekali jalan, jadi sekitar CNY 200 pulang-pergi. Sekitar 58 km sekali jalan, ±45 menit tanpa macet menurut OSRM; tarif jam sibuk Senin pagi bisa berbeda.', cost: { min: 200, max: 200, per: 'mobil' }, channel: 'DiDi ke 钟书阁(融创茂店) sekitar 08.45, kembali ±11.30. Cadangan untuk pergi: Metro jalur 2 ke 犀浦, kereta S ke 都江堰 (CNY 10 di 12306 atau Trip.com; sebagian kereta tinggal sedikit kursi), lalu DiDi 10–15 menit dari stasiun.', opens: 'Tidak perlu membeli tiket. Lihat estimasi waktu dan tarif DiDi di aplikasi sebelum memesan.', link: { label: 'Panduan Zhongshu Ge', url: placePath('zhongshuge-bookstore') } },
    ],
  },
  {
    id: 'cars', title: 'Mobil: minta penawaran tertulis', lead: 'Belum ada penawaran untuk mobil mana pun; harganya perkiraan dari tarif sewa per jam Trip.com. Minta harga all-in tertulis dari sopir berizin.',
    items: [
      { date: '2026-11-11', item: 'Mobil sewa hotel Jiuzhaigou → kota tua Songpan → Stasiun Huanglongjiuzhai', urgency: 'now', mode: 'car', price: 'Belum ada penawaran untuk rute ini. Acuan Trip.com untuk 11 November: transfer pribadi 68228592 Jiuzhaigou → Stasiun Huanglongjiuzhai CNY 338 per mobil 5 kursi, tanpa singgah di Songpan; sewa per jam di Aba 8 jam/100 km CNY 723, lebih CNY 4 per km, jadi sekitar CNY 791 untuk ±117 km. Keduanya hanya acuan dan belum berupa penawaran. Tanpa mobil: bus 09.05 九寨沟口 → 松潘 CNY 52, lalu taksi ±13 km ke stasiun dengan koper.', cost: { min: 338, max: 791, per: 'mobil' }, channel: 'Trip.com Car charter per jam di Aba, atau tanyakan ke hotel; minta sopir berizin (营运证) dan penawaran tertulis yang mencakup ±2 jam menunggu di Songpan dengan koper.', opens: 'Minta penawaran sekarang.', link: { label: 'Trip.com: sewa mobil di Aba', url: abaCharter } },
      { date: '2026-11-11', until: '2026-11-13', item: 'Mobil Stasiun Maoxian → gerbang Bipenggou (11 November 15.00), lalu Bipenggou → Chengdu (13 November 07.45)', urgency: 'now', mode: 'car', price: 'Belum ada penawaran: tidak ada produk Trip.com, Klook, atau Qunar untuk Maoxian, dan halaman sewa Trip.com untuk Maoxian dan Lixian tidak ada. Perkiraan dari sewa per jam Trip.com di Aba (8 jam/100 km CNY 723, lebih CNY 4 per km): sekitar CNY 851 untuk 132 km pada 11 November dan CNY 1123 untuk ±200 km pada 13 November, jadi sekitar CNY 1974 untuk keduanya. Ini hitungan, bukan penawaran; biaya kembali kosong dan penginapan sopir belum termasuk. Belum pasti juga Stasiun Maoxian dan Chengdu masuk area jemput/antar gratis sewa Aba di Trip.com.', cost: { min: 1974, max: 1974, per: 'mobil' }, channel: 'Tanya Xinlan Homestay atau sopir di Lixian, atau Trip.com Car charter per jam di Aba; idealnya satu sopir dan satu penawaran untuk kedua hari, termasuk penginapan sopir.', opens: 'Atur secara tertulis sekarang.', link: { label: 'Trip.com: sewa mobil di Aba', url: abaCharter } },
      { date: '2026-11-13', item: 'Cadangan 13 November: shuttle bersama Trip.com Bipenggou → Chengdu', urgency: 'now', mode: 'shuttle', alternative: true, price: 'CNY 65 per orang untuk 13 November (Trip.com, rute "Return trip: Bipenggou - Chengdu"); Qunar mulai CNY 68. Jam berangkat paling awal belum pasti, jadi belum tentu tiba sebelum salat Jumat. Klook 194211 tidak dipakai: judulnya hanya arah Chengdu → Bipenggou dan harganya tidak bisa dilihat.', channel: 'Trip.com; tanyakan tertulis jam berangkat dari Bipenggou dan tempat koper sebelum membayar.', opens: 'Sudah dijual untuk 13 November.', link: { label: 'Trip.com: Bipenggou', url: bipenggouTickets } },
      { date: '2026-11-16', item: 'Mobil sewa Lijiang 08.30 → Upper Tiger Leaping Gorge (berhenti ±2½ jam) → Dukezong, satu arah', urgency: 'week', mode: 'car', price: 'Belum ada penawaran untuk rute satu arah ini; Trip.com mengarahkan sewa multi-kota ke "Ask now". Perkiraan dari sewa per jam Trip.com di Lijiang untuk 16 November (8 jam/100 km CNY 335 untuk 5 kursi, lebih CNY 5 per km): sekitar CNY 725 untuk ±178 km, belum termasuk biaya kembali kosong dari Shangri-La. Halaman lalu lintas pengelola ngarai (tanpa tanggal) menyebut CNY 300–800 per mobil dari Lijiang ke ngarai.', cost: { min: 725, max: 725, per: 'mobil' }, channel: 'Trip.com Car charter (multi-city) atau hotel di Lijiang; minta penawaran yang mencantumkan lama berhenti dan tempat untuk koper 28–30 inci.', opens: 'Atur sebelum 15 November.', link: { label: 'Trip.com: charter di Lijiang', url: 'https://www.trip.com/chartered-car-seo/hourly/lijiang/?curr=CNY' } },
      { date: '2026-11-16', item: 'Alternatif: shuttle satu arah Lijiang → Upper Gorge → Dukezong', urgency: 'week', mode: 'shuttle', alternative: true, price: 'CNY 100 per orang untuk 16 November di Trip.com (produk 115857784, dicek 5 November), tanpa tiket ngarai. Menurut keterangan produk yang sama di Qunar: jemput 06.30–07.00 di sekitar kota tua Lijiang, sekitar 1,5 jam di Upper Gorge mulai ±09.00, tiba di Dukezong ±11.50–12.30. Trip.com 87712606 berangkat 07.00 dengan 2 jam di ngarai, minimal 2 orang: paket gabung CNY 128 per orang, jadi CNY 256 bila membayar untuk dua.', channel: 'Trip.com; tanyakan tertulis tempat untuk koper 28–30 inci.', opens: 'Berangkat jauh lebih pagi daripada mobil 08.30 di jadwal. Qunar: batal gratis sampai 19.00 sehari sebelumnya.', link: { label: 'Trip.com: Tiger Leaping Gorge sisi Shangri-La', url: 'https://www.trip.com/travel-guide/attraction/shangri-la/shangri-la-tiger-leaping-gorge-10558694/?curr=CNY' } },
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
  'Tiket Bipenggou bertanggal 11 November; opsi ini berkunjung 12 November.',
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
  'Penawaran nyata untuk semua mobil: Jiuzhaigou → Songpan → Stasiun Huanglongjiuzhai (11 November), Stasiun Maoxian → Bipenggou (11 November), Bipenggou → Chengdu (13 November), dan Lijiang → Upper Gorge → Shangri-La (16 November); angka di rincian biaya hanya perkiraan dari tarif sewa per jam. Juga biaya kembali kosong, apakah titik jemput dan antar (Jiuzhaigou, Stasiun Maoxian, Bipenggou, Chengdu, Shangri-La) masuk area gratis sewa Trip.com, dan apakah satu sopir lokal bisa mengambil 11 dan 13 November.',
  'Status G213 Maoxian–Wenchuan setelah pengumuman pengalihan 16 September, dan apakah Dingziba dibuka lagi setelah laporan 22 Oktober.',
  'Nama restoran halal di Songpan, dan apakah Masjid Utara Songpan menerima musafir untuk salat.',
  'Good B&B (不鞠民宿): jaraknya dari gerbang Bipenggou, dan apakah makanan halal tersedia pada November.',
  'Penginapan: apakah promo menginap pertama Trip.com berlaku untuk lebih dari satu pemesanan per akun, harga Sofis Svyain untuk 13–15 November, apakah Xingyun mendaftarkan paspor asing, dan apakah pemilik Xinlan mau mengantar ke gerbang 12 November pagi.',
  'Bipenggou: masuk terakhir (15.00 menurut Trip.com, 15.30 menurut Tongcheng), jam bus terakhir turun, apakah tiket mobil listrik pulang-pergi boleh turun di Moon Bay dan Red Stone Beach, dan waktu berjalan kaki.',
  'Masjid Huangcheng: jam khotbah 13 November, alamat pasti (小河街2号 atau 永靖街80号), dan waktu jalan kaki dari hotel.',
  'Zhongshu Ge Dujiangyan: jam buka pasti (10.00–21.00 menurut Trip.com, 09.00–20.00 atau 10.00–22.00 menurut sumber lain), aturan tripod, gimbal, dan video, keramaian Senin pagi 9 November, tarif DiDi, lama shuttle Trip.com ke Jiuzhaigou dan titik turunnya, ada tidaknya musala di mal, dan apakah masjid di 南街 Dujiangyan aktif.',
  'Kedai halal yang benar-benar buka di Shangri-La dan Dukezong (dua daftar Ctrip offline per 5 November), dan di kota tua Lijiang, yang juga belum diverifikasi rencana utama.',
  'Upper Tiger Leaping Gorge: tarif resmi tiket dan eskalator (angka di sini dari FieldGuide, Qunar, dan Trip.com), dan apakah sinar matahari sampai ke sungai pada pertengahan November.',
  'Shuttle 16 November: apakah Trip.com mengizinkan satu orang membayar paket 87712606 yang minimal dua orang, dan tempat untuk koper 28–30 inci di kedua shuttle.',
  'Napahai: tarif resmi November 2026 (sumber 2025 menyebut gratis, WestChinaGo tanpa tanggal CNY 60) dan pintu masuk mana yang gratis.',
  'Seberapa ketat petugas menerapkan batas bagasi untuk koper 28–30 inci di C5754, D239, dan C984: 160 cm dan 20 kg menurut China Railway, 130 cm per barang menurut Trip.com.',
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
