import { days } from './itinerary.ts';
import { weatherLocations } from './weather-locations.ts';
import { provinceShapes, riverLines } from './route-map-geo.ts';
import { escapeHtml as e, icon, siteCredit } from './render.ts';
import { planSwitch, renderSiteNavigation } from './site-navigation.ts';
import { routeMapPath } from './route-map-main.ts';

export type Mode = 'car' | 'train' | 'bus' | 'plane';
type LabelSide = 'n' | 's' | 'e' | 'w' | 'sw';
export interface MapPoint { name: string; latitude: number; longitude: number; label?: LabelSide }
export interface MapLeg { from: string; to: string; mode: Mode }
// One day as the map and its day list draw it; `night` is the map point a day without legs puts its number beside,
// and `badgeShift` nudges the number off a crowded spot.
export interface RouteDay {
  date: string; title: string; route: string[]; transport: string;
  overnight: { name: string; elevation?: string } | null; night?: string; badgeShift?: readonly [number, number];
  legs: MapLeg[]; modes: Mode[]; href: string; linkLabel: string;
}
export interface RouteDefinition { points: Record<string, MapPoint>; days: RouteDay[] }

export const at = (id: string, name: string, label?: LabelSide): MapPoint => ({ name, latitude: weatherLocations[id].latitude, longitude: weatherLocations[id].longitude, label });

// Towns reuse the verified weather coordinates; points without a label are drawn as pass-through dots.
export const mapPoints: Record<string, MapPoint> = {
  chengdu: at('chengdu', 'Chengdu', 's'),
  jiuzhaigou: at('jiuzhaigou', 'Jiuzhaigou', 'w'),
  // Approximate reference for Huanglongjiuzhai station near Chuanzhusi.
  huanglongjiuzhai: { name: 'Stasiun Huanglongjiuzhai', latitude: 32.78, longitude: 103.63 },
  bipenggou: at('bipenggou', 'Bipenggou', 'w'),
  rilong: at('rilong', 'Rilong', 'e'),
  danba: at('danba', 'Danba', 'n'),
  bamei: at('bamei', 'Bamei'),
  tagong: at('tagong', 'Tagong', 'e'),
  xinduqiao: at('xinduqiao', 'Xinduqiao', 'sw'),
  kangding: at('kangding', 'Kangding', 'e'),
  yajiang: at('yajiang', 'Yajiang'),
  litang: at('litang', 'Litang', 'n'),
  daocheng: at('daocheng', 'Daocheng', 'e'),
  riwa: at('riwa', 'Riwa', 'e'),
  yading: at('yading-village', 'Yading', 's'),
  xiangcheng: at('xiangcheng', 'Xiangcheng', 'n'),
  'shangri-la': at('shangri-la', 'Shangri-La', 'w'),
  lijiang: at('lijiang', 'Lijiang', 'e'),
  ganhaizi: at('ganhaizi', 'Jade Dragon'),
  dali: at('dali', 'Dali', 'w'),
  kunming: at('kunming', 'Kunming', 'n'),
};

export const overnightPoint: Record<string, string> = {
  Chengdu: 'chengdu', Jiuzhaigou: 'jiuzhaigou', Songpan: 'songpan', Bipenggou: 'bipenggou', Rilong: 'rilong', Xinduqiao: 'xinduqiao',
  Litang: 'litang', Riwa: 'riwa', 'Shangri-La': 'shangri-la', Lijiang: 'lijiang', Dali: 'dali', Kunming: 'kunming',
};

