import type { DestinationGuide } from '../guide-types.ts';

const airportBusNotice = 'https://www.sina.cn/news/detail/5334306341259096.html';
const airportTransport = 'https://flights.ctrip.com/booking/airport-tfu/jichangjiaotong.html';
const taikooLiAccess = 'https://www.taikooli-chengdu.com/en/AboutUs/ArrivalPattern';
const taikooLiOverview = 'https://www.swireproperties.com/en/portfolio/current-developments/taikoo-li-chengdu/taikoo-li-chengdu/';
const chunxiRoadGuide = 'https://realchengdu.com/en/attractions/Chunxi-Road';

export const chengduGuides: DestinationGuide[] = [
  {
    slug: 'chengdu',
    name: 'Chengdu: Chunxi Road & Taikoo Li',
    region: 'Sichuan',
    placeIds: ['chengdu'],
    summary: 'Sore pertama dimulai dari ramainya Chunxi Road, lalu melambat di gang terbuka Taikoo Li. Jalan santai, makan malam, dan kembali beristirahat di Chengdu.',
    gettingThere: {
      origin: 'Bandara Chengdu Tianfu (TFU), Minggu 8 November',
      steps: [
        'Setelah mendarat pukul 12.20 dengan penerbangan domestik dari Shanghai (imigrasi sudah di Pudong), ambil bagasi. Pilihan praktis adalah taksi resmi dari antrean di lantai dasar Terminal 2, pintu G04, menuju hotel di Chengdu; simpan alamat hotel dalam bahasa Mandarin dan titipkan koper sebelum berjalan-jalan.',
        'Alternatif hemat: bus bandara jalur 1 (机场巴士1号线) dari pintu G03 di lantai dasar Terminal 2 menuju Chunxi Road. Lanjutkan ke hotel sebelum memulai jalan santai.',
        'Mulai dari 春熙路, lalu berjalan ke 成都太古里 di No. 8 Middle Shamao Street. Dari lokasi lain di kota, Metro jalur 2 atau 3 berhenti di Chunxi Road, yang terhubung dengan Taikoo Li.',
        'Malamnya lanjutkan ke IFS atau Taikoo Li yang masih di kawasan Chunxi Road. Lihat pilihan mal beserta jam acuan dan sumbernya di bagian malam pertama. Pilih satu kawasan, makan malam, lalu kembali ke hotel di Chengdu; perjalanan antarkota dilanjutkan esok hari.',
      ],
      duration: 'Operator memberi acuan sekitar 80 menit untuk bus jalur 1. Waktu dari pesawat sampai hotel lebih panjang karena bagasi, menunggu kendaraan, lalu lintas, dan perjalanan terakhir ke hotel.',
      sources: [airportBusNotice, airportTransport, taikooLiAccess, taikooLiOverview],
    },
    stopAccess: {
      chengdu: 'Chunxi Road (春熙路) menjadi titik awal jalan kaki menuju gang dan plaza terbuka Taikoo Li (成都太古里). Rute santai ini adalah usulan untuk hari kedatangan; sesuaikan titik mulai dengan hotel dan kondisi setelah penerbangan.',
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
    visitDuration: 'Saran 2 sampai 3 jam untuk jalan santai dan makan malam, setelah menaruh koper di hotel.',
    bestTime: 'Sore sampai awal malam pada 8 November, sesuai waktu selesai check-in. Tidak perlu mengejar jam mulai tertentu.',
    tips: [
      'Simpan pin hotel dan nama 春熙路 serta 成都太古里 agar mudah kembali setelah menjelajah gang.',
      'Pilih satu kawasan saja pada hari kedatangan. Sisakan waktu duduk, makan, dan istirahat sebelum berangkat ke Jiuzhaigou esok hari.',
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
];
