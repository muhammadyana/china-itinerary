import { days } from './itinerary.ts';

// Budget picks researched 4 November 2026 under the traveler cap; an independent pass re-checked price, foreign-passport acceptance and location.
export interface StayLink { label: string; url: string; gallery?: boolean }
export interface Stay {
  kind: 'Hotel' | 'Hostel' | 'Guesthouse';
  name: string; chinese?: string; chineseAddress?: string;
  location: string; price: string; priceNote: string; foreignGuests: string;
  room: 'Kamar privat' | 'Ranjang dorm'; overBudget?: boolean;
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

export const staysCheckedAt = '2026-11-04';
export const staysPath = '/places/stays/';
// Traveler cap of Rp500.000 per night, converted at the 2 November 2026 snapshot rate (Rp2.727,94) in src/currency.ts.
export const stayBudget = { rupiah: 'Rp500.000', cny: 183 };

export const stayBases: StayBase[] = [
  {
    id: 'chengdu', name: 'Chengdu', area: 'Pusat kota Jinjiang, sekitar Chunxi Road dan Taikoo Li.',
    notes: ['Belum ada sumber yang mencantumkan waktu taksi ke Chengdu East. Cek di aplikasi peta untuk menentukan jam berangkat 9 November pagi.'],
    areaPhoto: { id: 'chengdu-chunxi', alt: 'Jalan pejalan kaki Chunxi Road dengan bangunan berfasad emas dan pengunjung.', label: 'Foto kawasan: Chunxi Road, Chengdu. Bukan foto penginapan.' },
    hotel: {
      kind: 'Hotel', name: 'Sofis Svyain Hotel Chunxi Road',
      room: 'Kamar privat', location: 'Shuwabei Second Street No. 89, Jinjiang: sekitar 450 m dari Chunxi Road dan 1 km dari metro Chunxi Road.',
      price: 'CNY 124–158 per malam', priceNote: 'Booking.com untuk 8–9 November 2026, termasuk pajak: Small Single Room CNY 124–138, Standard Queen Room CNY 142–158. Bebas batal sampai 18.00 tanggal 8 November.',
      foreignGuests: 'Bisa dipesan di Booking.com untuk 8–9 November 2026; ada ulasan tamu Jerman, Selandia Baru, Malaysia, dan Thailand. Staf berbahasa Inggris.',
      rooms: 'Kamar mandi dalam dan AC, resepsionis 24 jam, penitipan bagasi berbayar. Tidak ada parkir, jadi sopir menjemput di depan hotel. Tidak menerima tunai.',
      reason: 'Kamar hotel privat termurah dengan ulasan bagus yang bisa dipesan tamu asing di dekat Chunxi Road.',
      links: [{ label: 'Booking.com', url: 'https://www.booking.com/hotel/cn/suo-fei-si-wei-deng-jiu-dian.html', gallery: true }],
      sources: [
        { title: 'Booking.com: Sofis Svyain Hotel - Weidenghotel ChunxiRoad (rooms and prices for 8–9 Nov 20', url: 'https://www.booking.com/hotel/cn/suo-fei-si-wei-deng-jiu-dian.html' },
        { title: 'Booking.com search results near Chunxi Road, 8–9 Nov 2026', url: 'https://www.booking.com/searchresults.html?ss=Chunxi+Road%2C+Chengdu&checkin=2026-11-08&checkout=2026-11-09&group_adults=1&no_rooms=1&group_children=0&order=price&selected_currency=CNY&lang=en-us' },
      ],
    },
    hostel: {
      kind: 'Hostel', name: 'POSHPACKER Chengdu Local Tea Hostel',
      room: 'Kamar privat', location: 'Xinnan Road No. 8 lantai 5, 250 m dari metro Xinnanmen; sekitar 10 menit jalan kaki ke Chunxi Road.',
      price: 'CNY 155–182 per malam', priceNote: 'Booking.com untuk 8–9 November 2026: Economy Double dengan kamar mandi dalam CNY 155 dengan diskon Late Escape, CNY 182 tanpa diskon. Ranjang dorm CNY 54–65.',
      foreignGuests: 'Hostelworld 9,8 dan bisa dipesan di Booking.com; ada ulasan tamu Kanada, AS, Malaysia, dan Thailand.',
      rooms: 'Kamar privat 15 m² dengan kamar mandi dalam. Check-in 14.00–24.00, kabari jam tiba. Parkir CNY 10 per hari, loker, penitipan bagasi.',
      reason: 'Hostel POSHPACKER bernilai tinggi dengan kamar privat yang tetap di bawah batas tanpa diskon.',
      links: [{ label: 'Booking.com', url: 'https://www.booking.com/hotel/cn/chengdu-local-tea-poshpacker.html', gallery: true }],
      sources: [
        { title: 'Booking.com: POSHPACKER - Chengdu Local Tea Hostel (rooms and prices for 8–9 Nov 2026)', url: 'https://www.booking.com/hotel/cn/chengdu-local-tea-poshpacker.html' },
        { title: 'Hostelworld: hostels in Chengdu (Local Tea Hostel 9.8, 56 reviews)', url: 'https://www.hostelworld.com/hostels/asia/china/chengdu/' },
      ],
    },
  },
  {
    id: 'jiuzhaigou', name: 'Jiuzhaigou', area: 'Desa Pengfeng (Goukou), dekat gerbang utama Jiuzhaigou.',
    notes: ['Hanya dua penginapan di zona gerbang yang di bawah Rp500.000 untuk 9 November. Pilihan berikutnya, Longzhou Hotel, sekitar CNY 228.', 'Hindari Fuyunshanju Hotel: Trip.com menulis hanya menerima dokumen daratan Tiongkok.'],
    areaPhoto: { id: 'highlight-jiuzhaigou', alt: 'Danau di Jiuzhaigou memantulkan hutan musim gugur dan pegunungan.', label: 'Foto kawasan: lembah Jiuzhaigou, bukan Desa Pengfeng.' },
    hotel: {
      kind: 'Hotel', name: 'Jiuzhaigou Yinghai Holiday Hotel', chinese: '九寨沟迎海假日酒店(九寨沟景区游客中心店)',
      room: 'Kamar privat', location: 'Desa Pengfeng Group 1 No. 27, di zona gerbang; sekitar 1,3 km jalan kaki dari pusat zona pengunjung.',
      price: 'CNY 167–177 per malam', priceNote: 'Trip.com untuk 9–10 November 2026: Comfy Room CNY 177 termasuk pajak dengan promo menginap pertama 44%. Tanpa promo sekitar CNY 306, di atas batas.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan pelancong solo Inggris dan Israel pada 2026.',
      rooms: 'AC tercantum, pemanas tidak; minta selimut listrik karena malam di bawah nol. Resepsionis 24 jam, penitipan bagasi gratis, tanpa sarapan.',
      halal: 'Ulasan September 2025 menyebut beberapa restoran 清真 di Desa Pengfeng.',
      reason: 'Satu-satunya kamar privat dengan kamar mandi dalam di zona gerbang yang masuk batas untuk 9 November.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/jiuzhaigou-hotel-detail-75225558/jiuzhaigou-yinghai-holiday-hotel/', gallery: true }],
      sources: [
        { title: 'Trip.com: Jiuzhaigou Yinghai Holiday Hotel (policy, address, facilities, reviews)', url: 'https://us.trip.com/hotels/jiuzhaigou-hotel-detail-75225558/jiuzhaigou-yinghai-holiday-hotel/' },
        { title: 'Trip.com list for the Jiuzhaigou Tourist Center zone, 9–10 Nov 2026, sorted by lowest pric', url: 'https://us.trip.com/hotels/list?cityId=91&provinceId=22&countryId=1&cityName=Jiuzhaigou&checkin=2026-11-09&checkout=2026-11-10&crn=1&adult=1&listFilters=29~1*29*1~1*2,50~8~406*8*406~33.26680143146601~103.9193668996518~2,17~3*17*3&curr=CNY&locale=en-US' },
      ],
    },
    hostel: {
      kind: 'Hostel', name: 'Leyu Youth Hostel', chinese: '乐鱼青年旅舍(九寨沟游客中心店)',
      room: 'Ranjang dorm', location: 'Bianbian Street No. 25, Desa Longkang: sekitar 1,4–2 km (20–30 menit jalan kaki) dari pintu masuk taman.',
      price: 'CNY 75–79 per ranjang', priceNote: 'Trip.com untuk 9–10 November 2026: ranjang dorm khusus pria CNY 79 termasuk pajak dengan promo menginap pertama (normal CNY 204). Dorm khusus perempuan ada, harganya belum terlihat.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara, berlabel “Hi China!”. Ada ulasan tamu Malaysia dan Singapura pada Oktober–November 2026.',
      rooms: 'Kamar mandi bersama. Setiap tipe kamar punya selimut listrik, tetapi ulasan menyebut AC kurang hangat. Resepsionis 24 jam, penitipan bagasi gratis.',
      reason: 'Satu-satunya hostel dekat zona gerbang yang terkonfirmasi di bawah batas untuk 9 November.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/jiuzhaigou-hotel-detail-121135583/leyu-youth-hostel/', gallery: true }],
      sources: [
        { title: 'Trip.com: Leyu youth hostel (policy, room types, facilities, reviews)', url: 'https://us.trip.com/hotels/jiuzhaigou-hotel-detail-121135583/leyu-youth-hostel/' },
        { title: 'Trip.com list for the Jiuzhaigou Tourist Center zone, 9–10 Nov 2026, sorted by lowest pric', url: 'https://us.trip.com/hotels/list?cityId=91&provinceId=22&countryId=1&cityName=Jiuzhaigou&checkin=2026-11-09&checkout=2026-11-10&crn=1&adult=1&listFilters=29~1*29*1~1*2,50~8~406*8*406~33.26680143146601~103.9193668996518~2,17~3*17*3&curr=CNY&locale=en-US' },
      ],
    },
  },
  {
    id: 'bipenggou', name: 'Bipenggou', area: 'Mulut lembah Bipenggou di Putou, Lixian, atau kota Lixian sekitar 30 menit berkendara di hilir.',
    notes: ['Tidak ada hostel dengan ranjang dorm di dekat Bipenggou; kedua pilihan berupa kamar privat.', 'Good B&B (不鞠民宿) mencantumkan makanan halal di Trip.com, tetapi harganya CNY 202 per malam termasuk pajak, sedikit di atas batas.'],
    areaPhoto: { id: 'bipenggou', alt: 'Danau tenang dengan batang pohon mati di Bipenggou, memantulkan larch keemasan dan puncak granit di bawah langit biru.', label: 'Foto kawasan: lembah Bipenggou di atas gerbang. Bukan foto penginapan.' },
    hotel: {
      kind: 'Hotel', name: 'Li County Wuyoucheng Hotel', chinese: '理县无忧城山庄', chineseAddress: '理县杂谷脑老街北山路8号',
      room: 'Kamar privat', location: 'Kota Lixian (Zagunao), sekitar 30 menit berkendara dari gerbang Bipenggou (18 km garis lurus).',
      price: 'CNY 109–116 per malam', priceNote: 'Trip.com untuk 10–11 November 2026: Cozy Queen Room CNY 109, CNY 116 termasuk pajak. Hindari Cozy Standard Room yang tidak ber-AC.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Thailand (2025) dan Malaysia (November 2025).',
      rooms: 'Cozy Queen dan Deluxe Standard memakai AC dan selimut listrik. Ulasan Agustus 2026 menyebut bising renovasi.',
      reason: 'Bukti tamu asing paling kuat di bawah batas, dekat kedai dan SPBU di kota Lixian.',
      links: [{ label: 'Trip.com', url: 'https://au.trip.com/hotels/li-county-hotel-detail-12829437/li-xian-wu-you-cheng-shan-zhuang', gallery: true }],
      sources: [
        { title: 'Trip.com – Li County Wuyoucheng Hotel (policy, rooms, reviews)', url: 'https://au.trip.com/hotels/li-county-hotel-detail-12829437/li-xian-wu-you-cheng-shan-zhuang' },
        { title: 'Trip.com zh-HK – 理縣無憂城山莊 (address)', url: 'https://hk.trip.com/hotels/li-county-hotel-detail-12829437/?locale=zh-HK' },
        { title: 'Trip.com – Li County list 10–11 Nov 2026 (Cozy Queen CNY 109 / 116 incl. tax)', url: 'https://www.trip.com/hotels/list?city=7751&checkin=2026-11-10&checkout=2026-11-11&curr=CNY&locale=en-US' },
      ],
    },
    hostel: {
      kind: 'Guesthouse', name: 'Xinlan Homestay', chinese: '理县鑫兰民宿', chineseAddress: '理县朴头村庄房村一组73号',
      room: 'Kamar privat', location: 'Desa Zhuangfang, Putou: sekitar 1,7 km dari gerbang Bipenggou menurut ulasan tamu.',
      price: 'CNY 158–168 per malam', priceNote: 'Trip.com untuk 10–11 November 2026: Budget Twin Room CNY 158, CNY 168 termasuk pajak, bisa dibatalkan gratis. Label tarif menyebut sarapan, tetapi kebijakan mencantumkan CNY 10 per orang.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Dari 88 ulasan, 9 berbahasa Thai dan 1 berbahasa Indonesia; ulasan terbaru 27 Oktober 2026.',
      rooms: 'Budget Twin di lantai dasar dan boleh merokok; minta kamar bebas rokok.',
      reason: 'Paling dekat gerbang di bawah batas, jadi bisa masuk saat loket buka.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/li-county-hotel-detail-81450342/', gallery: true }],
      sources: [
        { title: 'Trip.com – Xinlan Homestay (pin, policy, reviews, languages)', url: 'https://us.trip.com/hotels/li-county-hotel-detail-81450342/' },
        { title: 'Trip.com zh-HK – 理縣鑫蘭民宿 (address)', url: 'https://hk.trip.com/hotels/li-county-hotel-detail-81450342/?locale=zh-HK' },
        { title: 'Trip.com – Bipeng Valley list 10–11 Nov 2026, CNY 0–250 (Budget Twin CNY 158 / 168 incl. tax)', url: 'https://www.trip.com/hotels/list?cityId=7751&provinceId=22&countryId=1&checkin=2026-11-10&checkout=2026-11-11&crn=1&adult=1&listFilters=50~50~6652115*50*31.3131589~102.9487368~Bipeng%20Valley~6652115~2,15~Range*15*0~250&curr=CNY&locale=en-US' },
      ],
    },
  },
  {
    id: 'rilong', name: 'Rilong', area: 'Kota Rilong, kini bernama Siguniangshan Town, di kaki Siguniangshan.',
    notes: ['Malam di Rilong kini 11–12 November, sedangkan harga di bawah dicek untuk 10–11 November. Tanggal baru jatuh pada libur sekolah Chengdu (11–13 November); cek ulang sebelum memesan.', 'Harga di Rilong bergantung pada diskon Trip.com; tanpa diskon sekitar CNY 290–400.', 'Hindari T & Q International Youth Hostel: listing-nya hanya menerima dokumen daratan Tiongkok.'],
    areaPhoto: { id: 'siguniang', alt: 'Puncak bersalju Siguniangshan menjulang di atas pegunungan.', label: 'Foto kawasan: Siguniangshan di atas Rilong. Bukan foto penginapan.' },
    hotel: {
      kind: 'Hotel', name: 'VALATOMS Hotel Siguniangshan', chinese: 'VALATOMS梵拉图酒店(四姑娘山景区四店)',
      room: 'Kamar privat', location: 'Changping Street No. 25, Desa Jinfeng: sekitar 2,7 km dari pusat Rilong dan 750 m dari terminal bus.',
      price: 'CNY 141–149 per malam', priceNote: 'Trip.com untuk 10–11 November 2026: Liu Jing Double Bed Room CNY 149 termasuk pajak, potongan dari CNY 238.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara, tanpa batasan KTP daratan. Belum ada ulasan tamu asing yang terlihat.',
      rooms: 'Bintang 3, dibuka 2024, kamar mandi dalam, resepsionis 24 jam. Hanya AC dan selimut listrik; tanpa pemanas lantai atau oksigen untuk malam di 3.200 m.',
      reason: 'Satu-satunya hotel bernilai baik di Rilong yang masuk batas.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/xiaojin-hotel-detail-119260279/valatoms-hotel/', gallery: true }],
      sources: [
        { title: 'Trip.com – VALATOMS Hotel Branch 4 detail page (policy, rooms, reviews)', url: 'https://us.trip.com/hotels/xiaojin-hotel-detail-119260279/valatoms-hotel/' },
        { title: 'Trip.com – Xiaojin list 10–11 Nov 2026, CNY 139–149 (VALATOMS CNY 141 / 149 incl. tax; Chu', url: 'https://us.trip.com/hotels/list?city=21609&checkin=2026-11-10&checkout=2026-11-11&adult=1&crn=1&curr=CNY&listFilters=17~3*17*3,15~Range*15*139~149' },
      ],
    },
    hostel: {
      kind: 'Hostel', name: 'Xueling Qingju Hotel', chinese: '四姑娘山雪岭青居酒店',
      room: 'Ranjang dorm', location: 'Desa Jinfeng Group 2, sedikit di luar kota; pemilik mengantar gratis dari terminal bus menurut ulasan November 2026.',
      price: 'CNY 78–107 per ranjang', priceNote: 'Trip.com untuk 10–11 November 2026: dorm pria 8 ranjang CNY 78, dorm pria 6 ranjang CNY 107, termasuk pajak. Dorm perempuan 4 ranjang ada, harganya belum terlihat.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Swiss dan Rusia pada Oktober 2026.',
      rooms: 'Pemanas lantai di seluruh bangunan, kamar mandi bersama, parkir gratis untuk sopir.',
      reason: 'Pemanas lantai untuk malam di bawah nol, bernilai 9,8 di Trip.com.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/xiaojin-hotel-detail-131305427/siguniangshan-xueling-qingju-hotel/', gallery: true }],
      sources: [
        { title: 'Trip.com – Xueling Qingju Hotel detail page', url: 'https://us.trip.com/hotels/xiaojin-hotel-detail-131305427/siguniangshan-xueling-qingju-hotel/' },
        { title: 'Trip.com – Xiaojin list 10–11 Nov 2026, CNY 0–183 (8-bed male dorm CNY 74 / 78 incl. tax)', url: 'https://us.trip.com/hotels/list?city=21609&checkin=2026-11-10&checkout=2026-11-11&adult=1&crn=1&curr=CNY&listFilters=15~Range*15*0~183' },
        { title: 'Trip.com – Xiaojin list 10–11 Nov 2026, CNY 88–183 (6-bed male dorm CNY 102 / 107 incl. ta', url: 'https://us.trip.com/hotels/list?city=21609&checkin=2026-11-10&checkout=2026-11-11&adult=1&crn=1&curr=CNY&listFilters=17~3*17*3,15~Range*15*88~183' },
      ],
    },
  },
  {
    id: 'xinduqiao', name: 'Xinduqiao', area: 'Kota Xinduqiao di jalur G318, basis dua malam.',
    notes: ['Harga Xinduqiao adalah angka “mulai dari” Trip.com per 4 November 2026; harga kamar untuk 12–13 November belum tampil.', 'Hindari Shengshi Tianhua Hotel dan Shuyunge Homestay: listing-nya hanya menerima dokumen daratan Tiongkok.'],
    areaPhoto: { id: 'xinduqiao', alt: 'Barisan pohon kuning di tepi aliran air dan lereng cokelat Xinduqiao.', label: 'Foto kawasan: Xinduqiao. Bukan foto penginapan.' },
    hotel: {
      kind: 'Hotel', name: 'Yu Xin Hotel', chinese: '康定渝新大酒店', chineseAddress: '四川康定新都桥镇新二村',
      room: 'Kamar privat', location: 'Desa Xin’er, sekitar 2 km dari pusat Xinduqiao dan 4 km dari dek pandang Gongga.',
      price: 'CNY 163–170 per malam', priceNote: 'Perkiraan dari harga mulai Trip.com (USD 24 / SGD 31); belum ada harga kamar bertanggal.',
      foreignGuests: 'Trip.com dan Ctrip: menerima tamu dari semua negara, tetapi belum ada ulasan tamu asing. Konfirmasi ke hotel sebelum memesan.',
      rooms: 'Kamar twin 25–30 m² dengan kamar mandi dalam dan AC. Pemanas, selimut listrik, dan oksigen tidak tercantum; minta selimut listrik.',
      reason: 'Satu-satunya hotel di Xinduqiao dengan harga mulai di bawah batas.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/kangding-hotel-detail-2648621/yu-xin-hotel/', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://hotels.ctrip.com/hotels/2648621.html' }],
      sources: [
        { title: 'Trip.com SG: Yu Xin Hotel (policy, rooms, distances, reviews)', url: 'https://sg.trip.com/hotels/kangding-hotel-detail-2648621/yu-xin-hotel/' },
        { title: 'Trip.com: Hotels near Xinduqiao Town (FAQ \'from $24\'; prices for Oct 31–Nov 6)', url: 'https://us.trip.com/hotels/kangding-xindu-bridge/hotels-c4130m22439730/' },
        { title: 'Trip.com SG: Hotels near Xinduqiao Town (\'from S$31\')', url: 'https://sg.trip.com/hotels/kangding-xindu-bridge/hotels-c4130m22439730/' },
        { title: 'Ctrip: 康定渝新大酒店 (Chinese address, policy, opened 2017, 40 rooms)', url: 'https://hotels.ctrip.com/hotels/2648621.html' },
      ],
    },
    hostel: {
      kind: 'Guesthouse', name: 'Desa Homestay', chinese: '新都桥德萨康萨民宿', chineseAddress: '四川康定新都桥镇新二村一组2号',
      room: 'Kamar privat', location: '670 m dari pusat kota dan 870 m dari terminal bus. Tamu Inggris (Oktober 2026) kesulitan menemukan pintunya, jadi telepon pemilik.',
      price: 'CNY 82–116 per malam', priceNote: 'Rata-rata Trip.com CNY 116 dan kartu harga mulai USD 12, dicek 4 November 2026. Kamar Tibetan-Style Deluxe yang berpemanas bisa lebih mahal.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Malaysia, Prancis, Inggris, dan AS pada 2026. Tamu harus berusia 18–60 tahun.',
      rooms: 'Pilih Tibetan-Style Deluxe Scenic Double: kamar mandi dalam, pemanas, dan selimut listrik. Hindari Comfy Single Room yang tanpa kamar mandi dalam. Tanpa oksigen.',
      reason: 'Kamar privat murah yang paling terdokumentasi di Xinduqiao, bernilai 9,5.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/kangding-hotel-detail-110109058/xin-dou-qiao-de-sa-min-su/', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://hotels.ctrip.com/hotels/110109058.html' }],
      sources: [
        { title: 'Trip.com SG: Desa Homestay (policy, rooms, 2026 foreign reviews)', url: 'https://sg.trip.com/hotels/kangding-hotel-detail-110109058/xin-dou-qiao-de-sa-min-su/' },
        { title: 'Trip.com: Desa Homestay, CNY view (\'Average Price From CNY116\')', url: 'https://us.trip.com/hotels/kangding-hotel-detail-110109058/xin-dou-qiao-de-sa-min-su/?curr=CNY' },
        { title: 'Trip.com: Hotels near Xinduqiao Town ($12; $13–$33, Oct 31–Nov 6)', url: 'https://us.trip.com/hotels/kangding-xindu-bridge/hotels-c4130m22439730/' },
        { title: 'Ctrip: 新都桥德萨康萨民宿 (Chinese address, heater reviews)', url: 'https://hotels.ctrip.com/hotels/110109058.html' },
      ],
    },
  },
  {
    id: 'litang', name: 'Litang', area: 'Kota Litang di 4.014 m, dekat kota tua dan biara.',
    notes: ['Harga Litang adalah angka “mulai dari” Trip.com per 4 November 2026.', 'Hindari Litang Snowland Hostel: Trip.com menulis hanya menerima KTP daratan Tiongkok.'],
    areaPhoto: { id: 'litang', alt: 'Kompleks Biara Litang dengan atap emas di lereng perbukitan.', label: 'Foto kawasan: Biara Litang di atas kota.' },
    hotel: {
      kind: 'Hotel', name: 'Litang Tu Bo Hotel', chinese: '理塘吐蕃大酒店', chineseAddress: '四川理塘高城镇318线192号',
      room: 'Kamar privat', location: 'G318 sisi timur kota, sekitar 2,7 km dari kota tua dan 3,5 km dari Biara Litang; dekat dengan mobil.',
      price: 'CNY 92–125 per malam', priceNote: 'Trip.com: mulai CNY 92 (Discount Double atau Standard) dan rata-rata CNY 125. Kamar Oxygen Diffusion Deluxe yang berpemanas lebih mahal; cek apakah masih di bawah batas.',
      foreignGuests: 'Trip.com dan Ctrip: menerima tamu dari semua negara. Ada ulasan tamu Korea (September 2026), Rusia, dan Italia.',
      rooms: 'Semua kamar yang terlihat punya kamar mandi dalam dan selimut listrik. Kamar Discount tanpa pemanas; tamu Rusia menyebut kamar tetap hangat saat salju.',
      reason: 'Hotel bernilai 9,3 termurah di Litang yang menerima semua negara.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/litang-hotel-detail-53112521/li-tang-tu-fan-da-jiu-dian/', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://hotels.ctrip.com/hotels/53112521.html' }],
      sources: [
        { title: 'Trip.com: Litang Tu Bo Hotel (policy, rooms, foreign reviews, \'Average Price From CNY125\')', url: 'https://us.trip.com/hotels/litang-hotel-detail-53112521/li-tang-tu-fan-da-jiu-dian/?curr=CNY' },
        { title: 'Trip.com: 2-star hotels in Litang (\'from CNY 92\', Nov 5–11)', url: 'https://us.trip.com/hotels/star2/city/cn/litang.html?curr=CNY' },
        { title: 'Ctrip: 理塘吐蕃大酒店 (Chinese address, policy, elevator and oxygen-concentrator reviews)', url: 'https://hotels.ctrip.com/hotels/53112521.html' },
      ],
    },
    hostel: {
      kind: 'Hostel', name: 'Litang Xingye International Youth Hostel', chinese: '理塘星野国际青年旅舍',
      room: 'Kamar privat', location: 'Ping’an Road No. 47, sekitar 800 m dari kota tua dan 2,3 km dari biara.',
      price: 'CNY 173 per malam', priceNote: 'Rata-rata Trip.com CNY 173, kemungkinan kamar privat termurah; harga per tanggal belum tampil. Ranjang dorm CNY 33–45.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan pelancong solo Belanda, Israel, dan Inggris pada 2026; staf berbahasa Inggris.',
      rooms: 'Kamar privat 14–18 m² dengan kamar mandi dalam, pelembap udara, dan selimut listrik. Dorm khusus pria dan khusus perempuan.',
      reason: 'Penginapan hemat bernilai tertinggi di Litang (9,7).',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/litang-hotel-detail-4534582/litang-xingye-international-youth-hostel/', gallery: true }, { label: 'Wingon Travel', url: 'https://www.wingontravel.com/hotel/detail-litang-4534582/litang-xingye-international-youth-hostel/' }],
      sources: [
        { title: 'Trip.com: LiTang Xingye International Youth Hostel (policy, rooms, reviews, \'Average Price', url: 'https://us.trip.com/hotels/litang-hotel-detail-4534582/litang-xingye-international-youth-hostel/?curr=CNY' },
        { title: 'Trip.com: 2-star hotels in Litang (CNY 33 card; CNY 45–300 range)', url: 'https://us.trip.com/hotels/star2/city/cn/litang.html?curr=CNY' },
        { title: 'Wingon Travel: 理塘星野国际青年旅舍 room list (incl. female dorms)', url: 'https://www.wingontravel.com/hotel/detail-litang-4534582/litang-xingye-international-youth-hostel/' },
      ],
    },
  },
  {
    id: 'riwa', name: 'Riwa', area: 'Shangri-La Town (dulu Riwa), Daocheng, Sichuan: kota gerbang Yading di ±2.900 m.',
    notes: ['Harga di Riwa bergantung pada promo Trip.com; tanpa promo sekitar CNY 195–230. Pastikan kamar berpemanas untuk dua malam.', 'Hindari Xianggeli Theme Hotel dan Tiewa Hostel: hanya menerima dokumen daratan Tiongkok.'],
    areaPhoto: { id: 'luorong', alt: 'Aliran air berkelok melintasi padang rumput keemasan Luorong di bawah puncak bersalju.', label: 'Foto kawasan: Padang Luorong di Yading, tujuan dari Riwa. Bukan foto kota Riwa.' },
    hotel: {
      kind: 'Hotel', name: 'GreenTree Inn Express Daocheng Yading', chinese: '格林豪泰智选酒店(稻城亚丁景区店)',
      room: 'Kamar privat', location: 'Chituhe Road No. 88, sekitar 170 m dari terminal bus Yading.',
      price: 'CNY 161–170 per malam', priceNote: 'Trip.com untuk 15–17 November 2026: Guestroom dua ranjang CNY 170 termasuk pajak dengan promo menginap pertama. Tanpa promo sekitar CNY 204, di atas batas.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara, berlabel “Hi China!”. Ada ulasan tamu Vietnam pada November 2026.',
      rooms: 'Bintang 2. Pemanas tidak tercantum resmi, tetapi ringkasan ulasan menyebut pemanasnya bagus; minta kamar berpemanas.',
      reason: 'Satu-satunya hotel jaringan di Riwa yang masuk batas, di pusat kota dekat terminal bus.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/daocheng-hotel-detail-40616269/greentree-inn-express/', gallery: true }],
      sources: [
        { title: 'Trip.com hotel page – GreenTree Inn Express (Daocheng Yading Scenic Area)', url: 'https://us.trip.com/hotels/daocheng-hotel-detail-40616269/greentree-inn-express/' },
        { title: 'Trip.com reviews – GreenTree Inn Express', url: 'https://us.trip.com/hotels/daocheng-hotel-detail-40616269/greentree-inn-express/review.html' },
        { title: 'Trip.com Daocheng list 15–16 Nov 2026, CNY 158–183', url: 'https://us.trip.com/hotels/list?city=1222&checkin=2026/11/15&checkout=2026/11/16&adult=1&crn=1&curr=CNY&listFilters=17~3*17*3*2,15~Range*15*158~183*2' },
        { title: 'Trip.com Daocheng list 16–17 Nov 2026, CNY 158–183', url: 'https://us.trip.com/hotels/list?city=1222&checkin=2026/11/16&checkout=2026/11/17&adult=1&crn=1&curr=CNY&listFilters=17~3*17*3*2,15~Range*15*158~183*2' },
      ],
    },
    hostel: {
      kind: 'Guesthouse', name: 'Daocheng Daruiyi Station Homestay', chinese: '稻城达瑞驿站(香格里拉镇稻城亚丁景区店)',
      room: 'Kamar privat', location: 'Luoke Path No. 20, pusat kota, sekitar 200 m dari terminal bus Yading.',
      price: 'CNY 142–169 per malam', priceNote: 'Trip.com untuk 15–17 November 2026: Guestroom dua ranjang CNY 142 dan Wuyou Oxygen Twin CNY 169, termasuk pajak dengan promo menginap pertama.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan pelancong solo Swiss pada Oktober 2026.',
      rooms: 'Selimut listrik di semua tipe kamar; tipe Wuyou punya mesin oksigen. Resepsionis 24 jam.',
      reason: 'Penginapan hemat bernilai tertinggi di pusat Riwa, dengan kamar privat untuk dua malam.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/daocheng-hotel-detail-6023158/darui-lnn/', gallery: true }],
      sources: [
        { title: 'Trip.com hotel page – Daocheng Daruiyi Station Homestay', url: 'https://us.trip.com/hotels/daocheng-hotel-detail-6023158/darui-lnn/' },
        { title: 'Trip.com Daocheng list 15–16 Nov 2026, CNY 132–183', url: 'https://us.trip.com/hotels/list?city=1222&checkin=2026/11/15&checkout=2026/11/16&adult=1&crn=1&curr=CNY&listFilters=17~3*17*3*2,15~Range*15*132~183*2' },
        { title: 'Trip.com Daocheng list 15–16 Nov 2026, CNY 154–183', url: 'https://us.trip.com/hotels/list?city=1222&checkin=2026/11/15&checkout=2026/11/16&adult=1&crn=1&curr=CNY&listFilters=17~3*17*3*2,15~Range*15*154~183*2' },
        { title: 'Trip.com Daocheng list 16–17 Nov 2026, CNY 158–183', url: 'https://us.trip.com/hotels/list?city=1222&checkin=2026/11/16&checkout=2026/11/17&adult=1&crn=1&curr=CNY&listFilters=17~3*17*3*2,15~Range*15*158~183*2' },
      ],
    },
  },
  {
    id: 'shangri-la', name: 'Shangri-La', area: 'Kota tua Dukezong, Shangri-La, Yunnan; bukan Riwa di Sichuan.',
    notes: [],
    areaPhoto: { id: 'dukezong', alt: 'Jalan dan bangunan Tibet di kawasan kota tua Dukezong.', label: 'Foto kawasan: kota tua Dukezong. Bukan foto penginapan.' },
    hotel: {
      kind: 'Hotel', name: 'Duge Grand Hotel', chinese: '香格里拉都阁大酒店(独克宗古城店)', chineseAddress: '云南香格里拉龙潭北路洛觉巷',
      room: 'Kamar privat', location: 'Luojue Lane, Longtan North Road; sebagian besar ulasan menyebut kurang dari 10 menit jalan kaki ke kota tua dan 1,4 km ke Moonlight Square.',
      price: 'CNY 82–96 per malam', priceNote: 'Trip.com untuk 17–18 November 2026: Deluxe Standard Room CNY 82–96 termasuk pajak.',
      foreignGuests: 'Trip.com dan Ctrip: menerima tamu dari semua negara. Ada ulasan tamu Inggris pada Oktober 2026.',
      rooms: 'Pemanas di semua kamar, resepsionis 24 jam, parkir gratis untuk sopir. Tanpa sarapan dan oksigen.',
      reason: 'Hotel ekonomi terlaris di Shangri-La, bernilai 9,0 dari 1.248 ulasan, dengan pemanas.',
      links: [{ label: 'Trip.com', url: 'https://uk.trip.com/hotels/shangri-la-hotel-detail-3396520/rongcheng-gangwan-business-hotel/', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://m.ctrip.com/html5/hotel/hoteldetail/3396520.html' }],
      sources: [
        { title: 'Trip.com – Duge Grand Hotel (policy, rooms, heating, parking, 2026 reviews)', url: 'https://uk.trip.com/hotels/shangri-la-hotel-detail-3396520/rongcheng-gangwan-business-hotel/' },
        { title: 'Trip.com list filtered to hotel 3396520, 17–18 Nov 2026 (CNY 77 / CNY 82 incl. tax)', url: 'https://us.trip.com/hotels/list?city=660&checkin=2026-11-17&checkout=2026-11-18&adult=1&crn=1&curr=CNY&listFilters=31~3396520*31*3396520' },
        { title: 'Ctrip PC – 都阁大酒店 (接待来自任何国家/地区的客人)', url: 'https://hotels.ctrip.com/hotels/3396520.html' },
        { title: 'Ctrip mobile – 都阁大酒店 (economy-hotel tag, 全屋暖气, free parking)', url: 'https://m.ctrip.com/html5/hotel/hoteldetail/3396520.html' },
      ],
    },
    hostel: {
      kind: 'Guesthouse', name: 'Jianyi Light Luxury B&B', chinese: '香格里拉简忆轻奢智能供氧民宿(独克宗古城大佛寺转经筒店)',
      room: 'Kamar privat', location: 'Dalalang No. 123 di dalam kota tua, sekitar 6 menit jalan kaki ke roda doa Guishan.',
      price: 'CNY 111–118 per malam', priceNote: 'Trip.com untuk 17–18 November 2026: Light Luxury Double CNY 118 termasuk pajak.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Portugal dan Filipina pada Oktober–November 2026.',
      rooms: 'Kamar mandi dalam, pemanas seluruh rumah, suplai oksigen, dan pelembap. Resepsionis 08.30–24.00.',
      reason: 'Kamar berpemanas dan beroksigen di dalam kota tua, bernilai 9,7 dari 930 ulasan.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/shangri-la-hotel-detail-5663751/great-memory-boutique-inn/', gallery: true }],
      sources: [
        { title: 'Trip.com – Jianyi B&B detail (policy, private bathroom, heating, oxygen, parking, reviews)', url: 'https://us.trip.com/hotels/shangri-la-hotel-detail-5663751/great-memory-boutique-inn/' },
        { title: 'Trip.com list filtered to property 5663751, 17–18 Nov 2026 (CNY 111 / CNY 118 incl. tax)', url: 'https://us.trip.com/hotels/list?city=660&checkin=2026-11-17&checkout=2026-11-18&adult=1&crn=1&curr=CNY&listFilters=31~5663751*31*5663751' },
      ],
    },
  },
  {
    id: 'lijiang', name: 'Lijiang', area: 'Sekitar Kota Tua Lijiang (Dayan). Kota tua bebas mobil; taksi berhenti di gerbang.',
    notes: ['Taksi berhenti di gerbang kota tua; kedua pilihan bisa dijangkau mobil.'],
    areaPhoto: { id: 'dayan', alt: 'Kanal dan jalan batu di Kota Tua Lijiang.', label: 'Foto kawasan: kanal Kota Tua Lijiang. Bukan foto penginapan.' },
    hotel: {
      kind: 'Hotel', name: '166 Hotel Lijiang Ancient City', chinese: '一六六酒店(丽江古城木府店)',
      room: 'Kamar privat', location: 'Jinjia Street bagian bawah No. 65, di gerbang barat daya kota tua dekat Mufu. Taksi bisa sampai ke pintu menurut ulasan September 2026.',
      price: 'CNY 72–76 per malam', priceNote: 'Trip.com untuk 18–19 November 2026: Special Upgraded Room twin CNY 76 termasuk pajak dan parkir.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Malaysia pada Oktober 2026.',
      rooms: 'Kamar mandi dalam, AC pemanas, resepsionis 24 jam, penitipan bagasi. Tanpa sarapan.',
      halal: 'Halaltrip mencatat Masjid Agung Lijiang di kota tua; belum terverifikasi.',
      reason: 'Hotel bernilai 9,4 dari 2.307 ulasan di tepi kota tua, bisa dijangkau mobil untuk penjemputan Jade Dragon.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/detail/?hotelId=109842432&checkIn=2026-11-18&checkOut=2026-11-19&adult=1&crn=1&curr=CNY', gallery: true }],
      sources: [
        { title: 'Trip.com – 166 Hotel detail (policy, 24/7 desk, parking, heating AC, 2026 reviews)', url: 'https://us.trip.com/hotels/detail/?hotelId=109842432&checkIn=2026-11-18&checkOut=2026-11-19&adult=1&crn=1&curr=CNY' },
        { title: 'Trip.com list filtered to hotel 109842432, 18–19 Nov 2026 (CNY 72 / CNY 76 incl. tax)', url: 'https://us.trip.com/hotels/list?city=37&checkin=2026-11-18&checkout=2026-11-19&adult=1&crn=1&curr=CNY&listFilters=31~109842432*31*109842432' },
      ],
    },
    hostel: {
      kind: 'Guesthouse', name: 'Mama Naxi Guesthouse (Lijingwan)', chinese: '妈妈纳西民宿(丽江丽景湾店)',
      room: 'Kamar privat', location: 'Jixiang Road, 850 m (11 menit jalan kaki) dari kota tua dan bisa dijangkau mobil. Pastikan titik jemput dengan pemilik.',
      price: 'CNY 112–127 per malam', priceNote: 'Trip.com untuk 18–19 November 2026: Cozy Queen CNY 112 dan Standard twin CNY 127 termasuk pajak. Ranjang dorm CNY 44.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu AS, Prancis, Inggris, dan Spanyol pada 2026.',
      rooms: 'Pemanas di setiap kamar, kamar mandi dalam, resepsionis 24 jam. Sarapan Barat dibayar terpisah.',
      reason: 'Guesthouse favorit pelancong asing dengan kamar berpemanas.',
      links: [{ label: 'Trip.com', url: 'https://id.trip.com/hotels/lijiang-hotel-detail-61483794/ma-ma-na-xi-min-su', gallery: true }],
      sources: [
        { title: 'Trip.com (ID) – MamanaxiGH (policy, room types with private bathroom)', url: 'https://id.trip.com/hotels/lijiang-hotel-detail-61483794/ma-ma-na-xi-min-su' },
        { title: 'Trip.com – MamanaxiGH (heating in every room, 24h desk, 2026 reviews)', url: 'https://us.trip.com/hotels/detail/?hotelId=61483794&checkIn=2026-11-18&checkOut=2026-11-19&adult=1&crn=1&curr=CNY' },
        { title: 'Trip.com list filtered to property 61483794, 18–19 Nov 2026 (Cozy Queen CNY 112 incl. tax)', url: 'https://us.trip.com/hotels/list?city=37&checkin=2026-11-18&checkout=2026-11-19&adult=1&crn=1&curr=CNY&listFilters=31~61483794*31*61483794,15~Range*15*100~183' },
      ],
    },
  },
  {
    id: 'dali', name: 'Dali', area: 'Dekat gerbang Kota Tua Dali. Kereta dari Lijiang tiba di Stasiun Dali, sekitar 17 km dari penginapan.',
    notes: ['Tidak ada hotel jaringan di bawah Rp500.000 dekat gerbang kota tua, jadi slot hotel diisi guesthouse kamar privat.', 'Tiba malam: kabari penginapan jam kedatangan kereta. Dali Upland International Youth Hostel (CNY 150–168) punya resepsionis 24 jam sebagai cadangan.'],
    areaPhoto: { id: 'highlight-dali', alt: 'Gerbang selatan Kota Tua Dali diterangi cahaya keemasan di bawah langit biru malam.', label: 'Foto kawasan: gerbang selatan Kota Tua Dali.' },
    hotel: {
      kind: 'Guesthouse', name: 'Xianlai Inn Erhai Gate', chinese: '闲来客栈(大理古城洱海门店)',
      room: 'Kamar privat', location: 'Yuer Road bagian bawah, 310 m dari Gerbang Erhai; sekitar 17 km dari Stasiun Dali.',
      price: 'CNY 78–165 per malam', priceNote: 'Trip.com untuk 19–20 November 2026: Cozy Tatami Room CNY 78 termasuk pajak dengan promo (sekitar CNY 105 tanpa promo). Kamar lain sampai CNY 165.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Malaysia, Singapura, dan Kanada pada Oktober 2026.',
      rooms: 'Kamar termurah bergaya tatami. Kamar mandi dalam (shower tanpa sekat menurut tamu Kanada) dan AC; tanpa lift dan sarapan. Jam resepsionis belum tercantum.',
      halal: 'Ulasan Oktober 2026 menyebut restoran halal tepat di sebelah penginapan.',
      reason: 'Guesthouse bernilai 9,4 dekat Gerbang Erhai dengan restoran halal di sebelahnya.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/dali-hotel-detail-31429260/da-li-xian-lai-ke-zhan/', gallery: true }],
      sources: [
        { title: 'Trip.com – dali xianlai Inn (policy, distances, reviews, From CNY 84)', url: 'https://us.trip.com/hotels/dali-hotel-detail-31429260/da-li-xian-lai-ke-zhan/' },
        { title: 'Trip.com dated list, Dali 19–20 Nov 2026 (Cozy Tatami Room CNY 78 incl. taxes)', url: 'https://us.trip.com/hotels/list?city=36&cityName=Dali&checkin=2026/11/19&checkout=2026/11/20&adult=1&crn=1&children=0&curr=CNY&barCurr=CNY&listFilters=13~8164506*18*25.6966967%7C100.1705867%7CDali%20Ancient%20City-Erhai%20Gate%7C8164506%7C2*2,14~0.5*14*0.5*2,6~10*6*10*2,15~1*15*0%7C150*2,17~3*17*3*2,75~TAG_506*75*506*2' },
        { title: 'Trip.com – HanTing hotels in Dali (from-prices)', url: 'https://us.trip.com/hotels/dali-hanting/hotels-c36b48/' },
      ],
    },
    hostel: {
      kind: 'Hostel', name: 'Dali Lily International Youth Hostel', chinese: '大理百合国际青年旅舍(大理古城店)',
      room: 'Kamar privat', location: 'Desa Ximen, 200 m dari Gerbang Honglongjing di sisi barat kota tua.',
      price: 'CNY 92–120 per malam', priceNote: 'Hostelworld untuk 19 November 2026: Basic Double Private Ensuite CNY 92 sampai Deluxe Double CNY 120, tanpa promo.',
      foreignGuests: 'Bisa dipesan di Hostelworld; ada ulasan tamu Inggris, Australia, AS, dan Kanada pada 2026. Trip.com: menerima tamu dari semua negara.',
      rooms: 'Kamar privat dengan kamar mandi dalam dan air panas 24 jam. Pemanas tidak tercantum. Resepsionis 07.00–23.30 menurut Trip.com; kirim jam tiba.',
      halal: 'Masjid Gerbang Barat Dali sekitar 330 m dari hostel.',
      reason: 'Kamar privat termurah dekat gerbang kota tua tanpa bergantung promo.',
      links: [{ label: 'Hostelworld', url: 'https://www.hostelworld.com/hostels/p/327695/the-lily-international-youth-hostel/', gallery: true }, { label: 'Trip.com', url: 'https://us.trip.com/hotels/dali-hotel-detail-1071993/baihe-international-youth-hostel/' }],
      sources: [
        { title: 'Hostelworld availability API, 19 Nov 2026, CNY', url: 'https://prod.apigee.hostelworld.com/legacy-hwapi-service/2.2/properties/327695/availability/?guests=1&num-nights=1&date-start=2026-11-19&currency=CNY' },
        { title: 'Hostelworld – The Lily International Youth Hostel', url: 'https://www.hostelworld.com/hostels/p/327695/the-lily-international-youth-hostel/' },
        { title: 'Trip.com – Dali Lily International Youth Hostel (policy, desk hours)', url: 'https://us.trip.com/hotels/dali-hotel-detail-1071993/baihe-international-youth-hostel/' },
      ],
    },
  },
  {
    id: 'kunming', name: 'Kunming', area: 'Kawasan Shuncheng, Wuhua: malam terakhir sebelum terbang dari Changshui.',
    notes: ['Panduan Muslim Trip.com (10 September 2026) mencantumkan 顺城锅贴, 马兰香小吃, dan 兰州大胡子特色烤肉 di Shuncheng Street. Cek tanda 清真 sebelum makan.', 'Harga Totoro bergantung pada diskon Trip.com (normal sekitar CNY 297). Cadangannya Meiyue Hotel, CNY 128–160.'],
    areaPhoto: { id: 'guide-n-shuncheng', alt: 'Gerbang Masjid Shuncheng di kawasan Hui, Kunming.', label: 'Foto kawasan: gerbang Masjid Shuncheng, Kunming.' },
    hotel: {
      kind: 'Hotel', name: 'Totoro Elf Hotel Kunming Old Street', chinese: '龙猫精灵酒店(昆明老街翠湖店)',
      room: 'Kamar privat', location: 'Sanshi Street No. 30 lantai 8, 180 m dari gapura Jinma Biji dan 400 m dari metro Wuyi Road; sekitar 27 km ke Bandara Changshui.',
      price: 'CNY 156–165 per malam', priceNote: 'Trip.com untuk 20–21 November 2026: Tatami Room CNY 165 termasuk pajak setelah diskon CNY 132; tanpa diskon sekitar CNY 297.',
      foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Rusia, Brunei, Malaysia, dan Inggris pada Oktober–November 2026.',
      rooms: 'Kamar tatami 15–16 m² dengan kamar mandi dalam dan AC. Kamar boleh merokok, jadi minta kamar bebas rokok. Resepsionis 09.00–24.00.',
      halal: 'Ulasan Oktober 2026: banyak toko makanan halal tepat di bawah hotel.',
      reason: 'Kamar privat di kawasan Jinma Biji, paling dekat ke jalan makanan Hui.',
      links: [{ label: 'Trip.com', url: 'https://us.trip.com/hotels/kunming-hotel-detail-119278783/totoro-elf-hotel/', gallery: true }, { label: 'Ctrip (Mandarin)', url: 'https://hotels.ctrip.com/hotels/119278783.html' }],
      sources: [
        { title: 'Trip.com – Totoro Elf Hotel (policy, rooms, reviews, distances)', url: 'https://us.trip.com/hotels/kunming-hotel-detail-119278783/totoro-elf-hotel/' },
        { title: 'Trip.com dated list, Kunming 20–21 Nov 2026 (Totoro CNY 165 incl. taxes)', url: 'https://us.trip.com/hotels/list?city=34&cityName=Kunming&checkin=2026/11/20&checkout=2026/11/21&adult=1&crn=1&children=0&curr=CNY&barCurr=CNY&listFilters=13~4244494*18*25.0328394%7C102.7084259%7CYongning%20Mosque%7C4244494%7C2*2,14~0.5*14*0.5*2,15~2*15*150%7C200*2,75~TAG_495*75*495*2,6~10*6*10*2,17~3*17*3*2' },
      ],
    },
    hostel: {
      kind: 'Hostel', name: 'Kunming Upland International Youth Hostel', chinese: '昆明倾城国际青年旅舍', chineseAddress: '昆明市五华区华山西路92号',
      room: 'Kamar privat', location: 'Huashan West Road No. 92, antara Green Lake dan Kota Tua; 3 menit ke metro Huashan West Road dan sekitar 1,6 km ke kawasan halal.',
      price: 'CNY 147–178 per malam', priceNote: 'Hostelworld untuk 20 November 2026: Standard Single Private Ensuite CNY 147–158, Standard Double CNY 166–178.',
      foreignGuests: 'Hostelworld 9,4 dari 1.818 penilaian; ada ulasan tamu Kanada, Inggris, Australia, dan Italia pada 2026.',
      rooms: 'Resepsionis 24 jam, lift, penitipan bagasi gratis. Tanpa sarapan.',
      reason: 'Hostel besar bernilai tinggi dengan kamar privat di bawah batas dan resepsionis 24 jam.',
      links: [{ label: 'Hostelworld', url: 'https://www.hostelworld.com/hostels/p/57778/kunming-upland-international-youth-hostel/', gallery: true }],
      sources: [
        { title: 'Hostelworld availability API, 20 Nov 2026, CNY', url: 'https://prod.apigee.hostelworld.com/legacy-hwapi-service/2.2/properties/57778/availability/?guests=1&num-nights=1&date-start=2026-11-20&currency=CNY' },
        { title: 'Hostelworld – Kunming Upland International Youth Hostel', url: 'https://www.hostelworld.com/hostels/p/57778/kunming-upland-international-youth-hostel/' },
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