export const go = (mode: Mode, ...ids: string[]): MapLeg[] => ids.slice(1).map((to, index) => ({ from: ids[index], to, mode }));
// Legs follow the visiting order of each day; the flights on 8 and 21 November are arrows toward the frame edge.
export const mapLegs: Record<string, MapLeg[]> = {
  '2026-11-08': [],
  '2026-11-09': [...go('train', 'chengdu', 'huanglongjiuzhai'), ...go('car', 'huanglongjiuzhai', 'jiuzhaigou')],
  '2026-11-10': [...go('bus', 'jiuzhaigou', 'huanglongjiuzhai'), ...go('train', 'huanglongjiuzhai', 'chengdu'), ...go('bus', 'chengdu', 'bipenggou')],
  '2026-11-11': go('car', 'bipenggou', 'rilong'),
  '2026-11-12': go('car', 'rilong', 'danba', 'bamei', 'tagong', 'xinduqiao'),
  '2026-11-13': go('car', 'xinduqiao', 'kangding', 'xinduqiao'),
  '2026-11-14': go('bus', 'xinduqiao', 'yajiang', 'litang'),
  '2026-11-15': [...go('bus', 'litang', 'daocheng'), ...go('car', 'daocheng', 'riwa')],
  '2026-11-16': go('bus', 'riwa', 'yading', 'riwa'),
  '2026-11-17': [...go('car', 'riwa', 'xiangcheng'), ...go('bus', 'xiangcheng', 'shangri-la')],
  '2026-11-18': go('train', 'shangri-la', 'lijiang'),
  '2026-11-19': [...go('car', 'lijiang', 'ganhaizi', 'lijiang'), ...go('train', 'lijiang', 'dali')],
  '2026-11-20': go('train', 'dali', 'kunming'),
  '2026-11-21': [],
};

const provinceLabels = [
  { name: 'SICHUAN', longitude: 103.45, latitude: 29.15 }, { name: 'YUNNAN', longitude: 101.45, latitude: 26.25 },
  { name: 'XIZANG', longitude: 99.4, latitude: 32.3 }, { name: 'QINGHAI', longitude: 100.6, latitude: 33.5 }, { name: 'GANSU', longitude: 104.55, latitude: 33.55 },
];
const riverLabels = [
  { name: 'S. Jinsha', longitude: 99.5, latitude: 29.6 }, { name: 'S. Yalong', longitude: 101.25, latitude: 28.15 }, { name: 'S. Dadu', longitude: 102.32, latitude: 29.55 },
];
const modeNames: Record<Mode, string> = { car: 'Mobil', train: 'Kereta', bus: 'Bus taman', plane: 'Pesawat' };

// Every route shares the main plan's frame, so the main and calm maps line up when compared.
const points = Object.values(mapPoints);
const bounds = {
  west: Math.min(...points.map(p => p.longitude)) - 1.35, east: Math.max(...points.map(p => p.longitude)) + 0.5,
  south: Math.min(...points.map(p => p.latitude)) - 0.4, north: Math.max(...points.map(p => p.latitude)) + 0.4,
};
const xScale = Math.cos((bounds.north + bounds.south) / 2 * Math.PI / 180);
const width = 600;
const unit = width / ((bounds.east - bounds.west) * xScale);
const height = Math.round((bounds.north - bounds.south) * unit);
const round = (value: number) => Math.round(value * 10) / 10;
const project = (longitude: number, latitude: number) => [round((longitude - bounds.west) * xScale * unit), round((bounds.north - latitude) * unit)] as const;
const placer = (points: Record<string, MapPoint>) => (id: string) => project(points[id].longitude, points[id].latitude);

function curve(placed: ReturnType<typeof placer>, leg: MapLeg) {
  const [x1, y1] = placed(leg.from), [x2, y2] = placed(leg.to);
  const length = Math.hypot(x2 - x1, y2 - y1) || 1;
  // Bow each leg to the left of travel so out-and-back days read as two strokes.
  const bow = Math.min(length * 0.12, 14);
  const cx = round((x1 + x2) / 2 + (y2 - y1) / length * bow), cy = round((y1 + y2) / 2 - (x2 - x1) / length * bow);
  return { d: `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`, mid: [round(x1 / 4 + cx / 2 + x2 / 4), round(y1 / 4 + cy / 2 + y2 / 4)] as const, length };
}

