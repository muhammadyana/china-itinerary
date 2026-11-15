import { stayBases, type Stay, type StayBase } from './stays.ts';

// The calm option's nights. 9–17 November were priced on Trip.com for those exact dates and party sizes (one adult until
// 16 November, two from 17 November) on 5 November 2026 and re-checked independently the same day. 8 and 18–20 November
// are the main plan's own bases, unchanged; picks the main plan also uses keep its name, address and evidence and
// replace only what is specific to the new dates.
export const calmStaysPath = '/places/calm-stays/';
export const calmStaysCheckedAt = '2026-11-05';

/** A stays.ts base for consecutive calm nights; `id` is the first night's date, the section anchor on the calm stays page. */
/** `paid` is the rupiah amount recorded on the expenses page, from the owner's order screenshot.
 * For a room shared with a friend it is the owner's half (`paidShare`). */
export interface CalmStayBase extends StayBase { nights: string[]; fromMain: boolean; paid?: number; paidShare?: boolean }

const mainBase = (id: string) => {
  const base = stayBases.find(item => item.id === id);
  if (!base) throw new Error(`stays.ts has no base ${id}`);
  return base;
};
const trip = (url: string) => ({ label: 'Trip.com', url, gallery: true });

// Shared nights: the main plan's base and picks, priced by the main plan for the same night.
const sharedNight = (id: string, date: string): CalmStayBase => {
  const base = mainBase(id);
  return { ...base, id: date, nights: [date], fromMain: true, notes: ['Sama dengan rencana utama; harga dicek 4 November untuk malam ini.', ...base.notes] };
};

const jiuzhaigouList = (checkin: string, checkout: string) => `https://us.trip.com/hotels/list?cityId=91&provinceId=22&countryId=1&cityName=Jiuzhaigou&checkin=${checkin}&checkout=${checkout}&crn=1&adult=1&listFilters=29~1*29*1~1*2,50~8~406*8*406~33.26680143146601~103.9193668996518~2,17~3*17*3&curr=CNY&locale=en-US`;
const jiuzhaigouGate = { title: 'OpenStreetMap Nominatim: 九寨沟景区沟口游客中心 (straight-line distances from each Trip.com pin)', url: 'https://nominatim.openstreetmap.org/search?q=九寨沟游客中心&format=json' };

const dandelion: Stay = {
  kind: 'Hotel', name: 'Dandelion Theme Hotel', chinese: '九寨沟蒲公英主题酒店', chineseAddress: '彭丰天堂口步行街',
  room: 'Kamar privat', overBudget: true,
  location: 'Jalan pejalan kaki Tiantangkou, Desa Pengfeng: sekitar 1,5 km garis lurus dari pusat pengunjung Jiuzhaigou, sekitar 20 menit jalan kaki menurut deskripsi hotel dan ulasan tamu. Ulasan tanpa tanggal menyebut pemilik menawarkan antar gratis ke taman pukul 08.00.',
  price: 'CNY 170–188 per malam',
  priceNote: 'Trip.com untuk satu orang, termasuk pajak: 9–10 November Deluxe Queen CNY 188, 10–11 November Cozy Queen CNY 170. Dipesan sekaligus 9–11 November, Deluxe Queen CNY 376 untuk dua malam. Tanpa label promo. Pembatalan hanya bisa dalam 30 menit setelah memesan.',
  foreignGuests: 'Trip.com: menerima tamu dari semua negara. Resepsionis 24 jam.',
  rooms: 'AC dan selimut listrik di kamar. Empat lantai tanpa lift menurut ulasan; koper bisa dititipkan di resepsionis sebelum check-in pukul 16.00. Check-out sebelum 14.00, tanpa sarapan. Nilai 8,5 dari 137 ulasan.',
  halal: 'Belum ada catatan makanan halal untuk hotel ini. Rencana utama mengutip ulasan September 2025 tentang restoran 清真 di Desa Pengfeng; belum dicek ulang.',
  reason: 'Kamar privat dua malam tanpa bergantung promo: CNY 5 di atas batas untuk 9 November, di bawah batas untuk 10 November.',
  links: [trip('https://us.trip.com/hotels/detail/?hotelId=2147595&checkIn=2026-11-09&checkOut=2026-11-11&adult=1&crn=1&curr=CNY')],
  sources: [
    { title: 'Trip.com list, Jiuzhaigou Tourist Center zone, 9–11 Nov 2026 (2 nights), sorted by price', url: jiuzhaigouList('2026-11-09', '2026-11-11') },
    { title: 'Trip.com list, same zone, 9–10 Nov 2026', url: jiuzhaigouList('2026-11-09', '2026-11-10') },
    { title: 'Trip.com list, same zone, 10–11 Nov 2026', url: jiuzhaigouList('2026-11-10', '2026-11-11') },
    { title: 'Trip.com: Dandelion Theme Hotel detail (policy, facilities, reviews)', url: 'https://us.trip.com/hotels/detail/?hotelId=2147595&curr=CNY' },
    { title: 'Trip.com zh-HK: 九寨溝蒲公英主題酒店 (Chinese name, address, reviews)', url: 'https://hk.trip.com/hotels/detail/?hotelId=2147595&locale=zh-HK' },
    jiuzhaigouGate,
  ],
};

