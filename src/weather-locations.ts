export interface WeatherLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  source: string;
  note?: string;
}

// Coordinates were verified on 2026-11-03; provenance is in source/weather-locations.json.
// Each point represents the named town or area, never an entire mountain route.
export const weatherLocations: Record<string, WeatherLocation> = {
  chengdu: {
    id: 'chengdu', name: 'Chengdu', latitude: 30.66667, longitude: 104.06667,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=1815286&language=en',
    note: 'Acuan pusat kota Chengdu, bukan lokasi hotel tertentu.',
  },
  dujiangyan: {
    id: 'dujiangyan', name: 'Dujiangyan · Zhongshu Ge', latitude: 30.9582302, longitude: 103.6218853,
    source: 'https://www.openstreetmap.org/node/8071545317',
    note: 'Titik toko buku Zhongshu Ge di mal Sunac, barat daya pusat kota Dujiangyan. Kunjungannya di dalam ruangan; suhu ini untuk perjalanan pergi dan pulang.',
  },
  jiuzhaigou: {
    id: 'jiuzhaigou', name: 'Jiuzhaigou · Zhangzha', latitude: 33.29597, longitude: 103.86495,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=1793060&language=en',
    note: 'Acuan area menginap Zhangzha dekat pintu taman; suhu danau dan lembah di dalam taman dapat berbeda.',
  },
  bipenggou: {
    id: 'bipenggou', name: 'Bipenggou · gerbang', latitude: 31.4155, longitude: 102.9849,
    source: 'https://www.openstreetmap.org/way/1351805644',
    note: 'Acuan pusat pengunjung di mulut lembah sekitar 2.250 m; Danau Panyang sekitar 3.680 m jauh lebih dingin.',
  },
  rilong: {
    id: 'rilong', name: 'Rilong · Siguniangshan', latitude: 30.99537, longitude: 102.82925,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=6999083&language=en',
    note: 'Acuan kota Rilong, area menginap Siguniangshan; suhu Maobiliang dan puncak gunung dapat berbeda.',
  },
  danba: {
    id: 'danba', name: 'Danba · Zhanggu', latitude: 30.86875, longitude: 101.88848,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=1785258&language=en',
    note: 'Acuan kota Danba di lembah; Desa Jiaju di lereng dapat memiliki kondisi berbeda.',
  },
  bamei: {
    id: 'bamei', name: 'Bamei', latitude: 30.48448, longitude: 101.48243,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=1798278&language=en',
    note: 'Acuan kota Bamei dekat Moshi Park; kondisi di taman batu dapat berbeda.',
  },
  tagong: {
    id: 'tagong', name: 'Tagong', latitude: 30.32389, longitude: 101.53058,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=1804125&language=en',
    note: 'Acuan kota Tagong untuk padang rumput dan kawasan Muya; angin di lahan terbuka dapat berbeda.',
  },
  xinduqiao: {
    id: 'xinduqiao', name: 'Xinduqiao', latitude: 30.04525, longitude: 101.48876,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=1789093&language=en',
    note: 'Acuan kota dan area menginap Xinduqiao; Zheduo Pass dapat memiliki suhu berbeda.',
  },
  kangding: {
    id: 'kangding', name: 'Kangding', latitude: 30.00222, longitude: 101.9569,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=1802171&language=en',
    note: 'Acuan pusat kota Kangding di lembah, bukan celah pegunungan di sekitarnya.',
  },
  jiagenba: {
    id: 'jiagenba', name: 'Jiagenba', latitude: 29.84597, longitude: 101.58858,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=6976290&language=en',
    note: 'Acuan permukiman Jiagenba; suhu dan angin Zimei Pass yang lebih tinggi dapat berbeda.',
  },
  yajiang: {
    id: 'yajiang', name: 'Yajiang · Hekou', latitude: 30.03477, longitude: 101.01345,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=1808573&language=en',
    note: 'Acuan kota Yajiang untuk lintasan G318; bukan suhu Gaoersi Pass atau Tianlu 18 Bends.',
  },
  litang: {
    id: 'litang', name: 'Litang · Gaocheng', latitude: 29.98814, longitude: 100.2694,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=1810604&language=en',
    note: 'Acuan kota Litang dan area menginap, bukan seluruh dataran tinggi di sekitarnya.',
  },
  daocheng: {
    id: 'daocheng', name: 'Daocheng · Jinzhu', latitude: 29.03921, longitude: 100.29694,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=6547110&language=en',
    note: 'Acuan kota Daocheng; Haizi Shan dan Sister Lakes yang lebih tinggi dapat memiliki kondisi berbeda.',
  },
  riwa: {
    id: 'riwa', name: 'Riwa · Shangri-La Town, Sichuan', latitude: 28.5618353, longitude: 100.3481193,
    source: 'https://www.openstreetmap.org/node/1808141658',
    note: 'Acuan area menginap Riwa di Sichuan, berbeda dari kota Shangri-La di Yunnan. Suhu jalur Yading dapat berbeda.',
  },
  'yading-village': {
    id: 'yading-village', name: 'Desa Yading', latitude: 28.4556, longitude: 100.338,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=10211775&language=en',
    note: 'Acuan Desa Yading; bukan suhu Luorong, Milk Lake, Five Colour Lake, atau puncak gunung.',
  },
  xiangcheng: {
    id: 'xiangcheng', name: 'Xiangcheng · Sangpi', latitude: 28.93391, longitude: 99.79991,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=8608938&language=en',
    note: 'Acuan kota Xiangcheng; lintasan Daxueshan yang lebih tinggi dapat memiliki kondisi berbeda.',
  },
  'shangri-la': {
    id: 'shangri-la', name: 'Shangri-La, Yunnan', latitude: 27.82511, longitude: 99.70779,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=7910932&language=en',
    note: 'Acuan kota Shangri-La untuk Dukezong dan Songzanlin; berbeda dari Riwa di Sichuan.',
  },
  lijiang: {
    id: 'lijiang', name: 'Lijiang', latitude: 26.86879, longitude: 100.22072,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=1813253&language=en',
    note: 'Acuan kota dan area menginap Lijiang, bukan suhu Jade Dragon Snow Mountain.',
  },
  ganhaizi: {
    id: 'ganhaizi', name: 'Ganhaizi · kaki Jade Dragon', latitude: 27.1006879, longitude: 100.2564517,
    source: 'https://www.openstreetmap.org/way/1000080741',
    note: 'Acuan area teater Impression Lijiang di Ganhaizi; suhu Glacier Park dan Blue Moon Valley dapat berbeda.',
  },
  huanglong: {
    id: 'huanglong', name: 'Huanglong, Songpan', latitude: 32.7571, longitude: 103.82939,
    source: 'https://www.openstreetmap.org/?mlat=32.7571&mlon=103.82939#map=14/32.7571/103.8294',
    note: 'Acuan kawasan Huanglong; Five-Colour Pool di ujung atas jalur sekitar 3.576 m bisa jauh lebih dingin.',
  },
  'upper-gorge': {
    id: 'upper-gorge', name: 'Upper Tiger Leaping Gorge', latitude: 27.1926037, longitude: 100.112808,
    source: 'https://www.openstreetmap.org/?mlat=27.1926037&mlon=100.112808#map=15/27.1926/100.1128',
    note: 'Acuan area pengunjung Upper Gorge di sisi Shangri-La; dasar ngarai lebih rendah dan bisa lebih hangat.',
  },
  'tea-horse': {
    id: 'tea-horse', name: 'Tea Horse Guesthouse', latitude: 27.2098777, longitude: 100.1112355,
    source: 'https://www.openstreetmap.org/way/523179408',
    note: 'Titik penginapan 茶马客栈 di OpenStreetMap; dipakai untuk pin Amap.',
  },
  moye: {
    id: 'moye', name: 'MoYe, Jembatan Shenchuan', latitude: 27.2581504, longitude: 100.1581967,
    source: 'https://www.openstreetmap.org/way/138570589',
    note: 'Titik Jembatan Shenchuan (神川大桥) di OpenStreetMap; hotel MoYe menulis alamatnya "di samping Jembatan Shenchuan".',
  },
  dali: {
    id: 'dali', name: 'Kota Tua Dali', latitude: 25.68863, longitude: 100.15894,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=12277235&language=en',
    note: 'Acuan kota tua dan area menginap Dali; angin di tepian Erhai dapat berbeda.',
  },
  kunming: {
    id: 'kunming', name: 'Kunming', latitude: 25.03889, longitude: 102.71833,
    source: 'https://geocoding-api.open-meteo.com/v1/get?id=1804651&language=en',
    note: 'Acuan pusat kota Kunming untuk Shuncheng dan Green Lake, bukan lokasi bandara.',
  },
};

export const weatherLocationForGuide: Record<string, string> = {
  chengdu: 'chengdu',
  'chengdu-skp-tower': 'chengdu',
  'zhongshuge-bookstore': 'dujiangyan',
  'upper-tiger-leaping-gorge': 'upper-gorge',
  jiuzhaigou: 'jiuzhaigou',
  huanglong: 'huanglong',
  bipenggou: 'bipenggou',
  siguniangshan: 'rilong',
  'moshi-park': 'bamei',
  tagong: 'tagong',
  xinduqiao: 'xinduqiao',
  kangding: 'kangding',
  'zheduo-pass': 'xinduqiao',
  zimei: 'jiagenba',
  g318: 'yajiang',
  litang: 'litang',
  'haizi-shan': 'daocheng',
  daocheng: 'daocheng',
  yading: 'yading-village',
  xiangcheng: 'xiangcheng',
  dukezong: 'shangri-la',
  songzanlin: 'shangri-la',
  lijiang: 'lijiang',
  'jade-dragon': 'ganhaizi',
  'impression-lijiang': 'ganhaizi',
  'blue-moon-valley': 'ganhaizi',
  erhai: 'dali',
  dali: 'dali',
  'kunming-old-town': 'kunming',
  'green-lake': 'kunming',
};