const shortDate = (date: string) => new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Shanghai' }).format(new Date(`${date}T12:00:00+08:00`));
// Both routes fly in to Chengdu on 8 November and out of Kunming on 21 November.
const flightDates = ['2026-11-08', '2026-11-21'];
export const dayModes = (date: string, legs: MapLeg[]): Mode[] => [...(flightDates.includes(date) ? ['plane' as Mode] : []), ...new Set(legs.map(leg => leg.mode))];

function routeMapSvg({ points: routePoints, days: routeDays }: RouteDefinition) {
  const placed = placer(routePoints);
  const curved = (leg: MapLeg) => curve(placed, leg);
  const provinces = provinceShapes.map(shape => `<path class="map-province${['Sichuan', 'Yunnan'].includes(shape.name) ? ' is-route' : ''}" d="${shape.rings.map(ring => `M${ring.map(([lon, lat]) => project(lon, lat).join(' ')).join('L')}Z`).join('')}"/>`).join('');
  const rivers = riverLines.map(river => `<path class="map-river" d="${river.lines.map(line => `M${line.map(([lon, lat]) => project(lon, lat).join(' ')).join('L')}`).join('')}"/>`).join('');
  const labels = [
    ...provinceLabels.map(label => `<text class="map-province-label" x="${project(label.longitude, label.latitude)[0]}" y="${project(label.longitude, label.latitude)[1]}">${label.name}</text>`),
    ...riverLabels.map(label => `<text class="map-river-label" x="${project(label.longitude, label.latitude)[0]}" y="${project(label.longitude, label.latitude)[1]}">${label.name}</text>`),
  ].join('');
  const [chengduX, chengduY] = placed('chengdu'), [kunmingX, kunmingY] = placed('kunming');
  const flights = [
    { date: '2026-11-08', d: `M${width - 6} ${round(chengduY - 70)}L${round(chengduX + 7)} ${round(chengduY - 5)}`, label: 'dari Shanghai', x: width - 10, y: round(chengduY - 78), anchor: 'end', mid: [round((width - 6 + chengduX) / 2), round(chengduY - 37)] as const },
    { date: '2026-11-21', d: `M${round(kunmingX + 7)} ${round(kunmingY + 3)}L${width - 6} ${round(kunmingY + 26)}`, label: 'ke Jakarta', x: width - 10, y: round(kunmingY + 12), mid: [round((kunmingX + width) / 2), round(kunmingY + 14)] as const, anchor: 'end' },
  ];
  const dayGroups = routeDays.map((day, index) => {
    const legs = day.legs.map(curved);
    const flight = flights.find(item => item.date === day.date);
    // A flight day can also travel by land first (the calm option rides Dali → Kunming before its 21 November flight).
    const paths = day.legs.map((leg, legIndex) => `<path class="route-leg route-leg-${leg.mode}" d="${legs[legIndex].d}"/>`).join('')
      + (flight ? `<path class="route-leg route-leg-plane" d="${flight.d}" marker-end="url(#route-arrow)"/><text class="map-flight-label" x="${flight.x}" y="${flight.y}" text-anchor="${flight.anchor}">${flight.label}</text>` : '');
    return `<g class="route-day" data-day="${day.date}"><a href="#day-${day.date}" tabindex="-1"><title>${e(`Hari ${index + 1}, ${shortDate(day.date)}: ${day.title}`)}</title>${paths}</a></g>`;
  }).join('');
  const badges = routeDays.map((day, index) => {
    const flight = flights.find(item => item.date === day.date);
    const longest = day.legs.map(curved).reduce<ReturnType<typeof curve> | undefined>((best, leg) => !best || leg.length > best.length ? leg : best, undefined);
    // Very short out-and-back days would hide their number under the town ring, so it moves beside the town;
    // a day that stays in one town puts it above and to the right of its night.
    const beside = () => { const [x, y] = placed(day.night!); return [round(x + 17), round(y - 15)] as const; };
    const base = flight?.mid ?? (!longest ? beside() : longest.length < 30 ? [round(longest.mid[0] - 24), round(longest.mid[1] + 6)] as const : longest.mid);
    const anchor = day.badgeShift ? [round(base[0] + day.badgeShift[0]), round(base[1] + day.badgeShift[1])] as const : base;
    return `<a href="#day-${day.date}" tabindex="-1"><g class="route-badge" data-day="${day.date}" transform="translate(${anchor[0]} ${anchor[1]})"><title>${e(`Hari ${index + 1}, ${shortDate(day.date)}: ${day.title}`)}</title><circle r="11"/><text dy="4.5">${index + 1}</text></g></a>`;
  }).join('');
  const overnightIds = new Set(routeDays.flatMap(day => day.night ? [day.night] : []));
  const dots = Object.entries(routePoints).map(([id, point]) => {
    const [x, y] = placed(id);
    const overnight = overnightIds.has(id);
    const offset = overnight ? 11 : 8;
    const label = point.label ? {
      n: [x, round(y - offset), 'middle'], s: [x, round(y + offset + 12), 'middle'], e: [round(x + offset), round(y + 5), 'start'], w: [round(x - offset), round(y + 5), 'end'], sw: [round(x - 6), round(y + offset + 12), 'end'],
    }[point.label] : undefined;
    return `<g class="route-point${overnight ? ' is-overnight' : ''}"><title>${e(point.name)}</title><circle cx="${x}" cy="${y}" r="${overnight ? 5.5 : 3.5}"/>${label ? `<text x="${label[0]}" y="${label[1]}" text-anchor="${label[2]}">${e(point.name)}</text>` : ''}</g>`;
  }).join('');
  const scaleKm = 100;
  const scaleLength = round(scaleKm / 111.32 * unit);
  const scale = `<g class="map-scale" transform="translate(16 ${height - 22})"><path d="M0 0H${scaleLength}M0 -5V5M${scaleLength} -5V5"/><text x="${round(scaleLength / 2)}" y="-9">${scaleKm} km</text></g>`;
  const north = `<g class="map-north" transform="translate(${width - 24} 30)"><path d="M0 -14L6 4L0 0L-6 4Z"/><text y="18">U</text></g>`;
  return `<svg class="route-map" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="--map-aspect: ${round(width / height * 1000) / 1000}" aria-hidden="true" focusable="false">
    <defs><clipPath id="route-map-frame"><rect width="${width}" height="${height}"/></clipPath><marker id="route-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="route-arrow-head" d="M0 0L10 5L0 10Z"/></marker></defs>
    <rect class="map-ground" width="${width}" height="${height}"/>
    <g clip-path="url(#route-map-frame)">${provinces}${rivers}${labels}${dayGroups}${dots}${badges}</g>${scale}${north}
  </svg>`;
}