const mcsrh: Stay = {
  kind: 'Hotel', name: 'Mcsrh Hotel Chunxi Road Taikoo Li', chinese: 'Mcsrh麦嘉·拾趣酒店(成都春熙路太古里店)', chineseAddress: '商业场街1号附89号',
  room: 'Kamar privat',
  location: 'Dekat Chunxi Road dan Taikoo Li: sekitar 1,5 km garis lurus (1,7 km berkendara) dari Masjid Huangcheng. Ke Chengdu South 8,2 km, ±8 menit tanpa macet; cabut ±07.00, DiDi sekitar 15–20 menit untuk C57 08.00.',
  price: 'CNY 138 per malam',
  priceNote: 'Trip.com untuk satu orang, 14–15 November (dicek 6 November 2026): Room M1 dengan satu ranjang double, CNY 138 termasuk pajak, bisa dibatalkan gratis sampai 14 November 18.00; tinggal 3 kamar dengan harga ini. Sebagian kamar M1 berjendela ke koridor.',
  foreignGuests: 'Trip.com: menerima tamu dari semua negara, berlabel "Hi China!". 238 dari 5.163 ulasan berbahasa Inggris.',
  rooms: 'Bintang 3, dibuka 2023, resepsionis 24 jam, penitipan bagasi gratis: titip koper saat tiba siang, check-in mulai 14.00. Ulasan menyebut kamar kecil, kurang lega untuk koper 28–30 inci. Tanpa sarapan.',
  reason: 'Nilai 9,3 dari 5.163 ulasan, di bawah batas tanpa promo, dan cukup dekat ke masjid untuk berjalan kaki.',
  links: [trip('https://us.trip.com/hotels/detail/?hotelId=115543776&checkIn=2026-11-14&checkOut=2026-11-15&adult=1&crn=1&curr=CNY')],
  sources: [
    { title: 'Trip.com: Mcsrh Hotel, 14–15 Nov 2026, 1 adult (CNY 138, 6 Nov 2026)', url: 'https://us.trip.com/hotels/detail/?hotelId=115543776&checkIn=2026-11-14&checkOut=2026-11-15&adult=1&crn=1&curr=CNY' },
    { title: 'Trip.com list filtered to Mcsrh, 13–15 Nov 2026', url: 'https://us.trip.com/hotels/list?city=28&checkin=2026-11-13&checkout=2026-11-15&adult=1&crn=1&curr=CNY&listFilters=31~115543776*31*115543776' },
    { title: 'Trip.com: Mcsrh Hotel detail (policy, free luggage storage, reviews)', url: 'https://us.trip.com/hotels/detail/?hotelId=115543776&curr=CNY' },
    { title: 'OSRM: Mcsrh to Chengdu South (no traffic)', url: 'https://router.project-osrm.org/route/v1/driving/104.07630040428982,30.661163238041546;104.0660435,30.6082704?overview=false' },
    { title: 'OpenStreetMap: Huangcheng Mosque (皇城清真寺, 小河街2号)', url: 'https://www.openstreetmap.org/way/582845149' },
  ],
};

