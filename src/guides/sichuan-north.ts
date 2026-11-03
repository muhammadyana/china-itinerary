import type { DestinationGuide } from '../guide-types.ts';

const jiuzhaiTickets = 'https://www.jiuzhai.com/intelligent-service/tickets';
const jiuzhaiArrival = 'https://www.jiuzhai.com/intelligent-service/arrival-mode';
const jiuzhaiNotice = 'https://www.jiuzhai.com/news/notice/11492-2026-10-31-09-08-46';
const jiuzhaiBus = 'https://en.jiuzhai.com/plan-your-trip/getting-around-the-park';
const shuangqiaoGuide = 'https://www.sgns.cn/understand/sqg';
const siguniangTickets = 'https://www.sgns.cn/info/notice/5748-2024-03-15-01-49-40';
const maobiliangGuide = 'https://you.ctrip.com/sight/xiaojin3110/145018.html';
const maobiliangFees = 'https://travelnews.qunar.com/qa_strategy/aba-siguniangshan-travel-guide';
const jiajuFees = 'https://www.danba.gov.cn/lyzx/article/234361';
const jiajuTickets = 'https://touch.piao.qunar.com/touch/detail.htm?id=190399';
const jiajuTransport = 'https://www.etripchina.com/china-guide/danba-jiaju-tibetan-village.htm';
const zhongluTransport = 'https://place.fliggy.com/poi/14963276';
const zhongluGuide = 'https://www.danba.gov.cn/lyzx/article/234330';
const moshiGuide = 'https://www.etripchina.com/china-guide/ganzi-moshi-park.htm';
const moshiTickets = 'https://touch.piao.qunar.com/touch/detail.htm?id=2120079683';
const tagongTransport = 'https://www.etripchina.com/china-guide/kangding-tagong-grassland.htm';
const tagongFees = 'https://m.gosctour.com/line/show.html?id=240';
const muyaMap = 'https://www.amap.com/place/B0FFI9ZHW0';
const muyaListing = 'https://piao.qunar.com/ticket/detail_517256.html';