function timelineEntry(day: RouteDay, index: number) {
  return `<li class="route-entry" id="day-${day.date}" data-day="${day.date}">
    <span class="route-entry-number" aria-hidden="true">${index + 1}</span>
    <div class="route-entry-body">
      <p class="route-entry-date"><time datetime="${day.date}">${shortDate(day.date)}</time><span>Hari ${index + 1}</span><span>${day.modes.map(mode => modeNames[mode]).join(' + ')}</span></p>
      <h3>${e(day.title)}</h3>
      <p class="route-entry-path">${day.route.map(e).join(' <span aria-hidden="true">→</span><span class="visually-hidden">, lalu </span> ')}</p>
      <p class="route-entry-meta">${e(day.transport)}</p>
      <p class="route-entry-sleep">${icon('bed')}${day.overnight ? `Menginap di ${e(day.overnight.name)}${day.overnight.elevation ? ` · ${e(day.overnight.elevation)}` : ''}` : 'Terbang pulang ke Jakarta'}</p>
      <a class="text-link route-entry-open" href="${e(day.href)}"><span class="route-entry-open-label">${e(day.linkLabel)}</span>${icon('right')}</a>
    </div>
  </li>`;
}

const mainRoute: RouteDefinition = {
  points: mapPoints,
  days: days.map((day, index) => ({
    date: day.date, title: day.shortTitle, route: day.route, transport: day.transport, overnight: day.overnight,
    night: day.overnight ? overnightPoint[day.overnight.name] : undefined, legs: mapLegs[day.date], modes: dayModes(day.date, mapLegs[day.date]),
    href: `/#${day.date}`, linkLabel: `Buka jadwal hari ${index + 1}`,
  })),
};