const desti: Stay = {
  kind: 'Hostel', name: 'Chengdu Desti Youth Hostel Chunxi Road', chinese: '背包十年青年旅舍(成都春熙路店)', chineseAddress: '三多里82号1栋',
  room: 'Ranjang dorm',
  location: 'Dekat Chunxi Road: sekitar 1,3 km garis lurus dari Masjid Huangcheng. Ke Chengdu South 8,7 km, ±9 menit tanpa macet.',
  price: 'CNY 52 per ranjang (promo menginap pertama)',
  priceNote: 'Trip.com untuk satu orang, 14–15 November (dicek 6 November 2026): ranjang di dorm pria 10 orang, CNY 52 termasuk pajak. Harga promo menginap pertama (potongan 19%), bisa dibatalkan gratis sampai 14 November 14.00.',
  foreignGuests: 'Trip.com: menerima tamu dari semua negara, berlabel "Hi China!". Nilai 9,3 dari 4.161 ulasan.',
  rooms: 'Kamar mandi bersama, resepsionis 24 jam, jam tenang 23.00–07.00. Berangkat 07.30 pada 16 November dari dorm bisa mengganggu tamu lain.',
  reason: 'Ranjang termurah bernilai tinggi di Chunxi Road, dekat masjid.',
  links: [trip('https://us.trip.com/hotels/detail/?hotelId=19644601&checkIn=2026-11-14&checkOut=2026-11-15&adult=1&crn=1&curr=CNY')],
  sources: [
    { title: 'Trip.com list filtered to Desti, 13–15 Nov 2026, CNY 0–80', url: 'https://us.trip.com/hotels/list?city=28&checkin=2026-11-13&checkout=2026-11-15&adult=1&crn=1&curr=CNY&listFilters=31~19644601*31*19644601,15~Range*15*0~80' },
    { title: 'Trip.com: Desti Youth Hostel detail (policy)', url: 'https://us.trip.com/hotels/detail/?hotelId=19644601&curr=CNY' },
  ],
};

const huaqianYuexia: Stay = {
  kind: 'Guesthouse', name: 'Huaqian Yuexia Inn', chinese: '丽江大研古城五一街花前月夏客栈', chineseAddress: '大研古镇五一街文生巷76号',
  room: 'Kamar privat',
  location: 'Di dalam Kota Tua Dayan, kawasan Jalan Wuyi: mobil berhenti di gerbang utama, lalu 5–10 menit jalan kaki; menurut ulasan September 2026 pemilik membawa koper dari gerbang dengan sepeda. Mobil dan tur menjemput di gerbang, bukan di pintu.',
  price: 'CNY 66 per malam',
  priceNote: 'Trip.com untuk satu orang, 15–16 November: Cozy Queen CNY 66 termasuk pajak, label diskon "Surprise Savings" 18%, bisa dibatalkan gratis; tinggal 1 kamar dengan harga ini pada 5 November.',
  foreignGuests: 'Trip.com: menerima tamu dari semua negara. Ada ulasan tamu Malaysia pada Oktober 2026.',
  rooms: 'AC tercantum, pemanas tidak. Resepsionis 24 jam, jam tenang 00.00–06.00, 15 kamar, tanpa sarapan. Nilai 9,5 dari 384 ulasan.',
  halal: 'Ulasan tamu Malaysia Oktober 2026: pemilik memberi rekomendasi makanan halal karena mereka Muslim.',
  reason: 'Kamar privat termurah bernilai 9+ di dalam kota tua, dengan pemilik yang membantu mencari makanan halal.',
  links: [trip('https://us.trip.com/hotels/detail/?hotelId=1970079&checkIn=2026-11-15&checkOut=2026-11-16&adult=1&crn=1&curr=CNY')],
  sources: [
    { title: 'Trip.com list, Old Town of Lijiang within 1 km, 15–16 Nov 2026, CNY 60–183, rated 9+, sorted by price', url: 'https://us.trip.com/hotels/list?city=37&checkin=2026-11-15&checkout=2026-11-16&adult=1&crn=1&curr=CNY&listFilters=50~50~4193556*50*26.8705527~100.2355336~Old%20Town%20of%20Lijiang~4193556~2,14~1*14*1,15~Range*15*60~183,17~3*17*3,6~9*6*9' },
    { title: 'Trip.com: Huaqian Yuexia Inn detail (policy, reviews)', url: 'https://us.trip.com/hotels/detail/?hotelId=1970079&curr=CNY' },
  ],
};

const hemuju: Stay = {
  kind: 'Guesthouse', name: 'Lijiang Hemuju Homestay (Gucheng South Gate)',
  chinese: '丽江和睦居民宿(古城南门店)',
  room: 'Kamar privat',
  location: 'No. 24 Jibaowu West Section, Xiabahe Community, Gucheng District, Lijiang (Gucheng South Gate / 古城南门).',
  price: 'sudah dipesan',
  priceNote: 'Sudah dipesan di Trip.com pada 15 November.',
  foreignGuests: 'Dipesan di Trip.com pada 15 November; kebijakan tamu asing selain itu belum dicek terpisah.',
  rooms: 'Check-in setelah 14.00, check-out sebelum 12.00.',
  reason: 'Sudah dipesan di Hemuju Homestay, dekat 古城南门.',
  links: [],
  sources: [],
};

