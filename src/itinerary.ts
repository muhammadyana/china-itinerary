// All itinerary facts and captions are transcribed or condensed from the supplied PDF.
// Dates, overnight bases and navigation are rendered from this one source of truth.
export interface Photo {
  id: string; width: number; height: number; sizes: number[];
  author: string; source: string; license: string; licenseUrl: string;
  origin: 'PDF' | 'Wikimedia Commons' | 'Pexels';
  photoNote?: string;
}
export interface Place {
  name: string; chinese?: string; description: string; page: number;
  photo?: string; alt?: string; photoNote?: string;
}
export type VisitStatus = 'Opsional' | 'Perlu konfirmasi' | 'Jika jalur dibuka' | 'Alternatif' | 'Terkonfirmasi';
export type Event =
  | { kind: 'stop'; place: string; time: string; note?: string; status?: VisitStatus }
  | { kind: 'transfer'; mode: 'car' | 'train' | 'bus' | 'walk' | 'plane' | 'cable'; title: string; detail?: string; status?: VisitStatus };
export interface Practical { title: string; text: string; link?: { label: string; url: string }; copy?: string }
export interface Day {
  date: string; title: string; shortTitle: string; region: string; route: string[];
  overnight: { name: string; area: string; elevation?: string; detail: string } | null;
  transport: string; intro: string; events: Event[]; practical: Practical[]; pages: number[];
}
export const pdfPath = 'China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf';
export const railUrl = 'https://www.12306.cn/en/index.html';
export const places: Record<string, Place> = {
  tfu: { name: 'Chengdu Tianfu (TFU)', chinese: '成都天府国际机场', description: 'Terminal 1 menjadi pintu masuk perjalanan; setelah imigrasi dan bagasi, lanjut langsung ke Chengdu East.', page: 5, photo: 'tfu', alt: 'Area dalam Terminal 1 Bandara Chengdu Tianfu dengan papan petunjuk dan pengunjung.' },
  'chengdu-east': { name: 'Stasiun Chengdu East', chinese: '成都东站', description: 'Di Chengdu Dong, siapkan paspor untuk pemeriksaan sebelum naik kereta menuju Huanglongjiuzhai.', page: 5, photo: 'chengdu-east', alt: 'Area pintu masuk Stasiun Chengdu East dengan papan nama stasiun.' },
  huanglongjiuzhai: { name: 'Stasiun Huanglongjiuzhai', chinese: '黄龙九寨站', description: 'Stasiun di wilayah Songpan ini menjadi titik berganti kendaraan menuju gerbang Jiuzhaigou.', page: 5, photo: 'huanglongjiuzhai', alt: 'Fasad Stasiun Huanglongjiuzhai di antara pegunungan.' },
  'jiuzhaigou-hotel': { name: 'Goukou / Pengfeng', description: 'Menginap dekat pintu masuk taman untuk dua malam, sebelum dijemput sopir pada 10 November.', page: 3 },
  'five-flower': { name: 'Five Flower Lake', chinese: '五花海', description: 'Dari jalur kayu di lembah Rize, lihat air biru-hijau dan batang pohon yang terendam di dasar danau.', page: 6, photo: 'five-flower', alt: 'Air toska bening dan batang terendam di Five Flower Lake, dikelilingi pohon kuning dan jingga.' },
  shuzheng: { name: 'Danau Shuzheng', chinese: '树正群海', description: 'Danau-danau kecil tersusun bertingkat di antara hutan, diikuti jalur kayu sepanjang lembah.', page: 6, photo: 'shuzheng', alt: 'Danau biru Shuzheng di antara pulau-pulau kecil dan dedaunan kuning, jingga, serta hijau.' },
  maobiliang: { name: 'Maobiliang & Siguniangshan', chinese: '猫鼻梁', description: 'Saat cuaca cerah, puncak-puncak Siguniangshan berderet membentuk siluet “Empat Saudari”.', page: 8, photo: 'siguniang', alt: 'Puncak bersalju Siguniangshan menjulang di atas pegunungan.', photoNote: 'Foto pengganti memperlihatkan Siguniangshan; sudut Maobiliang tidak diklaim.' },
  rilong: { name: 'Rilong', chinese: '日隆镇', description: 'Kota kecil di kaki Siguniangshan dengan penginapan dan toko di sepanjang jalan utama.', page: 8 },
  shuangqiao: { name: 'Shuangqiao Valley', chinese: '双桥沟', description: 'Turun dari shuttle untuk mengikuti jalur kayu dan sungai di antara tebing serta hutan.', page: 9, photo: 'shuangqiao', alt: 'Puncak bersalju, bebatuan, dan pepohonan kuning di Lembah Shuangqiao.' },
  hongshan: { name: 'Hutan Hongshan', description: 'Bagian atas Shuangqiao menjadi patokan turun bus; lokasi air terjun pada jadwal belum terkonfirmasi.', page: 9 },
  jiaju: { name: 'Jiaju Tibetan Village', chinese: '甲居藏寨', description: 'Rumah-rumah Tibet bertingkat tersebar di lereng, mengikuti kontur bukit Danba.', page: 9, photo: 'jiaju', alt: 'Rumah-rumah khas Tibet di lereng Desa Jiaju.' },
  danba: { name: 'Danba', chinese: '丹巴', description: 'Pusat kota mengikuti sungai di dasar lembah dan menjadi basis menuju desa-desa Tibet di lereng.', page: 9 },
  zhonglu: { name: 'Zhonglu Tibetan Village', chinese: '中路藏寨', description: 'Desa pertanian di atas lembah Danba memperlihatkan rumah batu, ladang, dan menara pengawas.', page: 10, photo: 'zhonglu', alt: 'Rumah putih, menara batu, dan ladang setelah panen di Jikayi, kawasan Zhonglu.', photoNote: 'Foto memperlihatkan Jikayi di kawasan Zhonglu, diambil pada Oktober 2025.' },
  moshi: { name: 'Moshi Park', chinese: '墨石公园', description: 'Jalur taman membawa kamu mendekati punggung batu bergerigi dan hutan batu kelabu di Bamei.', page: 10, photo: 'moshi', alt: 'Formasi batu kelabu bergerigi di Moshi Park.' },
  tagong: { name: 'Padang rumput Tagong', chinese: '塔公草原', description: 'Padang rumput terbuka membingkai Gunung Yala di kejauhan, lebih lapang daripada lembah Danba.', page: 10, photo: 'tagong', alt: 'Padang rumput luas di Tagong, Sichuan.' },
  muya: { name: 'Biara Muya', chinese: '木雅大寺', description: 'Atap dan dinding biara Tibet memberi penanda skala di tengah dataran Tagong.', page: 11 },
  xinduqiao: { name: 'Xinduqiao', chinese: '新都桥镇', description: 'Lembah sungai, barisan pohon, dan desa mengitari basis dua malam untuk perjalanan sekitar Kangding.', page: 11, photo: 'xinduqiao', alt: 'Barisan pohon kuning di tepi aliran air dan lereng cokelat Xinduqiao.' },
  yuzixi: { name: 'Yuzixi', chinese: '鱼子西', description: 'Punggung bukit terbuka menjadi titik pandang jajaran Gunung Gongga saat cahaya pertama.', page: 13 },
  honghaizi: { name: 'Honghaizi', chinese: '红海子', description: 'Danau dataran tinggi di dekat jalur bandara Kangding memantulkan garis salju ketika angin reda.', page: 13 },
  'kangding-road': { name: 'Jalan Bandara Kangding', chinese: '康定机场路', description: 'Jalan S434 melintasi dataran terbuka dekat landasan bandara dalam perjalanan menuju Kangding.', page: 13 },
  kangding: { name: 'Kangding', description: 'Rumah dan pertokoan berjajar rapat di kedua sisi sungai, tempat singgah siang sebelum kembali ke pegunungan.', page: 13, photo: 'kangding', alt: 'Kota Kangding berada di lembah pegunungan.' },
  'kangding-mosque': { name: 'Masjid Kangding', chinese: '康定清真寺', description: 'Salat Jumat dijadwalkan di Kangding; konfirmasikan pin masjid dan waktu salat dengan sopir.', page: 14, photoNote: 'Foto pintu masjid pada PDF belum terverifikasi secara independen.' },
  zheduo: { name: 'Zheduo Pass', chinese: '折多山垭口', description: 'Stupa putih dan penanda batu berada di lintasan tinggi pada rute kembali ke Xinduqiao.', page: 14 },
  jiagenba: { name: 'Jiagenba (Gamba)', chinese: '甲根坝', description: 'Lembah dengan petak ladang dan rumah Tibet dikunjungi menjelang sore untuk melihat cahaya di pegunungan.', page: 14 },
  zimei: { name: 'Zimei Pass', chinese: '子梅垭口', description: 'Lintasan dapat ditambahkan hanya jika waktu dan kondisi jalan tanah yang rawan es memungkinkan.', page: 14 },
  gaoersi: { name: 'Gao’ersi Shan', chinese: '高尔寺山', description: 'Jalan pegunungan antara Xinduqiao dan Litang menjadi salah satu penanda etape G318.', page: 15 },
  tianlu: { name: 'Tianlu 18 Bends', description: 'Tikungan-tikungan tajam bertumpuk di satu lereng pada segmen G318 yang dijuluki “18 Tikungan”.', page: 15 },
  litang: { name: 'Litang', chinese: '理塘', description: 'Kota dataran tinggi dengan gang beratap khas Tibet menjadi tempat jalan santai setelah berkendara.', page: 15 },
  'litang-monastery': { name: 'Biara Litang', chinese: '长青春科尔寺', description: 'Kompleks biara beratap emas berdiri di lereng di atas kota, juga dikenal sebagai Ganden Thubchen Choekhorling.', page: 15, photo: 'litang', alt: 'Kompleks Biara Litang dengan atap emas di lereng perbukitan.' },
  haizi: { name: 'Haizi Shan', chinese: '海子山', description: 'Bongkah batu dan danau kecil memenuhi dataran bekas gletser yang dilalui menuju Daocheng.', page: 16, photo: 'haizi', alt: 'Bentang dataran tinggi dan danau di Haizi Shan.' },
  'sister-lakes': { name: 'Sister Lakes', chinese: '姊妹湖', description: 'Dua danau ini berada di G318 arah Batang, berbeda dari rute langsung ke Daocheng; cek detur dengan sopir.', page: 16, photo: 'sister-lakes', alt: 'Dua danau biru Sister Lakes di bawah pegunungan terbuka dengan padang berwarna keemasan.', photoNote: 'Foto Sister Lakes di jalur Batang, September 2014; bukan danau pada jalur langsung Daocheng.' },
  daocheng: { name: 'Daocheng', description: 'Stupa putih menjadi tengara kota yang dilewati sebelum turun ke Riwa untuk bermalam.', page: 16, photo: 'daocheng', alt: 'Stupa-stupa putih di kompleks White Pagoda, Daocheng.' },
  riwa: { name: 'Riwa (Shangri-La Town)', chinese: '香格里拉镇', description: 'Kota di Sichuan ini menjadi basis Yading; berbeda dari kota Shangri-La di Yunnan.', page: 16 },
  zhaguanbeng: { name: 'Zhaguanbeng', description: 'Titik turun bus wisata sebelum berjalan ke arah Kuil Chonggu dan percabangan jalur Yading.', page: 18 },
  chonggu: { name: 'Kuil Chonggu', description: 'Atap emas kuil terlihat di antara hutan dan tebing, menjadi patokan jalur Luorong serta Pearl Lake.', page: 18, photo: 'chonggu', alt: 'Atap emas Kuil Chonggu di kawasan Yading.' },
  luorong: { name: 'Padang Luorong', chinese: '洛绒牛场', description: 'Padang rumput dengan aliran air dan Gunung Yangmaiyong menjadi awal pendakian lebih jauh ke danau.', page: 18, photo: 'luorong', alt: 'Aliran air berkelok melintasi padang rumput keemasan Luorong di bawah puncak bersalju.' },
  'milk-lake': { name: 'Milk Lake', chinese: '牛奶海', description: 'Danau toska di cekungan batu terbuka ini menjadi salah satu tujuan trek panjang Yading.', page: 19, photo: 'milk-lake', alt: 'Milk Lake berwarna toska di cekungan batu dengan puncak bersalju Yading di belakangnya.' },
  'five-colour': { name: 'Five-Colour Lake', chinese: '五色海', description: 'Warna air danau di antara tebing tinggi berubah menurut cahaya dan sudut pandang.', page: 19, photo: 'five-colour', alt: 'Danau biru di bagian atas trek Yading, dikelilingi tebing terbuka.' },
  'pearl-lake': { name: 'Pearl Lake & Xiannairi', chinese: '珍珠海', description: 'Jalur pendek ke danau dapat dipilih jika jalur atas tidak dapat dikunjungi dan petugas membuka aksesnya.', page: 19, photo: 'pearl-lake', alt: 'Pearl Lake dengan Gunung Xiannairi di belakangnya.' },
  xiangcheng: { name: 'Xiangcheng', chinese: '乡城', description: 'Rumah-rumah Tibet bercat putih menandai permukiman lembah yang masih berada di Sichuan.', page: 20 },
  daxueshan: { name: 'Daxueshan Pass', chinese: '大雪山', description: 'Lereng terbuka dan bendera doa menandai koridor pegunungan menuju Shangri-La di Yunnan.', page: 20 },
  dukezong: { name: 'Dukezong Old Town', chinese: '独克宗', description: 'Jalan berbatu dan fasad kayu menjadi ciri kota tua Shangri-La, tempat menginap setelah menyeberang provinsi.', page: 20, photo: 'dukezong', alt: 'Jalan dan bangunan Tibet di kawasan kota tua Dukezong.' },
  guishan: { name: 'Bukit Guishan', chinese: '龟山', description: 'Roda doa emas raksasa di Dukezong diputar bersama oleh orang-orang yang berdiri mengelilinginya.', page: 20 },
  songzanlin: { name: 'Biara Songzanlin', chinese: '松赞林寺', description: 'Bangunan utama beratap emas berdiri bertingkat di bukit, tujuan pagi sebelum naik kereta ke Lijiang.', page: 21, photo: 'songzanlin', alt: 'Kompleks Biara Songzanlin dengan bangunan beratap emas bertingkat di bukit.' },
  'shangrila-station': { name: 'Stasiun Shangri-La', description: 'Fasad putih dan merah menandai stasiun di kota Shangri-La, Yunnan, untuk keberangkatan ke Lijiang.', page: 21, photo: 'shangrila-station', alt: 'Bangunan merah dan putih Stasiun Shangri-La di Yunnan.' },
  'lijiang-station': { name: 'Stasiun Lijiang', description: 'Stasiun beratap segitiga menjadi pintu masuk Lijiang; perjalanan ke kota tua dilanjutkan lewat darat.', page: 21, photo: 'lijiang-station', alt: 'Fasad dan atap segitiga Stasiun Lijiang.' },
  dayan: { name: 'Kota Tua Lijiang (Dayan)', chinese: '大研古城', description: 'Kanal kecil, jembatan, dan rumah beratap genting membentuk kota tua yang dijelajahi menjelang sore.', page: 22, photo: 'dayan', alt: 'Kanal dan rumah beratap genting di Kota Tua Lijiang.' },
  sifangjie: { name: 'Sifangjie', chinese: '四方街', description: 'Gang-gang kota tua bertemu di lapangan berbatu yang menjadi tujuan jalan malam di Lijiang.', page: 22 },
  'cable-car': { name: 'Big Cable Car', description: 'Gondola membawa pengunjung dari hutan di lereng bawah menuju tebing dan salju Glacier Park.', page: 24 },
  'jade-dragon': { name: 'Glacier Park, Jade Dragon', chinese: '玉龙雪山', description: 'Jalur kayu dan gardu pandang di stasiun atas menghadap punggung gunung bersalju.', page: 24, photo: 'jade-dragon', alt: 'Gunung bersalju dan kawasan gletser Jade Dragon.' },
  'blue-moon': { name: 'Blue Moon Valley', chinese: '蓝月谷', description: 'Rangkaian danau toska berada di kaki Jade Dragon, untuk berjalan di tepi air setelah turun dari gletser.', page: 24, photo: 'highlight-blue-moon', alt: 'Danau toska Blue Moon Valley di kaki Jade Dragon Snow Mountain.' },
  'dali-station': { name: 'Stasiun Dali (Xiaguan)', chinese: '大理站', description: 'Stasiun di Xiaguan dihubungkan dengan hotel dekat kota tua menggunakan taksi.', page: 23 },
  erhai: { name: 'Danau Erhai', chinese: '洱海', description: 'Jalan pagi di tepi barat danau dimulai dari Dermaga Caicun, sekitar 3–4 km dari gerbang timur kota tua.', page: 25, photo: 'highlight-erhai', alt: 'Pemandangan Danau Erhai dengan garis pegunungan di seberang.', photoNote: 'Foto memperlihatkan Danau Erhai, bukan verifikasi pin Dermaga Caicun.' },
  caicun: { name: 'Dermaga Caicun', chinese: '才村码头', description: 'Titik mulai menyusuri tepi barat Erhai sebelum kembali ke Kota Tua Dali.', page: 23 },
  'dali-old-town': { name: 'Kota Tua Dali', chinese: '大理古城', description: 'Dari Menara Wuhua terlihat deretan atap kota tua; telusuri gangnya lalu cari makan di Bo’ai Road.', page: 25, photo: 'dali-old-town', alt: 'Deretan atap dan jalan Kota Tua Dali dilihat dari Menara Wuhua.' },
  wuhua: { name: 'Menara Wuhua', chinese: '五华楼', description: 'Menara di kota tua menjadi patokan jalan siang sebelum makan halal dan salat Jumat.', page: 23 },
  'kunming-station': { name: 'Stasiun Kunming', description: 'Salah satu tujuan kereta dari Dali berada di pusat kota; sebagian tiket berakhir di Kunming South.', page: 26, photo: 'kunming-station', alt: 'Lapangan dan bangunan Stasiun Kunming.' },
  nancheng: { name: 'Masjid Nancheng', chinese: '南城清真寺', description: 'Gerbang masjid menjadi salah satu patokan di pusat Kunming, dekat kawasan makan malam terakhir.', page: 26, photo: 'nancheng', alt: 'Bangunan Masjid Nancheng di pusat Kunming.' },
  shuncheng: { name: 'Kawasan Shuncheng', chinese: '顺城', description: 'Kawasan Hui di sekitar Masjid Shuncheng menjadi tujuan makan, termasuk sarapan terakhir di Kunming.', page: 26, photo: 'shuncheng', alt: 'Masjid Shuncheng yang menandai kawasan Hui di Kunming.' },
  'green-lake': { name: 'Green Lake (Cuihu)', chinese: '翠湖', description: 'Danau kota dengan jalur jalan kaki di tepi air dapat dikunjungi jika jam penerbangan memungkinkan.', page: 27, photo: 'green-lake', alt: 'Taman dan perairan Green Lake atau Cuihu di Kunming.' },
  kmg: { name: 'Bandara Changshui (KMG)', chinese: '昆明长水国际机场', description: 'Terminal beratap keemasan menjadi titik keberangkatan pulang dari Kunming ke Jakarta.', page: 27, photo: 'kmg', alt: 'Terminal Bandara Internasional Kunming Changshui.' },
};
const s = (place: string, time: string, note?: string, status?: VisitStatus): Event => ({kind:'stop',place,time,note,status});
const t = (mode: Extract<Event,{kind:'transfer'}>['mode'], title: string, detail?: string, status?: VisitStatus): Event => ({kind:'transfer',mode,title,detail,status});
const rail = {label:'Cek jadwal di 12306',url:railUrl};
const halal: Practical = {title:'Cari makan halal',text:'Cari papan 清真 atau kedai 兰州拉面 di Amap. Konfirmasikan sebelum memesan; siapkan bekal untuk pegunungan.',copy:'清真'};
const snow: Practical = {title:'Kondisi jalan',text:'Lintasan tinggi rawan salju dan es. Konfirmasikan rute dengan sopir, kendaraan dengan rantai ban, serta rencana jika jalan ditutup.'};
export const days: Day[] = [
 {date:'2026-11-08',title:'Dari TFU ke Jiuzhaigou',shortTitle:'Tiba & menuju Jiuzhaigou',region:'Sichuan',route:['Chengdu Tianfu','Chengdu East','Huanglongjiuzhai','Jiuzhaigou'],overnight:{name:'Jiuzhaigou',area:'Goukou atau Pengfeng, dekat gerbang taman',elevation:'±2.000 m',detail:'Malam pertama dari dua malam. Konfirmasi check-in malam dan penjemputan.'},transport:'Taksi / DiDi, kereta, lalu jemputan',intro:'Hari perjalanan. Langsung dari bandara ke gerbang Jiuzhaigou lewat Chengdu East.',events:[s('tfu','12.20','12.20–14.00 untuk imigrasi, bagasi, dan makan singkat.','Terkonfirmasi'),t('car','TFU ke Chengdu East','14.00–15.45 dengan taksi resmi atau DiDi. Target tiba 45 menit sebelum kereta.'),s('chengdu-east','Sore','Target kereta mulai 16.30, dengan jeda sedikitnya 4 jam sejak mendarat.','Perlu konfirmasi'),t('train','Chengdu East ke Huanglongjiuzhai','Sekitar 1½–2½ jam. Jadwal dan kursi belum dikonfirmasi.','Perlu konfirmasi'),s('huanglongjiuzhai','Malam','Cocokkan jam jemput dengan kereta yang akhirnya dipesan.'),t('car','Stasiun ke Goukou / Pengfeng','Sekitar 2 jam. Jemputan malam atau shuttle hanya jika sambungannya terkonfirmasi.','Perlu konfirmasi'),s('jiuzhaigou-hotel','Malam')],practical:[{title:'Kereta sore',text:'Jam 16.30 adalah target pencarian, bukan tiket terkonfirmasi. Sisakan waktu untuk pemeriksaan paspor.',link:rail},{title:'Jika pesawat terlambat',text:'Coba kereta berikutnya bila jemputan masih tersedia. Jika sambungan habis, bermalam dekat Chengdu East dan naik kereta pertama 9 November; kunjungan taman menjadi lebih singkat.'},{title:'Bekal halal',text:'Bawa makanan kemasan halal untuk transit dan makan malam di hotel.'}],pages:[3,4,5,28,30]},
 {date:'2026-11-09',title:'Sehari di Jiuzhaigou',shortTitle:'Danau-danau Jiuzhaigou',region:'Sichuan',route:['Gerbang Jiuzhaigou','Lembah Rize','Lembah Shuzheng'],overnight:{name:'Jiuzhaigou',area:'Hotel yang sama di Goukou / Pengfeng',elevation:'±2.000 m',detail:'Malam kedua dekat gerbang taman. Sopir menjemput dari hotel besok pagi.'},transport:'Bus taman dan jalan kaki',intro:'Seharian menyusuri danau biru-hijau di lembah Rize dan Shuzheng.',events:[t('bus','Masuk taman dan naik bus','Target masuk 08.00; arah bus mengikuti pembukaan jalur hari itu.'),s('five-flower','Pagi'),t('bus','Lembah Rize ke Shuzheng','Urutan pemberhentian menyesuaikan bus taman dan cuaca.'),s('shuzheng','Siang–sore'),t('bus','Kembali ke gerbang dan hotel','Target keluar 16.30–17.00.')],practical:[{title:'Tiket dan paspor',text:'Menurut PDF: tiket dewasa CNY 190 + bus CNY 90 = CNY 280. Bawa paspor asli dan reservasi sesuai nama.',link:{label:'Reservasi resmi taman',url:'https://www.jiuzhai.com/intelligent-service/tickets'}},{title:'Jam masuk',text:'Pengumuman yang dirujuk PDF: masuk 08.00–14.00, tutup 18.00. Cek kembali akses dan cuaca menjelang kunjungan.',link:{label:'Pengumuman pengelola',url:'https://www.jiuzhai.com/news/notice/11492-2026-10-31-09-08-46'}},{title:'Bekal seharian',text:'Bawa bekal halal dan air untuk kunjungan taman.'}],pages:[3,4,6,28]},
 {date:'2026-11-10',title:'Menuju Siguniangshan',shortTitle:'Perjalanan ke Rilong',region:'Sichuan',route:['Jiuzhaigou','Siguniangshan','Rilong'],overnight:{name:'Rilong',area:'Kaki Siguniangshan',elevation:'3.200 m',detail:'Satu malam sebelum menjelajahi Shuangqiao Valley besok pagi.'},transport:'Mobil dengan sopir, 7–9 jam / ±456 km',intro:'Etape darat panjang menuju kaki gunung; sisakan waktu makan dan istirahat.',events:[t('car','Hotel Jiuzhaigou ke Siguniangshan','Berangkat pagi. Alokasikan 7–9 jam termasuk makan dan istirahat; sepakati jalur dengan sopir.'),s('maobiliang','Sore','Singgah hanya jika cuaca cerah dan waktunya cukup.','Opsional'),t('car','Lanjut ke penginapan di Rilong'),s('rilong','Sore–malam')],practical:[{title:'Mulai sewa mobil',text:'Rute privat 10–17 November dimulai dari hotel Jiuzhaigou dan berakhir di Dukezong, Yunnan. Konfirmasikan biaya satu arah dan lintas provinsi.'},halal,snow],pages:[3,7,8,28,30]},
 {date:'2026-11-11',title:'Shuangqiao & rumah Tibet Danba',shortTitle:'Shuangqiao & Jiaju',region:'Sichuan',route:['Rilong','Shuangqiao','Jiaju','Danba'],overnight:{name:'Danba',area:'Kota di dasar lembah',elevation:'2.000 m',detail:'Turun dari Rilong untuk bermalam; lanjut ke Zhonglu besok pagi.'},transport:'Shuttle taman, lalu mobil ±3 jam',intro:'Pagi di lembah pegunungan, sore di antara rumah-rumah Tibet di lereng.',events:[t('bus','Shuttle menuju ujung Shuangqiao','Turun bertahap di pemberhentian yang dibuka.'),s('hongshan','Pagi','Foto pada PDF menunjukkan hutan; lokasi “Hongshan Waterfall” belum terkonfirmasi.','Perlu konfirmasi'),s('shuangqiao','Pagi'),t('car','Shuangqiao ke Danba','Sekitar 3 jam; lanjut singgah di Jiaju.'),s('jiaju','Sore'),s('danba','Malam')],practical:[{title:'Di lembah',text:'Gunakan shuttle dan jalur kayu sesuai pengaturan taman. Warna gugur pada pertengahan November belum tentu sama dengan foto.'},halal],pages:[3,7,9,28]},
 {date:'2026-11-12',title:'Dari Danba ke padang Tagong',shortTitle:'Zhonglu, Moshi & Tagong',region:'Sichuan',route:['Danba','Zhonglu','Moshi Park','Tagong','Xinduqiao'],overnight:{name:'Xinduqiao',area:'Basis untuk perjalanan sekitar Kangding',elevation:'3.300 m',detail:'Malam pertama dari dua malam. Siapkan keberangkatan sangat pagi besok.'},transport:'Mobil ±5 jam / ±180 km',intro:'Rumah batu, hutan batu kelabu, lalu padang rumput yang menghadap Yala.',events:[s('zhonglu','Pagi'),t('car','Danba ke Bamei','Perjalanan dilanjutkan ke Moshi Park.'),s('moshi','Siang','Taman berada sekitar 3.500 m.'),t('car','Moshi Park ke Tagong'),s('tagong','Sore','Lihat Gunung Yala dari padang; PDF menyebut kawasan Yala sendiri tutup musim dingin.'),s('muya','Sore'),t('car','Lanjut ke Xinduqiao'),s('xinduqiao','Malam')],practical:[{title:'Bekal siang',text:'Pilihan halal di Tagong dan Xinduqiao terbatas. Siapkan bekal dan cari 兰州拉面 di jalan utama.',copy:'兰州拉面'},{title:'Ketinggian',text:'Naik lagi dari Danba sekitar 2.000 m ke basis Xinduqiao sekitar 3.300 m. Sisakan waktu istirahat.'},snow],pages:[3,7,10,11,28,30]},
 {date:'2026-11-13',title:'Kangding & cahaya pegunungan',shortTitle:'Kangding & salat Jumat',region:'Sichuan',route:['Xinduqiao','Yuzixi','Kangding','Jiagenba','Xinduqiao'],overnight:{name:'Xinduqiao',area:'Kembali ke hotel yang sama',elevation:'3.300 m',detail:'Malam kedua di Xinduqiao sebelum melanjutkan G318 ke Litang.'},transport:'Mobil, loop ±250 km',intro:'Prioritas hari ini: tiba di Kangding sebelum 12.30 untuk salat Jumat.',events:[s('yuzixi','06.30','Target dalam PDF untuk cahaya pertama; konfirmasikan jam berangkat dan kondisi akses dengan sopir.'),t('car','Melalui S434 menuju Kangding'),s('honghaizi','Pagi'),s('kangding-road','Pagi'),s('kangding','Sebelum 12.30'),s('kangding-mosque','Siang','Salat Jumat dan makan di kluster Hui sekitar masjid. Pin serta jam salat perlu dicek.','Perlu konfirmasi'),t('car','Kembali lewat Zheduo Pass'),s('zheduo','Siang–sore','Lintasan sekitar 4.298 m, rawan es.'),s('jiagenba','Sore'),s('zimei','Jika sempat','Jalan tanah dan lintasan tinggi; jangan mengorbankan waktu salat atau keselamatan jalan.','Opsional'),t('car','Kembali ke Xinduqiao')],practical:[{title:'Salat Jumat',text:'Sepakati Kangding sebelum 12.30 sebagai titik wajib. Konfirmasikan masjid dan jam setempat; foto masjid pada PDF belum terverifikasi.',copy:'康定清真寺'},{title:'Makan halal',text:'Cari kluster Hui di sekitar masjid untuk makan siang dan mengisi bekal.'},snow],pages:[3,12,13,14,28,30]},
 {date:'2026-11-14',title:'Menelusuri G318 ke Litang',shortTitle:'G318 & Biara Litang',region:'Sichuan',route:['Xinduqiao','Gao’ersi Shan','Tianlu 18 Bends','Litang'],overnight:{name:'Litang',area:'Kota dataran tinggi',elevation:'4.014 m',detail:'Malam menginap tertinggi dalam perjalanan. Pilih aktivitas sore yang ringan.'},transport:'Mobil ±4 jam / ±150 km',intro:'Jalan pegunungan berkelok dan padang tinggi, ditutup kunjungan ringan ke biara.',events:[t('car','Xinduqiao ke Litang melalui G318','Sekitar 4 jam, mengikuti kondisi jalan.'),s('gaoersi','Pagi','Lintasan pada jadwal sekitar 4.412 m.'),s('tianlu','Siang'),s('litang','Sore','Jalan santai; tidak ada trek hari ini.'),s('litang-monastery','Sore')],practical:[{title:'Malam dingin',text:'Perkiraan dalam PDF untuk Litang: siang 1–8 °C, malam −15 hingga −8 °C. Ini perkiraan musiman, bukan prakiraan langsung.'},halal,snow],pages:[3,12,15,28,30]},
 {date:'2026-11-15',title:'Dari Litang ke gerbang Yading',shortTitle:'Haizi Shan & Riwa',region:'Sichuan',route:['Litang','Haizi Shan','Daocheng','Riwa'],overnight:{name:'Riwa',area:'Shangri-La Town, Sichuan',elevation:'2.900 m',detail:'Malam pertama dari dua malam. Konfirmasikan kamar berpemanas untuk 15 dan 16 November.'},transport:'Mobil ±5 jam / ±220 km',intro:'Melintasi dataran bekas gletser, lalu turun ke basis kunjungan Yading.',events:[t('car','Litang ke Haizi Shan'),s('haizi','Pagi','Dataran sekitar 4.500 m.'),s('sister-lakes','Jika mengambil detur','Letaknya di G318 arah Batang. Bukan pemberhentian pada jalur langsung ke Daocheng.','Perlu konfirmasi'),t('car','Lanjut ke Daocheng'),s('daocheng','Siang','Isi ulang bekal halal untuk dua malam dan hari trek.'),t('car','Daocheng ke Riwa'),s('riwa','Sore–malam')],practical:[{title:'Riwa bukan kota Shangri-La',text:'Riwa / Shangri-La Town (香格里拉镇) berada di Sichuan. Kota Shangri-La di Yunnan baru dituju pada 17 November.',copy:'香格里拉镇'},{title:'Sister Lakes',text:'Konfirmasikan tambahan jarak dan waktu detur ke arah Batang dengan sopir. Utamakan rute Haizi Shan–Daocheng–Riwa.'},{title:'Bekal dan penginapan',text:'Beli bekal halal sebelum Riwa; pastikan kamar memiliki pemanas.'},snow],pages:[3,12,16,28,30]},
 {date:'2026-11-16',title:'Menjelajahi lembah Yading',shortTitle:'Yading & jalur danau',region:'Sichuan',route:['Riwa','Chonggu','Luorong','Yading','Riwa'],overnight:{name:'Riwa',area:'Hotel yang sama di Shangri-La Town, Sichuan',elevation:'2.900 m',detail:'Malam kedua. Istirahat sebelum perjalanan panjang ke Yunnan.'},transport:'Bus taman, jalan kaki, trek bersyarat',intro:'Rute danau atas bergantung pada pembukaan jalur dan kondisi tubuh.',events:[t('bus','Riwa ke titik turun bus taman'),s('zhaguanbeng','Pagi'),t('walk','Berjalan menuju Chonggu'),s('chonggu','Pagi'),s('luorong','Pagi–siang'),t('walk','Trek danau atas','Sekitar 5–6 jam pulang-pergi dari Luorong, hanya jika dibuka.','Jika jalur dibuka'),s('milk-lake','Siang','Sekitar 4.600 m; bukan akses yang sudah dikonfirmasi.','Jika jalur dibuka'),s('five-colour','Siang','Sekitar 4.700 m; ikuti keputusan petugas taman.','Jika jalur dibuka'),s('pearl-lake','Pilihan jalur pendek','Pilih Chonggu dan Pearl Lake jika jalur pendek dibuka dan jalur atas tidak sesuai kondisi hari itu.','Alternatif'),t('bus','Kembali ke hotel di Riwa')],practical:[{title:'Akses taman',text:'Pesan tiket 16 November dan cek jalur yang dibuka. Jangan menganggap Milk Lake atau Five-Colour Lake pasti dapat dicapai.'},{title:'Bekal trek',text:'Bawa makanan halal dan air untuk seharian.'},{title:'Dingin dan ketinggian',text:'PDF memperkirakan suhu trek −3 hingga 5 °C; di sekitar 4.700 m dapat lebih dingin. Pilih jalur pendek bila tubuh perlu istirahat.'}],pages:[3,17,18,19,28,30]},
 {date:'2026-11-17',title:'Menyeberang ke Shangri-La',shortTitle:'Riwa ke Yunnan',region:'Sichuan ke Yunnan',route:['Riwa','Xiangcheng','Daxueshan','Dukezong'],overnight:{name:'Shangri-La',area:'Dukezong, Yunnan',elevation:'3.300 m',detail:'Satu malam di kota Shangri-La, Yunnan; bukan Riwa di Sichuan.'},transport:'Mobil sekitar 8 jam, di luar berhenti',intro:'Etape terakhir bersama sopir menyeberangi provinsi menuju Dukezong.',events:[t('car','Berangkat dari Riwa','Target 07.00. Alokasikan sekitar 8 jam, belum termasuk makan dan perubahan kondisi jalan.'),s('xiangcheng','Pagi–siang'),s('daxueshan','Siang','Akses lintasan mengikuti salju dan kondisi jalan.','Perlu konfirmasi'),t('car','Lanjut ke Shangri-La, Yunnan'),s('dukezong','Sore–malam','Check-in sebelum berjalan santai.'),s('guishan','Jika masih terang','Kunjungi roda doa bila tiba cukup awal.','Opsional')],practical:[{title:'Jika jalan tertutup',text:'Sepakati tempat bermalam dengan sopir. Esoknya prioritaskan sambungan ke Lijiang; Songzanlin hanya jika waktu cukup.'},{title:'Sopir satu arah',text:'Konfirmasikan izin lintas provinsi dan drop-off di Dukezong. Bila perlu dua sopir, rencanakan pergantian di Riwa.'},{title:'Bekal perjalanan',text:'Bawa bekal halal dari Riwa dan periksa tanda 清真 sebelum makan di Dukezong.'},snow],pages:[3,17,20,28,30]},
 {date:'2026-11-18',title:'Songzanlin ke kanal Lijiang',shortTitle:'Songzanlin & Dayan',region:'Yunnan',route:['Shangri-La','Songzanlin','Lijiang','Dayan'],overnight:{name:'Lijiang',area:'Sekitar Kota Tua Dayan',elevation:'2.400 m',detail:'Sepakati penjemputan Jade Dragon besok pagi serta pengambilan bagasi sebelum ke stasiun.'},transport:'Mobil lokal dan kereta siang / sore',intro:'Aula biara beratap emas, lalu kereta menuju gang dan kanal Kota Tua Lijiang.',events:[s('songzanlin','Pagi','Jika perjalanan kemarin tertunda, utamakan sambungan ke Lijiang.'),t('car','Ambil bagasi dan menuju stasiun'),s('shangrila-station','Siang / sore'),t('train','Shangri-La ke Lijiang','Pilih jadwal setelah kunjungan dan makan; jam serta kursi perlu dicek.','Perlu konfirmasi'),s('lijiang-station','Sore'),t('car','Stasiun ke hotel sekitar Dayan'),s('dayan','Sore'),s('sifangjie','Malam')],practical:[{title:'Tiket kereta',text:'Periksa nama stasiun, jam, dan kursi sebelum menentukan waktu kunjungan Songzanlin.',link:rail},{title:'Makan halal',text:'Cari kedai Hui di sekitar kota tua. Foto khusus Old Town Beef / Ha’s Beef belum terverifikasi dalam PDF.'},{title:'Siapkan besok',text:'Atur penjemputan pagi ke Jade Dragon dan cara mengambil koper sebelum kereta ke Dali.'}],pages:[3,17,21,22,28,30]},
 {date:'2026-11-19',title:'Jade Dragon & Blue Moon Valley',shortTitle:'Jade Dragon, lalu Dali',region:'Yunnan',route:['Lijiang','Jade Dragon','Blue Moon Valley','Dali'],overnight:{name:'Dali',area:'Dekat gerbang Kota Tua Dali',elevation:'±2.000 m',detail:'Beri tahu hotel jika tiba malam. Lokasi dekat kota tua memudahkan pagi di Erhai.'},transport:'Mobil, cable car, lalu kereta 2–2½ jam',intro:'Dari pegunungan bersalju ke danau toska, lalu berangkat ke Dali malam ini.',events:[s('cable-car','Pagi','Pesan slot pagi; operasional mengikuti kondisi setempat.','Perlu konfirmasi'),t('cable','Naik ke Glacier Park'),s('jade-dragon','Pagi','Area stasiun atas sekitar 4.506 m.'),t('bus','Turun menuju Blue Moon Valley'),s('blue-moon','Siang','Jika cable car tertunda, prioritaskan lembah dan waktu menuju stasiun.'),t('car','Ambil bagasi dan ke Stasiun Lijiang'),t('train','Lijiang ke Dali','Kereta langsung sore / malam sekitar 2–2½ jam. Harus tiba di Dali pada 19 November.','Perlu konfirmasi'),s('dali-station','Malam'),t('car','Taksi ke hotel dekat Kota Tua Dali')],practical:[{title:'Cable car dan cuaca',text:'Cari slot pagi untuk 19 November. Jika tertunda, prioritaskan Blue Moon Valley agar sambungan kereta tetap terkejar.'},{title:'Kereta ke Dali',text:'Pastikan tanggal tiba tetap 19 November dan sisakan waktu untuk mengambil bagasi.',link:rail},{title:'Bekal halal',text:'Bawa bekal untuk Jade Dragon; di Dali cari kedai halal sekitar Bo’ai Road.'}],pages:[3,23,24,28,30]},
 {date:'2026-11-20',title:'Danau Erhai & Kota Tua Dali',shortTitle:'Erhai, Dali & Kunming',region:'Yunnan',route:['Caicun','Danau Erhai','Kota Tua Dali','Kunming'],overnight:{name:'Kunming',area:'Kawasan Shuncheng',elevation:'1.900 m',detail:'Malam terakhir dekat kawasan makan halal, sebelum penerbangan besok.'},transport:'Taksi lokal, jalan kaki, kereta 2–3 jam',intro:'Pagi di tepi danau, siang di kota tua, sore berangkat ke Kunming.',events:[t('car','Hotel ke Dermaga Caicun','Sekitar 3–4 km dari gerbang timur kota tua.'),s('erhai','Pagi','Mulai dari Dermaga Caicun di tepi barat Erhai.'),s('caicun','Pagi'),t('car','Kembali ke Kota Tua Dali'),s('dali-old-town','Siang','Makan halal di Bo’ai Road; sisihkan waktu untuk salat Jumat.'),s('wuhua','Siang'),t('car','Ambil koper, lalu ke Stasiun Dali','Sisihkan sekitar 90 menit dari hotel sampai keberangkatan kereta.'),t('train','Dali ke Kunming','Pilih kereta sore, sekitar 2–3 jam. Cek apakah tiba di Kunming atau Kunming South.','Perlu konfirmasi'),s('kunming-station','Sore / malam','Foto memperlihatkan Stasiun Kunming di pusat kota; cocokkan tujuan pada tiket.'),t('car','Lanjut ke penginapan di Shuncheng'),s('shuncheng','Malam'),s('nancheng','Malam','Patokan kawasan makan halal, bukan lokasi salat Jumat hari ini.')],practical:[{title:'Salat Jumat di Dali',text:'Minta hotel mengonfirmasi masjid dan waktu setempat sejak malam sebelumnya. Sisihkan waktu siang sebelum ke stasiun.'},{title:'Nama tempat untuk Amap',text:'Dermaga Caicun adalah titik mulai perjalanan pagi di tepi barat Erhai.',copy:'才村码头'},{title:'Stasiun kedatangan',text:'Kunming dan Kunming South berbeda. Cocokkan tiket sebelum mengatur jemputan ke Shuncheng.',link:rail},{title:'Makan halal',text:'Bo’ai Road di Dali untuk siang; kawasan Shuncheng dan Masjid Nancheng di Kunming untuk malam.'}],pages:[3,23,25,26,28,29,30]},
 {date:'2026-11-21',title:'Pagi terakhir, pulang ke Jakarta',shortTitle:'Kunming & penerbangan pulang',region:'Yunnan',route:['Kunming','Changshui (KMG)','Jakarta'],overnight:null,transport:'Transfer bandara dan penerbangan',intro:'Jadwal pagi mengikuti tiket pulang; tidak ada sambungan kereta antarkota hari ini.',events:[s('shuncheng','Pagi','Sarapan jika jadwal penerbangan memungkinkan.','Opsional'),s('green-lake','Pagi','Hanya jika penerbangan sore / malam. Untuk penerbangan pagi, langsung ke bandara.','Opsional'),t('car','Hotel ke Bandara Changshui','Atur transfer sesuai jam tiket dan ketentuan check-in maskapai.','Perlu konfirmasi'),s('kmg','Sesuai tiket','Jam berangkat dan sambungan penerbangan belum dikonfirmasi dalam PDF.','Perlu konfirmasi'),t('plane','KMG ke Jakarta','Jadwal dan kemungkinan transit mengikuti tiket yang dipesan.','Perlu konfirmasi')],practical:[{title:'Jam pulang belum tercantum',text:'PDF menetapkan kepulangan 21 November, tanpa jam keberangkatan terkonfirmasi. Periksa tiket sebelum merencanakan Green Lake.'},{title:'Penerbangan',text:'PDF menyebut penerbangan langsung belum tentu tersedia tanggal ini; alternatif transit perlu diperiksa saat memesan.'},{title:'Sarapan halal',text:'Kawasan Shuncheng dapat menjadi tempat sarapan terakhir jika jadwal memungkinkan.'}],pages:[3,23,27,28,30]},
];
export const daysByDate = new Map(days.map((day) => [day.date, day]));
// Highlights point to real stops in the PDF route; each image may show the wider destination.
export interface Highlight { place: string; date: string; region: 'Sichuan' | 'Yunnan'; title: string; caption: string; photo?: string; alt?: string }
export const highlights: Highlight[] = [
 {place:'five-flower',date:'2026-11-09',region:'Sichuan',title:'Jiuzhaigou',caption:'Danau jernih, hutan penuh warna.',photo:"highlight-jiuzhaigou",alt:"Danau di Jiuzhaigou memantulkan hutan musim gugur dan pegunungan."},
 {place:'songzanlin',date:'2026-11-18',region:'Yunnan',title:'Shangri-La',caption:'Atap emas Biara Songzanlin di atas bukit.'},
 {place:'maobiliang',date:'2026-11-10',region:'Sichuan',title:'Siguniangshan',caption:'Empat puncak, satu panorama.',photo:"highlight-siguniang",alt:"Jajaran pegunungan Siguniangshan, dipotret pada 14 Oktober 2026."},
 {place:'dayan',date:'2026-11-18',region:'Yunnan',title:'Kota Tua Lijiang',caption:'Jalan sore menyusuri kanal dan gang Dayan.'},
 {place:'tagong',date:'2026-11-12',region:'Sichuan',title:'Tagong',caption:'Padang terbuka di kaki Gunung Yala.'},
 {place:'blue-moon',date:'2026-11-19',region:'Yunnan',title:'Blue Moon Valley',caption:'Berhenti sejenak di tepi air toska.',photo:"highlight-blue-moon",alt:"Danau toska Blue Moon Valley di bawah pegunungan Jade Dragon."},
 {place:'luorong',date:'2026-11-16',region:'Sichuan',title:'Yading',caption:'Menyusuri padang di antara puncak salju.'},
 {place:'erhai',date:'2026-11-20',region:'Yunnan',title:'Danau Erhai',caption:'Pagi yang pelan di tepi danau.',photo:"highlight-erhai",alt:"Danau Erhai dan siluet pegunungan di seberangnya."},
];
export const bookingOptions = [
 {title:'Mobil privat satu arah',description:'Sesuai rute utama: 10–17 November, hotel Jiuzhaigou ke Dukezong. Minta harga total delapan hari, lintas provinsi, biaya satu arah, dan biaya sopir secara tertulis.',url:'https://www.klook.com/en-US/activity/127159-chengdu-jiuzhaigou-daocheng-yading-zuoergai-grassland-western-sichuan-multi-day-chartered-tour/'},
 {title:'Paket grup enam hari',description:'Alternatif dengan jadwal berbeda, kembali ke Chengdu. Keberangkatan 9 November berbenturan dengan hari Jiuzhaigou; bukan bagian rute utama.',url:'https://www.klook.com/en-US/activity/114438-new-sichuan-west-ring-road-mount-siguniang-sunset-at-yuzixi-daocheng/'},
 {title:'Paket dari sisi Yunnan',description:'Alternatif arah terbalik menuju Yading. Hanya relevan jika urutan perjalanan diubah; cek rute dan harga solo.',url:'https://www.klook.com/en-US/activity/153488-yunnan-yhangri-la-grand-loop-6-days-5-nights-tour/'},
];

