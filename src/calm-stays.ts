import { stayBases, type Stay, type StayBase } from './stays.ts';

// The calm option's nights. 9–17 November were priced on Trip.com for those exact dates and party sizes (one adult until
// 16 November, two from 17 November) on 5 November 2026 and re-checked independently the same day. 8 and 18–20 November
// are the main plan's own bases, unchanged; picks the main plan also uses keep its name, address and evidence and
// replace only what is specific to the new dates.
export const calmStaysPath = '/places/calm-stays/';
export const calmStaysCheckedAt = '2026-11-05';

/** A stays.ts base for consecutive calm nights; `id` is the first night's date, the section anchor on the calm stays page. */
export interface CalmStayBase extends StayBase { nights: string[]; fromMain: boolean }

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

const xingyun: Stay = {
  kind: 'Hotel', name: 'Li County Bipenggou Xingyun Theme Hotel', chinese: '理县毕棚沟行云主题酒店',
  room: 'Kamar privat',
  location: 'Sekitar 10 menit berkendara ke gerbang Bipenggou menurut deskripsi hotel, sekitar 7 km garis lurus dari titik gerbang. Alamatnya menyebut "sekitar 1 km dari pintu masuk", yang kemungkinan pintu jalan 理小路, bukan gerbang taman. Atur mobil ke gerbang untuk 12 November pagi.',
  price: 'CNY 177 per malam',
  priceNote: 'Trip.com untuk satu orang, 11–13 November: Guestroom with View dengan dua ranjang, CNY 354 untuk dua malam termasuk pajak. Label diskon "Surprise Savings" 42% dari sekitar CNY 297 per malam; bisa dibatalkan gratis.',
  foreignGuests: 'Trip.com: menerima tamu dari semua negara; resepsionis 24 jam. Ulasan Oktober 2024 menyebut tamu tidak didaftarkan dengan kartu identitas, jadi telepon dulu (+86-13795795975) untuk memastikan hotel mendaftarkan paspor asing (境外人员住宿登记).',
  rooms: 'AC, pemanas lantai, dan selimut listrik. Sarapan Tionghoa 07.30–09.00, harganya tidak tercantum. Check-in mulai 14.00. Nilai 7,3 dari 75 ulasan, beragam.',
  reason: 'Kamar privat di bawah batas yang paling dekat ke gerbang dengan bukti menerima tamu asing, berpemanas lantai.',
  links: [trip('https://us.trip.com/hotels/detail/?hotelId=1316249&checkIn=2026-11-11&checkOut=2026-11-13&adult=1&crn=1&curr=CNY')],
  sources: [
    { title: 'Trip.com list, Li County/Bipeng Valley, 11–13 Nov 2026, CNY 0–183, sorted by price', url: 'https://www.trip.com/hotels/list?cityId=7751&provinceId=22&countryId=1&checkin=2026-11-11&checkout=2026-11-13&crn=1&adult=1&listFilters=50~50~6652115*50*31.3131589~102.9487368~Bipeng%20Valley~6652115~2,15~Range*15*0~183,17~3*17*3&curr=CNY&locale=en-US' },
    { title: 'Trip.com: Xingyun Theme Hotel detail (policy)', url: 'https://us.trip.com/hotels/detail/?hotelId=1316249&curr=CNY' },
    { title: 'Trip.com zh-HK: 理縣畢棚溝行雲主題酒店 (description: about a 10-minute drive to the scenic-area entrance; reviews)', url: 'https://hk.trip.com/hotels/detail/?hotelId=1316249&locale=zh-HK' },
  ],
};