const jiuzhaigou = mainBase('jiuzhaigou');
const chengdu = mainBase('chengdu');
const lijiang = mainBase('lijiang');
const shangriLa = mainBase('shangri-la');

export const calmStayBases: CalmStayBase[] = [
  {
    ...chengdu, id: '2026-11-08', nights: ['2026-11-08'], fromMain: false, booked: true, paid: 292719,
    notes: [
      'Sudah dipesan di Trip.com pada 6 November: satu malam, 8–9 November.',
      'Penitipan bagasi gratis menurut halaman Trip.com hotel ini: titip koper pagi 9 November sebelum ke Zhongshu Ge. Bila koper besar mau ditinggal sampai 14 November, tanyakan dulu ke hotel; malam 14 November juga mengusulkan hotel yang sama.',
    ],
    hotel: {
      ...mcsrh,
      location: 'Dekat Chunxi Road dan Taikoo Li: sekitar 1,5 km garis lurus dari Masjid Huangcheng. Ke Xinnanmen Bus Station, titik jemput shuttle 9 November, sekitar 3 km: ±4 menit berkendara tanpa macet atau ±31 menit jalan kaki.',
      price: 'CNY 107 per malam',
      priceNote: 'Sudah dipesan di Trip.com: Rp292.719 untuk 8–9 November, Room M1 dengan satu ranjang double, sekitar CNY 107. Pesanan terkonfirmasi.',
      reason: 'Sudah dipesan untuk malam pertama di Chengdu.',
      links: [trip('https://us.trip.com/hotels/detail/?hotelId=115543776&checkIn=2026-11-08&checkOut=2026-11-09&adult=1&crn=1&curr=CNY')],
    },
  },
  {
    ...jiuzhaigou, id: '2026-11-09', nights: ['2026-11-09', '2026-11-10'], fromMain: false, booked: true, paid: 406629,
    notes: [
      'Sudah dipesan di Trip.com pada 6 November: dua malam, 9–11 November, sudah dibayar.',
      'Check-in mulai 14.00; check-out sebelum 12.00, dengan bonus check-out terlambat sampai 14.00. Pagi 11 November mobil ke Huanglong menjemput 07.30, jadi bonus itu tidak terpakai.',
      ...jiuzhaigou.notes.filter(note => note.startsWith('Hindari')),
    ],
    hotel: {
      ...jiuzhaigou.hostel,
      room: 'Kamar privat',
      location: 'Bianbian Street No. 25, Desa Longkang, Zhangzha: sekitar 1,8 km garis lurus dari pusat pengunjung, 20–30 menit jalan kaki. Untuk masuk 08.00 pada 10 November mungkin perlu taksi.',
      price: 'CNY 75 per malam',
      priceNote: 'Sudah dipesan di Trip.com: IDR 406.629 untuk 9–11 November (dua malam, termasuk PPN IDR 24.898), dibayar online; sekitar CNY 75 per malam dengan kurs tersimpan. Tipe "Bed in Single Room with Shared Bathroom (Male Only)": satu ranjang single untuk satu orang, kamar mandi bersama, tanpa sarapan.',
      reason: 'Sudah dipesan untuk kedua malam di Jiuzhaigou.',
      links: [trip('https://us.trip.com/hotels/detail/?hotelId=121135583&checkIn=2026-11-09&checkOut=2026-11-11&adult=1&crn=1&curr=CNY')],
    },
    // Not shown while the base is booked; kept as the fallback if the booking is cancelled.
    hostel: dandelion,
  },
  {
    ...chengdu, id: '2026-11-11', nights: ['2026-11-11', '2026-11-12', '2026-11-13'], fromMain: false, booked: true, paid: 935530,
    notes: [
      'Sudah dipesan di Trip.com pada 11 November: tiga malam, 11–14 November. Basis untuk Bipenggou (12 November) dan hari istirahat 13 November; koper besar yang dititip sejak 9 November bisa diambil 11 November malam.',
      'Batal gratis sampai 11 November 18.00 waktu setempat; setelah itu biaya batal Rp266.517.',
    ],
    hotel: {
      ...mcsrh,
      price: 'CNY 115 per malam',
      priceNote: 'Sudah dipesan di Trip.com: Rp935.530 untuk 11–14 November (tiga malam), sekitar CNY 115 per malam. Pesanan terkonfirmasi.',
      reason: 'Sudah dipesan untuk 11–13 November, hotel yang sama dengan 8 November.',
      links: [trip('https://us.trip.com/hotels/detail/?hotelId=115543776&checkIn=2026-11-11&checkOut=2026-11-14&adult=1&crn=1&curr=CNY')],
    },
    hostel: desti,
  },
  {
    ...chengdu, id: '2026-11-14', nights: ['2026-11-14', '2026-11-15'], fromMain: false, booked: true, paid: 754697,
    notes: [
      'Sudah dipesan di Trip.com pada 13 November: dua malam, 14–16 November, menyambung pesanan 11–14 November di hotel yang sama. Koper tetap di kamar selama Siguniangshan dan day trip Dujiangyan, sebelum C57 08.00 pada 16 November.',
      'Batal gratis sampai 14 November 18.00 waktu setempat; setelah itu biaya batal Rp486.725.',
    ],
    hotel: {
      ...mcsrh,
      price: 'CNY 139 per malam',
      priceNote: 'Sudah dipesan di Trip.com: Rp754.697 untuk 14–16 November (dua malam, setelah potongan Trip Coins Rp17.682), sekitar CNY 139 per malam. Pesanan terkonfirmasi.',
      reason: 'Sudah dipesan untuk 14–15 November, hotel yang sama dengan 11–13 November.',
      links: [trip('https://us.trip.com/hotels/detail/?hotelId=115543776&checkIn=2026-11-14&checkOut=2026-11-16&adult=1&crn=1&curr=CNY')],
    },
    hostel: desti,
  },
  {
    ...lijiang, id: '2026-11-16', nights: ['2026-11-16'], fromMain: false, booked: true, paid: 223391,
    notes: [
      'Sudah dipesan di Trip.com pada 15 November: satu malam, 16–17 November, sendiri (bukan dibagi dua). Dibayar Rp223.391.',
      'Batal gratis sampai 16 November 18.00 waktu setempat; setelah itu biaya batal paling sedikit Rp67.017. Check-in setelah 14.00, check-out sebelum 12.00.',
      'Malam 17 November di penginapan yang sama; tidak pindah hotel saat teman tiba.',
    ],
    hotel: {
      ...hemuju,
      price: 'sekitar CNY 82',
      priceNote: 'Sudah dipesan di Trip.com pada 15 November: Rp223.391 untuk satu malam, 16–17 November, sendiri (bukan dibagi dua). Batal gratis sampai 16 November 18.00 waktu setempat; setelah itu biaya batal paling sedikit Rp67.017.',
      reason: 'Sudah dipesan untuk malam 16 November, sendiri, di penginapan yang sama dengan malam 17 November.',
    },
    hostel: huaqianYuexia,
  },
  {
    ...lijiang, id: '2026-11-17', nights: ['2026-11-17'], fromMain: false, booked: true, paid: 95600, paidShare: true,
    notes: [
      'Sudah dipesan di Trip.com pada 15 November: satu malam, 17–18 November, Elegant Queen Room. Total Rp191.201, bagianmu Rp95.600 (50%).',
      'Batal gratis sampai 17 November 18.00 waktu setempat. Check-in setelah 14.00, check-out sebelum 12.00.',
      'Penginapan yang sama dengan malam 16 November; tidak pindah hotel saat teman tiba.',
    ],
    hotel: {
      ...hemuju,
      price: 'sekitar CNY 70 per kamar',
      priceNote: 'Sudah dipesan di Trip.com pada 15 November: total Rp191.201 untuk satu malam, 17–18 November, Elegant Queen Room. Bagianmu Rp95.600 (50%). Batal gratis sampai 17 November 18.00 waktu setempat.',
      rooms: 'Elegant Queen Room. Check-in setelah 14.00, check-out sebelum 12.00.',
      reason: 'Sudah dipesan untuk malam 17 November; kamar dibagi dua, di penginapan yang sama dengan malam 16 November.',
    },
    hostel: huaqianYuexia,
  },
  {
    ...shangriLa, id: '2026-11-18', nights: ['2026-11-18'], fromMain: false, booked: true, paid: 178342, paidShare: true,
    notes: [
      'Sudah dipesan di Trip.com pada 15 November: satu malam, 18–19 November, Sunlit Street View Double Bed Room (satu ranjang king). Total Rp356.684, bagianmu Rp178.342 (50%).',
      'Batal gratis sampai 17 November 23.59 waktu setempat.',
    ],
    hotel: {
      ...shangriLa.hostel,
      name: 'Shangri-la Jianyi light luxury intelligent B&B',
      location: 'No. 123 Dalalang, Dukezong Ancient Town, Shangri-La; sekitar 6 menit jalan kaki ke roda doa Guishan.',
      price: 'sekitar CNY 131 per kamar',
      priceNote: 'Sudah dipesan di Trip.com pada 15 November: total Rp356.684 untuk satu malam, 18–19 November, Sunlit Street View Double Bed Room (satu ranjang king). Bagianmu Rp178.342 (50%). Batal gratis sampai 17 November 23.59 waktu setempat.',
      rooms: 'Sunlit Street View Double Bed Room, satu ranjang king. Pemanas seluruh rumah, suplai oksigen, dan pelembap. Resepsionis 08.30–24.00.',
      reason: 'Sudah dipesan untuk malam 18 November; kamar dibagi dua.',
      links: [trip('https://us.trip.com/hotels/detail/?hotelId=5663751&checkIn=2026-11-18&checkOut=2026-11-19&adult=2&crn=1&curr=CNY')],
    },
    hostel: shangriLa.hotel,
  },
  {
    ...lijiang, id: '2026-11-19', nights: ['2026-11-19'], fromMain: false, booked: true, paid: 110127, paidShare: true,
    notes: [
      'Sudah dipesan di Trip.com pada 15 November: satu malam, 19–20 November, Sunshine Wonderful Twin Room (dua ranjang double). Total Rp220.254, bagianmu Rp110.127 (50%).',
      'Batal gratis sampai 17 November 18.00 waktu setempat. Check-in setelah 10.00, check-out sebelum 14.00. Mobil Jade Dragon menjemput 06.30 dengan koper; 166 Hotel bisa dijangkau mobil sampai pintu.',
    ],
    hotel: {
      ...lijiang.hotel,
      name: '166 Hotel (Lijiang Ancient City)',
      price: 'sekitar CNY 81 per kamar',
      priceNote: 'Sudah dipesan di Trip.com pada 15 November: total Rp220.254 untuk satu malam, 19–20 November, Sunshine Wonderful Twin Room (dua ranjang double). Bagianmu Rp110.127 (50%). Batal gratis sampai 17 November 18.00 waktu setempat.',
      rooms: 'Sunshine Wonderful Twin Room, dua ranjang double. Check-in setelah 10.00, check-out sebelum 14.00. Kamar mandi dalam, AC pemanas, resepsionis 24 jam, penitipan bagasi. Tanpa sarapan.',
      reason: 'Sudah dipesan untuk malam 19 November; kamar dibagi dua.',
      links: [trip('https://us.trip.com/hotels/detail/?hotelId=109842432&checkIn=2026-11-19&checkOut=2026-11-20&adult=2&crn=1&curr=CNY')],
    },
    hostel: lijiang.hostel,
  },
  {
    ...sharedNight('dali', '2026-11-20'), fromMain: false,
    notes: ['Hotel rencana utama untuk Dali, sehari lebih lambat: harga dicek 4 November untuk 19 November, harga 20 November belum dicek. C442 tiba 22.21, jadi kabari hotel jam tiba.', ...mainBase('dali').notes],
  },
];

