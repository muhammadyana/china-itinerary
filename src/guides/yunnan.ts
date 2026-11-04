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
const impressionLijiangVenue = 'https://static.cninfo.com.cn/finalpage/2026-03-24/1225026384.PDF';
const impressionLijiangAutumnOffer = 'https://www.sohu.com/a/1085620886_216434';
const impressionLijiangBooking = 'https://www.wingontravel.com/things-to-do/detail?cityID=58&productID=100053081';
const impressionLijiangTrip = 'https://id.trip.com/travel-guide/attraction/yulong/impressions-lijiang-performance-10758688/';
const lijiangFee = 'https://www.ctdsb.net/c1716_202507/2486302.html';
const dukezongTickets = 'https://piao.qunar.com/ticket/detail_188282.html?from=mpshouye_hotdest_sight';
const guishanTickets = 'https://piao.qunar.com/ticket/detail_474029.html';
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
    slug: 'dukezong', name: 'Dukezong & Bukit Guishan', region: 'Yunnan',
    placeIds: ['dukezong', 'guishan'],
    summary: 'Jalan berbatu dan rumah kayu menjadi sambutan pertama di Shangri-La; roda doa emas di Bukit Guishan bisa dikunjungi bila sempat.',
    gettingThere: {
      origin: 'Riwa, Sichuan, pada 17 November',
      steps: [
        'Pukul 08.00, naik taksi atau mobil carteran dari Riwa ke Xiangcheng, sekitar 3–3,5 jam, dengan tarif yang disepakati semalam.',
        'Di 乡城长途汽车站, beli tiket bus 14.30 ke Shangri-La dengan paspor. Perjalanan sekitar 5 jam; bus tiba sekitar 19.30–20.00, setelah gelap. Jika bus batal karena salju, bermalam di Xiangcheng dan naik bus 08.00 besok.',
        'Setiba di kota Shangri-La, naik taksi ke hotel di Dukezong. Gunakan pin 独克宗古城, bukan Shangri-La Town di Sichuan.',
        'Bukit Guishan dilewati malam ini karena sudah gelap. Singgah sebentar pada 18 November hanya jika waktu memungkinkan.',
      ],
      duration: 'Sekitar 3–3,5 jam naik taksi ke Xiangcheng, menunggu bus 14.30, lalu sekitar 5 jam naik bus. Tiba sekitar 19.30–20.00, setelah matahari terbenam sekitar 18.30.',
      sources: [dukezongTickets, guishanTickets],
    },
    stopAccess: {
      dukezong: 'Dari titik turun taksi di tepi Dukezong, berjalan menuju penginapan dan gang kota tua.',
      guishan: 'Dari Dukezong, berjalan ke 龟山公园 dan ikuti tangga menuju roda doa. Tidak dikunjungi saat tiba malam 17 November; singgah pada 18 November hanya jika waktu memungkinkan.',
    },
    costs: [
      { label: 'Kawasan Kota Tua Dukezong', amount: 'Gratis', detail: 'Qunar mencantumkan akses kota tua gratis. Belanja, pertunjukan, dan layanan berbayar terpisah.', status: 'published', source: dukezongTickets },
      { label: 'Bukit Guishan', amount: 'Referensi: gratis', detail: 'Qunar menyebut taman tanpa tiket masuk. Akses bangunan, kegiatan, dan jam masuk dapat berbeda; periksa papan di lokasi sebelum menaiki tangga.', status: 'estimate', source: guishanTickets },
      { label: 'Taksi Riwa ke Xiangcheng', amount: 'Perlu konfirmasi', detail: 'Tarif belum ditemukan. Sepakati harga dengan sopir pada malam 16 November sebelum berangkat.', status: 'unconfirmed' },
      { label: 'Bus Xiangcheng ke Shangri-La', amount: 'Sekitar CNY 86 / orang', detail: 'Acuan rencana untuk bus 14.30; beli di terminal dengan paspor. Taksi ke hotel setelah tiba dibayar terpisah.', status: 'estimate' },
    ],
    visitDuration: 'Alokasi rencana 1 sampai 2 jam setelah check-in; Guishan bersifat opsional.',
    bestTime: 'Malam 17 November setelah check-in bila masih bertenaga, atau siang 18 November saat kembali dari Songzanlin untuk makan dan mengambil koper.',
    tips: ['Simpan nama dan pin hotel sebelum tiba agar koper tidak perlu ditarik jauh di jalan berbatu.', 'Pakai sepatu dengan pijakan baik dan bawa lapisan hangat untuk berjalan malam.', 'Ambil foto jalan utama lebih dulu; naik ke Guishan hanya jika waktu dan tenaga cukup.'],
    cautions: ['Ini kota Shangri-La di Yunnan, berbeda dari basis Yading di Riwa, Sichuan.', 'Setelah perjalanan panjang, persingkat kunjungan bila tubuh perlu beristirahat.'],
    sources: [{ title: 'Qunar: akses dan lokasi Dukezong', url: dukezongTickets, kind: 'operator' }, { title: 'Qunar: lokasi dan akses Bukit Guishan', url: guishanTickets, kind: 'operator' }],
    checkedAt: '2026-11-03',
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
    stopAccess: { songzanlin: 'Turun dari shuttle kawasan, lalu lanjut berjalan menaiki tangga ke aula biara. Beri jeda di antara anak tangga.' },
    costs: [
      { label: 'Tiket penuh kawasan', amount: 'Referensi CNY 90 / orang', detail: 'Halaman operator masih mencantumkan CNY 90. Pengumuman shuttle yang lebih baru terbit 27 Agustus 2026, tetapi rincian tarif lampirannya belum dapat diverifikasi. Konfirmasikan total dan isi paket untuk 18 November.', status: 'estimate', source: songzanlinTickets },
      { label: 'Layanan shuttle kawasan', amount: 'Perlu konfirmasi', detail: 'Ada pengumuman tarif baru tertanggal 27 Agustus 2026. Minta loket menjelaskan apakah layanan yang dipilih sudah termasuk tiket; jangan menambah biaya shuttle otomatis di atas acuan paket.', status: 'unconfirmed', source: songzanlinShuttle },
      { label: 'Taksi atau bus kota dari Dukezong', amount: 'Perlu konfirmasi', detail: 'Taksi memakai harga aplikasi atau argometer. Nomor rute, halte, dan tarif bus perlu dicek ulang karena informasi operator berbeda antarhalaman.', status: 'unconfirmed' },
    ],
    visitDuration: 'Alokasi rencana 2 sampai 3 jam di kawasan, di luar perjalanan dari hotel.',
    bestTime: 'Pagi 18 November, setelah hotel memastikan jam masuk. Halaman operator menampilkan jam buka yang berbeda, sehingga belum ada jam November yang dapat dipastikan.',
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
    summary: 'Dari kanal Dayan ke lapangan Sifangjie, sore dan malam pertama di Lijiang diisi dengan jalan kaki.',
    gettingThere: {
      origin: 'Stasiun Lijiang setelah kereta dari Shangri-La pada 18 November',
      steps: [
        'Dari stasiun, gunakan taksi resmi atau DiDi ke gerbang kota tua yang paling dekat hotel. Kirim pin hotel kepada sopir.',
        'Temui penjemput hotel di tepi kawasan dan lanjutkan berjalan kaki ke penginapan; jangan mengandalkan mobil untuk masuk gang Dayan.',
        'Setelah check-in, telusuri kanal menuju 四方街, lapangan Sifangjie di dalam kota tua.',
      ],
      duration: 'Sisihkan sekitar 45 sampai 60 menit dari stasiun sampai hotel, termasuk perjalanan kaki dan bagasi; alokasi rencana.',
      sources: ['https://travelnews.qunar.com/qa_strategy/lijiang-ancient-town-one-day-essential-route-guide'],
    },
    stopAccess: {
      dayan: 'Turun di gerbang yang disepakati hotel, lalu berjalan melalui gang Dayan dan jembatan kanal.',
      sifangjie: 'Dari hotel sekitar Dayan, ikuti navigasi jalan kaki menuju 四方街; tidak perlu pindah kendaraan.',
    },
    costs: [
      { label: 'Biaya pemeliharaan Kota Tua Lijiang', amount: 'CNY 50 / orang', detail: 'Ketentuan yang berlaku sejak 1 Agustus 2025 menetapkan masa berlaku 365 hari. Simpan bukti pembayaran; tanyakan pengecualian yang sesuai identitas.', status: 'published', source: lijiangFee },
      { label: 'Taksi dari Stasiun Lijiang', amount: 'Perlu konfirmasi', detail: 'Cek harga ke gerbang hotel di aplikasi atau gunakan argometer. Biaya ini terpisah dari tiket kereta.', status: 'unconfirmed' },
    ],
    visitDuration: 'Alokasi rencana 2 sampai 3 jam untuk Dayan dan Sifangjie, dengan jeda makan malam.',
    bestTime: 'Sore sampai malam 18 November, setelah menaruh koper di hotel.',
    tips: ['Siapkan mobil berangkat pagi untuk Jade Dragon besok, dengan waktu menunggu, pengambilan koper, dan pengantaran ke Stasiun Lijiang yang disepakati.', 'Cocokkan slot gondola pagi, sesi Impression Lijiang yang wajib ditonton, dan kereta malam ke Dali sebelum mengunci jadwal. Simpan tiket serta pin penjemputan di ponsel.', 'Pakai sepatu yang nyaman di batu licin dan simpan pin hotel sebelum menjelajah gang.', 'Untuk makan halal, cari tanda 清真 dan konfirmasikan bahan sebelum memesan.'],
    cautions: ['Biaya pemeliharaan kota tua berbeda dari tiket objek berbayar di dalamnya.', 'Jangan membeli paket Jade Dragon dari calo hanya karena menawarkan jaminan slot.'],
    sources: [
      { title: 'Ketentuan pemeliharaan Lijiang 2025, teks pemerintah dimuat ulang', url: lijiangFee, kind: 'reference', publishedAt: '2025-07-17' },
      { title: 'Qunar: akses stasiun dan rute Dayan', url: 'https://travelnews.qunar.com/qa_strategy/lijiang-ancient-town-one-day-essential-route-guide', kind: 'reference', publishedAt: '2026-06-22' },
    ],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'jade-dragon', name: 'Jade Dragon & Glacier Park', region: 'Yunnan', placeIds: ['jade-dragon', 'cable-car'],
    summary: 'Glacier Park membuka pagi, disusul pertunjukan Impression Lijiang dan Blue Moon Valley sebelum kereta malam ke Dali.',
    gettingThere: {
      origin: 'Hotel sekitar Dayan, Lijiang, pada 19 November',
      steps: [
        'Pesan mobil berangkat pagi dari hotel menuju Jade Dragon. Acuan pengelola dari kota ke Ganhaizi sekitar 80 menit; sesuaikan waktu berangkat dengan slot gondola, antrean, dan sesi Impression Lijiang.',
        'Alternatif terbaru: dari pusat pengunjung baru Baisha, ada kereta wisata ke kawasan. Promo mulai 3 November 2026 menggabungkan tiket masuk dan kereta; cek sambungan ke shuttle dan slot gondola sebelum mengganti rencana mobil.',
        'Validasi tiket kawasan dan reservasi 冰川公园索道, lalu ikuti shuttle menuju stasiun bawah Big Cable Car.',
        'Gondola membawa kamu ke area sekitar 4.506 m. Turun cukup awal untuk menuju 印象丽江剧场 di Ganhaizi; minta petugas menunjukkan sambungan shuttle yang aktif. Impression Lijiang didahulukan sebelum Blue Moon Valley.',
      ],
      duration: 'Sekitar 80 menit berkendara dari kota menurut pengumuman pengelola; antrean shuttle dan gondola di luar waktu itu.',
      sources: [jadeDragonNotice, jadeDragonGuide, jadeDragonTrain, jadeDragonTravelNotice, impressionLijiangVenue],
    },
    stopAccess: {
      'cable-car': 'Dari pusat layanan kawasan, ikuti shuttle bertanda 冰川公园索道 menuju stasiun bawah. Tiba sesuai slot pada tiket.',
      'jade-dragon': 'Naik Big Cable Car ke stasiun atas, lalu ikuti jalur resmi Glacier Park. Tetapkan batas waktu turun agar tiba sebelum sesi Impression Lijiang.',
    },
    costs: [
      { label: 'Tiket masuk kawasan Jade Dragon', amount: 'CNY 100 / orang', detail: 'Akses kawasan yang sama untuk Glacier Park, teater Impression Lijiang, dan Blue Moon Valley hari ini. Tiket pertunjukan dibeli terpisah.', status: 'published', source: jadeDragonSummerNotice },
      { label: 'Shuttle antartitik di kawasan', amount: 'CNY 20 / orang', detail: 'Cek apakah sudah termasuk paket gondola. Jangan menambahkan biaya shuttle dua kali.', status: 'published', source: jadeDragonNotice },
      { label: 'Big Cable Car pulang-pergi', amount: 'Acuan CNY 120 / orang', detail: 'Tarif publikasi pengelola Juli 2026, di luar masuk kawasan dan shuttle. Konfirmasikan total paket serta slot 19 November di kanal resmi sebelum membayar.', status: 'published', source: jadeDragonSummerNotice },
      { label: 'Alternatif tiket kawasan + kereta wisata', amount: 'CNY 120 satu arah / CNY 130 pulang-pergi', detail: 'Promo operator 3 November 2026 sampai 5 Februari 2027, dilaporkan 2 November. Ini pilihan pengganti tiket masuk CNY 100 beserta transportasi kereta dari Baisha, bukan biaya tambahan wajib. Gondola dan shuttle internal harus diperiksa terpisah.', status: 'published', source: jadeDragonTrain },
      { label: 'Mobil dari Lijiang dan pengantaran ke stasiun', amount: 'Perlu konfirmasi', detail: 'Minta harga yang menyebut waktu menunggu, pengambilan bagasi, dan tujuan akhir Stasiun Lijiang.', status: 'unconfirmed' },
    ],
    visitDuration: 'Alokasi rencana 3 sampai 4 jam untuk akses dan Glacier Park; pendekkan waktu di atas jika perlu agar sesi Impression Lijiang tetap terkejar.',
    bestTime: 'Slot gondola pagi 19 November, dengan waktu turun mengikuti tiket pertunjukan siang atau sore yang tersedia.',
    tips: ['Periksa slot gondola dan sesi Impression Lijiang di kanal resmi 丽江旅游集团; nama pada pesanan harus sesuai paspor.', 'Bawa jaket hangat, sarung tangan, kacamata matahari, dan bekal halal.', 'Tetapkan waktu turun untuk pertunjukan, lalu waktu keluar kawasan untuk mengambil koper dan mengejar kereta ke Dali.'],
    cautions: ['Pengumuman 9 Oktober 2026 menjadwalkan Glacier Park kembali beroperasi 31 Oktober setelah perawatan. Itu bukan jaminan layanan 19 November; cek pemberitahuan terbaru dan slot saat memesan.', 'Jika antrean gondola terlalu panjang, persingkat atau lewati Glacier Park agar Impression Lijiang tetap menjadi prioritas. Saat cuaca buruk, ikuti status operasional kawasan dan teater secara terpisah.', 'Area atas berada di ketinggian tinggi. Bila tidak nyaman, hentikan pendakian dan minta bantuan petugas; tidak perlu memaksakan titik tertinggi.'],
    sources: [
      { title: 'Pengelola Jade Dragon: tiket dan transportasi', url: jadeDragonNotice, kind: 'official', publishedAt: '2026-05-12' },
      { title: 'Pengumuman operator: perawatan gondola Oktober 2026, dimuat ulang', url: jadeDragonMaintenance, kind: 'reference', publishedAt: '2026-10-10' },
      { title: 'Lijiang Media: promo kereta wisata, wawancara operator', url: jadeDragonTrain, kind: 'reference', publishedAt: '2026-11-02', note: 'Promo diberitakan lewat wawancara petugas operator. Pastikan isi paket dan ketersediaan tanggal kunjungan di kanal pembelian.' },
      { title: 'Visit Yunnan: acuan gondola dan akses Glacier Park', url: jadeDragonGuide, kind: 'reference', publishedAt: '2026-04-08' },
      { title: 'Pengelola Jade Dragon: tarif kawasan, gondola, dan pertunjukan', url: jadeDragonSummerNotice, kind: 'official', publishedAt: '2026-07-02', note: 'Pengumuman pengelola dimuat Xinhua. Tarif reguler dipakai sebagai acuan; diskon musim panas sudah berakhir.' },
      { title: 'Pengelola Jade Dragon: akses dan waktu perjalanan dari kota', url: jadeDragonTravelNotice, kind: 'official', publishedAt: '2026-07-18', note: 'Waktu perjalanan merupakan acuan pengelola pada musim panas, bukan kepastian lalu lintas 19 November.' },
      { title: 'Lijiang Yulong Tourism: lokasi teater Impression Lijiang', url: impressionLijiangVenue, kind: 'operator', publishedAt: '2026-03-24', note: 'Laporan tahunan operator menjelaskan lokasi di Ganhaizi; bukan jadwal pertunjukan.' },
    ],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'impression-lijiang', name: 'Impression Lijiang', region: 'Yunnan', placeIds: ['impression-lijiang'],
    summary: 'Panggung merah terbuka dengan Jade Dragon sebagai latar: pertunjukan utama pada 19 November, setelah Glacier Park dan sebelum Blue Moon Valley.',
    gettingThere: {
      origin: 'Glacier Park setelah gondola pagi pada 19 November',
      steps: [
        'Turun dari Glacier Park dan arahkan perjalanan ke 印象丽江剧场 di Ganhaizi, di dalam kawasan Jade Dragon. Konfirmasikan halte serta sambungan shuttle dengan petugas.',
        'Tangkapan layar Trip.com yang diberikan pada 3 November menampilkan pilihan 13:20 dan 14:50 untuk 19 November 2026, dalam waktu setempat Tiongkok (UTC+8). Utamakan 13:20; pilihan sesi sudah terlihat, tetapi tiket belum dipesan.',
        'Siapkan tiket pertunjukan terpisah dari tiket masuk kawasan. Acuan penjual tiket menyarankan tiba 30 sampai 60 menit sebelum mulai; ikuti batas masuk pada tiket yang diterbitkan.',
        'Setelah pertunjukan, lanjut ke Blue Moon Valley, lalu kembali ke mobil untuk mengambil koper dan menuju Stasiun Lijiang. Sesi 14:50 menjadi cadangan hanya jika durasi danau dipersingkat dan sambungan kereta malam ke Dali masih cukup.',
      ],
      duration: 'Waktu dari gondola ke teater mengikuti shuttle dan antrean hari itu. Sisihkan 30 sampai 60 menit di teater sebelum pertunjukan, di luar perpindahan.',
      sources: [impressionLijiangVenue, jadeDragonSummerNotice, impressionLijiangBooking, impressionLijiangTrip],
    },
    stopAccess: { 'impression-lijiang': 'Gunakan pin 印象丽江剧场 di 甘海子 (Ganhaizi), bukan teater di Kota Tua Lijiang. Ikuti pintu masuk dan sesi yang tertera pada tiket.' },
    costs: [
      { label: 'Referensi Trip.com untuk 19 November', amount: 'Mulai Rp462.162', detail: 'Harga terendah pada kalender di tangkapan layar pengguna, diberikan 3 November 2026. Tersedia pilihan biasa dan VIP, tetapi jenis kursi belum dipilih; ini bukan harga final kursi atau tiket yang sudah dipesan. Cek ulang sesi, kursi, dan total saat memesan.', status: 'estimate', source: impressionLijiangTrip },
      { label: 'Tiket pertunjukan reguler', amount: 'Biasa CNY 280 / VIP CNY 346', detail: 'Tarif pengelola yang dipublikasikan Juli 2026. Harga akhir, kategori kursi, dan ketersediaan 19 November belum dikonfirmasi; tiket kawasan dan transportasi tidak termasuk.', status: 'published', source: jadeDragonSummerNotice },
      { label: 'Promo musim gugur, bersyarat', amount: 'Acuan CNY 180 / tiket biasa', detail: 'Promo 15 Oktober sampai 20 Desember 2026 mensyaratkan mengikuti akun resmi dan interaksi yang ditentukan. Laporan juga meminta bukti kedatangan di Lijiang. Konfirmasikan kelayakan paspor asing, kuota, dan cara penukaran sebelum mengandalkan harga ini.', status: 'estimate', source: impressionLijiangAutumnOffer },
      { label: 'Akses kawasan dan shuttle', amount: 'Kawasan CNY 100 + shuttle CNY 20', detail: 'Komponen yang sama dengan kunjungan Glacier Park dan Blue Moon Valley hari ini; jangan menjumlahkannya lagi untuk setiap tempat. Periksa isi paket yang dibeli.', status: 'published', source: jadeDragonSummerNotice },
    ],
    visitDuration: 'Pertunjukan sekitar 60 menit menurut referensi pemesanan. Alokasikan 1½ sampai 2 jam termasuk tiba lebih awal, di luar transfer.',
    bestTime: 'Utamakan 13:20 pada 19 November; 14:50 sebagai cadangan dengan waktu Blue Moon Valley dan transfer ke Dali yang lebih ketat. Keduanya pilihan yang terlihat di Trip.com, belum dipesan; waktu setempat Tiongkok (UTC+8).',
    tips: ['Pastikan nama pada tiket sesuai paspor dan simpan bukti pemesanan sebelum berangkat dari hotel.', 'Bawa jaket, topi, dan kacamata matahari untuk panggung terbuka di Ganhaizi, sekitar 3.100 m.', 'Minta sopir menyiapkan rute setelah pertunjukan: Blue Moon Valley, bagasi, lalu Stasiun Lijiang.', 'Jika memilih promo, tanyakan persyaratan langsung kepada operator sebelum membayar; jangan menganggap diskon otomatis berlaku.'],
    cautions: ['Impression Lijiang adalah agenda wajib dalam rencana ini. Jika gondola terlambat, pendekkan atau lewati Glacier Park; pendekkan Blue Moon Valley bila waktu ke stasiun terbatas.', 'Pilihan 13:20 dan 14:50 terlihat pada tangkapan layar 19 November, tetapi ketersediaan akhir, harga kursi, dan reservasi belum dikonfirmasi. Cocokkan sesi dengan kereta ke Dali sebelum membayar.', 'Pertunjukan berada di luar ruang; perubahan cuaca atau operasional dapat mengubah sesi. Periksa pemberitahuan operator pada hari kunjungan.'],
    sources: [
      { title: 'Trip.com: pilihan sesi dan tiket Impression Lijiang', url: impressionLijiangTrip, kind: 'operator', note: 'Halaman diperiksa 3 November 2026. Tangkapan layar pengguna pada tanggal yang sama memilih 19 November: opsi 13:20 atau 14:50, biasa atau VIP, harga kalender terendah Rp462.162. Sesi dan kursi belum dipilih atau dipesan; harga akhir dapat berubah.' },
      { title: 'Pengelola Jade Dragon: tarif dan kanal resmi pertunjukan', url: jadeDragonSummerNotice, kind: 'official', publishedAt: '2026-07-02', note: 'Pengumuman pengelola dimuat Xinhua. Tarif reguler menjadi acuan terpisah dari penawaran Trip.com; harga akhir dan reservasi 19 November belum dikonfirmasi.' },
      { title: 'Lijiang Yulong Tourism: teater Impression Lijiang di Ganhaizi', url: impressionLijiangVenue, kind: 'operator', publishedAt: '2026-03-24', note: 'Laporan tahunan 2025 operator, dipublikasikan 2026; dipakai untuk lokasi dan karakter panggung.' },
      { title: 'Lijiang Tongcheng: promo musim gugur 15 Oktober–20 Desember 2026', url: impressionLijiangAutumnOffer, kind: 'reference', publishedAt: '2026-10-10', note: 'Laporan peluncuran promo pariwisata kota; kelayakan pengunjung, kuota, dan penukaran perlu dikonfirmasi kepada operator.' },
      { title: 'WingOn Travel: durasi dan persiapan masuk Impression Lijiang', url: impressionLijiangBooking, kind: 'operator', note: 'Referensi penjual tiket untuk durasi sekitar 60 menit dan waktu tiba. Contoh sesi pada halaman bukan konfirmasi jadwal 19 November.' },
    ],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'blue-moon-valley', name: 'Blue Moon Valley', region: 'Yunnan', placeIds: ['blue-moon'],
    summary: 'Danau toska di kaki Jade Dragon, dengan jalur tepi air untuk berjalan dan berhenti memotret.',
    gettingThere: {
      origin: 'Teater Impression Lijiang di Ganhaizi setelah pertunjukan 19 November',
      steps: [
        'Setelah Impression Lijiang selesai, tanyakan halte bus wisata kawasan menuju 蓝月谷. Ikuti rute shuttle yang ditunjukkan petugas.',
        'Jelajahi tepian danau dengan berjalan kaki. Kendaraan listrik lokal bersifat pilihan, berbeda dari bus antartitik kawasan.',
        'Kembali ke titik jemput yang disepakati untuk mengambil koper dan menuju Stasiun Lijiang.',
      ],
      duration: 'Waktu perpindahan mengikuti rute dan antrean bus hari itu; sisihkan ruang dalam jadwal untuk perjalanan kembali ke kota.',
      sources: [jadeDragonNotice, jadeDragonGuide],
    },
    stopAccess: { 'blue-moon': 'Turun di halte 蓝月谷, lalu ikuti jalur resmi di tepi danau. Tanyakan halte pulang sebelum mulai berjalan.' },
    costs: [
      { label: 'Akses dalam kawasan Jade Dragon', amount: 'CNY 100 / orang untuk kawasan', detail: 'Gunakan tiket kawasan yang sama dari rangkaian Glacier Park dan Impression Lijiang hari ini; jangan menjumlahkan tiket masuk kedua untuk lembah.', status: 'published', source: jadeDragonNotice },
      { label: 'Shuttle kawasan', amount: 'CNY 20 / orang', detail: 'Komponen yang sama pada rangkaian Jade Dragon, bukan biaya shuttle baru untuk setiap pemberhentian. Periksa isi paket.', status: 'published', source: jadeDragonNotice },
      { label: 'Kendaraan listrik di lembah', amount: 'Opsional, cek tarif setempat', detail: 'Pengelola menyatakan kendaraan listrik Blue Moon Valley tidak wajib. Jalan kaki adalah pilihan jika kondisi tubuh dan jalur memungkinkan.', status: 'unconfirmed', source: jadeDragonNotice },
    ],
    visitDuration: 'Alokasi rencana 45 sampai 90 menit di tepi danau setelah pertunjukan; sesuaikan dengan waktu kembali ke stasiun.',
    bestTime: 'Sore 19 November setelah Impression Lijiang. Sisihkan waktu mengambil koper dan menuju kereta malam ke Dali.',
    tips: ['Foto dari jalur pejalan kaki; jangan turun ke air atau melintasi pembatas.', 'Tentukan titik kembali sebelum berjalan agar tidak perlu menelusuri seluruh lembah dua kali.', 'Jika rangkaian pagi terlambat, utamakan sesi Impression Lijiang dan pendekkan kunjungan danau agar transfer ke stasiun tetap cukup.'],
    cautions: ['Warna air dan jarak pandang dipengaruhi cuaca; foto galeri bukan janji kondisi pada hari kunjungan.', 'Tiket gondola tidak diperlukan untuk sekadar mengunjungi lembah, tetapi akses kawasan tetap mengikuti ketentuan masuk.'],
    sources: [
      { title: 'Pengelola Jade Dragon: biaya kawasan dan layanan pilihan', url: jadeDragonNotice, kind: 'official', publishedAt: '2026-05-12' },
      { title: 'Visit Yunnan: Blue Moon Valley dan jalur jalan kaki', url: jadeDragonGuide, kind: 'reference', publishedAt: '2026-04-08' },
    ],
    checkedAt: '2026-11-03',
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
        'Berjalan melalui kawasan kota tua menuju 五华楼, lalu lanjutkan ke Bo’ai Road untuk mencari makan halal.',
        'Setelah salat Jumat, sekitar 13.45, ambil koper dan naik taksi sekitar 17 km ke 大理站 di Xiaguan. Waktu sampai D8686 berangkat pukul 15.02 hanya sekitar 75 menit, kurang dari 90 menit yang disarankan PDF, jadi jangan mampir. Bila salat selesai terlambat, ubah tiket ke D8704 17.42.',
        'D8686 tiba di 昆明站 pukul 17.13, lalu lanjut ke Kunming South. Turun di 昆明站.',
      ],
      duration: 'Perjalanan dari Caicun bergantung titik turun. Dari selesai salat sekitar 13.45 sampai D8686 15.02 ada sekitar 75 menit, termasuk taksi ke stasiun; cadangannya D8704 17.42.',
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
    visitDuration: 'Alokasi rencana sekitar 2 jam, ±10.30–12.30, termasuk taksi dari Caicun dan makan siang; waktu salat Jumat dan transfer stasiun disisihkan terpisah.',
    bestTime: 'Siang 20 November. Foto gerbang Dali pada malam hari di galeri adalah referensi tempat, bukan jadwal kunjungan ini.',
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
        'Periksa apakah tiket berakhir di 昆明站 atau 昆明南站. Kirim nama stasiun yang benar saat mengatur taksi atau penjemputan hotel.',
        'Simpan koper di penginapan sekitar Shuncheng, lalu berjalan ke kawasan 顺城街 di sekitar Dunren Lane.',
        'Untuk Masjid Nancheng, gunakan pin 南城清真寺 di kawasan Zhengyi Road. Konfirmasikan akses dengan pengurus sebelum masuk.',
      ],
      duration: 'Waktu transfer bergantung stasiun kedatangan dan hotel; cek rute setelah tiket kereta ditetapkan.',
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
    visitDuration: 'Alokasi rencana 45 sampai 60 menit, hanya bila waktu penerbangan memungkinkan.',
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
