import type { DestinationGuide, GuideSource } from '../guide-types.ts';

const xinduqiaoSource: GuideSource = { title: 'China Discovery: akses Xinduqiao', url: 'https://www.chinadiscovery.com/sichuan/kangding/xinduqiao.html', kind: 'operator' };
const kangdingSource: GuideSource = { title: 'Pemerintah Kangding: referensi jaringan jalan, 2022', url: 'https://www.kangding.gov.cn/kdkdjt1/article/107029', kind: 'official', publishedAt: '2022-09-14', note: 'Referensi jaringan jalan; bukan pembaruan kondisi atau penutupan jalan hari ini.' };
const localTourSource: GuideSource = { title: 'Chengdu China Travel Service: rute dan biaya tambahan lokal', url: 'https://m.gosctour.com/line/show.html?id=240', kind: 'operator' };
const jiagenbaSource: GuideSource = { title: 'Ganzi TV: rute Jiagenba', url: 'https://www.ganzitv.com/cms/a/166446392/content', kind: 'reference', publishedAt: '2025-05-11' };
const roadSource: GuideSource = { title: 'Sichuan Online: lokasi Tianlu 18 Bends', url: 'https://sichuan.scol.com.cn/ggxw/202408/82593925.html', kind: 'reference', publishedAt: '2024-08-25' };
const litangSource: GuideSource = { title: 'Sichuan Travel Guide: Litang dan biaranya', url: 'https://www.sichuantravelguide.com/litang.html', kind: 'operator' };
const haiziSource: GuideSource = { title: 'Pemerintah Daocheng: Haizi Shan dan rute dari Litang', url: 'https://www.daocheng.gov.cn/dcxrmzf/c102548/201806/e8e36c09ba604547afd38433afe461a4.shtml', kind: 'official', publishedAt: '2018-06-08', note: 'Referensi lokasi dan rute lama; harga di artikel tidak digunakan sebagai tarif saat ini.' };
const liyaRoadSource: GuideSource = { title: 'Pemerintah Daocheng: pembaruan ruas Litang–Yading, Agustus 2026', url: 'https://www.daocheng.gov.cn/ttxw/article/727344', kind: 'official', publishedAt: '2026-08-17' };
const pagodaSource: GuideSource = { title: 'Trip.com: Zunsheng Tower Forest', url: 'https://www.trip.com/travel-guide/attraction/daocheng/namgyal-tallinn-131896601', kind: 'reference' };
const yadingNotice: GuideSource = { title: 'Salinan pengumuman operator Yading, 14 April 2026', url: 'https://www.513337.com/tourism/news/25715.html', kind: 'reference', publishedAt: '2026-04-14' };
const yadingPromotion: GuideSource = { title: 'Pemerintah Daocheng: kebijakan gratis mulai Agustus 2026', url: 'https://www.daocheng.gov.cn/fmxw/article/726022', kind: 'official', publishedAt: '2026-08-04', note: 'Isi ditemukan dalam indeks pencarian; halaman langsung gagal dimuat saat pemeriksaan. Tidak membuktikan tarif November.' };
const yadingReform: GuideSource = { title: 'Laporan Xinhua: perubahan tarif dan promo hingga 31 Oktober', url: 'https://finance.sina.com.cn/wm/2026-07-10/doc-inihkimn3633439.shtml', kind: 'reference', publishedAt: '2026-07-10' };
const yadingVisitorNotice: GuideSource = { title: 'Salinan panduan pengelola Yading, 25 Oktober 2026', url: 'https://www.513337.com/tourism/news/25960.html', kind: 'reference', publishedAt: '2026-10-25', note: 'Salinan yang menyebut pengelola sebagai sumber; tautan asli WeChat tidak dapat dimuat saat pemeriksaan.' };
const yadingHours: GuideSource = { title: 'Salinan jam bus dan mobil listrik Yading, 16 April 2026', url: 'https://c.m.163.com/news/a/KQL27UV70514CC6P.html', kind: 'reference', publishedAt: '2026-04-16', note: 'Diunggah akun 微甘孜 di NetEase dengan mengutip pengelola. Jam musim ramai berlaku 15 April–25 November.' };
const xiangchengSource: GuideSource = { title: 'Sichuan Travel Guide: koridor Xiangcheng', url: 'https://www.sichuantravelguide.com/garze/xiangcheng.html', kind: 'operator' };

