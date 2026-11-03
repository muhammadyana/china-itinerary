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
    summary: 'Jalan berbatu, rumah kayu, dan roda doa emas menjadi sambutan pertama di Shangri-La.',
    gettingThere: {
      origin: 'Riwa, Sichuan, pada 17 November',
      steps: [
        'Lanjutkan mobil sewaan melalui Xiangcheng menuju kota Shangri-La di Yunnan. Sepakati titik turun dekat hotel Dukezong dengan sopir.',
        'Simpan koper dan jelajahi kota tua dengan berjalan kaki. Gunakan pin 独克宗古城, bukan Shangri-La Town di Sichuan.',
        'Jika tiba sebelum gelap dan masih bertenaga, lanjutkan ke Bukit Guishan di dalam kawasan kota tua.',
      ],
      duration: 'Sekitar 8 jam berkendara dari Riwa menurut rencana PDF, belum termasuk berhenti; kondisi lintasan dapat mengubahnya.',
      sources: [dukezongTickets, guishanTickets],
    },
    stopAccess: {
      dukezong: 'Dari titik turun mobil di tepi Dukezong, berjalan menuju penginapan dan gang kota tua.',
      guishan: 'Dari Dukezong, berjalan ke 龟山公园 dan ikuti tangga menuju roda doa. Pilihan ini hanya jika tiba cukup awal.',
    },
    costs: [
      { label: 'Kawasan Kota Tua Dukezong', amount: 'Gratis', detail: 'Qunar mencantumkan akses kota tua gratis. Belanja, pertunjukan, dan layanan berbayar terpisah.', status: 'published', source: dukezongTickets },
      { label: 'Bukit Guishan', amount: 'Referensi: gratis', detail: 'Qunar menyebut taman tanpa tiket masuk. Akses bangunan, kegiatan, dan jam masuk dapat berbeda; periksa papan di lokasi sebelum menaiki tangga.', status: 'estimate', source: guishanTickets },
      { label: 'Mobil Riwa ke Shangri-La', amount: 'Perlu konfirmasi', detail: 'Minta harga satu arah, biaya lintas provinsi, serta titik drop-off tertulis dalam kesepakatan sopir.', status: 'unconfirmed' },
    ],
    visitDuration: 'Alokasi rencana 1 sampai 2 jam setelah check-in; Guishan bersifat opsional.',
    bestTime: 'Sore 17 November jika perjalanan lancar; kota tua tetap menjadi pilihan jalan santai malam.',
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
      { label: 'Tiket penuh kawasan', amount: 'Referensi CNY 90 / orang', detail: 'Halaman operator masih mencantumkan 90. Pengumuman shuttle yang lebih baru terbit 27 Agustus 2026, tetapi rincian tarif lampirannya belum dapat diverifikasi. Konfirmasikan total dan isi paket untuk 18 November.', status: 'estimate', source: songzanlinTickets },
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
    tips: ['Minta hotel menandai titik penjemputan untuk Jade Dragon besok pagi.', 'Pakai sepatu yang nyaman di batu licin dan simpan pin hotel sebelum menjelajah gang.', 'Untuk makan halal, cari tanda 清真 dan konfirmasikan bahan sebelum memesan.'],
    cautions: ['Biaya pemeliharaan kota tua berbeda dari tiket objek berbayar di dalamnya.', 'Jangan membeli paket Jade Dragon dari calo hanya karena menawarkan jaminan slot.'],
    sources: [
      { title: 'Ketentuan pemeliharaan Lijiang 2025, teks pemerintah dimuat ulang', url: lijiangFee, kind: 'reference', publishedAt: '2025-07-17' },
      { title: 'Qunar: akses stasiun dan rute Dayan', url: 'https://travelnews.qunar.com/qa_strategy/lijiang-ancient-town-one-day-essential-route-guide', kind: 'reference', publishedAt: '2026-06-22' },
    ],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'jade-dragon', name: 'Jade Dragon & Glacier Park', region: 'Yunnan', placeIds: ['jade-dragon', 'cable-car'],
    summary: 'Naik gondola ke Glacier Park, lalu turun ke Blue Moon Valley sebelum kereta malam ke Dali.',
    gettingThere: {
      origin: 'Hotel sekitar Dayan, Lijiang, pada 19 November',
      steps: [
        'Pesan mobil ke pusat pengunjung Jade Dragon untuk slot gondola pagi. Pengelola menyebut perjalanan dari kota sekitar 80 menit; tambahkan waktu antre.',
        'Alternatif terbaru: dari pusat pengunjung baru Baisha, ada kereta wisata ke kawasan. Promo mulai 3 November 2026 menggabungkan tiket masuk dan kereta; cek sambungan ke shuttle dan slot gondola sebelum mengganti rencana mobil.',
        'Validasi tiket kawasan dan reservasi 冰川公园索道, lalu ikuti shuttle menuju stasiun bawah Big Cable Car.',
        'Gondola membawa kamu ke area sekitar 4.506 m. Setelah turun, lanjutkan bus kawasan ke Blue Moon Valley.',
      ],
      duration: 'Sekitar 80 menit berkendara dari kota menurut pengumuman pengelola; antrean shuttle dan gondola di luar waktu itu.',
      sources: [jadeDragonNotice, jadeDragonGuide, jadeDragonTrain],
    },
    stopAccess: {
      'cable-car': 'Dari pusat layanan kawasan, ikuti shuttle bertanda 冰川公园索道 menuju stasiun bawah. Tiba sesuai slot pada tiket.',
      'jade-dragon': 'Naik Big Cable Car ke stasiun atas, lalu ikuti jalur resmi Glacier Park sejauh kondisi tubuh dan pembukaan jalur mengizinkan.',
    },
    costs: [
      { label: 'Tiket masuk kawasan Jade Dragon', amount: 'CNY 100 / orang', detail: 'Tarif pengumuman pengelola Mei 2026. Akses kawasan sama dengan kunjungan Blue Moon Valley dalam rangkaian hari ini.', status: 'published', source: jadeDragonNotice },
      { label: 'Shuttle antartitik di kawasan', amount: 'CNY 20 / orang', detail: 'Cek apakah sudah termasuk paket gondola. Jangan menambahkan biaya shuttle dua kali.', status: 'published', source: jadeDragonNotice },
      { label: 'Big Cable Car pulang-pergi', amount: 'Acuan CNY 120 / orang', detail: 'Acuan panduan April 2026, di luar masuk kawasan dan shuttle. Konfirmasikan total paket serta slot 19 November di kanal resmi sebelum membayar.', status: 'estimate', source: jadeDragonGuide },
      { label: 'Alternatif tiket kawasan + kereta wisata', amount: 'CNY 120 satu arah / CNY 130 pulang-pergi', detail: 'Promo operator 3 November 2026 sampai 5 Februari 2027, dilaporkan 2 November. Ini pilihan pengganti tiket masuk 100 beserta transportasi kereta dari Baisha, bukan biaya tambahan wajib. Gondola dan shuttle internal harus diperiksa terpisah.', status: 'published', source: jadeDragonTrain },
      { label: 'Mobil dari Lijiang dan pengantaran ke stasiun', amount: 'Perlu konfirmasi', detail: 'Minta harga yang menyebut waktu menunggu, pengambilan bagasi, dan tujuan akhir Stasiun Lijiang.', status: 'unconfirmed' },
    ],
    visitDuration: 'Alokasi rencana 3 sampai 4 jam untuk akses dan Glacier Park, belum termasuk Blue Moon Valley.',
    bestTime: 'Slot pagi 19 November agar masih ada waktu turun ke lembah dan mengambil bagasi.',
    tips: ['Gunakan kanal resmi 丽江旅游集团 untuk memeriksa slot gondola; nama pada pesanan harus sesuai paspor.', 'Bawa jaket hangat, sarung tangan, kacamata matahari, dan bekal halal.', 'Sepakati batas waktu keluar kawasan berdasarkan keberangkatan kereta ke Dali.'],
    cautions: ['Pengumuman 9 Oktober 2026 menjadwalkan Glacier Park kembali beroperasi 31 Oktober setelah perawatan. Itu bukan jaminan layanan 19 November; cek pemberitahuan terbaru dan slot saat memesan.', 'Angin atau cuaca buruk dapat menghentikan gondola. Blue Moon Valley menjadi pilihan hanya bila akses kawasan tetap dibuka.', 'Area atas berada di ketinggian tinggi. Bila tidak nyaman, hentikan pendakian dan minta bantuan petugas; tidak perlu memaksakan titik tertinggi.'],
    sources: [
      { title: 'Pengelola Jade Dragon: tiket dan transportasi', url: jadeDragonNotice, kind: 'official', publishedAt: '2026-05-12' },
      { title: 'Pengumuman operator: perawatan gondola Oktober 2026, dimuat ulang', url: jadeDragonMaintenance, kind: 'reference', publishedAt: '2026-10-10' },
      { title: 'Lijiang Media: promo kereta wisata, wawancara operator', url: jadeDragonTrain, kind: 'reference', publishedAt: '2026-11-02', note: 'Promo diberitakan lewat wawancara petugas operator. Pastikan isi paket dan ketersediaan tanggal kunjungan di kanal pembelian.' },
      { title: 'Visit Yunnan: acuan gondola dan akses Glacier Park', url: jadeDragonGuide, kind: 'reference', publishedAt: '2026-04-08' },
    ],
    checkedAt: '2026-11-03',
  },
  {
    slug: 'blue-moon-valley', name: 'Blue Moon Valley', region: 'Yunnan', placeIds: ['blue-moon'],
    summary: 'Danau toska di kaki Jade Dragon, dengan jalur tepi air untuk berjalan dan berhenti memotret.',
    gettingThere: {
      origin: 'Glacier Park pada rangkaian 19 November',
      steps: [
        'Turun dengan gondola ke stasiun bawah dan ikuti bus wisata kawasan menuju 蓝月谷.',
        'Jelajahi tepian danau dengan berjalan kaki. Kendaraan listrik lokal bersifat pilihan, berbeda dari bus antartitik kawasan.',
        'Kembali ke titik jemput yang disepakati untuk mengambil koper dan menuju Stasiun Lijiang.',
      ],
      duration: 'Waktu perpindahan mengikuti rute dan antrean bus hari itu; sisihkan ruang dalam jadwal untuk perjalanan kembali ke kota.',
      sources: [jadeDragonNotice, jadeDragonGuide],
    },
    stopAccess: { 'blue-moon': 'Turun di halte 蓝月谷, lalu ikuti jalur resmi di tepi danau. Tanyakan halte pulang sebelum mulai berjalan.' },
    costs: [
      { label: 'Akses dalam kawasan Jade Dragon', amount: 'CNY 100 / orang untuk kawasan', detail: 'Gunakan tiket kawasan yang sama dari kunjungan Glacier Park hari ini; jangan menjumlahkan tiket masuk kedua untuk lembah.', status: 'published', source: jadeDragonNotice },
      { label: 'Shuttle kawasan', amount: 'CNY 20 / orang', detail: 'Komponen yang sama pada rangkaian Jade Dragon, bukan biaya shuttle baru untuk setiap pemberhentian. Periksa isi paket.', status: 'published', source: jadeDragonNotice },
      { label: 'Kendaraan listrik di lembah', amount: 'Opsional, cek tarif setempat', detail: 'Pengelola menyatakan kendaraan listrik Blue Moon Valley tidak wajib. Jalan kaki adalah pilihan jika kondisi tubuh dan jalur memungkinkan.', status: 'unconfirmed', source: jadeDragonNotice },
    ],
    visitDuration: 'Alokasi rencana 1 sampai 2 jam di tepi danau.',
    bestTime: 'Menjelang siang 19 November setelah gondola; durasi disesuaikan agar tetap tiba di Dali malam itu.',
    tips: ['Foto dari jalur pejalan kaki; jangan turun ke air atau melintasi pembatas.', 'Tentukan titik kembali sebelum berjalan agar tidak perlu menelusuri seluruh lembah dua kali.', 'Jika gondola terlambat, pendekkan kunjungan dan pertahankan waktu keberangkatan ke stasiun.'],
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
        'Ambil koper di hotel dan berangkat ke 大理站 di Xiaguan. PDF mengalokasikan sekitar 90 menit dari hotel sampai keberangkatan kereta.',
      ],
      duration: 'Perjalanan dari Caicun bergantung titik turun. Sisihkan 90 menit dari hotel sampai waktu keberangkatan kereta, sesuai rencana PDF.',
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
    visitDuration: 'Alokasi rencana 2 sampai 3 jam termasuk makan; waktu salat Jumat dan transfer stasiun disisihkan terpisah.',
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
    cautions: ['Jam penerbangan 21 November belum terkonfirmasi dalam PDF. Kunjungan ini tetap opsional.', 'Jangan memakai durasi jalan pagi untuk mengurangi waktu check-in bandara yang diwajibkan maskapai.'],
    sources: [
      { title: 'Pemerintah Yunnan: akses publik gratis Cuihu', url: greenLakeNotice, kind: 'official', publishedAt: '2024-03-26', note: 'Teks terindeks mengonfirmasi akses gratis; halaman penuh tidak dapat dimuat saat pengecekan.' },
      { title: 'Pengumuman Taman Cuihu: jadwal buka tahunan, dimuat ulang Kunming Media', url: greenLakeHours, kind: 'reference', publishedAt: '2025-11-25' },
      { title: 'Amap: gerbang selatan Cuihu dan akses metro', url: greenLakeEntrance, kind: 'operator' },
    ],
    checkedAt: '2026-11-03',
  },
];
