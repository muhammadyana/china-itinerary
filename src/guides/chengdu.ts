import type { DestinationGuide } from '../guide-types.ts';

const airportBusNotice = 'https://www.sina.cn/news/detail/5334306341259096.html';
const airportTransport = 'https://flights.ctrip.com/booking/airport-tfu/jichangjiaotong.html';
const taikooLiAccess = 'https://www.taikooli-chengdu.com/en/AboutUs/ArrivalPattern';
const taikooLiOverview = 'https://www.swireproperties.com/en/portfolio/current-developments/taikoo-li-chengdu/taikoo-li-chengdu/';
const chunxiRoadGuide = 'https://realchengdu.com/en/attractions/Chunxi-Road';
const skpOfficial = 'https://skp-beijing.com/shop?c=chengdu';
const towerOfLife = 'https://www.trip.com/travel-guide/attraction/chengdu/tower-of-life-142239549/';
const twinTowers = 'https://www.trip.com/travel-guide/attraction/chengdu/tianfu-twin-towers-of-chengdu-financial-city-149994616/';
const towerLaunch = 'https://m.thepaper.cn/newsDetail_forward_21184193';
const skpOpening = 'https://news.qq.com/rain/a/20221220A00LNF00';
const twinTowersShow = 'https://cd.bendibao.com/xiuxian/20251031/202848.shtm';
const towerGuide = 'https://mychina.guide/blog/chengdu-tower-of-vitality-guide';
const metroLine1 = 'https://www.openstreetmap.org/relation/7913598';
const osmRouting = 'https://routing.openstreetmap.de/';
const sunTimes = 'https://aa.usno.navy.mil/api/rstt/oneday?date=2026-11-08&coords=30.5693,104.0678&tz=8';
const halalBlog = 'https://wildgreatwall.com/halal-restaurants-in-chengdu-china/';