/** The map with its legend beside the day list; on phones the list becomes the bottom day strip. */
export function routeMapLayout(route: RouteDefinition) {
  return `<div class="route-map-layout">
      <figure class="route-map-figure">
        ${routeMapSvg(route)}
        <figcaption>
          <ul class="route-legend" role="list">
            <li><span class="route-legend-line is-car" aria-hidden="true"></span>Mobil</li>
            <li><span class="route-legend-line is-train" aria-hidden="true"></span>Kereta</li>
            <li><span class="route-legend-line is-bus" aria-hidden="true"></span>Bus taman</li>
            <li><span class="route-legend-line is-plane" aria-hidden="true"></span>Pesawat</li>
            <li><span class="route-legend-dot is-overnight" aria-hidden="true"></span>Tempat menginap</li>
            <li><span class="route-legend-dot" aria-hidden="true"></span>Singgah atau dilewati</li>
          </ul>
          <p>Peta Sichuan dan Yunnan, 8–21 November 2026. Skala perkiraan; U menunjuk utara.</p>
        </figcaption>
      </figure>
      <section class="route-timeline" aria-labelledby="route-timeline-title">
        <h2 id="route-timeline-title">Urutan hari</h2>
        <ol role="list">${route.days.map(timelineEntry).join('')}</ol>
      </section>
    </div>`;
}

export function routeMapView() {
  const bases = new Set(days.flatMap(day => day.overnight ? [day.overnight.name] : []));
  const nights = days.filter(day => day.overnight).length;
  return `<a class="skip-link" href="#route-timeline-title">Langsung ke urutan hari</a>
  <header class="site-header container"><a class="wordmark" href="/" aria-label="Musim Gugur di China, halaman awal">${icon('mountain')}<span>China <span class="wordmark-year">2026</span></span></a>${renderSiteNavigation('/places/calm/')}</header>
  <main class="container route-map-page" data-route-map>
    <nav class="guide-breadcrumb" aria-label="Jejak halaman"><a href="/">Beranda</a>${icon('right')}<a href="/places/">Tempat</a>${icon('right')}<span>Peta rute</span></nav>
    ${planSwitch(routeMapPath)}
    <div class="route-map-intro">
      <h1 id="route-map-heading">Rute ${days.length} hari, titik demi titik.</h1>
      <p class="lead">Dari Chengdu ke Kunming: ${nights} malam di ${bases.size} tempat menginap, sebagian besar lewat darat. Garis di peta menghubungkan titik menurut urutan kunjungan, bukan jalur jalan sebenarnya.</p>
      <p>Nomor pada garis sama dengan nomor hari di daftar. Setiap hari terhubung ke jadwal lengkap.</p>
    </div>
    ${routeMapLayout(mainRoute)}
    <section class="guide-source-section" aria-labelledby="route-map-sources"><h2 id="route-map-sources">Sumber peta</h2><p>Batas provinsi dan sungai dari Natural Earth 10m (domain publik), disederhanakan sekitar 2,5 km. Titik kota memakai koordinat acuan yang sama dengan prakiraan cuaca di halaman tempat. Stasiun Huanglongjiuzhai adalah titik perkiraan.</p><p>Jarak dan waktu tempuh ada di setiap hari dan masih perlu dicek bersama sopir di Amap.</p></section>
  </main>
  <footer class="container guide-footer"><a href="/">Kembali ke itinerary ${days.length} hari</a>${siteCredit()}</footer>`;
}
