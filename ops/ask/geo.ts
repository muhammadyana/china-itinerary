// get_weather (Open-Meteo forecast) and get_route (OSRM over OpenStreetMap), with place lookup through
// Open-Meteo geocoding (cities) and Nominatim (stations, streets, landmarks). All free and keyless.
import { fetchJson, FetchError } from './safe-fetch.ts';
import type { ToolOutput } from './tool-types.ts';

const APP_UA = 'china-itinerary-ask/1.0 (+https://china.muhammadyana.me)';
const TIMEOUT_MS = 12_000;

interface Place {
  lat: number;
  lng: number;
  name: string;
}

const WEATHER_CODES: Record<number, string> = {
  0: 'cerah', 1: 'cerah berawan', 2: 'berawan sebagian', 3: 'mendung', 45: 'berkabut', 48: 'kabut beku',
  51: 'gerimis ringan', 53: 'gerimis', 55: 'gerimis lebat', 56: 'gerimis beku', 57: 'gerimis beku lebat',
  61: 'hujan ringan', 63: 'hujan sedang', 65: 'hujan lebat', 66: 'hujan beku', 67: 'hujan beku lebat',
  71: 'salju ringan', 73: 'salju sedang', 75: 'salju lebat', 77: 'butiran salju',
  80: 'hujan lokal ringan', 81: 'hujan lokal', 82: 'hujan lokal lebat', 85: 'hujan salju ringan', 86: 'hujan salju lebat',
  95: 'badai petir', 96: 'badai petir dan hujan es', 99: 'badai petir dan hujan es lebat',
};