export const chengduGuides: DestinationGuide[] = [
  {
    slug: 'chengdu',
    name: 'Chengdu: Chunxi Road & Taikoo Li',
    region: 'Sichuan',
    placeIds: ['chengdu'],
    summary: 'Chunxi Road dan gang terbuka Taikoo Li ada di dekat hotel malam pertama. Pada 8 November kawasan ini cukup untuk makan siang telat dan belanja bekal, karena sore sampai malam dipakai untuk Menara Vitality di Chengdu SKP.',
    gettingThere: {
      origin: 'Bandara Chengdu Tianfu (TFU), Minggu 8 November',
      steps: [
        'Setelah mendarat pukul 12.20 dengan penerbangan domestik dari Shanghai (imigrasi sudah di Pudong), ambil bagasi. Pilihan praktis adalah taksi resmi dari antrean di lantai dasar Terminal 2, pintu G04, menuju hotel di Chengdu; simpan alamat hotel dalam bahasa Mandarin dan titipkan koper sebelum berjalan-jalan.',
        'Alternatif hemat: bus bandara jalur 1 (机场巴士1号线) dari pintu G03 di lantai dasar Terminal 2 menuju Chunxi Road. Lanjutkan ke hotel sebelum memulai jalan santai.',
        'Kedai untuk makan siang dan toko untuk bekal ada di sekitar 春熙路, dekat hotel. Jalan kaki ke 成都太古里 (No. 8 Middle Shamao Street) hanya cadangan bila rencana berubah; dari lokasi lain di kota, Metro jalur 2 atau 3 berhenti di Chunxi Road, yang terhubung dengan Taikoo Li.',
        'Makan siang telat di kedai 清真 atau 兰州拉面 dekat Chunxi Road, ±15.00–15.45, lalu kembali ke hotel untuk Asar. Senja dan malam dipakai di Menara Vitality, Chengdu SKP, jadi foto panda IFS dan atap Taikoo Li tidak masuk jadwal hari ini. Daftar mal di bagian malam pertama memuat cadangan bila rencana berubah.',
      ],
      duration: 'Operator memberi acuan sekitar 80 menit untuk bus jalur 1. Waktu dari pesawat sampai hotel lebih panjang karena bagasi, menunggu kendaraan, lalu lintas, dan perjalanan terakhir ke hotel.',
      sources: [airportBusNotice, airportTransport, taikooLiAccess, taikooLiOverview],
    },
    stopAccess: {
      chengdu: 'Pada 8 November, Chunxi Road (春熙路) dekat hotel hanya dipakai untuk makan siang telat dan belanja bekal. Jalan kaki ke gang dan plaza terbuka Taikoo Li (成都太古里) opsional bila rencana berubah; sesuaikan dengan hotel dan kondisi setelah penerbangan.',
    },
    costs: [
      {
        label: 'Jalan santai di Chunxi Road',
        amount: 'Gratis',
        detail: 'Referensi lokal mencantumkan jalan pejalan kaki tanpa tiket masuk. Alokasi jalan di area terbuka Taikoo Li tidak mencakup belanja, makanan, pameran, atau tempat berbayar.',
        status: 'published',
        source: chunxiRoadGuide,
      },
      {
        label: 'Bus bandara jalur 1, pilihan transportasi',
        amount: 'CNY 15 / orang pada siang hari',
        detail: 'Pengumuman operator 21 Agustus 2026 mencantumkan CNY 15 pukul 06.00–23.30 dan CNY 25 pukul 23.30–06.00. Periksa tarif dan titik naik saat tiba; perjalanan dari halte ke hotel terpisah.',
        status: 'published',
        source: airportBusNotice,
      },
      {
        label: 'Taksi bandara ke hotel, pilihan transportasi',
        amount: 'Perlu konfirmasi',
        detail: 'Tarif bergantung pada lokasi hotel, waktu, dan lalu lintas. Gunakan antrean resmi, pastikan argometer berjalan, dan tanyakan biaya tambahan sebelum berangkat.',
        status: 'unconfirmed',
        source: airportTransport,
      },
    ],
    visitDuration: 'Sekitar 45 menit, ±15.00–15.45, untuk makan siang telat dan belanja bekal setelah menaruh koper di hotel.',
    bestTime: 'Siang 8 November setelah check-in. Cahaya keemasan 17.37–18.11 dan langit biru ±18.26–18.45 dipakai di Chengdu SKP, bukan di kawasan ini.',
    tips: [
      'Simpan pin hotel dan nama 春熙路 serta 成都太古里 agar mudah kembali setelah menjelajah gang.',
      'Hari kedatangan padat: makan, belanja bekal, lalu kembali ke hotel untuk Asar sebelum DiDi ke Chengdu SKP sekitar 16.10.',
      'Jika memerlukan makanan halal, cari tanda 清真 lalu konfirmasikan bahan dan cara pengolahannya kepada restoran.',
    ],
    cautions: [
      'Kedatangan pukul 12.20 adalah jadwal HO1119 dari Shanghai, bukan waktu pasti keluar bandara. Persingkat jalan-jalan jika penerbangan terlambat.',
      'Malam 8 November menginap di Chengdu. Sebelum tidur, pastikan tiket, stasiun keberangkatan, dan waktu berangkat untuk perjalanan 9 November.',
    ],
    sources: [
      {
        title: 'Chengdu Bus: pengumuman resmi bus bandara jalur 1',
        url: airportBusNotice,
        kind: 'operator',
        publishedAt: '2026-08-21',
        note: 'Unggahan akun terverifikasi Chengdu Public Transport Group. Jadwal dan tarif dapat berubah; ikuti pengumuman di lokasi.',
      },
      {
        title: 'Ctrip: transportasi Bandara Tianfu',
        url: airportTransport,
        kind: 'reference',
        note: 'Referensi arah bus TFU T2 ke Chunxi Road dan layanan taksi. Halaman tidak mencantumkan tanggal pembaruan.',
      },
      {
        title: 'Taikoo Li: akses resmi dan Metro jalur 2/3',
        url: taikooLiAccess,
        kind: 'operator',
      },
      {
        title: 'Swire Properties: alamat dan kawasan Taikoo Li Chengdu',
        url: taikooLiOverview,
        kind: 'operator',
      },
      {
        title: 'RealChengdu: akses jalan pejalan kaki Chunxi Road',
        url: chunxiRoadGuide,
        kind: 'reference',
        note: 'Referensi lokal untuk akses tanpa tiket; bukan pengumuman tarif pemerintah atau operator.',
      },
    ],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'chengdu-skp-tower',
    name: 'Chengdu SKP: Menara Vitality',
    region: 'Sichuan',
    placeIds: ['chengdu-skp-tower'],
    summary: 'Menara Vitality (成都SKP 生机之塔, di Trip.com disebut Tower of Life, di blog berbahasa Inggris bamboo tower) adalah enam tiang air di taman terbuka mal Chengdu SKP. Datang sore untuk mencari sudut dan cahaya keemasan, lalu tunggu lampu cincinnya menyala setelah gelap. Jiaozi Park dan Tianfu Twin Towers, sekitar 2,2 km ke utara, menjadi tambahan opsional.',
    gettingThere: {
      origin: 'Hotel di Chunxi Road, Minggu 8 November',
      steps: [
        'Salat Asar dulu di hotel (mulai 15.51), lalu pesan DiDi sekitar 16.10 dengan tujuan 成都SKP 生机之塔. Jaraknya sekitar 12,5 km; tanpa macet ±15 menit, tetapi Minggu sore bisa lebih lama, jadi lihat estimasi di aplikasi.',
        'Bila pin menara tidak muncul, ketik 锦城广场东地铁站B口. Pintu B stasiun Metro jalur 18 ini sekitar 230 m jalan kaki dari tiang-tiang air.',
        'Metro tanpa ganti kereta: jalan ±17 menit ke stasiun 天府广场, jalur 1 ke selatan 10 stasiun sampai 锦城广场, lalu jalan ±9 menit. Dengan pemeriksaan keamanan dan menunggu kereta, totalnya sekitar 50–55 menit, jadi itinerary memakai DiDi.',
        'Pulang dengan DiDi, sekitar 12 km. Bila mampir ke Twin Towers, pesan dari stasiun 金融城, sekitar 10 km ke hotel. Cadangan: Metro jalur 1 delapan stasiun dari 金融城 ke 天府广场, lalu jalan ±17 menit.',
      ],
      duration: 'DiDi sekitar 15 menit sekali jalan tanpa macet, menurut perhitungan rute OpenStreetMap, bukan waktu nyata. Lalu lintas Minggu sore, lama perjalanan Metro, dan tarifnya belum ditemukan dari sumber resmi.',
      sources: [skpOfficial, towerOfLife, metroLine1, osmRouting],
    },
    stopAccess: {
      'chengdu-skp-tower': 'Tiang-tiang air berada di ujung selatan taman terbuka Chengdu SKP, sisi timur 天府大道北段 tepat di utara Jalan Lingkar 4, berseberangan dengan Global Center (环球中心). Pintu B stasiun 锦城广场东 (jalur 18) paling dekat. Menara ini tidak untuk dinaiki; nikmati dari taman dan tepi kolam.',
    },
    costs: [
      {
        label: 'Menara Vitality & taman SKP',
        amount: 'Gratis',
        detail: 'Trip.com mencantumkan masuk gratis dan buka sepanjang hari untuk menara. Mal buka 10.00–22.00 setiap hari menurut pengelola SKP; jam toko dan restoran bisa berbeda.',
        status: 'published',
        source: towerOfLife,
      },
      {
        label: 'DiDi hotel ↔ Chengdu SKP',
        amount: 'Perlu konfirmasi',
        detail: 'Sekitar 12,5 km sekali jalan. Tarif belum ditemukan; lihat estimasi di aplikasi DiDi sebelum memesan.',
        status: 'unconfirmed',
      },
      {
        label: 'Metro jalur 1, cadangan',
        amount: 'Perlu konfirmasi',
        detail: 'Tarif dan lama perjalanan 天府广场 ↔ 锦城广场 belum ditemukan dari sumber resmi. Cek di Amap atau aplikasi Metro Chengdu.',
        status: 'unconfirmed',
      },
    ],
    visitDuration: 'Sekitar 3 jam, ±16.30–19.50: cari sudut selagi terang, cahaya keemasan, langit biru, lalu lampu malam. Trip.com menyarankan 15–30 menit untuk menaranya saja.',
    bestTime: 'Cahaya keemasan 17.37–18.11 dan langit biru ±18.26–18.45 pada 8 November. Lampu cincin menyala setelah gelap; pengelola tidak mengumumkan jamnya, sumber pihak ketiga menyebut ±19.00–19.30.',
    tips: [
      'Simpan 成都SKP 生机之塔 dan 锦城广场东地铁站B口 di Amap sebelum berangkat.',
      'Bawa tripod kecil dan kain lap lensa. Air mengalir di sepanjang tiang dan kolam memantulkan lampu. Belum diketahui apakah petugas mengizinkan tripod di taman.',
      'Lampu berganti empat mode: gradasi pelangi, berkedip, pita cincin, dan satu warna. Laporan Desember 2022 menyebut satu siklus 15 menit atau 4 menit, jadi rekam paling tidak satu siklus penuh.',
      'Bawa bekal berlabel 清真 untuk makan malam. Sebuah blog (Juni 2026) menyebut kedai 清真 di sekitar Masjid Huangcheng (皇城清真寺) dekat Tianfu Square; belum diverifikasi.',
      'Opsional: Tianfu Twin Towers (天府双塔) dari danau Jiaozi Park atau jembatan oranye 交子之环. Jaraknya sekitar 2,2 km, ±30 menit jalan kaki, atau Metro jalur 1 dua stasiun dari 锦城广场 ke 金融城 lalu menyeberangi 天府大道 ke danau, sekitar 25 menit. Perjalanan ini memakan sebagian besar slot ±19.30–20.15, jadi waktu di sana hanya ±10–15 menit.',
    ],
    cautions: [
      'Jam lampu menara tidak dipublikasikan pengelola. Bila sampai ±19.50 belum menyala, pulang saja; besok DiDi berangkat 05.15.',
      'Minggu 8 November tidak ada pertunjukan tematik Twin Towers. Pemberitahuan 31 Oktober 2025 menyebut pertunjukan hanya Jumat dan Sabtu pukul 20.00; layar LED menyala 19.00–22.00.',
      'Belum ditemukan kedai halal di sekitar SKP, Jincheng Plaza, atau Financial City. Lantai sekitar kolam licin, dan belum diketahui apakah air serta lampu tetap menyala saat hujan.',
    ],
    sources: [
      {
        title: 'SKP: jam dan alamat Chengdu SKP',
        url: skpOfficial,
        kind: 'official',
        note: 'Senin–Minggu 10.00–22.00, alamat 成都市高新区天府大道北段. Teks jam tampaknya dipakai bersama untuk semua kota SKP.',
      },
      {
        title: 'Trip.com: Tower of Life (生机之塔)',
        url: towerOfLife,
        kind: 'reference',
        note: 'Masuk gratis, buka sepanjang hari, saran kunjungan 15–30 menit. Sumber foto menara.',
      },
      {
        title: 'Trip.com: Tianfu Twin Towers, Chengdu Financial City',
        url: twinTowers,
        kind: 'reference',
        note: 'Fasad LED dan titik pandang 交子之环. Masuk gratis.',
      },
      {
        title: 'The Paper (Chengdu Commercial Daily): 生机之塔 di Chengdu SKP',
        url: towerLaunch,
        kind: 'reference',
        publishedAt: '2022-12-15',
        note: 'Enam tiang air setinggi 26 m dan 39 m, empat mode lampu, siklus 15 menit, menyala saat malam tiba.',
      },
      {
        title: 'Red Star News via Tencent: Chengdu SKP mulai uji operasi',
        url: skpOpening,
        kind: 'reference',
        publishedAt: '2022-12-20',
        note: 'Akses dari stasiun 锦城广场东 jalur 18; menyebut siklus lampu 4 menit.',
      },
      {
        title: 'Chengdu Bendibao: jadwal pertunjukan Tianfu Twin Towers',
        url: twinTowersShow,
        kind: 'reference',
        publishedAt: '2025-10-31',
        note: 'Pertunjukan rutin hanya Jumat dan Sabtu 20.00; layar menyala 19.00–22.00. Belum ada pemberitahuan lebih baru per 5 November 2026.',
      },
      {
        title: 'mychina.guide: panduan Tower of Vitality',
        url: towerGuide,
        kind: 'reference',
        note: 'Menyebut belum ada jadwal lampu malam yang terverifikasi, dan pintu B 锦城广场东 sekitar 95 m menurut Amap.',
      },
      {
        title: 'OpenStreetMap: Metro Chengdu jalur 1',
        url: metroLine1,
        kind: 'reference',
        note: 'Urutan stasiun 天府广场 sampai 锦城广场 (10 stasiun) dan 金融城.',
      },
      {
        title: 'FOSSGIS OSRM: perhitungan rute jalan kaki dan mobil',
        url: osmRouting,
        kind: 'reference',
        note: 'Jarak dan waktu tanpa macet dihitung 5 November 2026; bukan waktu tempuh nyata.',
      },
      {
        title: 'US Naval Observatory: matahari 8 November 2026 di Chengdu SKP',
        url: sunTimes,
        kind: 'official',
        note: 'Matahari terbenam 18.11, senja sipil berakhir 18.36.',
      },
      {
        title: 'Wild Great Wall: restoran halal di Chengdu',
        url: halalBlog,
        kind: 'reference',
        publishedAt: '2026-06-27',
        note: 'Blog pribadi; status halal kedai yang disebut belum diverifikasi.',
      },
    ],
    checkedAt: '2026-11-05',
  },
];
