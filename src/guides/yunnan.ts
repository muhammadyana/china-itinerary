import type { DestinationGuide } from '../guide-types.ts';

const songzanlinTickets = 'https://szl.saas.bosswin.net/page/notices';
const songzanlinTransport = 'https://szl.saas.bosswin.net/page/jiaotong';
const songzanlinCityBus = 'https://www.xgllszljq.cn/Service_1/2.html';
const songzanlinDrive = 'https://www.xgllszljq.cn/Strategy_1/6.html';
const songzanlinShuttle = 'https://www.xgllszljq.cn/news_1/39.html';
const jadeDragonNotice = 'https://www.lijiang.cn/article/172717.html';
const jadeDragonMaintenance = 'https://www.sohu.com/a/1085864420_216434';
const jadeDragonTrain = 'https://www.lijiang.cn/news/travel/article/183617.html';
const jadeDragonGuide = 'https://www.visit-yunnan.com/zh/blog/jade-dragon-snow-mountain-guide';
const jadeDragonSummerNotice = 'https://www.yn.xinhuanet.com/20260702/e8f8d1a27e2845b4bf54cfc5ef8f5d36/c.html';
const jadeDragonTravelNotice = 'https://www.yn.xinhuanet.com/20260718/f2d1560d5043462c9c5967496da38808/c.html';
const jadeDragonAutumnNotice = 'https://c.m.163.com/news/a/L7GPFVVQ052491GH.html';
const jadeDragonGateNotice = 'https://m.gmw.cn/2025-12/31/content_1304285759.htm';
const jadeDragonWindDelay = 'https://cbgc.scol.com.cn/news/7460438';
const blueMoonMap = 'https://www.openstreetmap.org/#map=16/27.1285/100.2465';
const blueMoonLight = 'https://www.gochinatravel.org/zh/lijiang/blue-moon-valley';
const blueMoonTrip = 'https://nz.trip.com/moments/poi-blue-valley-91410';
const blueMoonShuttleMap = 'https://www.openstreetmap.org/relation/20247564';
const terrainHorizon = 'https://api.opentopodata.org/v1/srtm30m';
const ganhaiziShuttleMap = 'https://www.openstreetmap.org/relation/20247562';
const impressionLijiangVenue = 'https://static.cninfo.com.cn/finalpage/2026-03-24/1225026384.PDF';
const impressionLijiangAutumnOffer = 'https://www.sohu.com/a/1085620886_216434';
const impressionLijiangBooking = 'https://www.wingontravel.com/things-to-do/detail?cityID=58&productID=100053081';
const impressionLijiangTrip = 'https://id.trip.com/travel-guide/attraction/yulong/impressions-lijiang-performance-10758688/';
const lijiangFee = 'https://www.ctdsb.net/c1716_202507/2486302.html';
const dukezongTickets = 'https://piao.qunar.com/ticket/detail_188282.html?from=mpshouye_hotdest_sight';
const daliDirectory = 'https://www.yndali.gov.cn/dlsrmzf/c106716/pc/content/1983786742782726144/content_1983786742782726144.html';
const erhaiReport = 'https://paper.people.com.cn/rmrb/pc/content/202505/22/content_30074694.html';
const caicunGuide = 'https://touch.go.qunar.com/poi/5740099';
const shunchengLocation = 'https://www.gokunming.com/en/listings/item/34606/shunchengjie-mosque';
const nanchengLocation = 'https://ditu.amap.com/place/B036704C01';
const greenLakeNotice = 'https://mzzj.yn.gov.cn/html/2024/difangdongtai_0326/53256.html';
const greenLakeHours = 'https://zixun.kunming.cn/c/9421321.shtml?areaId=2597';
const greenLakeEntrance = 'https://ditu.amap.com/place/B036706ZJA';