export const westernGuides: DestinationGuide[] = [
  {
    slug: 'xinduqiao', name: 'Xinduqiao', region: 'Sichuan', placeIds: ['xinduqiao'],
    summary: 'Dua malam di lembah pohon dan rumah Tibet, sebagai basis perjalanan sekitar Kangding.',
    gettingThere: { origin: 'Tagong, setelah perjalanan dari Rilong', steps: ['Lanjutkan mobil sewaan dari Tagong ke hotel Xinduqiao sesuai rute 12 November. Sewa mobil berakhir di sini.', 'Mobil tiba sekitar 18.30–18.45, setelah matahari terbenam. Pemandangan tersebar di luar pusat kota, jadi tanpa mobil cukup berfoto di sekitar hotel pada pagi 14 November sebelum bus ke Litang.'], duration: 'Itinerary: sekitar 10 jam untuk seluruh hari Rilong ke Xinduqiao, termasuk singgah.', sources: [xinduqiaoSource.url, jiagenbaSource.url] },
    stopAccess: { xinduqiao: 'Mobil sewa berakhir di hotel. Pada 13 November minta hotel mencarikan mobil tumpangan ke Kangding; pada 14 November naik bus yang lewat ke Litang.' },
    costs: [
      { label: 'Mobil dan sopir', amount: 'Sesuai penawaran', detail: 'Bagian dari sewa 11–12 November, Bipenggou sampai Xinduqiao. Minta harga all-in (bensin, tol, parkir, makan dan menginap sopir), acuan CNY 600–800 per hari, ditambah biaya kembali kosong (返空费).', status: 'unconfirmed' },
      { label: 'Lokasi foto dan parkir', amount: 'Perlu konfirmasi', detail: 'Biaya lahan pribadi atau titik pandang dapat berbeda; tanyakan sebelum masuk.', status: 'unconfirmed' },
    ],
    visitDuration: 'Dua malam; berfoto jalan kaki di sekitar hotel, sore 13 atau pagi 14 November.', bestTime: 'Cahaya pagi atau sore; rute ini tiba pada malam 12 November.',
    tips: ['Simpan pin hotel dan pesan pemanas kamar untuk dua malam.', 'Siapkan bekal malam dan sarapan sebelum berangkat ke Kangding pada 13 November, paling lambat 09.00.'],
    cautions: ['Jangan berhenti di badan jalan demi foto; gunakan area parkir yang disetujui sopir.'], sources: [xinduqiaoSource, jiagenbaSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'yuzixi', name: 'Yuzixi', region: 'Sichuan', placeIds: ['yuzixi'],
    summary: 'Punggung bukit terbuka untuk melihat jajaran Gongga dan Yala. Tidak termasuk rencana transportasi umum.',
    gettingThere: { origin: 'Hotel di Xinduqiao', steps: ['Tidak ada dalam rencana transportasi umum. Ke 鱼子西 perlu mobil carteran tambahan dari Xinduqiao, pulang-pergi.', 'Jika menambah mobil, konfirmasikan apakah mobil yang sama boleh naik sampai titik pandang atau perlu kendaraan penghubung lokal.'], duration: 'Sekitar 37 km atau 40–60 menit dari Xinduqiao dengan mobil. Itinerary tidak memberi jam karena Yuzixi tidak termasuk rencana.', sources: [localTourSource.url] },
    stopAccess: { yuzixi: 'Hanya dengan mobil carteran tambahan dari Xinduqiao, lalu kendaraan penghubung lokal bila diwajibkan di akses terakhir.' },
    costs: [
      { label: 'Biaya kebersihan', amount: 'Acuan CNY 30 / orang', detail: 'Angka dari paket operator lokal, bukan tarif resmi tetap untuk November. Tanyakan nilai yang berlaku sebelum naik.', status: 'estimate', source: localTourSource.url },
      { label: 'Kendaraan penghubung', amount: 'Acuan CNY 60 / orang', detail: 'Operator mencantumkan biaya tambahan ini. Konfirmasikan apakah diperlukan dan apakah pulang-pergi sudah termasuk.', status: 'estimate', source: localTourSource.url },
      { label: 'Mobil carteran tambahan', amount: 'Sesuai penawaran', detail: 'Tidak termasuk anggaran rencana. Sepakati harga pulang-pergi dari Xinduqiao dan waktu menunggu.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran 30 hingga 60 menit di titik pandang.', bestTime: 'Saat langit cerah. Tidak masuk jadwal 13 November, yang dipakai untuk salat Jumat di Kangding.',
    tips: ['Konfirmasikan pembukaan akses sebelum meninggalkan hotel.', 'Bawa sarung tangan dan simpan baterai kamera di bagian dalam jaket.'],
    cautions: ['Jika menambah mobil, lewati Yuzixi bila akses terlambat atau jalan tertutup es.'], sources: [localTourSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'honghaizi', name: 'Honghaizi', region: 'Sichuan', placeIds: ['honghaizi'],
    summary: 'Danau pegunungan di koridor S434 dekat jalan Bandara Kangding. Tidak termasuk rencana transportasi umum.',
    gettingThere: { origin: 'Xinduqiao', steps: ['Tidak ada dalam rencana transportasi umum. Ke sini perlu mobil carteran tambahan dari Xinduqiao menuju koridor S434 dan kawasan jalan Bandara Kangding.', 'Jika menambah mobil, minta sopir memasukkan pin 红海子, lalu turun hanya di area yang dibuka untuk pengunjung.'], duration: 'PDF menempatkannya di loop mobil sekitar 250 km; waktu ruas perlu dihitung sopir. Itinerary tidak memberi jam karena Honghaizi tidak termasuk rencana.', sources: [localTourSource.url, kangdingSource.url] },
    stopAccess: { honghaizi: 'Dengan mobil carteran tambahan, turun di tempat parkir dekat danau pada koridor S434; lanjut berjalan di area yang dibuka.' },
    costs: [
      { label: 'Biaya kebersihan lokal', amount: 'Acuan CNY 30 / orang', detail: 'Dicantumkan pada paket operator yang tidak bertanggal; ini acuan anggaran, bukan harga terkonfirmasi November. Cek nilai dan area yang tercakup sebelum membayar.', status: 'estimate', source: localTourSource.url },
      { label: 'Mobil carteran dan parkir', amount: 'Perlu konfirmasi', detail: 'Butuh mobil carteran tambahan dari Xinduqiao; tidak termasuk anggaran rencana.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran 20 hingga 30 menit.', bestTime: 'Saat angin tenang, agar pantulan di danau terlihat.',
    tips: ['Simpan pin danau agar tidak tertukar dengan lokasi lain bernama sama.', 'Foto dari tepi yang aman tanpa berjalan di atas es.'],
    cautions: ['Tanpa mobil carteran tambahan, Honghaizi tidak bisa dicapai dalam rencana ini.'], sources: [localTourSource, kangdingSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'kangding', name: 'Kangding', region: 'Sichuan', placeIds: ['kangding', 'kangding-mosque'],
    summary: 'Singgah kota untuk makan dan salat Jumat, sebelum kembali ke pegunungan lewat Zheduo.',
    gettingThere: { origin: 'Xinduqiao, lewat Zheduo', steps: ['Minta hotel di Xinduqiao mencarikan mobil tumpangan (拼车) ke Kangding, CNY 40–50 per orang, berangkat saat penuh 4 orang. Jika lama, naik bus yang lewat. Berangkat paling lambat 09.00.', 'Tiba sekitar 11.00. Tunjukkan 康定清真寺 saat bertanya arah, karena pin masjid belum terverifikasi.', 'Pulang dengan mobil tumpangan dari 东关 atau 步行街 di Kangding; berangkat sebelum 15.30.'], duration: 'Sekitar 2 jam sekali jalan lewat Zheduo, dengan mobil tumpangan atau bus.', sources: [kangdingSource.url] },
    stopAccess: { kangding: 'Turun di pusat kota dari mobil tumpangan atau bus; lanjutkan jalan kaki singkat di tepi sungai.', 'kangding-mosque': 'Masjid di 东大街. Pin belum terverifikasi; tunjukkan 康定清真寺 kepada warga atau pengurus saat bertanya arah.' },
    costs: [
      { label: 'Mobil tumpangan', amount: 'Acuan CNY 40–50 / orang sekali jalan', detail: 'Berangkat saat penuh 4 orang; bus yang lewat menjadi cadangan. Angka dari rencana perjalanan; tanyakan tarif sebelum naik.', status: 'estimate' },
      { label: 'Makan dan bekal', amount: 'Sesuai pemakaian', detail: 'Periksa menu di kedai Hui sekitar masjid; anggaran terverifikasi belum tersedia.', status: 'unconfirmed' },
    ],
    visitDuration: 'Sekitar 11.00–15.30: salat Jumat 12.00–14.00, lalu makan dan beli bekal.', bestTime: 'Siang 13 November, mengikuti jam salat yang dikonfirmasi setempat.',
    tips: ['Simpan nama masjid dalam Mandarin untuk ditunjukkan kepada sopir atau warga.', 'Beli bekal halal untuk bus ke Litang besok sebelum kembali ke Xinduqiao.'],
    cautions: ['Pin masjid dan jam salat masih perlu konfirmasi; foto dalam PDF belum membuktikan lokasi masjid.', 'Berangkat pulang sebelum 15.30 agar tiba di Xinduqiao sebelum gelap; Zheduo rawan es.'], sources: [kangdingSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'zheduo-pass', name: 'Zheduo Pass', region: 'Sichuan', placeIds: ['zheduo'],
    summary: 'Lintasan tinggi yang dilewati pergi-pulang antara Xinduqiao dan Kangding.',
    gettingThere: { origin: 'Xinduqiao atau Kangding', steps: ['Dilewati dua kali pada 13 November dengan mobil tumpangan atau bus, saat berangkat dan pulang.', 'Rencana tidak berhenti di titik pandang 折多山垭口; lihat dari jendela. Berhenti di puncak butuh mobil sendiri dan jalan menuju titik pandang yang dibuka.'], duration: 'Acuan operator: Kangding ke Xinduqiao sekitar 2 jam, belum termasuk berhenti dan gangguan jalan.', sources: [xinduqiaoSource.url] },
    stopAccess: { zheduo: 'Dilewati dengan mobil tumpangan atau bus antara Xinduqiao dan Kangding; berhenti di titik pandang tidak termasuk rencana.' },
    costs: [
      { label: 'Melintas', amount: 'Termasuk ongkos perjalanan', detail: 'Rencana hanya melintas dengan mobil tumpangan atau bus. Tarif parkir atau akses titik pandang belum terverifikasi; jangan menganggap seluruh titik pandang gratis.', status: 'unconfirmed' },
    ],
    visitDuration: 'Dilewati tanpa berhenti, dilihat dari jendela kendaraan.', bestTime: 'Pagi saat berangkat dan sore saat pulang, bila jarak pandang dan jalan baik.',
    tips: ['Simpan jaket di tas kecil; lintasan dingin dan kendaraan bisa tertahan es.', 'Pulang dari Kangding sebelum 15.30 agar lintasan dilewati sebelum gelap.'],
    cautions: ['Lintasan sekitar 4.298 m menurut PDF; es atau pembatasan jalan dapat memperlambat perjalanan.'], sources: [xinduqiaoSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'jiagenba', name: 'Jiagenba & Zimei Pass', region: 'Sichuan', placeIds: ['jiagenba', 'zimei'],
    summary: 'Lembah desa dekat Xinduqiao untuk sore yang lebih tenang, dan Zimei sebagai perjalanan tambahan yang jauh. Keduanya tidak termasuk rencana transportasi umum.',
    gettingThere: { origin: 'Xinduqiao', steps: ['Tidak ada dalam rencana transportasi umum; perlu mobil carteran tambahan dari Xinduqiao. Ganzi TV menempatkan Jiagenba sekitar 27 hingga 30 km dari Xinduqiao.', 'Berjalan di area desa dan tepi sungai yang diizinkan.', 'Zimei Pass lebih dari 100 km sekali jalan dari Jiagenba dan tidak disarankan. Jika tetap ingin, minta sopir menghitung perjalanan tambahan secara terpisah dan memastikan jalan dibuka.'], duration: 'Waktu ke Jiagenba mengikuti kondisi jalan; Zimei dapat memerlukan etape tambahan panjang. Itinerary tidak memberi jam karena keduanya tidak termasuk rencana.', sources: [jiagenbaSource.url] },
    stopAccess: { jiagenba: 'Dengan mobil carteran tambahan dari Xinduqiao ke kawasan desa Jiagenba, kemudian jalan kaki di jalur yang diizinkan.', zimei: 'Akses lanjutan dengan sopir lokal menuju 子梅垭口 hanya setelah rute, kendaraan dan jam kembali disetujui. Tetap opsional.' },
    costs: [
      { label: 'Kawasan umum Jiagenba', amount: 'Referensi: gratis', detail: 'Ganzi TV pada 11 Mei 2025 mencantumkan tanpa tiket. Ini referensi, bukan tarif resmi November 2026; parkir, lahan pribadi, dan titik pandang tambahan tidak termasuk.', status: 'estimate', source: jiagenbaSource.url },
      { label: 'Mobil carteran dan detur Zimei', amount: 'Perlu penawaran terpisah', detail: 'Butuh mobil carteran tambahan dari Xinduqiao. Konfirmasikan biaya akses, kendaraan dan tambahan waktu sebelum menyetujui detur Zimei.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran 1 hingga 2 jam di Jiagenba; Zimei tidak termasuk durasi ini.', bestTime: 'Sore untuk lembah Jiagenba; kembali sebelum kondisi jalan memburuk.',
    tips: ['Minta izin sebelum masuk lahan pertanian atau halaman rumah.', 'Jika menambah mobil, pilih Jiagenba daripada Zimei karena jauh lebih dekat.'],
    cautions: ['Zimei tidak disarankan dalam itinerary; akses tanah, es dan jarak tambahan dapat membuatnya tidak layak.'], sources: [jiagenbaSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'g318', name: 'G318 & Tianlu 18 Bends', region: 'Sichuan', placeIds: ['gaoersi', 'tianlu'],
    summary: 'Jalan pegunungan dari Xinduqiao ke Litang, dengan titik pandang tikungan di kawasan Yajiang.',
    gettingThere: { origin: 'Xinduqiao', steps: ['Naik bus yang lewat Xinduqiao ke Litang: dari Danba (berangkat 08.00) kira-kira 11.00–11.30, dari Chengdu (06.30) kira-kira 12.30–13.00. Tanyakan jam lewatnya di hotel atau terminal sehari sebelumnya; tiket dibeli hari itu.', 'Gao’ersi dan Tianlu 18 Bends dilihat dari jendela bus; bus tidak berhenti di titik pandang. Tianlu berada di ruas Yajiang menuju Litang, bukan di pusat Xinduqiao.'], duration: 'Sekitar 195 km dan 4–5 jam dengan bus. Tiba di Litang sekitar 15.00–16.30; bus dari Chengdu bisa baru tiba 16.30–17.30.', sources: [roadSource.url] },
    stopAccess: { gaoersi: 'Dilewati dengan bus di G318, kini lewat terowongan Gao’ersi; jalan lintasan lama jarang dipakai.', tianlu: 'Dilihat dari jendela bus pada ruas Yajiang ke Litang; bus tidak berhenti di titik pandang.' },
    costs: [
      { label: 'Bus Xinduqiao–Litang', amount: 'Di bawah CNY 171', detail: 'Tarif penuh Danba–Litang CNY 171; dari Xinduqiao lebih murah, angka pastinya belum terlihat. Tiket dibeli hari itu.', status: 'estimate' },
    ],
    visitDuration: 'Dilihat dari bus tanpa berhenti.', bestTime: 'Siang dengan jarak pandang baik, mengikuti etape 14 November.',
    tips: ['Unduh peta sebelum berangkat dan simpan nama hotel Litang.', 'Siapkan bekal dan air untuk 4–5 jam di bus; Zuhur sekitar 13.03 masih di jalan.'],
    cautions: ['Rute melewati lintasan tinggi; penutupan atau es dapat menambah waktu berkendara.'], sources: [roadSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'litang', name: 'Litang & biaranya', region: 'Sichuan', placeIds: ['litang', 'litang-monastery'],
    summary: 'Sore berjalan ringan di kota dataran tinggi dan kompleks Biara Litang.',
    gettingThere: { origin: 'Xinduqiao melalui G318', steps: ['Tiba dengan bus yang lewat dari Xinduqiao, lalu check-in dan istirahat.', 'Ke 长青春科尔寺 naik taksi lokal, 2,3–3,5 km dari penginapan, hanya jika tiba sebelum 16.30. Kembali sebelum gelap, sekitar 18.24.'], duration: 'Sekitar 195 km dan 4–5 jam dengan bus dari Xinduqiao. Tiba sekitar 15.00–16.30, atau 16.30–17.30 bila naik bus dari Chengdu.', sources: [litangSource.url, roadSource.url] },
    stopAccess: { litang: 'Gunakan hotel di kota sebagai titik mulai jalan santai; mobil lokal untuk jarak yang lebih jauh.', 'litang-monastery': 'Taksi lokal ke 长青春科尔寺 di sisi bukit kota, 2,3–3,5 km dari penginapan; cek akses aula dan kendaraan internal di pintu masuk.' },
    costs: [
      { label: 'Akses biara dan kendaraan internal', amount: 'Perlu konfirmasi', detail: 'Tarif terkini dan cakupan aula belum terverifikasi. Tanyakan sebelum menggunakan kendaraan atau pemandu internal.', status: 'unconfirmed' },
      { label: 'Taksi dan penginapan', amount: 'Sesuai pemakaian', detail: 'Minta harga kamar berpemanas; sepakati tarif taksi ke biara sebelum naik.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran 1 hingga 2 jam jalan santai dan kunjungan biara.', bestTime: 'Sore 14 November, hanya jika tiba sebelum 16.30 dan area kunjungan masih dibuka.',
    tips: ['Minta izin sebelum memotret di dalam aula atau memotret orang beribadah.', 'Siapkan bekal untuk bus 09.30 ke Daocheng keesokan pagi.'],
    cautions: ['Litang sekitar 4.014 m menurut PDF dan merupakan malam menginap tertinggi dalam rute; hindari memaksakan aktivitas.'], sources: [litangSource, roadSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'haizi-shan', name: 'Haizi Shan & Sister Lakes', region: 'Sichuan', placeIds: ['haizi', 'sister-lakes'],
    summary: 'Batu glasial dan danau di lintasan menuju Daocheng, dilihat dari bus. Sister Lakes berada pada cabang arah Batang dan butuh mobil sendiri.',
    gettingThere: { origin: 'Litang menuju Daocheng', steps: ['Naik bus 09.30 dari 理塘县汽车站 ke Daocheng. Dataran Haizi Shan terlihat dari jendela; bus tidak berhenti.', 'Sister Lakes (姊妹湖) berada di G318 arah Batang, bukan di jalur ke Daocheng. Butuh mobil sendiri; tidak termasuk rencana bus.', 'Tetap utamakan tiba di Riwa untuk beristirahat sebelum Yading.'], duration: 'Bus Litang ke Daocheng sekitar 4–5 jam, lalu taksi ke Riwa sekitar 1,5 jam.', sources: [liyaRoadSource.url, haiziSource.url] },
    stopAccess: { haizi: 'Dilihat dari jendela bus Litang ke Daocheng; bus tidak berhenti.', 'sister-lakes': 'Dari Litang, cabang G318 arah Batang berbeda dari arah Daocheng. Butuh mobil sendiri; tidak termasuk rencana bus.' },
    costs: [
      { label: 'Mobil ke Sister Lakes', amount: 'Perlu penawaran', detail: 'Butuh mobil sendiri ke arah Batang; tidak termasuk rencana bus. Sepakati biaya dan batas waktu bila menambahkannya.', status: 'unconfirmed' },
      { label: 'Parkir atau akses titik danau', amount: 'Perlu konfirmasi', detail: 'Tarif terbaru belum terverifikasi; sumber pemerintah yang tersedia berasal dari 2018 dan tidak dipakai sebagai harga saat ini.', status: 'unconfirmed' },
    ],
    visitDuration: 'Dilihat dari bus tanpa berhenti.', bestTime: 'Pagi hingga siang 15 November, dari jendela bus.',
    tips: ['Bawa makanan dan air dari Litang untuk etape panjang.', 'Bus tidak berhenti untuk foto; pilih kursi dekat jendela.'],
    cautions: ['Sister Lakes tidak termasuk rencana bus; butuh mobil sendiri.', 'Pembaruan pemerintah 17 Agustus 2026 menargetkan penyelesaian G227 pada November; konfirmasikan pekerjaan jalan dan pengaturan lalu lintas sebelum berangkat.', 'Kawasan sekitar 4.500 m menurut PDF; batasi aktivitas bila kondisi tubuh atau cuaca tidak mendukung.'], sources: [liyaRoadSource, haiziSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'daocheng', name: 'Daocheng & White Pagoda', region: 'Sichuan', placeIds: ['daocheng'],
    summary: 'Turun dari bus untuk makan siang, salat dan belanja bekal, lalu taksi ke Riwa. White Pagoda bila waktu masih ada.',
    gettingThere: { origin: 'Litang, dengan bus 09.30', steps: ['Turun dari bus di Daocheng, bukan di 亚丁, sekitar 13.30–14.30. Makan siang, salat Zuhur, lalu beli bekal halal untuk dua malam di Riwa, hari Yading, dan perjalanan 17 November.', 'Bila masih ada waktu, singgah di 尊胜塔林, kompleks White Pagoda dekat jembatan Daocheng.', 'Lalu naik taksi ke hotel di Riwa (香格里拉镇), sekitar 1,5 jam. DiDi belum tentu ada; cari taksi di terminal dan sepakati tarif dulu.'], duration: 'Bus Litang ke Daocheng sekitar 4–5 jam, lalu taksi ke Riwa sekitar 1,5 jam.', sources: [pagodaSource.url, liyaRoadSource.url, haiziSource.url] },
    stopAccess: { daocheng: 'Turun dari bus di Daocheng. White Pagoda / 尊胜塔林 berada dekat jembatan Daocheng; berjalan mengitari bagian yang terbuka.' },
    costs: [
      { label: 'White Pagoda', amount: 'CNY 0', detail: 'Trip.com mencantumkan masuk gratis. Cek papan setempat untuk perubahan atau layanan tambahan.', status: 'published', source: pagodaSource.url },
      { label: 'Bekal dan taksi ke Riwa', amount: 'Sesuai pemakaian', detail: 'Belanja bekal dua malam di Riwa, hari kunjungan Yading dan perjalanan 17 November; harga mengikuti toko. Tarif taksi ke Riwa disepakati sebelum naik.', status: 'unconfirmed' },
    ],
    visitDuration: 'Sekitar 1 jam untuk makan, salat dan belanja bekal; White Pagoda sekitar 30 menit bila sempat.', bestTime: 'Siang ketika melewati kota pada 15 November.',
    tips: ['Ikuti arah kunjungan dan petunjuk setempat di area stupa.', 'Konfirmasikan hotel tujuan di Riwa, bukan menginap di kota Daocheng.'],
    cautions: ['Riwa / Shangri-La Town di Sichuan berbeda dari Kota Shangri-La di Yunnan.'], sources: [pagodaSource, liyaRoadSource, haiziSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'yading', name: 'Yading', region: 'Sichuan', placeIds: ['zhaguanbeng', 'chonggu', 'luorong', 'milk-lake', 'five-colour', 'pearl-lake'],
    summary: 'Bus pegunungan, padang Luorong dan jalur danau. Pilih panjang perjalanan setelah mengetahui pembukaan jalur hari itu.',
    gettingThere: { origin: 'Hotel di Riwa / Shangri-La Town, Sichuan', steps: ['Minta hotel mengantar ke pusat pengunjung Yading, lalu naik bus taman ke Zhaguanbeng. Bus mulai 07.10, perjalanan sekitar 1 jam.', 'Berjalan ke Chonggu, lalu naik mobil listrik ke Luorong, sekitar tiap 30 menit mulai 08.00. Jalan kaki Chonggu–Luorong sekitar 8 km terlalu lama untuk mencapai pos jalur atas sebelum 14.30.', 'Milk Lake dan Five-Colour Lake memerlukan trek lanjutan dari Luorong. Pearl Lake (卓玛拉措) jalur yang lebih pendek, tetapi tetap loop sekitar 6 km dari Zhaguanbeng lewat Chonggu, 3 hingga 5 jam.'], duration: 'Panduan pengelola yang disalin 25 Oktober menyebut trek danau atas dari Luorong sekitar 10 km pulang-pergi, 5 hingga 6 jam. Bus dan antrean di luar durasi ini.', sources: [yadingVisitorNotice.url, yadingReform.url, yadingHours.url] },
    stopAccess: { zhaguanbeng: 'Naik bus taman dari pusat pengunjung Riwa menuju titik turun Zhaguanbeng.', chonggu: 'Dari Zhaguanbeng, berjalan mengikuti jalur bertanda menuju Chonggu.', luorong: 'Dari Chonggu, naik mobil listrik ke Luorong; keberangkatan naik terakhir 16.30. Jalan kaki sekitar 8 km terlalu lama untuk trek atas.', 'milk-lake': 'Trek lanjutan dari Luorong hanya jika jalur atas dibuka; kendaraan listrik tidak mengantar sampai danau.', 'five-colour': 'Lanjutkan trek danau atas dari kawasan Milk Lake sesuai jalur yang diizinkan petugas; tidak ada jaminan akses pada 16 November.', 'pearl-lake': 'Bagian loop 观音慈悲线 dari Zhaguanbeng lewat Chonggu ke 卓玛拉措, sekitar 6 km pulang-pergi dan 3 hingga 5 jam, bila dibuka. Ini alternatif terpisah dari trek Luorong ke danau atas.' },
    costs: [
      { label: 'Tiket kawasan', amount: 'Acuan awal CNY 146 / orang', detail: 'Pengumuman 14 April menyebut tarif ini sampai 25 November 2026. Promo gratis Agustus sampai Oktober menyusul; tarif final 16 November harus dicek saat reservasi.', status: 'estimate', source: yadingNotice.url },
      { label: 'Bus dan kendaraan listrik', amount: 'Perlu konfirmasi', detail: 'Kebijakan biaya berubah pada 2026. Jangan memakai total lama CNY 120 + CNY 80 atau menganggap promo gratis masih berlaku pada November.', status: 'unconfirmed', source: yadingPromotion.url },
      { label: 'Antar hotel ke pusat pengunjung', amount: 'Sesuai penawaran hotel', detail: 'Pastikan harga dan titik jemput pulang sebelum berangkat.', status: 'unconfirmed' },
    ],
    visitDuration: 'Satu hari; panjang trek dipilih sesuai kondisi dan pembukaan jalur.', bestTime: 'Berangkat pagi 16 November. Panduan 25 Oktober menyebut pos sekitar 200 m dari 贡嘎措, di jalur atas setelah Luorong, tidak mengizinkan pengunjung lewat setelah 14.30. Menurut jadwal musim ramai yang diumumkan 16 April, mobil listrik terakhir dari Luorong 18.00 dan bus taman terakhir ke pusat pengunjung 19.00.',
    tips: ['Hubungi taman di +86 836 6966022 untuk harga dan jalur yang berlaku pada tanggal kunjungan.', 'Bawa bekal halal, air, jaket dan lampu kecil; simpan informasi bus terakhir.', 'Tentukan jam putar balik sebelum mulai trek dan sisakan waktu kembali ke bus.'],
    cautions: ['Panduan pengelola yang disalin 25 Oktober menyebut jalur Milk Lake dan Five-Colour Lake tutup mulai 25 November hingga 15 April. Akses 16 November tetap bergantung cuaca dan keputusan petugas.', 'Milk Lake dan Five-Colour Lake sekitar 4.600 hingga 4.700 m menurut PDF. Pilih jalur pendek bila tubuh atau kondisi jalur tidak mendukung.'], sources: [yadingVisitorNotice, yadingHours, yadingNotice, yadingPromotion, yadingReform], checkedAt: '2026-11-04',
  },
  {
    slug: 'xiangcheng', name: 'Xiangcheng & Daxueshan', region: 'Sichuan', placeIds: ['xiangcheng', 'daxueshan'],
    summary: 'Rumah-rumah putih dan lintasan pegunungan pada etape panjang menuju Shangri-La di Yunnan.',
    gettingThere: { origin: 'Riwa, setelah dua malam di basis Yading', steps: ['Naik taksi atau mobil carteran dari Riwa pukul 08.00, sekitar 3–3,5 jam, dengan tarif yang disepakati semalam.', 'Di 乡城长途汽车站 beli tiket bus 14.30 ke Shangri-La dengan paspor, sekitar CNY 86. Makan siang dan salat Zuhur di Xiangcheng sebelum bus.', 'Bus sekitar 5 jam melintasi Daxueshan dan Xiaoxueshan, lalu tiba di kota Shangri-La, Yunnan, sekitar 19.30–20.00 setelah gelap. Lanjut taksi ke hotel Dukezong; jangan tertukar dengan Shangri-La Town di Sichuan.'], duration: 'Taksi sekitar 3–3,5 jam, lalu bus sekitar 5 jam. Jika bus batal karena salju, bermalam di Xiangcheng dan naik bus 08.00 besok.', sources: [xiangchengSource.url] },
    stopAccess: { xiangcheng: 'Turun di 乡城长途汽车站; makan siang dan jalan singkat di kota sebelum bus 14.30. Minta izin sebelum masuk rumah.', daxueshan: 'Dilihat dari jendela bus Xiangcheng ke Shangri-La; lintasan sekitar 4.330 m.' },
    costs: [
      { label: 'Taksi Riwa–Xiangcheng', amount: 'Tawar dulu', detail: 'Tarif belum ditemukan. Sepakati harga dan jemputan 08.00 pada malam sebelumnya.', status: 'unconfirmed' },
      { label: 'Bus Xiangcheng–Shangri-La', amount: 'Sekitar CNY 86', detail: 'Bus 14.30 dari 乡城长途汽车站; beli dengan paspor di terminal.', status: 'estimate' },
    ],
    visitDuration: 'Hari perjalanan; sekitar 3 jam di Xiangcheng sebelum bus.', bestTime: 'Lintasan dilewati sore dari bus. Matahari terbenam sekitar 18.30, jadi tiba di Shangri-La setelah gelap.',
    tips: ['Siapkan bekal dan unduh peta sebelum meninggalkan Riwa.', 'Simpan nama hotel Dukezong untuk taksi dari terminal Shangri-La pada malam hari.'],
    cautions: ['Jika lintasan Daxueshan ditutup salju dan bus batal, bermalam di Xiangcheng lalu naik bus 08.00 besok.'], sources: [xiangchengSource], checkedAt: '2026-11-03',
  },
];
