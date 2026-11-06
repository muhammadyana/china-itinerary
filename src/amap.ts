import { weatherLocations } from './weather-locations.ts';

// One Amap search keyword per itinerary stop and place page (keyed by place id or page slug).
// Researched and reviewed on 2026-11-05 (see "Amap links" in SOURCE-NOTES.md). Keywords were checked against
// Baidu suggestions as a proxy; Amap's own results and the app hand-off were not tested on a device.
interface AmapPlace {
  /** One Chinese name, never "A / B" and never pinyin. */
  keyword: string;
  /** County or city adcode that biases the search. */
  city: string;
  /** Verified WGS84 point from weather-locations.ts: biases the phone search, or pins a marker. */
  near?: string;
  /** Pin the `near` point instead of searching, for names that collide elsewhere in China. */
  marker?: boolean;
}

const amapPlaces: Record<string, AmapPlace> = {
  tfu: { keyword: '成都天府国际机场', city: '510100' },
  chengdu: { keyword: '春熙路', city: '510100', near: 'chengdu' },
  'chengdu-skp-tower': { keyword: '生机之塔', city: '510100' },
  // Zhongshuge is a chain with another store in Chengdu (in99); pin the Dujiangyan store's OpenStreetMap point.
  'zhongshuge-bookstore': { keyword: '钟书阁（融创茂店）', city: '510181', near: 'dujiangyan', marker: true },
  'chengdu-east': { keyword: '成都东站', city: '510100' },
  huanglongjiuzhai: { keyword: '黄龙九寨站', city: '513224' },
  jiuzhaigou: { keyword: '九寨沟风景名胜区', city: '513225', near: 'jiuzhaigou' },
  'jiuzhaigou-hotel': { keyword: '九寨沟景区游客中心', city: '513225', near: 'jiuzhaigou' },
  'five-flower': { keyword: '五花海', city: '513225', near: 'jiuzhaigou' },
  shuzheng: { keyword: '树正群海', city: '513225', near: 'jiuzhaigou' },
  bipenggou: { keyword: '毕棚沟', city: '513222', near: 'bipenggou' },
  // The weather point is the gate visitor centre itself (OSM way 1351805644), so the calm option pins it.
  'bipenggou-gate': { keyword: '毕棚沟游客中心', city: '513222', near: 'bipenggou', marker: true },
  siguniangshan: { keyword: '四姑娘山', city: '513227', near: 'rilong' },
  maobiliang: { keyword: '猫鼻梁', city: '513227', near: 'rilong' },
  // Renamed 四姑娘山镇; the old name 日隆镇 is no longer indexed.
  rilong: { keyword: '四姑娘山镇（日隆镇）', city: '513227', near: 'rilong', marker: true },
  danba: { keyword: '丹巴县', city: '513323', near: 'danba' },
  moshi: { keyword: '墨石公园', city: '513326', near: 'bamei' },
  'moshi-park': { keyword: '墨石公园', city: '513326', near: 'bamei' },
  tagong: { keyword: '塔公草原', city: '513301', near: 'tagong' },
  xinduqiao: { keyword: '新都桥镇', city: '513301', near: 'xinduqiao' },
  kangding: { keyword: '康定市', city: '513301', near: 'kangding' },
  'kangding-mosque': { keyword: '康定清真寺', city: '513301', near: 'kangding' },
  zheduo: { keyword: '折多山垭口', city: '513301' },
  'zheduo-pass': { keyword: '折多山垭口', city: '513301' },
  zimei: { keyword: '子梅垭口', city: '513301', near: 'jiagenba' },
  g318: { keyword: '天路十八弯', city: '513325' },
  gaoersi: { keyword: '高尔寺山', city: '513325' },
  tianlu: { keyword: '天路十八弯', city: '513325' },
  litang: { keyword: '理塘县', city: '513334', near: 'litang' },
  // Plain 海子山 ranks Batang's G318 pass first; the Daocheng-side viewpoint is the stop.
  haizi: { keyword: '海子山观景台', city: '513337' },
  'sister-lakes': { keyword: '姊妹湖', city: '513335' },
  daocheng: { keyword: '尊胜塔林', city: '513337', near: 'daocheng' },
  // A 香格里拉镇 search can jump to Shangri-La city in Yunnan.
  riwa: { keyword: '香格里拉镇（日瓦）', city: '513337', near: 'riwa', marker: true },
  yading: { keyword: '稻城亚丁风景区', city: '513337', near: 'yading-village' },
  zhaguanbeng: { keyword: '扎灌崩', city: '513337', near: 'yading-village' },
  chonggu: { keyword: '冲古寺', city: '513337', near: 'yading-village' },
  luorong: { keyword: '洛绒牛场', city: '513337', near: 'yading-village' },
  'milk-lake': { keyword: '牛奶海', city: '513337', near: 'yading-village' },
  'five-colour': { keyword: '五色海', city: '513337', near: 'yading-village' },
  'pearl-lake': { keyword: '卓玛拉措', city: '513337', near: 'yading-village' },
  xiangcheng: { keyword: '乡城县', city: '513336', near: 'xiangcheng' },
  daxueshan: { keyword: '大雪山垭口', city: '533401' },
  dukezong: { keyword: '独克宗古城', city: '533401', near: 'shangri-la' },
  songzanlin: { keyword: '松赞林寺', city: '533401', near: 'shangri-la' },
  'shangrila-station': { keyword: '香格里拉站', city: '533401' },
  'lijiang-station': { keyword: '丽江站', city: '530700' },
  'blue-moon': { keyword: '蓝月谷', city: '530721', near: 'ganhaizi' },
  'blue-moon-valley': { keyword: '蓝月谷', city: '530721', near: 'ganhaizi' },
  dayan: { keyword: '丽江古城', city: '530702', near: 'lijiang' },
  lijiang: { keyword: '丽江古城', city: '530702', near: 'lijiang' },
  sifangjie: { keyword: '丽江古城四方街', city: '530702', near: 'lijiang' },
  'cable-car': { keyword: '冰川公园大索道', city: '530721', near: 'ganhaizi' },
  'jade-dragon': { keyword: '玉龙雪山冰川公园', city: '530721', near: 'ganhaizi' },
  'impression-lijiang': { keyword: '印象丽江雪山剧场', city: '530721', near: 'ganhaizi', marker: true },
  'dali-station': { keyword: '大理站', city: '532901' },
  // The walk starts at Caicun; plain 洱海 ranks Erhai Park in Xiaguan first.
  erhai: { keyword: '才村码头', city: '532901', near: 'dali' },
  caicun: { keyword: '才村码头', city: '532901', near: 'dali' },
  wuhua: { keyword: '五华楼', city: '532901', near: 'dali' },
  'dali-old-town': { keyword: '大理古城', city: '532901', near: 'dali' },
  dali: { keyword: '大理古城', city: '532901', near: 'dali' },
  'kunming-station': { keyword: '昆明站', city: '530100', near: 'kunming' },
  shuncheng: { keyword: '顺城街', city: '530100', near: 'kunming' },
  'kunming-old-town': { keyword: '顺城街', city: '530100', near: 'kunming' },
  nancheng: { keyword: '南城清真寺', city: '530100', near: 'kunming' },
  'green-lake': { keyword: '翠湖公园', city: '530100', near: 'kunming' },
  kmg: { keyword: '昆明长水国际机场', city: '530100' },
  // Calm-option stops (src/calm-route.ts): OpenStreetMap names from the 5 November 2026 research, checked against
  // Baidu Map suggestions the same day. 五彩池 and 长海 also exist elsewhere; the county code keeps the Jiuzhaigou ones.
  'mirror-lake': { keyword: '镜海', city: '513225', near: 'jiuzhaigou' },
  'long-lake': { keyword: '长海', city: '513225', near: 'jiuzhaigou' },
  'five-colour-pond': { keyword: '五彩池', city: '513225', near: 'jiuzhaigou' },
  nuorilang: { keyword: '诺日朗瀑布', city: '513225', near: 'jiuzhaigou' },
  'pearl-shoals': { keyword: '珍珠滩瀑布', city: '513225', near: 'jiuzhaigou' },
  huanglong: { keyword: '黄龙风景名胜区', city: '513224' },
  songpan: { keyword: '松潘古城', city: '513224' },
  'songpan-mosque': { keyword: '松潘清真北寺', city: '513224' },
  'maoxian-station': { keyword: '茂县站', city: '513223' },
  'huangcheng-mosque': { keyword: '皇城清真寺', city: '510100', near: 'chengdu' },
  'panda-base': { keyword: '成都大熊猫繁育研究基地', city: '510100' },
  // Baidu lists the towers as 成都金融城双子塔; 天府双塔 ranks a bank in Nanchong first.
  'tianfu-twin-towers': { keyword: '成都金融城双子塔', city: '510100' },
  'chengdu-south': { keyword: '成都南站', city: '510100' },
  // 上虎跳峡 is the Shangri-La side; the Lijiang side has its own Tiger Leaping Gorge entrance.
  'upper-tiger-leaping-gorge': { keyword: '上虎跳峡', city: '533401' },
  // Both names repeat elsewhere in China, so pin the OpenStreetMap points.
  'tea-horse-guesthouse': { keyword: '茶马客栈', city: '533401', near: 'tea-horse', marker: true },
  'moye-cliff-cafe': { keyword: '墨野雪山悬崖酒店', city: '533401', near: 'moye', marker: true },
  napahai: { keyword: '纳帕海', city: '533401' },
};

