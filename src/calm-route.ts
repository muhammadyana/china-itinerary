import { days, places, type Day, type Place } from './itinerary.ts';
import { dayTimelines, type TimelineStep } from './day-timelines.ts';
import { go, type MapLeg, type MapPoint, type Mode } from './route-map.ts';
import type { Link, TransportMode, Urgency } from './bookings.ts';
import { staysPath } from './stays.ts';

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
/** `urgency` follows the `opens` text, as on the main preparation page; `mode` marks transport legs. */
export interface CalmBooking { date: string; until?: string; item: string; price: string; channel: string; opens: string; urgency: Urgency; mode?: TransportMode; link?: Link }
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
  'maoxian-station': { name: 'Stasiun Maoxian', chinese: '茂县站', description: 'Stasiun di kota Guangming, sekitar 9 km dari pusat Kabupaten Maoxian. Sopir yang dipesan menjemput di sini.' },
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
};

// Legs for the calm days; 8 and 18–21 November use the main map's legs.
export const calmLegs: Record<string, MapLeg[]> = {
  '2026-11-09': [...go('train', 'chengdu', 'huanglongjiuzhai'), ...go('car', 'huanglongjiuzhai', 'jiuzhaigou')],
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
export const calmBadgeShifts: Record<string, readonly [number, number]> = { '2026-11-08': [10, -19], '2026-11-09': [12, 58], '2026-11-10': [36, -4], '2026-11-12': [-15, 37], '2026-11-14': [9, 13], '2026-11-16': [-8, -14] };
// Days that stay in one place name their local transport in the day list.
export const calmLocalModes: Record<string, Mode[]> = { '2026-11-12': ['bus'], '2026-11-14': ['car'] };

function fromMainPlan(date: string): CalmDay {
  const day: Day | undefined = days.find(item => item.date === date);
  if (!day) throw new Error(`The main plan has no day ${date}`);
  return {
    date, title: day.title, shortTitle: day.shortTitle, route: day.route, overnight: day.overnight, transport: day.transport, intro: day.intro,
    steps: dayTimelines[date] ?? [], stops: day.events.flatMap(event => event.kind === 'stop' ? [{ place: event.place, note: event.note }] : []),
    notes: [], risks: [], fromMain: true,
  };
}

const highTrailNotice = { label: 'Pemberitahuan kota, 10 Februari', url: 'https://www.sohu.com/a/986025656_120815119' };
const highTrailOperator = { label: 'Pengelola, 1 Mei', url: 'https://m.gmw.cn/2026-05/09/content_1304450375.htm' };

const calmOwnDays: CalmDay[] = [
  {
    date: '2026-11-09', title: 'Kereta lebih siang, Jiuzhaigou hari pertama', shortTitle: 'Jiuzhaigou hari pertama',
    route: ['Chengdu East', 'Huanglongjiuzhai', 'Five Flower Lake', 'Shuzheng', 'Jiuzhaigou'],
    overnight: { name: 'Jiuzhaigou', elevation: '±2.000 m', detail: 'Malam pertama dari dua di Jiuzhaigou Yinghai Holiday Hotel dekat gerbang (Pengfeng/Goukou): CNY 167–177 untuk 9–10 November dengan promo menginap pertama Trip.com, sekitar CNY 306 tanpa promo. Resepsionis 24 jam dan titip koper gratis. Harga 10–11 November belum diketahui.' },
    transport: 'DiDi ke Chengdu East, C5772 07.30 ke Huanglongjiuzhai (atau C5746 06.14 seperti rencana utama), shuttle stasiun sekitar 2 jam, bus taman.',
    intro: 'Dengan dua hari di taman, pagi ini tidak perlu berangkat sebelum subuh. C5772 07.30 hanya dipakai bila Trip.com menjual shuttle stasiun setelah 09.31; bila tidak, naik C5746 06.14 dan shuttle 08.30 seperti rencana utama, dan DiDi 05.15 di akhir 8 November tetap berlaku. Siang sampai sore di Five Flower Lake dan Shuzheng.',
    steps: [
      ['±05.55', 'Subuh di hotel, lalu sarapan dari bekal.'],
      ['±06.30', 'DiDi ke Chengdu East; tiba 30–45 menit sebelum kereta untuk pemeriksaan paspor.'],
      ['07.30', 'C5772 ke Huanglongjiuzhai, tiba 09.31. Pakai hanya bila Trip.com menunjukkan slot shuttle stasiun setelah 09.31; bila tidak, naik C5746 06.14 dan shuttle 08.30.'],
      ['±09.45–11.45', 'Shuttle stasiun ke gerbang Jiuzhaigou, sekitar 2 jam. Dengan C5772 atau C6362 kamu tiba di gerbang ±11.30–12.00.'],
      ['±11.45–12.15', 'Titip koper di hotel, sekitar 1,3 km dari zona pengunjung. Masuk di slot 12.00–14.00; batas masuk 14.00 dan taman tutup 18.00 (pengumuman 31 Oktober).'],
      ['±12.15–13.15', 'Bus taman ke Nuorilang, lalu bus Rize ke arah 原始森林; turun di 五花海, 45–60 menit.'],
      ['±13.15–15.00', 'Five Flower Lake selagi matahari tinggi dan warna air paling kuat. Zuhur (mulai 12.51) di sudut tenang dengan bekal makan siang; sebagai musafir kamu boleh menjamaknya dengan Asar.'],
      ['±15.00–16.45', 'Bus turun ke Shuzheng. Pantulan di danau lebih tenang menjelang sore, dan dasar lembah mulai teduh ±16.30. Asar 15.47 bila tidak dijamak.'],
      ['±16.45–17.30', 'Bus ke gerbang; keluar paling lambat 17.30.'],
      ['±17.30–18.15', 'Check-in. Maghrib 18.09; Isya 19.34.'],
      ['Malam', 'Makan malam halal di Pengfeng (ulasan September 2025 menyebut ada restoran 清真). Cek tiket 10 November, slot 08.00–10.00.'],
    ],
    stops: [
      { place: 'chengdu-east', note: 'C5772 07.30, atau C5746 06.14 bila tidak ada shuttle setelah 09.31.' },
      { place: 'huanglongjiuzhai', note: 'Shuttle stasiun ke gerbang taman, sekitar 2 jam.' },
      { place: 'five-flower', note: 'Sekitar 13.15–15.00, saat matahari tinggi.' },
      { place: 'shuzheng', note: 'Menjelang sore, saat pantulan lebih tenang.' },
      { place: 'jiuzhaigou-hotel', note: 'Dua malam, 9 dan 10 November, dekat zona pengunjung.' },
    ],
    notes: [],
    risks: [
      'Slot shuttle stasiun setelah C5772 belum terverifikasi. Tanpa slot itu, pakai C5746 06.14.',
      'Bila tiba di gerbang lewat 14.00, tiket 9 November hangus dan 10 November jadi satu-satunya hari di taman.',
      'Tiket bisa habis: 2 November dinyatakan habis pada batas 41.000 pengunjung (pengumuman 31 Oktober).',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-10', title: 'Jiuzhaigou hari kedua: Mirror Lake dulu, Zechawa siang', shortTitle: 'Jiuzhaigou hari kedua',
    route: ['Jiuzhaigou', 'Mirror Lake', 'Long Lake', 'Nuorilang', 'Pearl Shoals', 'Jiuzhaigou'],
    overnight: { name: 'Jiuzhaigou', elevation: '±2.000 m', detail: 'Hotel yang sama, malam kedua dari dua.' },
    transport: 'Jalan kaki atau taksi ke gerbang; bus taman (cabang Rize dan Zechawa berpisah di Nuorilang). Lama perjalanan bus belum dicek.',
    intro: 'Hari penuh kedua dengan tiket terpisah. Mirror Lake lebih dulu selagi angin pagi pelan, Long Lake dan Five-Colour Pond saat matahari tinggi, lalu Nuorilang dan Pearl Shoals.',
    steps: [
      ['±05.58', 'Subuh di hotel; sarapan dari bekal halal.'],
      ['±07.30', 'Jalan kaki atau taksi ke gerbang. Matahari terbit 07.31.'],
      ['08.00', 'Masuk dengan tiket kedua yang dibeli terpisah, slot 08.00–10.00.'],
      ['±08.00–08.40', 'Bus taman ke Nuorilang, lalu bus Rize sedikit ke atas sampai Mirror Lake (镜海).'],
      ['±08.40–09.30', 'Pantulan Mirror Lake. Menurut Ctrip waktu terbaiknya sebelum 09.00 atau setelah 17.00 saat angin pelan; lewat ±09.00 angin biasanya memecah pantulan.'],
      ['±09.30–10.15', 'Bus kembali ke Nuorilang, lalu bus Zechawa sampai ujungnya di Long Lake (长海).'],
      ['±10.15–12.30', 'Long Lake, lalu jalur kayu turun ke Five-Colour Pond (五彩池) saat matahari tinggi. Di sini dingin: simpan baterai cadangan di dalam jaket dan waspadai es di jalur kayu.'],
      ['±12.30–13.15', 'Zuhur (mulai 12.51) di sudut tenang; makan siang dari bekal, jangan mengandalkan makanan di taman. Bus turun ke Nuorilang.'],
      ['±13.15–14.00', 'Air terjun Nuorilang (诺日朗瀑布).'],
      ['±14.00–15.30', 'Bus Rize ke halte Pearl Shoals (珍珠滩), lalu jalur kayu melewati air terjunnya. Lama berjalan belum dicek.'],
      ['±15.30–16.45', 'Bagian Shuzheng yang terlewat kemarin, atau istirahat. Asar 15.47.'],
      ['±16.45–17.30', 'Bus ke gerbang; keluar paling lambat 17.30, taman tutup 18.00.'],
      ['18.08', 'Maghrib; Isya 19.33. Makan malam halal di Pengfeng. Beli sarapan dan camilan untuk mobil 11 November.'],
      ['±20.30', 'Pastikan mobil 07.30, tiket C5754, dan penjemputan di Maoxian. Cek pengumuman jalan Aba dan Sichuan untuk G213 Maoxian–Wenchuan. Pindah ke rencana B (C5784 09.04) hanya bila kereta, mobil, atau jalan itu batal.'],
    ],
    stops: [
      { place: 'mirror-lake', note: 'Sekitar 08.40–09.30, sebelum angin datang.' },
      { place: 'long-lake' },
      { place: 'five-colour-pond' },
      { place: 'nuorilang' },
      { place: 'pearl-shoals' },
    ],
    notes: [],
    risks: [
      'Tiket masuk kedua (二次进沟) hanya muncul di unggahan pihak ketiga yang tidak bertanggal dan saling bertentangan. Halaman tiket resmi tidak mencantumkannya, jadi beli tiket penuh kedua.',
      'Pemesanan atas nama asli (人证合一): paspor harus cocok, satu tiket per identitas per tanggal.',
      'Seluruh taman dibuka lagi 30 Juli 2026 setelah longsor 26 Juli. Jalur masih bisa ditutup karena cuaca.',
      'Angin bisa datang sebelum 09.00; pantulan Mirror Lake tidak dijamin.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-11', title: 'Kota tua Songpan, kereta ke Maoxian, mobil ke Bipenggou', shortTitle: 'Songpan ke Bipenggou',
    route: ['Jiuzhaigou', 'Songpan', 'Huanglongjiuzhai', 'Maoxian', 'Bipenggou'],
    overnight: { name: 'Bipenggou', elevation: '±2.250 m', detail: 'Xinlan Homestay (理县鑫兰民宿) di Desa Zhuangfang, Putou, sekitar 1,7 km dari gerbang menurut ulasan tamu; malam pertama dari dua. CNY 158–168 untuk 10–11 November dengan pembatalan gratis; harga 11–13 November belum diketahui dan jatuh di libur sekolah Chengdu. Cek dulu Good B&B (不鞠民宿), yang mencantumkan makanan halal di Trip.com seharga CNY 202, tetapi lokasinya belum ditemukan. Cadangan: Li County Wuyoucheng Hotel di kota Lixian, sekitar 30 menit dari gerbang.' },
    transport: 'Mobil sewa dengan koper Jiuzhaigou → Songpan (104 km) → Stasiun Huanglongjiuzhai (13 km); C5754 14.14 → Maoxian 15.00 (kelas dua CNY 66); mobil pesanan Maoxian → Wenchuan → Lixian → gerbang Bipenggou (132 km).',
    intro: 'Pengganti mobil 530 km lewat padang rumput: total sekitar 3,5 jam menyetir dengan kereta pendek di tengahnya, tanpa celah 3.900 m. Pagi di kota tua Songpan dengan makan siang halal dekat masjid, lalu kereta pendek dan mobil ke gerbang Bipenggou. G213 masih ditutup di Diexi, utara Maoxian; ruas Maoxian–Wenchuan tetap dibuka untuk mobil penumpang.',
    steps: [
      ['±05.59', 'Subuh di hotel; sarapan; check-out.'],
      ['±07.30', 'Mobil sewa dengan koper di bagasi. Matahari terbit 07.32; cahaya emas habis ±08.07, jadi berangkat lebih pagi tidak banyak gunanya.'],
      ['±07.30–09.15', 'Jiuzhaigou → Chuanzhusi → Songpan, 104 km (OSRM 1 jam 16 menit; sisihkan ±1¾ jam di jalan gunung).'],
      ['±09.15–11.15', 'Kota tua Songpan (±2.860 m): tembok dan gerbang, lalu bagian luar Masjid Utara Songpan (松潘清真北寺, Shuncheng North Road; minta izin sebelum memotret). Sopir menjaga koper.'],
      ['±11.15–12.15', 'Makan siang halal di restoran 清真 dekat masjid (belum ada nama yang terverifikasi). Beli makanan hangat untuk malam ini, ditambah makanan berlabel 清真 yang bisa dipanaskan sendiri dan roti untuk 12–13 November.'],
      ['±12.52', 'Zuhur dijamak takdim dengan Asar, karena waktu Asar (15.49) jatuh di kereta dan mobil. Salat di masjid bila musafir diizinkan (belum dicek), atau di sudut tenang.'],
      ['±13.15–13.30', 'Mobil ke Stasiun Huanglongjiuzhai, 13 km (OSRM 12 menit). Pemeriksaan paspor dan keamanan; aturan bagasi 130 cm / 20 kg berlaku.'],
      ['14.14', 'C5754 ke Maoxian, tiba 15.00. Lebih awal: C5764 12.14 → 13.06 bila Songpan selesai ±11.00, tetapi tidak menambah waktu di taman karena masuk terakhir Bipenggou 15.30. Cadangan lebih siang: C5804 15.15 → 16.08.'],
      ['±15.00–15.15', 'Temui sopir pesanan di Stasiun Maoxian (kota Guangming, sekitar 9 km dari pusat Kabupaten Maoxian).'],
      ['±15.15–17.30', 'Maoxian → G213 ke selatan → Wenchuan → G4217 → Lixian → gerbang Bipenggou, 132 km (OSRM 1 jam 35 menit; sisihkan 2–2¼ jam).'],
      ['±17.30', 'Check-in. Cahaya emas mulai 17.37 hanya mengenai puncak; matahari terbenam 18.12.'],
      ['18.14', 'Maghrib; Isya 19.38. Makan malam dari bungkusan Songpan; minta air panas atau ketel ke pemilik penginapan. Atur tumpangan ke gerbang pukul 07.30.'],
      ['Rencana B', 'Bila kereta, sopir Maoxian, atau G213 Maoxian–Wenchuan batal: shuttle 06.20 dari 九寨沟口长途客运站 (CNY 51) → C5784 Huanglongjiuzhai 09.04 → Chengdu East 10.45 (ada kursi per 5 November). Lalu Klook 194211 Chengdu → Bipenggou (±CNY 625–630, baru dari cuplikan pencarian), atau metro ke Chadianzi dan bus 13.30 ke Lixian (CNY 75). Rencana ini melewatkan Songpan dan lewat Chengdu.'],
      ['Rencana C', 'Tidak disarankan; hanya bila prakiraan kering, diputuskan 10 November malam. Mobil berangkat 06.45 lewat Songpan, Hongyuan, dan tol 久马高速 G0615 ke Bipenggou: ±537 km, 8–9 jam menyetir, celah ±3.900 m. Tiba ±17.30–18.30, bisa setelah gelap. Tanpa berhenti foto bila belum sampai Hongyuan pukul 14.00.'],
    ],
    stops: [
      { place: 'songpan', note: 'Sekitar 09.15–11.15, sopir menjaga koper.' },
      { place: 'songpan-mosque', note: 'Makan siang halal di sekitarnya, lalu Zuhur dan Asar dijamak takdim.' },
      { place: 'huanglongjiuzhai', note: 'C5754 14.14 ke Maoxian.' },
      { place: 'maoxian-station', note: 'Tiba 15.00; sopir pesanan menunggu di sini.' },
      { place: 'bipenggou-gate', note: 'Penginapan di Desa Zhuangfang, sekitar 1,7 km dari gerbang.' },
    ],
    notes: [],
    risks: [
      'G213 Maoxian–Wenchuan dibuka menurut pengumuman pengalihan 16 September; pengumuman yang lebih baru belum dicek. Longsor batu memindahkan hari ini ke rencana B.',
      'Tiga kendaraan dalam sehari: mobil, kereta, mobil. C5754 yang terlambat masih menyisakan sekitar 3 jam sebelum matahari terbenam.',
      'Penjemputan di Maoxian: belum ada produk di Trip.com atau Klook; sopir dan harganya belum diketahui.',
      'Belum ada restoran halal di dekat Bipenggou atau di Lixian. Sarapan Xinlan (CNY 10) tidak disebut halal, jadi belanja bekal di Songpan.',
      'Penginapan di gerbang jatuh di libur sekolah Chengdu (11–13 November); harganya bisa lebih tinggi dari cek 10–11 November.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-12', title: 'Bipenggou seharian', shortTitle: 'Bipenggou seharian',
    route: ['Gerbang Bipenggou', 'Longwang Lake', 'Danau Panyang', 'Yanziyan', 'Shanghaizi', 'Gerbang Bipenggou'],
    overnight: { name: 'Bipenggou', elevation: '±2.250 m', detail: 'Xinlan Homestay, malam kedua dari dua.' },
    transport: 'Tumpangan penginapan atau jalan kaki 1,7 km ke gerbang; bus taman wajib (26 km, 40–45 menit, ditambah ±20 menit berhenti di Longwang Lake saat naik); mobil listrik Shanghaizi ↔ Panyang ↔ Yanziyan.',
    intro: 'Satu hari penuh di taman, dengan dua malam di gerbang. Itulah arti "3 hari 2 malam" di opsi ini: hari pertama habis untuk perjalanan, hari ketiga untuk berangkat ke salat Jumat di Chengdu.',
    steps: [
      ['±06.02', 'Subuh. Sarapan dari bekal dengan air panas. Siapkan makan siang, air, baju hangat berlapis, dan baterai cadangan.'],
      ['±07.30', 'Ke pusat pengunjung, 1,7 km (waktu jalan kaki belum dicek). Libur sekolah: siap antre.'],
      ['08.00', 'Gerbang buka (08.00–17.30, masuk terakhir 15.30; Tongcheng, 27 Oktober 2026). Tukar voucher non-daratan dengan paspor. Minum obat antimabuk.'],
      ['±08.15–09.20', 'Bus taman naik, berhenti ±20 menit untuk foto di Longwang Lake (龙王海), sampai Shanghaizi (±3.560 m). Rekam video saat naik; kendaraan kabarnya tidak berhenti saat turun.'],
      ['±09.20–10.45', 'Mobil listrik ke Danau Panyang (磐羊湖, ±3.680 m). Jalur kayu di tepi danau selagi air tenang: blok foto utama.'],
      ['±10.45–11.45', 'Mobil listrik Panyang → Yanziyan (燕子岩窝, 3.837 m); 30–40 menit di atas.'],
      ['±11.45–13.15', 'Turun melewati Moon Bay (月亮湾) dan Red Stone Beach (红石滩) ke arah Panyang; belum pasti mobil listrik pulang boleh berhenti di sana. Zuhur 12.55 di tempat kering, dengan bekal makan siang. Kamu masih musafir (menginap kurang dari empat hari, menurut NU Online), jadi Zuhur boleh dijamak dengan Asar.'],
      ['±13.15–14.45', 'Panyang → Zhuoma Beach → Air Terjun Bailong → Shanghaizi, mengikuti rute Tongcheng; naik kendaraan atau jalan kaki belum dicek.'],
      ['±15.00–16.00', 'Bus taman turun. Jam bus terakhir tidak diumumkan, jadi tinggalkan Shanghaizi paling lambat ±15.15. Asar 15.53 di gerbang.'],
      ['±16.30–18.15', 'Istirahat, salin kartu memori, isi baterai. Cahaya emas mulai 17.37 hanya di puncak; matahari terbenam 18.12.'],
      ['18.14', 'Maghrib; Isya 19.37. Pastikan mobil 07.45 ke Chengdu.'],
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
    date: '2026-11-13', title: 'Kembali ke Chengdu untuk salat Jumat', shortTitle: 'Salat Jumat di Chengdu',
    route: ['Bipenggou', 'Dujiangyan', 'Chengdu', 'Masjid Huangcheng'],
    overnight: { name: 'Chengdu', detail: 'Sofis Svyain Hotel di Chunxi Road, hotel usulan untuk 8 November di halaman penginapan; malam pertama dari dua. Jalannya (署袜北二街) sekitar 1,35 km garis lurus dari Masjid Huangcheng. Resepsionis 24 jam, titip koper berbayar, tidak menerima tunai. Harga 13–15 November belum diketahui. Alternatif: POSHPACKER Chengdu Local Tea Hostel.' },
    transport: 'Mobil lokal Bipenggou → Chengdu, sekitar 200 km (OSRM 2 jam 18 menit; sisihkan 3–3¼ jam); taksi atau jalan kaki ke masjid.',
    intro: 'Satu-satunya kali opsi ini kembali ke Chengdu, demi salat Jumat di Masjid Huangcheng. Sore istirahat setelah tiga hari di pegunungan.',
    steps: [
      ['±06.03', 'Subuh di penginapan; sarapan; check-out. Matahari terbit 07.34.'],
      ['07.45', 'Berangkat dengan sopir lokal, idealnya sopir Maoxian 11 November. Sopir Klook dari Chengdu harus menginap dekat gerbang supaya bisa menjemput jam ini.'],
      ['±07.45–11.00', 'Bipenggou → G4217 → Dujiangyan → Chengdu.'],
      ['±11.00–11.30', 'Turun di hotel dan titip koper (berbayar). Bila mobil baru tiba lewat 11.45, langsung ke masjid dan titip koper sesudahnya.'],
      ['±11.30–12.00', 'Taksi atau jalan kaki ke Masjid Huangcheng, 1,35 km garis lurus (waktu jalan kaki belum dicek).'],
      ['±12.00–14.00', 'Salat Jumat di Masjid Huangcheng (皇城清真寺), Qingyang. Zuhur 12.50. Jam khotbah belum pasti: daftar aplikasi untuk seluruh kota pada April 2026 menyebut azan 13.03 dan khotbah 13.13. Telepon +86 28 8612 7422 (halaman Trip.com).'],
      ['±14.00–15.00', 'Makan siang halal hangat dekat masjid; unggahan pengunjung menyebut kedai daging sapi Huangchengba (belum diverifikasi).'],
      ['±15.00–18.00', 'Check-in dan istirahat. Asar 15.49.'],
      ['18.10', 'Maghrib; Isya 19.33. Makan malam dekat Chunxi Road.'],
    ],
    stops: [
      { place: 'huangcheng-mosque', note: 'Salat Jumat. Alamat berbeda antarsumber (小河街2号 di OSM, 永靖街80号 di islamichina); pakai nama 皇城清真寺.' },
      { place: 'chengdu', note: 'Makan malam dekat hotel di Chunxi Road; dua malam di sini.' },
    ],
    notes: [],
    risks: [
      'Jam khotbah belum diketahui; tiba di masjid pukul 12.00 memberi kelonggaran bila khotbah mulai sekitar 13.00.',
      '13 November hari terakhir libur sekolah; kondisi lalu lintas kota belum diketahui.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-14', title: 'Panda Base pagi, Menara Vitality malam', shortTitle: 'Panda Base & Menara Vitality',
    route: ['Chunxi Road', 'Panda Base', 'Huangchengba', 'Chengdu SKP', 'Twin Towers'],
    overnight: { name: 'Chengdu', detail: 'Sofis Svyain Hotel yang sama, malam kedua dari dua.' },
    transport: 'DiDi sekitar 16 km ke Panda Base (OSRM 22 menit; sisihkan 35–40 menit) atau Metro jalur 3 ke 熊猫大道 plus shuttle; sore Metro jalur 1 ke 锦城广场 (±50–55 menit dari hotel) atau DiDi; malam Metro ke 金融城.',
    intro: 'Panda pagi, siang istirahat, lalu malam santai di Menara Vitality dan pertunjukan Twin Towers yang hanya ada Jumat dan Sabtu pukul 20.00. Kunjungan wajib ke menara sudah dilakukan 8 November, sama seperti rencana utama, jadi malam ini tambahan. Bila lelah, satu kunjungan sudah cukup: lewati dan tidur lebih awal, karena D239 berangkat 08.33.',
    steps: [
      ['±05.59', 'Subuh. Matahari terbit 07.29.'],
      ['±06.55', 'DiDi ke Panda Base (成都大熊猫繁育研究基地).'],
      ['±07.40', 'Antre dengan paspor yang dipakai memesan.'],
      ['08.00', 'Masuk sesi pagi. November–Februari: pagi 08.00–12.00, siang 12.00–16.30, pengunjung keluar 17.30 (halaman resmi).'],
      ['±08.00–10.00', 'Jam-jam pertama setelah buka, saat panda paling aktif.'],
      ['±10.00–11.45', 'Sisa kawasan dengan santai, lalu keluar.'],
      ['±12.00–13.00', 'Makan siang halal di kawasan Huangchengba, dekat 皇城清真寺. Zuhur 12.51.'],
      ['±13.00–15.45', 'Istirahat dan cadangkan file. Beli bekal halal untuk kereta 9 jam besok (belum ada katering halal terverifikasi di kereta) dan untuk 16–17 November di Shangri-La. Siapkan kamera dan tripod sebelum Asar.'],
      ['±15.49–15.55', 'Asar 15.49 di hotel.'],
      ['±15.55–16.50', 'Jalan ±17 menit ke 天府广场, Metro jalur 1 ke selatan 10 stasiun sampai 锦城广场, lalu jalan ±9 menit ke Menara Vitality: totalnya ±50–55 menit, tanpa ganti kereta. Atau DiDi ±16.20, sekitar 12,5 km dan ±15 menit tanpa macet; Sabtu sore bisa lebih lama, jadi lihat estimasi di aplikasi.'],
      ['±16.50–17.30', 'Chengdu SKP tanpa terburu-buru: taman di atas mal, tangga besar, dan plaza cekung. Mal buka 10.00–22.00.'],
      ['±17.30–18.07', 'Cahaya emas dari ±17.33 sampai matahari terbenam 18.07: siluet menara dengan Global Center di belakangnya.'],
      ['18.10', 'Maghrib di sudut tenang taman, atau dijamak takhir dengan Isya di hotel.'],
      ['±18.20–19.25', 'Langit biru ±18.23–18.43, lalu tunggu lampu cincin menara menyala; pengelola tidak mengumumkan jamnya. Rekam beberapa siklus warna dari tangga atau tepi kolam. Bila lampu belum menyala pukul 19.25, pilih salah satu: tetap di SKP, atau berangkat ke Twin Towers.'],
      ['±19.25–19.55', 'Tinggalkan SKP paling lambat 19.25. Perjalanan ke danau Jiaozi Park ±25–30 menit: jalan kaki ±2,2 km ke utara, atau Metro jalur 1 dua stasiun dari 锦城广场 ke 金融城 lalu menyeberangi 天府大道 ke danau.'],
      ['±19.55–20.30', 'Twin Towers (天府双塔) dari danau Jiaozi Park atau jembatan 交子之环, sudah di tempat sebelum pertunjukan tematik Sabtu 20.00 (pemberitahuan Oktober 2025). Cek akun WeChat 天府双塔 hari itu.'],
      ['±20.30–21.30', 'Metro jalur 1 delapan stasiun ke 天府广场, lalu makan malam di kedai bertanda 清真 sekitar 皇城清真寺 (belum diverifikasi; tanyakan status halal di tempat).'],
      ['±21.30', 'Kembali ke hotel. Isya (mulai 19.33), dan Maghrib bila dijamak takhir. Isi baterai; tidur paling lambat 22.30, besok check-out 07.30.'],
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
    overnight: { name: 'Lijiang', elevation: '2.400 m', detail: '166 Hotel Lijiang Ancient City, hotel yang sama dengan 18 November (resepsionis 24 jam, titip koper; CNY 72–76 untuk 18–19 November). Harga 15–16 November belum diketahui.' },
    transport: 'DiDi 8,3 km ke Chengdu South (sisihkan 20–30 menit); D239 08.33–17.46 (kelas dua CNY 376); taksi ke kota tua, sekitar 10 km, 25–40 menit, CNY 30–50 per mobil.',
    intro: 'Sembilan jam kereta pemandangan dari cekungan Sichuan ke Yunnan. Malam ini di Lijiang dulu, bukan langsung ke Shangri-La, supaya tidak naik dari 500 m ke 3.300 m dalam sehari.',
    steps: [
      ['±05.59', 'Subuh di hotel.'],
      ['±07.30', 'Check-out; DiDi dengan koper ke Chengdu South.'],
      ['±07.50', 'Pemeriksaan paspor dan keamanan. Batas bagasi kereta cepat 130 cm (jumlah sisi) dan 20 kg; koper 28–30 inci biasanya lebih dari 130 cm, tetapi penerapannya kabarnya longgar.'],
      ['08.33', 'D239 ke Lijiang, 9 jam 13 menit. Rekam video dari jendela; makan dari bekal halal.'],
      ['±12.51–13.10', 'Zuhur di kereta (12.51 di Chengdu, 13.06 di Lijiang), dijamak takdim dengan Asar.'],
      ['17.46', 'Tiba di Stasiun Lijiang. Matahari terbenam 18.29.'],
      ['±18.00–18.45', 'Taksi atau DiDi ke hotel. Maghrib 18.31; bila perlu dijamak dengan Isya (19.51) di hotel.'],
      ['±19.15–20.30', 'Makan malam di kedai Hui bertanda 清真 dekat kota tua (belum diverifikasi, sama seperti rencana utama). Beli bekal halal untuk sarapan dan makan siang 16 November, juga siang 17 November.'],
      ['Malam', 'Pastikan mobil 08.30 dan tempat untuk koper.'],
    ],
    stops: [
      { place: 'chengdu-south', note: 'D239 berangkat 08.33; tiba 30–45 menit lebih awal.' },
      { place: 'lijiang-station', note: 'Tiba 17.46.' },
      { place: 'dayan', note: 'Malam pertama di Lijiang, hotel yang sama dengan 18 November.' },
    ],
    notes: [],
    risks: [
      'Koper melebihi aturan 130 cm.',
      'D239 satu-satunya kereta langsung Chengdu–Lijiang di Trip.com; bila batal, harus ganti kereta di Kunming.',
    ],
    fromMain: false,
  },
  {
    date: '2026-11-16', title: 'Lijiang ke Upper Tiger Leaping Gorge, lalu Shangri-La', shortTitle: 'Upper Gorge ke Shangri-La',
    route: ['Lijiang', 'Hutiaoxia', 'Upper Tiger Leaping Gorge', 'Shangri-La'],
    overnight: { name: 'Shangri-La', elevation: '3.300 m', detail: 'Dukezong, malam pertama dari dua, dalam satu kamar twin untuk 16–18 November. Usulan: Duge Grand Hotel (resepsionis 24 jam, pemanas, tanpa oksigen; CNY 82–96 untuk 17–18 November). Alternatif: Jianyi Light Luxury B&B (ada oksigen, resepsionis 08.30–24.00; CNY 111–118 untuk 17–18 November). Harga 16–18 November dan ketersediaan kamar twin belum diketahui.' },
    transport: 'Mobil sewa dengan koper: Lijiang → Hutiaoxia/Qiaotou → Upper Gorge, 80 km (OSRM 1 jam 16 menit); Upper Gorge → Dukezong, 98 km (OSRM 1 jam 31 menit).',
    intro: 'Hari darat dengan satu perhentian panjang di Upper Tiger Leaping Gorge sisi Shangri-La, lewat jalur pengunjung resmi ke tepi sungai. Kereta Lijiang–Shangri-La tidak bisa berhenti di ngarai, jadi hanya jalan darat yang melewatinya.',
    steps: [
      ['±06.12', 'Subuh. Sarapan dari bekal yang dibeli semalam. Matahari terbit 07.40.'],
      ['08.30', 'Mobil sewa dari hotel dengan koper. Taksi bisa sampai ke pintu 166 Hotel menurut ulasan September 2026.'],
      ['±08.30–10.00', 'Lijiang → kota Hutiaoxia (Qiaotou) → Upper Tiger Leaping Gorge (上虎跳, sisi Shangri-La), sekitar 1½ jam.'],
      ['±10.00–12.30', 'Upper Gorge: tiket CNY 45; eskalator CNY 70 pulang-pergi (tidak resmi; CNY 80 di sebagian platform); jam musim dingin kira-kira 08.00–17.30 (tidak resmi). Belum diketahui apakah sinar matahari langsung sampai ke sungai; menjelang siang lebih mungkin daripada 08.30, tetapi belum diverifikasi.'],
      ['±12.30–14.15', 'Lanjut ke Shangri-La; makan siang dari bekal di mobil.'],
      ['±14.15–14.45', 'Check-in di Dukezong. Zuhur (mulai 13.08).'],
      ['±14.45–17.30', 'Istirahat. Kamu tidur sekitar 900 m lebih tinggi dari semalam, lebih dari batas 500 m per malam dalam panduan CDC. Asar 16.10.'],
      ['±17.30–18.55', 'Dukezong dekat hotel saja: cahaya emas mulai 17.55, matahari terbenam 18.29, langit biru sampai ±18.53.'],
      ['18.31', 'Maghrib; Isya 19.52. Makan malam dari bekal halal. Belum ada kedai halal yang terverifikasi buka: dua daftar Ctrip (阿润清真小吃, 友兴回族牛肉馆) berstatus "merchant offline" pada 5 November.'],
    ],
    stops: [
      { place: 'upper-tiger-leaping-gorge', note: 'Sekitar 10.00–12.30. Tiket CNY 45, eskalator CNY 70 pulang-pergi (tidak resmi).' },
      { place: 'dukezong', note: 'Sore ini dekat hotel saja; dua malam di sini.' },
    ],
    notes: [
      { text: 'Trek High Trail tidak dimasukkan karena resmi dilarang: pemberitahuan Pemerintah Kota Shangri-La 10 Februari 2026 mengancam denda CNY 100–5000, dan pengelola menutup seluruh High Trail sejak 1 Mei 2026.', links: [highTrailNotice, highTrailOperator] },
    ],
    risks: [
      'Harga mobil satu arah ini belum diketahui; minta penawaran tertulis yang mencantumkan lama berhenti dan tempat untuk koper 28–30 inci.',
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
      ['±06.16', 'Subuh. Tidur lagi; ini hari penuh pertamamu di 3.300 m.'],
      ['±08.30–13.00', 'Sarapan, istirahat, sunting dan cadangkan foto. Tanyakan ke hotel akses, tiket, dan jam buka Napahai; semuanya belum diketahui.'],
      ['13.09', 'Zuhur; Asar 16.10. Menjamak boleh selama masih musafir.'],
      ['Siang', 'Kereta temanmu dari Kunming (12306, 4–5 November): sarankan C118 (tiba 14.25) atau C86 (15.00) supaya sempat istirahat sebelum makan malam. C638 tiba 18.40; C642 (22.25) hanya pilihan terakhir.'],
      ['±15.30–18.30', 'Opsional, hanya bila tidak pusing: cagar alam Napahai (纳帕海), sekitar 8 km barat laut Dukezong. Cahaya emas mulai 17.55, matahari terbenam 18.28. Temanmu ikut bila datang dengan C118 atau C86 dan merasa sehat.'],
      ['18.31', 'Maghrib di Napahai, atau dijamak dengan Isya (19.52) di hotel.'],
      ['±19.15–20.30', 'Makan malam berdua dari bekal; belum ada kedai halal terverifikasi. Selesaikan pembayaran dan urusan koper untuk berangkat 07.30 besok; Duge punya resepsionis 24 jam, resepsionis Jianyi baru buka 08.30.'],
    ],
    stops: [
      { place: 'napahai', note: 'Opsional, sore. Tiket, jam buka, dan akses jalan November 2026 belum diketahui.' },
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

// 8 November's plan and practical notes prepare the main plan's C5746 06.14; the calm option prefers C5772 07.30 (9 November).
const mondayTrainNote: CalmNote = { text: 'Di opsi santai, kereta Senin pagi utamanya C5772 07.30 dengan DiDi sekitar 06.30 (lihat Hari 2). DiDi 05.15 dan C5746 06.14 yang disebut di hari ini hanya berlaku bila Trip.com tidak menjual slot shuttle stasiun setelah 09.31.', links: [] };

export const calmDays: CalmDay[] = [{ ...fromMainPlan('2026-11-08'), notes: [mondayTrainNote] }, ...calmOwnDays, ...['2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21'].map(fromMainPlan)];
export const calmStopIds = calmDays.flatMap(day => day.stops.map(stop => stop.place));

export const calmComparison = {
  dropped: [
    'Sichuan barat: 理小路 ke Rilong dan Siguniangshan, Danba, Moshi Park, Tagong, Xinduqiao, Kangding, dan G318 ke Litang (11–14 November).',
    'Daocheng dan Yading: Haizi Shan, Riwa, Chonggu, Luorong, Milk Lake, Five-Colour Lake, dan Pearl Lake (15–16 November), lalu jalan Xiangcheng dan Daxueshan ke Shangri-La (17 November).',
    'Kereta kembali ke Chengdu dan bus ke Lixian pada 10 November, juga malam di Lixian.',
    'Berangkat 05.15 pada 9 November, yang kini hanya cadangan bila tidak ada shuttle untuk C5772.',
  ],
  added: [
    'Hari kedua di Jiuzhaigou (10 November): Mirror Lake pagi, Long Lake dan Five-Colour Pond siang, Nuorilang, dan Pearl Shoals.',
    'Kota tua Songpan dan Masjid Utara Songpan dengan makan siang halal, lalu kereta C5754 ke Maoxian (11 November).',
    'Bipenggou seharian penuh (12 November) dengan dua malam di gerbang.',
    'Salat Jumat di Masjid Huangcheng (13 November) dan Panda Base pagi (14 November).',
    'Kereta pemandangan D239 Chengdu South → Lijiang (15 November).',
    'Upper Tiger Leaping Gorge di perjalanan darat ke Shangri-La (16 November).',
    'Dua malam di Shangri-La, dengan 17 November sebagai hari santai dan Napahai opsional.',
  ],
};

export const calmTradeOffs = [
  'Dataran tinggi Sichuan barat dan Yading hilang seluruhnya: tidak ada Litang (4.014 m), danau Yading, atau G318. Risiko ketinggian dan jalan tanah ikut berkurang.',
  'Rute kembali ke Chengdu sekali, 13 November, demi salat Jumat dan Panda Base.',
  '11 November memakai tiga kendaraan dalam sehari, dan harga kedua mobilnya belum diketahui.',
  'Libur sekolah Chengdu 11–13 November, ditambah akhir pekan, jatuh tepat di Bipenggou dan Panda Base: siap antre dan beli tiket lebih dulu.',
  'Malam 16 November naik sekitar 900 m sekaligus dari Lijiang ke Shangri-La, jadi 17 November dibuat ringan.',
  'Harga hotel untuk tanggal-tanggal baru belum dicek; angka di halaman ini berasal dari tanggal lain.',
];

const tripcomTrain = (from: string, to: string) => `https://id.trip.com/trains/china/route/${from}-to-${to}/`;

export const calmBookingGroups: CalmBookingGroup[] = [
  {
    id: 'tickets', title: 'Tiket dan kereta', lead: 'Yang paling cepat habis di atas.',
    items: [
      { date: '2026-11-12', item: 'Tiket Bipenggou + bus taman + mobil listrik pulang-pergi', urgency: 'now', price: 'CNY 190 (paket) untuk 11 November di Trip.com, dicek 4 November; Qunar mencantumkan "mulai CNY 190" (5 November). Harga 12 November belum dicek. Tanpa paket CNY 140 termasuk bus (Qunar), ditambah mobil listrik CNY 30 pulang-pergi atau CNY 20 sekali jalan per ruas (Tongcheng).', channel: 'Trip.com, paket non-daratan; voucher ditukar dengan paspor di loket.', opens: 'Sudah dijual. Beli hari ini: libur sekolah 11–13 November, dan tahun lalu tiket 13–14 November habis.', link: { label: 'Trip.com: Bipenggou', url: 'https://www.trip.com/travel-guide/attraction/li-county/bipeng-valley-89964/?scene=ticket' } },
      { date: '2026-11-14', item: 'Panda Base, sesi pagi Sabtu 14 November', urgency: 'now', price: 'CNY 55 dewasa (halaman resmi).', channel: 'Trip.com, platform resmi menurut halaman tiket Panda Base; cadangan akun WeChat atau mini program resmi.', opens: 'Dijual sampai 14 hari sebelumnya, jadi sudah buka; berhenti saat kuota harian habis. Beli hari ini.', link: { label: 'Trip.com: Panda Base', url: 'https://www.trip.com/travel-guide/attraction/chengdu/chengdu-research-base-of-giant-panda-breeding-76342?poiType=3&locale=en-US' } },
      { date: '2026-11-09', item: 'Jiuzhaigou + bus taman, 9 November', urgency: 'now', price: 'CNY 280 (CNY 190 + bus CNY 90), tarif 1 April–15 November di halaman tiket resmi. Slot 12.00–14.00 dengan C5772, atau 10.00–12.00 dengan C5746.', channel: 'Trip.com: Admission + Sightseeing Bus, Adult (Non-Chinese mainland visitors); cadangan mini program 九寨沟旅游官方平台.', opens: 'Sudah dijual; kuota 41.000 per hari dan pernah habis. Ketersediaan slot 12.00–14.00 belum dicek.', link: { label: 'Trip.com: Jiuzhaigou', url: 'https://www.trip.com/travel-guide/attraction/jiuzhaigou/jiuzhaigou-national-park-89895/?scene=ticket' } },
      { date: '2026-11-10', item: 'Jiuzhaigou kedua + bus taman, 10 November', urgency: 'now', price: 'CNY 280 (190 + 90), tarif musim ramai sampai 15 November menurut halaman tiket resmi. Tidak ditemukan diskon dua hari atau masuk kedua di halaman resmi.', channel: 'Trip.com, produk yang sama dengan tanggal terpisah; cadangan mini program 九寨沟旅游官方平台, dengan daftar tunggu bila habis.', opens: 'Sudah dijual. Stok dirilis setiap hari 08.00 dan 17.00, dan tiket yang dibatalkan kembali ke stok (Guangming, 4 Oktober 2026).', link: { label: 'Trip.com: Jiuzhaigou', url: 'https://www.trip.com/travel-guide/attraction/jiuzhaigou/jiuzhaigou-national-park-89895/?scene=ticket' } },
      { date: '2026-11-09', item: 'C5772 Chengdu East 07.30 → Huanglongjiuzhai 09.31 + shuttle stasiun', urgency: 'now', mode: 'train', price: 'Tarif C5772 belum dicek. Cadangan C5746 06.14: CNY 143 + shuttle CNY 35 (dicek 4 November untuk rencana utama).', channel: 'Trip.com, atau 12306 sebagai cadangan.', opens: 'Sudah dijual; 12306 menunjukkan kursi kelas dua untuk 9 November pada 5 November. Beli hanya bila ada slot shuttle setelah 09.31.', link: { label: 'Trip.com: Chengdu ke Huanglongjiuzhai', url: tripcomTrain('chengdu', 'huanglongjiuzhai') } },
      { date: '2026-11-11', item: 'C5754 Huanglongjiuzhai 14.14 → Maoxian 15.00, satu kursi', urgency: 'now', mode: 'train', price: 'CNY 66 kelas dua, CNY 105 kelas satu (tarif 12306, 5 November).', channel: 'Trip.com, atau 12306 sebagai cadangan.', opens: 'Sudah dijual; 12306 menunjukkan kursi kelas dua pada 5 November, dan halaman rute Trip.com mencantumkan C5754.', link: { label: 'Trip.com: Huanglongjiuzhai ke Maoxian', url: tripcomTrain('huanglongjiuzhai', 'maoxian') } },
      { date: '2026-11-15', item: 'D239 Chengdu South 08.33 → Lijiang 17.46, satu kursi', urgency: 'now', mode: 'train', price: 'CNY 376 kelas dua (12306, 4–5 November).', channel: 'Trip.com, atau 12306 sebagai cadangan.', opens: 'D239 tanggal 15 November sudah bisa dibeli sekarang: dijual sejak 1 November 09.00 waktu China, dan 12306 masih menunjukkan kursi kelas dua pada 5 November.', link: { label: 'Trip.com: Chengdu ke Lijiang', url: tripcomTrain('chengdu', 'lijiang') } },
      { date: '2026-11-16', item: 'Tiket Upper Tiger Leaping Gorge (sisi Shangri-La)', urgency: 'onsite', price: 'CNY 45 dewasa (FieldGuide, 2 November 2026); eskalator CNY 70 pulang-pergi (tidak resmi).', channel: 'Di lokasi, atau lewat situs pengelola.', opens: 'Pengelola melaporkan buka normal; longsor 30 Juli dan 3 September berada di luar area pengunjung.', link: { label: 'Pengelola Tiger Leaping Gorge', url: 'https://www.xgllhtx.cn/' } },
    ],
  },
  {
    id: 'cars', title: 'Mobil: minta penawaran tertulis', lead: 'Harga semua mobil belum diketahui. Minta harga all-in tertulis dari sopir berizin.',
    items: [
      { date: '2026-11-11', item: 'Mobil sewa hotel Jiuzhaigou → kota tua Songpan → Stasiun Huanglongjiuzhai', urgency: 'now', mode: 'car', price: 'Belum diketahui. Acuan saja: Etripchina mencantumkan sewa mobil dengan sopir di Jiuzhaigou mulai USD 112, tanpa rute dan jam.', channel: 'Trip.com Car charter atau hotel; minta sopir berizin (营运证). Sekitar 117 km ditambah ±4 jam menunggu dengan koper.', opens: 'Minta penawaran sekarang.', link: { label: 'Etripchina: mobil di Jiuzhaigou', url: 'https://www.etripchina.com/transfer-service/jiuzhaigou.htm' } },
      { date: '2026-11-11', until: '2026-11-13', item: 'Mobil Stasiun Maoxian → gerbang Bipenggou (11 November 15.00), lalu Bipenggou → Chengdu (13 November 07.45)', urgency: 'now', mode: 'car', price: 'Belum diketahui; tidak ada produk Trip.com atau Klook untuk Maoxian. Rumus charter Trip.com di area Lixian dari rencana utama (8 jam/100 km CNY 723 + CNY 4 per km, untuk 11 November) hanya acuan.', channel: 'Tanya Xinlan Homestay atau sopir di Lixian; idealnya satu sopir dan satu penawaran untuk kedua hari, termasuk penginapan sopir.', opens: 'Atur secara tertulis sekarang.' },
      { date: '2026-11-13', item: 'Cadangan 13 November: Klook 194211 Bipenggou → Chengdu', urgency: 'now', mode: 'car', price: '±CNY 625–630 per mobil di cuplikan pencarian (5 November); arah dan harga checkout belum dicek.', channel: 'Klook, hanya setelah penjual memastikan jemput 07.45 di gerbang dan harga untuk arah ini.', opens: 'Halaman Klook menolak pemeriksaan otomatis (HTTP 403).', link: { label: 'Klook 194211', url: 'https://www.klook.com/en-US/activity/194211-private-pick-up-and-drop-off-service-one-way-between-chengdu-and-siguniang-mountain-bipenggou/' } },
      { date: '2026-11-16', item: 'Mobil sewa Lijiang 08.30 → Upper Tiger Leaping Gorge (berhenti ±2½ jam) → Dukezong, satu arah', urgency: 'week', mode: 'car', price: 'Belum diketahui untuk rute ini. Acuan: FieldGuide menyebut CNY 400–600 per mobil untuk Lijiang ke ngarai pulang-pergi; charter per jam Trip.com di Lijiang mulai CNY 296 (5 kursi) atau CNY 452 (7 kursi), dari rencana utama.', channel: 'Trip.com Car charter (multi-city) atau hotel di Lijiang; minta penawaran yang mencantumkan lama berhenti dan tempat untuk koper 28–30 inci.', opens: 'Atur sebelum 15 November.', link: { label: 'Trip.com: charter di Lijiang', url: 'https://www.trip.com/chartered-car-seo/hourly/lijiang/?curr=CNY' } },
      { date: '2026-11-16', item: 'Alternatif: shuttle Trip.com 87712606 Lijiang → Dukezong dengan berhenti di ngarai', urgency: 'week', mode: 'shuttle', price: 'Mulai CNY 128 per orang tanpa tiket ngarai, minimal 2 orang (dilihat 4 November). Harga untuk satu orang belum diketahui.', channel: 'Trip.com; tanyakan tertulis jam berangkat, titik jemput, sisi ngarai, lama berhenti, harga satu orang, dan tempat koper.', opens: 'Paket 5–18 November terlihat 4 November; batal gratis sampai 15.00 sehari sebelumnya.', link: { label: 'Trip.com 87712606', url: 'https://www.trip.com/things-to-do/detail/87712606/' } },
    ],
  },
  {
    id: 'stays', title: 'Penginapan', lead: 'Angka berikut dicek 4 November untuk rencana utama, sebagian untuk tanggal lain; harga tanggal baru belum dicek.',
    items: [
      { date: '2026-11-09', until: '2026-11-10', item: 'Jiuzhaigou Yinghai Holiday Hotel, malam 9 dan 10 November', urgency: 'now', price: 'CNY 167–177 untuk 9–10 November; 10–11 November belum diketahui.', channel: 'Trip.com.', opens: 'Bisa dipesan sekarang.', link: { label: 'Trip.com: Yinghai Holiday Hotel', url: 'https://us.trip.com/hotels/jiuzhaigou-hotel-detail-75225558/jiuzhaigou-yinghai-holiday-hotel/' } },
      { date: '2026-11-11', until: '2026-11-12', item: 'Xinlan Homestay, malam 11 dan 12 November', urgency: 'now', price: 'CNY 158–168 untuk 10–11 November; 11–13 November belum diketahui.', channel: 'Trip.com.', opens: 'Bisa dipesan sekarang. Cek ulang harga dan pembatalan gratis untuk 11–13 November, setelah mengecek lokasi dan makanan halal Good B&B.', link: { label: 'Trip.com: Xinlan Homestay', url: 'https://us.trip.com/hotels/li-county-hotel-detail-81450342/' } },
      { date: '2026-11-13', until: '2026-11-14', item: 'Sofis Svyain Hotel, malam 13 dan 14 November', urgency: 'now', price: 'Belum diketahui untuk 13–15 November (CNY 124–158 untuk 8–9 November).', channel: 'Booking.com. Ini hotel usulan untuk 8 November di halaman penginapan, jadi malam itu bisa dipesan sekalian.', opens: 'Bisa dipesan sekarang.', link: { label: 'Booking.com: Sofis Svyain Hotel', url: 'https://www.booking.com/hotel/cn/suo-fei-si-wei-deng-jiu-dian.html' } },
      { date: '2026-11-15', item: '166 Hotel Lijiang Ancient City, malam 15 November (dan 18 November)', urgency: 'now', price: 'Belum diketahui untuk 15–16 November (CNY 72–76 untuk 18–19 November).', channel: 'Trip.com.', opens: 'Bisa dipesan sekarang.', link: { label: 'Trip.com: 166 Hotel', url: 'https://us.trip.com/hotels/detail/?hotelId=109842432&curr=CNY' } },
      { date: '2026-11-16', until: '2026-11-17', item: 'Shangri-La: satu kamar twin untuk 16–18 November', urgency: 'now', price: 'Belum diketahui untuk 16–18 November (CNY 82–118 untuk 17–18 November).', channel: 'Trip.com; Duge Grand Hotel disarankan. Beri tahu hotel bahwa tamu kedua tiba 17 November.', opens: 'Bisa dipesan sekarang.', link: { label: 'Trip.com: Duge Grand Hotel', url: 'https://uk.trip.com/hotels/shangri-la-hotel-detail-3396520/rongcheng-gangwan-business-hotel/' } },
      { date: '2026-11-08', item: 'Malam 8, 18, 19, dan 20 November: penginapan rencana utama', urgency: 'now', price: 'Sama dengan rencana utama; harga per malam ada di halaman Hotel & hostel.', channel: 'Pilihan per malam di halaman Hotel & hostel. Pastikan setiap penginapan menerima paspor asing sebelum membayar.', opens: 'Bisa dipesan sekarang.', link: { label: 'Hotel & hostel per malam', url: staysPath } },
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
  '9 November: ada tidaknya slot shuttle stasiun setelah C5772 (tiba 09.31), tarif C5772, dan ketersediaan slot Jiuzhaigou 12.00–14.00.',
  'Harga semua mobil: Jiuzhaigou → Songpan → Stasiun Huanglongjiuzhai (11 November), Stasiun Maoxian → Bipenggou (11 November), Bipenggou → Chengdu (13 November), dan Lijiang → Upper Gorge → Shangri-La (16 November). Juga apakah satu sopir lokal bisa mengambil 11 dan 13 November.',
  'Tarif C5764, pilihan lebih awal pada 11 November.',
  'Status G213 Maoxian–Wenchuan setelah pengumuman pengalihan 16 September, dan apakah Dingziba dibuka lagi setelah laporan 22 Oktober.',
  'Nama restoran halal di Songpan, dan apakah Masjid Utara Songpan menerima musafir untuk salat.',
  'Good B&B (不鞠民宿): jaraknya dari gerbang Bipenggou, dan apakah makanan halal tersedia pada November.',
  'Harga hotel untuk tanggal baru: Jiuzhaigou 10–11 November, Xinlan 11–13 November (libur sekolah), Sofis Svyain 13–15 November, 166 Hotel 15–16 November, dan kamar twin Shangri-La 16–18 November.',
  'Bipenggou: jam bus terakhir turun, apakah tiket mobil listrik pulang-pergi boleh turun di Moon Bay dan Red Stone Beach, waktu berjalan kaki, dan jalan kaki dari Xinlan ke gerbang.',
  'Masjid Huangcheng: jam khotbah 13 November, alamat pasti (小河街2号 atau 永靖街80号), dan waktu jalan kaki dari hotel.',
  'Kedai halal yang benar-benar buka di Shangri-La dan Dukezong (dua daftar Ctrip offline per 5 November), dan di kota tua Lijiang, yang juga belum diverifikasi rencana utama.',
  'Upper Tiger Leaping Gorge: harga resmi eskalator, jam musim dingin terbaru, dan apakah sinar matahari sampai ke sungai pada pertengahan November.',
  'Shuttle Trip.com 87712606: jam berangkat, titik jemput, sisi ngarai, lama berhenti, harga satu orang, dan tempat koper untuk 16 November.',
  'Napahai: tiket, jam buka, dan akses jalan pada November 2026.',
  'Apakah petugas menerapkan aturan bagasi 130 cm / 20 kg di C5772, C5754, D239, dan C984 untuk koper 28–30 inci.',
  'Jam lampu Menara Vitality, dan apakah pertunjukan Twin Towers 14 November benar-benar berlangsung (pemberitahuan terakhir Oktober 2025).',
  'Apakah Bipenggou 3 hari 2 malam dengan satu hari penuh di taman sesuai maksudmu.',
];

export const calmSources: Link[] = [
  { label: '12306: kursi dan tarif kereta 9, 11, dan 15 November (C5772, C6362, C5746, C5754, C5764, C5804, C5784, D239), dicek 5 November 2026', url: 'https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc' },
  { label: 'Trip.com: Chengdu ke Lijiang, hanya D239 08.33 → 17.46 (5 November 2026)', url: 'https://id.trip.com/trains/china/route/chengdu-to-lijiang/' },
  { label: 'Trip.com: Huanglongjiuzhai ke Maoxian, termasuk C5754 (5 November 2026)', url: 'https://id.trip.com/trains/china/route/huanglongjiuzhai-to-maoxian/' },
  { label: 'Chuanguan: G213 ditutup di Dingziba, Diexi; mobil penumpang dialihkan lewat Wenchuan–Maoxian (16 September 2026)', url: 'https://cbgc.scol.com.cn/news/7961183' },
  { label: 'Jimu lewat Sohu: G213 Dingziba masih ditutup dua arah (22 Oktober 2026)', url: 'https://www.sohu.com/a/1091125891_121443915' },
  { label: 'Chuanguan: tol Jiuma G0615 sampai padang Hongyuan (11 Februari 2026)', url: 'https://cbgc.scol.com.cn/news/7273820' },
  { label: 'OSRM: Jiuzhaigou ke Songpan, 104 km (5 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/103.9167742,33.2689518;103.5961504,32.6404283?overview=false' },
  { label: 'OSRM: Stasiun Maoxian ke gerbang Bipenggou, 132 km (5 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/103.9424872,31.7279208;102.9849,31.4155?overview=false&steps=true' },
  { label: 'OSRM: gerbang Bipenggou ke Chunxi Road, 200 km (5 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/102.9849,31.4155;104.0739845,30.6623577?overview=false' },
  { label: 'OSRM: Dayan ke Upper Tiger Leaping Gorge dan Dukezong (5 November 2026)', url: 'https://router.project-osrm.org/route/v1/driving/100.22072,26.86879;100.112808,27.1926037;99.7075855,27.8105134?overview=false' },
  { label: 'Open-Meteo: ketinggian Songpan, Stasiun Maoxian, gerbang Bipenggou, dan celah rencana C (5 November 2026)', url: 'https://api.open-meteo.com/v1/elevation?latitude=32.93,32.6404283,31.7279208,31.4155&longitude=103.31,103.5961504,103.9424872,102.9849' },
  { label: 'OpenStreetMap: Kota Tua Songpan', url: 'https://www.openstreetmap.org/way/519012579' },
  { label: 'OpenStreetMap: Stasiun Maoxian', url: 'https://www.openstreetmap.org/node/5151602754' },
  { label: 'OpenStreetMap: halte Long Lake, Jiuzhaigou', url: 'https://www.openstreetmap.org/node/12993883515' },
  { label: 'OpenStreetMap: jalur pengunjung Upper Tiger Leaping Gorge', url: 'https://www.openstreetmap.org/way/708347464' },
  { label: 'OpenStreetMap: Napahai', url: 'https://www.openstreetmap.org/way/36897816' },
  { label: 'OpenStreetMap: Masjid Huangcheng', url: 'https://www.openstreetmap.org/way/582845149' },
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
  { label: 'Prayer Times: jadwal salat Jumat Chengdu (April 2026)', url: 'https://prayer-times.app2mob.com/en/china/chengdu' },
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
  { label: 'Etripchina: sewa mobil dengan sopir di Jiuzhaigou', url: 'https://www.etripchina.com/transfer-service/jiuzhaigou.htm' },
  { label: 'Klook 194211: transfer Chengdu ↔ Bipenggou (5 November 2026)', url: 'https://www.klook.com/en-US/activity/194211-private-pick-up-and-drop-off-service-one-way-between-chengdu-and-siguniang-mountain-bipenggou/' },
];
