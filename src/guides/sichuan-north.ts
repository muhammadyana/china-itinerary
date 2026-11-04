import type { DestinationGuide } from '../guide-types.ts';

const jiuzhaiTickets = 'https://www.jiuzhai.com/intelligent-service/tickets';
const jiuzhaiArrival = 'https://www.jiuzhai.com/intelligent-service/arrival-mode';
const jiuzhaiNotice = 'https://www.jiuzhai.com/news/notice/11492-2026-10-31-09-08-46';
const jiuzhaiBus = 'https://en.jiuzhai.com/plan-your-trip/getting-around-the-park';
const bipenggouTickets = 'https://touch.piao.qunar.com/touch/detail.htm?id=13696';
const bipenggouHours = 'https://m.ly.com/trip/detail/5951976';
const bipenggouColour = 'https://cbgc.scol.com.cn/news/8072738';
const g213Closure = 'https://www.sohu.com/a/1091125891_121443915';
const lixiaoRoad = 'https://cbgc.scol.com.cn/news/8080079';
const lixiaoWinter = 'https://cbgc.scol.com.cn/news/6998156';
const maobiliangGuide = 'https://you.ctrip.com/sight/xiaojin3110/145018.html';
const maobiliangFees = 'https://travelnews.qunar.com/qa_strategy/aba-siguniangshan-travel-guide';
const danbaRoadworks = 'https://news.qq.com/rain/a/20251015A06A3C00';
const moshiGuide = 'https://www.etripchina.com/china-guide/ganzi-moshi-park.htm';
const moshiTickets = 'https://touch.piao.qunar.com/touch/detail.htm?id=2120079683';
const tagongTransport = 'https://www.etripchina.com/china-guide/kangding-tagong-grassland.htm';
const tagongFees = 'https://m.gosctour.com/line/show.html?id=240';