// Pages covering places too far apart for one search get one link per place (Sister Lakes is 100+ km from the viewpoint).
const splitPages: Record<string, string[]> = { 'haizi-shan': ['haizi', 'sister-lakes'] };
export const amapIdsForPage = (slug: string) => splitPages[slug] ?? [slug];

// Amap writes longitude first; weather-locations stores named latitude and longitude fields.
const lonLat = (near: string) => `${weatherLocations[near].longitude},${weatherLocations[near].latitude}`;

/** Amap URI API link (https://lbs.amap.com/api/uri-api/summary): opens the app on a phone, the web map elsewhere. */
export function amapUrl(id: string): string {
  const place = amapPlaces[id];
  if (!place) throw new Error(`No Amap entry for "${id}" in src/amap.ts`);
  const name = encodeURIComponent(place.keyword);
  if (place.marker && place.near) return `https://uri.amap.com/marker?position=${lonLat(place.near)}&name=${name}&coordinate=wgs84&src=china-itinerary&callnative=1`;
  // coordinate=wgs84 makes Amap convert `center` to GCJ-02; desktop ignores both.
  const center = place.near ? `&center=${lonLat(place.near)}&coordinate=wgs84` : '';
  return `https://uri.amap.com/search?keyword=${name}&city=${place.city}${center}&view=map&src=china-itinerary&callnative=1`;
}

/** Build-time check: every id needs an entry, and every point must lie in China in lon,lat order. */
export function amapProblems(ids: Iterable<string>): string[] {
  const problems = [...new Set(ids)].filter(id => !amapPlaces[id]).map(id => `missing entry for "${id}"`);
  for (const [id, place] of Object.entries(amapPlaces)) {
    if (!/^\d{6}$/.test(place.city)) problems.push(`${id}: city must be a 6-digit adcode`);
    if (place.marker && !place.near) problems.push(`${id}: a marker needs a near point`);
    if (!place.near) continue;
    const point = weatherLocations[place.near];
    if (!point) problems.push(`${id}: unknown near point "${place.near}"`);
    else if (point.longitude < 73 || point.longitude > 136 || point.latitude < 18 || point.latitude > 54) problems.push(`${id}: point outside China`);
  }
  return problems;
}