// PHOTO_DATA_START
export const photos: Record<string, Photo> = {
  "highlight-jiuzhaigou": {
  "id": "highlight-jiuzhaigou",
  "width": 1600,
  "height": 2400,
  "sizes": [
    480,
    960,
    1440
  ],
  "author": "Kent Chin",
  "source": "https://www.pexels.com/photo/scenic-autumn-reflection-in-jiuzhaigou-valley-37302353/",
  "license": "Pexels License",
  "licenseUrl": "https://www.pexels.com/license/",
  "origin": "Pexels",
  "photoNote": "Foto kawasan Jiuzhaigou; sumber tidak menamai danau tertentu. Diambil 6 November 2025, diterbitkan 28 April 2026."
},
  "highlight-siguniang": {
  "id": "highlight-siguniang",
  "width": 1600,
  "height": 2133,
  "sizes": [
    480,
    960,
    1440
  ],
  "author": "Oli Liao",
  "source": "https://www.pexels.com/photo/majestic-view-of-siguniang-mountain-range-40267914/",
  "license": "Pexels License",
  "licenseUrl": "https://www.pexels.com/license/",
  "origin": "Pexels",
  "photoNote": "Panorama Siguniangshan menurut sumber. Diambil dan diterbitkan 14 Oktober 2026. Sudut foto bukan verifikasi titik Maobiliang atau lembah Shuangqiao."
},
  "highlight-blue-moon": {
  "id": "highlight-blue-moon",
  "width": 1600,
  "height": 2400,
  "sizes": [
    480,
    960,
    1440
  ],
  "author": "Richard L",
  "source": "https://www.pexels.com/photo/stunning-view-of-jade-dragon-snow-mountain-and-blue-moon-valley-38718349/",
  "license": "Pexels License",
  "licenseUrl": "https://www.pexels.com/license/",
  "origin": "Pexels",
  "photoNote": "Diterbitkan 25 Juli 2026. Tanggal pengambilan tidak dicantumkan oleh sumber."
},
  "highlight-erhai": {
  "id": "highlight-erhai",
  "width": 3264,
  "height": 2448,
  "sizes": [
    480,
    960,
    1440
  ],
  "author": "ShuQizhe",
  "source": "https://commons.wikimedia.org/wiki/File:Erhai_20260220-1.jpg",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "origin": "Wikimedia Commons",
  "photoNote": "Diambil 20 Februari 2026. Foto Danau Erhai, bukan verifikasi titik Dermaga Caicun. Diunduh ulang dari berkas resolusi penuh untuk highlight."
},
  "tfu": {
    "id": "tfu",
    "width": 740,
    "height": 555,
    "sizes": [
      480,
      740
    ],
    "author": "TFUTFUTFU333",
    "source": "https://commons.wikimedia.org/wiki/File:Terminal_1,_Tianfu_Int%27l_Airport.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "origin": "PDF"
  },
  "chengdu-east": {
    "id": "chengdu-east",
    "width": 740,
    "height": 553,
    "sizes": [
      480,
      740
    ],
    "author": "Fxqf",
    "source": "https://commons.wikimedia.org/wiki/File:Chengdu_East_Railway_Station.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "origin": "PDF"
  },
  "huanglongjiuzhai": {
    "id": "huanglongjiuzhai",
    "width": 740,
    "height": 416,
    "sizes": [
      480,
      740
    ],
    "author": "Underbar dk",
    "source": "https://commons.wikimedia.org/wiki/File:Huanglongjiuzhai_Railway_Station,_December_2024,_02.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "origin": "PDF"
  },
  "daocheng": {
    "id": "daocheng",
    "width": 740,
    "height": 555,
    "sizes": [
      480,
      740
    ],
    "author": "rheins",
    "source": "https://commons.wikimedia.org/wiki/File:%E7%A8%BB%E5%9F%8E%E7%99%BD%E5%A1%94_-_White_Pagoda_in_Daocheng_County_-_2012.10_-_panoramio.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "origin": "PDF"
  },
  "shangrila-station": {
    "id": "shangrila-station",
    "width": 740,
    "height": 493,
    "sizes": [
      480,
      740
    ],
    "author": "N509FZ",
    "source": "https://commons.wikimedia.org/wiki/File:Shangri-la_Railway_Station_(20230929174655).jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "origin": "PDF"
  },
  "lijiang-station": {
    "id": "lijiang-station",
    "width": 740,
    "height": 493,
    "sizes": [
      480,
      740
    ],
    "author": "CEphoto, Uwe Aranas",
    "source": "https://commons.wikimedia.org/wiki/File:Lijiang_Yunnan_China_Railway-Station-01.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "origin": "PDF"
  },
  "erhai": {
    "id": "erhai",
    "width": 740,
    "height": 555,
    "sizes": [
      480,
      740
    ],
    "author": "ShuQizhe",
    "source": "https://commons.wikimedia.org/wiki/File:Erhai_20260220-1.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "origin": "PDF"
  },
  "dali-old-town": {
    "id": "dali-old-town",
    "width": 740,
    "height": 555,
    "sizes": [
      480,
      740
    ],
    "author": "ShuQizhe",
    "source": "https://commons.wikimedia.org/wiki/File:Dali_Ancient_Town_20260220-2.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "origin": "PDF"
  },
  "kunming-station": {
    "id": "kunming-station",
    "width": 740,
    "height": 592,
    "sizes": [
      480,
      740
    ],
    "author": "CEphoto, Uwe Aranas",
    "source": "https://commons.wikimedia.org/wiki/File:Kunming_Yunnan_Square-in-front-of_the-railway-station-01.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "origin": "PDF"
  },
  "siguniang": {
    "id": "siguniang",
    "width": 1280,
    "height": 960,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "Ben Kaethner",
    "source": "https://commons.wikimedia.org/wiki/File:Mount_Siguniang.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "origin": "Wikimedia Commons"
  },
  "shuangqiao": {
    "id": "shuangqiao",
    "width": 980,
    "height": 664,
    "sizes": [
      480,
      960,
      980
    ],
    "author": "landagent",
    "source": "https://commons.wikimedia.org/wiki/File:%E5%9B%9B%E5%A7%91%E5%A8%98%E5%B1%B1%E5%8F%8C%E6%A1%A5%E6%B2%9F_-_panoramio.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "origin": "Wikimedia Commons"
  },
  "jiaju": {
    "id": "jiaju",
    "width": 1280,
    "height": 960,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "Nyx Ning",
    "source": "https://commons.wikimedia.org/wiki/File:%E5%9B%9B%E5%B7%9D_%E4%B8%B9%E5%B7%B4-%E7%94%B2%E5%B1%85%E6%98%A5%E8%89%B2_-_panoramio.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "origin": "Wikimedia Commons"
  },
  "tagong": {
    "id": "tagong",
    "width": 1280,
    "height": 853,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "Valerian Guillot from Cambridge, United Kingdom",
    "source": "https://commons.wikimedia.org/wiki/File:Grasslands_in_Tagong_county,_Sichuan,_China_(41077322430).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "origin": "Wikimedia Commons",
    "photoNote": "Foto lokasi sebenarnya; arsip Juni 2018, bukan kondisi Oktober 2026."
  },
  "xinduqiao": {
    "id": "xinduqiao",
    "width": 4032,
    "height": 3024,
    "sizes": [
      480,
      960,
      1600
    ],
    "author": "rheins",
    "source": "https://commons.wikimedia.org/wiki/File:%E6%96%B0%E9%83%BD%E6%A1%A5%E7%BE%8E%E6%99%AF_-_Scenary_of_Xinduqiao_Town_-_2012.10_-_panoramio.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "origin": "Wikimedia Commons"
  },
  "kangding": {
    "id": "kangding",
    "width": 1280,
    "height": 1707,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "来斤小仓鼠吧",
    "source": "https://commons.wikimedia.org/wiki/File:The_city_of_Kangding_.jpeg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "origin": "Wikimedia Commons"
  },
  "litang": {
    "id": "litang",
    "width": 1280,
    "height": 960,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "Izeberg007",
    "source": "https://commons.wikimedia.org/wiki/File:Litang_Monastry_09-2025.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "origin": "Wikimedia Commons"
  },
  "chonggu": {
    "id": "chonggu",
    "width": 1280,
    "height": 1280,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "marroyo12",
    "source": "https://commons.wikimedia.org/wiki/File:Chonggu_Temple_(48074094833).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "origin": "Wikimedia Commons"
  },
  "luorong": {
    "id": "luorong",
    "width": 4032,
    "height": 3024,
    "sizes": [
      480,
      960,
      1600
    ],
    "author": "rheins",
    "source": "https://commons.wikimedia.org/wiki/File:%E6%B4%9B%E7%BB%92%E7%89%9B%E5%9C%BA_-_Luorong_Pasture_-_2012.10_-_panoramio_(1).jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "origin": "Wikimedia Commons",
    "photoNote": "Foto lokasi sebenarnya pada Oktober 2012. Tidak membuktikan kondisi atau akses saat perjalanan."
  },
  "milk-lake": {
    "id": "milk-lake",
    "width": 1920,
    "height": 1440,
    "sizes": [
      480,
      960,
      1600
    ],
    "author": "rheins",
    "source": "https://commons.wikimedia.org/wiki/File:%E9%9B%AA%E5%B1%B1%E7%9A%84%E7%9C%BC%E6%B3%AA_-_Tears_of_the_Snow_Mountains_-_2012.10_-_panoramio.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "origin": "Wikimedia Commons"
  },
  "dukezong": {
    "id": "dukezong",
    "width": 1280,
    "height": 1706,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "蒋亦炯",
    "source": "https://commons.wikimedia.org/wiki/File:%E4%BA%91%E5%8D%97%E9%A6%99%E6%A0%BC%E9%87%8C%E6%8B%89%E7%8B%AC%E5%85%8B%E5%AE%97%E5%8F%A4%E5%9F%8E2.JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "origin": "Wikimedia Commons"
  },
  "songzanlin": {
    "id": "songzanlin",
    "width": 1280,
    "height": 960,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "Mulligan Stu",
    "source": "https://commons.wikimedia.org/wiki/File:Songzanlin_monastery.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "origin": "Wikimedia Commons"
  },
  "dayan": {
    "id": "dayan",
    "width": 1280,
    "height": 960,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "BrokenSphere",
    "source": "https://commons.wikimedia.org/wiki/File:East_Street_canal,_Old_Town_of_Lijiang.JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "origin": "Wikimedia Commons"
  },
  "jade-dragon": {
    "id": "jade-dragon",
    "width": 1280,
    "height": 720,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "Colin W",
    "source": "https://commons.wikimedia.org/wiki/File:Glacier_at_the_Jade_Dragon_Snow_Mountain_-_panoramio.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "origin": "Wikimedia Commons"
  },
  "blue-moon": {
    "id": "blue-moon",
    "width": 1280,
    "height": 960,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "Ping an Chang",
    "source": "https://commons.wikimedia.org/wiki/File:%E6%B0%B4%E8%89%B2%E6%9C%83%E8%AE%8A%E7%9A%84%E8%97%8D%E6%9C%88%E8%B0%B7_20190928195012.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "origin": "Wikimedia Commons"
  },
  "green-lake": {
    "id": "green-lake",
    "width": 1280,
    "height": 960,
    "sizes": [
      480,
      960,
      1280
    ],
    "author": "Daderot",
    "source": "https://commons.wikimedia.org/wiki/File:Green_Lake_Park,_Kunming,_China_-_DSC03430.JPG",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Green_Lake_Park,_Kunming,_China_-_DSC03430.JPG#Licensing",
    "origin": "Wikimedia Commons"
  },
  "five-flower": {
    "id": "five-flower",
    "width": 4180,
    "height": 2781,
    "sizes": [
      480,
      960,
      1600
    ],
    "author": "Chensiyuan",
    "source": "https://commons.wikimedia.org/wiki/File:1_jiuzhaigou_valley_wu_hua_hai_2011b.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "origin": "Wikimedia Commons"
  },
  "shuzheng": {
    "id": "shuzheng",
    "width": 1920,
    "height": 1440,
    "sizes": [
      480,
      960,
      1600
    ],
    "author": "rheins",
    "source": "https://commons.wikimedia.org/wiki/File:%E6%A0%91%E6%AD%A3%E7%BE%A4%E6%B5%B7_-_Shuzheng_Lakes_-_2011.10_-_panoramio.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "origin": "Wikimedia Commons"
  },
  "sister-lakes": {
    "id": "sister-lakes",
    "width": 5472,
    "height": 3648,
    "sizes": [
      480,
      960,
      1600
    ],
    "author": "Zhangzhugang",
    "source": "https://commons.wikimedia.org/wiki/File:Batang_Haizishan_2014.09.16_17-17-04.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "origin": "Wikimedia Commons"
  },
  "zhonglu": {
    "id": "zhonglu",
    "width": 4096,
    "height": 3072,
    "sizes": [
      480,
      960,
      1600
    ],
    "author": "Marym1718",
    "source": "https://commons.wikimedia.org/wiki/File:Jikayi,_Zhonglu,_Danba_county.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "origin": "Wikimedia Commons"
  }
};
// PHOTO_DATA_END