export const calmStayBaseForDate = (date: string) => calmStayBases.find(base => base.nights.includes(date));
/** The calm stays section that covers a night, for links from the other calm pages. */
export const calmStaysHref = (date: string) => {
  const base = calmStayBaseForDate(date);
  return base ? `${calmStaysPath}#${base.id}` : calmStaysPath;
};
/** "9 dan 10 November", "8, 18, 19, dan 20 November". */
export const nightList = (dates: string[]) => {
  const numbers = dates.map(date => Number(date.slice(-2)));
  const last = numbers.pop();
  return numbers.length ? `${numbers.join(', ')}${numbers.length > 1 ? ',' : ''} dan ${last} November` : `${last} November`;
};
/** Both picks of a base with their prices, as one sentence. */
export const stayPicksText = (base: StayBase) => `${base.hotel.name} ${base.hotel.price}, atau ${base.hostel.name} ${base.hostel.price}.`;
/** The picks for a night, for the calm day texts. */
export const calmStayPicks = (date: string) => {
  const base = calmStayBaseForDate(date);
  if (!base) throw new Error(`calm-stays.ts has no night ${date}`);
  return base.booked ? `Sudah dipesan: ${base.hotel.name}, ${base.hotel.price}.` : `Usulan: ${stayPicksText(base)}`;
};
