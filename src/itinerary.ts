import { northernGuidePhotos, northernPlacePhotoIds, northernPhotoDescriptions } from './guide-photos-north.ts';
import { tripcomPhotos, tripcomPlacePhotos } from './tripcom-photos.ts';
import { westernGuidePhotos, westernPlacePhotoIds } from './guide-photos-west.ts';
import { chengduGuidePhotos } from './guide-photos-chengdu.ts';
// The PDF supplies the base route; explicit traveler revisions take precedence.
// Dates, overnight bases and navigation are rendered from this one source of truth.
export interface Photo {
  id: string; width: number; height: number; sizes: number[];
  author: string; source: string; license: string; licenseUrl: string;
  origin: 'PDF' | 'Wikimedia Commons' | 'Pexels' | 'Flickr' | 'Unsplash' | 'Trip.com';
  photoNote?: string;
}
export interface Place {
  name: string; chinese?: string; description: string; page?: number;
  photo?: string; alt?: string; photoNote?: string;
}
export type VisitStatus = 'Wajib' | 'Opsional' | 'Perlu konfirmasi' | 'Jika jalur dibuka' | 'Alternatif' | 'Terkonfirmasi';
export type Event =
  | { kind: 'stop'; place: string; time: string; note?: string; status?: VisitStatus }
  | { kind: 'transfer'; mode: 'car' | 'train' | 'bus' | 'walk' | 'plane' | 'cable'; title: string; detail?: string; status?: VisitStatus };
export interface Practical { title: string; text: string; link?: { label: string; url: string }; copy?: string }
export interface Day {
  date: string; title: string; shortTitle: string; region: string; route: string[];
  overnight: { name: string; area: string; elevation?: string; detail: string } | null;
  transport: string; intro: string; events: Event[]; practical: Practical[]; pages: number[];
  sourceNote?: string;
}
export const pdfPath = 'China-Itinerary-8-21-November-2026.pdf';
// Refresh the download cache key for every build and browser session.
export const pdfDownloadUrl = `/${pdfPath}?v=${Date.now()}`;
export const places: Record<string, Place> = {
  tfu: { name: 'Chengdu Tianfu (TFU)', chinese: '成都天府国际机场', description: 'Tiba di Terminal 2 dengan penerbangan domestik dari Shanghai Pudong. Ambil bagasi, lalu menuju hotel di Chengdu sebelum jalan sore di kota.', page: 5, photo: 'tfu', alt: 'Area dalam Terminal 1 Bandara Chengdu Tianfu dengan papan petunjuk dan pengunjung.' },
  chengdu: { name: 'Jalan sore di Chengdu', chinese: '春熙路 / 成都太古里', description: 'Kawasan Chunxi Road dan gang terbuka Taikoo Li dekat hotel. Hari ini cukup untuk makan siang telat dan belanja bekal sebelum berangkat ke Chengdu SKP.', photo: 'chengdu-chunxi', alt: 'Jalan pejalan kaki Chunxi Road dengan bangunan berfasad emas dan pengunjung.', photoNote: chengduGuidePhotos['chengdu-chunxi'].photoNote },
  'chengdu-skp-tower': { name: 'Menara Vitality, Chengdu SKP', chinese: '成都SKP 生机之塔', description: 'Enam tiang air setinggi 26 dan 39 meter di taman terbuka mal Chengdu SKP. Airnya mengalir turun di sepanjang tiang, dan setelah gelap cincin lampunya berganti warna.' },
  'zhongshuge-bookstore': { name: 'Toko Buku Zhongshu Ge, Dujiangyan', chinese: '钟书阁都江堰店', description: 'Toko buku dua lantai di mal Sunac Dujiangyan, sekitar 58 km berkendara dari Chunxi Road. Menara buku bundar dengan tangga spiral hitam di tengahnya, dinding buku yang menirukan bendungan Dujiangyan, dan langit-langit cermin. Hanya ada di opsi santai.' },
  'chengdu-east': { name: 'Stasiun Chengdu East', chinese: '成都东站', description: 'Di Chengdu Dong, siapkan paspor untuk pemeriksaan sebelum naik kereta menuju Huanglongjiuzhai.', page: 5, photo: 'chengdu-east', alt: 'Area pintu masuk Stasiun Chengdu East dengan papan nama stasiun.' },
  huanglongjiuzhai: { name: 'Stasiun Huanglongjiuzhai', chinese: '黄龙九寨站', description: 'Stasiun di wilayah Songpan ini menjadi titik berganti kendaraan menuju gerbang Jiuzhaigou.', page: 5, photo: 'huanglongjiuzhai', alt: 'Fasad Stasiun Huanglongjiuzhai di antara pegunungan.' },
  'jiuzhaigou-hotel': { name: 'Goukou / Pengfeng', description: 'Menginap satu malam pada 9 November dekat pintu masuk taman, sebelum naik shuttle 06.20 ke stasiun pada 10 November.', page: 3 },
  'five-flower': { name: 'Five Flower Lake', chinese: '五花海', description: 'Dari jalur kayu di lembah Rize, lihat air biru-hijau dan batang pohon yang terendam di dasar danau.', page: 6, photo: 'five-flower', alt: 'Air toska bening dan batang terendam di Five Flower Lake, dikelilingi pohon kuning dan jingga.' },
  shuzheng: { name: 'Danau Shuzheng', chinese: '树正群海', description: 'Danau-danau kecil tersusun bertingkat di antara hutan, diikuti jalur kayu sepanjang lembah.', page: 6, photo: 'shuzheng', alt: 'Danau biru Shuzheng di antara pulau-pulau kecil dan dedaunan kuning, jingga, serta hijau.' },
  maobiliang: { name: 'Maobiliang & Siguniangshan', chinese: '猫鼻梁', description: 'Saat cuaca cerah, puncak-puncak Siguniangshan berderet membentuk siluet “Empat Saudari”.', page: 8, photo: 'siguniang', alt: 'Puncak bersalju Siguniangshan menjulang di atas pegunungan.', photoNote: 'Foto pengganti memperlihatkan Siguniangshan; sudut Maobiliang tidak diklaim.' },
  rilong: { name: 'Rilong', chinese: '日隆镇', description: 'Kota kecil di kaki Siguniangshan dengan penginapan dan toko di sepanjang jalan utama.', page: 8 },
  bipenggou: { name: 'Bipenggou', chinese: '毕棚沟', description: 'Lembah berhutan larch dengan Danau Panyang dan puncak granit bersalju. Pengunjung wajib naik bus taman sekitar 26 km dari gerbang ke Shanghaizi.', photo: 'bipenggou', alt: 'Danau tenang dengan batang pohon mati di Bipenggou, memantulkan larch keemasan dan puncak granit di bawah langit biru.' },
  'bipenggou-gate': { name: 'Gerbang Bipenggou', chinese: '毕棚沟游客中心', description: 'Pusat pengunjung di mulut lembah, Desa Zhuangfang, Putou, sekitar 30 menit dengan mobil tumpangan dari kota Lixian. Mobil sewa menunggu di sini setelah kunjungan taman.', photo: 'bipenggou', alt: 'Danau tenang dengan batang pohon mati di Bipenggou, memantulkan larch keemasan dan puncak granit di bawah langit biru.', photoNote: 'Foto pengganti memperlihatkan lembah Bipenggou di atas gerbang; bukan foto pusat pengunjung atau penginapan.' },
  danba: { name: 'Danba', chinese: '丹巴', description: 'Pusat kota mengikuti sungai di dasar lembah, dikelilingi desa-desa Tibet di lereng.', page: 9 },
  moshi: { name: 'Moshi Park', chinese: '墨石公园', description: 'Jalur taman membawa kamu mendekati punggung batu bergerigi dan hutan batu kelabu di Bamei.', page: 10, photo: 'moshi', alt: 'Formasi batu kelabu bergerigi di Moshi Park.' },
  tagong: { name: 'Padang rumput Tagong', chinese: '塔公草原', description: 'Padang rumput terbuka membingkai Gunung Yala di kejauhan, lebih lapang daripada lembah Danba.', page: 10, photo: 'tagong', alt: 'Padang rumput luas di Tagong, Sichuan.' },
  xinduqiao: { name: 'Xinduqiao', chinese: '新都桥镇', description: 'Lembah sungai, barisan pohon, dan desa mengitari basis dua malam untuk perjalanan sekitar Kangding.', page: 11, photo: 'xinduqiao', alt: 'Barisan pohon kuning di tepi aliran air dan lereng cokelat Xinduqiao.' },
  'kangding-road': { name: 'Jalan Bandara Kangding', chinese: '康定机场路', description: 'Jalan S434 melintasi dataran terbuka dekat landasan bandara dalam perjalanan menuju Kangding.', page: 13 },
  kangding: { name: 'Kangding', description: 'Rumah dan pertokoan berjajar rapat di kedua sisi sungai, tempat singgah siang sebelum kembali ke pegunungan.', page: 13, photo: 'kangding', alt: 'Kota Kangding berada di lembah pegunungan.' },
  'kangding-mosque': { name: 'Masjid Kangding', chinese: '康定清真寺', description: 'Salat Jumat dijadwalkan di Kangding. Tunjukkan 康定清真寺 saat bertanya arah; pin masjid dan jam khotbah dicek di tempat.', page: 14, photoNote: 'Foto pintu masjid pada PDF belum terverifikasi secara independen.' },
  zheduo: { name: 'Zheduo Pass', chinese: '折多山垭口', description: 'Stupa putih dan penanda batu berada di lintasan tinggi pada rute kembali ke Xinduqiao.', page: 14 },
  zimei: { name: 'Zimei Pass', chinese: '子梅垭口', description: 'Lintasan dapat ditambahkan hanya jika waktu dan kondisi jalan tanah yang rawan es memungkinkan.', page: 14 },
  gaoersi: { name: 'Gao’ersi Shan', chinese: '高尔寺山', description: 'Jalan pegunungan antara Xinduqiao dan Litang menjadi salah satu penanda etape G318.', page: 15 },
  tianlu: { name: 'Tianlu 18 Bends', description: 'Tikungan-tikungan tajam bertumpuk di satu lereng pada segmen G318 yang dijuluki “18 Tikungan”.', page: 15 },
  litang: { name: 'Litang', chinese: '理塘', description: 'Kota dataran tinggi dengan gang beratap khas Tibet menjadi tempat jalan santai setelah berkendara.', page: 15 },
  haizi: { name: 'Haizi Shan', chinese: '海子山', description: 'Bongkah batu dan danau kecil memenuhi dataran bekas gletser yang dilalui menuju Daocheng.', page: 16, photo: 'haizi', alt: 'Bentang dataran tinggi dan danau di Haizi Shan.' },
  'sister-lakes': { name: 'Sister Lakes', chinese: '姊妹湖', description: 'Dua danau ini berada di G318 arah Batang, berbeda dari rute langsung ke Daocheng; butuh mobil sendiri, tidak terjangkau dengan bus.', page: 16, photo: 'sister-lakes', alt: 'Dua danau biru Sister Lakes di bawah pegunungan terbuka dengan padang berwarna keemasan.', photoNote: 'Foto Sister Lakes di jalur Batang, September 2014; bukan danau pada jalur langsung Daocheng.' },
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
  songzanlin: { name: 'Biara Songzanlin', chinese: '松赞林寺', description: 'Bangunan utama beratap emas berdiri bertingkat di bukit, tujuan pagi sebelum naik kereta ke Lijiang.', page: 21, photo: 'songzanlin', alt: 'Kompleks Biara Songzanlin dengan bangunan beratap emas bertingkat di bukit.' },
  'shangrila-station': { name: 'Stasiun Shangri-La', description: 'Fasad putih dan merah menandai stasiun di kota Shangri-La, Yunnan, untuk keberangkatan ke Lijiang.', page: 21, photo: 'shangrila-station', alt: 'Bangunan merah dan putih Stasiun Shangri-La di Yunnan.' },
  'lijiang-station': { name: 'Stasiun Lijiang', description: 'Stasiun beratap segitiga menjadi pintu masuk Lijiang; perjalanan ke kota tua dilanjutkan lewat darat.', page: 21, photo: 'lijiang-station', alt: 'Fasad dan atap segitiga Stasiun Lijiang.' },
  dayan: { name: 'Kota Tua Lijiang (Dayan)', chinese: '大研古城', description: 'Kanal kecil, jembatan, dan rumah beratap genting membentuk kota tua yang dijelajahi menjelang sore.', page: 22, photo: 'highlight-lijiang', alt: 'Panorama atap Kota Tua Lijiang dengan pegunungan bersalju di kejauhan.' },
  sifangjie: { name: 'Sifangjie', chinese: '四方街', description: 'Gang-gang kota tua bertemu di lapangan berbatu yang menjadi tujuan jalan malam di Lijiang.', page: 22 },
  'cable-car': { name: 'Big Cable Car', description: 'Gondola membawa pengunjung dari hutan di lereng bawah menuju tebing dan salju Glacier Park.', page: 24 },
  'jade-dragon': { name: 'Glacier Park, Jade Dragon', chinese: '玉龙雪山', description: 'Jalur kayu dan gardu pandang di stasiun atas menghadap punggung gunung bersalju.', page: 24, photo: 'jade-dragon', alt: 'Gunung bersalju dan kawasan gletser Jade Dragon.' },
  'impression-lijiang': { name: 'Impression Lijiang', chinese: '印象丽江', description: 'Panggung merah terbuka di Ganhaizi menjadi latar pertunjukan musik dan tari, dengan Jade Dragon Snow Mountain menjulang di belakang para pemain.', photo: 'impression-lijiang', alt: 'Pemain pertunjukan Impression Lijiang di panggung merah bertingkat dengan latar pegunungan bersalju.' },
  'blue-moon': { name: 'Blue Moon Valley', chinese: '蓝月谷', description: 'Rangkaian danau toska bertingkat di kaki Jade Dragon, satu kawasan dan satu tiket dengan kereta gantung gletser.', page: 24, photo: 'highlight-blue-moon', alt: 'Danau toska Blue Moon Valley di kaki Jade Dragon Snow Mountain.' },
  huanglong: { name: 'Huanglong', chinese: '黄龙风景名胜区', description: 'Teras kolam travertin kuning dan biru di lembah Songpan, sekitar 3.100–3.576 m. Ropeway naik, jalur kayu ke Five-Colour Pool, lalu turun ke gerbang.', photo: 'tripcom-huanglong-autumn', alt: 'Kolam travertin toska bertingkat dengan tepian keemasan di kaki lereng pinus dan larch kuning, dengan pegunungan bersalju di bawah langit biru.' },
  'upper-tiger-leaping-gorge': { name: 'Upper Tiger Leaping Gorge', chinese: '上虎跳峡', description: 'Bagian hulu ngarai di sisi Shangri-La. Jalur pengunjung dan eskalator turun ke tepi Sungai Jinsha.' },
  'dali-station': { name: 'Stasiun Dali (Xiaguan)', chinese: '大理站', description: 'Stasiun di Xiaguan dihubungkan dengan hotel dekat kota tua menggunakan taksi.', page: 23, photo: 'commons-dali-station', alt: 'Foto udara gedung Stasiun Dali beratap gelombang putih di antara perbukitan hijau, dengan area depan stasiun yang masih dibangun.' },
  erhai: { name: 'Danau Erhai', chinese: '洱海', description: 'Jalan pagi di tepi barat danau dimulai dari Dermaga Caicun, sekitar 3–4 km dari gerbang timur kota tua.', page: 25, photo: 'highlight-erhai', alt: 'Pemandangan Danau Erhai dengan garis pegunungan di seberang.', photoNote: 'Foto memperlihatkan Danau Erhai, bukan verifikasi pin Dermaga Caicun.' },
  caicun: { name: 'Dermaga Caicun', chinese: '才村码头', description: 'Titik mulai menyusuri tepi barat Erhai sebelum kembali ke Kota Tua Dali.', page: 23 },
  'dali-old-town': { name: 'Kota Tua Dali', chinese: '大理古城', description: 'Dari Menara Wuhua terlihat deretan atap kota tua; telusuri gangnya lalu cari makan di Bo’ai Road.', page: 25, photo: 'highlight-dali', alt: 'Gerbang selatan Kota Tua Dali diterangi cahaya keemasan di bawah langit biru malam.', photoNote: 'Foto menampilkan gerbang selatan Kota Tua Dali, bukan Menara Wuhua. Suasana malam sebagai gambaran tempat; kunjungan dijadwalkan siang.' },
  wuhua: { name: 'Menara Wuhua', chinese: '五华楼', description: 'Menara di kota tua menjadi patokan jalan siang sebelum makan halal dan salat Jumat.', page: 23 },
  'kunming-station': { name: 'Stasiun Kunming', description: 'Salah satu tujuan kereta dari Dali berada di pusat kota; sebagian tiket berakhir di Kunming South.', page: 26, photo: 'kunming-station', alt: 'Lapangan dan bangunan Stasiun Kunming.' },
  nancheng: { name: 'Masjid Nancheng', chinese: '南城清真寺', description: 'Gerbang masjid menjadi salah satu patokan di pusat Kunming, dekat kawasan makan malam terakhir.', page: 26, photo: 'nancheng', alt: 'Bangunan Masjid Nancheng di pusat Kunming.' },
  shuncheng: { name: 'Kawasan Shuncheng', chinese: '顺城', description: 'Kawasan Hui di sekitar Masjid Shuncheng menjadi tujuan makan, termasuk sarapan terakhir di Kunming.', page: 26, photo: 'shuncheng', alt: 'Masjid Shuncheng yang menandai kawasan Hui di Kunming.' },
  'green-lake': { name: 'Green Lake (Cuihu)', chinese: '翠湖', description: 'Danau kota dengan jalur jalan kaki di tepi air dapat dikunjungi jika jam penerbangan memungkinkan.', page: 27, photo: 'green-lake', alt: 'Taman dan perairan Green Lake atau Cuihu di Kunming.' },
  kmg: { name: 'Bandara Changshui (KMG)', chinese: '昆明长水国际机场', description: 'Terminal beratap keemasan menjadi titik keberangkatan pulang dari Kunming ke Jakarta.', page: 27, photo: 'commons-kmg', alt: 'Atap keemasan bergelombang terminal Bandara Changshui di atas jalur antar keberangkatan, dengan kolam dan taman di sisi kanan.' },
};
for (const [placeId, photoId] of Object.entries({ ...northernPlacePhotoIds, ...westernPlacePhotoIds })) {
  const photo = northernGuidePhotos[photoId] ?? westernGuidePhotos[photoId];
  places[placeId].photo = photoId;
  places[placeId].alt = northernPhotoDescriptions[photoId] ?? photo.photoNote ?? places[placeId].name;
  places[placeId].photoNote = photo.photoNote;
}
// Trip.com photos replace the archive and PDF pictures wherever the place has one.
for (const [placeId, photo] of Object.entries(tripcomPlacePhotos)) {
  places[placeId].photo = photo.id;
  places[placeId].alt = photo.alt;
  places[placeId].photoNote = undefined;
}

