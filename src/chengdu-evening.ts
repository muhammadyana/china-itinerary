import { escapeHtml, icon } from './render.ts';
import { placePath } from './guides.ts';

export const CHENGDU_EVENING_DATE = '2026-11-08';
export const CHENGDU_EVENING_CHECKED_AT = '2026-11-05';

interface EveningSource {
  label: string;
  url: string;
}

interface EveningMall {
  id: string;
  name: string;
  chineseName: string;
  nearby: boolean;
  /** The itinerary's fixed stop for this evening; the other malls are fallbacks. */
  planned?: boolean;
  appeal: string;
  address: string;
  route: string;
  hours: string;
  hoursNote: string;
  hoursSources: EveningSource[];
  locationSource: EveningSource;
  guide?: { label: string; href: string };
}

export const chengduEveningMalls: readonly EveningMall[] = [
  {
    id: 'chengdu-skp',
    name: 'Chengdu SKP',
    chineseName: '成都SKP',
    nearby: false,
    planned: true,
    appeal: 'Lokasi Menara Vitality (生机之塔), pemberhentian wajib malam ini: enam tiang air di taman terbuka mal mewah ini, dengan lampu cincin yang menyala setelah gelap.',
    address: 'North Section of Tianfu Avenue, Gaoxin',
    route: 'DiDi sekitar 12,5 km dari hotel di Chunxi Road ke 成都SKP 生机之塔, ±15 menit tanpa macet. Metro: jalur 1 ke 锦城广场, atau jalur 18 ke 锦城广场东 pintu B yang paling dekat.',
    hours: '10.00–22.00 setiap hari',
    hoursNote: 'Jam Senin–Minggu dipublikasikan langsung oleh pengelola SKP. Taman dan menara buka sepanjang hari menurut Trip.com.',
    hoursSources: [
      { label: 'Jam & alamat: SKP resmi', url: 'https://skp-beijing.com/shop?c=chengdu' },
      { label: 'Jam: Trip.com Chengdu SKP Grand Steps', url: 'https://www.trip.com/travel-guide/attraction/chengdu/chengdu-skp-grand-steps-150184535/' },
    ],
    locationSource: { label: 'Lokasi: SKP resmi', url: 'https://skp-beijing.com/shop?c=chengdu' },
    guide: { label: 'Panduan Menara Vitality', href: placePath('chengdu-skp-tower') },
  },
  {
    id: 'chengdu-ifs',
    name: 'Chengdu IFS',
    chineseName: '成都国际金融中心',
    nearby: true,
    appeal: 'Panda ikonik di fasad gedung, butik, dan tempat makan dalam satu kompleks.',
    address: 'No. 1, Section 3, Hongxing Road, Jinjiang',
    route: 'Lanjut jalan kaki dari kawasan Chunxi Road menuju Hongxing Road. Cocok dipasangkan dengan Taikoo Li tanpa berpindah kawasan.',
    hours: 'Acuan 10.00–22.00',
    hoursNote: 'Jadwal harian tenant Hublot; jam toko lain dan akses teras panda dapat berbeda.',
    hoursSources: [{ label: 'Jam tenant: Hublot IFS', url: 'https://www.hublot.com/en-us/boutiques/hublot-boutique-chengdu' }],
    locationSource: { label: 'Lokasi: pengembang Wharf', url: 'https://www.wharfholdings.com/storage/fm/PresentationAndOther/2018-08/post-demerger-wharf-presentation.pdf' },
  },
  {
    id: 'taikoo-li',
    name: 'Taikoo Li Chengdu',
    chineseName: '成都太古里',
    nearby: true,
    appeal: 'Kompleks belanja terbuka dengan gang pedestrian, atap khas Sichuan, butik, dan kafe.',
    address: 'No. 8, Middle Shamao Street, Jinjiang',
    route: 'Masih di kawasan Chunxi Road, dekat IFS. Akses metro melalui Chunxi Road, jalur 2 dan 3; lanjut jalan kaki mengikuti penunjuk Taikoo Li.',
    hours: 'Toko sekitar 10.00–22.00',
    hoursNote: 'Jam berbeda per tenant: drivepro mencantumkan 10.00–22.00; Apple dapat tutup 22.30 pada akhir pekan. Ini bukan jam seluruh area terbuka.',
    hoursSources: [
      { label: 'Jam tenant: drivepro', url: 'https://www.taikooli-chengdu.com/zh-cn/shopping/drivepro' },
      { label: 'Jam tenant: Apple Taikoo Li', url: 'https://www.apple.com.cn/retail/taikoolichengdu/' },
    ],
    locationSource: { label: 'Akses: Taikoo Li resmi', url: 'https://www.taikooli-chengdu.com/en/AboutUs/ArrivalPattern' },
  },
  {
    id: 'chengdu-mixc',
    name: 'Chengdu MixC',
    chineseName: '成都万象城',
    nearby: false,
    appeal: 'Alternatif pusat belanja di luar Chunxi Road, dengan beragam toko dan pilihan makan malam.',
    address: 'No. 8, Shuangqing Road, Chenghua',
    route: 'Pesan DiDi atau taksi ke 成都万象城 di 双庆路8号. Periksa rute aktual dari posisi terakhir di Chunxi Road.',
    hours: 'Acuan Minggu 10.00–22.00',
    hoursNote: 'Mengikuti jadwal Minggu yang dipublikasikan Apple MixC, bukan konfirmasi jam seluruh mal pada 8 November.',
    hoursSources: [{ label: 'Jam & alamat: Apple MixC', url: 'https://www.apple.com.cn/retail/mixcchengdu/' }],
    locationSource: { label: 'Lokasi: Amap', url: 'https://ditu.amap.com/place/B0FFHXKX9F' },
  },
  {
    id: 'global-center',
    name: 'New Century Global Center',
    chineseName: '环球中心',
    nearby: false,
    appeal: 'Kompleks besar untuk belanja dan rekreasi; pilih jika memang ingin menuju area selatan kota.',
    address: 'No. 1700, North Section of Tianfu Avenue, Gaoxin',
    route: 'Pesan DiDi atau taksi ke 环球中心 di 天府大道北段1700号. Ini alternatif area kunjungan, bukan tambahan wajib setelah IFS dan Taikoo Li.',
    hours: 'Acuan 10.00–22.00',
    hoursNote: 'Jadwal pada listing Trip.com; belum dikonfirmasi langsung oleh pengelola untuk tanggal kunjungan.',
    hoursSources: [{ label: 'Jam & alamat: Trip.com', url: 'https://you.ctrip.com/sight/chengdu104/1483118.html' }],
    locationSource: { label: 'Lokasi: Trip.com', url: 'https://you.ctrip.com/sight/chengdu104/1483118.html' },
  },
];

