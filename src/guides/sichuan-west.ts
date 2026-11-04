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
const xiangchengSource: GuideSource = { title: 'Sichuan Travel Guide: koridor Xiangcheng', url: 'https://www.sichuantravelguide.com/garze/xiangcheng.html', kind: 'operator' };

export const westernGuides: DestinationGuide[] = [
  {
    slug: 'xinduqiao', name: 'Xinduqiao', region: 'Sichuan', placeIds: ['xinduqiao'],
    summary: 'Dua malam di lembah pohon dan rumah Tibet, sebagai basis perjalanan sekitar Kangding.',
    gettingThere: { origin: 'Tagong, setelah perjalanan dari Rilong', steps: ['Lanjutkan mobil sewaan dari Tagong ke hotel Xinduqiao sesuai rute 12 November.', 'Untuk berfoto, minta sopir berhenti di area aman sepanjang koridor sungai dan desa; pemandangan tersebar di luar pusat kota.'], duration: 'Itinerary: sekitar 7,5–8,5 jam untuk seluruh hari Rilong ke Xinduqiao, termasuk singgah.', sources: [xinduqiaoSource.url, jiagenbaSource.url] },
    stopAccess: { xinduqiao: 'Gunakan hotel sebagai titik jemput mobil; pilih lokasi foto di koridor desa bersama sopir.' },
    costs: [
      { label: 'Mobil dan sopir', amount: 'Sesuai penawaran', detail: 'Minta harga untuk rangkaian Rilong, Danba, Tagong, Xinduqiao dan loop Kangding; pastikan biaya menginap sopir termasuk.', status: 'unconfirmed' },
      { label: 'Lokasi foto dan parkir', amount: 'Perlu konfirmasi', detail: 'Biaya lahan pribadi atau titik pandang dapat berbeda; tanyakan sebelum masuk.', status: 'unconfirmed' },
    ],
    visitDuration: 'Dua malam; singgah foto menyesuaikan waktu tiba.', bestTime: 'Cahaya pagi atau sore; rute ini tiba pada malam 12 November.',
    tips: ['Simpan pin hotel dan pesan pemanas kamar untuk dua malam.', 'Siapkan bekal malam dan sarapan sebelum keberangkatan pagi ke Yuzixi.'],
    cautions: ['Jangan berhenti di badan jalan demi foto; gunakan area parkir yang disetujui sopir.'], sources: [xinduqiaoSource, jiagenbaSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'yuzixi', name: 'Yuzixi', region: 'Sichuan', placeIds: ['yuzixi'],
    summary: 'Punggung bukit terbuka untuk melihat jajaran Gongga dan Yala, dengan akses terakhir yang harus dicek sehari sebelumnya.',
    gettingThere: { origin: 'Hotel di Xinduqiao', steps: ['Pesan penjemputan pulang-pergi dengan sopir lokal, lalu tunjukkan pin 鱼子西.', 'Konfirmasikan apakah mobil yang sama boleh naik sampai titik pandang atau perlu kendaraan penghubung lokal.'], duration: 'Jam berangkat perlu dihitung sopir; target 06.30 dalam PDF bukan jaminan akses terbuka.', sources: [localTourSource.url] },
    stopAccess: { yuzixi: 'Mobil dari Xinduqiao, lalu kendaraan penghubung lokal bila diwajibkan di akses terakhir.' },
    costs: [
      { label: 'Biaya kebersihan', amount: 'Acuan CNY 30 / orang', detail: 'Angka dari paket operator lokal, bukan tarif resmi tetap untuk 13 November. Tanyakan nilai yang berlaku sebelum naik.', status: 'estimate', source: localTourSource.url },
      { label: 'Kendaraan penghubung', amount: 'Acuan CNY 60 / orang', detail: 'Operator mencantumkan biaya tambahan ini. Konfirmasikan apakah diperlukan dan apakah pulang-pergi sudah termasuk.', status: 'estimate', source: localTourSource.url },
      { label: 'Mobil dari hotel', amount: 'Sesuai penawaran', detail: 'Sepakati penjemputan dini hari, waktu menunggu, dan pengembalian ke rute Kangding.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran 30 hingga 60 menit di titik pandang.', bestTime: 'Saat langit cerah; prioritaskan akses aman dan tenggat tiba di Kangding.',
    tips: ['Konfirmasikan pembukaan akses sebelum meninggalkan hotel.', 'Bawa sarung tangan dan simpan baterai kamera di bagian dalam jaket.'],
    cautions: ['Lewati Yuzixi bila akses terlambat atau jalan tertutup es; tetap utamakan Kangding sebelum 12.30.'], sources: [localTourSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'honghaizi', name: 'Honghaizi', region: 'Sichuan', placeIds: ['honghaizi'],
    summary: 'Singgah danau pegunungan di koridor S434 sebelum turun menuju Kangding.',
    gettingThere: { origin: 'Yuzixi atau Xinduqiao', steps: ['Gunakan mobil yang sama menuju koridor S434 dan kawasan jalan Bandara Kangding.', 'Minta sopir memasukkan pin 红海子, lalu turun hanya di area yang dibuka untuk pengunjung.'], duration: 'Bagian dari loop sekitar 250 km pada PDF; waktu ruas perlu dihitung sopir berdasarkan kondisi jalan.', sources: [localTourSource.url, kangdingSource.url] },
    stopAccess: { honghaizi: 'Turun dari mobil di tempat parkir dekat danau pada koridor S434; lanjut berjalan di area yang dibuka.' },
    costs: [
      { label: 'Biaya kebersihan lokal', amount: 'Acuan CNY 30 / orang', detail: 'Dicantumkan pada paket operator yang tidak bertanggal; ini acuan anggaran, bukan harga terkonfirmasi 13 November. Cek nilai dan area yang tercakup sebelum membayar.', status: 'estimate', source: localTourSource.url },
      { label: 'Mobil dan parkir', amount: 'Perlu konfirmasi', detail: 'Masukkan singgah Honghaizi ke kesepakatan loop Xinduqiao dan Kangding.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran 20 hingga 30 menit.', bestTime: 'Pagi ketika tiba dari Yuzixi; pantulan bergantung pada angin.',
    tips: ['Simpan pin danau agar tidak tertukar dengan lokasi lain bernama sama.', 'Foto dari tepi yang aman tanpa berjalan di atas es.'],
    cautions: ['Singgah boleh dipersingkat agar kedatangan di Kangding sebelum 12.30 tetap terjaga.'], sources: [localTourSource, kangdingSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'kangding', name: 'Kangding', region: 'Sichuan', placeIds: ['kangding', 'kangding-mosque'],
    summary: 'Singgah kota untuk makan dan salat Jumat, sebelum kembali ke pegunungan lewat Zheduo.',
    gettingThere: { origin: 'Honghaizi, melalui koridor S434', steps: ['Lanjutkan mobil ke pusat Kangding; jadikan tiba sebelum 12.30 sebagai prioritas 13 November.', 'Minta hotel atau sopir mengonfirmasi pin 康定清真寺 dan jam salat dengan pengurus setempat sebelum perjalanan.'], duration: 'Rencana PDF: satu loop harian dari Xinduqiao sekitar 250 km; bukan jadwal bus.', sources: [kangdingSource.url] },
    stopAccess: { kangding: 'Turun di pusat kota sesuai titik parkir yang disepakati; lanjutkan jalan kaki singkat di tepi sungai.', 'kangding-mosque': 'Pin masjid belum terverifikasi. Minta konfirmasi pengurus atau warga sebelum sopir menentukan titik turun.' },
    costs: [
      { label: 'Mobil harian', amount: 'Sesuai penawaran', detail: 'Sepakati waktu menunggu saat salat dan makan, lalu perjalanan kembali ke Xinduqiao.', status: 'unconfirmed' },
      { label: 'Makan dan parkir', amount: 'Sesuai pemakaian', detail: 'Periksa menu serta tarif parkir setempat; anggaran terverifikasi belum tersedia.', status: 'unconfirmed' },
    ],
    visitDuration: 'Sisihkan waktu salat dan makan tanpa menambahkan kunjungan jauh.', bestTime: 'Siang 13 November, mengikuti jam salat yang dikonfirmasi setempat.',
    tips: ['Simpan nama masjid dalam Mandarin untuk ditunjukkan kepada sopir.', 'Isi ulang bekal sebelum kembali ke Xinduqiao.'],
    cautions: ['Pin masjid dan jam salat masih perlu konfirmasi; foto dalam PDF belum membuktikan lokasi masjid.'], sources: [kangdingSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'zheduo-pass', name: 'Zheduo Pass', region: 'Sichuan', placeIds: ['zheduo'],
    summary: 'Lintasan tinggi di perjalanan dari Kangding kembali ke Xinduqiao.',
    gettingThere: { origin: 'Kangding setelah makan siang', steps: ['Lanjutkan mobil di koridor G318 menuju Xinduqiao.', 'Jika kondisi memungkinkan, minta singgah di titik pandang 折多山垭口. Pastikan rute menuju puncak lintasan dibuka; melewati koridor tidak selalu berarti berhenti di puncak.'], duration: 'Acuan operator: Kangding ke Xinduqiao sekitar 2 jam, belum termasuk berhenti dan gangguan jalan.', sources: [xinduqiaoSource.url] },
    stopAccess: { zheduo: 'Akses dengan mobil dari Kangding pada perjalanan pulang ke Xinduqiao; turun hanya di tempat parkir titik pandang yang dibuka.' },
    costs: [
      { label: 'Singgah dengan mobil', amount: 'Sesuai kontrak sopir', detail: 'Konfirmasikan apakah titik pandang termasuk loop harian, terutama bila perlu detur.', status: 'unconfirmed' },
      { label: 'Parkir atau akses lokal', amount: 'Perlu konfirmasi', detail: 'Tarif terbaru titik berhenti belum berhasil diverifikasi; jangan menganggap seluruh titik pandang gratis.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran singgah singkat 15 hingga 30 menit.', bestTime: 'Siang saat perjalanan kembali, bila jarak pandang dan jalan baik.',
    tips: ['Siapkan jaket sebelum keluar dari mobil.', 'Tentukan batas waktu singgah agar masih sempat ke Jiagenba.'],
    cautions: ['Lintasan sekitar 4.298 m menurut PDF; es atau pembatasan jalan dapat membatalkan pemberhentian.'], sources: [xinduqiaoSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'jiagenba', name: 'Jiagenba & Zimei Pass', region: 'Sichuan', placeIds: ['jiagenba', 'zimei'],
    summary: 'Lembah desa dekat Xinduqiao untuk sore yang lebih tenang. Zimei merupakan perjalanan tambahan yang jauh, bukan singgah singkat.',
    gettingThere: { origin: 'Xinduqiao setelah kembali dari Kangding', steps: ['Ikuti mobil ke Jiagenba; Ganzi TV menempatkannya sekitar 27 hingga 30 km dari Xinduqiao.', 'Berjalan di area desa dan tepi sungai yang diizinkan.', 'Untuk Zimei Pass, minta sopir menghitung perjalanan tambahan secara terpisah dan memastikan jalan dibuka. Jangan menambahkannya hanya karena masih ada waktu satu jam.'], duration: 'Waktu ke Jiagenba mengikuti kondisi jalan; Zimei dapat memerlukan etape tambahan panjang.', sources: [jiagenbaSource.url] },
    stopAccess: { jiagenba: 'Mobil dari Xinduqiao ke kawasan desa Jiagenba, kemudian jalan kaki di jalur yang diizinkan.', zimei: 'Akses lanjutan dengan sopir lokal menuju 子梅垭口 hanya setelah rute, kendaraan dan jam kembali disetujui. Tetap opsional.' },
    costs: [
      { label: 'Kawasan umum Jiagenba', amount: 'Referensi: gratis', detail: 'Ganzi TV pada 11 Mei 2025 mencantumkan tanpa tiket. Ini referensi, bukan tarif resmi November 2026; parkir, lahan pribadi, dan titik pandang tambahan tidak termasuk.', status: 'estimate', source: jiagenbaSource.url },
      { label: 'Detur Zimei dan kendaraan lokal', amount: 'Perlu penawaran terpisah', detail: 'Konfirmasikan biaya akses, kebutuhan kendaraan dan tambahan waktu sebelum menyetujui detur.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran 1 hingga 2 jam di Jiagenba; Zimei tidak termasuk durasi ini.', bestTime: 'Sore untuk lembah Jiagenba; kembali sebelum kondisi jalan memburuk.',
    tips: ['Minta izin sebelum masuk lahan pertanian atau halaman rumah.', 'Pertahankan Jiagenba sebagai pilihan utama jika perjalanan Kangding memakan waktu lebih lama.'],
    cautions: ['Zimei pada itinerary berstatus opsional; akses tanah, es dan jarak tambahan dapat membuatnya tidak layak pada hari ini.'], sources: [jiagenbaSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'g318', name: 'G318 & Tianlu 18 Bends', region: 'Sichuan', placeIds: ['gaoersi', 'tianlu'],
    summary: 'Jalan pegunungan dari Xinduqiao ke Litang, dengan titik pandang tikungan di kawasan Yajiang.',
    gettingThere: { origin: 'Xinduqiao', steps: ['Berangkat dengan mobil sewaan melalui G318 ke arah Yajiang dan Litang.', 'Minta sopir memilih titik berhenti yang dibuka di koridor Gao’ersi dan Tianlu 18 Bends. Tianlu berada di ruas Yajiang menuju Litang, bukan di pusat Xinduqiao.'], duration: 'PDF mengalokasikan sekitar 4 jam berkendara; minta sopir menghitung ulang rute dan kondisi hari itu.', sources: [roadSource.url] },
    stopAccess: { gaoersi: 'Lewati koridor Gao’ersi bersama sopir di G318; akses ke lintasan lama atau titik pandang harus dikonfirmasi terpisah.', tianlu: 'Turun di area parkir titik pandang Tianlu 18 Bends pada ruas Yajiang ke Litang; jangan berhenti di tikungan.' },
    costs: [
      { label: 'Mobil antar kota', amount: 'Sesuai penawaran', detail: 'Masukkan waktu menunggu untuk titik foto dalam harga etape Xinduqiao ke Litang.', status: 'unconfirmed' },
      { label: 'Parkir titik pandang', amount: 'Perlu konfirmasi', detail: 'Belum ada tarif resmi terbaru yang berhasil diverifikasi untuk titik berhenti yang akan dipakai.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran 15 hingga 30 menit per titik berhenti.', bestTime: 'Siang dengan jarak pandang baik, mengikuti etape 14 November.',
    tips: ['Unduh peta sebelum berangkat dan simpan nama hotel Litang.', 'Ambil foto hanya dari area pandang atau parkir yang aman.'],
    cautions: ['Rute melewati lintasan tinggi; penutupan atau es dapat menambah waktu berkendara.'], sources: [roadSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'litang', name: 'Litang & biaranya', region: 'Sichuan', placeIds: ['litang', 'litang-monastery'],
    summary: 'Sore berjalan ringan di kota dataran tinggi dan kompleks Biara Litang.',
    gettingThere: { origin: 'Xinduqiao melalui G318', steps: ['Tiba dengan mobil dari Xinduqiao, lalu check-in atau titipkan barang di hotel.', 'Minta sopir mengantar ke 长青春科尔寺; lanjutkan berjalan mengikuti area biara yang dibuka.'], duration: 'Rencana PDF: sekitar 4 jam berkendara dari Xinduqiao, sebelum berhenti dan perubahan kondisi jalan.', sources: [litangSource.url, roadSource.url] },
    stopAccess: { litang: 'Gunakan hotel di kota sebagai titik mulai jalan santai; mobil lokal untuk jarak yang lebih jauh.', 'litang-monastery': 'Minta sopir menuju 长青春科尔寺 di sisi bukit kota, lalu cek akses aula dan kendaraan internal di pintu masuk.' },
    costs: [
      { label: 'Akses biara dan kendaraan internal', amount: 'Perlu konfirmasi', detail: 'Tarif terkini dan cakupan aula belum terverifikasi. Tanyakan sebelum menggunakan kendaraan atau pemandu internal.', status: 'unconfirmed' },
      { label: 'Mobil dan penginapan', amount: 'Sesuai reservasi', detail: 'Minta harga kamar berpemanas serta konfirmasi transfer dari hotel ke biara.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran 1 hingga 2 jam jalan santai dan kunjungan biara.', bestTime: 'Sore 14 November selama area kunjungan masih dibuka.',
    tips: ['Minta izin sebelum memotret di dalam aula atau memotret orang beribadah.', 'Siapkan bekal untuk keberangkatan ke Daocheng keesokan pagi.'],
    cautions: ['Litang sekitar 4.014 m menurut PDF dan merupakan malam menginap tertinggi dalam rute; hindari memaksakan aktivitas.'], sources: [litangSource, roadSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'haizi-shan', name: 'Haizi Shan & Sister Lakes', region: 'Sichuan', placeIds: ['haizi', 'sister-lakes'],
    summary: 'Batu glasial dan danau di lintasan menuju Daocheng. Sister Lakes berada pada cabang arah Batang dan perlu detur tersendiri.',
    gettingThere: { origin: 'Litang menuju Daocheng', steps: ['Ikuti mobil ke arah Daocheng dan minta singgah di titik Haizi Shan yang aman pada rute langsung.', 'Jika ingin Sister Lakes, tunjukkan pin 姊妹湖 kepada sopir dan minta perhitungan detur arah Batang sebelum meninggalkan Litang.', 'Tetap utamakan tiba di Riwa untuk beristirahat sebelum Yading.'], duration: 'PDF mengalokasikan sekitar 5 jam untuk Litang ke Riwa; detur Sister Lakes belum termasuk.', sources: [liyaRoadSource.url, haiziSource.url] },
    stopAccess: { haizi: 'Singgah dengan mobil pada rute Litang ke Daocheng; tetap dekat titik berhenti dan jalur yang aman.', 'sister-lakes': 'Dari Litang, cabang G318 arah Batang berbeda dari arah Daocheng. Kunjungan hanya jika tambahan jarak dan waktu disepakati dengan sopir.' },
    costs: [
      { label: 'Mobil dan detur Sister Lakes', amount: 'Perlu penawaran', detail: 'Jangan menganggap detur termasuk tarif Litang ke Riwa. Sepakati biaya dan batas waktu.', status: 'unconfirmed' },
      { label: 'Parkir atau akses titik danau', amount: 'Perlu konfirmasi', detail: 'Tarif terbaru belum terverifikasi; sumber pemerintah yang tersedia berasal dari 2018 dan tidak dipakai sebagai harga saat ini.', status: 'unconfirmed' },
    ],
    visitDuration: 'Saran 20 hingga 30 menit per pemberhentian; tanpa trek ke pedalaman.', bestTime: 'Pagi 15 November ketika melintas dan jalan dibuka.',
    tips: ['Bawa makanan dan air dari Litang untuk etape panjang.', 'Foto danau dari titik yang disepakati sopir; jangan keluar jalur mencari danau lain.'],
    cautions: ['Sister Lakes bukan pemberhentian otomatis pada rute langsung ke Daocheng.', 'Pembaruan pemerintah 17 Agustus 2026 menargetkan penyelesaian G227 pada November; konfirmasikan pekerjaan jalan dan pengaturan lalu lintas sebelum berangkat.', 'Kawasan sekitar 4.500 m menurut PDF; batasi aktivitas bila kondisi tubuh atau cuaca tidak mendukung.'], sources: [liyaRoadSource, haiziSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'daocheng', name: 'Daocheng & White Pagoda', region: 'Sichuan', placeIds: ['daocheng'],
    summary: 'Singgah di kompleks stupa putih dan isi bekal sebelum melanjutkan perjalanan ke Riwa.',
    gettingThere: { origin: 'Haizi Shan, pada perjalanan dari Litang', steps: ['Lanjutkan mobil ke Daocheng dan minta berhenti di 尊胜塔林, kompleks White Pagoda dekat jembatan Daocheng.', 'Setelah kunjungan, beli bekal lalu teruskan mobil ke hotel di Riwa.'], duration: 'Bagian dari etape Litang ke Riwa sekitar 5 jam menurut PDF, belum termasuk berhenti.', sources: [pagodaSource.url, liyaRoadSource.url, haiziSource.url] },
    stopAccess: { daocheng: 'Turun di area White Pagoda / 尊胜塔林 dekat jembatan Daocheng dan berjalan mengitari bagian yang terbuka.' },
    costs: [
      { label: 'White Pagoda', amount: 'CNY 0', detail: 'Trip.com mencantumkan masuk gratis. Cek papan setempat untuk perubahan atau layanan tambahan.', status: 'published', source: pagodaSource.url },
      { label: 'Parkir dan bekal', amount: 'Sesuai pemakaian', detail: 'Belanja bekal dua malam di Riwa dan hari kunjungan Yading; harga mengikuti toko.', status: 'unconfirmed' },
    ],
    visitDuration: 'Sekitar 30 menit di kompleks stupa, ditambah belanja bekal.', bestTime: 'Siang ketika melewati kota pada 15 November.',
    tips: ['Ikuti arah kunjungan dan petunjuk setempat di area stupa.', 'Konfirmasikan hotel tujuan di Riwa, bukan menginap di kota Daocheng.'],
    cautions: ['Riwa / Shangri-La Town di Sichuan berbeda dari Kota Shangri-La di Yunnan.'], sources: [pagodaSource, liyaRoadSource, haiziSource], checkedAt: '2026-11-03',
  },
  {
    slug: 'yading', name: 'Yading', region: 'Sichuan', placeIds: ['zhaguanbeng', 'chonggu', 'luorong', 'milk-lake', 'five-colour', 'pearl-lake'],
    summary: 'Bus pegunungan, padang Luorong dan jalur danau. Pilih panjang perjalanan setelah mengetahui pembukaan jalur hari itu.',
    gettingThere: { origin: 'Hotel di Riwa / Shangri-La Town, Sichuan', steps: ['Minta hotel mengatur antar ke pusat pengunjung Yading, lalu gunakan layanan bus yang berlaku menuju Zhaguanbeng.', 'Berjalan menuju Chonggu. Ke Luorong, pilih kendaraan listrik yang tersedia atau jalur jalan kaki.', 'Milk Lake dan Five-Colour Lake memerlukan trek lanjutan dari Luorong; pilih Pearl Lake dari cabang Chonggu bila jalur pendek dibuka.'], duration: 'Panduan pengelola yang disalin 25 Oktober menyebut trek danau atas dari Luorong sekitar 10 km pulang-pergi, 5 hingga 6 jam. Bus dan antrean di luar durasi ini.', sources: [yadingVisitorNotice.url, yadingReform.url] },
    stopAccess: { zhaguanbeng: 'Naik bus taman dari pusat pengunjung Riwa menuju titik turun Zhaguanbeng.', chonggu: 'Dari Zhaguanbeng, berjalan mengikuti jalur bertanda menuju Chonggu.', luorong: 'Dari kawasan Chonggu, gunakan kendaraan listrik menuju Luorong jika beroperasi atau ikuti jalur jalan kaki resmi.', 'milk-lake': 'Trek lanjutan dari Luorong hanya jika jalur atas dibuka; kendaraan listrik tidak mengantar sampai danau.', 'five-colour': 'Lanjutkan trek danau atas dari kawasan Milk Lake sesuai jalur yang diizinkan petugas; tidak ada jaminan akses pada 16 November.', 'pearl-lake': 'Ikuti percabangan jalur pendek dari Chonggu menuju Pearl Lake bila dibuka; ini alternatif terpisah dari trek Luorong ke danau atas.' },
    costs: [
      { label: 'Tiket kawasan', amount: 'Acuan awal CNY 146 / orang', detail: 'Pengumuman 14 April menyebut tarif ini sampai 25 November 2026. Promo gratis Agustus sampai Oktober menyusul; tarif final 16 November harus dicek saat reservasi.', status: 'estimate', source: yadingNotice.url },
      { label: 'Bus dan kendaraan listrik', amount: 'Perlu konfirmasi', detail: 'Kebijakan biaya berubah pada 2026. Jangan memakai total lama CNY 120 + CNY 80 atau menganggap promo gratis masih berlaku pada November.', status: 'unconfirmed', source: yadingPromotion.url },
      { label: 'Antar hotel ke pusat pengunjung', amount: 'Sesuai penawaran hotel', detail: 'Pastikan harga dan titik jemput pulang sebelum berangkat.', status: 'unconfirmed' },
    ],
    visitDuration: 'Satu hari; panjang trek dipilih sesuai kondisi dan pembukaan jalur.', bestTime: 'Berangkat pagi 16 November. Panduan 25 Oktober menyebut pemeriksaan menuju jalur atas berhenti menerima pengunjung pada 14.30; tanyakan pula jam bus terakhir.',
    tips: ['Hubungi taman di +86 836 6966022 untuk harga dan jalur yang berlaku pada tanggal kunjungan.', 'Bawa bekal halal, air, jaket dan lampu kecil; simpan informasi bus terakhir.', 'Tentukan jam putar balik sebelum mulai trek dan sisakan waktu kembali ke bus.'],
    cautions: ['Panduan pengelola yang disalin 25 Oktober menyebut jalur Milk Lake dan Five-Colour Lake tutup mulai 25 November hingga 15 April. Akses 16 November tetap bergantung cuaca dan keputusan petugas.', 'Milk Lake dan Five-Colour Lake sekitar 4.600 hingga 4.700 m menurut PDF. Pilih jalur pendek bila tubuh atau kondisi jalur tidak mendukung.'], sources: [yadingVisitorNotice, yadingNotice, yadingPromotion, yadingReform], checkedAt: '2026-11-03',
  },
  {
    slug: 'xiangcheng', name: 'Xiangcheng & Daxueshan', region: 'Sichuan', placeIds: ['xiangcheng', 'daxueshan'],
    summary: 'Rumah-rumah putih dan lintasan pegunungan pada etape panjang menuju Shangri-La di Yunnan.',
    gettingThere: { origin: 'Riwa, setelah dua malam di basis Yading', steps: ['Berangkat sekitar 07.00 sesuai rencana PDF dengan sopir yang menerima perjalanan lintas provinsi.', 'Lewati koridor Xiangcheng menuju Shangri-La, dengan jalur aktual dan titik Daxueshan dikonfirmasi sopir.', 'Akhiri perjalanan di hotel Dukezong, Yunnan; pastikan bukan kembali ke Shangri-La Town di Sichuan.'], duration: 'Rencana PDF: sekitar 8 jam di luar berhenti dan perubahan kondisi jalan.', sources: [xiangchengSource.url] },
    stopAccess: { xiangcheng: 'Singgah di tempat parkir desa atau kota yang disepakati sepanjang etape Riwa ke Yunnan; minta izin sebelum masuk rumah.', daxueshan: 'Pemberhentian lintasan mengikuti rute yang disetujui sopir hari itu. Turun hanya jika jalan terbuka dan ada tempat aman.' },
    costs: [
      { label: 'Mobil lintas provinsi', amount: 'Penawaran satu arah', detail: 'Minta harga sampai hotel Dukezong berikut biaya pengembalian kendaraan dan menginap sopir, bila ada.', status: 'unconfirmed' },
      { label: 'Singgah dan parkir', amount: 'Perlu konfirmasi', detail: 'Kunjungan lahan pribadi atau tambahan detur perlu disepakati; tidak ada tarif tunggal yang terverifikasi untuk etape ini.', status: 'unconfirmed' },
    ],
    visitDuration: 'Hari perjalanan; singgah singkat tanpa trek tambahan.', bestTime: 'Berangkat pagi agar sebagian besar etape ditempuh saat terang.',
    tips: ['Siapkan bekal dan unduh peta sebelum meninggalkan Riwa.', 'Simpan nama hotel Dukezong serta nomor sopir agar mudah dihubungi saat sinyal kembali.'],
    cautions: ['Akses Daxueshan masih perlu konfirmasi; bila tertutup, sepakati rute atau tempat bermalam dengan sopir.'], sources: [xiangchengSource], checkedAt: '2026-11-03',
  },
];