export const yunnanGuides: DestinationGuide[] = [
  {
    slug: 'dukezong', name: 'Dukezong', region: 'Yunnan',
    placeIds: ['dukezong'],
    summary: 'Jalan berbatu dan rumah kayu menjadi sambutan pertama di Shangri-La, setelah perjalanan panjang dari Riwa.',
    gettingThere: {
      origin: 'Riwa, Sichuan, pada 17 November',
      steps: [
        'Pukul 08.00, naik taksi atau mobil carteran dari Riwa ke Xiangcheng, sekitar 3–3,5 jam, dengan tarif yang disepakati semalam.',
        'Di 乡城长途汽车站, beli tiket bus 14.30 ke Shangri-La dengan paspor. Perjalanan sekitar 5 jam; bus tiba sekitar 19.30–20.00, setelah gelap. Jika bus batal karena salju, bermalam di Xiangcheng dan naik bus 08.00 besok.',
        'Setiba di kota Shangri-La, naik taksi ke hotel di Dukezong. Gunakan pin 独克宗古城, bukan Shangri-La Town di Sichuan.',
      ],
      duration: 'Sekitar 3–3,5 jam naik taksi ke Xiangcheng, menunggu bus 14.30, lalu sekitar 5 jam naik bus. Tiba sekitar 19.30–20.00, setelah matahari terbenam sekitar 18.30.',
      sources: [dukezongTickets],
    },
    stopAccess: {
      dukezong: 'Dari titik turun taksi di tepi Dukezong, berjalan menuju penginapan dan gang kota tua.',
    },
    costs: [
      { label: 'Kawasan Kota Tua Dukezong', amount: 'Gratis', detail: 'Qunar mencantumkan akses kota tua gratis. Belanja, pertunjukan, dan layanan berbayar terpisah.', status: 'published', source: dukezongTickets },
      { label: 'Taksi Riwa ke Xiangcheng', amount: 'Perlu konfirmasi', detail: 'Tarif belum ditemukan. Sepakati harga dengan sopir pada malam 16 November sebelum berangkat.', status: 'unconfirmed' },
      { label: 'Bus Xiangcheng ke Shangri-La', amount: 'Sekitar CNY 86 / orang', detail: 'Acuan rencana untuk bus 14.30; beli di terminal dengan paspor. Taksi ke hotel setelah tiba dibayar terpisah.', status: 'estimate' },
    ],
    visitDuration: 'Alokasi rencana 1 sampai 2 jam setelah check-in, atau singkat saat mengambil koper pada 18 November.',
    bestTime: 'Malam 17 November setelah makan malam bila masih bertenaga; tidur paling lambat 22.30. Pada 18 November hanya singgah ±11.00 untuk mengambil koper sebelum ke stasiun.',
    tips: ['Simpan nama dan pin hotel sebelum tiba agar koper tidak perlu ditarik jauh di jalan berbatu.', 'Pakai sepatu dengan pijakan baik dan bawa lapisan hangat untuk berjalan malam.'],
    cautions: ['Ini kota Shangri-La di Yunnan, berbeda dari basis Yading di Riwa, Sichuan.', 'Setelah perjalanan panjang, persingkat kunjungan bila tubuh perlu beristirahat.'],
    sources: [{ title: 'Qunar: akses dan lokasi Dukezong', url: dukezongTickets, kind: 'operator' }],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'upper-tiger-leaping-gorge', name: 'Upper Tiger Leaping Gorge', region: 'Yunnan', placeIds: ['upper-tiger-leaping-gorge'],
    summary: 'Ngarai Sungai Jinsha di sisi Shangri-La: jalur pengunjung dan eskalator turun ke batu besar di tengah arus, disinggahi di perjalanan darat Lijiang ke Shangri-La.',
    gettingThere: {
      origin: 'Hotel di Lijiang pada 16 November (opsi santai)',
      steps: [
        'Mobil sewa dengan koper dari Lijiang lewat kota Hutiaoxia (Qiaotou) ke pintu Upper Gorge, sekitar 80 km (OSRM 1 jam 16 menit tanpa macet).',
        'Beli tiket di lokasi atau lewat situs pengelola, lalu turun lewat jalur pengunjung; eskalator opsional.',
        'Lanjut dengan mobil yang sama ke Dukezong, Shangri-La, sekitar 98 km (OSRM 1 jam 31 menit).',
        'Tanpa mobil: shuttle satu arah Trip.com Lijiang → Upper Gorge → Dukezong (CNY 100 per orang untuk 16 November, dicek 5 November 2026) berangkat jauh lebih pagi, dengan sekitar 1,5 jam di ngarai.',
      ],
      duration: 'Sekitar 1 jam 15 menit dari Lijiang dan 1 jam 30 menit ke Shangri-La menurut OSRM tanpa macet; jalan gunung bisa lebih lama.',
      sources: ['https://www.xgllhtx.cn/traffic.html', 'https://www.trip.com/travel-guide/attraction/shangri-la/shangri-la-tiger-leaping-gorge-10558694/?curr=CNY'],
    },
    stopAccess: { 'upper-tiger-leaping-gorge': 'Dari pintu masuk, jalur pengunjung menurun ke tepi Sungai Jinsha dan batu "lompatan harimau" di tengah arus. Eskalator membantu saat naik kembali.' },
    costs: [
      { label: 'Tiket masuk Upper Gorge', amount: 'CNY 45 / orang', detail: 'Angka FieldGuide (2 November 2026) dan panduan Ctrip tanpa tanggal; Qunar dan Trip.com tidak menjual tiket masuk saja. Konfirmasikan di loket.', status: 'unconfirmed', source: 'https://fieldguidetochina.com/places/tiger-leaping-gorge/' },
      { label: 'Eskalator', amount: 'CNY 80 pulang-pergi / CNY 60 naik saja', detail: 'Tarif Qunar dan Trip.com, dicek 5 November 2026; bukan tarif resmi pengelola.', status: 'unconfirmed', source: 'https://touch.piao.qunar.com/touch/detail_2561958500.html' },
      { label: 'Mobil sewa Lijiang → Upper Gorge → Dukezong', amount: 'Perkiraan CNY 725 / mobil', detail: 'Hitungan dari sewa per jam Trip.com di Lijiang untuk 16 November, belum termasuk biaya kembali kosong; pengelola menyebut CNY 300–800 per mobil dari Lijiang (tanpa tanggal).', status: 'estimate', source: 'https://www.trip.com/chartered-car-seo/hourly/lijiang/?curr=CNY' },
    ],
    visitDuration: 'Alokasi rencana sekitar 2½ jam, ±10.00–12.30, termasuk turun dan naik kembali.',
    bestTime: 'Menjelang siang, saat sinar matahari lebih mungkin sampai ke dasar ngarai daripada pagi; belum diverifikasi. Buka 08.00–18.00 dengan masuk terakhir 18.00 menurut Ctrip dan Trip.com.',
    tips: [
      'Pakai sepatu bersol kasar: tangga dan batu di tepi sungai bisa basah oleh percikan.',
      'Simpan tenaga untuk naik kembali; eskalator membantu bila kaki lelah.',
      'Bawa bekal makan siang dan air, lalu makan di mobil menuju Shangri-La.',
    ],
    cautions: [
      'Trek High Trail resmi dilarang: pemberitahuan Pemerintah Kota Shangri-La 10 Februari 2026 mengancam denda CNY 100–5000, dan pengelola menutup seluruh High Trail sejak 1 Mei 2026. Upper Gorge tetap buka.',
      'Longsor 30 Juli dan 3 September 2026 terjadi di luar area pengunjung menurut pengelola; cek pengumuman pengelola sebelum berangkat.',
      'Jangan melewati pagar ke batu di tengah arus.',
    ],
    sources: [
      { title: 'Pengelola Tiger Leaping Gorge: status buka dan pemberitahuan longsor', url: 'https://www.xgllhtx.cn/', kind: 'official', note: 'Dicek 5 November 2026.' },
      { title: 'Pengelola Tiger Leaping Gorge: panduan lalu lintas', url: 'https://www.xgllhtx.cn/traffic.html', kind: 'official', note: 'Tanpa tanggal.' },
      { title: 'Pemberitahuan Pemerintah Kota Shangri-La tentang larangan High Trail', url: 'https://www.sohu.com/a/986025656_120815119', kind: 'reference', publishedAt: '2026-02-10' },
      { title: 'Xiaoxiang Morning News lewat Guangming: High Trail ditutup, Upper Gorge tetap buka', url: 'https://m.gmw.cn/2026-05/09/content_1304450375.htm', kind: 'reference', publishedAt: '2026-05-09' },
      { title: 'Field Guide to China: Tiger Leaping Gorge', url: 'https://fieldguidetochina.com/places/tiger-leaping-gorge/', kind: 'reference', publishedAt: '2026-11-02' },
      { title: 'Ctrip: Upper Tiger Leaping Gorge, jam buka', url: 'https://you.ctrip.com/sight/xianggelila106/12236.html', kind: 'operator', note: 'Dicek 5 November 2026.' },
      { title: 'Qunar: 虎跳峡 sisi Shangri-La, eskalator', url: 'https://touch.piao.qunar.com/touch/detail_2561958500.html', kind: 'operator', note: 'Dicek 5 November 2026.' },
      { title: 'Trip.com: Tiger Leaping Gorge sisi Shangri-La', url: 'https://www.trip.com/travel-guide/attraction/shangri-la/shangri-la-tiger-leaping-gorge-10558694/', kind: 'operator', note: 'Foto dan shuttle; dicek 5–6 November 2026.' },
    ],
    checkedAt: '2026-11-05',
  },
  {
    slug: 'songzanlin', name: 'Biara Songzanlin', region: 'Yunnan', placeIds: ['songzanlin'],
    summary: 'Atap emas di lereng bukit, sebelum melanjutkan perjalanan dengan kereta ke Lijiang.',
    gettingThere: {
      origin: 'Hotel di Dukezong pada 18 November',
      steps: [
        'Naik taksi atau DiDi ke 松赞林景区游客中心. Untuk bus, minta hotel memeriksa rute aktif: halaman operator memuat nomor 3, sedangkan panduan tertanggal 27 Maret 2025 menyebut 12 dan 16.',
        'Beli atau validasi tiket di pusat pengunjung. Sebelum naik shuttle, tanyakan layanan yang termasuk tiket dan biaya terbaru pada pengumuman 27 Agustus 2026.',
        'Setelah kunjungan, kembali mengambil koper sebelum menuju Stasiun Shangri-La. Sesuaikan waktu pulang dengan tiket kereta ke Lijiang.',
      ],
      duration: 'Panduan operator memperkirakan sekitar 15 menit berkendara dari kota dan 10 sampai 15 menit dengan shuttle. Sisihkan 45 sampai 60 menit total termasuk tiket dan antrean; ini alokasi rencana.',
      sources: [songzanlinTransport, songzanlinCityBus, songzanlinDrive, songzanlinShuttle],
    },
    stopAccess: { songzanlin: 'Turun dari shuttle kawasan, mulai dari Danau Lamuyangcuo (拉姆央措湖) di kaki biara, lalu naik tangga ke aula Zhacang (扎仓) dan Jikang (吉康). Beri jeda di antara anak tangga.' },
    costs: [
      { label: 'Tiket penuh kawasan', amount: 'Referensi CNY 90 / orang', detail: 'Halaman operator masih mencantumkan CNY 90. Pengumuman shuttle yang lebih baru terbit 27 Agustus 2026, tetapi rincian tarif lampirannya belum dapat diverifikasi. Konfirmasikan total dan isi paket untuk 18 November.', status: 'estimate', source: songzanlinTickets },
      { label: 'Layanan shuttle kawasan', amount: 'Perlu konfirmasi', detail: 'Ada pengumuman tarif baru tertanggal 27 Agustus 2026. Minta loket menjelaskan apakah layanan yang dipilih sudah termasuk tiket; jangan menambah biaya shuttle otomatis di atas acuan paket.', status: 'unconfirmed', source: songzanlinShuttle },
      { label: 'Taksi atau bus kota dari Dukezong', amount: 'Perlu konfirmasi', detail: 'Taksi memakai harga aplikasi atau argometer. Nomor rute, halte, dan tarif bus perlu dicek ulang karena informasi operator berbeda antarhalaman.', status: 'unconfirmed' },
    ],
    visitDuration: 'Alokasi rencana 2 sampai 3 jam di kawasan, di luar perjalanan dari hotel.',
    bestTime: 'Pagi 18 November: Danau Lamuyangcuo lebih dulu, ±08.15–09.00, saat matahari rendah menyinari atap emas dan angin masih pelan; cahaya emas di danau habis ±08.20. Hotel perlu memastikan jam masuk, karena halaman operator menampilkan jam buka yang berbeda.',
    tips: ['Bawa paspor dan minta bantuan loket jika formulir pembelian hanya menerima identitas lokal.', 'Kenakan pakaian yang menutup lutut; ikuti arahan petugas saat memasuki aula.', 'Siapkan waktu kembali ke hotel sebelum stasiun, bukan berangkat ke stasiun langsung dari tangga biara.'],
    cautions: ['Hormati larangan foto di dalam aula dan jangan memotret ibadah tanpa izin.', 'Jika perjalanan sehari sebelumnya tertunda, prioritaskan sambungan kereta ke Lijiang.'],
    sources: [
      { title: 'Operator Songzanlin: tiket dan aturan kunjungan', url: songzanlinTickets, kind: 'operator' },
      { title: 'Operator Songzanlin: panduan transportasi', url: songzanlinTransport, kind: 'operator', note: 'Nomor bus dan jam operasional berbeda dari halaman operator lainnya; konfirmasikan sebelum berangkat.' },
      { title: 'Operator Songzanlin: bus kota, 27 Maret 2025', url: songzanlinCityBus, kind: 'operator', publishedAt: '2025-03-27' },
      { title: 'Operator Songzanlin: akses mobil dan shuttle', url: songzanlinDrive, kind: 'operator', publishedAt: '2025-03-28' },
      { title: 'Operator Songzanlin: pengumuman tarif shuttle terbaru', url: songzanlinShuttle, kind: 'operator', publishedAt: '2026-08-27', note: 'Halaman pengumuman tersedia, tetapi gambar rincian tarif tidak dapat dimuat saat pengecekan. Harga layanan terbaru belum terverifikasi.' },
    ],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'lijiang', name: 'Kota Tua Lijiang', region: 'Yunnan', placeIds: ['dayan', 'sifangjie'],
    summary: 'Dari kanal Dayan ke lapangan Sifangjie, sore dan malam pertama di Lijiang diisi dengan jalan kaki dan cahaya emas di atas atap.',
    gettingThere: {
      origin: 'Stasiun Lijiang pada 18 November, setelah kereta C984 dari Shangri-La',
      steps: [
        'Dari pintu keluar stasiun ±14.05, mobil dengan sopir mengantar ke gerbang kota tua terdekat hotel, sekitar 25–40 menit. Bila sopir hanya dipesan untuk 19 November, naik taksi (±10 km). Kirim pin hotel kepada sopir.',
        'Temui penjemput hotel di tepi kawasan dan lanjutkan berjalan kaki ke penginapan; jangan mengandalkan mobil untuk masuk gang Dayan.',
        'Sore bebas di gang Dayan atau Shuhe, lalu naik ke Menara Wangu atau atap kafe untuk cahaya emas ±17.10–17.55. Setelah makan malam, telusuri kanal menuju 四方街, lapangan Sifangjie di dalam kota tua, sekitar 20.15–21.30.',
      ],
      duration: 'Sekitar 25–40 menit dari Stasiun Lijiang ke gerbang kota tua, ditambah jalan kaki dengan koper ke hotel; alokasi rencana.',
      sources: ['https://travelnews.qunar.com/qa_strategy/lijiang-ancient-town-one-day-essential-route-guide'],
    },
    stopAccess: {
      dayan: 'Turun di gerbang yang disepakati hotel, lalu berjalan melalui gang Dayan dan jembatan kanal.',
      sifangjie: 'Dari hotel sekitar Dayan, ikuti navigasi jalan kaki menuju 四方街; tidak perlu pindah kendaraan.',
    },
    costs: [
      { label: 'Biaya pemeliharaan Kota Tua Lijiang', amount: 'CNY 50 / orang', detail: 'Ketentuan yang berlaku sejak 1 Agustus 2025 menetapkan masa berlaku 365 hari. Simpan bukti pembayaran; tanyakan pengecualian yang sesuai identitas.', status: 'published', source: lijiangFee },
      { label: 'Mobil dengan sopir dari Stasiun Lijiang', amount: 'Perlu konfirmasi', detail: 'Pada 18 November hanya dari stasiun ke gerbang kota tua; mobil yang sama dipakai seharian pada 19 November. Taksi sekitar CNY 30–50 per mobil bila sopir hanya dipesan untuk 19 November. Minta harga all-in tertulis; terpisah dari tiket kereta.', status: 'unconfirmed' },
    ],
    visitDuration: 'Sore dan malam 18 November: sore bebas, cahaya emas dari tempat tinggi, lalu 1 sampai 1½ jam di Dayan dan Sifangjie setelah makan malam.',
    bestTime: 'Cahaya emas langsung ±17.10–17.55 dari tempat tinggi seperti Menara Wangu (万古楼) atau atap kafe; matahari hilang di balik bukit barat ±17.55, sebelum terbenam 18.27. Lentera dan langit biru senja ±18.30–18.55, lalu kanal malam ±20.15–21.30.',
    tips: ['Sepakati mobil 19 November: berangkat 06.30, koper di mobil seharian, berakhir di Stasiun Lijiang. Tanyakan tertulis apakah mobil boleh masuk dan menunggu di Ganhaizi.', 'Beli bekal halal untuk sarapan, makan siang, dan makan malam 19 November; besok tidak ada waktu mampir kota tua sebelum kereta.', 'Pakai sepatu yang nyaman di batu licin dan simpan pin hotel sebelum menjelajah gang.', 'Untuk makan halal, cari tanda 清真 dan konfirmasikan bahan sebelum memesan.'],
    cautions: ['Biaya pemeliharaan kota tua berbeda dari tiket objek berbayar di dalamnya.', 'Jangan membeli paket Jade Dragon dari calo hanya karena menawarkan jaminan slot.'],
    sources: [
      { title: 'Ketentuan pemeliharaan Lijiang 2025, teks pemerintah dimuat ulang', url: lijiangFee, kind: 'reference', publishedAt: '2025-07-17' },
      { title: 'Qunar: akses stasiun dan rute Dayan', url: 'https://travelnews.qunar.com/qa_strategy/lijiang-ancient-town-one-day-essential-route-guide', kind: 'reference', publishedAt: '2026-06-22' },
      { title: 'OpenTopoData SRTM 30 m: cakrawala barat Dayan untuk jam cahaya emas', url: terrainHorizon, kind: 'reference', note: 'Dihitung 5 November 2026 bersama posisi matahari NOAA; bangunan dan pohon tidak terhitung, jadi ±10 menit.' },
    ],
    checkedAt: '2026-11-05',
  },
  {
    slug: 'jade-dragon', name: 'Jade Dragon & Glacier Park', region: 'Yunnan', placeIds: ['jade-dragon', 'cable-car'],
    summary: 'Pada 19 November, Blue Moon Valley mengisi pagi, Impression Lijiang 13.20 di tengah hari, lalu Glacier Park dengan slot kereta gantung sore sebelum kereta malam ke Dali.',
    gettingThere: {
      origin: 'Hotel sekitar Dayan, Lijiang, pada 19 November',
      steps: [
        'Mobil dari hotel pukul 06.30 dengan koper di mobil seharian. Acuan pengelola dari kota ke Ganhaizi sekitar 80 menit, jadi cahaya pertama di puncak dari padang Ganhaizi (±07.35–08.00) hanya bonus.',
        'Mobil belum tentu boleh masuk Ganhaizi: pengelola mengatur kendaraan menurut lalu lintas dan parkir, dan pengunjung bisa parkir gratis di pusat pengunjung baru Baisha lalu naik kereta wisata. Tanyakan tertulis kepada penyewa mobil apakah mobil berizin (营运车) boleh masuk dan menunggu; bila tidak, tambah ±45 menit. Promo mulai 3 November 2026 menggabungkan tiket masuk dan kereta wisata.',
        'Masuk dengan tiket kawasan dan shuttle yang sudah dipesan online untuk dua paspor; sejak 1 Januari 2026 gerbang tidak menjual tiket. Dari 雪川游客港, shuttle ke Blue Moon Valley untuk pagi, lalu kembali ke 雪川游客港 untuk Impression Lijiang 13.20.',
        'Dari teater, langsung naik shuttle 冰川公园 ke stasiun bawah Big Cable Car untuk slot 15.00–15.30. Gondola membawa kamu ke area sekitar 4.506 m. Bila pukul ±15.45 belum naik, lewati Glacier Park dan langsung ke Stasiun Lijiang.',
      ],
      duration: 'Sekitar 80 menit berkendara dari kota menurut pengumuman pengelola, ditambah ±45 menit bila harus lewat Baisha; antrean shuttle dan gondola di luar waktu itu.',
      sources: [jadeDragonNotice, jadeDragonAutumnNotice, jadeDragonGateNotice, jadeDragonGuide, jadeDragonTrain, jadeDragonTravelNotice, impressionLijiangVenue],
    },
    stopAccess: {
      'cable-car': 'Dari 雪川游客港, ikuti shuttle bertanda 冰川公园索道 menuju stasiun bawah. Tiba sesuai slot pada tiket; bila pukul ±15.45 belum naik, lewati.',
      'jade-dragon': 'Naik Big Cable Car ke stasiun atas, lalu ikuti jalur resmi Glacier Park. Mulai antre turun paling lambat ±16.20 agar mobil bisa berangkat ke stasiun ±17.15.',
    },
    costs: [
      { label: 'Tiket masuk kawasan Jade Dragon', amount: 'CNY 100 / orang', detail: 'Satu tiket untuk Blue Moon Valley, teater Impression Lijiang, dan Glacier Park pada 19 November, berlaku satu hari. Pesan online untuk dua paspor; gerbang tidak menjual tiket sejak 1 Januari 2026. Tiket pertunjukan dibeli terpisah.', status: 'published', source: jadeDragonSummerNotice },
      { label: 'Shuttle antartitik di kawasan', amount: 'CNY 20 / orang', detail: 'Cek apakah sudah termasuk paket gondola. Jangan menambahkan biaya shuttle dua kali.', status: 'published', source: jadeDragonNotice },
      { label: 'Big Cable Car pulang-pergi', amount: 'Acuan CNY 120 / orang', detail: 'Tarif publikasi pengelola Juli 2026, di luar masuk kawasan dan shuttle. Satu paspor hanya bisa membeli tiket kereta gantung Glacier Park sekali per 90 hari, jadi pilih slot 15.00–15.30 dengan benar pada 12 November.', status: 'published', source: jadeDragonSummerNotice },
      { label: 'Alternatif tiket kawasan + kereta wisata', amount: 'CNY 120 satu arah / CNY 130 pulang-pergi', detail: 'Promo operator 3 November 2026 sampai 5 Februari 2027, dilaporkan 2 November. Ini pilihan pengganti tiket masuk CNY 100 beserta transportasi kereta dari Baisha, bukan biaya tambahan wajib. Gondola dan shuttle internal harus diperiksa terpisah.', status: 'published', source: jadeDragonTrain },
      { label: 'Mobil dari Lijiang dan pengantaran ke stasiun', amount: 'Perlu konfirmasi', detail: 'Seharian dari 06.30 sampai ±18.45 dengan koper di mobil, berakhir di Stasiun Lijiang. Minta harga yang menyebut waktu menunggu, parkir, dan kemungkinan transfer lewat Baisha.', status: 'unconfirmed' },
    ],
    visitDuration: 'Alokasi rencana dari gerbang (±08.00) sampai mobil berangkat ke stasiun (±17.15): Blue Moon sekitar 3¼ jam, Impression sekitar 1 jam, Glacier Park sekitar 1 jam. Bila jadwal mundur, Glacier Park yang dilewati.',
    bestTime: 'Blue Moon Valley pagi, saat matahari mulai menyentuh danau ±08.15–08.35. Glacier Park sore dengan slot Big Cable Car 15.00–15.30; puncak kemungkinan membelakangi matahari (perkiraan, belum dihitung).',
    tips: ['Mulai 12 November, pesan tiket kawasan dan shuttle di mini program 玉龙雪山服务, lalu slot Big Cable Car di mini program 丽江旅游集团, atas nama paspor dengan verifikasi wajah. Impression Lijiang dipesan terpisah di Trip.com.', 'Sebelum 12 November, coba daftar nama asli dengan paspor di mini program 丽江旅游集团 atau telepon 0888-8889999. Bila paspor ditolak, pakai Trip.com.', 'Bawa jaket hangat, sarung tangan, kacamata matahari, dan bekal halal untuk siang dan malam.', 'Tetapkan batas: bila pukul ±15.45 belum di kereta gantung, lewati Glacier Park. Koper sudah di mobil, jadi dari Ganhaizi langsung ke Stasiun Lijiang.'],
    cautions: ['Pengumuman 9 Oktober 2026 menjadwalkan Glacier Park kembali beroperasi 31 Oktober setelah perawatan. Itu bukan jaminan layanan 19 November; cek pemberitahuan terbaru dan slot saat memesan.', 'Pada 4 April 2026 angin kencang memperlambat Big Cable Car; pengunjung antre 4–6 jam dan rombongan terakhir turun ±22.10. Dengan slot sore, keterlambatan langsung mengancam C442, jadi patuhi batas 15.45. Saat cuaca buruk, ikuti status operasional kawasan dan teater secara terpisah.', 'Area atas berada di ketinggian tinggi. Bila tidak nyaman, hentikan pendakian dan minta bantuan petugas; tidak perlu memaksakan titik tertinggi.'],
    sources: [
      { title: 'Pengelola Jade Dragon: tiket dan transportasi', url: jadeDragonNotice, kind: 'official', publishedAt: '2026-05-12' },
      { title: 'Pengelola Jade Dragon: jam buka, parkir Ganhaizi, dan pemesanan, dimuat ulang NetEase', url: jadeDragonAutumnNotice, kind: 'official', publishedAt: '2026-09-23', note: 'Pengumuman 22 September 2026 untuk libur Oktober: buka 06.00–16.30, pesan dengan nama asli sampai 7 hari sebelumnya, kendaraan di Ganhaizi diatur menurut parkir. Belum ada pengumuman khusus November.' },
      { title: 'Pengelola Jade Dragon: gerbang lama berhenti menjual tiket mulai 1 Januari 2026, dimuat ulang Guangming', url: jadeDragonGateNotice, kind: 'official', publishedAt: '2025-12-31', note: 'Penjualan langsung pindah ke pusat pengunjung baru di Baisha; layanan untuk paspor di sana belum diketahui.' },
      { title: 'Cover News: angin kencang memperlambat Big Cable Car', url: jadeDragonWindDelay, kind: 'reference', publishedAt: '2026-04-06', note: 'Kejadian 4 April 2026; data angin November tidak ditemukan.' },
      { title: 'Pengumuman operator: perawatan gondola Oktober 2026, dimuat ulang', url: jadeDragonMaintenance, kind: 'reference', publishedAt: '2026-10-10' },
      { title: 'Lijiang Media: promo kereta wisata, wawancara operator', url: jadeDragonTrain, kind: 'reference', publishedAt: '2026-11-02', note: 'Promo diberitakan lewat wawancara petugas operator. Pastikan isi paket dan ketersediaan tanggal kunjungan di kanal pembelian.' },
      { title: 'Visit Yunnan: acuan gondola dan akses Glacier Park', url: jadeDragonGuide, kind: 'reference', publishedAt: '2026-04-08' },
      { title: 'Pengelola Jade Dragon: tarif kawasan, gondola, dan pertunjukan', url: jadeDragonSummerNotice, kind: 'official', publishedAt: '2026-07-02', note: 'Pengumuman pengelola dimuat Xinhua. Tarif reguler dipakai sebagai acuan; diskon musim panas sudah berakhir.' },
      { title: 'Pengelola Jade Dragon: akses dan waktu perjalanan dari kota', url: jadeDragonTravelNotice, kind: 'official', publishedAt: '2026-07-18', note: 'Waktu perjalanan merupakan acuan pengelola pada musim panas, bukan kepastian lalu lintas 19 November.' },
      { title: 'Lijiang Yulong Tourism: lokasi teater Impression Lijiang', url: impressionLijiangVenue, kind: 'operator', publishedAt: '2026-03-24', note: 'Laporan tahunan operator menjelaskan lokasi di Ganhaizi; bukan jadwal pertunjukan.' },
    ],
    checkedAt: '2026-11-05',
  },
  {
    slug: 'impression-lijiang', name: 'Impression Lijiang', region: 'Yunnan', placeIds: ['impression-lijiang'],
    summary: 'Panggung merah terbuka dengan Jade Dragon sebagai latar: pertunjukan utama pada 19 November, setelah pagi di Blue Moon Valley dan sebelum Glacier Park.',
    gettingThere: {
      origin: 'Blue Moon Valley pada pagi 19 November',
      steps: [
        'Dari halte 蓝月谷(水月阁), naik shuttle kawasan kembali ke 雪川游客港 paling lambat 11.45. 印象丽江剧场 berjarak sekitar 200 m dari halte itu, masih di dalam kawasan Jade Dragon.',
        'Tangkapan layar Trip.com yang diberikan pada 3 November menampilkan pilihan 13:20 dan 14:50 untuk 19 November 2026, dalam waktu setempat Tiongkok (UTC+8). Pilih 13:20 agar slot kereta gantung 15.00–15.30 terkejar; 14:50 hanya untuk rencana cadangan bila tidak ada slot sore. Tiket belum dipesan.',
        'Siapkan tiket pertunjukan terpisah dari tiket masuk kawasan. Acuan penjual tiket menyarankan tiba 30 sampai 60 menit sebelum mulai; rencana ini masuk ±12.45. Ikuti batas masuk pada tiket yang diterbitkan.',
        'Setelah pertunjukan (±14.25), langsung ke halte shuttle 冰川公园 untuk Glacier Park. Zuhur dan Asar dijamak takhir sesudah gletser, lalu mobil langsung ke Stasiun Lijiang untuk C442 20.22.',
      ],
      duration: 'Shuttle dari Blue Moon ke 雪川游客港 belum punya waktu resmi (acuan 15–30 menit). Sisihkan 30 sampai 60 menit di teater sebelum pertunjukan, di luar perpindahan.',
      sources: [impressionLijiangVenue, jadeDragonSummerNotice, impressionLijiangBooking, impressionLijiangTrip, ganhaiziShuttleMap],
    },
    stopAccess: { 'impression-lijiang': 'Gunakan pin 印象丽江剧场 di 甘海子 (Ganhaizi), bukan teater di Kota Tua Lijiang. Ikuti pintu masuk dan sesi yang tertera pada tiket.' },
    costs: [
      { label: 'Referensi Trip.com untuk 19 November', amount: 'Mulai Rp462.162', detail: 'Harga terendah pada kalender di tangkapan layar pengguna, diberikan 3 November 2026. Tersedia pilihan biasa dan VIP, tetapi jenis kursi belum dipilih; ini bukan harga final kursi atau tiket yang sudah dipesan. Cek ulang sesi, kursi, dan total saat memesan.', status: 'estimate', source: impressionLijiangTrip },
      { label: 'Tiket pertunjukan reguler', amount: 'Biasa CNY 280 / VIP CNY 346', detail: 'Tarif pengelola yang dipublikasikan Juli 2026. Harga akhir, kategori kursi, dan ketersediaan 19 November belum dikonfirmasi; tiket kawasan dan transportasi tidak termasuk.', status: 'published', source: jadeDragonSummerNotice },
      { label: 'Promo musim gugur, bersyarat', amount: 'Acuan CNY 180 / tiket biasa', detail: 'Promo 15 Oktober sampai 20 Desember 2026 mensyaratkan mengikuti akun resmi dan interaksi yang ditentukan. Laporan juga meminta bukti kedatangan di Lijiang. Konfirmasikan kelayakan paspor asing, kuota, dan cara penukaran sebelum mengandalkan harga ini.', status: 'estimate', source: impressionLijiangAutumnOffer },
      { label: 'Akses kawasan dan shuttle', amount: 'Kawasan CNY 100 + shuttle CNY 20', detail: 'Komponen yang sama dengan Blue Moon Valley dan Glacier Park hari ini; jangan menjumlahkannya lagi. Rencana memakai tiket terpisah; paket Trip.com CNY 488 hanya alternatif dan sudah mencakup kawasan, gondola, dan pertunjukan.', status: 'published', source: jadeDragonSummerNotice },
    ],
    visitDuration: 'Pertunjukan sekitar 60 menit menurut referensi pemesanan. Alokasikan 1½ sampai 2 jam termasuk tiba lebih awal, di luar transfer.',
    bestTime: 'Pilih 13:20 pada 19 November: pagi untuk Blue Moon Valley, sore untuk Glacier Park. 14:50 hanya cadangan bila 12 November tidak ada slot kereta gantung sore; Glacier Park lalu pindah ke pagi. Keduanya pilihan yang terlihat di Trip.com, belum dipesan; waktu setempat Tiongkok (UTC+8).',
    tips: ['Pastikan nama pada tiket sesuai paspor dan simpan bukti pemesanan sebelum berangkat dari hotel.', 'Bawa jaket, topi, dan kacamata matahari untuk panggung terbuka di Ganhaizi, sekitar 3.100 m.', 'Minta sopir menunggu di Ganhaizi sampai Glacier Park selesai; koper di mobil, lalu langsung ke Stasiun Lijiang tanpa mampir kota tua.', 'Jika memilih promo, tanyakan persyaratan langsung kepada operator sebelum membayar; jangan menganggap diskon otomatis berlaku.'],
    cautions: ['Impression Lijiang adalah agenda wajib dalam rencana ini. Tinggalkan Blue Moon paling lambat 11.45; bila pertunjukan selesai terlambat, Glacier Park yang dilewati.', 'Pilihan 13:20 dan 14:50 terlihat pada tangkapan layar 19 November, tetapi ketersediaan akhir, harga kursi, dan reservasi belum dikonfirmasi. Cocokkan sesi dengan slot kereta gantung sebelum membayar.', 'Pertunjukan berada di luar ruang; perubahan cuaca atau operasional dapat mengubah sesi. Periksa pemberitahuan operator pada hari kunjungan.'],
    sources: [
      { title: 'Trip.com: pilihan sesi dan tiket Impression Lijiang', url: impressionLijiangTrip, kind: 'operator', note: 'Halaman diperiksa 3 November 2026. Tangkapan layar pengguna pada tanggal yang sama memilih 19 November: opsi 13:20 atau 14:50, biasa atau VIP, harga kalender terendah Rp462.162. Sesi dan kursi belum dipilih atau dipesan; harga akhir dapat berubah.' },
      { title: 'Pengelola Jade Dragon: tarif dan kanal resmi pertunjukan', url: jadeDragonSummerNotice, kind: 'official', publishedAt: '2026-07-02', note: 'Pengumuman pengelola dimuat Xinhua. Tarif reguler menjadi acuan terpisah dari penawaran Trip.com; harga akhir dan reservasi 19 November belum dikonfirmasi.' },
      { title: 'Lijiang Yulong Tourism: teater Impression Lijiang di Ganhaizi', url: impressionLijiangVenue, kind: 'operator', publishedAt: '2026-03-24', note: 'Laporan tahunan 2025 operator, dipublikasikan 2026; dipakai untuk lokasi dan karakter panggung.' },
      { title: 'Lijiang Tongcheng: promo musim gugur 15 Oktober–20 Desember 2026', url: impressionLijiangAutumnOffer, kind: 'reference', publishedAt: '2026-10-10', note: 'Laporan peluncuran promo pariwisata kota; kelayakan pengunjung, kuota, dan penukaran perlu dikonfirmasi kepada operator.' },
      { title: 'OpenStreetMap: rute shuttle kawasan dan letak teater dekat 雪川游客港', url: ganhaiziShuttleMap, kind: 'reference', note: 'Relasi rute terakhir disunting 21 Februari 2026; dilihat 5 November 2026. Tidak memuat jadwal atau lama perjalanan.' },
      { title: 'WingOn Travel: durasi dan persiapan masuk Impression Lijiang', url: impressionLijiangBooking, kind: 'operator', note: 'Referensi penjual tiket untuk durasi sekitar 60 menit dan waktu tiba. Contoh sesi pada halaman bukan konfirmasi jadwal 19 November.' },
    ],
    checkedAt: '2026-11-05',
  },
  {
    slug: 'blue-moon-valley', name: 'Blue Moon Valley', region: 'Yunnan', placeIds: ['blue-moon'],
    summary: 'Empat danau toska di kaki Jade Dragon, dari 玉液湖 di hulu sampai 听涛湖 di hilir, dengan jalur tepi air untuk berjalan dan memotret pada pagi 19 November.',
    gettingThere: {
      origin: 'Hotel sekitar Dayan, Lijiang, pada pagi 19 November',
      steps: [
        'Mobil dari hotel 06.30 ke Ganhaizi, sekitar 80 menit; koper ikut di mobil seharian. Masuk dengan tiket kawasan dan shuttle yang sudah dipesan online untuk dua paspor; gerbang tidak menjual tiket.',
        'Dari 雪川游客港, shuttle kawasan lewat 云杉坪 ke halte 蓝月谷(水月阁) di tepi 蓝月湖. Jam bus pertama dan lama perjalanan belum resmi.',
        'Jalan dulu ke hulu, 玉液湖, sekitar 0,4 km ke barat dari halte, lalu turun mengikuti aliran: 镜潭湖, 蓝月湖, dan 听涛湖 (sekitar 0,35 km ke timur dari halte). Kendaraan listrik lembah bersifat pilihan, berbeda dari shuttle antartitik kawasan.',
        'Naik shuttle kembali ke 雪川游客港 paling lambat 11.45 untuk Impression Lijiang 13.20.',
      ],
      duration: 'Jalan kaki sekitar 1 jam tanpa berhenti, atau sekitar 1½ jam dengan berhenti memotret, menurut panduan. Shuttle antarhalte mengikuti antrean hari itu.',
      sources: [jadeDragonNotice, jadeDragonGuide, blueMoonMap, blueMoonShuttleMap, blueMoonLight],
    },
    stopAccess: { 'blue-moon': 'Turun di halte 蓝月谷(水月阁), lalu ikuti jalur resmi ke hulu menuju 玉液湖. Tanyakan halte pulang sebelum mulai berjalan.' },
    costs: [
      { label: 'Akses dalam kawasan Jade Dragon', amount: 'CNY 100 / orang untuk kawasan', detail: 'Tiket kawasan yang sama dengan Impression Lijiang dan Glacier Park pada 19 November, berlaku satu hari. Pesan online untuk dua paspor; gerbang tidak menjual tiket sejak 1 Januari 2026.', status: 'published', source: jadeDragonNotice },
      { label: 'Shuttle kawasan', amount: 'CNY 20 / orang', detail: 'Komponen yang sama pada rangkaian Jade Dragon, bukan biaya shuttle baru untuk setiap pemberhentian. Periksa isi paket.', status: 'published', source: jadeDragonNotice },
      { label: 'Kendaraan listrik di lembah', amount: 'CNY 10 per ruas / CNY 40 seluruh rute', detail: 'Tarif pengelola 2026 per orang, tidak wajib. Jalan kaki cukup bila kondisi tubuh dan jalur memungkinkan. Jam operasinya belum dipublikasikan.', status: 'published', source: jadeDragonSummerNotice },
    ],
    visitDuration: 'Alokasi rencana sekitar 3¼ jam di tepi danau, ±08.30–11.45, sebelum shuttle ke teater Impression Lijiang.',
    bestTime: 'Pagi 19 November. Hitungan medan SRTM dan posisi matahari (5 November 2026, ±15 menit) menempatkan sinar pertama di air sekitar 08.15 di 听涛湖, 08.20 di 蓝月湖, dan 08.35 di 玉液湖. Cahaya samping-belakang dari kiri ke arah puncak paling bagus ±09.00–11.00; air paling biru di hari cerah.',
    tips: ['Foto dari jalur pejalan kaki; jangan turun ke air atau melintasi pembatas.', 'Mulai dari hulu: panduan menyebut 玉液湖 paling jernih dan paling sepi, lalu berjalan searah aliran sehingga tidak perlu menelusuri lembah dua kali.', 'Tanyakan lama shuttle ke 雪川游客港 saat turun di halte, lalu tinggalkan lembah paling lambat 11.45.'],
    cautions: ['Warna air dan jarak pandang dipengaruhi cuaca; saat mendung air tampak hijau keabu-abuan. Foto galeri bukan janji kondisi pada hari kunjungan.', 'Tiket gondola tidak diperlukan untuk sekadar mengunjungi lembah, tetapi akses kawasan tetap mengikuti ketentuan masuk.', 'Jam buka resmi Blue Moon Valley dan jam ramainya belum ditemukan; Trip.com menulis 06.00–16.00.'],
    sources: [
      { title: 'Pengelola Jade Dragon: biaya kawasan dan layanan pilihan', url: jadeDragonNotice, kind: 'official', publishedAt: '2026-05-12' },
      { title: 'Pengelola Jade Dragon: tarif kawasan dan mobil listrik Blue Moon Valley', url: jadeDragonSummerNotice, kind: 'official', publishedAt: '2026-07-02', note: 'Pengumuman pengelola dimuat Xinhua: mobil listrik CNY 10 per ruas, CNY 40 seluruh rute, tidak wajib.' },
      { title: 'Visit Yunnan: Blue Moon Valley dan jalur jalan kaki', url: jadeDragonGuide, kind: 'reference', publishedAt: '2026-04-08' },
      { title: 'OpenStreetMap: letak empat danau dan halte 蓝月谷(水月阁)', url: blueMoonMap, kind: 'reference', note: 'Dilihat 5 November 2026.' },
      { title: 'OpenStreetMap: rute shuttle 雪川游客港 → 云杉坪 → 蓝月谷(水月阁)', url: blueMoonShuttleMap, kind: 'reference', note: 'Relasi rute terakhir disunting 21 Februari 2026; dilihat 5 November 2026. Tidak memuat jadwal atau lama perjalanan.' },
      { title: 'Trip.com: jam buka Blue Moon Valley', url: blueMoonTrip, kind: 'reference', note: 'Dilihat 5 November 2026: buka 06.00–16.00, masuk terakhir 16.00. Unggahan pengguna di halaman yang sama menulis jam lain; jam resmi belum ditemukan.' },
      { title: 'GoChinaTravel: urutan jalan dan cahaya pagi di Blue Moon Valley', url: blueMoonLight, kind: 'reference', note: 'Terakhir diverifikasi penulisnya 28 September 2026.' },
      { title: 'OpenTopoData SRTM 30 m: dasar hitungan bayangan medan', url: terrainHorizon, kind: 'reference', note: 'Dihitung 5 November 2026 dengan posisi matahari NOAA; pohon dan tebing dekat tidak terhitung, jadi ±15 menit.' },
    ],
    checkedAt: '2026-11-05',
  },
  {
    slug: 'erhai', name: 'Danau Erhai & Caicun', region: 'Yunnan', placeIds: ['erhai', 'caicun'],
    summary: 'Pagi di tepi barat Erhai dimulai dari Caicun, tanpa harus mengelilingi seluruh danau.',
    gettingThere: {
      origin: 'Hotel dekat Kota Tua Dali pada 20 November',
      steps: [
        'Pesan taksi atau DiDi ke 才村码头 di ujung timur Yuehua Road. PDF memperkirakan jaraknya sekitar 3 sampai 4 km dari gerbang timur kota tua.',
        'Dari area turun kendaraan, lanjutkan berjalan ke tepi danau dan koridor pejalan kaki.',
        'Setelah jalan pagi, kembali ke Kota Tua Dali untuk makan dan salat Jumat sebelum mengambil koper.',
      ],
      duration: 'Alokasi rencana 20 sampai 30 menit dari hotel ke awal jalur, termasuk jalan kaki; sesuaikan dengan lokasi hotel.',
      sources: [caicunGuide, erhaiReport],
    },
    stopAccess: {
      erhai: 'Dari Caicun, masuk ke koridor tepi barat Erhai dan pilih ruas pendek untuk berjalan pulang-pergi.',
      caicun: 'Arahkan kendaraan ke 才村码头, lalu berjalan dari area turun kendaraan menuju dermaga dan tepian danau.',
    },
    costs: [
      { label: 'Berjalan di koridor tepi Erhai', amount: 'Gratis', detail: 'Laporan People’s Daily 22 Mei 2025 menyebut koridor terbuka gratis. Ini akses jalan kaki, bukan tiket kapal atau sewa kendaraan; layanan komersial perlu dicek di lokasi.', status: 'published', source: erhaiReport },
      { label: 'Taksi hotel ke Caicun', amount: 'Perlu konfirmasi', detail: 'Lihat penawaran aplikasi sebelum memesan; siapkan juga titik jemput untuk kembali ke kota tua.', status: 'unconfirmed' },
      { label: 'Sewa sepeda atau kendaraan koridor', amount: 'Opsional, cek tarif setempat', detail: 'Pastikan jenis kendaraan diizinkan di ruas tujuan, termasuk biaya deposit dan batas waktu pengembalian.', status: 'unconfirmed' },
    ],
    visitDuration: 'Alokasi rencana 1½ sampai 2 jam; pilih ruas dekat Caicun agar cukup waktu untuk Dali.',
    bestTime: 'Pagi 20 November, sebelum kembali ke kota tua untuk agenda siang.',
    tips: ['Simpan pin Caicun agar tidak tertukar dengan titik wisata di seberang timur danau.', 'Untuk jadwal singkat ini, berjalan pulang-pergi lebih mudah diatur daripada berkeliling danau.', 'Bawa lapisan penahan angin dan air minum untuk perjalanan tepi danau.'],
    cautions: ['Koridor bukan jalan untuk mobil pribadi; jangan mengikuti navigasi mobil sampai ke jalur pejalan kaki.', 'Batas kembali mengikuti waktu salat Jumat dan kereta Dali ke Kunming pada hari yang sama.'],
    sources: [
      { title: 'People’s Daily: koridor Erhai terbuka gratis', url: erhaiReport, kind: 'reference', publishedAt: '2025-05-22' },
      { title: 'Qunar: lokasi Dermaga Caicun', url: caicunGuide, kind: 'operator' },
    ],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'dali', name: 'Kota Tua Dali & Menara Wuhua', region: 'Yunnan', placeIds: ['dali-old-town', 'wuhua'],
    summary: 'Gang kota tua dan Menara Wuhua menjadi persinggahan siang sebelum kereta menuju Kunming.',
    gettingThere: {
      origin: 'Caicun setelah jalan pagi di Erhai pada 20 November',
      steps: [
        'Naik taksi dari Caicun kembali ke gerbang Kota Tua Dali terdekat dengan hotel atau tujuan makan.',
        'Sarapan halal di Bo’ai Road atau dekat penginapan, titip koper, lalu berjalan melalui kawasan kota tua menuju 五华楼 (±10.45–12.15).',
        'Salat Jumat ±12.15–14.00 tanpa terburu-buru, makan siang di Bo’ai Road, lalu Gerbang Selatan dan tembok kota dalam cahaya sore. Sekitar 16.10, setelah Asar, ambil koper dan naik taksi sekitar 17 km ke 大理站 di Xiaguan, 30–40 menit.',
        'D8704 berangkat 17.42 dan tiba di 昆明站 pukul 19.49, lalu lanjut ke 昆明南站 (20.12). Turun di 昆明站.',
      ],
      duration: 'Perjalanan dari Caicun bergantung titik turun. Taksi ke 大理站 sekitar 30–40 menit; tiba ±40 menit sebelum D8704 17.42.',
      sources: [daliDirectory, caicunGuide],
    },
    stopAccess: {
      'dali-old-town': 'Dari gerbang kota tua, lanjutkan dengan berjalan kaki. Pilih pintu masuk dekat hotel untuk memudahkan pengambilan koper.',
      wuhua: 'Ikuti navigasi jalan kaki ke 五华楼 dari jalan utama kota tua. Periksa akses tangga dan tarif lantai atas di lokasi.',
    },
    costs: [
      { label: 'Kawasan Kota Tua Dali', amount: 'Gratis', detail: 'Direktori pemerintah Dali menyebut kawasan dibuka gratis sepanjang tahun. Layanan dan objek berbayar di dalamnya terpisah.', status: 'published', source: daliDirectory },
      { label: 'Akses lantai atas Menara Wuhua', amount: 'Perlu konfirmasi', detail: 'Belum ditemukan tarif operator yang dapat dipastikan untuk 20 November. Melihat bangunan dari jalan tidak sama dengan akses naik menara.', status: 'unconfirmed' },
      { label: 'Taksi Caicun dan transfer Stasiun Dali', amount: 'Perlu konfirmasi', detail: 'Dua perjalanan terpisah. Pesan tujuan 大理站, lalu cek harga aplikasi dan waktu tempuh sebelum berangkat.', status: 'unconfirmed' },
    ],
    visitDuration: 'Alokasi rencana sekitar 1½ jam untuk Menara Wuhua dan gang (±10.45–12.15), lalu sekitar 1¼ jam cahaya sore di Gerbang Selatan dan tembok kota (±14.45–16.05). Salat Jumat, makan siang, dan transfer stasiun disisihkan terpisah.',
    bestTime: 'Siang dan sore 20 November; Gerbang Selatan dan tembok kota disinari dari barat daya ±14.45–16.05. Foto gerbang Dali pada malam hari di galeri adalah referensi tempat, bukan jadwal kunjungan ini.',
    tips: ['Minta hotel memastikan lokasi masjid dan waktu salat Jumat sejak malam sebelumnya.', 'Selesaikan belanja sebelum mengambil koper agar transfer ke stasiun langsung.', 'Jangan menjadwalkan keliling Erhai penuh pada pagi yang sama.'],
    cautions: ['Malam 20 November menginap di Kunming, sehingga perjalanan sore ke stasiun harus tetap dipertahankan.', 'Akses naik Wuhua dapat berbeda dari akses jalan kota tua; ikuti papan setempat.'],
    sources: [
      { title: 'Pemerintah Dali: direktori kawasan wisata dan akses gratis', url: daliDirectory, kind: 'official' },
      { title: 'Qunar: lokasi Caicun di timur kota tua', url: caicunGuide, kind: 'operator' },
    ],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'kunming-old-town', name: 'Shuncheng & Masjid Nancheng', region: 'Yunnan', placeIds: ['nancheng', 'shuncheng'],
    summary: 'Kawasan makan halal dan masjid di pusat Kunming untuk malam terakhir perjalanan.',
    gettingThere: {
      origin: 'Stasiun kedatangan kereta dari Dali pada 20 November',
      steps: [
        'D8704 berhenti di 昆明站 pukul 19.49 lalu lanjut ke 昆明南站; turun di 昆明站 dan kirim nama stasiun itu saat mengatur taksi atau penjemputan hotel.',
        'Simpan koper di penginapan sekitar Shuncheng, lalu berjalan ke kawasan 顺城街 di sekitar Dunren Lane.',
        'Untuk Masjid Nancheng, gunakan pin 南城清真寺 di kawasan Zhengyi Road. Konfirmasikan akses dengan pengurus sebelum masuk.',
      ],
      duration: 'Taksi dari 昆明站 ke penginapan Shuncheng lalu check-in, sekitar 19.50–20.30.',
      sources: [nanchengLocation, shunchengLocation],
    },
    stopAccess: {
      shuncheng: 'Dari hotel Shuncheng, berjalan ke 顺城街敦仁巷 di sekitar Masjid Shuncheng untuk menjelajahi kawasan makan.',
      nancheng: 'Lanjutkan berjalan atau naik taksi singkat dengan pin 南城清真寺 di Zhengyi Road; minta izin pengurus untuk memasuki area ibadah.',
    },
    costs: [
      { label: 'Transfer stasiun ke hotel Shuncheng', amount: 'Perlu konfirmasi', detail: 'Harga berbeda menurut stasiun, waktu, dan tujuan hotel. Gunakan penawaran aplikasi atau taksi resmi berargometer.', status: 'unconfirmed' },
      { label: 'Kunjungan masjid dan makan', amount: 'Konfirmasi di lokasi', detail: 'Tidak ada tarif wisata masjid yang terverifikasi. Makanan dibayar sesuai menu; jangan menganggap semua tempat makan di kawasan otomatis halal.', status: 'unconfirmed' },
    ],
    visitDuration: 'Alokasi rencana 1 sampai 2 jam untuk makan malam dan berjalan di sekitar hotel.',
    bestTime: 'Malam 20 November; sarapan 21 November hanya bila jadwal penerbangan memungkinkan.',
    tips: ['Cari tanda 清真 dan tanyakan bahan langsung kepada penjual.', 'Simpan pin hotel dan masjid terpisah agar sopir tidak memilih bangunan yang keliru.', 'Konfirmasikan transfer bandara untuk hari berikutnya sebelum tidur.'],
    cautions: ['Masjid adalah tempat ibadah aktif; patuhi aturan pakaian, akses, dan fotografi.', 'Agenda salat Jumat 20 November berada di Dali, bukan Kunming.'],
    sources: [{ title: 'Amap: pin Masjid Nancheng di Zhengyi Road', url: nanchengLocation, kind: 'operator' }, { title: 'GoKunming: Masjid Shuncheng di Dunren Lane', url: shunchengLocation, kind: 'reference', publishedAt: '2021-03-11', note: 'Direktori terakhir diperbarui 12 Maret 2021. Dipakai untuk lokasi, bukan kepastian jam ibadah atau akses pengunjung saat ini.' }],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'green-lake', name: 'Green Lake (Cuihu)', region: 'Yunnan', placeIds: ['green-lake'],
    summary: 'Pilihan jalan pagi di taman kota, hanya jika masih ada waktu sebelum penerbangan pulang.',
    gettingThere: {
      origin: 'Hotel di kawasan Shuncheng pada 21 November',
      steps: [
        'Periksa jam penerbangan dan waktu jemput bandara lebih dulu. Jika penerbangan pagi, lewati kunjungan ini.',
        'Gunakan taksi atau navigasi jalan kaki ke 翠湖公园南门 di Cuihu South Road. Pilih rute berdasarkan lokasi hotel.',
        'Jika memakai metro, Amap menempatkan gerbang selatan sekitar 470 m berjalan kaki dari pintu B Stasiun Huashan West Road.',
      ],
      duration: 'Sisihkan waktu dari hotel sesuai peta pada pagi itu; jarak berjalan dari metro ke gerbang sekitar 470 m menurut Amap.',
      sources: [greenLakeEntrance],
    },
    stopAccess: { 'green-lake': 'Masuk melalui 翠湖公园南门, jelajahi tepi danau, lalu kembali ke titik jemput yang telah disepakati.' },
    costs: [
      { label: 'Masuk taman Cuihu', amount: 'Gratis', detail: 'Pemerintah Yunnan menyebut Cuihu taman dengan akses publik gratis. Kegiatan atau layanan komersial terpisah.', status: 'published', source: greenLakeNotice },
      { label: 'Taksi atau metro dari hotel', amount: 'Perlu konfirmasi', detail: 'Tarif mengikuti titik awal. Periksa aplikasi atau mesin tiket; transfer bandara dihitung terpisah.', status: 'unconfirmed' },
    ],
    visitDuration: 'Alokasi rencana sekitar 1½ jam (±07.10–08.40) bila terbang ±14.30 atau lebih siang; 45 menit bila terbang antara ±12.00 dan 14.30; lewati bila lebih pagi.',
    bestTime: 'Pagi 21 November sebelum transfer bandara. Pengumuman taman 25 November 2025 menetapkan jam tahunan April sampai November 06.00–24.00; tetap cek penutupan sementara.',
    tips: ['Simpan koper di hotel dan bawa barang seperlunya untuk putaran pendek.', 'Tetapkan jam kembali sebelum masuk taman.', 'Gunakan gerbang yang sama untuk masuk dan keluar agar penjemputan mudah.'],
    cautions: ['Jam penerbangan 21 November sesuai tiket dan belum tercantum di panduan ini. Kunjungan ini tetap opsional.', 'Jangan memakai durasi jalan pagi untuk mengurangi waktu check-in bandara yang diwajibkan maskapai.'],
    sources: [
      { title: 'Pemerintah Yunnan: akses publik gratis Cuihu', url: greenLakeNotice, kind: 'official', publishedAt: '2024-03-26', note: 'Teks terindeks mengonfirmasi akses gratis; halaman penuh tidak dapat dimuat saat pengecekan.' },
      { title: 'Pengumuman Taman Cuihu: jadwal buka tahunan, dimuat ulang Kunming Media', url: greenLakeHours, kind: 'reference', publishedAt: '2025-11-25' },
      { title: 'Amap: gerbang selatan Cuihu dan akses metro', url: greenLakeEntrance, kind: 'operator' },
    ],
    checkedAt: '2026-11-03',
  },
];