export const northernGuides: DestinationGuide[] = [
  {
    slug: 'jiuzhaigou', name: 'Jiuzhaigou', region: 'Sichuan', placeIds: ['five-flower', 'shuzheng'],
    summary: 'Danau bening Rize dan Shuzheng setelah perjalanan pagi dari Chengdu. Pilih pemberhentian sesuai waktu tiba dan pengaturan bus taman.',
    gettingThere: {
      origin: 'Hotel di pusat Chengdu pada Senin, 9 November',
      steps: [
        'Setelah bermalam di Chengdu, naik DiDi dari hotel sekitar 05.15 ke Chengdu East. Kereta C5746 06.14 atau C5782 06.45 ke Huanglongjiuzhai, tiba 07.53 atau 08.30. Pesan kursinya di Trip.com.',
        'Dari Huanglongjiuzhai, naik shuttle kawasan (景区直通车) sekitar 93 km, kira-kira 2 jam, ke gerbang Jiuzhaigou. Sepakati penitipan koper dengan hotel agar bisa langsung masuk sebelum batas 14.00.',
        'Masuk taman pada hari yang sama setelah tiba. Bus taman menghubungkan lembah; prioritaskan danau yang dapat dijangkau dalam sisa siang dan sore, lalu menginap satu malam di Goukou / Pengfeng.',
      ],
      duration: 'Kereta tercepat 1 jam 39 menit dari Chengdu East; lanjut sekitar 2 jam dari stasiun ke taman. Tambahkan perjalanan hotel ke stasiun, pemeriksaan, menunggu, dan urusan koper.',
      sources: [jiuzhaiArrival, jiuzhaiNotice, jiuzhaiBus],
    },
    stopAccess: {
      'five-flower': 'Di dalam taman, gunakan bus menuju lembah Rize dan turun pada pemberhentian Five Flower Lake / 五花海 yang dibuka. Lanjut berjalan di jalur kayu; kendaraan privat tidak menjadi transportasi antardanau.',
      shuzheng: 'Dari lembah Rize, ikuti bus taman kembali ke kawasan Nuorilang lalu menuju lembah Shuzheng. Turun sesuai arahan petugas dan ikuti jalur kayu di sisi danau sebelum naik bus kembali ke gerbang.',
    },
    costs: [
      { label: 'Tiket masuk taman dewasa', amount: 'CNY 190 / orang', detail: 'Tarif musim ramai berlaku 1 April sampai 15 November, termasuk kunjungan 9 November. Satu tiket taman mencakup Five Flower Lake dan Shuzheng.', status: 'published', source: jiuzhaiTickets },
      { label: 'Bus di dalam taman', amount: 'CNY 90 / orang', detail: 'Terpisah dari tiket masuk. Jumlah tiket masuk dan bus: CNY 280 per dewasa; tidak termasuk kereta atau shuttle stasiun.', status: 'published', source: jiuzhaiTickets },
      { label: 'Kereta dan shuttle stasiun', amount: 'Perlu konfirmasi', detail: 'Harga kereta bergantung pada layanan dan kelas. Shuttle kawasan (景区直通车) dari stasiun ke gerbang sekitar CNY 50 menurut sumber sekunder.', status: 'unconfirmed', source: jiuzhaiArrival },
    ],
    visitDuration: 'Sisa siang dan sore setelah kereta dan transfer; bukan kunjungan sehari penuh. Shuzheng disesuaikan dengan sisa waktu.',
    bestTime: 'Pilih sambungan pagi yang memungkinkan tiba sebelum 14.00. Pengumuman 31 Oktober 2026 menetapkan masuk 08.00–14.00 dan tutup 18.00; itu jam operasional, bukan janji waktu tiba.',
    tips: ['Pesan tanggal kunjungan terlebih dahulu dan bawa paspor asli yang sesuai reservasi.', 'Simpan peta taman di ponsel; kombinasikan bus dan jalan kaki agar tidak menghabiskan hari untuk berpindah lembah.', 'Siapkan bekal halal, air, dan baterai cadangan sebelum meninggalkan hotel.'],
    cautions: ['Jika sambungan tiba setelah batas masuk, kunjungan taman 9 November perlu ditinjau ulang. Jangan mengandalkan akses setelah 14.00.', 'Jalur yang dibuka dapat berubah karena cuaca. Ikuti pembatas taman dan jangan turun ke tepi air di luar jalur.', 'Tiket taman berbeda dari shuttle stasiun. Jangan menganggap bus CNY 90 sudah mencakup Huanglongjiuzhai ke hotel.'],
    sources: [
      { title: 'Jiuzhaigou: tarif dan reservasi resmi', url: jiuzhaiTickets, kind: 'official' },
      { title: 'Jiuzhaigou: kereta dan akses darat', url: jiuzhaiArrival, kind: 'official' },
      { title: 'Pengumuman pengelola, 31 Oktober 2026', url: jiuzhaiNotice, kind: 'official', publishedAt: '2026-10-31' },
      { title: 'Jiuzhaigou: bus dan jalur jalan kaki', url: jiuzhaiBus, kind: 'official', publishedAt: '2015-07-27' },
    ], checkedAt: '2026-11-03',
  },
  {
    slug: 'bipenggou', name: 'Bipenggou', region: 'Sichuan', placeIds: ['bipenggou'],
    summary: 'Lembah panjang di Lixian dengan hutan larch, Danau Panyang, dan puncak granit bersalju. Bus taman membawa kamu ke bagian atas lembah; satu pagi cukup untuk Shanghaizi dan danau sebelum melintas ke Siguniang.',
    gettingThere: {
      origin: 'Hotel di kota Lixian, 11 November',
      steps: ['Pada 10 November tanpa mobil: shuttle 06.20 dari gerbang Jiuzhaigou ke Huanglongjiuzhai, kereta C5784 ke Chengdu East, lalu bus 13.30 dari Chadianzi ke kota Lixian. G213 Songpan–Maoxian tertutup longsor sejak 16 September 2026, jadi rutenya memutar lewat Chengdu.', 'Pagi 11 November sekitar 07.30, check-out dan bawa koper. Mobil tumpangan dari terminal Lixian ke 毕棚沟游客中心, CNY 20–40 per orang, sekitar 30 menit. Tanyakan tempat titip koper di pusat pengunjung.', 'Tukar voucher kategori non-mainland (paspor luar daratan Tiongkok) di loket dengan paspor. Bus taman wajib.', 'Naik bus ke Shanghaizi / 上海子 (sekitar 3.560 m), lalu mobil listrik ke Danau Panyang / 磐羊湖 dan Teluk Bulan / 月亮湾. Mulai turun dari Shanghaizi paling lambat 12.15. Sewa mobil dengan sopir dimulai di gerbang; berangkat paling lambat 13.00 lewat 理小路 ke Rilong.'],
      duration: 'Pada 10 November, gerbang Jiuzhaigou pukul 06.20 sampai kota Lixian sekitar 16.30–17.00. Kota Lixian ke gerbang Bipenggou sekitar 30 menit. Di dalam taman, bus gerbang ke Shanghaizi sekitar 40–45 menit sekali jalan.',
      sources: [g213Closure, bipenggouHours],
    },
    stopAccess: { bipenggou: 'Masuk lewat pusat pengunjung di mulut lembah. Bus taman wajib sampai Shanghaizi, lalu mobil listrik dan jalur kayu ke Danau Panyang dan Teluk Bulan.' },
    costs: [
      { label: 'Tiket masuk dan bus taman', amount: 'CNY 140 / orang', detail: 'Kategori non-mainland di Qunar dan Ctrip, termasuk bus wajib; voucher ditukar di loket (需换票). Sumber lain memberi angka berbeda: CNY 70 + 70 (China for Travelers), CNY 70 + 60 (Tongcheng), dan CNY 80 + 60 (Xinxin, 2025).', status: 'published', source: bipenggouTickets },
      { label: 'Mobil listrik', amount: 'CNY 60 / orang pulang-pergi', detail: 'Harga CNY 60 mencakup dua segmen pulang-pergi: Shanghaizi–Danau Panyang dan Teluk Bulan–Yanziyan, CNY 20–30 per segmen. Untuk rute sampai Teluk Bulan, tanyakan segmen yang perlu dibeli. Paket tiket, bus, dan mobil listrik tercantum CNY 190.', status: 'published', source: bipenggouTickets },
      { label: 'Parkir mobil sewa', amount: 'Referensi CNY 20 / hari', detail: 'Tarif parkir pusat pengunjung menurut panduan Tongcheng Oktober 2026. Berlaku jika sopir sudah menunggu di gerbang selama kamu di taman; minta dimasukkan dalam harga all-in.', status: 'estimate', source: bipenggouHours },
    ],
    visitDuration: 'Saran alokasi: sekitar 3 jam di Shanghaizi, Danau Panyang, dan Teluk Bulan, ditambah sekitar 1,5 jam bus pulang-pergi. Rute lengkap sampai Yanziyan / 燕子岩窝 (3.837 m) butuh setengah sampai satu hari.',
    bestTime: 'Datang saat loket buka pukul 08.00–08.30. Penjualan tiket berhenti sekitar 15.00–15.30 dan sumber berbeda soal jam musim dingin. Warna gugur 10–11 November sudah di ujung musim; salju pertama bisa turun.',
    tips: ['Pesan tiket sebelum berangkat. Tanggal 11 November bertepatan dengan libur sekolah Aba dan Chengdu, dan tahun lalu tiket habis pada 13–14 November.', 'Minum obat antimabuk sebelum naik bus; jalannya berkelok lebih dari 20 km.', 'Ambil foto dalam perjalanan naik. Bus dan mobil listrik dilaporkan tidak berhenti dalam perjalanan turun.', 'Bawa bekal halal. Makanan di dalam taman terbatas, dan tidak ditemukan restoran halal di kota Lixian maupun dekat gerbang.'],
    cautions: ['Bus naik sekitar 1.300 m dalam satu pagi. Bergerak pelan di Danau Panyang (sekitar 3.680 m) dan turun bila pusing atau sesak napas.', 'Pada pagi hari di bulan November, jalur kayu dan jalan rawan lapisan es tipis.', '理小路 ke Rilong hanya dibuka siang hari dan bisa ditutup karena salju. Cek pukul 07.00; jika ditutup, lewati taman dan putar lewat Wolong.'],
    sources: [
      { title: 'Qunar: tiket non-mainland, bus, dan kereta listrik', url: bipenggouTickets, kind: 'operator' },
      { title: 'Tongcheng: jam buka, bus, dan parkir', url: bipenggouHours, kind: 'operator', publishedAt: '2026-10-27' },
      { title: 'Chuanguan: musim warna gugur Bipenggou dan 理小路', url: bipenggouColour, kind: 'reference', publishedAt: '2026-10-20' },
      { title: 'Jimu via Sohu: G213 Maoxian belum dibuka', url: g213Closure, kind: 'reference', publishedAt: '2026-10-22' },
      { title: 'Chuanguan: 理小路 hanya siang hari', url: lixiaoRoad, kind: 'reference', publishedAt: '2026-10-23' },
      { title: 'Chuanguan: kontrol musim dingin 理小路 2025', url: lixiaoWinter, kind: 'reference', publishedAt: '2025-11-24' },
    ], checkedAt: '2026-11-04',
  },
  {
    slug: 'siguniangshan', name: 'Siguniangshan', region: 'Sichuan', placeIds: ['maobiliang'],
    summary: 'Empat puncak bersalju dilihat dari Maobiliang, sebuah titik pandang di tepi jalan dekat kota Siguniangshan. Singgahnya singkat dan bergantung cuaca.',
    gettingThere: {
      origin: 'Bipenggou, 11 November',
      steps: ['Setelah Bipenggou, sopir melintasi 理小路 dan terowongan Qionglai menuju kota Siguniangshan / Rilong.', 'Jika langit cerah dan masih sebelum matahari terbenam, minta sopir mengantar pulang-pergi sebentar dari Rilong ke Maobiliang / 猫鼻梁.', 'Turun di area berhenti yang diizinkan, berjalan ke gardu pandang, lalu kembali ke penginapan Rilong.'],
      duration: 'Bipenggou ke Rilong lewat 理小路 sekitar 2–3 jam; waktu singgah bergantung cuaca dan sisa cahaya.',
      sources: [maobiliangGuide, lixiaoRoad],
    },
    stopAccess: { maobiliang: 'Akses dengan mobil sampai area gardu pandang Maobiliang di tepi jalan, lalu berjalan singkat. Ini titik pandang di luar lembah, tanpa tiket taman.' },
    costs: [
      { label: 'Titik pandang Maobiliang', amount: 'Referensi: gratis', detail: 'Panduan Qunar menyebut tanpa tiket masuk. Parkir atau layanan lokal, jika ada, tetap perlu dicek; ini bukan tiket masuk lembah Siguniangshan.', status: 'estimate', source: maobiliangFees },
      { label: 'Mobil dan parkir', amount: 'Perlu konfirmasi', detail: 'Masukkan singgah Maobiliang ke penawaran sopir untuk etape Bipenggou ke Rilong, termasuk waktu tunggu dan biaya parkir.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran alokasi: 20 sampai 40 menit, tanpa menunggu langit cerah terlalu lama.',
    bestTime: 'Sore sesuai itinerary, jika puncak terlihat dan sebelum matahari terbenam sekitar 18.14.',
    tips: ['Simpan nama 猫鼻梁 untuk ditunjukkan kepada sopir.', 'Gunakan lensa lebar untuk empat puncak, lalu coba pembesaran untuk detail salju.', 'Siapkan jaket di kabin agar tidak perlu membuka koper saat singgah.'],
    cautions: ['Titik ini berada di tepi jalan pegunungan. Foto dari area pandang, bukan badan jalan.', 'Jika perjalanan terlambat atau berkabut, prioritaskan tiba dan beristirahat di Rilong.'],
    sources: [
      { title: 'Trip.com: lokasi dan akses Maobiliang', url: maobiliangGuide, kind: 'operator' },
      { title: 'Qunar: referensi biaya Maobiliang', url: maobiliangFees, kind: 'reference', publishedAt: '2026-04-15' },
      { title: 'Chuanguan: 理小路 hanya siang hari', url: lixiaoRoad, kind: 'reference', publishedAt: '2026-10-23' },
    ], checkedAt: '2026-11-04',
  },
  {
    slug: 'moshi-park', name: 'Moshi Park', region: 'Sichuan', placeIds: ['moshi'],
    summary: 'Jalur di antara formasi batu kelabu menjadi jeda yang berbeda dalam perjalanan dari lembah Danba ke padang Tagong.',
    gettingThere: {
      origin: 'Danba, 12 November',
      steps: ['Lanjut dengan sopir ke arah Bamei dan pusat pengunjung Moshi Park / 墨石公园.', 'Gunakan shuttle taman menuju area kunjungan, lalu ikuti jalur pejalan kaki yang ditandai.', 'Bertemu sopir di pintu keluar untuk melanjutkan ke Tagong, Muya, dan penginapan Xinduqiao.'],
      duration: 'Bagian dari hari Rilong ke Xinduqiao, sekitar 10 jam termasuk singgah (berangkat 08.00, tiba sekitar 18.30); durasi per segmen perlu dikonfirmasi sopir.',
      sources: [moshiGuide],
    },
    stopAccess: { moshi: 'Turun di pusat pengunjung Moshi Park, lanjut dengan shuttle sesuai tiket, lalu berjalan di lintasan taman. Jangan memanjat formasi batu untuk mencari sudut foto.' },
    costs: [
      { label: 'Tiket masuk taman', amount: 'CNY 60 / orang', detail: 'Harga dewasa pada daftar tiket Qunar saat diperiksa. Pilih tanggal 12 November dan pastikan penerimaan paspor sebelum membayar; slot kunjungan belum dipesan.', status: 'published', source: moshiTickets },
      { label: 'Shuttle taman pulang-pergi', amount: 'CNY 20 / orang', detail: 'Qunar mencantumkan shuttle pulang-pergi CNY 20 serta paket masuk dan shuttle CNY 80. Periksa paket agar tiket tidak terbeli dua kali.', status: 'published', source: moshiTickets },
      { label: 'Mobil dan parkir', amount: 'Perlu konfirmasi', detail: 'Bagian dari penawaran sopir untuk etape Rilong ke Xinduqiao; biaya parkir perlu disebutkan secara terpisah jika belum termasuk.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran alokasi: sekitar 1,5–2 jam, termasuk berjalan dan berhenti untuk foto. Keluar paling lambat 16.00.',
    bestTime: 'Siang sesuai itinerary. Artikel operator Mei 2023 mencantumkan jam musim dingin 09.00 sampai 17.00 mulai 21 Oktober; jam 12 November 2026 tetap perlu dikonfirmasi.',
    tips: ['Pakai sepatu dengan sol yang mencengkeram dan bawa lapisan penahan angin.', 'Gunakan jalur taman; batu yang terlihat mudah dicapai belum tentu boleh dipanjat.', 'Sepakati batas waktu kunjungan agar Tagong dan Muya masih mendapat cahaya sore.'],
    cautions: ['Taman berada di dataran tinggi. Berjalan perlahan dan sediakan jeda istirahat.', 'Perbaikan G350 di Banshanmen dekat Danba: buka-tutup setiap 30 menit dan 4–6 penutupan penuh sekitar 1 jam per hari; sisakan cadangan waktu sebelum Moshi.', 'Harga yang ditampilkan adalah daftar Qunar; harga untuk tanggal kunjungan dan aturan tiket paspor perlu dicocokkan saat reservasi.'],
    sources: [
      { title: 'Qunar: daftar tiket dan shuttle Moshi Park', url: moshiTickets, kind: 'operator' },
      { title: 'ETripChina: akses dan jam kunjungan Moshi, 2023', url: moshiGuide, kind: 'operator', publishedAt: '2023-05-18' },
      { title: 'QQ News: perbaikan G350 di Banshanmen, Danba', url: danbaRoadworks, kind: 'reference' },
    ],
    checkedAt: '2026-11-04',
  },
  {
    slug: 'tagong', name: 'Padang rumput Tagong', region: 'Sichuan', placeIds: ['tagong'],
    summary: 'Padang terbuka dengan Gunung Yala di kejauhan. Pada November, bayangkan lanskap yang lebih kering dan keemasan daripada rumput hijau musim panas.',
    gettingThere: {
      origin: 'Moshi Park / Bamei, 12 November',
      steps: ['Lanjutkan perjalanan dengan sopir ke Tagong / 塔公草原 di koridor menuju Xinduqiao.', 'Sepakati titik turun di area padang atau gardu pandang yang dibuka, lalu berjalan singkat dari tempat parkir.', 'Setelah kunjungan, lanjut ke Biara Muya sebelum menuju hotel Xinduqiao. Hindari menambah pendakian panjang pada hari transfer ini.'],
      duration: 'Bagian dari hari Rilong ke Xinduqiao, sekitar 10 jam termasuk singgah (berangkat 08.00, tiba sekitar 18.30); durasi per segmen perlu dikonfirmasi sopir.',
      sources: [tagongTransport],
    },
    stopAccess: { tagong: 'Datang dengan mobil dari arah Bamei, turun di akses padang yang diizinkan, lalu berjalan di area pengunjung. Minta harga titik pandang atau area berpagar sebelum masuk.' },
    costs: [
      { label: 'Akses padang / biaya kebersihan', amount: 'Acuan CNY 35 / orang', detail: 'Biaya kebersihan pada paket Chengdu China Travel Service yang masih dapat dibuka. Halaman tidak bertanggal; ini acuan anggaran, bukan tarif terkonfirmasi untuk 12 November. Tanyakan area yang tercakup.', status: 'estimate', source: tagongFees },
      { label: 'Mobil, parkir, dan aktivitas tambahan', amount: 'Perlu konfirmasi', detail: 'Sepakati harga parkir atau berkuda sebelum menggunakan layanan. Tarif padang tidak mencakup tiket biara atau titik pandang lain.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran alokasi: sekitar 1,5 jam di cahaya sore sampai matahari terbenam (±18.20).',
    bestTime: 'Sore sesuai itinerary saat gunung tidak tertutup awan. Warna hijau dalam foto referensi tidak mewakili seluruh musim.',
    tips: ['Pilih satu titik pandang agar waktu tidak habis berpindah area berbayar.', 'Kenakan lapisan penahan angin; tempat terbuka terasa lebih dingin daripada di dalam mobil.', 'Biarkan hewan melintas dan jaga jarak; jangan mendekat hanya untuk foto.'],
    cautions: ['Padang terbuka, Muya Golden Pagoda, Biara Tagong, dan Biara Muya merupakan lokasi berbeda; sebutkan tujuan secara spesifik.', 'Jangan memasuki padang berpagar atau jalur kendaraan tanpa izin.'],
    sources: [
      { title: 'ETripChina: lokasi dan akses Tagong', url: tagongTransport, kind: 'operator', publishedAt: '2023-05-18' },
      { title: 'Chengdu China Travel Service: acuan biaya kebersihan Tagong', url: tagongFees, kind: 'operator' },
    ], checkedAt: '2026-11-03',
  },
];