const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const COORDS = /^\s*(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/;

function coordinates(lat: unknown, lng: unknown): Place | undefined {
  if (!finite(lat) || !finite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return undefined;
  return { lat, lng, name: `${lat.toFixed(5)},${lng.toFixed(5)}` };
}

// Nominatim's policy: an identifying User-Agent and at most one request per second.
let nominatimQueue: Promise<unknown> = Promise.resolve();
let nominatimLast = 0;
function nominatim(query: string, signal: AbortSignal): Promise<Place | undefined> {
  const run = async () => {
    const wait = nominatimLast + 1100 - Date.now();
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
    nominatimLast = Date.now();
    const params = new URLSearchParams({ q: query, format: 'jsonv2', limit: '1', countrycodes: 'cn', 'accept-language': 'zh,en' });
    const data = await fetchJson(`https://nominatim.openstreetmap.org/search?${params}`, { signal, timeoutMs: TIMEOUT_MS, headers: { 'User-Agent': APP_UA } });
    const first = Array.isArray(data) ? (data[0] as Record<string, unknown> | undefined) : undefined;
    if (!first) return undefined;
    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
    return { lat, lng, name: String(first.display_name ?? query).slice(0, 160) };
  };
  const result = nominatimQueue.then(run, run);
  nominatimQueue = result.catch(() => undefined);
  return result;
}

async function openMeteoPlace(query: string, signal: AbortSignal): Promise<Place | undefined> {
  const params = new URLSearchParams({ name: query, count: '1', language: 'en', format: 'json' });
  const data = await fetchJson(`https://geocoding-api.open-meteo.com/v1/search?${params}`, { signal, timeoutMs: TIMEOUT_MS }) as { results?: Record<string, unknown>[] };
  const first = data.results?.[0];
  if (!first || !finite(first.latitude) || !finite(first.longitude)) return undefined;
  const name = [first.name, first.admin2, first.admin1, first.country].filter(part => typeof part === 'string' && part).join(', ');
  return { lat: first.latitude, lng: first.longitude, name };
}

/** "lat,lng" text, or a place name: Open-Meteo first for cities (weather), Nominatim for anything finer. */
async function resolvePlace(value: string, signal: AbortSignal, citiesFirst: boolean): Promise<Place> {
  const match = value.match(COORDS);
  if (match) {
    const place = coordinates(Number(match[1]), Number(match[2]));
    if (place) return place;
  }
  const query = value.trim().slice(0, 120);
  if (!query) throw new FetchError('empty place name');
  const place = (citiesFirst ? await openMeteoPlace(query, signal) : undefined) ?? await nominatim(query, signal);
  if (!place) throw new FetchError(`place not found: "${query}" (try the Chinese name with the city, e.g. "犀浦站 成都", or lat,lng)`);
  return place;
}

export async function getWeather(input: Record<string, unknown>, signal: AbortSignal): Promise<ToolOutput> {
  const days = input.days === undefined ? 3 : Number(input.days);
  if (!Number.isInteger(days) || days < 1 || days > 7) return { content: 'days must be an integer from 1 to 7.', isError: true };
  const place = coordinates(input.lat, input.lng)
    ?? (typeof input.place === 'string' && input.place.trim() ? await resolvePlace(input.place, signal, true) : undefined);
  if (!place) return { content: 'Give place (a city or place name, English or Chinese) or lat and lng.', isError: true };
  const params = new URLSearchParams({
    latitude: place.lat.toFixed(4),
    longitude: place.lng.toFixed(4),
    current: 'temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset',
    timezone: 'Asia/Shanghai',
    forecast_days: String(days),
  });
  const data = await fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`, { signal, timeoutMs: TIMEOUT_MS }) as Record<string, any>;
  const daily = data.daily ?? {};
  const current = data.current ?? {};
  const lines = [
    `Prakiraan Open-Meteo (model cuaca, perkiraan; dicek barusan) untuk ${place.name} (lat ${place.lat.toFixed(4)}, lng ${place.lng.toFixed(4)}, elevasi ${finite(data.elevation) ? `${Math.round(data.elevation)} m` : '?'}). Waktu: Asia/Shanghai.`,
  ];
  if (finite(current.temperature_2m)) {
    lines.push(`Sekarang (${String(current.time ?? '').replace('T', ' ')}): ${Math.round(current.temperature_2m)}°C, terasa ${finite(current.apparent_temperature) ? Math.round(current.apparent_temperature) : '?'}°C, ${WEATHER_CODES[current.weather_code] ?? `kode ${current.weather_code}`}, kelembapan ${current.relative_humidity_2m ?? '?'}%, angin ${current.wind_speed_10m ?? '?'} km/j.`);
  }
  const dates: unknown[] = Array.isArray(daily.time) ? daily.time : [];
  dates.forEach((date, index) => {
    const at = (key: string) => (Array.isArray(daily[key]) ? daily[key][index] : undefined);
    const time = (value: unknown) => (typeof value === 'string' ? value.slice(11, 16) : '?');
    const max = at('temperature_2m_max');
    const min = at('temperature_2m_min');
    const rain = at('precipitation_probability_max');
    const sum = at('precipitation_sum');
    lines.push(`${String(date)}: ${WEATHER_CODES[at('weather_code')] ?? `kode ${at('weather_code')}`}, ${finite(min) ? Math.round(min) : '?'}–${finite(max) ? Math.round(max) : '?'}°C, peluang hujan ${finite(rain) ? `${rain}%` : '?'}${finite(sum) && sum > 0 ? ` (${sum} mm)` : ''}, matahari terbit ${time(at('sunrise'))}, terbenam ${time(at('sunset'))}`);
  });
  if (!dates.length) throw new FetchError('Open-Meteo returned no forecast');
  return { content: lines.join('\n') };
}

const ROUTERS: Record<string, string> = {
  driving: 'https://router.project-osrm.org/route/v1/driving/',
  walking: 'https://routing.openstreetmap.de/routed-foot/route/v1/foot/',
};

export async function getRoute(input: Record<string, unknown>, signal: AbortSignal): Promise<ToolOutput> {
  const mode = input.mode === undefined ? 'driving' : input.mode;
  if (mode !== 'driving' && mode !== 'walking') return { content: 'mode must be driving or walking.', isError: true };
  if (typeof input.from !== 'string' || typeof input.to !== 'string' || !input.from.trim() || !input.to.trim()) {
    return { content: 'from and to must be "lat,lng" or a place name with its city (Chinese works best, e.g. "春熙路站 成都").', isError: true };
  }
  const from = await resolvePlace(input.from, signal, false);
  const to = await resolvePlace(input.to, signal, false);
  const url = `${ROUTERS[mode]}${from.lng.toFixed(6)},${from.lat.toFixed(6)};${to.lng.toFixed(6)},${to.lat.toFixed(6)}?overview=false&alternatives=false&steps=false`;
  const data = await fetchJson(url, { signal, timeoutMs: TIMEOUT_MS, headers: { 'User-Agent': APP_UA } }) as { code?: string; routes?: { distance?: number; duration?: number }[] };
  const route = data.routes?.[0];
  if (data.code !== 'Ok' || !route || !finite(route.distance) || !finite(route.duration)) throw new FetchError(`no ${mode} route found (OSRM: ${data.code ?? 'no answer'})`);
  const km = route.distance / 1000;
  const minutes = Math.max(1, Math.round(route.duration / 60));
  const crow = straightKm(from, to);
  return {
    content: [
      mode === 'driving'
        ? 'Perkiraan rute mobil (DiDi/taksi) dari OpenStreetMap/OSRM, tanpa data macet; di kota China waktu sungguhan biasanya lebih lama.'
        : 'Perkiraan rute jalan kaki dari OpenStreetMap/OSRM (kecepatan jalan rata-rata, tanpa tangga, penyeberangan atau antrean).',
      `Dari: ${from.name} (${from.lat.toFixed(5)},${from.lng.toFixed(5)})`,
      `Ke: ${to.name} (${to.lat.toFixed(5)},${to.lng.toFixed(5)})`,
      `Jarak rute: ${km.toFixed(1)} km, waktu: sekitar ${minutes} menit. Jarak garis lurus: ${crow.toFixed(1)} km.`,
      'Titik dari pencarian nama OpenStreetMap bisa meleset; cek di Amap. Untuk metro/bus, pakai Amap.',
    ].join('\n'),
  };
}

function straightKm(a: Place, b: Place): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