const s = (place: string, time: string, note?: string, status?: VisitStatus): Event => ({kind:'stop',place,time,note,status});
const t = (mode: Extract<Event,{kind:'transfer'}>['mode'], title: string, detail?: string, status?: VisitStatus): Event => ({kind:'transfer',mode,title,detail,status});
const halal: Practical = {title:'Cari makan halal',text:'Cari papan 清真 atau kedai 兰州拉面 di Amap. Konfirmasikan sebelum memesan; siapkan bekal untuk pegunungan.',copy:'清真'};
const snow: Practical = {title:'Kondisi jalan',text:'Lintasan tinggi rawan salju dan es. Pagi itu tanyakan status jalan ke sopir (11–12 November) atau ke hotel dan terminal bus, dan siapkan rencana jika jalan ditutup.'};
export const days: Day[] = [
 {
  "date": "2026-11-08",
  "title": "Chengdu dan Menara Vitality",
  "shortTitle": "Chengdu & Menara Vitality",
  "region": "Sichuan",
  "route": [
    "Shanghai Pudong",
    "Chengdu Tianfu",
    "Pusat kota Chengdu",
    "Chunxi Road",
    "Chengdu SKP"
  ],
  "overnight": {
    "name": "Chengdu",
    "area": "Pusat kota, sekitar Chunxi Road / Taikoo Li",
    "detail": "Malam pertama di Chengdu. Pilih hotel yang mudah dijangkau taksi untuk keberangkatan ke Chengdu East besok pagi; nama hotel belum ditentukan."
  },
  "transport": "Pesawat dari Shanghai, taksi / DiDi ke hotel, lalu DiDi pulang-pergi ke Chengdu SKP",
  "intro": "Tiba dari Shanghai setelah transit semalam di Pudong. Setelah menyimpan koper dan makan siang telat dekat Chunxi Road, sore sampai malam di Menara Vitality, Chengdu SKP. Pulang lebih awal karena besok kereta pukul 06.14.",
  "events": [
    {
      "kind": "transfer",
      "mode": "plane",
      "title": "HO1119 Shanghai Pudong ke Chengdu Tianfu, 08.50–12.20",
      "detail": "Penerbangan domestik setelah transit semalam di Pudong. Imigrasi dan bea cukai sudah selesai di Shanghai pada 7 November malam.",
      "status": "Terkonfirmasi"
    },
    {
      "kind": "stop",
      "place": "tfu",
      "time": "12.20",
      "note": "Kedatangan domestik, jadi tinggal ambil bagasi. Ganjal perut dengan bekal; makan siang telat dekat Chunxi Road setelah check-in. Jam sesuai tiket HO1119.",
      "status": "Terkonfirmasi"
    },
    {
      "kind": "transfer",
      "mode": "car",
      "title": "TFU ke hotel di pusat Chengdu",
      "detail": "Gunakan taksi resmi atau DiDi. Tunjukkan alamat hotel; waktu tiba mengikuti proses bandara dan lalu lintas."
    },
    {
      "kind": "transfer",
      "mode": "walk",
      "title": "Simpan koper, lalu mulai jalan sore",
      "detail": "Check-in atau titip koper di hotel terlebih dahulu. Tidak ada kereta antarkota hari ini."
    },
    {
      "kind": "stop",
      "place": "chengdu",
      "time": "±15.00–15.45",
      "note": "Makan siang telat di kedai 清真 atau 兰州拉面 dekat Chunxi Road, sekalian beli bekal berlabel 清真 untuk makan malam di SKP. Foto panda IFS tidak muat di jadwal ini; kembali ke hotel untuk Asar sekitar 15.51."
    },
    {
      "kind": "transfer",
      "mode": "car",
      "title": "Hotel ke Chengdu SKP",
      "detail": "DiDi ±16.10 ke 成都SKP 生机之塔, sekitar 12,5 km atau ±15 menit tanpa macet; lihat estimasi Minggu sore di aplikasi. Metro jalur 1 butuh ±50–55 menit dari hotel, jadi tidak muat di jadwal ini."
    },
    {
      "kind": "stop",
      "place": "chengdu-skp-tower",
      "time": "±16.30–19.50",
      "note": "Survei sudut selagi terang, lalu cahaya keemasan 17.37–18.11 dan langit biru ±18.26–18.45. Lampu cincin menara menyala setelah gelap; jamnya tidak diumumkan pengelola, sumber pihak ketiga menyebut ±19.00–19.30. Bawa bekal 清真: belum ada kedai halal terverifikasi di dekat SKP. Opsional bila lampu sudah menyala: Tianfu Twin Towers dan Jiaozi Park, sekitar 2,2 km ke utara. Perjalanannya ±25–30 menit, jadi waktu di sana hanya ±10–15 menit; Minggu tidak ada pertunjukan tematik, layar LED menyala 19.00–22.00.",
      "status": "Wajib"
    },
    {
      "kind": "transfer",
      "mode": "car",
      "title": "Chengdu SKP ke hotel",
      "detail": "DiDi sekitar 12 km, atau sekitar 10 km dari stasiun 金融城 bila mampir ke Twin Towers. Tiba di hotel ±20.10, atau ±20.45 bila mampir ke Twin Towers, dan tidur paling lambat 22.00; besok berangkat 05.15."
    }
  ],
  "practical": [
    {
      "title": "Penerbangan 7–8 November",
      "text": "Juneyao HO1568 dari Jakarta (CGK) Sabtu 7 November 15.45 WIB, tiba di Terminal 2 Shanghai Pudong pukul 23.20 waktu China. HO1119 berangkat 08.50 dari terminal yang sama dan tiba di Terminal 2 Tianfu pukul 12.20. HO1568 tanggal 5 November sempat dibatalkan; cek status di aplikasi Juneyao atau Trip.com pada 6–7 November."
    },
    {
      "title": "Imigrasi dan bagasi di Pudong",
      "text": "Isi kartu kedatangan online sebelum berangkat, lewat aplikasi 移民局12367 atau mini program di WeChat/Alipay. Di konter CGK, tanyakan apakah bagasi langsung ke TFU dan minta boarding pass HO1119. Jika tidak, ambil bagasi di Pudong, lewati bea cukai, lalu check-in ulang di konter Juneyao lantai 3 Terminal 2 (island J atau L). Check-in tutup 08.10; check-in online tutup 08.00."
    },
    {
      "title": "Malam di Pudong",
      "text": "Paling praktis: Aerotel di lantai 6 Terminal 2, masih di area umum dan 3 menit dari pemeriksaan keamanan. Pesan di Trip.com dengan tanggal check-in 7 November dan kabari tiba sekitar 00.30. Gratis: area istirahat di lantai 3 Terminal 2 dekat island M. Kapsul tidur hanya ada di ruang tunggu internasional, jadi tidak bisa dipakai."
    },
    {
      "title": "Makan dan salat di Pudong",
      "text": "Belum ada makanan halal yang terverifikasi di Pudong pada malam hari. Makan di CGK, bawa camilan halal, dan minta makanan Muslim (MOML) untuk HO1568 lewat aplikasi Juneyao atau 95520. Tidak ada ruang salat resmi; salat di kamar hotel atau sudut yang tenang. Wudu bisa di kamar mandi gratis di jembatan kedatangan D69 atau D83, sebelum imigrasi."
    },
    {
      "title": "Dari Tianfu ke hotel",
      "text": "Taksi resmi di lantai dasar Terminal 2, pintu G04, sekitar CNY 170–200 termasuk tol. DiDi dijemput di lantai 1 Gedung Parkir 1, sekitar 500 m dari pintu kedatangan B1/B2. Hemat: bus bandara jalur 1 dari pintu G03 ke Chunxi Road, CNY 15, tiap 20–30 menit, sekitar 80 menit."
    },
    {
      "title": "Malam pertama di Chengdu",
      "text": "Malam ini wajib ke Menara Vitality di Chengdu SKP, sekitar 12,5 km di selatan hotel. Pulang ±20.30 dan tidur sebelum 22.00 karena DiDi ke Chengdu East berangkat 05.15. Reservasi hotel masih perlu ditentukan; tidak ada penjemputan Jiuzhaigou malam ini."
    },
    {
      "title": "Siapkan kereta Senin pagi",
      "text": "Kereta C5746 06.14 dari Chengdu East ke Huanglongjiuzhai; C5782 06.45 tiba 08.30 dan tidak sempat mengejar shuttle 08.30. Berangkat dari hotel 05.15 naik DiDi. Malam ini cek e-tiket shuttle Trip.com slot 08.30 dan simpan bekal halal untuk besok.",
      "link": {
        "label": "Pesan di Trip.com",
        "url": "https://id.trip.com/trains/china/route/chengdu-to-huanglongjiuzhai/"
      }
    },
    {
      "title": "Cari makan halal",
      "text": "Belum ada kedai halal terverifikasi di sekitar Chengdu SKP dan Financial City, jadi beli bekal berlabel 清真 saat makan siang dekat Chunxi Road, sekalian untuk 9–12 November; belum ditemukan restoran halal di Lixian dan dekat Bipenggou. Sebuah blog (Juni 2026) menyebut kedai 清真 di sekitar Masjid Huangcheng (皇城清真寺) dekat Tianfu Square; belum diverifikasi, jadi konfirmasikan bahan langsung kepada penjual."
    }
  ],
  "pages": [
    3,
    4,
    5,
    28,
    30
  ],
  "sourceNote": "Revisi perjalanan: 8 November jalan-jalan dan menginap di Chengdu. Perjalanan ke Jiuzhaigou dipindahkan ke pagi 9 November; jadwal ini menggantikan bagian awal PDF."
},
 {
  "date": "2026-11-09",
  "title": "Dari Chengdu ke danau Jiuzhaigou",
  "shortTitle": "Kereta pagi & Jiuzhaigou",
  "region": "Sichuan",
  "route": [
    "Chengdu East",
    "Huanglongjiuzhai",
    "Gerbang Jiuzhaigou",
    "Danau-danau taman"
  ],
  "overnight": {
    "name": "Jiuzhaigou",
    "area": "Goukou atau Pengfeng, dekat gerbang taman",
    "elevation": "±2.000 m",
    "detail": "Satu malam di Jiuzhaigou setelah perjalanan dari Chengdu. Besok shuttle 06.20 dari 九寨沟口长途客运站; beli tiketnya dan minta resepsionis memesan taksi ±05.40 ke terminal malam ini."
  },
  "transport": "Taksi, kereta pagi, bus shuttle, lalu bus taman",
  "intro": "Berangkat dari Chengdu pagi hari. Kunjungi danau setelah tiba; panjang rute menyesuaikan sisa waktu dan batas masuk taman.",
  "events": [
    {
      "kind": "transfer",
      "mode": "car",
      "title": "Hotel Chengdu ke Chengdu East",
      "detail": "DiDi dari hotel pukul 05.15. Datang 30–45 menit sebelum kereta untuk pemeriksaan paspor."
    },
    {
      "kind": "stop",
      "place": "chengdu-east",
      "time": "±05.45–06.14",
      "note": "Naik C5746 06.14. C5782 06.45 tiba 08.30 dan tidak sempat mengejar shuttle 08.30. Subuh sekitar 05.55 di ruang tunggu, lalu langsung ke gerbang.",
      "status": "Perlu konfirmasi"
    },
    {
      "kind": "transfer",
      "mode": "train",
      "title": "Chengdu East ke Huanglongjiuzhai",
      "detail": "C5746 06.14–07.53, kelas dua CNY 143, menurut jadwal yang diperiksa 4 November 2026.",
      "status": "Perlu konfirmasi"
    },
    {
      "kind": "stop",
      "place": "huanglongjiuzhai",
      "time": "07.53",
      "note": "Sarapan dari bekal sambil menunggu shuttle Trip.com slot 08.30 ke gerbang Jiuzhaigou."
    },
    {
      "kind": "transfer",
      "mode": "bus",
      "title": "Stasiun ke gerbang Jiuzhaigou",
      "detail": "Bus shuttle Trip.com slot 08.30, CNY 35, sekitar 93 km / 2 jam. Tiba ±10.30; titip koper di hotel (1,3–2 km dari gerbang, naik taksi bila jalan kaki terlalu lama).",
      "status": "Perlu konfirmasi"
    },
    {
      "kind": "transfer",
      "mode": "bus",
      "title": "Masuk taman sebelum 14.00",
      "detail": "Batas masuk 14.00 dan tutup 18.00. Masuk dengan slot 10:00–12:00, lalu bus taman ke Nuorilang dan ganti bus arah 原始森林 sampai 五花海. Jangan turun di Shuzheng dulu.",
      "status": "Perlu konfirmasi"
    },
    {
      "kind": "stop",
      "place": "five-flower",
      "time": "±12.15–14.30",
      "note": "Sekitar 2¼ jam. Warna air paling kuat saat matahari tinggi. Bila sempat, ikuti jalur kayu turun ke Pearl Shoals (珍珠滩), lalu naik bus dari sana.",
      "status": "Perlu konfirmasi"
    },
    {
      "kind": "transfer",
      "mode": "bus",
      "title": "Pilih rute kembali melalui Shuzheng",
      "detail": "Ikuti pengaturan petugas dan waktu bus terakhir; tidak perlu mengejar semua pemberhentian."
    },
    {
      "kind": "stop",
      "place": "shuzheng",
      "time": "±15.15–16.45",
      "note": "Sekitar 1½ jam bila waktu cukup. Pantulan sore lebih tenang; dasar lembah mulai teduh ±16.30. Persingkat bila keluar dari Rize terlambat.",
      "status": "Opsional"
    },
    {
      "kind": "transfer",
      "mode": "bus",
      "title": "Kembali ke gerbang dan hotel",
      "detail": "Bus ke gerbang, keluar paling lambat 17.30; taman tutup 18.00. Ambil koper dan check-in hotel."
    },
    {
      "kind": "stop",
      "place": "jiuzhaigou-hotel",
      "time": "Malam"
    }
  ],
  "practical": [
    {
      "title": "Kereta dan sambungan pagi",
      "text": "Tiket sudah dijual sejak 26 Oktober. Pesan C5746 06.14 (kelas dua CNY 143) dan bus shuttle Trip.com slot 08.30 (CNY 35) ke gerbang; shuttle dipesan sebelum 22.00 tanggal 8. C5782 tidak cocok karena tiba 08.30. Belum ada tiket atau layanan transfer yang dikonfirmasi.",
      "link": {
        "label": "Pesan di Trip.com",
        "url": "https://id.trip.com/trains/china/route/chengdu-to-huanglongjiuzhai/"
      }
    },
    {
      "title": "Batas masuk 14.00",
      "text": "Pengumuman 31 Oktober 2026: masuk 08.00–14.00, tutup 18.00. Jika sambungan membuat tiba setelah batas masuk, jangan menganggap masih bisa berkunjung; jadwal taman perlu ditinjau ulang.",
      "link": {
        "label": "Pengumuman resmi taman",
        "url": "https://www.jiuzhai.com/news/notice/11492-2026-10-31-09-08-46"
      }
    },
    {
      "title": "Waktu transfer stasiun",
      "text": "Pengelola memperkirakan sekitar 2 jam dari Huanglongjiuzhai ke Jiuzhaigou. Tambahkan waktu menunggu dan urusan koper.",
      "link": {
        "label": "Akses resmi Jiuzhaigou",
        "url": "https://www.jiuzhai.com/intelligent-service/arrival-mode"
      }
    },
    {
      "title": "Tiket dan paspor",
      "text": "Di Trip.com pilih Ticket + Sightseeing Bus Ticket (Non-Chinese mainland visitors), CNY 280 untuk 9 November: masuk CNY 190 + bus CNY 90. Reservasi sesuai paspor; harga tidak otomatis lebih rendah untuk kunjungan siang.",
      "link": {
        "label": "Tarif dan reservasi resmi",
        "url": "https://www.jiuzhai.com/intelligent-service/tickets"
      }
    }
  ],
  "pages": [
    3,
    4,
    6,
    28
  ],
  "sourceNote": "Revisi perjalanan: 8 November jalan-jalan dan menginap di Chengdu. Perjalanan ke Jiuzhaigou dipindahkan ke pagi 9 November; jadwal ini menggantikan bagian awal PDF."
},
 {date:'2026-11-10',title:'Kereta dan bus ke Lixian',shortTitle:'Kereta & bus ke Lixian',region:'Sichuan',route:['Jiuzhaigou','Huanglongjiuzhai','Chengdu','Lixian'],overnight:{name:'Bipenggou',area:'Kota Lixian (Zagunao), 30 menit dari gerbang',elevation:'1.900 m',detail:'Tidur di kota Lixian dekat terminal; besok pagi naik mobil tumpangan ke gerbang Bipenggou.'},transport:'Taksi, shuttle, kereta, metro, lalu bus',intro:'Tanpa mobil: kembali ke Chengdu naik kereta, lalu bus ke Lixian di kaki Bipenggou. Jalan G213 Songpan–Maoxian masih tertutup longsor.',events:[t('car','Hotel ke 九寨沟口长途客运站','Taksi ±05.40 yang dipesan resepsionis semalam, tiba sekitar 05.50. Subuh di terminal sebelum naik bus.'),t('bus','Gerbang Jiuzhaigou ke Stasiun Huanglongjiuzhai','Shuttle 06.20 dari 九寨沟口长途客运站, CNY 51, sekitar 2 jam. Beli dengan paspor di loket atau 团子出行.'),s('huanglongjiuzhai','±08.20'),t('train','Huanglongjiuzhai ke Chengdu East','C5784 09.04–10.45, CNY 130 di Trip.com.'),t('train','Chengdu East ke terminal Chadianzi','Metro jalur 2 langsung dari 成都东客站 ke 茶店子客运站, sekitar 45–55 menit tanpa ganti jalur. Makan siang di kedai 清真 atau 兰州拉面 dekat terminal.'),t('bus','Chadianzi ke Lixian','Bus 13.30 ke 理县旅游客运中心, CNY 75, sekitar 3 jam. Cadangan 15.30 dan 16.30.')],practical:[{title:'Tanpa mobil hari ini',text:'Shuttle, kereta, dan bus sekitar CNY 260, jauh lebih murah daripada mobil seharian (±580 km). Mobil sewa baru mulai besok setelah Bipenggou.'},{title:'G213 tertutup',text:'Longsor di Dingziba, Maoxian, sejak 16 September 2026; per 22 Oktober belum dibuka. Karena itu jalannya memutar lewat Chengdu.'},{title:'Makan halal',text:'Makan siang di Chengdu sebelum bus. Tidak ditemukan restoran halal di kota Lixian maupun dekat gerbang Bipenggou; bawa bekal berlabel 清真.',copy:'清真'}],pages:[3,7,28,30],sourceNote:'Revisi 4 November 2026: atas permintaanmu, rute Sichuan memakai transportasi umum bila tersedia. Mobil sewa hanya 11–12 November; jadwal bus dan kereta dicek untuk tanggal perjalanan.'},
 {date:'2026-11-11',title:'Bipenggou, lalu ke kaki Siguniang',shortTitle:'Bipenggou & Rilong',region:'Sichuan',route:['Bipenggou','Danau Panyang','Jalan Lixiao','Rilong'],overnight:{name:'Rilong',area:'Kaki Siguniangshan',elevation:'3.200 m',detail:'Satu malam di kaki Siguniangshan sebelum turun ke Danba lalu naik ke Tagong besok.'},transport:'Mobil tumpangan, bus taman, lalu mobil sewa ±2–3 jam',intro:'Pagi di danau dan hutan larch Bipenggou, siang melintasi terowongan Qionglai menuju kaki Siguniangshan.',events:[t('car','Lixian ke gerbang Bipenggou','Mobil tumpangan dari terminal Lixian sekitar CNY 20–40 per orang, atau taksi/DiDi bila ada; sekitar 30 menit.'),t('bus','Gerbang ke Shanghaizi','Tukar voucher kategori non-mainland (paspor luar daratan Tiongkok) di loket saat buka pukul 08.00–08.30, lalu naik bus taman sekitar 40–45 menit. Minum obat antimabuk sebelum naik.'),s('bipenggou','±09.00–11.45','Mobil listrik ke Danau Panyang (±3.680 m), waktu utama memotret selagi angin tenang, lalu jalur kayu ke Teluk Bulan. Ambil foto dalam perjalanan naik; kendaraan turun dilaporkan tidak berhenti. Targetkan bus turun dari Shanghaizi ±11.45, paling lambat 12.15.'),t('car','Bipenggou ke Rilong lewat 理小路','Mulai mobil sewa dua hari (tidak ada bus lewat jalan ini). Tinggalkan gerbang paling lambat 13.00. Jalan ini hanya dibuka siang hari dan rawan es. Jika ditutup, ikuti keputusan pukul 07.00: lewati taman dan langsung ke Rilong lewat Wolong.'),s('maobiliang','±17.00–18.40','Jika puncak terlihat: mobil sekitar 10 menit dari Rilong. Pasang tripod sebelum cahaya emas 17.39; matahari terbenam sekitar 18.14, puncak bersalju kena cahaya sampai ±18.24, langit biru sampai ±18.39. Jalan kembali gelap dan bisa berlapis es.','Opsional'),s('rilong','Sore–malam')],practical:[{title:'Mobil sewa 11–12 November',text:'Pesan mobil dan sopir berizin (营运证) dari Bipenggou sampai Xinduqiao. Minta harga all-in (bensin, tol, parkir, makan dan menginap sopir), sekitar CNY 600–800 per hari, ditambah biaya kembali kosong (返空费).'},{title:'Keputusan pukul 07.00',text:'Cek status 理小路 bersama sopir. Jika ditutup karena salju atau es, lewati taman dan langsung ke Rilong lewat Wolong agar tidak berkendara di pegunungan setelah gelap.',copy:'理小路'},{title:'Tiket Bipenggou',text:'Pesan sekarang di Qunar atau Ctrip sesuai nama di paspor. Qunar mencantumkan kategori non-mainland CNY 140 termasuk bus, ditambah mobil listrik CNY 60 pulang-pergi. Tanggal 11 November bertepatan dengan libur sekolah Aba dan Chengdu; tahun lalu tiket habis pada 13–14 November.'},{title:'Ketinggian',text:'Bus naik dari sekitar 2.250 m ke 3.560 m dalam satu pagi, lalu malam di Rilong 3.200 m. Bergerak pelan dan minum cukup air.'},halal],pages:[3,8,28],sourceNote:'Revisi 4 November 2026: G213 Songpan–Maoxian tertutup longsor, jadi rute 10–12 November disusun ulang. Atas permintaanmu, Bipenggou menggantikan Shuangqiao. Danba kini hanya tempat singgah makan siang, bukan tempat menginap, dan Zhonglu dihapus dari rute.'},
 {date:'2026-11-12',title:'Dari Siguniang ke padang Tagong',shortTitle:'Danba, Moshi & Tagong',region:'Sichuan',route:['Rilong','Danba','Moshi Park','Tagong','Xinduqiao'],overnight:{name:'Xinduqiao',area:'Basis untuk perjalanan sekitar Kangding',elevation:'3.300 m',detail:'Malam pertama dari dua malam. Besok ke Kangding untuk salat Jumat; berangkat paling lambat 09.00.'},transport:'Mobil sewa hari terakhir, ±11,5 jam termasuk singgah / ±260 km',intro:'Hari berkendara panjang: turun ke lembah Danba, hutan batu Moshi, lalu padang rumput yang menghadap Yala.',events:[t('car','Rilong ke Danba','Berangkat 07.45, sekitar 3–3,5 jam termasuk antrean. Ada perbaikan G350 di Banshanmen dekat Danba: buka-tutup setiap 30 menit, ditambah 4–6 kali penutupan penuh sekitar 1 jam per hari.'),s('danba','Siang','Makan siang dan isi bekal sebelum naik ke Bamei.'),t('car','Danba ke Bamei','Perjalanan dilanjutkan ke Moshi Park.'),s('moshi','Siang','Taman berada sekitar 3.500 m.'),t('car','Moshi Park ke Tagong'),s('tagong','Sore','Lihat Gunung Yala dari padang; PDF menyebut kawasan Yala sendiri tutup musim dingin.'),t('car','Lanjut ke Xinduqiao'),s('xinduqiao','Malam')],practical:[{title:'Bekal siang',text:'Pilihan halal di Tagong dan Xinduqiao terbatas. Siapkan bekal dan cari 兰州拉面 di jalan utama.',copy:'兰州拉面'},{title:'Ketinggian',text:'Turun dari Rilong sekitar 3.200 m ke Danba sekitar 2.000 m, lalu tidur di Xinduqiao sekitar 3.300 m. Sisakan waktu istirahat.'},snow],pages:[3,9,10,11,28,30],sourceNote:'Revisi 4 November 2026: G213 Songpan–Maoxian tertutup longsor, jadi rute 10–12 November disusun ulang. Atas permintaanmu, Bipenggou menggantikan Shuangqiao. Danba kini hanya tempat singgah makan siang, bukan tempat menginap, dan Zhonglu dihapus dari rute.'},
 {date:'2026-11-13',title:'Kangding & cahaya pegunungan',shortTitle:'Kangding & salat Jumat',region:'Sichuan',route:['Xinduqiao','Kangding','Zheduo Pass','Xinduqiao'],overnight:{name:'Xinduqiao',area:'Kembali ke hotel yang sama',elevation:'3.300 m',detail:'Malam kedua di Xinduqiao sebelum melanjutkan G318 ke Litang.'},transport:'Mobil tumpangan atau bus, Xinduqiao ↔ Kangding',intro:'Hari tanpa mobil sewa: ke Kangding untuk salat Jumat, lalu kembali ke Xinduqiao sebelum gelap.',events:[t('car','Xinduqiao ke Kangding','Mobil tumpangan CNY 40–50 per orang; minta hotel mencarikan, berangkat saat penuh 4 orang. Atau naik bus yang lewat. Sekitar 2 jam; berangkat paling lambat 09.00.'),s('kangding','±10.30–11.45'),s('kangding-mosque','±11.45–13.45','Masjid di 东大街. Zuhur sekitar 12.56; jam khotbah Jumat dicek di tempat. Lanjut makan halal di sekitar masjid.','Perlu konfirmasi'),t('car','Kembali ke Xinduqiao lewat Zheduo','Mobil tumpangan dari 东关 atau 步行街 di Kangding, sekitar 2 jam; berangkat sebelum 15.30.'),s('zheduo','Dilewati','Lintasan sekitar 4.298 m, rawan es.'),s('zimei','Tidak disarankan','Jauh dari rute; butuh mobil carteran seharian dari Xinduqiao.','Opsional')],practical:[{title:'Salat Jumat',text:'Tiba di Kangding sekitar 10.30 sudah cukup untuk Zuhur sekitar 12.56. Jika mobil tumpangan lama penuh, naik bus yang lewat.',copy:'康定清真寺'},{title:'Makan halal',text:'Cari kluster Hui di sekitar masjid untuk makan siang dan mengisi bekal.'},snow],pages:[3,12,13,14,28,30],sourceNote:'Revisi 4 November 2026: jam 13, 14 dan 17 November dihitung ulang dari jarak, matahari terbit dan terbenam, serta waktu Zuhur. Etape gunung dibuat selesai sebelum gelap.'},
 {date:'2026-11-14',title:'Menelusuri G318 ke Litang',shortTitle:'G318 ke Litang',region:'Sichuan',route:['Xinduqiao','Gao’ersi Shan','Tianlu 18 Bends','Litang'],overnight:{name:'Litang',area:'Kota dataran tinggi',elevation:'4.014 m',detail:'Malam menginap tertinggi dalam perjalanan. Pilih aktivitas sore yang ringan.'},transport:'Bus lewat Xinduqiao, ±4–5 jam / ±195 km',intro:'Jalan pegunungan berkelok dan padang tinggi dari jendela bus, lalu sore santai di kota Litang. Tidur malam ini 700 m lebih tinggi dari Xinduqiao.',events:[t('bus','Xinduqiao ke Litang melalui G318','Naik bus yang lewat dari Danba (berangkat 08.00) atau Chengdu (06.30); tanyakan jam lewat Xinduqiao di hotel atau terminal sehari sebelumnya.'),s('gaoersi','Dari bus','G318 kini lewat terowongan Gao’ersi; jalan lintasan lama 4.412 m jarang dipakai.'),s('tianlu','Dari bus','Bus tidak berhenti di titik pandang.','Opsional'),s('litang','±15.00–18.30','Tiba dengan bus; Zuhur sekitar 13.03 masih di jalan. Check-in dan istirahat; tidak ada trek hari ini.')],practical:[{title:'Malam dingin',text:'Perkiraan dalam PDF untuk Litang: siang 1–8 °C, malam −15 hingga −8 °C. Ini perkiraan musiman, bukan prakiraan langsung.'},{title:'Ketinggian',text:'Jika ada gejala mabuk ketinggian pada 13 November, jangan naik ke Litang hari ini. Panduan CDC: di atas 3.000 m, naikkan ketinggian tidur paling banyak 500 m per malam.'},halal,snow],pages:[3,12,15,28,30],sourceNote:'Revisi 4 November 2026: jam 13, 14 dan 17 November dihitung ulang dari jarak, matahari terbit dan terbenam, serta waktu Zuhur. Etape gunung dibuat selesai sebelum gelap.'},
 {date:'2026-11-15',title:'Dari Litang ke gerbang Yading',shortTitle:'Haizi Shan & Riwa',region:'Sichuan',route:['Litang','Haizi Shan','Daocheng','Riwa'],overnight:{name:'Riwa',area:'Shangri-La Town, Sichuan',elevation:'2.900 m',detail:'Malam pertama dari dua malam. Konfirmasikan kamar berpemanas untuk 15 dan 16 November.'},transport:'Bus Litang ke Daocheng ±4–5 jam, lalu taksi ke Riwa',intro:'Melintasi dataran bekas gletser, lalu turun ke basis kunjungan Yading.',events:[t('bus','Litang ke Daocheng','Bus 09.30 dari 理塘县汽车站 (康南客运中心), CNY 82. Turun di Daocheng untuk belanja bekal; pemberhentian 亚丁 (CNY 132) melewatkannya. Bus cadangan 14.00 dan 16.00 membuatmu tiba di Riwa setelah gelap.'),s('haizi','Dari bus','Dataran sekitar 4.500 m; bus tidak berhenti.','Opsional'),s('sister-lakes','Jika mengambil detur','Letaknya di G318 arah Batang. Bukan pemberhentian pada jalur langsung ke Daocheng.','Perlu konfirmasi'),s('daocheng','±13.30–15.10','Makan siang, Zuhur, lalu beli bekal halal untuk dua malam di Riwa, hari trek, dan perjalanan 17 November.'),t('car','Daocheng ke Riwa','Taksi sekitar 1,5 jam. DiDi belum tentu ada, jadi sepakati tarif di terminal.'),s('riwa','Sore–malam')],practical:[{title:'Riwa bukan kota Shangri-La',text:'Riwa / Shangri-La Town (香格里拉镇) berada di Sichuan. Kota Shangri-La di Yunnan baru dituju pada 17 November.',copy:'香格里拉镇'},{title:'Sister Lakes',text:'Butuh mobil sendiri ke arah Batang; tidak termasuk rencana bus.'},{title:'Bekal dan penginapan',text:'Beli bekal halal sebelum Riwa; pastikan kamar memiliki pemanas.'},snow],pages:[3,12,16,28,30]},
 {date:'2026-11-16',title:'Menjelajahi lembah Yading',shortTitle:'Yading & jalur danau',region:'Sichuan',route:['Riwa','Chonggu','Luorong','Yading','Riwa'],overnight:{name:'Riwa',area:'Hotel yang sama di Shangri-La Town, Sichuan',elevation:'2.900 m',detail:'Malam kedua. Istirahat sebelum perjalanan panjang ke Yunnan.'},transport:'Bus taman, jalan kaki, trek bersyarat',intro:'Rute danau atas bergantung pada pembukaan jalur dan kondisi tubuh.',events:[t('bus','Riwa ke titik turun bus taman'),s('zhaguanbeng','Pagi'),t('walk','Berjalan menuju Chonggu'),s('chonggu','Pagi'),s('luorong','Pagi–siang'),t('walk','Trek danau atas','Sekitar 5–6 jam pulang-pergi dari Luorong, hanya jika dibuka.','Jika jalur dibuka'),s('milk-lake','Siang','Sekitar 4.600 m; bukan akses yang sudah dikonfirmasi.','Jika jalur dibuka'),s('five-colour','Siang','Sekitar 4.700 m; ikuti keputusan petugas taman.','Jika jalur dibuka'),s('pearl-lake','Pilihan jalur pendek','Pilih Chonggu dan Pearl Lake jika jalur pendek dibuka dan jalur atas tidak sesuai kondisi hari itu.','Alternatif'),t('bus','Kembali ke hotel di Riwa')],practical:[{title:'Akses taman',text:'Pesan tiket 16 November dan cek jalur yang dibuka. Jangan menganggap Milk Lake atau Five-Colour Lake pasti dapat dicapai.'},{title:'Bekal trek',text:'Bawa makanan halal dan air untuk seharian.'},{title:'Dingin dan ketinggian',text:'PDF memperkirakan suhu trek −3 hingga 5 °C; di sekitar 4.700 m dapat lebih dingin. Pilih jalur pendek bila tubuh perlu istirahat.'}],pages:[3,17,18,19,28,30]},
 {date:'2026-11-17',title:'Menyeberang ke Shangri-La',shortTitle:'Riwa ke Yunnan',region:'Sichuan ke Yunnan',route:['Riwa','Xiangcheng','Daxueshan','Dukezong'],overnight:{name:'Shangri-La',area:'Dukezong, Yunnan',elevation:'3.300 m',detail:'Satu malam di kota Shangri-La, Yunnan; bukan Riwa di Sichuan.'},transport:'Taksi ke Xiangcheng, lalu bus ke Shangri-La',intro:'Belum ada bus Riwa–Xiangcheng, jadi naik taksi atau mobil carteran ke Xiangcheng, lalu bus siang ke Shangri-La. Temanmu bergabung di Dukezong.',events:[t('car','Riwa ke Xiangcheng','Taksi atau mobil carteran, sekitar 3–3,5 jam; berangkat 08.00.'),s('xiangcheng','Siang','Makan siang dan Zuhur (sekitar 13.06) sebelum bus.'),t('bus','Xiangcheng ke Shangri-La','Bus 14.30 dari 乡城长途汽车站, sekitar CNY 86, sekitar 5 jam. Beli dengan paspor di terminal.'),s('daxueshan','Dari bus','Dua lintasan, Daxueshan sekitar 4.330 m dan Xiaoxueshan sekitar 3.910 m.','Opsional'),s('dukezong','±19.30–20.00','Taksi dari terminal bus ke hotel, check-in, lalu bertemu temanmu.')],practical:[{title:'Temanmu bergabung',text:'Mulai malam ini kalian berdua: kamar dibagi dua, dan tiket kereta serta tiket masuk di Yunnan dibeli dua. Tujuan temanmu adalah Kota Tua Dukezong (独克宗古城), Shangri-La, Yunnan, bukan Shangri-La Town (香格里拉镇) di Sichuan. Dari Kunming: pesawat ke Diqing Shangri-La (DIG) sekitar 1 jam 10–30 menit lalu taksi ±15 menit, atau kereta langsung ke 香格里拉站 sekitar 5–5,5 jam, misalnya C86 10.15–15.00 atau C638 13.11–18.40 (jadwal 17 November di 12306; cek lagi di Trip.com).',copy:'独克宗古城'},{title:'Tiket bus',text:'Beli di terminal Xiangcheng dengan paspor. Bus 14.30 tiba sekitar 19.30, setelah gelap.'},{title:'Jika jalan tertutup',text:'Jika lintasan Daxueshan ditutup salju dan bus batal, bermalam di Xiangcheng lalu naik bus 08.00 besok; kereta ke Lijiang perlu dicek ulang.'},{title:'Bekal perjalanan',text:'Bawa bekal halal yang dibeli di Daocheng dan periksa tanda 清真 sebelum makan di Dukezong.'},snow],pages:[3,17,20,28,30],sourceNote:'Revisi 4 November 2026: jam 13, 14 dan 17 November dihitung ulang dari jarak, matahari terbit dan terbenam, serta waktu Zuhur. Etape gunung dibuat selesai sebelum gelap.'},
 {date:'2026-11-18',title:'Songzanlin, lalu sore di Dayan',shortTitle:'Songzanlin & Dayan',region:'Yunnan',route:['Shangri-La','Songzanlin','Lijiang','Dayan'],overnight:{name:'Lijiang',area:'Sekitar Kota Tua Dayan',elevation:'2.400 m',detail:'Sepakati dengan sopir: jemput 06.30 besok, koper ikut di mobil seharian, lalu berakhir di Stasiun Lijiang.'},transport:'Taksi, kereta siang, lalu mobil dari stasiun ke kota tua',intro:'Biara beratap emas di cahaya pagi, kereta siang ke Lijiang, lalu sore bebas dan cahaya emas di atas atap Kota Tua Dayan. Blue Moon Valley pindah ke pagi besok.',events:[s('songzanlin','08.00–10.45','Mulai dari Danau Lamuyangcuo (拉姆央措湖) di kaki biara selagi matahari rendah dan angin pelan, lalu naik ke aula Zhacang dan Jikang. Turun dengan shuttle ±10.25; kembali ke Dukezong paling lambat 11.00.'),t('car','Ambil bagasi dan menuju stasiun','Taksi sekitar 15–20 menit; tiba 30–45 menit sebelum kereta.'),s('shangrila-station','±11.25'),t('train','Shangri-La ke Lijiang','C984 12.00, tiba 13.40, kelas dua CNY 63. Beli dua kursi.','Perlu konfirmasi'),s('lijiang-station','13.40'),t('car','Mobil dengan sopir ke Kota Tua Dayan','Dijemput di pintu keluar Stasiun Lijiang ±14.05, sekitar 25–40 menit ke gerbang kota tua terdekat hotel. Bila sopir hanya dipesan untuk besok, naik taksi.'),s('dayan','±15.00–19.00','Check-in, Zuhur dan Asar, lalu sore bebas di gang Dayan atau Shuhe. Cahaya emas langsung ±17.10–17.55 dari tempat tinggi seperti Menara Wangu atau atap kafe; matahari hilang di balik bukit barat ±17.55. Lentera dan langit biru senja ±18.30–18.55.'),s('sifangjie','Malam')],practical:[{title:'Tiket kereta',text:'C984 12.00–13.40 (CNY 63) tetap pilihan utama: sore masih panjang untuk check-in, istirahat, dan cahaya emas di kota tua. Kereta sekitar 13.46 dan 15.01 bisa dipakai bila ingin pagi Songzanlin lebih santai, tetapi jam tibanya belum dicek. Beli dua kursi atas nama paspor masing-masing.',link:{label:'Pesan di Trip.com',url:'https://id.trip.com/trains/china/route/shangri-la-to-lijiang/'}},{title:'Makan halal',text:'Cari kedai Hui bertanda 清真 di sekitar kota tua untuk makan malam, lalu beli bekal halal untuk sarapan, makan siang, dan makan malam besok. Foto khusus Old Town Beef / Ha’s Beef belum terverifikasi dalam PDF.'},{title:'Blue Moon pindah ke besok',text:'Hari ini tidak masuk kawasan Jade Dragon, jadi tiket kawasan 18 November tidak perlu dibeli: hemat CNY 120 per orang. Blue Moon Valley dikunjungi besok pagi dengan tiket kawasan yang sama dengan Impression dan Glacier Park.'},{title:'Siapkan besok',text:'Pastikan sopir 06.30 dengan koper di mobil seharian, tiket kawasan dan shuttle untuk dua paspor, slot kereta gantung 15.00–15.30, dan Impression Lijiang 13.20. Simpan semua tiket di ponsel.'}],pages:[3,17,21,22,28,30]},
 {
  date: '2026-11-19',
  title: 'Blue Moon, Impression Lijiang & Glacier Park',
  shortTitle: 'Jade Dragon, lalu Dali',
  region: 'Yunnan',
  route: ['Lijiang', 'Blue Moon Valley', 'Impression Lijiang', 'Jade Dragon', 'Dali'],
  overnight: { name: 'Dali', area: 'Dekat gerbang Kota Tua Dali', elevation: '±2.000 m', detail: 'Kabari hotel jam tiba: C442 tiba 22.21, atau 23.42 bila terpaksa naik C326 cadangan. Lokasi dekat kota tua memudahkan pagi di Erhai.' },
  transport: 'Mobil seharian, shuttle kawasan, kereta gantung, lalu kereta malam ke Dali',
  intro: 'Pagi panjang di Blue Moon Valley selagi matahari baru menyentuh air, Impression Lijiang 13.20, lalu Glacier Park sore sebelum kereta malam ke Dali. Bila belum naik kereta gantung pukul ±15.45, lewati gletser.',
  events: [
    t('car', 'Berangkat dari hotel Lijiang dengan koper', 'Pukul 06.30. Koper ikut di mobil seharian; sopir menunggu sampai mengantar ke stasiun. Acuan pengelola dari kota ke Ganhaizi sekitar 80 menit; tambah ±45 menit bila mobil harus parkir di Baisha dan pindah ke kereta wisata.'),
    s('blue-moon', '±08.30–11.45', 'Tiket kawasan dan shuttle dipesan online untuk dua paspor; gerbang tidak menjual tiket. Mulai dari hulu di 玉液湖 saat matahari menyentuh air ±08.35, lalu turun ke 镜潭湖, 蓝月湖, dan 听涛湖. Cahaya samping-belakang dari kiri paling bagus ±09.00–11.00. Naik shuttle kembali ke 雪川游客港 paling lambat 11.45.'),
    t('bus', 'Shuttle kembali ke teater Impression Lijiang', 'Dari 水月阁 ke 雪川游客港; teater sekitar 200 m dari halte. Makan siang dari bekal, lalu masuk teater ±12.45.'),
    s('impression-lijiang', '13.20 utama / 14.50 cadangan', 'Agenda wajib. Pesan sesi 13.20 di Trip.com sekarang; catatan 3 November menyebut batal gratis sampai 08.00 di hari pertunjukan, cek lagi sebelum membayar. Sesi 14.50 hanya untuk rencana cadangan bila 12 November tidak ada slot kereta gantung sore: Glacier Park pindah ke pagi, Blue Moon ke siang. Waktu China (UTC+8). Tiket belum dipesan.', 'Wajib'),
    t('bus', 'Langsung ke stasiun bawah kereta gantung', 'Keluar teater ±14.25 dan langsung ke halte shuttle 冰川公园. Zuhur dan Asar dijamak takhir sesudah gletser.'),
    s('cable-car', '15.00–15.30', 'Slot dipesan di mini program 丽江旅游集团 mulai 12 November. Aturan tetap: bila pukul ±15.45 belum naik, lewati Glacier Park dan langsung ke stasiun; Blue Moon dan Impression sudah selesai. Yang terlambat dari slot dipindah ke 16.30–17.30, terlalu mepet untuk kereta malam.', 'Perlu konfirmasi'),
    t('cable', 'Naik ke Glacier Park'),
    s('jade-dragon', '±15.15–16.20', 'Area stasiun atas sekitar 4.506 m, sekitar 1 jam. Jalan pelan; turun lebih awal bila temanmu pusing atau sesak.'),
    t('car', 'Dari Ganhaizi langsung ke Stasiun Lijiang', 'Zuhur dan Asar dijamak takhir di 雪川游客港, lalu mobil berangkat ±17.15, sekitar 80 menit, tanpa mampir kota tua. Makan malam dari bekal halal; Maghrib dan Isya dijamak takdim di ruang tunggu stasiun setelah 18.28.'),
    t('train', 'Lijiang ke Dali', 'C442 20.22, tiba 22.21. Kelas dua CNY 80; beli dua kursi, dijual mulai 5 November 15.15 WIB. Cadangan bila tertinggal: C326 22.05, tiba 23.42.', 'Perlu konfirmasi'),
    s('dali-station', 'Malam'),
    t('car', 'Taksi ke hotel dekat Kota Tua Dali'),
  ],
  practical: [
    { title: 'Tiket Impression Lijiang', text: 'Pilihan 19 November pada tangkapan layar Trip.com: 13.20 atau 14.50, mulai Rp462.162. Pesan 13.20 agar slot kereta gantung 15.00–15.30 terkejar. Bila Trip.com mengizinkan, tahan juga 14.50 dan batalkan salah satunya setelah slot sore pasti pada 12 November. Harga kalender adalah acuan terendah, bukan harga final kursi biasa/VIP; cek total dan ketersediaan sebelum memesan.', link: { label: 'Cek sesi & tiket di Trip.com', url: 'https://id.trip.com/travel-guide/attraction/yulong/impressions-lijiang-performance-10758688/' } },
    { title: 'Tiket kawasan dan kereta gantung', text: 'Sejak 1 Januari 2026 gerbang tidak menjual tiket. Mulai 12 November, pesan untuk dua paspor: tiket kawasan CNY 100 dan shuttle CNY 20 di mini program 玉龙雪山服务 (atau Trip.com), lalu Big Cable Car CNY 120 slot 15.00–15.30 di mini program 丽江旅游集团. Tiket kawasan ini juga untuk Blue Moon Valley. Satu paspor hanya bisa membeli tiket kereta gantung Glacier Park sekali per 90 hari, jadi pilih slot dengan benar.' },
    { title: 'Paspor dan verifikasi wajah', text: 'Pembelian dan naik kereta gantung memakai verifikasi wajah. Sebelum 12 November, coba daftar nama asli dengan paspor di mini program 丽江旅游集团, atau telepon 0888-8889999. Bila paspor ditolak, pakai paket Trip.com CNY 488 (kawasan, kereta gantung, Impression, antar-jemput kota tua), asal sesi 13.20 dan slot sore bisa dipilih; bila memakainya, jangan beli tiket terpisah.' },
    { title: 'Mobil di Ganhaizi', text: 'Pengelola membatasi mobil yang masuk Ganhaizi saat parkir penuh. Tanyakan tertulis kepada penyewa mobil apakah mobil berizin (营运车) boleh masuk dan menunggu. Bila tidak, parkir gratis di pusat pengunjung Baisha lalu naik kereta wisata ke Ganhaizi; sisihkan ±45 menit tambahan pagi dan sore.' },
    { title: 'Kereta dan bagasi', text: 'Koper di mobil seharian, jadi dari Ganhaizi langsung ke stasiun. Pemeriksaan tiket berhenti 3–5 menit sebelum kereta berangkat, dan paspor asing bisa lewat jalur manual. Bila C442 tertinggal, 12306 mengizinkan sekali ganti gratis ke kereta searah hari yang sama sebelum 24.00 bila kursi masih ada; cadangannya C326 22.05, tiba di Dali 23.42 (jadwal Ctrip Juli 2026, cek di 12306).', link: {label:'Pesan di Trip.com',url:'https://id.trip.com/trains/china/route/lijiang-to-dali/'} },
    { title: 'Bekal halal', text: 'Bawa bekal halal untuk sarapan, makan siang, dan makan malam; tidak ada waktu mampir kota tua sebelum kereta, dan tiba di Dali sudah larut.' },
  ],
  pages: [3, 23, 24, 28, 30],
  sourceNote: 'Itinerary web diperbarui 5 November: Blue Moon Valley pindah ke pagi 19 November, Impression Lijiang ke sesi 13.20, dan Glacier Park ke slot kereta gantung sore. Impression Lijiang tetap agenda wajib; PDF tetap tersedia sebagai arsip rute awal.',
 },
 {date:'2026-11-20',title:'Danau Erhai & Kota Tua Dali',shortTitle:'Erhai, Dali & Kunming',region:'Yunnan',route:['Caicun','Danau Erhai','Kota Tua Dali','Kunming'],overnight:{name:'Kunming',area:'Kawasan Shuncheng',elevation:'1.900 m',detail:'Malam terakhir dekat kawasan makan halal, sebelum penerbangan besok.'},transport:'Taksi lokal, jalan kaki, kereta 2–3 jam',intro:'Pagi di tepi danau, siang di kota tua, sore berangkat ke Kunming.',events:[t('car','Hotel ke Dermaga Caicun','Sekitar 3–4 km dari gerbang timur kota tua.'),s('erhai','Pagi','Mulai dari Dermaga Caicun di tepi barat Erhai.'),s('caicun','Pagi'),t('car','Kembali ke Kota Tua Dali'),s('wuhua','±10.45–12.15','Foto menara dari jalan dan telusuri gang kota tua; naik hanya bila aksesnya dibuka.'),s('dali-old-town','±12.15–16.05','Salat Jumat ±12.15–14.00 tanpa terburu-buru, makan siang halal di Bo’ai Road, lalu Gerbang Selatan dan tembok kota dalam cahaya sore.'),t('car','Ambil koper, lalu ke Stasiun Dali','Asar ±16.10, ambil koper, lalu taksi sekitar 17 km ke 大理站 di Xiaguan, 30–40 menit. Tiba ±40 menit sebelum kereta.'),t('train','Dali ke Kunming','D8704 17.42, turun di 昆明站 pukul 19.49; kereta ini lanjut ke 昆明南站 (20.12). Kelas dua CNY 145. Beli dua kursi; dijual mulai 6 November 15.15 WIB.','Perlu konfirmasi'),s('kunming-station','19.49','Turun di sini, bukan di 昆明南站. Foto memperlihatkan Stasiun Kunming di pusat kota.'),t('car','Lanjut ke penginapan di Shuncheng'),s('shuncheng','Malam'),s('nancheng','Malam','Patokan kawasan makan halal, bukan lokasi salat Jumat hari ini.')],practical:[{title:'Salat Jumat di Dali',text:'Minta hotel mengonfirmasi masjid dan waktu setempat sejak malam sebelumnya. Sisihkan waktu siang sebelum ke stasiun.'},{title:'Nama tempat untuk Amap',text:'Dermaga Caicun adalah titik mulai perjalanan pagi di tepi barat Erhai.',copy:'才村码头'},{title:'Stasiun kedatangan',text:'D8704 berhenti di 昆明站 pukul 19.49, lalu lanjut ke 昆明南站 di Chenggong. Turun di 昆明站, lalu taksi ke Shuncheng; resepsionis Totoro buka sampai 24.00.',link:{label:'Pesan di Trip.com',url:'https://id.trip.com/trains/china/route/dali-to-kunming/'}},{title:'Makan halal',text:'Bo’ai Road di Dali untuk siang; kawasan Shuncheng dan Masjid Nancheng di Kunming untuk malam.'}],pages:[3,23,25,26,28,29,30]},
 {date:'2026-11-21',title:'Pagi terakhir, pulang ke Jakarta',shortTitle:'Kunming & penerbangan pulang',region:'Yunnan',route:['Kunming','Changshui (KMG)','Jakarta'],overnight:null,transport:'Transfer bandara dan penerbangan',intro:'Jadwal pagi mengikuti tiket pulang; tidak ada sambungan kereta antarkota hari ini.',events:[s('shuncheng','Pagi','Sarapan jika jadwal penerbangan memungkinkan.','Opsional'),s('green-lake','Pagi','Sekitar 1½ jam bila pesawat ±14.30 atau lebih siang, 45 menit bila ±12.00–14.30. Bila lebih pagi, langsung ke bandara.','Opsional'),t('car','Hotel ke Bandara Changshui','Atur transfer sesuai jam tiket dan ketentuan check-in maskapai.','Perlu konfirmasi'),s('kmg','Sesuai tiket','Jam penerbangan pulang belum tercatat di situs; ikuti tiket.','Perlu konfirmasi'),t('plane','KMG ke Jakarta','Jadwal dan kemungkinan transit mengikuti tiket yang dipesan.','Perlu konfirmasi')],practical:[{title:'Jam pulang belum tercantum',text:'PDF menetapkan kepulangan 21 November, tanpa jam keberangkatan terkonfirmasi. Periksa tiket sebelum merencanakan Green Lake.'},{title:'Penerbangan',text:'PDF menyebut penerbangan langsung belum tentu tersedia tanggal ini; alternatif transit perlu diperiksa saat memesan.'},{title:'Sarapan halal',text:'Kawasan Shuncheng dapat menjadi tempat sarapan terakhir jika jadwal memungkinkan.'}],pages:[3,23,27,28,30]},
];
export const daysByDate = new Map(days.map((day) => [day.date, day]));
// Highlights point to stops in the current website itinerary; each image may show the wider destination.
/** `calm` marks a place only the calm option visits: its links open the calm itinerary instead of the homepage day. */
export interface Highlight { place: string; date: string; region: 'Sichuan' | 'Yunnan'; title: string; caption: string; photo?: string; alt?: string; calm?: boolean }
export const highlights: Highlight[] = [
 {place:'five-flower',date:'2026-11-09',region:'Sichuan',title:'Jiuzhaigou',caption:'Danau jernih, hutan penuh warna.',photo:"highlight-jiuzhaigou",alt:"Danau di Jiuzhaigou memantulkan hutan musim gugur dan pegunungan."},
 {place:'huanglong',date:'2026-11-11',region:'Sichuan',title:'Huanglong',caption:'Teras kolam travertin toska di kaki puncak salju.',calm:true},
 {place:'songzanlin',date:'2026-11-18',region:'Yunnan',title:'Shangri-La',caption:'Atap emas Biara Songzanlin di atas bukit.'},
 {place:'bipenggou',date:'2026-11-11',region:'Sichuan',title:'Bipenggou',caption:'Larch keemasan dan danau tenang di bawah puncak granit.'},
 {place:'dayan',date:'2026-11-18',region:'Yunnan',title:'Kota Tua Lijiang',caption:'Atap kota tua, kanal, dan pegunungan di kejauhan.',photo:'highlight-lijiang',alt:'Panorama atap Kota Tua Lijiang dengan pegunungan bersalju di kejauhan.'},
 {place:'maobiliang',date:'2026-11-11',region:'Sichuan',title:'Siguniangshan',caption:'Empat puncak, satu panorama.',photo:"highlight-siguniang",alt:"Jajaran pegunungan Siguniangshan, dipotret pada 14 Oktober 2026."},
 {place:'impression-lijiang',date:'2026-11-19',region:'Yunnan',title:'Impression Lijiang',caption:'Panggung merah, nyanyian, dan latar pegunungan salju.',photo:'user-impression-lijiang-2',alt:'Barisan penampil di panggung merah Impression Lijiang dengan puncak Jade Dragon Snow Mountain dan langit biru.'},
 {place:'tagong',date:'2026-11-12',region:'Sichuan',title:'Tagong',caption:'Padang terbuka di kaki Gunung Yala.'},
 {place:'blue-moon',date:'2026-11-19',region:'Yunnan',title:'Blue Moon Valley',caption:'Pagi di tepi air toska.',photo:"highlight-blue-moon",alt:"Danau toska Blue Moon Valley di bawah pegunungan Jade Dragon."},
 {place:'luorong',date:'2026-11-16',region:'Sichuan',title:'Yading',caption:'Menyusuri padang di antara puncak salju.'},
 {place:'erhai',date:'2026-11-20',region:'Yunnan',title:'Danau Erhai',caption:'Pagi yang pelan di tepi danau.',photo:"highlight-erhai",alt:"Danau Erhai dan siluet pegunungan di seberangnya."},
 {place:'dali-old-town',date:'2026-11-20',region:'Yunnan',title:'Kota Tua Dali',caption:'Gerbang megah, atap kota tua, dan gang untuk dijelajahi.',photo:'highlight-dali',alt:'Gerbang selatan Kota Tua Dali diterangi cahaya keemasan di bawah langit biru malam.'},
];
export const bookingOptions = [
 {title:'Mobil privat satu arah',description:'Sesuai rute utama: 10–17 November, hotel Jiuzhaigou ke Dukezong. Minta harga total delapan hari, lintas provinsi, biaya satu arah, dan biaya sopir secara tertulis.',url:'https://www.klook.com/en-US/activity/127159-chengdu-jiuzhaigou-daocheng-yading-zuoergai-grassland-western-sichuan-multi-day-chartered-tour/'},
 {title:'Paket grup enam hari',description:'Alternatif dengan jadwal berbeda, kembali ke Chengdu. Keberangkatan 9 November berbenturan dengan hari Jiuzhaigou; bukan bagian rute utama.',url:'https://www.klook.com/en-US/activity/114438-new-sichuan-west-ring-road-mount-siguniang-sunset-at-yuzixi-daocheng/'},
 {title:'Paket dari sisi Yunnan',description:'Alternatif arah terbalik menuju Yading. Hanya relevan jika urutan perjalanan diubah; cek rute dan harga solo.',url:'https://www.klook.com/en-US/activity/153488-yunnan-yhangri-la-grand-loop-6-days-5-nights-tour/'},
];