export const northernGuides: DestinationGuide[] = [
  {
    slug: 'jiuzhaigou', name: 'Jiuzhaigou', region: 'Sichuan', placeIds: ['five-flower', 'shuzheng'],
    summary: 'Satu hari untuk danau bening Rize dan susunan danau Shuzheng. Naik bus taman untuk jarak jauh, lalu nikmati tepi air lewat jalur kayu.',
    gettingThere: {
      origin: 'Chengdu pada 8 November; hotel Goukou / Pengfeng pada 9 November',
      steps: [
        'Dari TFU, menuju Chengdu East dengan taksi atau DiDi sesuai rencana hari pertama. Pesan kereta ke Huanglongjiuzhai lewat 12306; cocokkan namanya dengan paspor.',
        'Dari Huanglongjiuzhai, lanjut sekitar 93 km dengan shuttle resmi atau jemputan hotel. Untuk kedatangan malam, pastikan jam jemput sebelum memesan kereta.',
        'Besok paginya, berangkat dari hotel ke gerbang Jiuzhaigou. Setelah pemeriksaan paspor, bus taman menghubungkan lembah; urutan perjalanan mengikuti pengaturan petugas.',
      ],
      duration: 'Kereta tercepat 1 jam 39 menit dari Chengdu East; lanjut sekitar 2 jam dari stasiun ke taman. Tambahkan waktu transfer TFU, pemeriksaan, dan menunggu.',
      sources: [jiuzhaiArrival, jiuzhaiBus],
    },
    stopAccess: {
      'five-flower': 'Di dalam taman, gunakan bus menuju lembah Rize dan turun pada pemberhentian Five Flower Lake / 五花海 yang dibuka. Lanjut berjalan di jalur kayu; kendaraan privat tidak menjadi transportasi antardanau.',
      shuzheng: 'Dari lembah Rize, ikuti bus taman kembali ke kawasan Nuorilang lalu menuju lembah Shuzheng. Turun sesuai arahan petugas dan ikuti jalur kayu di sisi danau sebelum naik bus kembali ke gerbang.',
    },
    costs: [
      { label: 'Tiket masuk taman dewasa', amount: 'CNY 190 / orang', detail: 'Tarif musim ramai berlaku 1 April sampai 15 November, termasuk kunjungan 9 November. Satu tiket taman mencakup Five Flower Lake dan Shuzheng.', status: 'published', source: jiuzhaiTickets },
      { label: 'Bus di dalam taman', amount: 'CNY 90 / orang', detail: 'Terpisah dari tiket masuk. Jumlah tiket masuk dan bus: CNY 280 per dewasa; tidak termasuk kereta atau jemputan stasiun.', status: 'published', source: jiuzhaiTickets },
      { label: 'Kereta dan jemputan', amount: 'Perlu konfirmasi', detail: 'Harga kereta bergantung pada layanan dan kelas. Minta penawaran jemputan malam per kendaraan, termasuk tol dan titik turun hotel.', status: 'unconfirmed', source: jiuzhaiArrival },
    ],
    visitDuration: 'Sehari penuh; rencana perjalanan sekitar 08.00 sampai 17.00.',
    bestTime: 'Masuk pagi. Pengumuman 31 Oktober 2026 menetapkan masuk 08.00 sampai 14.00 dan tutup 18.00; cek pengumuman baru sebelum berangkat.',
    tips: ['Pesan tanggal kunjungan terlebih dahulu dan bawa paspor asli yang sesuai reservasi.', 'Simpan peta taman di ponsel; kombinasikan bus dan jalan kaki agar tidak menghabiskan hari untuk berpindah lembah.', 'Siapkan bekal halal, air, dan baterai cadangan sebelum meninggalkan hotel.'],
    cautions: ['Jalur yang dibuka dapat berubah karena cuaca. Ikuti pembatas taman dan jangan turun ke tepi air di luar jalur.', 'Tiket taman berbeda dari shuttle stasiun. Jangan menganggap bus CNY 90 sudah mencakup Huanglongjiuzhai ke hotel.'],
    sources: [
      { title: 'Jiuzhaigou: tarif dan reservasi resmi', url: jiuzhaiTickets, kind: 'official' },
      { title: 'Jiuzhaigou: kereta dan akses darat', url: jiuzhaiArrival, kind: 'official' },
      { title: 'Pengumuman pengelola, 31 Oktober 2026', url: jiuzhaiNotice, kind: 'official', publishedAt: '2026-10-31' },
      { title: 'Jiuzhaigou: bus dan jalur jalan kaki', url: jiuzhaiBus, kind: 'official', publishedAt: '2015-07-27' },
    ], checkedAt: '2026-11-03',
  },
  {
    slug: 'siguniangshan', name: 'Siguniangshan', region: 'Sichuan', placeIds: ['maobiliang'],
    summary: 'Empat puncak bersalju dilihat dari Maobiliang, sebuah titik pandang di tepi jalan menuju kota Siguniangshan. Singgahnya singkat dan bergantung cuaca.',
    gettingThere: {
      origin: 'Hotel Jiuzhaigou, 10 November',
      steps: ['Berangkat pagi dengan mobil dan sopir menuju kota Siguniangshan / Rilong, sesuai etape darat dalam itinerary.', 'Minta sopir menambahkan Maobiliang / 猫鼻梁 sebagai titik berhenti jika jalan, cuaca, dan sisa waktu memungkinkan.', 'Turun di area berhenti yang diizinkan, berjalan ke gardu pandang, lalu lanjut ke penginapan Rilong.'],
      duration: 'Alokasi itinerary: 7 sampai 9 jam untuk Jiuzhaigou ke Rilong termasuk istirahat; waktu singgah bergantung rute sopir.',
      sources: [maobiliangGuide],
    },
    stopAccess: { maobiliang: 'Akses dengan mobil sampai area gardu pandang Maobiliang di tepi jalan, lalu berjalan singkat. Ini titik pandang luar lembah, terpisah dari pintu masuk Shuangqiao.' },
    costs: [
      { label: 'Titik pandang Maobiliang', amount: 'Referensi: gratis', detail: 'Panduan Qunar menyebut tanpa tiket masuk. Parkir atau layanan lokal, jika ada, tetap perlu dicek; ini bukan tiket masuk lembah Siguniangshan.', status: 'estimate', source: maobiliangFees },
      { label: 'Mobil dan parkir', amount: 'Perlu konfirmasi', detail: 'Masukkan singgah Maobiliang ke penawaran sopir untuk etape Jiuzhaigou ke Rilong, termasuk waktu tunggu dan biaya parkir.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran alokasi: 20 sampai 40 menit, tanpa menunggu langit cerah terlalu lama.',
    bestTime: 'Sore sesuai itinerary, jika puncak terlihat. Cahaya pagi juga menarik, tetapi tidak perlu mengubah jadwal transfer panjang demi foto.',
    tips: ['Simpan nama 猫鼻梁 untuk ditunjukkan kepada sopir.', 'Gunakan lensa lebar untuk empat puncak, lalu coba pembesaran untuk detail salju.', 'Siapkan jaket di kabin agar tidak perlu membuka koper saat singgah.'],
    cautions: ['Titik ini berada di tepi jalan pegunungan. Foto dari area pandang, bukan badan jalan.', 'Jika perjalanan terlambat atau berkabut, prioritaskan tiba dan beristirahat di Rilong.'],
    sources: [
      { title: 'Trip.com: lokasi dan akses Maobiliang', url: maobiliangGuide, kind: 'operator' },
      { title: 'Qunar: referensi biaya Maobiliang', url: maobiliangFees, kind: 'reference', publishedAt: '2026-04-15' },
    ], checkedAt: '2026-11-03',
  },
  {
    slug: 'shuangqiao', name: 'Shuangqiao Valley', region: 'Sichuan', placeIds: ['shuangqiao', 'hongshan'],
    summary: 'Shuttle membawa kamu ke bagian atas lembah. Perjalanan turun memberi ruang untuk berhenti di hutan Hongshan dan jalur kayu di bawah puncak bersalju.',
    gettingThere: {
      origin: 'Penginapan Rilong, 11 November',
      steps: ['Minta sopir mengantar ke pusat pengunjung Shuangqiao / 双桥沟. Pengelola mencantumkan akses dari kota dengan jarak sekitar 8 km.', 'Setelah pemeriksaan tiket, naik shuttle taman ke Hongshan / 红杉林, pemberhentian di ujung lembah.', 'Kembali secara bertahap dengan shuttle, turun hanya pada pemberhentian yang dibuka. Sepakati jam bertemu sopir untuk melanjutkan perjalanan ke Jiaju dan Danba.'],
      duration: 'Akses lokal sekitar 8 km dari kota; waktu perjalanan tergantung hotel dan antrean. Itinerary mengalokasikan pagi di taman, lalu sekitar 3 jam berkendara ke Danba.',
      sources: [shuangqiaoGuide],
    },
    stopAccess: {
      shuangqiao: 'Masuk melalui pusat pengunjung Shuangqiao, lalu gunakan shuttle taman untuk menghubungkan pemberhentian. Pilih jalur kayu yang dibuka untuk berjalan di antara titik pandang.',
      hongshan: 'Naik shuttle taman sampai pemberhentian terakhir Hongshan / 红杉林. Ikuti jalur pengunjung di kawasan hutan, lalu naik shuttle kembali turun; tidak perlu membeli tiket taman kedua.',
    },
    costs: [
      { label: 'Tiket masuk Shuangqiao', amount: 'CNY 80 / orang', detail: 'Tarif dewasa pada panduan pengelola dan pengumuman 5 Maret 2024, termasuk kawasan Hongshan. Halaman masih mencantumkan CNY 80; cocokkan tanggal 11 November 2026 saat reservasi.', status: 'published', source: siguniangTickets },
      { label: 'Shuttle taman', amount: 'CNY 70 / orang', detail: 'Jumlah tiket masuk dan shuttle: CNY 150 per dewasa. Transportasi dari hotel dan kegiatan tambahan tidak termasuk.', status: 'published', source: siguniangTickets },
      { label: 'Transfer hotel dan perjalanan Danba', amount: 'Perlu konfirmasi', detail: 'Bagian dari perjalanan dengan sopir. Sepakati jam jemput di pintu keluar sebelum masuk taman.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran alokasi: 3 sampai 4 jam untuk versi singkat itinerary. Pengelola merekomendasikan sehari untuk kunjungan lebih lengkap.',
    bestTime: 'Mulai pagi agar masih cukup waktu menuju Danba. Halaman pengelola mencantumkan penerimaan musim ramai 08.00 sampai 15.00; periksa slot tiket terbaru.',
    tips: ['Naik sampai ujung lembah dahulu, lalu nikmati pemberhentian dalam perjalanan turun.', 'Bawa kacamata hitam, jaket, dan sepatu dengan sol yang tidak licin.', 'Simpan waktu penjemputan sopir; jangan memaksakan seluruh pemberhentian sebelum perjalanan ke Danba.'],
    cautions: ['Hongshan berada sekitar 3.840 m menurut pengelola. Bergerak perlahan dan hentikan aktivitas bila merasa tidak sehat.', 'Hongshan pada panduan ini adalah kawasan hutan. Lokasi “Hongshan Waterfall” dalam PDF belum terkonfirmasi.'],
    sources: [
      { title: 'Pengelola Siguniangshan: panduan Shuangqiao', url: shuangqiaoGuide, kind: 'official', note: 'Isi panduan ditemukan dalam indeks pencarian; halaman langsung gagal dimuat saat pemeriksaan. Tarif dicocokkan dengan pengumuman resmi di bawah.' },
      { title: 'Pengelola Siguniangshan: tiket dan pengingat kunjungan', url: siguniangTickets, kind: 'official', publishedAt: '2024-03-05' },
    ], checkedAt: '2026-11-03',
  },
  {
    slug: 'jiaju', name: 'Jiaju Tibetan Village', region: 'Sichuan', placeIds: ['jiaju'],
    summary: 'Rumah Tibet merah-putih mengikuti lereng Danba. Pilih satu atau dua titik pandang, lalu berjalan pelan di antara rumah yang masih dihuni.',
    gettingThere: {
      origin: 'Shuangqiao Valley, 11 November',
      steps: ['Setelah keluar Shuangqiao, lanjut dengan mobil melalui kawasan Xiaojin menuju Danba sesuai itinerary.', 'Dari area Danba, arahkan sopir ke pusat pengunjung Jiaju / 甲居藏寨, sekitar 8 km dari kota menurut operator.', 'Konfirmasikan penggunaan shuttle atau izin kendaraan saat tiba. Akhiri kunjungan dengan jemputan yang sudah disepakati untuk kembali ke hotel Danba.'],
      duration: 'Alokasi itinerary: sekitar 3 jam dari Shuangqiao ke Danba, belum termasuk kunjungan Jiaju.',
      sources: [jiajuTransport],
    },
    stopAccess: { jiaju: 'Dari Danba, naik mobil ke pintu masuk Jiaju. Gunakan shuttle jika diwajibkan pada hari kunjungan; antar titik pandang dan rumah dilanjutkan berjalan kaki.' },
    costs: [
      { label: 'Tiket masuk desa', amount: 'CNY 50 / orang', detail: 'Harga dewasa pada daftar tiket Qunar saat diperiksa. Belum merupakan penawaran tanggal 11 November; cocokkan tanggal, penerimaan paspor, dan layanan yang termasuk sebelum membayar.', status: 'published', source: jiajuTickets },
      { label: 'Shuttle desa pulang-pergi', amount: 'Referensi CNY 35 / orang', detail: 'Publikasi pemerintah tahun 2022. Tanyakan apakah shuttle wajib dan apakah mobil sopir boleh masuk; jangan menghitung transportasi dua kali.', status: 'estimate', source: jiajuFees },
      { label: 'Mobil, parkir, dan waktu tunggu', amount: 'Perlu konfirmasi', detail: 'Minta dimasukkan dalam penawaran sopir hari Shuangqiao ke Danba.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran alokasi: 1 sampai 2 jam untuk singgah sore; sekitar 3 jam bila ingin berjalan lebih lama.',
    bestTime: 'Sore sesuai itinerary, dengan batas waktu kembali sebelum berkendara malam. Warna daun bergantung kondisi tahun kunjungan.',
    tips: ['Pilih titik pandang sebelum berjalan agar waktu sore tidak habis berpindah kendaraan.', 'Minta izin sebelum memotret warga atau masuk halaman rumah.', 'Siapkan alas kaki yang nyaman untuk jalur menanjak dan bertangga.'],
    cautions: ['Desa masih dihuni; rumah dan ladang bukan area bebas masuk.', 'Tarif shuttle yang ditemukan berasal dari publikasi lama, bukan penawaran yang sudah dipesan.'],
    sources: [
      { title: 'Qunar: daftar tiket Jiaju', url: jiajuTickets, kind: 'operator' },
      { title: 'Pemerintah Danba: referensi tarif Jiaju, 2022', url: jiajuFees, kind: 'official', publishedAt: '2022-05-18' },
      { title: 'ETripChina: akses dan kunjungan Jiaju', url: jiajuTransport, kind: 'operator', publishedAt: '2023-05-17' },
    ], checkedAt: '2026-11-03',
  },
  {
    slug: 'zhonglu', name: 'Zhonglu Tibetan Village', region: 'Sichuan', placeIds: ['zhonglu'],
    summary: 'Rumah batu, menara pengawas, dan ladang memberi alasan untuk berhenti lebih pelan sebelum melanjutkan perjalanan ke Bamei.',
    gettingThere: {
      origin: 'Hotel Danba, 12 November',
      steps: ['Berangkat dengan sopir dari hotel menuju Zhonglu / 中路藏寨. Sepakati titik turun sesuai rumah atau gardu pandang yang ingin dikunjungi.', 'Fliggy menyarankan akses mobil dari Danba, kemudian berjalan mengunjungi desa dari area kantor pemerintahan Zhonglu.', 'Kembali ke mobil di titik yang disepakati sebelum melanjutkan ke Bamei dan Moshi Park.'],
      duration: 'Waktu transfer lokal perlu dikonfirmasi dengan sopir; itinerary mengalokasikan sekitar 5 jam berkendara untuk seluruh hari Danba ke Xinduqiao.',
      sources: [zhongluTransport],
    },
    stopAccess: { zhonglu: 'Gunakan mobil dari Danba ke Zhonglu, lalu berjalan di jalur desa. Sepakati titik pandang dengan sopir terlebih dahulu karena rumah dan menara tersebar di lereng.' },
    costs: [
      { label: 'Akses desa dan titik pandang', amount: 'Perlu konfirmasi', detail: 'Belum ditemukan daftar tarif resmi yang berlaku untuk November 2026. Jangan menganggap akses rumah, menara, atau parkir otomatis gratis.', status: 'unconfirmed' },
      { label: 'Mobil dan parkir', amount: 'Perlu konfirmasi', detail: 'Gabungkan dengan perjalanan Danba ke Bamei. Tanyakan biaya tambahan jika mengunjungi gardu pandang di luar rute mobil.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran alokasi: 1 sampai 2 jam pada pagi hari.',
    bestTime: 'Pagi sesuai itinerary, sebelum perjalanan panjang ke Moshi dan Tagong. Kabut atau cahaya yang berubah bisa menutupi menara dari kejauhan.',
    tips: ['Simpan nama 中路藏寨 dan titik jemput agar mudah ditemukan setelah berjalan.', 'Minta izin sebelum masuk rumah, halaman, atau menara milik warga.', 'Siapkan bekal sejak Danba supaya tidak bergantung pada jam buka kedai desa.'],
    cautions: ['Jalur desa menanjak dan sebagian tangga tidak rata; pilih lintasan sesuai kondisi fisik.', 'Foto Jikayi dalam galeri menunjukkan kawasan Zhonglu, bukan jaminan sudut yang sama dari setiap gardu pandang.'],
    sources: [
      { title: 'Fliggy: akses mobil dan jalan kaki ke Zhonglu', url: zhongluTransport, kind: 'operator' },
      { title: 'Pemerintah Danba: lokasi dan karakter Zhonglu', url: zhongluGuide, kind: 'official', publishedAt: '2022-06-15' },
    ], checkedAt: '2026-11-03',
  },
  {
    slug: 'moshi-park', name: 'Moshi Park', region: 'Sichuan', placeIds: ['moshi'],
    summary: 'Jalur di antara formasi batu kelabu menjadi jeda yang berbeda dalam perjalanan dari desa Danba ke padang Tagong.',
    gettingThere: {
      origin: 'Zhonglu / Danba, 12 November',
      steps: ['Lanjut dengan sopir ke arah Bamei dan pusat pengunjung Moshi Park / 墨石公园.', 'Gunakan shuttle taman menuju area kunjungan, lalu ikuti jalur pejalan kaki yang ditandai.', 'Bertemu sopir di pintu keluar untuk melanjutkan ke Tagong, Muya, dan penginapan Xinduqiao.'],
      duration: 'Bagian dari alokasi itinerary sekitar 5 jam berkendara untuk seluruh hari Danba ke Xinduqiao; durasi per segmen perlu dikonfirmasi sopir.',
      sources: [moshiGuide],
    },
    stopAccess: { moshi: 'Turun di pusat pengunjung Moshi Park, lanjut dengan shuttle sesuai tiket, lalu berjalan di lintasan taman. Jangan memanjat formasi batu untuk mencari sudut foto.' },
    costs: [
      { label: 'Tiket masuk taman', amount: 'CNY 60 / orang', detail: 'Harga dewasa pada daftar tiket Qunar saat diperiksa. Pilih tanggal 12 November dan pastikan penerimaan paspor sebelum membayar; slot kunjungan belum dipesan.', status: 'published', source: moshiTickets },
      { label: 'Shuttle taman pulang-pergi', amount: 'CNY 20 / orang', detail: 'Qunar mencantumkan shuttle pulang-pergi CNY 20 serta paket masuk dan shuttle CNY 80. Periksa paket agar tiket tidak terbeli dua kali.', status: 'published', source: moshiTickets },
      { label: 'Mobil dan parkir', amount: 'Perlu konfirmasi', detail: 'Bagian dari penawaran sopir untuk etape Danba ke Xinduqiao; biaya parkir perlu disebutkan secara terpisah jika belum termasuk.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran alokasi: sekitar 2 jam, termasuk berjalan dan berhenti untuk foto.',
    bestTime: 'Siang sesuai itinerary. Artikel operator Mei 2023 mencantumkan jam musim dingin 09.00 sampai 17.00 mulai 21 Oktober; jam 12 November 2026 tetap perlu dikonfirmasi.',
    tips: ['Pakai sepatu dengan sol yang mencengkeram dan bawa lapisan penahan angin.', 'Gunakan jalur taman; batu yang terlihat mudah dicapai belum tentu boleh dipanjat.', 'Sepakati batas waktu kunjungan agar Tagong dan Muya masih mendapat cahaya sore.'],
    cautions: ['Taman berada di dataran tinggi. Berjalan perlahan dan sediakan jeda istirahat.', 'Harga yang ditampilkan adalah daftar Qunar; harga untuk tanggal kunjungan dan aturan tiket paspor perlu dicocokkan saat reservasi.'],
    sources: [
      { title: 'Qunar: daftar tiket dan shuttle Moshi Park', url: moshiTickets, kind: 'operator' },
      { title: 'ETripChina: akses dan jam kunjungan Moshi, 2023', url: moshiGuide, kind: 'operator', publishedAt: '2023-05-18' },
    ],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'tagong', name: 'Padang rumput Tagong', region: 'Sichuan', placeIds: ['tagong'],
    summary: 'Padang terbuka dengan Gunung Yala di kejauhan. Pada November, bayangkan lanskap yang lebih kering dan keemasan daripada rumput hijau musim panas.',
    gettingThere: {
      origin: 'Moshi Park / Bamei, 12 November',
      steps: ['Lanjutkan perjalanan dengan sopir ke Tagong / 塔公草原 di koridor menuju Xinduqiao.', 'Sepakati titik turun di area padang atau gardu pandang yang dibuka, lalu berjalan singkat dari tempat parkir.', 'Setelah kunjungan, lanjut ke Biara Muya sebelum menuju hotel Xinduqiao. Hindari menambah pendakian panjang pada hari transfer ini.'],
      duration: 'Durasi tiap segmen dikonfirmasi sopir; seluruh hari Danba ke Xinduqiao dialokasikan sekitar 5 jam berkendara dalam itinerary.',
      sources: [tagongTransport],
    },
    stopAccess: { tagong: 'Datang dengan mobil dari arah Bamei, turun di akses padang yang diizinkan, lalu berjalan di area pengunjung. Minta harga titik pandang atau area berpagar sebelum masuk.' },
    costs: [
      { label: 'Akses padang / biaya kebersihan', amount: 'Acuan CNY 35 / orang', detail: 'Biaya kebersihan pada paket Chengdu China Travel Service yang masih dapat dibuka. Halaman tidak bertanggal; ini acuan anggaran, bukan tarif terkonfirmasi untuk 12 November. Tanyakan area yang tercakup.', status: 'estimate', source: tagongFees },
      { label: 'Mobil, parkir, dan aktivitas tambahan', amount: 'Perlu konfirmasi', detail: 'Sepakati harga parkir atau berkuda sebelum menggunakan layanan. Tarif padang tidak mencakup tiket biara atau titik pandang lain.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran alokasi: 45 sampai 90 menit untuk berjalan singkat dan foto.',
    bestTime: 'Sore sesuai itinerary saat gunung tidak tertutup awan. Warna hijau dalam foto referensi tidak mewakili seluruh musim.',
    tips: ['Pilih satu titik pandang agar waktu tidak habis berpindah area berbayar.', 'Kenakan lapisan penahan angin; tempat terbuka terasa lebih dingin daripada di dalam mobil.', 'Biarkan hewan melintas dan jaga jarak; jangan mendekat hanya untuk foto.'],
    cautions: ['Padang terbuka, Muya Golden Pagoda, Biara Tagong, dan Biara Muya merupakan lokasi berbeda; sebutkan tujuan secara spesifik.', 'Jangan memasuki padang berpagar atau jalur kendaraan tanpa izin.'],
    sources: [
      { title: 'ETripChina: lokasi dan akses Tagong', url: tagongTransport, kind: 'operator', publishedAt: '2023-05-18' },
      { title: 'Chengdu China Travel Service: acuan biaya kebersihan Tagong', url: tagongFees, kind: 'operator' },
    ], checkedAt: '2026-11-03',
  },
  {
    slug: 'muya-monastery', name: 'Biara Muya', region: 'Sichuan', placeIds: ['muya'],
    summary: 'Kunjungan singkat ke kompleks biara di kawasan Tagong. Sisakan ruang untuk kegiatan ibadah dan ikuti petunjuk petugas sebelum masuk bangunan.',
    gettingThere: {
      origin: 'Padang Tagong, 12 November',
      steps: ['Tunjukkan pin 木雅大寺 di Amap kepada sopir. Pastikan tujuannya biara ini, bukan Muya Golden Pagoda atau kawasan wisata Muya Shengdi.', 'Sopir mengantar dari kawasan Tagong ke akses biara. Konfirmasikan kondisi jalan terakhir dan tempat parkir pada hari kunjungan.', 'Lanjut berjalan hanya di area pengunjung yang dibuka, lalu kembali ke mobil untuk menuju Xinduqiao.'],
      duration: 'Waktu transfer lokal perlu dikonfirmasi berdasarkan titik awal di Tagong; sisakan kunjungan singkat sebelum perjalanan ke Xinduqiao.',
      sources: [muyaMap],
    },
    stopAccess: { muya: 'Gunakan pin Amap 木雅大寺, lalu datang dengan sopir dari Tagong. Setelah parkir, tanyakan bangunan dan jalur mana yang terbuka untuk pengunjung.' },
    costs: [
      { label: 'Akses biara / biaya kebersihan', amount: 'Perlu konfirmasi', detail: 'Halaman tiket Qunar tidak menampilkan penawaran harga. Konfirmasikan biaya di pintu masuk; jangan menganggap gratis atau memakai harga biara lain.', status: 'unconfirmed', source: muyaListing },
      { label: 'Mobil dan parkir', amount: 'Perlu konfirmasi', detail: 'Masukkan kunjungan Muya ke rute sopir Danba ke Xinduqiao. Tanyakan biaya parkir dan waktu tunggu sebelum turun.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran alokasi: 45 sampai 60 menit untuk area yang dibuka.',
    bestTime: 'Sore sesuai itinerary, sebelum terlalu gelap untuk perjalanan ke hotel. Jam akses bangunan perlu dikonfirmasi langsung.',
    tips: ['Simpan nama 木雅大寺 dan pin lokasi sebelum meninggalkan Tagong.', 'Minta izin sebelum memotret orang, upacara, atau bagian dalam bangunan.', 'Berbicara pelan dan ikuti arah berjalan yang ditunjukkan pengelola.'],
    cautions: ['Biara adalah tempat ibadah aktif; sebagian area dapat dibatasi meski halaman luar terbuka.', 'Jangan menyamakan Biara Muya dengan Muya Golden Pagoda yang berada di kawasan Tagong.'],
    sources: [
      { title: 'Amap: pin Biara Muya / 木雅大寺', url: muyaMap, kind: 'operator' },
      { title: 'Qunar: daftar Biara Muya, harga belum tersedia', url: muyaListing, kind: 'operator' },
    ], checkedAt: '2026-11-03',
  },
];
