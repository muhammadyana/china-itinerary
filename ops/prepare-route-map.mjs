// Regenerates src/route-map-geo.ts from Natural Earth 10m GeoJSON (public domain).
// Usage: node ops/prepare-route-map.mjs <directory with ne_10m_admin_1_states_provinces.geojson and ne_10m_rivers_lake_centerlines.geojson>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [source] = process.argv.slice(2);
if (!source) throw new Error('Pass the directory that holds the Natural Earth GeoJSON files');

// Slightly larger than the map frame so clipped edges never show inside the viewBox.
const box = { west: 97.6, south: 23.6, east: 105.8, north: 34.6 };
const tolerance = 0.025;
const provinces = ['Sichuan', 'Yunnan', 'Tibet', 'Qinghai', 'Gansu', 'Chongqing', 'Guizhou', 'Guangxi'];
const rivers = new Map([['Yangtze', 'Jinsha'], ['Yalong', 'Yalong'], ['Dadu', 'Dadu'], ['Min', 'Min'], ['Mekong', 'Lancang'], ['Nu', 'Nu']]);

const read = name => JSON.parse(readFileSync(join(source, `${name}.geojson`), 'utf8'));
const round = point => [Math.round(point[0] * 100) / 100, Math.round(point[1] * 100) / 100];

function simplify(points) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9;
  let index = 0, distance = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const d = Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / length;
    if (d > distance) [index, distance] = [i, d];
  }
  return distance > tolerance ? [...simplify(points.slice(0, index + 1)).slice(0, -1), ...simplify(points.slice(index))] : [a, b];
}

// Douglas–Peucker needs distinct endpoints, so a closed ring is split at its farthest vertex and simplified as two halves.
function simplifyRing(ring) {
  if (ring.length < 4) return ring;
  const first = ring[0], last = ring[ring.length - 1];
  const open = first[0] === last[0] && first[1] === last[1] ? ring.slice(0, -1) : ring;
  if (open.length < 4) return open;
  let far = 1, best = 0;
  open.forEach((point, index) => {
    const distance = Math.hypot(point[0] - open[0][0], point[1] - open[0][1]);
    if (distance > best) [far, best] = [index, distance];
  });
  return [...simplify(open.slice(0, far + 1)).slice(0, -1), ...simplify([...open.slice(far), open[0]]).slice(0, -1)];
}

// Sutherland–Hodgman against each box edge.
function clipRing(ring) {
  const edges = [
    [p => p[0] >= box.west, (p, q) => [box.west, p[1] + (q[1] - p[1]) * (box.west - p[0]) / (q[0] - p[0])]],
    [p => p[0] <= box.east, (p, q) => [box.east, p[1] + (q[1] - p[1]) * (box.east - p[0]) / (q[0] - p[0])]],
    [p => p[1] >= box.south, (p, q) => [p[0] + (q[0] - p[0]) * (box.south - p[1]) / (q[1] - p[1]), box.south]],
    [p => p[1] <= box.north, (p, q) => [p[0] + (q[0] - p[0]) * (box.north - p[1]) / (q[1] - p[1]), box.north]],
  ];
  let output = ring;
  for (const [inside, cross] of edges) {
    const input = output;
    output = [];
    input.forEach((current, i) => {
      const previous = input[(i + input.length - 1) % input.length];
      if (inside(current)) {
        if (!inside(previous)) output.push(cross(previous, current));
        output.push(current);
      } else if (inside(previous)) output.push(cross(previous, current));
    });
    if (!output.length) break;
  }
  return output;
}

const inside = p => p[0] >= box.west && p[0] <= box.east && p[1] >= box.south && p[1] <= box.north;
function clipLine(line) {
  const runs = [];
  let run = [];
  line.forEach((point, i) => {
    if (inside(point) || (line[i - 1] && inside(line[i - 1])) || (line[i + 1] && inside(line[i + 1]))) run.push(point);
    else if (run.length) { runs.push(run); run = []; }
  });
  if (run.length) runs.push(run);
  return runs.filter(points => points.length > 1);
}

const polygons = geometry => geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
const lines = geometry => geometry.type === 'LineString' ? [geometry.coordinates] : geometry.coordinates;

const provinceShapes = read('ne_10m_admin_1_states_provinces').features
  .filter(feature => feature.properties.iso_a2 === 'CN' && provinces.includes(feature.properties.name_en))
  .map(feature => ({
    name: feature.properties.name_en,
    rings: polygons(feature.geometry).map(polygon => simplifyRing(clipRing(polygon[0])).map(round)).filter(ring => ring.length > 2),
  }))
  .filter(shape => shape.rings.length);

const riverLines = [...read('ne_10m_rivers_lake_centerlines').features
  .filter(feature => rivers.has(feature.properties.name_en ?? feature.properties.name))
  .reduce((byName, feature) => {
    const name = rivers.get(feature.properties.name_en ?? feature.properties.name);
    const parts = lines(feature.geometry).flatMap(clipLine).map(line => simplify(line).map(round));
    return byName.set(name, [...(byName.get(name) ?? []), ...parts]);
  }, new Map())]
  .map(([name, parts]) => ({ name, lines: parts }))
  .filter(river => river.lines.length);

const missing = provinces.filter(name => !provinceShapes.some(shape => shape.name === name));
if (missing.length) throw new Error(`Missing provinces: ${missing.join(', ')}`);

writeFileSync(new URL('../src/route-map-geo.ts', import.meta.url), `// Generated by ops/prepare-route-map.mjs from Natural Earth 10m admin-1 provinces and river centerlines
// (public domain, https://www.naturalearthdata.com/). Coordinates are [longitude, latitude], simplified to about 2.5 km.
export interface ProvinceShape { name: string; rings: [number, number][][] }
export interface RiverLine { name: string; lines: [number, number][][] }
export const provinceShapes: ProvinceShape[] = ${JSON.stringify(provinceShapes)};
export const riverLines: RiverLine[] = ${JSON.stringify(riverLines)};
`);
console.log(`provinces: ${provinceShapes.map(s => `${s.name}(${s.rings.reduce((n, r) => n + r.length, 0)})`).join(' ')}`);
console.log(`rivers: ${riverLines.map(r => `${r.name}(${r.lines.reduce((n, l) => n + l.length, 0)})`).join(' ')}`);