// PHOTO_DATA_START
export const photos: Record<string, Photo> = {
  'impression-lijiang': {
    id: 'impression-lijiang', width: 6720, height: 4480, sizes: [480, 960, 1440],
    author: 'JIN Qin', source: 'https://unsplash.com/photos/a-group-of-people-standing-on-top-of-a-red-structure-OXeuIsqPvUM',
    license: 'Unsplash License', licenseUrl: 'https://unsplash.com/license', origin: 'Unsplash',
    photoNote: 'Pertunjukan Impression Lijiang di panggung merah terbuka dengan latar Jade Dragon Snow Mountain. Dipublikasikan 22 Mei 2023; tanggal pengambilan tidak tersedia. Foto arsip, bukan konfirmasi kondisi November 2026.',
  },
  "commons-chengdu-south": {
    "id": "commons-chengdu-south", "width": 1440, "height": 961, "sizes": [480, 960, 1440],
    "author": "Siyuwj", "source": "https://commons.wikimedia.org/wiki/File:Chengdunan_Railway_Station_at_night,_2017-09-18.jpg",
    "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "origin": "Wikimedia Commons",
    "photoNote": "Gedung Stasiun Chengdu South pada malam hari. Diambil 18 September 2017; Trip.com tidak punya foto stasiun ini."
  },
  "commons-dali-station": {
    "id": "commons-dali-station", "width": 1440, "height": 810, "sizes": [480, 960, 1440],
    "author": "瑞丽江的河水", "source": "https://commons.wikimedia.org/wiki/File:%E5%A4%A7%E7%90%86%E7%AB%99_-_%E8%88%AA%E6%8B%8D_-_2024-10-13.jpg",
    "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "origin": "Wikimedia Commons",
    "photoNote": "Foto udara Stasiun Dali (Xiaguan) saat area depannya masih dibangun. Diambil 13 Oktober 2024; Trip.com tidak punya foto stasiun ini."
  },
  "commons-kmg": {
    "id": "commons-kmg", "width": 1440, "height": 960, "sizes": [480, 960, 1440],
    "author": "Zhangmoon618", "source": "https://commons.wikimedia.org/wiki/File:Kunming_new_airport_terminal_2012-9-26.jpg",
    "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/", "origin": "Wikimedia Commons",
    "photoNote": "Jalur antar keberangkatan terminal Bandara Changshui. Diambil 26 September 2012; Trip.com tidak punya foto bandara ini."
  },
  ...chengduGuidePhotos,
  ...tripcomPhotos,
  ...northernGuidePhotos,
  ...westernGuidePhotos,
  "highlight-lijiang": {
    "id": "highlight-lijiang",
    "width": 5464,
    "height": 3640,
    "sizes": [
      480,
      960,
      1440
    ],
    "author": "Franklin David",
    "source": "https://www.pexels.com/photo/town-in-china-10670163/",
    "license": "Pexels License",
    "licenseUrl": "https://www.pexels.com/license/",
    "origin": "Pexels",
    "photoNote": "Panorama Kota Tua Lijiang dengan pegunungan di kejauhan. Foto arsip, diambil 28 Februari 2017 dan diterbitkan 28 Desember 2021."
  },
  "highlight-dali": {
    "id": "highlight-dali",
    "width": 5380,
    "height": 3587,
    "sizes": [
      480,
      960,
      1440
    ],
    "author": "fei wang",
    "source": "https://www.pexels.com/photo/facade-of-an-illuminated-temple-14321312/",
    "license": "Pexels License",
    "licenseUrl": "https://www.pexels.com/license/",
    "origin": "Pexels",
    "photoNote": "Gerbang selatan Kota Tua Dali pada malam hari, bukan Menara Wuhua. Tanggal pengambilan tidak tersedia; foto tidak menyatakan waktu kunjungan."
  },
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
  "bipenggou": {
    "id": "bipenggou",
    "width": 3648,
    "height": 2736,
    "sizes": [
      480,
      960,
      1600
    ],
    "author": "geoff leng",
    "source": "https://commons.wikimedia.org/wiki/File:%E6%AF%95%E6%A3%9A%E6%B2%9F.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "origin": "Wikimedia Commons",
    "photoNote": "Danau di kawasan Danau Panyang dan Teluk Bulan, Bipenggou, 6 Oktober 2019. Foto arsip, bukan kondisi November 2026."
  }
};
// PHOTO_DATA_END

