import { days } from './itinerary.ts';

// Researched 3 November 2026; every option was re-checked by an independent pass for foreign-passport acceptance and location.
export interface StayLink { label: string; url: string; gallery?: boolean }
export interface Stay {
  kind: 'Hotel' | 'Hostel' | 'Guesthouse';
  name: string; chinese?: string; chineseAddress?: string;
  location: string; price: string; priceNote: string; foreignGuests: string;
  rooms?: string; halal?: string; reason: string;
  photo?: { id: string; alt: string };
  links: StayLink[];
  sources: { title: string; url: string }[];
}
export interface StayBase {
  id: string; name: string; area: string; notes: string[];
  areaPhoto: { id: string; alt: string; label: string };
  hotel: Stay; hostel: Stay;
}

export const staysCheckedAt = '2026-11-03';
export const staysPath = '/places/stays/';

export const stayBases: StayBase[] = [
  {
    id: 'chengdu', name: 'Chengdu', area: 'Pusat kota Jinjiang, sekitar Chunxi Road dan Taikoo Li.',
    notes: ['Belum ada sumber yang mencantumkan waktu taksi ke Chengdu East. Cek di aplikasi peta untuk menentukan jam berangkat 9 November pagi.'],
    areaPhoto: { id: 'chengdu-chunxi', alt: 'Jalan pejalan kaki Chunxi Road dengan bangunan berfasad emas dan pengunjung.', label: 'Foto kawasan: Chunxi Road, Chengdu. Bukan foto penginapan.' },
    hotel: {
      kind: 'Hotel', name: 'Mercure Chengdu Chunxi Taikoo Li', chinese: '成都太古里春熙美居酒店', chineseAddress: '四川成都锦江区暑袜北三街20号东楼',
      location: 'Inti Chunxi Road–Taikoo Li: sekitar 0,9 km ke Taikoo Li dan 0,7 km ke metro Taisheng South Road.',
      price: 'CNY 500–800 per malam', priceNote: 'Perkiraan Classic Queen Room 29 m² dari panduan Wanderinchina (pencarian 20–21 Oktober 2026) dan harga rata-rata Trip.com. Akhir pekan lebih mahal; sarapan CNY 58.',
      foreignGuests: 'Trip.com dan Ctrip: menerima tamu dari semua negara. Ada ulasan tamu Pakistan, Filipina, Australia, dan Malaysia pada akhir Oktober–November 2026.',
      rooms: 'Kamar berjendela di lantai 11–21. Penitipan bagasi gratis, parkir gratis untuk sopir (terbatas).',
      halal: 'Restoran 清真·雅君中国菜 tercantum di lantai 1 gedung yang sama menurut panduan China Dragon Tours. Cek sertifikasinya di lokasi.',
      reason: 'Hotel jaringan internasional bintang 4 di pusat Chunxi Road, dengan parkir untuk penjemputan pagi.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/chengdu-hotel-detail-21132716/mercure-chengdu-chunxi/', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://hotels.ctrip.com/hotels/21132716.html' }],
      sources: [
        { title: 'Trip.com – Mercure Chengdu Chunxi Taikoo Li', url: 'https://us.trip.com/hotels/chengdu-hotel-detail-21132716/mercure-chengdu-chunxi/' },
        { title: 'Ctrip – 成都太古里春熙美居酒店', url: 'https://hotels.ctrip.com/hotels/21132716.html' },
        { title: 'Wanderinchina – Where to stay in Chengdu', url: 'https://www.wanderinchina.com/destinations/chengdu/accommodation/chunxi-road-taikoo-li-hotels/' },
        { title: 'China Dragon Tours – Halal food in Chengdu', url: 'https://www.chinadragontours.com/top-muslim-halal-food-and-restaurants-in-chengdu.html' },
      ],
    },
    hostel: {
      kind: 'Hostel', name: 'POSHPACKER Chengdu Flipflop Hostel', chinese: 'POSHPACKER拖板鞋青年旅舍(成都太古里春熙路地铁站店)', chineseAddress: '四川成都锦江区东升街98号3楼',
      location: 'Dongsheng Street, 350 m ke metro Chunxi Road dan sekitar 650 m ke Taikoo Li. Hostelworld menulis No. 96, sumber lain No. 98; pastikan ke hostel sebelum memberi alamat ke sopir.',
      price: 'CNY 140–400 per malam', priceNote: 'Perkiraan kamar privat dengan kamar mandi dari Kayak dan Trip.com (jendela 5–11 November). Belum harga untuk 8 November 2026.',
      foreignGuests: 'Trip.com dan Ctrip: menerima tamu dari semua negara. Hostelworld 9,5 dari 1.605 ulasan, termasuk tamu Prancis, AS, dan Inggris pada September–Oktober 2026.',
      rooms: 'Kamar privat 15–18 m² dengan kamar mandi sendiri, tanpa sarapan. Penitipan bagasi tersedia. Check-in di Hostelworld 14.00–23.00; kabari jika datang larut.',
      halal: 'YallaYalla (清真, makanan Timur Tengah) di Dongsheng Street No. 26, satu jalan dengan hostel, menurut China Dragon Tours.',
      reason: 'Hostel lama bernilai tinggi, beberapa menit jalan kaki ke metro Chunxi Road dan Taikoo Li.',
      links: [{ label: 'Hostelworld', url: 'https://www.hostelworld.com/hostels/p/71994/poshpacker-chengdu-flipflop-hostel/', gallery: true }, { label: 'Trip.com', url: 'https://uk.trip.com/hotels/chengdu-hotel-detail-2337988/poshpacker-flipflop-youth-hostel-taikoo-li-chunxi-road-metro-station' }, { label: 'Ctrip (Mandarin)', url: 'https://hotels.ctrip.com/hotels/2337988.html' }],
      sources: [
        { title: 'Hostelworld – POSHPACKER Chengdu Flipflop Hostel', url: 'https://www.hostelworld.com/hostels/p/71994/poshpacker-chengdu-flipflop-hostel/' },
        { title: 'Trip.com – Poshpacker Flipflop Youth Hostel', url: 'https://uk.trip.com/hotels/chengdu-hotel-detail-2337988/poshpacker-flipflop-youth-hostel-taikoo-li-chunxi-road-metro-station' },
        { title: 'Kayak – Chengdu Flipflop Hostel', url: 'https://www.kayak.com/Chengdu-Hotels-Chengdu-Flipflop-Hostel.544941.ksp' },
        { title: 'China Dragon Tours – Halal food in Chengdu', url: 'https://www.chinadragontours.com/top-muslim-halal-food-and-restaurants-in-chengdu.html' },
      ],
    },
  },
  {
    id: 'jiuzhaigou', name: 'Jiuzhaigou', area: 'Desa Pengfeng (Goukou), dekat gerbang utama Jiuzhaigou.',
    notes: ['Hostelworld tidak mencantumkan hostel di Jiuzhaigou, jadi pilihan hemat berupa homestay kamar privat.'],
    areaPhoto: { id: 'highlight-jiuzhaigou', alt: 'Danau di Jiuzhaigou memantulkan hutan musim gugur dan pegunungan.', label: 'Foto kawasan: lembah Jiuzhaigou, bukan Desa Pengfeng.' },
    hotel: {
      kind: 'Hotel', name: 'Holiday Inn Express Jiuzhaigou by IHG', chinese: '智选假日酒店(九寨沟风景区店)',
      location: 'Pengfeng Village Group 1, sekitar 5–10 menit (±700 m) jalan kaki ke gerbang taman.',
      price: 'CNY 590–700 per malam', priceNote: 'Perkiraan Standard Mountain View 25 m² dari Booking.com dan Trip.com tanpa tanggal; sarapan CNY 38.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara, staf berbahasa Inggris. Bisa dipesan di Booking.com (8,5 dari 601 ulasan); ada ulasan tamu AS dan Korea pada Oktober 2026.',
      rooms: 'Penitipan bagasi gratis. Tamu 2 November 2026 menyebut pemanas dipakai pada malam hari. Parkir umum terbatas untuk sopir.',
      halal: 'Belum ada restoran halal bernama yang terverifikasi. Ulasan September 2025 menyebut beberapa restoran 清真 di Desa Pengfeng.',
      reason: 'Hotel merek internasional paling dekat ke gerbang utama, dengan parkir untuk penjemputan 10 November.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/jiuzhaigou-hotel-detail-54687270/holiday-inn-express-jiuzhaigou-by-ihg/', gallery: true }, { label: 'Booking.com', url: 'https://www.booking.com/hotel/cn/holiday-inn-express-jiuzhaigou.html' }],
      sources: [
        { title: 'Trip.com – Holiday Inn Express Jiuzhaigou by IHG', url: 'https://us.trip.com/hotels/jiuzhaigou-hotel-detail-54687270/holiday-inn-express-jiuzhaigou-by-ihg/' },
        { title: 'Booking.com – Hotel di Jiuzhaigou', url: 'https://www.booking.com/city/cn/jiuzhaigou.html' },
        { title: 'Sichuan Travel Guide – Jiuzhaigou accommodations', url: 'https://www.sichuantravelguide.com/jiuzhaigou/food-and-accommodations.html' },
        { title: 'Trip.com – Ulasan Yong Le Inn (restoran 清真)', url: 'https://ph.trip.com/hotels/jiuzhaigou-hotel-detail-8030595/yong-le-inn/review.html' },
      ],
    },
    hostel: {
      kind: 'Guesthouse', name: 'Yike Travel Homestay', chinese: '忆客旅行民宿(九寨沟景区游客中心店)', chineseAddress: '九寨沟漳扎镇彭丰村1组79号',
      location: 'Desa Pengfeng dekat pusat pengunjung; tamu memperkirakan 15–20 menit jalan kaki ke gerbang.',
      price: 'CNY 520 per malam', priceNote: 'Satu-satunya angka berupa rata-rata Trip.com tanpa tanggal dan jenis kamar. Harga 9 November di luar musim ramai bisa lebih rendah.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Malaysia pada September dan Oktober 2026.',
      rooms: 'Semua kamar privat 25–30 m² dengan kamar mandi sendiri, tanpa sarapan. Parkir, penitipan bagasi, dan binatu gratis. Staf hanya berbahasa Mandarin.',
      reason: 'Homestay kamar privat yang dibuka 2024, bernilai 9,5 di Trip.com, dan masih terjangkau jalan kaki ke gerbang.',
      links: [{ label: 'Trip.com', url: 'https://au.trip.com/hotels/jiuzhaigou-hotel-detail-119267554/jiu-zhai-gou-yi-ke-lv-xing-min-su', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://m.ctrip.com/html5/hotel/hoteldetail/119267554.html' }],
      sources: [
        { title: 'Trip.com – Yike Travel Homestay', url: 'https://au.trip.com/hotels/jiuzhaigou-hotel-detail-119267554/jiu-zhai-gou-yi-ke-lv-xing-min-su' },
        { title: 'Ctrip – 忆客旅行民宿(九寨沟景区游客中心店)', url: 'https://m.ctrip.com/html5/hotel/hoteldetail/119267554.html' },
      ],
    },
  },
  {
    id: 'rilong', name: 'Rilong', area: 'Kota Rilong, kini bernama Siguniangshan Town, di kaki Siguniangshan.',
    notes: ['Hindari T & Q International Youth Hostel dan Cina Boutique Homestay: listing Trip.com-nya hanya menerima dokumen daratan Tiongkok.'],
    areaPhoto: { id: 'siguniang', alt: 'Puncak bersalju Siguniangshan menjulang di atas pegunungan.', label: 'Foto kawasan: Siguniangshan di atas Rilong. Bukan foto penginapan.' },
    hotel: {
      kind: 'Hotel', name: 'Vienna Hotel (Siguniangshan Scenic Area)', chinese: '维也纳酒店(四姑娘山景区店)', chineseAddress: '小金四姑娘山镇金峰村一组8号',
      location: 'Desa Jinfeng, sekitar 660 m dari pusat Rilong; Shuangqiaogou sekitar 15 menit berkendara. Listing memuat dua alamat, jadi cocokkan pin dengan sopir.',
      price: 'CNY 470 per malam', priceNote: 'Rata-rata Trip.com untuk kamar termurah, tanpa tanggal; sarapan CNY 38.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan keluarga Thailand pada 20 Oktober 2026.',
      rooms: 'Dibuka 2025. Tipe kamar dengan suplai oksigen difus; satu ulasan menyebut kamar cukup hangat.',
      reason: 'Hotel baru dengan oksigen di kamar untuk malam pertama di 3.200 m.',
      links: [{ label: 'Trip.com', url: 'https://nz.trip.com/hotels/xiaojin-hotel-detail-131705291/vienna-hotel', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://m.ctrip.com/html5/hotel/hoteldetail/131705291.html' }],
      sources: [
        { title: 'Trip.com – Vienna Hotel (Siguniangshan Scenic Area)', url: 'https://nz.trip.com/hotels/xiaojin-hotel-detail-131705291/vienna-hotel' },
        { title: 'Ctrip – 维也纳酒店(四姑娘山景区店)', url: 'https://m.ctrip.com/html5/hotel/hoteldetail/131705291.html' },
      ],
    },
    hostel: {
      kind: 'Guesthouse', name: 'Snow Mountain Love Homestay', chinese: '四姑娘山雪山情民宿',
      location: 'Fengqing Street No. 22, sekitar 300 m dari pusat Rilong.',
      price: 'CNY 290 per malam', priceNote: 'Rata-rata Trip.com untuk kamar privat, tanpa tanggal.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Malaysia pada Juli dan September 2026.',
      rooms: 'Kamar privat dengan kamar mandi sendiri, pemanas lantai, dan selimut listrik; tanpa oksigen dan sarapan. Parkir untuk sopir belum jelas, tanyakan saat memesan.',
      reason: 'Kamar privat berpemanas di pusat Rilong.',
      links: [{ label: 'Trip.com', url: 'https://au.trip.com/hotels/xiaojin-hotel-detail-1360294/si-gu-niang-shan-xue-shan-qing-bin-guan', gallery: true }],
      sources: [{ title: 'Trip.com – Siguniangshan Snow Mountain Love Homestay', url: 'https://au.trip.com/hotels/xiaojin-hotel-detail-1360294/si-gu-niang-shan-xue-shan-qing-bin-guan' }],
    },
  },
  {
    id: 'danba', name: 'Danba', area: 'Kota Danba (Zhanggu Town) di dasar lembah.',
    notes: ['Belum ada restoran halal yang terverifikasi di Danba.'],
    areaPhoto: { id: 'jiaju-refreshed', alt: 'Panorama Desa Jiaju dengan rumah Tibet berbingkai putih-merah, ladang hijau, dan jalan berkelok di lereng bukit.', label: 'Foto kawasan: Desa Jiaju, sekitar 5 km dari pusat Danba.' },
    hotel: {
      kind: 'Hotel', name: 'HanTing Hotel (Ganzi Danba)', chinese: '汉庭酒店(甘孜丹巴县店)', chineseAddress: '丹巴章谷镇三岔河北路62号',
      location: 'Sanchahe North Road, sekitar 140–220 m dari Menara Kuno Danba dan 730 m dari terminal bus.',
      price: 'CNY 380–400 per malam', priceNote: 'Rata-rata Trip.com untuk Queen Room pada jendela 5–11 November; sarapan CNY 25.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan pasangan Inggris pada 1 November 2026.',
      rooms: 'Dibuka 2024. Penitipan bagasi dan parkir gratis (terbatas); tamu melaporkan lift mobil yang sulit.',
      reason: 'Hotel jaringan baru di pusat kota Danba.',
      links: [{ label: 'Trip.com', url: 'https://ph.trip.com/hotels/danba-hotel-detail-119309124/han-ting-jiu-dian', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://m.ctrip.com/html5/hotel/hoteldetail/119309124.html' }],
      sources: [
        { title: 'Trip.com – HanTing Hotel (Ganzi Danba)', url: 'https://ph.trip.com/hotels/danba-hotel-detail-119309124/han-ting-jiu-dian' },
        { title: 'Ctrip – 汉庭酒店(甘孜丹巴县店)', url: 'https://m.ctrip.com/html5/hotel/hoteldetail/119309124.html' },
      ],
    },
    hostel: {
      kind: 'Guesthouse', name: 'Danba Yun Road Shanxi Homestay', chinese: '丹巴云路山息民宿',
      location: 'Lantai 11 gedung Jiarong Huating, Sanchahe South Road No. 127; sekitar 3 km dari Desa Zhonglu.',
      price: 'CNY 230 per malam', priceNote: 'Rata-rata Trip.com untuk Elegant Room with View. Pembayaran di tempat secara tunai.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan pelancong solo AS pada Mei 2026.',
      rooms: 'Lima kamar privat (queen atau twin) dengan pemanas dan selimut listrik, tanpa sarapan. Baru sembilan ulasan, jadi konfirmasi ulang sebelum memesan.',
      reason: 'Kamar berpemanas dengan pemandangan lembah, dekat jalan ke Zhonglu.',
      links: [{ label: 'Trip.com', url: 'https://uk.trip.com/hotels/danba-hotel-detail-130787724/dan-ba-yun-lu-shan-xi-min-su', gallery: true }],
      sources: [{ title: 'Trip.com – Danba Yun Road Shanxi Homestay', url: 'https://uk.trip.com/hotels/danba-hotel-detail-130787724/dan-ba-yun-lu-shan-xi-min-su' }],
    },
  },
  {
    id: 'xinduqiao', name: 'Xinduqiao', area: 'Kota Xinduqiao di jalur G318, basis dua malam.',
    notes: ['Hindari Shengshi Tianhua Hotel dan Shuyunge Homestay: listing-nya hanya menerima dokumen daratan Tiongkok.'],
    areaPhoto: { id: 'xinduqiao', alt: 'Barisan pohon kuning di tepi aliran air dan lereng cokelat Xinduqiao.', label: 'Foto kawasan: Xinduqiao. Bukan foto penginapan.' },
    hotel: {
      kind: 'Hotel', name: 'JI Hotel Xinduqiao G318', chinese: '全季酒店(康定新都桥318国道店)', chineseAddress: '四川康定新都桥镇岗邱上街579号',
      location: 'Di G318 dalam kota, sekitar 1,1 km dari terminal bus Zhexi.',
      price: 'CNY 469 per malam', priceNote: 'Rata-rata Trip.com untuk tujuh hari ke depan per 3 November 2026, bukan harga 12–13 November. Trip.com dan Ctrip menulis sarapan dihentikan 30 Oktober–30 November 2026.',
      foreignGuests: 'Trip.com dan Ctrip: menerima tamu dari semua negara, tetapi belum ada ulasan tamu asing yang terlihat. Check-in memakai pembaca KTP elektronik; minta paspor didaftarkan manual.',
      rooms: 'Dibuka 2024. Peralatan oksigen dan pemanas lantai; resepsionis 24 jam untuk keberangkatan subuh ke Yuzixi. Parkir gratis.',
      reason: 'Oksigen, pemanas, dan resepsionis 24 jam untuk dua malam di 3.300 m.',
      links: [{ label: 'Trip.com', url: 'https://www.trip.com/hotels/kangding-hotel-detail-116452805/quan-ji-jiu-dian/?curr=CNY&locale=en-US', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://hotels.ctrip.com/hotels/116452805.html' }],
      sources: [
        { title: 'Trip.com – JI Hotel Kangding Xinduqiao Town G318', url: 'https://www.trip.com/hotels/kangding-hotel-detail-116452805/quan-ji-jiu-dian/?curr=CNY&locale=en-US' },
        { title: 'Ctrip – 全季酒店(康定新都桥318国道店)', url: 'https://hotels.ctrip.com/hotels/116452805.html' },
      ],
    },
    hostel: {
      kind: 'Guesthouse', name: 'Gelaixi Homestay', chinese: '新都桥阁来喜民宿', chineseAddress: '四川康定新都桥镇摄影路一段112号',
      location: 'Pusat kota, sekitar 350 m dari terminal bus Zhexi. Tamu Australia (Oktober 2026) menyarankan menelepon pemilik karena lokasinya sulit dicari.',
      price: 'CNY 202 per malam', priceNote: 'Rata-rata Trip.com kamar privat untuk tujuh hari ke depan per 3 November 2026.',
      foreignGuests: 'Trip.com dan Ctrip: menerima tamu dari semua negara. Ada ulasan tamu Israel, Malaysia, dan Australia pada 2025–2026.',
      rooms: 'Semua kamar privat bergaya Tibet dengan kamar mandi sendiri dan pemanas lantai. Satu tamu dibekali mesin oksigen oleh pemilik.',
      reason: 'Homestay hangat di pusat kota dengan tamu asing yang terdokumentasi.',
      links: [{ label: 'Trip.com', url: 'https://in.trip.com/hotels/kangding-hotel-detail-107197226/xin-dou-qiao-ge-lai-xi-min-su', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://hotels.ctrip.com/hotels/107197226.html' }],
      sources: [
        { title: 'Trip.com – Xinduqiao Town Gelaixi Homestay', url: 'https://in.trip.com/hotels/kangding-hotel-detail-107197226/xin-dou-qiao-ge-lai-xi-min-su' },
        { title: 'Ctrip – 新都桥阁来喜民宿', url: 'https://hotels.ctrip.com/hotels/107197226.html' },
      ],
    },
  },
  {
    id: 'litang', name: 'Litang', area: 'Kota Litang di 4.014 m, dekat kota tua dan biara.',
    notes: ['Hindari Litang Snowland Hostel: Trip.com menulis hanya menerima KTP daratan Tiongkok.'],
    areaPhoto: { id: 'litang', alt: 'Kompleks Biara Litang dengan atap emas di lereng perbukitan.', label: 'Foto kawasan: Biara Litang di atas kota.' },
    hotel: {
      kind: 'Hotel', name: 'Litang Yalong Hotel', chinese: '理塘雅砻酒店', chineseAddress: '四川理塘新318线西段21号',
      location: 'Jalan G318 baru bagian barat, sekitar 1 km dari kota tua dan 2,7 km dari Biara Litang.',
      price: 'CNY 566 per malam', priceNote: 'Rata-rata Trip.com untuk tujuh hari ke depan per 3 November 2026; sarapan CNY 25.',
      foreignGuests: 'Trip.com dan Ctrip: menerima tamu dari semua negara. Ada ulasan keluarga Spanyol pada Agustus 2026.',
      rooms: 'Bintang 4, oksigen difus di seluruh hotel, dan pemanas lantai. Parkir gratis, penitipan bagasi, resepsionis 24 jam.',
      reason: 'Oksigen dan pemanas di seluruh hotel untuk malam tertinggi perjalanan.',
      links: [{ label: 'Trip.com', url: 'https://www.trip.com/hotels/litang-hotel-detail-96199114/litang-yalong-hotel/', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://hotels.ctrip.com/hotels/96199114.html' }],
      sources: [
        { title: 'Trip.com – Litang Yalong Hotel', url: 'https://www.trip.com/hotels/litang-hotel-detail-96199114/litang-yalong-hotel/' },
        { title: 'Ctrip – 理塘雅砻酒店', url: 'https://hotels.ctrip.com/hotels/96199114.html' },
      ],
    },
    hostel: {
      kind: 'Hostel', name: 'Summer in Litang · Starry Sky Courtyard', chinese: '理塘的夏天·星空庭院美宿', chineseAddress: '四川理塘车马村1号',
      location: 'Di kota tua, sekitar 450 m dari Qianhu Zangzhai dan 1 km dari biara.',
      price: 'CNY 183 per malam', priceNote: 'Harga termurah Trip.com, kemungkinan untuk ranjang dorm. Kamar privat king belum memiliki harga dan kemungkinan lebih mahal.',
      foreignGuests: 'Trip.com dan Ctrip: menerima tamu dari semua negara. Ada ulasan tamu Swiss, Irlandia, Belanda, dan AS pada 2026.',
      rooms: 'Kamar privat king 30 m² dengan kamar mandi, juga dorm 8 ranjang khusus perempuan. Pemanas tidak tercantum dan ulasan menyebut kurang hangat; minta selimut listrik. Parkir CNY 10.',
      reason: 'Hostel ramah tamu asing yang paling terdokumentasi di kota tua Litang.',
      links: [{ label: 'Trip.com', url: 'https://ph.trip.com/hotels/litang-hotel-detail-78827224/summer-youth-hostel-in-litang', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://hotels.ctrip.com/hotels/78827224.html' }],
      sources: [
        { title: 'Trip.com – Summer in Litang · Starry Sky Courtyard', url: 'https://ph.trip.com/hotels/litang-hotel-detail-78827224/summer-youth-hostel-in-litang' },
        { title: 'Ctrip – 理塘的夏天·星空庭院美宿', url: 'https://hotels.ctrip.com/hotels/78827224.html' },
      ],
    },
  },
  {
    id: 'riwa', name: 'Riwa', area: 'Shangri-La Town (dulu Riwa), Daocheng, Sichuan: kota gerbang Yading di ±2.900 m.',
    notes: ['Pastikan kamar berpemanas untuk dua malam. Beberapa penginapan di kota ini, seperti Xianggeli Theme Hotel dan Tiewa Hostel, hanya menerima dokumen daratan Tiongkok.'],
    areaPhoto: { id: 'luorong', alt: 'Aliran air berkelok melintasi padang rumput keemasan Luorong di bawah puncak bersalju.', label: 'Foto kawasan: Padang Luorong di Yading, tujuan dari Riwa. Bukan foto kota Riwa.' },
    hotel: {
      kind: 'Hotel', name: 'Holiday Inn Express Daocheng Yading by IHG', chinese: '稻城亚丁智选假日套房酒店',
      location: 'Sisi tenang kota, sekitar 1,2 km dari alun-alun budaya dan 1,6 km dari terminal bus Yading. Alamat berbeda antarsumber (Chituhe Road No. 34 atau Echu Road No. 26); minta alamat Mandarin ke hotel.',
      price: 'CNY 250–550 per malam', priceNote: 'Perkiraan dari Kayak dan ulasan tamu September 2026; sarapan CNY 68.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Hotel bermerek IHG.',
      rooms: 'Ulasan Oktober 2026 menyebut pemanas lantai dan suplai oksigen, meski tidak tercantum resmi. Parkir gratis.',
      reason: 'Hotel merek internasional di kota gerbang Yading, dengan parkir untuk sopir.',
      links: [{ label: 'Trip.com', url: 'https://ph.trip.com/hotels/daocheng-hotel-detail-8429973/holiday-inn-express-daocheng-yading', gallery: true }, { label: 'Situs resmi IHG', url: 'https://www.ihg.com/holidayinnexpress/hotels/us/en/ganzi/ctudy/hoteldetail/directions' }, { label: 'Kayak', url: 'https://www.kayak.com/Xianggelila-Hotels-Holiday-Inn-Express-Daocheng-Yading.2845181.ksp' }],
      sources: [
        { title: 'Trip.com – Holiday Inn Express Daocheng Yading by IHG', url: 'https://ph.trip.com/hotels/daocheng-hotel-detail-8429973/holiday-inn-express-daocheng-yading' },
        { title: 'Trip.com – Ulasan Holiday Inn Express Daocheng Yading', url: 'https://ph.trip.com/hotels/daocheng-hotel-detail-8429973/holiday-inn-express-daocheng-yading/review.html' },
        { title: 'Kayak – Holiday Inn Express Daocheng Yading', url: 'https://www.kayak.com/Xianggelila-Hotels-Holiday-Inn-Express-Daocheng-Yading.2845181.ksp' },
      ],
    },
    hostel: {
      kind: 'Guesthouse', name: 'Four Seasons Lotus Inn', chinese: '稻城亚丁香格里拉镇四季莲花客栈',
      location: 'Pusat kota, 170 m dari terminal bus Yading.',
      price: 'CNY 200–350 per malam', priceNote: 'Perkiraan kamar privat dari rata-rata Trip.com; pastikan harga 15–17 November.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Singapura dan Thailand pada 2026.',
      rooms: 'Semua kamar privat dengan kamar mandi. Pilih tipe “Heated Floor” yang bebas rokok untuk dua malam; ada juga tipe kamar dengan oksigen.',
      reason: 'Penginapan bernilai 9,5 dekat terminal bus Yading, praktis untuk bus taman pagi.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/daocheng-hotel-detail-3042991/four-season-lotus-inn/', gallery: true }],
      sources: [
        { title: 'Trip.com – Four Seasons Lotus Inn', url: 'https://us.trip.com/hotels/daocheng-hotel-detail-3042991/four-season-lotus-inn/' },
        { title: 'Trip.com – Ulasan Four Seasons Lotus Inn', url: 'https://us.trip.com/hotels/daocheng-hotel-detail-3042991/four-season-lotus-inn/review.html' },
      ],
    },
  },
  {
    id: 'shangri-la', name: 'Shangri-La', area: 'Kota tua Dukezong, Shangri-La, Yunnan; bukan Riwa di Sichuan.',
    notes: [],
    areaPhoto: { id: 'dukezong', alt: 'Jalan dan bangunan Tibet di kawasan kota tua Dukezong.', label: 'Foto kawasan: kota tua Dukezong. Bukan foto penginapan.' },
    hotel: {
      kind: 'Hotel', name: 'Atour Hotel Dukezong Moonlight Square', chinese: '香格里拉独克宗古城月光广场亚朵见野酒店',
      location: 'Tepi kota tua, sekitar 370 m (8 menit jalan kaki) ke Taman Guishan. Hotel berada di lereng dan tamu Oktober 2026 kesulitan memesan taksi; kirim pin ke sopir.',
      price: 'CNY 520–770 per malam', priceNote: 'Perkiraan dari harga mulai dan rata-rata Trip.com; sarapan CNY 48.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Inggris dan AS pada 2026.',
      rooms: 'Dibuka 2026. Pemanas lantai dan oksigen di setiap kamar, parkir gratis. Tamu Oktober 2026 melaporkan renovasi; tanyakan apakah masih berlangsung pada 17 November.',
      reason: 'Pemanas dan oksigen untuk malam di bawah nol pada 3.300 m.',
      links: [{ label: 'Trip.com', url: 'https://my.trip.com/hotels/shangri-la-hotel-detail-133284805/shangri-la-dukezong-ancient-city-moonlight-square-atour-hotel/', gallery: true }],
      sources: [
        { title: 'Trip.com – Atour Hotel Dukezong Moonlight Square', url: 'https://my.trip.com/hotels/shangri-la-hotel-detail-133284805/shangri-la-dukezong-ancient-city-moonlight-square-atour-hotel/' },
        { title: 'Trip.com – Hotel dekat Dukezong', url: 'https://au.trip.com/hotels/shangri-la-dukezong-ancient-town/hotels-c660m10656858/' },
      ],
    },
    hostel: {
      kind: 'Hostel', name: 'Tavern Hostel (Tavern 47)', chinese: '香格里拉仁和客栈',
      location: 'Sisi utara kota tua, sekitar 380 m dari roda doa Guishan. Mobil berhenti di ujung gang.',
      price: 'CNY 130 per malam', priceNote: 'Harga termurah Trip.com tanpa jenis kamar; kamar dobel privat belum memiliki harga.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Thailand, Inggris, dan Australia pada 2026; juga terdaftar di Hostelworld.',
      rooms: 'Kamar dobel privat 20 m² dengan kamar mandi, juga dorm. Pemanas tidak tercantum; tanyakan sebelum memesan untuk malam di bawah nol.',
      reason: 'Hostel kecil di kota tua dengan banyak tamu asing tahun ini.',
      links: [{ label: 'Hostelworld', url: 'https://www.hostelworld.com/hostels/p/25625/tavern-47/', gallery: true }, { label: 'Trip.com', url: 'https://us.trip.com/hotels/shangri-la-hotel-detail-6971590/ren-he-ke-zhan/' }],
      sources: [
        { title: 'Trip.com – Tavern Hostel', url: 'https://us.trip.com/hotels/shangri-la-hotel-detail-6971590/ren-he-ke-zhan/' },
        { title: 'Hostelworld – Tavern 47', url: 'https://www.hostelworld.com/hostels/p/25625/tavern-47/' },
      ],
    },
  },
  {
    id: 'lijiang', name: 'Lijiang', area: 'Sekitar Kota Tua Lijiang (Dayan). Kota tua bebas mobil; taksi berhenti di gerbang.',
    notes: ['Pilih penginapan yang bisa dijangkau mobil agar penjemputan Jade Dragon dan pengambilan bagasi tidak tertahan di gerbang.'],
    areaPhoto: { id: 'dayan', alt: 'Kanal dan jalan batu di Kota Tua Lijiang.', label: 'Foto kawasan: kanal Kota Tua Lijiang. Bukan foto penginapan.' },
    hotel: {
      kind: 'Hotel', name: 'Atour Hotel Lijiang Gucheng Dashuiche', chinese: '丽江古城大水车亚朵酒店',
      location: 'Minzhu Road di gerbang utara kota tua, di jalan yang bisa dilalui mobil; 250 m dari Kincir Air Besar.',
      price: 'CNY 400–690 per malam', priceNote: 'Perkiraan dari halaman Trip.com untuk 31 Oktober–6 November; sarapan CNY 48.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Malaysia, Thailand, dan Singapura pada Oktober 2026.',
      rooms: 'Dibuka 2021, 108 kamar. Penitipan bagasi gratis; parkir gratis tetapi perlu reservasi. Pemanas tidak tercantum.',
      reason: 'Sopir bisa menjemput di pintu untuk Jade Dragon dan ke stasiun, sementara kota tua tepat di seberang jalan.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/lijiang-hotel-detail-78826841/atour-hotel-lijiang-gucheng-dashuiche/', gallery: true }],
      sources: [
        { title: 'Trip.com – Atour Hotel LiJiang Gucheng Dashuiche', url: 'https://us.trip.com/hotels/lijiang-hotel-detail-78826841/atour-hotel-lijiang-gucheng-dashuiche/' },
        { title: 'Angie Magazine – Where to stay in Lijiang Old Town', url: 'https://angiemagazine.com/where-to-stay-lijiang-old-town/' },
      ],
    },
    hostel: {
      kind: 'Guesthouse', name: 'Mama Naxi Guesthouse (Lijingwan)', chinese: '妈妈纳西民宿(丽江丽景湾店)',
      location: 'Di luar kota tua, 11–15 menit jalan kaki ke arah tenggara dan 300 m dari terminal bus. Tanyakan apakah mobil bisa sampai ke pintu.',
      price: 'CNY 130–175 per malam', priceNote: 'Perkiraan kamar dobel dari Kayak dan Trip.com; sarapan Barat dibayar terpisah.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara; resepsionis berbahasa Inggris. Ada ulasan tamu Spanyol dan Belgia pada 2026.',
      rooms: 'Kamar privat dengan kamar mandi dan pemanas di setiap kamar; ada juga dorm 8 ranjang. Penitipan bagasi dan resepsionis 24 jam.',
      reason: 'Guesthouse lama untuk pelancong asing, di luar zona bebas mobil.',
      links: [{ label: 'Trip.com', url: 'https://id.trip.com/hotels/lijiang-hotel-detail-61483794/ma-ma-na-xi-min-su', gallery: true }, { label: 'Kayak', url: 'https://www.kayak.com/Lijiang-Hotels-Mama-Naxi-Guesthouse.2468671.ksp' }],
      sources: [
        { title: 'Trip.com – Mama Naxi Guesthouse', url: 'https://id.trip.com/hotels/lijiang-hotel-detail-61483794/ma-ma-na-xi-min-su' },
        { title: 'Kayak – Mama Naxi Guesthouse', url: 'https://www.kayak.com/Lijiang-Hotels-Mama-Naxi-Guesthouse.2468671.ksp' },
      ],
    },
  },
  {
    id: 'dali', name: 'Dali', area: 'Dekat gerbang Kota Tua Dali. Kereta dari Lijiang tiba di Stasiun Dali, sekitar 17 km dari penginapan.',
    notes: ['Tiba malam: kabari penginapan jam kedatangan kereta.'],
    areaPhoto: { id: 'highlight-dali', alt: 'Gerbang selatan Kota Tua Dali diterangi cahaya keemasan di bawah langit biru malam.', label: 'Foto kawasan: gerbang selatan Kota Tua Dali.' },
    hotel: {
      kind: 'Hotel', name: 'Hilton Garden Inn Dali Ancient City', chinese: '大理古城希尔顿花园酒店',
      location: 'Ujung utara Sanyue Street, 680 m dari Gerbang Cangshan; sekitar 13 menit jalan kaki ke Gerbang Utara.',
      price: 'CNY 430–700 per malam', priceNote: 'Perkiraan dari rata-rata Trip.com (5–11 November) dan Expedia; sarapan CNY 88.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Jepang pada 1 November 2026; juga terdaftar di Booking.com.',
      rooms: 'Dibuka 2024. Resepsionis 24 jam untuk kedatangan malam dan parkir gratis.',
      reason: 'Resepsionis 24 jam dan parkir untuk kedatangan kereta malam.',
      links: [{ label: 'Trip.com', url: 'https://ph.trip.com/hotels/dali-hotel-detail-123840697/hilton-garden-inn-dali-ancient-city', gallery: true }, { label: 'Situs resmi Hilton', url: 'https://www.hilton.com/en/hotels/dluacgi-hilton-garden-inn-dali-ancient-city/' }],
      sources: [
        { title: 'Trip.com – Hilton Garden Inn Dali Ancient City', url: 'https://ph.trip.com/hotels/dali-hotel-detail-123840697/hilton-garden-inn-dali-ancient-city' },
        { title: 'Hilton – Hilton Garden Inn Dali Ancient City', url: 'https://www.hilton.com/en/hotels/dluacgi-hilton-garden-inn-dali-ancient-city/' },
        { title: 'Expedia – Hilton Garden Inn Dali Ancient City', url: 'https://www.expedia.com/Hilton-Garden-Inn-Dali-Ancient-City.h107162811.Hotel-Information' },
      ],
    },
    hostel: {
      kind: 'Hostel', name: 'Dali Lily International Youth Hostel', chinese: '大理百合国际青年旅舍(大理古城店)',
      location: 'Desa Ximen, 200 m dari Gerbang Honglongjing di sisi barat kota tua.',
      price: 'CNY 70 per malam', priceNote: 'Harga termurah termasuk ranjang dorm. Kamar queen privat belum memiliki harga dan lebih mahal.',
      foreignGuests: 'Hostelworld 9,2 dengan tamu Inggris, Australia, dan AS pada 2026; Trip.com: menerima tamu dari semua negara.',
      rooms: 'Kamar queen privat dengan kamar mandi, tanpa sarapan. Jam resepsionis berbeda antarsumber (07.00–23.30 atau 24 jam); kirim jam tiba.',
      halal: 'Masjid Gerbang Barat Dali sekitar 330 m dari hostel. Tanyakan restoran halal terdekat di masjid.',
      reason: 'Hostel yang ramai pelancong asing, dekat gerbang barat kota tua.',
      links: [{ label: 'Hostelworld', url: 'https://www.hostelworld.com/hostels/p/327695/the-lily-international-youth-hostel/', gallery: true }, { label: 'Trip.com', url: 'https://uk.trip.com/hotels/dali-hotel-detail-1071993/baihe-international-youth-hostel' }],
      sources: [
        { title: 'Hostelworld – The Lily International Youth Hostel', url: 'https://www.hostelworld.com/hostels/p/327695/the-lily-international-youth-hostel/' },
        { title: 'Trip.com – Dali Lily International Youth Hostel', url: 'https://uk.trip.com/hotels/dali-hotel-detail-1071993/baihe-international-youth-hostel' },
      ],
    },
  },
  {
    id: 'kunming', name: 'Kunming', area: 'Kawasan Shuncheng, Wuhua: malam terakhir sebelum terbang dari Changshui.',
    notes: ['Panduan Muslim Trip.com (10 September 2026) mencantumkan 顺城锅贴, 马兰香小吃, dan 兰州大胡子特色烤肉 di Shuncheng Street. Cek tanda 清真 sebelum makan.'],
    areaPhoto: { id: 'guide-n-shuncheng', alt: 'Gerbang Masjid Shuncheng di kawasan Hui, Kunming.', label: 'Foto kawasan: gerbang Masjid Shuncheng, Kunming.' },
    hotel: {
      kind: 'Hotel', name: 'Crystal Orange Hotel Kunming Nanping', chinese: '昆明南屏步行街老街桔子水晶酒店',
      location: 'Dongfeng West Road No. 11, 170 m dari Shuncheng Shopping Centre; sekitar 35 menit berkendara ke Bandara Changshui.',
      price: 'CNY 625 per malam', priceNote: 'Rata-rata Trip.com untuk jendela 5–11 November; sarapan CNY 58.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Indonesia, Singapura, dan Thailand pada akhir Oktober 2026.',
      rooms: 'Bintang 4, resepsionis 24 jam, penitipan bagasi dan parkir gratis.',
      halal: 'Tamu Thailand (1 November 2026) menulis hotel ini bersebelahan dengan masjid dan restoran halal.',
      reason: 'Paling dekat ke kawasan makan halal Shuncheng untuk malam terakhir.',
      links: [{ label: 'Trip.com', url: 'https://nz.trip.com/hotels/kunming-hotel-detail-44722970/crystal-orange-hotel', gallery: true }],
      sources: [
        { title: 'Trip.com – Crystal Orange Hotel Kunming Nanping', url: 'https://nz.trip.com/hotels/kunming-hotel-detail-44722970/crystal-orange-hotel' },
        { title: 'Trip.com – Kunming Muslim Travel Guide', url: 'https://my.trip.com/guide/muslim-travel/kunming-muslim-travel-guide.html' },
      ],
    },
    hostel: {
      kind: 'Hostel', name: 'The Hump Hostel', chinese: '昆明驼峰客栈(昆明老街南屏步行街店)',
      location: 'Jinma Biji Square, 150 m dari gapura Jinma Biji dan 530 m dari Shuncheng.',
      price: 'CNY 200–390 per malam', priceNote: 'Perkiraan Light Enjoy Queen Room privat dari Trip.com, Kayak, dan Hostelz; sarapan CNY 18.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Hostelworld (The Hump Route Hostel, alamat sama) memuat ulasan tamu Brasil, Norwegia, dan Swedia pada 2025.',
      rooms: 'Kamar queen privat 23 m² dengan kamar mandi, resepsionis 24 jam, loker, dan penitipan bagasi. Parkir umum berbayar.',
      reason: 'Hostel backpacker lama dengan resepsionis 24 jam, berjalan kaki ke Shuncheng.',
      links: [{ label: 'Trip.com', url: 'https://uk.trip.com/hotels/kunming-hotel-detail-28095106/the-hump-hostel', gallery: true }, { label: 'Hostelworld', url: 'https://www.hostelworld.com/hostels/p/293987/the-hump-route-hostel/' }],
      sources: [
        { title: 'Trip.com – The Hump Hostel', url: 'https://uk.trip.com/hotels/kunming-hotel-detail-28095106/the-hump-hostel' },
        { title: 'Hostelworld – The Hump Route Hostel', url: 'https://www.hostelworld.com/hostels/p/293987/the-hump-route-hostel/' },
      ],
    },
  },
];

// Nights come from the itinerary so a base always matches its overnight dates.
export const stayNights = (base: StayBase) => days.filter(day => day.overnight?.name === base.name);
export function stayBaseForDate(date: string) {
  const index = days.findIndex(day => day.date === date);
  const night = days.slice(0, index + 1).reverse().find(day => day.overnight);
  return night && stayBases.find(base => base.name === night.overnight!.name);
}
