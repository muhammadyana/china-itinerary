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
const zhongshugeTrip = 'https://www.trip.com/travel-guide/attraction/dujiangyan/zhongshuge-101876802/';
const zhongshugeMoments = 'https://www.trip.com/moments/poi-zhongshuge-101876802/';
const zhongshugeFree = 'https://hk.trip.com/moments/poi-zhongshuge-101876802/';
const zhongshugeQuiet = 'https://www.trip.com/moments/detail/dujiangyan-911-145400564/';
const zhongshugeClosing = 'https://www.trip.com/moments/detail/dujiangyan-911-154025957/';
const zhongshugeStationRide = 'https://www.trip.com/moments/detail/dujiangyan-911-155198647/';
const zhongshugePhoto = 'https://www.trip.com/moments/detail/dujiangyan-911-154687262/';
const zhongshugeBlog = 'https://thirdeyetraveller.com/dujiangyan-zhongshuge-bookstore-chengdu/';
const zhongshugePeoplesDaily = 'https://cpc.people.com.cn/n1/2026/1004/c64387-40809265.html';
const zhongshugeOpening = 'https://m.winshang.com/news676990.html';
const zhongshugeDesign = 'https://www.archdaily.com/948542';
const zhongshugeHours2025 = 'https://9sc.cn/sichuan/29651.html';
const zhongshugeShoots = 'https://sichuan.scol.com.cn/ggxw/202012/57988305.html';
const zhongshugeNews = 'https://www.sohu.com/a/1084514291_123753';
const zhongshugeNode = 'https://www.openstreetmap.org/node/8071545317';
const dujiangyanTrains = 'https://kyfw.12306.cn/otn/leftTicket/queryG?leftTicketDTO.train_date=2026-11-13&leftTicketDTO.from_station=CDW&leftTicketDTO.to_station=DDW&purpose_codes=ADULT';
const metroLine2 = 'https://en.wikipedia.org/wiki/Line_2_(Chengdu_Metro)';
const dujiangyanHalal = 'https://www.trip.com/restaurant/china/dujiangyan/detail/restaurant-37275565/';
const dujiangyanMosque = 'https://www.openstreetmap.org/node/11269203511';

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
  {
    slug: 'zhongshuge-bookstore',
    name: 'Toko Buku Zhongshu Ge, Dujiangyan',
    region: 'Sichuan',
    placeIds: ['zhongshuge-bookstore'],
    summary: 'Cabang toko buku 钟书阁 (Zhongshuge) di lantai 2 mal Sunac (成都融创茂), Dujiangyan, sekitar 58 km berkendara dari Chunxi Road. Di tengahnya ada menara buku bundar yang dililit tangga spiral hitam; dinding bukunya menirukan bendungan Dujiangyan, dan langit-langitnya cermin. Tempat ini hanya ada di opsi santai: wajib, Senin 9 November pagi saat toko baru buka, sebelum shuttle ke Jiuzhaigou.',
    gettingThere: {
      origin: 'Hotel di Chunxi Road, Senin 9 November pagi (opsi santai)',
      steps: [
        'Check-out dan titip koper di hotel, lalu pesan DiDi sekitar 08.45 ke 钟书阁(融创茂店) atau 成都融创茂. Alamatnya 至臻路1号 融创茂 二楼 (lantai 2). Beberapa unggahan menulis 都江堰大道211号; Trip.com dan sumber lain memakai 至臻路1号.',
        'Jaraknya sekitar 58 km, ±45 menit tanpa macet menurut OSRM. Third Eye Traveller menulis 60–90 menit, tergantung lalu lintas. Mal ini bagian dari kompleks Sunac (taman hiburan, taman air, dan snow world) di barat daya pusat kota Dujiangyan.',
        'Kembali dengan DiDi ke hotel, sekitar 58 km, untuk mengambil koper sebelum shuttle ke Jiuzhaigou dari Xinnanmen Bus Station (新南门汽车站), sekitar 1 km dari hotel. Simpan alamat hotel dalam bahasa Mandarin.',
        'Cadangan untuk pergi: Metro jalur 2 dari 春熙路 ke ujung barat 犀浦 (15 stasiun tanpa ganti kereta), kereta S 犀浦 → 都江堰 (18–30 menit; 34 kereta pada 13 November menurut 12306, jadwal 9 November belum dicek), lalu DiDi 10–15 menit dari Stasiun Dujiangyan, 1,4 km garis lurus dari toko. Beli tiket kereta di 12306 atau Trip.com dengan paspor; sebagian kereta sudah tinggal sedikit kursi.',
        'Untuk kembali, DiDi lebih aman daripada kereta S dan Metro, karena langsung ke hotel tempat koper dititip dan shuttle berangkat 14.30.',
      ],
      duration: 'DiDi ±45 menit sekali jalan tanpa macet menurut perhitungan rute OpenStreetMap, bukan waktu nyata; pengunjung menyebut 60–90 menit. Lewat kereta S lebih lama karena berganti Metro, kereta, dan mobil; lama Metro ke 犀浦 (±30–35 menit) hanya dari satu panduan tanpa tanggal.',
      sources: [zhongshugeBlog, zhongshugeTrip, osmRouting, dujiangyanTrains],
    },
    stopAccess: {
      'zhongshuge-bookstore': 'Toko ada di lantai 2 mal 成都融创茂 (Sunac Mall), di jalan S401 kawasan 玉堂街道. Menara buku dan tangga spiralnya ada di tengah toko, yang terdiri atas dua lantai. Jangan tertukar dengan Perpustakaan Dujiangyan di 玉垒路51号.',
    },
    costs: [
      {
        label: 'Masuk toko buku',
        amount: 'Gratis',
        detail: 'Trip.com mencantumkan masuk gratis, begitu juga Third Eye Traveller (Juni 2026) dan unggahan pengunjung Mei 2026. Tidak ditemukan sumber soal reservasi atau tiket.',
        status: 'published',
        source: zhongshugeFree,
      },
      {
        label: 'DiDi hotel Chunxi Road ↔ toko',
        amount: '±CNY 100 sekali jalan',
        detail: 'Satu-satunya angka dari pelancong: Third Eye Traveller membayar sekitar CNY 100 dengan DiDi (artikel Juni 2026, tanggal perjalanan tidak disebut). Belum ada tarif resmi; lihat estimasi di aplikasi DiDi, termasuk untuk pulang malam.',
        status: 'estimate',
        source: zhongshugeBlog,
      },
      {
        label: 'Kereta S 犀浦 ↔ 都江堰, cadangan',
        amount: 'CNY 10',
        detail: 'Kelas dua, harga 12306 untuk 14 November (dicek 5 November 2026); jadwal 13 November sama; jadwal 9 November belum dicek. Belum termasuk Metro jalur 2 ke 犀浦 (CNY 4–6 menurut satu panduan tanpa tanggal) dan DiDi dari Stasiun Dujiangyan (CNY 13–20 menurut unggahan Trip.com 18 Oktober 2026).',
        status: 'published',
        source: dujiangyanTrains,
      },
    ],
    visitDuration: 'Sekitar 1½ jam, ±10.00–11.30, mulai saat toko buka, yang menurut pengunjung paling sepi di hari kerja. Ringkasan Trip.com menyebut kunjungan biasa 30–60 menit; Third Eye Traveller menyarankan 1–2 jam.',
    bestTime: 'Paling sepi saat buka pukul 10.00 pada hari kerja, atau satu jam terakhir sebelum tutup; paling ramai siang menjelang sore, akhir pekan, dan hari libur. Senin 9 November hari kerja dan belum masuk libur sekolah Chengdu (11–13 November), jadi itinerary memakai jam buka. Third Eye Traveller datang 1–2 jam sebelum tutup dan menyebut toko ramai, tetapi masih bisa untuk foto. Jam buka 10.00–21.00 setiap hari menurut Trip.com.',
    tips: [
      'Simpan pin toko dari tautan Amap di bagian Cara ke sana, dan nama 成都融创茂 untuk sopir DiDi, juga alamat hotel dalam bahasa Mandarin untuk pulang.',
      'Sudut foto terbaik ada di sekitar tangga spiral di tengah toko, menurut Third Eye Traveller. Rombongan tur sering berkumpul di tangga; tunggu sampai mereka pergi.',
      'Rekam dengan tangan dan tanpa suara keras. Belum ditemukan aturan tertulis soal tripod atau gimbal, jadi tanyakan dulu di kasir. Pada 2020 staf menyebut pemotretan komersial umumnya tidak diizinkan, sedangkan foto pengunjung dibiarkan.',
      'Makan siang setelah kembali ke Chunxi Road, dekat Huangchengba. Tidak ditemukan kedai halal di mal Sunac. Dua kedai bernama 清真 di pusat kota Dujiangyan, sekitar 3,7 km dari toko, belum diverifikasi; 清真贝贝烧烤纸包鱼 buka 10.30–24.00 menurut Trip.com.',
      'Belum diketahui ada musala di mal. Masjid terdekat, 清真寺 di 南街49号 (kota tua 灌县古城), sekitar 10 menit naik mobil; belum dicek apakah aktif dan menerima pengunjung.',
    ],
    cautions: [
      'Jam buka berbeda antarsumber: 10.00–21.00 (Trip.com dan unggahan 2026), 09.00–20.00 (Third Eye Traveller, Juni 2026), dan 10.00–22.00 (9sc.cn, Mei 2025, mengutip situs resmi). Telepon toko +86 28 6142 7881 (Trip.com) sebelum berangkat.',
      'Toko pernah membatasi jumlah pengunjung saat terlalu ramai (laporan Desember 2020, saat itu lebih dari 3.000 pengunjung sehari). Keramaian Senin pagi 9 November belum bisa ditebak.',
      'Jangan tertukar dengan cabang Zhongshu Ge lain, termasuk cabang di kota Chengdu, atau dengan Perpustakaan Dujiangyan. Beberapa unggahan Trip.com yang ditandai di tempat ini sebenarnya cabang Tianjin.',
    ],
    sources: [
      {
        title: "People's Daily: 钟书阁都江堰店, dinding buku seperti bendungan",
        url: zhongshugePeoplesDaily,
        kind: 'reference',
        publishedAt: '2026-10-04',
        note: 'Nama resmi 钟书阁都江堰店; bendungan Dujiangyan diolah menjadi dinding buku, dengan unsur panda.',
      },
      {
        title: 'Winshang: Zhongshu Ge buka di Dujiangyan',
        url: zhongshugeOpening,
        kind: 'reference',
        publishedAt: '2020-09-29',
        note: 'Buka 19 September 2020 sebagai toko bertema wisata budaya pertama jaringan ini; langit-langit cermin.',
      },
      {
        title: 'ArchDaily: Dujiangyan Zhongshuge Bookstore / X+Living',
        url: zhongshugeDesign,
        kind: 'reference',
        note: 'Perancang X+Living, 2020, 973 m².',
      },
      {
        title: 'Trip.com: Zhongshuge, Dujiangyan',
        url: zhongshugeTrip,
        kind: 'reference',
        note: 'Alamat 至臻路1号 融创茂 二楼 dan titik peta.',
      },
      {
        title: 'Trip.com Moments: Zhongshuge, jam buka dan telepon',
        url: zhongshugeMoments,
        kind: 'reference',
        note: 'Buka 10.00–21.00; telepon +86 28 6142 7881. Ringkasan: kunjungan biasa 30–60 menit, paling ramai siang menjelang sore dan akhir pekan.',
      },
      {
        title: 'Trip.com (Hong Kong): Zhongshuge, masuk gratis',
        url: zhongshugeFree,
        kind: 'reference',
        note: 'Ringkasan halaman menyebut 免費入場 (masuk gratis).',
      },
      {
        title: 'Third Eye Traveller: Dujiangyan Zhongshuge Bookstore',
        url: zhongshugeBlog,
        kind: 'reference',
        publishedAt: '2026-06-30',
        note: 'DiDi 60–90 menit dan sekitar CNY 100; jam 09.00–20.00 (berbeda dari Trip.com); 1–2 jam di dalam; datang saat buka atau satu jam sebelum tutup.',
      },
      {
        title: 'Trip.com Moments: hari kerja pukul 10.00 paling sepi',
        url: zhongshugeQuiet,
        kind: 'reference',
        publishedAt: '2026-05-11',
        note: 'Jam 10.00–21.00 setiap hari dan masuk gratis.',
      },
      {
        title: 'Trip.com Moments: tiba 5 menit sebelum tutup',
        url: zhongshugeClosing,
        kind: 'reference',
        publishedAt: '2026-10-07',
        note: 'Hampir tidak ada orang lain di foto menjelang tutup.',
      },
      {
        title: 'Trip.com Moments: DiDi dari Stasiun Dujiangyan',
        url: zhongshugeStationRide,
        kind: 'reference',
        publishedAt: '2026-10-18',
        note: '10–15 menit, CNY 13–20, ke mal 融创茂.',
      },
      {
        title: 'Trip.com Moments: sumber foto menara buku',
        url: zhongshugePhoto,
        kind: 'reference',
        publishedAt: '2026-10-13',
        note: 'Foto dipotong ke format lanskap; tanggal pengambilan tidak diketahui.',
      },
      {
        title: '9sc.cn: jam buka Zhongshu Ge',
        url: zhongshugeHours2025,
        kind: 'reference',
        publishedAt: '2025-05-06',
        note: 'Mengutip situs resmi: 10.00–22.00. Berbeda dari Trip.com.',
      },
      {
        title: 'Sichuan Online: toko buku menjadi tempat swafoto',
        url: zhongshugeShoots,
        kind: 'reference',
        publishedAt: '2020-12-17',
        note: 'Pemotretan komersial umumnya tidak diizinkan, foto pengunjung dibiarkan; pernah membatasi pengunjung; lebih dari 3.000 pengunjung sehari.',
      },
      {
        title: 'China News Service lewat Sohu: pengunjung di Zhongshu Ge Dujiangyan',
        url: zhongshugeNews,
        kind: 'reference',
        publishedAt: '2026-10-06',
        note: 'Toko buka dan ramai saat libur Hari Nasional 2026.',
      },
      {
        title: 'OpenStreetMap: titik Zhong Shu Ge',
        url: zhongshugeNode,
        kind: 'reference',
        note: '30,9582302, 103,6218853 (WGS84); dipakai untuk Amap, cuaca, dan peta opsi santai.',
      },
      {
        title: 'FOSSGIS OSRM: perhitungan rute jalan kaki dan mobil',
        url: osmRouting,
        kind: 'reference',
        note: 'Chunxi Road ↔ toko sekitar 58 km dan ±45 menit tanpa macet; Stasiun Dujiangyan ke toko 2,1 km dengan mobil atau 1,8 km jalan kaki. Dihitung 5 November 2026.',
      },
      {
        title: '12306: kereta 犀浦 ↔ 都江堰, 13 November',
        url: dujiangyanTrains,
        kind: 'official',
        note: '34 kereta S ke Dujiangyan (pertama 07.37, terakhir 22.50) dan 30 kereta kembali (terakhir 22.30), kelas dua CNY 10. Dicek 5 November 2026.',
      },
      {
        title: 'Wikipedia: Metro Chengdu jalur 2',
        url: metroLine2,
        kind: 'reference',
        note: 'Chunxi Road sampai 犀浦 tanpa ganti kereta; 犀浦 ujung barat jalur.',
      },
      {
        title: 'Trip.com: 清真贝贝烧烤纸包鱼, Dujiangyan',
        url: dujiangyanHalal,
        kind: 'reference',
        note: 'Buka 10.30–24.00; status halal hanya dari nama, belum diverifikasi.',
      },
      {
        title: 'OpenStreetMap: masjid di 南街49号, Dujiangyan',
        url: dujiangyanMosque,
        kind: 'reference',
        note: 'Belum dicek apakah aktif dan jam salatnya.',
      },
    ],
    checkedAt: '2026-11-05',
  },
];