export interface UserPhoto { id: string; width: number; height: number; sizes: number[]; sourceFilename: string; alt: string; title: string; caption: string; credit: string; origin: string; takenAt: null; location: string | null; provenanceFilename?: string; }
export const userPhotos: Record<string, UserPhoto> = {
  "user-impression-lijiang-1": {
    "id": "user-impression-lijiang-1",
    "width": 1200,
    "height": 797,
    "sizes": [
      480,
      960,
      1200
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-b6a0180b-c1d2-4cdf-903b-727ba567760e.png",
    "alt": "Pemandangan lebar pertunjukan Impression Lijiang: penampil di panggung merah bertingkat, penonton di bagian depan, serta puncak bersalju di bawah awan putih.",
    "credit": "Foto yang dikirim pengguna",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Impression Lijiang, Yulong, Lijiang",
    "title": "Panggung merah di kaki gunung",
    "caption": "Penampil memenuhi teras merah Impression Lijiang, dengan penonton di depan dan Jade Dragon Snow Mountain di balik awan."
  },
  "user-impression-lijiang-2": {
    "id": "user-impression-lijiang-2",
    "width": 1200,
    "height": 796,
    "sizes": [
      480,
      960,
      1200
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-cded2887-c282-450a-8f0c-a2aa87e459ba.png",
    "alt": "Barisan penampil membentang di teras merah dan jembatan panggung Impression Lijiang, dengan pegunungan bersalju dan langit biru di belakangnya.",
    "credit": "Foto yang dikirim pengguna",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Impression Lijiang, Yulong, Lijiang",
    "title": "Impression Lijiang di bawah langit biru",
    "caption": "Barisan penampil di panggung merah terbuka dengan latar puncak Jade Dragon Snow Mountain dan langit biru."
  },
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
    "caption": "Bipenggou, lokasi dikonfirmasi pengguna. Dikunjungi pagi 11 November."
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
    "caption": "Bipenggou, lokasi dikonfirmasi pengguna. Dikunjungi pagi 11 November."
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
    "caption": "Bipenggou, lokasi dikonfirmasi pengguna. Dikunjungi pagi 11 November."
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
  },
  "user-autumn-13": {
    "id": "user-autumn-13",
    "width": 1248,
    "height": 1664,
    "sizes": [
      480,
      960,
      1248
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-f07d44e2-252c-4fcd-893c-d19cb8f901a5.png",
    "alt": "Ranting daun merah membingkai danau tenang yang memantulkan lereng berhutan dan puncak bersalju.",
    "credit": "Kiriman pengguna; fotografer tidak diketahui",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Bipenggou",
    "title": "Bingkai daun merah",
    "caption": "Bipenggou, lokasi menurut pengguna. Dikunjungi pagi 11 November."
  },
  "user-autumn-14": {
    "id": "user-autumn-14",
    "width": 1240,
    "height": 1794,
    "sizes": [
      480,
      960,
      1240
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-be0bc18c-846a-4cff-99d8-4291dba6b3ef.png",
    "alt": "Jalur papan kayu menyusuri padang rumput hijau dan kolam kecil yang memantulkan puncak granit runcing.",
    "credit": "Kiriman pengguna; fotografer tidak diketahui",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Bipenggou",
    "title": "Jalur kayu di bawah puncak granit",
    "caption": "Bipenggou, lokasi menurut pengguna. Dikunjungi pagi 11 November."
  },
  "user-autumn-15": {
    "id": "user-autumn-15",
    "width": 1320,
    "height": 1724,
    "sizes": [
      480,
      960,
      1320
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-d12cfd70-3af8-410a-bbc4-90c46878ce49.png",
    "alt": "Daun maple merah terang menggantung di atas danau toska yang memantulkan lereng hutan dan awan.",
    "credit": "Kiriman pengguna; fotografer tidak diketahui",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Bipenggou",
    "title": "Maple merah di tepi danau",
    "caption": "Bipenggou, lokasi menurut pengguna. Dikunjungi pagi 11 November."
  },
  "user-autumn-16": {
    "id": "user-autumn-16",
    "width": 1320,
    "height": 1725,
    "sizes": [
      480,
      960,
      1320
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-7ad3f8c9-22d2-44af-914a-5d12ffdf53fd.png",
    "alt": "Puncak bersalju berbentuk piramida menjulang di atas hutan cemara dan barisan larch kuning di tepi danau hijau yang berkilau.",
    "credit": "Kiriman pengguna; fotografer tidak diketahui",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Bipenggou",
    "title": "Piramida salju di atas danau",
    "caption": "Bipenggou, lokasi menurut pengguna. Dikunjungi pagi 11 November."
  },
  "user-autumn-17": {
    "id": "user-autumn-17",
    "width": 1080,
    "height": 1616,
    "sizes": [
      480,
      960,
      1080
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-ff1ca178-1032-4c38-8a85-4fe6d11b9fc6.png",
    "alt": "Gunung batu berselimut salju tipis di atas barisan larch jingga dan danau berpagar kayu yang ramai pengunjung.",
    "credit": "Kiriman pengguna; fotografer tidak diketahui",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Bipenggou",
    "title": "Larch jingga di kaki gunung",
    "caption": "Bipenggou, lokasi menurut pengguna. Dikunjungi pagi 11 November."
  },
  "user-autumn-18": {
    "id": "user-autumn-18",
    "width": 1080,
    "height": 1616,
    "sizes": [
      480,
      960,
      1080
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-6cdf12b0-60fa-4e6d-bd67-afa9c9405027.png",
    "alt": "Puncak runcing bersalju dan hutan larch keemasan terpantul di danau hijau tua.",
    "credit": "Kiriman pengguna; fotografer tidak diketahui",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Bipenggou",
    "title": "Emas di danau hijau",
    "caption": "Bipenggou, lokasi menurut pengguna. Dikunjungi pagi 11 November."
  },
  "user-autumn-19": {
    "id": "user-autumn-19",
    "width": 1080,
    "height": 1616,
    "sizes": [
      480,
      960,
      1080
    ],
    "sourceFilename": "becac626-86cb-437f-a03d-689af209a72f-79bc8d5f-71f5-4137-a400-add8edbfbfe4.png",
    "alt": "Puncak piramida bersalju dengan awan kecil di lerengnya, di atas pucuk-pucuk larch keemasan.",
    "credit": "Kiriman pengguna; fotografer tidak diketahui",
    "origin": "Unggahan pengguna",
    "takenAt": null,
    "location": "Bipenggou",
    "title": "Puncak piramida",
    "caption": "Bipenggou, lokasi menurut pengguna. Dikunjungi pagi 11 November."
  }
};