function sourceLink(source: EveningSource): string {
  return `<a class="chengdu-evening-source" href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}${icon('share')}<span class="visually-hidden"> (buka tab baru)</span></a>`;
}

function renderMall(mall: EveningMall): string {
  const mapUrl = `https://uri.amap.com/search?keyword=${encodeURIComponent(mall.chineseName)}&city=${encodeURIComponent('成都')}&view=map`;
  const separateLocationSource = !mall.hoursSources.some(source => source.url === mall.locationSource.url);

  const label = mall.planned ? 'Wajib malam ini' : mall.nearby ? 'Dekat Chunxi Road' : 'Alternatif kawasan';
  const guideLink = mall.guide ? `<a class="text-link chengdu-evening-guide" href="${escapeHtml(mall.guide.href)}">${escapeHtml(mall.guide.label)}${icon('right')}</a>` : '';

  return `<details class="chengdu-evening-card" data-evening-mall="${mall.id}"${mall.nearby || mall.planned ? ' open' : ''}>
    <summary>
      <span class="chengdu-evening-name"><span class="chengdu-evening-label">${label}</span><strong>${escapeHtml(mall.name)}</strong><span lang="zh-Hans">${escapeHtml(mall.chineseName)}</span></span>
      <span class="chengdu-evening-chevron">${icon('down')}</span>
    </summary>
    <div class="chengdu-evening-content">
      <p class="chengdu-evening-appeal">${escapeHtml(mall.appeal)}</p>
      <div class="chengdu-evening-fact"><h4>${icon('clock')}${escapeHtml(mall.hours)}</h4><p>${escapeHtml(mall.hoursNote)}</p><div class="chengdu-evening-sources">${mall.hoursSources.map(sourceLink).join('')}</div></div>
      <div class="chengdu-evening-fact"><h4>${icon('walk')}Dari Chunxi Road</h4><p>${escapeHtml(mall.route)}</p><p class="chengdu-evening-address">${escapeHtml(mall.address)}</p>${separateLocationSource ? sourceLink(mall.locationSource) : ''}${guideLink}</div>
      <a class="chengdu-evening-map" href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener noreferrer">${icon('pin')}Cari di Amap${icon('right')}<span class="visually-hidden">: ${escapeHtml(mall.name)} (buka tab baru)</span></a>
    </div>
  </details>`;
}

export function renderChengduEvening(date?: string): string {
  if (date && date !== CHENGDU_EVENING_DATE) return '';

  return `<section class="chengdu-evening" id="chengdu-evening" aria-labelledby="chengdu-evening-heading">
    <header class="chengdu-evening-header"><h3 id="chengdu-evening-heading">Malam pertama di Chengdu SKP.</h3><p class="chengdu-evening-date">Minggu, 8 November 2026</p><p>Malam ini wajib ke Menara Vitality di Chengdu SKP. IFS, Taikoo Li, MixC, dan Global Center tetap tercatat sebagai cadangan bila rencana berubah.</p></header>
    <div class="chengdu-evening-grid">${chengduEveningMalls.map(renderMall).join('')}</div>
    <div class="chengdu-evening-budget"><h4>${icon('wallet')}Anggaran malam</h4><p>Belanja dan makan dibayar sesuai pilihan. Bioskop, arena bermain, dan aktivitas lain dapat memerlukan tiket terpisah. Ongkos DiDi atau taksi mengikuti estimasi aplikasi.</p><p>Pulang ke hotel ±20.30 dan tidur sebelum 22.00. Besok DiDi 05.15 ke Chengdu East untuk kereta ke Jiuzhaigou.</p></div>
    <p class="chengdu-evening-checked">Diperiksa <time datetime="${CHENGDU_EVENING_CHECKED_AT}">5 November 2026</time>, Semua jam UTC+8. Jam tenant dan operasional 8 November dapat berubah; cek tempat pilihan sebelum berangkat.</p>
  </section>`;
}