export interface UserPhoto { id: string; width: number; height: number; sizes: number[]; sourceFilename: string; alt: string; title: string; caption: string; credit: string; origin: string; takenAt: null; location: string | null; provenanceFilename?: string; }
export const userPhotos: Record<string, UserPhoto> = {
  "user-autumn-01": {
    "id": "user-autumn-01",
    "width": 1500,
    "height": 2000,
    "sizes": [
      480,
      960,
      1440
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-ba84ddef-b9e2-432e-8876-312506f1c738.png",
    "alt": "Air danau toska yang jernih memantulkan hutan kuning dan hijau, dengan ranting menggantung di bagian atas.",
    "credit": "Koleksi pengguna",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": null,
    "title": "Refleksi musim gugur",
    "caption": "Air danau toska yang jernih memantulkan hutan kuning dan hijau, dengan ranting menggantung di bagian atas."
  },
  "user-autumn-02": {
    "id": "user-autumn-02",
    "width": 1500,
    "height": 2000,
    "sizes": [
      480,
      960,
      1440
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-f03f087c-fef8-4a4a-bbe2-e1ded1ce836c.png",
    "alt": "Danau toska tenang memantulkan langit, hutan kuning jingga, dan lereng pegunungan.",
    "credit": "Koleksi pengguna",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": null,
    "title": "Biru di antara warna emas",
    "caption": "Danau toska tenang memantulkan langit, hutan kuning jingga, dan lereng pegunungan."
  },
  "user-autumn-03": {
    "id": "user-autumn-03",
    "width": 1500,
    "height": 2000,
    "sizes": [
      480,
      960,
      1440
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-b86fbd88-aa55-477d-adfb-8943d8aadb78.png",
    "alt": "Pegunungan dan pepohonan musim gugur terpantul di permukaan danau biru gelap.",
    "credit": "Koleksi pengguna",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": null,
    "title": "Danau di kaki hutan",
    "caption": "Pegunungan dan pepohonan musim gugur terpantul di permukaan danau biru gelap."
  },
  "user-autumn-04": {
    "id": "user-autumn-04",
    "width": 1500,
    "height": 2000,
    "sizes": [
      480,
      960,
      1440
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-b73ffbc4-8efb-4b34-95d3-e8236753ae43.png",
    "alt": "Lereng berhutan lebat dengan dedaunan kuning, jingga, merah, dan hijau di tepi danau.",
    "credit": "Koleksi pengguna",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": null,
    "title": "Semua warna dalam satu lereng",
    "caption": "Lereng berhutan lebat dengan dedaunan kuning, jingga, merah, dan hijau di tepi danau."
  },
  "user-autumn-05": {
    "id": "user-autumn-05",
    "width": 1500,
    "height": 2000,
    "sizes": [
      480,
      960,
      1440
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-be7d6724-aa3c-4746-8d99-ca68e2088dbc.png",
    "alt": "Air danau bening memperlihatkan dasar kehijauan di bawah lereng berhutan warna musim gugur.",
    "credit": "Koleksi pengguna",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": null,
    "title": "Air sebening kaca",
    "caption": "Air danau bening memperlihatkan dasar kehijauan di bawah lereng berhutan warna musim gugur."
  },
  "user-autumn-06": {
    "id": "user-autumn-06",
    "width": 1500,
    "height": 2000,
    "sizes": [
      480,
      960,
      1440
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-de92c06b-7cd3-43e1-94fd-7bf4f9808933.png",
    "alt": "Rumpun pohon berwarna kuning dan jingga mengelilingi petak-petak air biru di dasar lembah.",
    "credit": "Koleksi pengguna",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": null,
    "title": "Danau di antara pepohonan",
    "caption": "Rumpun pohon berwarna kuning dan jingga mengelilingi petak-petak air biru di dasar lembah."
  },
  "user-autumn-07": {
    "id": "user-autumn-07",
    "width": 1500,
    "height": 2000,
    "sizes": [
      480,
      960,
      1440
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-c446b895-0420-4a09-8068-fc7feb499530.png",
    "alt": "Pepohonan merah dan kuning memenuhi lembah di bawah puncak pegunungan.",
    "credit": "Koleksi pengguna",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": null,
    "title": "Merah, emas, dan pegunungan",
    "caption": "Pepohonan merah dan kuning memenuhi lembah di bawah puncak pegunungan."
  },
  "user-autumn-08": {
    "id": "user-autumn-08",
    "width": 1440,
    "height": 1080,
    "sizes": [
      480,
      960,
      1440
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-ba375bd9-b4e5-4995-b27b-ff3e7cc7a070.png",
    "alt": "Danau hijau memantulkan puncak-puncak bersalju dan deretan pohon kuning, dengan jalur kayu di tepinya.",
    "credit": "kapongbeer (dari unggahan yang dikirim pengguna)",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Bipenggou",
    "provenanceFilename": "becac626-86cb-437f-a03d-689af209a72f-e231f65b-b48c-4290-8a2c-db7efaa316f5.png",
    "title": "Bipenggou",
    "caption": "Bipenggou, lokasi dikonfirmasi pengguna. Inspirasi tambahan di luar rute 14 hari."
  },
  "user-autumn-09": {
    "id": "user-autumn-09",
    "width": 1440,
    "height": 1080,
    "sizes": [
      480,
      960,
      1440
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-1cbd77f9-58d2-4f0f-a27b-4243f435c60c.png",
    "alt": "Bangunan kecil di tepi danau dan barisan pohon kuning terpantul di air, di bawah lereng berhutan dan awan rendah.",
    "credit": "kapongbeer (dari unggahan yang dikirim pengguna)",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Bipenggou",
    "provenanceFilename": "becac626-86cb-437f-a03d-689af209a72f-e231f65b-b48c-4290-8a2c-db7efaa316f5.png",
    "title": "Bipenggou",
    "caption": "Bipenggou, lokasi dikonfirmasi pengguna. Inspirasi tambahan di luar rute 14 hari."
  },
  "user-autumn-10": {
    "id": "user-autumn-10",
    "width": 1440,
    "height": 1080,
    "sizes": [
      480,
      960,
      1440
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-a83faf52-04ce-4272-978b-5ea15dd48219.png",
    "alt": "Danau hijau, hutan kuning, dan puncak gunung bersalju di bawah langit biru cerah.",
    "credit": "kapongbeer (dari unggahan yang dikirim pengguna)",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Bipenggou",
    "provenanceFilename": "becac626-86cb-437f-a03d-689af209a72f-e231f65b-b48c-4290-8a2c-db7efaa316f5.png",
    "title": "Bipenggou",
    "caption": "Bipenggou, lokasi dikonfirmasi pengguna. Inspirasi tambahan di luar rute 14 hari."
  },
  "user-autumn-11": {
    "id": "user-autumn-11",
    "width": 1125,
    "height": 2000,
    "sizes": [
      480,
      960,
      1125
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-da125458-43fc-48e1-b8db-879cf4af459d.png",
    "alt": "Kolam-kolam toska bertingkat dengan tepian keemasan di bawah lereng berhutan dan langit biru.",
    "credit": "Koleksi pengguna",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": null,
    "title": "Kolam berundak",
    "caption": "Kolam-kolam toska bertingkat dengan tepian keemasan di bawah lereng berhutan dan langit biru."
  },
  "user-autumn-12": {
    "id": "user-autumn-12",
    "width": 1125,
    "height": 2000,
    "sizes": [
      480,
      960,
      1125
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-8d0a4d99-589d-4d1a-8dba-ae6792abe624.png",
    "alt": "Pohon berdaun kuning berdiri di antara kolam-kolam jernih bertingkat dengan tepian berwarna keemasan.",
    "credit": "Koleksi pengguna",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": null,
    "title": "Pohon emas & air toska",
    "caption": "Pohon berdaun kuning berdiri di antara kolam-kolam jernih bertingkat dengan tepian berwarna keemasan."
  }
};