const mcsrh: Stay = {
  kind: 'Hotel', name: 'Mcsrh Hotel Chunxi Road Taikoo Li', chinese: 'Mcsrh麦嘉·拾趣酒店(成都春熙路太古里店)', chineseAddress: '商业场街1号附89号',
  room: 'Kamar privat',
  location: 'Dekat Chunxi Road dan Taikoo Li: sekitar 1,5 km garis lurus (1,7 km berkendara) dari Masjid Huangcheng. Ke Panda Base sekitar 17 km, ±22 menit tanpa macet (perkiraan), untuk berangkat 06.55 pada 14 November. Ke Chengdu South 8,2 km, ±8 menit tanpa macet; sisihkan 20–30 menit untuk D239 08.33.',
  price: 'CNY 138 per malam',
  priceNote: 'Trip.com untuk satu orang, 13–15 November: Room M1 dengan satu ranjang double, CNY 276 untuk dua malam termasuk pajak, tanpa promo. Bisa dibatalkan gratis; tinggal 4 kamar dengan harga ini pada 5 November.',
  foreignGuests: 'Trip.com: menerima tamu dari semua negara, berlabel "Hi China!". 238 dari 5.163 ulasan berbahasa Inggris.',
  rooms: 'Bintang 3, dibuka 2023, resepsionis 24 jam, penitipan bagasi gratis: titip koper saat tiba ±11.00–11.30, check-in mulai 14.00. Ulasan menyebut kamar kecil, kurang lega untuk koper 28–30 inci. Tanpa sarapan.',
  reason: 'Nilai 9,3 dari 5.163 ulasan, di bawah batas tanpa promo, dan cukup dekat ke masjid untuk berjalan kaki.',
  links: [trip('https://us.trip.com/hotels/detail/?hotelId=115543776&checkIn=2026-11-13&checkOut=2026-11-15&adult=1&crn=1&curr=CNY')],
  sources: [
    { title: 'Trip.com list filtered to Mcsrh, 13–15 Nov 2026', url: 'https://us.trip.com/hotels/list?city=28&checkin=2026-11-13&checkout=2026-11-15&adult=1&crn=1&curr=CNY&listFilters=31~115543776*31*115543776' },
    { title: 'Trip.com: Mcsrh Hotel detail (policy, free luggage storage, reviews)', url: 'https://us.trip.com/hotels/detail/?hotelId=115543776&curr=CNY' },
    { title: 'OSRM: Mcsrh to Chengdu South (no traffic)', url: 'https://router.project-osrm.org/route/v1/driving/104.07630040428982,30.661163238041546;104.0660435,30.6082704?overview=false' },
    { title: 'OpenStreetMap: Huangcheng Mosque (皇城清真寺, 小河街2号)', url: 'https://www.openstreetmap.org/way/582845149' },
  ],
};

const desti: Stay = {
  kind: 'Hostel', name: 'Chengdu Desti Youth Hostel Chunxi Road', chinese: '背包十年青年旅舍(成都春熙路店)', chineseAddress: '三多里82号1栋',
  room: 'Ranjang dorm',
  location: 'Dekat Chunxi Road: sekitar 1,3 km garis lurus dari Masjid Huangcheng. Ke Panda Base sekitar 14 km, ±22 menit tanpa macet; ke Chengdu South 8,7 km, ±9 menit tanpa macet.',
  price: 'CNY 52 per ranjang (promo menginap pertama)',
  priceNote: 'Trip.com untuk satu orang, 13–15 November: ranjang di dorm pria 10 orang, CNY 104 untuk dua malam termasuk pajak. Harga promo menginap pertama (potongan 19%), bisa dibatalkan gratis. Kamar privat khusus perempuan CNY 254 untuk dua malam sudah habis; tidak terlihat kamar privat pria di bawah batas.',
  foreignGuests: 'Trip.com: menerima tamu dari semua negara, berlabel "Hi China!". Nilai 9,3 dari 4.161 ulasan.',
  rooms: 'Kamar mandi bersama, resepsionis 24 jam, jam tenang 23.00–07.00. Berangkat 06.55 (14 November) dan 07.30 (15 November) dari dorm bisa mengganggu tamu lain.',
  reason: 'Ranjang termurah bernilai tinggi di Chunxi Road, dekat masjid.',
  links: [trip('https://us.trip.com/hotels/detail/?hotelId=19644601&checkIn=2026-11-13&checkOut=2026-11-15&adult=1&crn=1&curr=CNY')],
  sources: [
    { title: 'Trip.com list filtered to Desti, 13–15 Nov 2026, CNY 0–80', url: 'https://us.trip.com/hotels/list?city=28&checkin=2026-11-13&checkout=2026-11-15&adult=1&crn=1&curr=CNY&listFilters=31~19644601*31*19644601,15~Range*15*0~80' },
    { title: 'Trip.com: Desti Youth Hostel detail (policy)', url: 'https://us.trip.com/hotels/detail/?hotelId=19644601&curr=CNY' },
  ],
};

const huaqianYuexia: Stay = {
  kind: 'Guesthouse', name: 'Huaqian Yuexia Inn', chinese: '丽江大研古城五一街花前月夏客栈', chineseAddress: '大研古镇五一街文生巷76号',
  room: 'Kamar privat',
  location: 'Di dalam Kota Tua Dayan, kawasan Jalan Wuyi: mobil berhenti di gerbang utama, lalu 5–10 menit jalan kaki; menurut ulasan September 2026 pemilik membawa koper dari gerbang dengan sepeda. Mobil 08.30 pada 16 November menjemput di gerbang, bukan di pintu.',
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

const jiuzhaigou = mainBase('jiuzhaigou');
const bipenggou = mainBase('bipenggou');
const chengdu = mainBase('chengdu');
const lijiang = mainBase('lijiang');
const shangriLa = mainBase('shangri-la');

export const calmStayBases: CalmStayBase[] = [
  sharedNight('chengdu', '2026-11-08'),
  {
    ...jiuzhaigou, id: '2026-11-09', nights: ['2026-11-09', '2026-11-10'], fromMain: false,
    notes: [
      'Jiuzhaigou Yinghai Holiday Hotel, pilihan rencana utama, paling dekat ke pusat pengunjung (sekitar 1,2 km garis lurus), tetapi di atas batas untuk 9 November: Simple 2-bed Room CNY 220 termasuk pajak. Untuk 10 November Standard Room CNY 181. Keduanya harga promo menginap pertama Trip.com, bisa dibatalkan gratis, check-out sebelum 12.00.',
      ...jiuzhaigou.notes.filter(note => note.startsWith('Hindari')),
    ],
    hotel: dandelion,
    hostel: {
      ...jiuzhaigou.hostel,
      location: 'Bianbian Street No. 25, Desa Longkang: sekitar 1,8 km garis lurus dari pusat pengunjung, 20–30 menit jalan kaki. Paling jauh dari gerbang di antara tiga pilihan di sini; untuk masuk 08.00 pada 10 November mungkin perlu taksi.',
      price: 'CNY 79 per ranjang (promo menginap pertama)',
      priceNote: 'Trip.com untuk satu orang, termasuk pajak: ranjang di dorm khusus pria CNY 79 per malam untuk 9–10 dan 10–11 November, CNY 158 bila dipesan sekaligus. Harga promo menginap pertama, potongan 62% dari CNY 204; bisa dibatalkan gratis. Trip.com menulis tinggal 2 ranjang pada 5 November.',
      reason: 'Hostel rencana utama untuk 9 November, dengan harga yang sama untuk kedua malam opsi ini.',
      sources: [
        { title: 'Trip.com list, Jiuzhaigou Tourist Center zone, 9–11 Nov 2026 (dorm bed CNY 79 per night incl. tax)', url: jiuzhaigouList('2026-11-09', '2026-11-11') },
        ...jiuzhaigou.hostel.sources.slice(0, 1),
        jiuzhaigouGate,
      ],
    },
  },
  {
    ...bipenggou, id: '2026-11-11', nights: ['2026-11-11', '2026-11-12'], fromMain: false,
    notes: [
      'Kedua malam jatuh di libur sekolah Chengdu (Rabu–Jumat 11–13 November, menyambung akhir pekan). Dalam sekitar 2 km dari gerbang tidak ada kamar di bawah batas; yang paling dekat, Panyang Lake Hotel (sekitar 100 m dari gerbang), CNY 630 untuk dua malam dengan promo menginap pertama, termasuk sarapan.',
      'Cadangan di kota Lixian, sekitar 18 km garis lurus (±30 menit) dari gerbang: Li County Wuyoucheng Hotel, Deluxe Standard twin CNY 175 per malam dengan promo menginap pertama (CNY 350 untuk dua malam). Cozy Queen dari rencana utama sudah habis untuk tanggal ini, dan Cozy Standard tidak ber-AC. Perlu mobil ke gerbang 12 November dan saat berangkat 13 November.',
      'Belum terverifikasi: Xuehao Homestay sekitar 7 km dari gerbang, CNY 104 per malam, baru 3 ulasan dan tanpa pembatalan gratis; penerimaan tamu asingnya belum dicek. Good B&B (不鞠民宿) tidak ditemukan lewat pencarian Trip.com, jadi lokasi, harga, dan makanan halalnya belum diketahui.',
    ],
    hotel: xingyun,
    hostel: {
      ...bipenggou.hostel,
      overBudget: true,
      location: 'Desa Zhuangfang, Putou: sekitar 1,7 km dari gerbang menurut ulasan tamu, lebih dari 30 menit jalan kaki menanjak. Pemilik kadang mengantar ke gerbang, tetapi satu ulasan menyebut ia menolak pada pagi yang ramai; tanyakan untuk 12 November pukul 07.30 (telepon +86-18740890417).',
      price: 'CNY 268 per malam',
      priceNote: 'Trip.com untuk satu orang, 11–12 dan 12–13 November: Budget Twin dengan dua ranjang single CNY 268 per malam termasuk pajak (CNY 536 untuk dua malam), bisa dibatalkan gratis; tinggal 2 kamar dengan harga ini pada 5 November. Untuk 10–11 November di rencana utama CNY 158–168.',
      rooms: 'Selimut listrik, resepsionis 24 jam, check-in mulai 14.00. Label tarif menyebut sarapan; ulasan Oktober 2026 menggambarkannya sebagai satu telur, mantou, dan bubur, tanpa keterangan halal. Ulasan terbaru mengeluhkan debu dan noda di bantal. Budget Twin di lantai dasar dan boleh merokok; minta kamar bebas rokok.',
      reason: 'Pilihan rencana utama dan yang paling dekat ke gerbang di antara penginapan yang terbukti menerima tamu asing, sekitar CNY 85 per malam di atas batas selama libur sekolah.',
      links: [trip('https://us.trip.com/hotels/detail/?hotelId=81450342&checkIn=2026-11-11&checkOut=2026-11-13&adult=1&crn=1&curr=CNY')],
      sources: [
        { title: 'Trip.com list filtered to Xinlan Homestay, 11–13 Nov 2026', url: 'https://us.trip.com/hotels/list?city=7751&checkin=2026-11-11&checkout=2026-11-13&adult=1&crn=1&curr=CNY&listFilters=31~81450342*31*81450342' },
        { title: 'Trip.com list filtered to Xinlan Homestay, 12–13 Nov 2026', url: 'https://us.trip.com/hotels/list?city=7751&checkin=2026-11-12&checkout=2026-11-13&adult=1&crn=1&curr=CNY&listFilters=31~81450342*31*81450342' },
        { title: 'Trip.com: Xinlan Homestay detail (policy, breakfast review of 25 Oct 2026)', url: 'https://us.trip.com/hotels/detail/?hotelId=81450342&curr=CNY' },
        { title: 'Trip.com list, Li County/Bipeng Valley, 11–13 Nov 2026, CNY 0–400, sorted by distance', url: 'https://www.trip.com/hotels/list?cityId=7751&provinceId=22&countryId=1&checkin=2026-11-11&checkout=2026-11-13&crn=1&adult=1&listFilters=50~50~6652115*50*31.3131589~102.9487368~Bipeng%20Valley~6652115~2,15~Range*15*0~400,17~5*17*5&curr=CNY&locale=en-US' },
        { title: 'Trip.com list filtered to Wuyoucheng, 11–13 Nov 2026, CNY 110–164 (Cozy Queen sold out)', url: 'https://us.trip.com/hotels/list?city=7751&checkin=2026-11-11&checkout=2026-11-13&adult=1&crn=1&curr=CNY&listFilters=31~12829437*31*12829437,15~Range*15*110~164' },
        { title: 'Chuanguan: Chengdu autumn school break, 11–13 Nov 2026 (28 Oct 2026)', url: 'https://cbgc.scol.com.cn/news/8095432' },
      ],
    },
  },
  {
    ...chengdu, id: '2026-11-13', nights: ['2026-11-13', '2026-11-14'], fromMain: false,
    notes: [
      'Paling dekat ke Masjid Huangcheng, sekitar 1,0 km garis lurus: Chengdu Qingxian Hotel (成都清闲酒店, dekat Kuanzhai Alley dan People\'s Park). Cozy Queen tipe apartemen CNY 120 per malam (CNY 240 untuk dua malam, label diskon "Surprise Savings" 31%), bisa dibatalkan gratis, penitipan bagasi gratis. Unit lantai 10 dengan check-in mandiri; kabari tuan rumah untuk titip koper sebelum check-in.',
      'Sofis Svyain Hotel, pilihan untuk 8 November, belum punya harga untuk 13–15 November: Booking.com menolak pemeriksaan otomatis dan Priceline hanya menampilkan harga tanpa tanggal.',
      'Waktu berkendara di kartu ini dari OSRM tanpa macet; sisihkan waktu lebih.',
    ],
    hotel: mcsrh,
    hostel: desti,
  },
  {
    ...lijiang, id: '2026-11-15', nights: ['2026-11-15'], fromMain: false,
    notes: [
      'Mama Naxi Guesthouse, pilihan rencana utama untuk 18 November, kini CNY 209 untuk kamar privat 15 November, di atas batas dan tinggal satu kamar. Ranjang di dorm campur 8 orang CNY 44–58 termasuk pajak.',
      'Taksi berhenti di gerbang kota tua; 166 Hotel bisa dijangkau mobil sampai pintu, Huaqian Yuexia Inn tidak.',
    ],
    hotel: {
      ...lijiang.hotel,
      price: 'CNY 76 per malam',
      priceNote: 'Trip.com untuk satu orang, 15–16 November: Special Upgraded Room twin CNY 76 termasuk pajak dan parkir, label "Early Bird Deal" 7%, bisa dibatalkan gratis; tinggal 4 kamar dengan harga ini pada 5 November. Family room CNY 88. Pilih Upgraded Twin, karena sebagian tipe kamar tanpa AC.',
      rooms: 'Kamar mandi dalam, AC pemanas, lift, resepsionis 24 jam, penitipan bagasi. Tabung oksigen CNY 10 per tabung. Tanpa sarapan.',
      reason: 'Hotel rencana utama untuk 18 November, dengan harga yang sama untuk 15 November; mobil 08.30 tanggal 16 bisa menjemput di pintu.',
      links: [trip('https://us.trip.com/hotels/detail/?hotelId=109842432&checkIn=2026-11-15&checkOut=2026-11-16&adult=1&crn=1&curr=CNY')],
      sources: [
        { title: 'Trip.com list filtered to 166 Hotel, 15–16 Nov 2026', url: 'https://us.trip.com/hotels/list?city=37&checkin=2026-11-15&checkout=2026-11-16&adult=1&crn=1&curr=CNY&listFilters=31~109842432*31*109842432' },
        { title: 'Trip.com: 166 Hotel detail (policy, facilities, oxygen fee)', url: 'https://us.trip.com/hotels/detail/?hotelId=109842432&curr=CNY' },
        { title: 'Trip.com list filtered to Mama Naxi, 15–16 Nov 2026', url: 'https://us.trip.com/hotels/list?city=37&checkin=2026-11-15&checkout=2026-11-16&adult=1&crn=1&curr=CNY&listFilters=31~61483794*31*61483794' },
      ],
    },
    hostel: huaqianYuexia,
  },
  {
    ...shangriLa, id: '2026-11-16', nights: ['2026-11-16', '2026-11-17'], fromMain: false,
    notes: [
      'Satu kamar untuk 16–18 November: pesan untuk dua orang dan kabari hotel bahwa tamu kedua tiba 17 November; setiap paspor didaftarkan saat tiba.',
      'Kamar twin dengan oksigen: Haorui Xiangting Mountain View Hotel (香格里拉·浩瑞|香庭山语酒店(独克宗古城店), 长征大道24号), CNY 134 untuk 16–18 November berdua (CNY 67 per kamar per malam), label diskon "Surprise Savings" 29%, bisa dibatalkan gratis. Resepsionis 24 jam dan lift; nilai 8,6 dengan fasilitas agak tua, dan dua ranjang single tidak dijamin, jadi minta saat memesan.',
    ],
    hotel: {
      ...shangriLa.hotel,
      price: 'CNY 82 per malam (promo menginap pertama)',
      priceNote: 'Trip.com: Deluxe Standard dengan dua ranjang double, sampai 4 orang, CNY 82 per kamar per malam termasuk pajak, sama untuk 16–17 November satu orang dan 17–18 November dua orang; CNY 164 bila dipesan sekaligus 16–18 November. Harga promo menginap pertama (potongan 11%), tanpa promo sekitar CNY 87. Bisa dibatalkan gratis.',
      rooms: 'Pemanas di setiap kamar, dan menurut ulasan AC dataran tinggi menghangatkan dengan baik. Resepsionis 24 jam untuk berangkat 07.30 pada 18 November. Tanpa sarapan dan oksigen, padahal malam 16 November naik sekitar 900 m.',
      reason: 'Hotel rencana utama untuk 17 November; dua ranjang double cocok untuk berbagi kamar mulai malam 17 November.',
      links: [trip('https://us.trip.com/hotels/detail/?hotelId=3396520&checkIn=2026-11-16&checkOut=2026-11-18&adult=2&crn=1&curr=CNY'), ...shangriLa.hotel.links.slice(1)],
      sources: [
        { title: 'Trip.com list filtered to Duge Grand, 16–18 Nov 2026, 2 adults', url: 'https://us.trip.com/hotels/list?city=660&checkin=2026-11-16&checkout=2026-11-18&adult=2&crn=1&curr=CNY&listFilters=31~3396520*31*3396520' },
        { title: 'Trip.com list filtered to Duge Grand, 16–17 Nov 2026, 1 adult', url: 'https://us.trip.com/hotels/list?city=660&checkin=2026-11-16&checkout=2026-11-17&adult=1&crn=1&curr=CNY&listFilters=31~3396520*31*3396520' },
        { title: 'Trip.com: Duge Grand Hotel detail (policy, heating)', url: 'https://us.trip.com/hotels/detail/?hotelId=3396520&curr=CNY' },
        { title: 'Trip.com list, Shangri-La, 16–18 Nov 2026, 2 adults, CNY 60–183 (Haorui Xiangting twin CNY 134 for 2 nights)', url: 'https://us.trip.com/hotels/list?city=660&checkin=2026-11-16&checkout=2026-11-18&adult=2&crn=1&curr=CNY&listFilters=15~Range*15*60~183,17~3*17*3,6~9*6*9' },
        { title: 'Trip.com: Haorui Xiangting detail (policy, reviews)', url: 'https://us.trip.com/hotels/detail/?hotelId=1460861&curr=CNY' },
      ],
    },
    hostel: {
      ...shangriLa.hostel,
      price: 'CNY 118 per malam',
      priceNote: 'Trip.com: Light Luxury Double dengan satu ranjang queen CNY 118 per malam termasuk pajak, untuk 16–17 November satu orang dan 17–18 November dua orang; CNY 235 untuk 16–18 November. Tanpa promo, bisa dibatalkan gratis. Tidak ada kamar twin sampai CNY 250 per malam.',
      rooms: 'Pemanas seluruh rumah, suplai oksigen, dan pelembap. Hanya satu ranjang queen, jadi kurang cocok untuk dua teman. Resepsionis 08.30–24.00: selesaikan check-out malam sebelumnya untuk berangkat 07.30 pada 18 November.',
      reason: 'Pilihan kedua rencana utama, dengan oksigen di kamar dan nilai 9,7 dari 931 ulasan.',
      links: [trip('https://us.trip.com/hotels/detail/?hotelId=5663751&checkIn=2026-11-16&checkOut=2026-11-18&adult=2&crn=1&curr=CNY')],
      sources: [
        { title: 'Trip.com list filtered to Jianyi, 16–18 Nov 2026, 2 adults', url: 'https://us.trip.com/hotels/list?city=660&checkin=2026-11-16&checkout=2026-11-18&adult=2&crn=1&curr=CNY&listFilters=31~5663751*31*5663751' },
        { title: 'Trip.com: Jianyi detail (policy)', url: 'https://us.trip.com/hotels/detail/?hotelId=5663751&curr=CNY' },
      ],
    },
  },
  sharedNight('lijiang', '2026-11-18'),
  sharedNight('dali', '2026-11-19'),
  sharedNight('kunming', '2026-11-20'),
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
  return `Usulan: ${stayPicksText(base)}`;
};
