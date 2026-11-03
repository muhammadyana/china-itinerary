import { weatherLocations, type WeatherLocation } from './weather-locations.ts';

const CACHE_TTL_MS = 15 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10 * 1000;
const STALE_AFTER_MS = 45 * 60 * 1000;
const FUTURE_TOLERANCE_MS = 5 * 60 * 1000;
const WEATHER_DOCUMENTATION = 'https://open-meteo.com/en/docs';
const STALE_MESSAGE = 'Data cuaca belum terbaru. Perbarui sebelum mengandalkannya.';

interface WeatherReading {
  temperature: number;
  feelsLike: number;
  validAt: number;
}

interface CachedReading {
  reading: WeatherReading;
  fetchedAt: number;
}

const cache = new Map<string, CachedReading>();
const requests = new Map<string, Promise<WeatherReading>>();
const initializedPanels = new WeakSet<HTMLElement>();
const panelReadings = new WeakMap<HTMLElement, WeatherReading>();
let freshnessChecksStarted = false;
const temperatureFormatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });
const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Shanghai', day: 'numeric', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]!));
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function findLocation(locationId: string): WeatherLocation | undefined {
  if (!Object.prototype.hasOwnProperty.call(weatherLocations, locationId)) return undefined;
  const location = weatherLocations[locationId];
  if (!location || !isFiniteNumber(location.latitude) || !isFiniteNumber(location.longitude)
    || Math.abs(location.latitude) > 90 || Math.abs(location.longitude) > 180) return undefined;
  return location;
}

function sourceLink(source: string, label: string): string {
  try {
    const url = new URL(source);
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
    }
  } catch {
    // A missing source link does not prevent displaying the named reference area.
  }
  return escapeHtml(label);
}

export function renderWeather(locationId: string): string {
  const location = findLocation(locationId);
  if (!location) {
    return '<section class="weather-panel" aria-label="Cuaca"><h3>Cuaca</h3><p>Lokasi acuan cuaca belum tersedia.</p></section>';
  }

  return `<section class="weather-panel" data-weather-location="${escapeHtml(locationId)}" data-weather-state="idle" aria-label="Cuaca di ${escapeHtml(location.name)}">
    <header class="weather-header"><h3>Cuaca di ${escapeHtml(location.name)}</h3><button type="button" class="weather-refresh" data-weather-refresh disabled>Perbarui</button></header>
    <div class="weather-reading" data-weather-reading hidden><p class="weather-temperature" data-weather-temperature></p><p class="weather-feels-like">Terasa seperti <span data-weather-feels-like></span></p></div>
    <div class="weather-placeholder" data-weather-placeholder aria-hidden="true" hidden><span></span><span></span></div>
    <p class="weather-status" data-weather-status role="status" aria-live="polite" aria-atomic="true">Estimasi cuaca belum dimuat.</p>
    <time class="weather-time" data-weather-time hidden></time>
    <p class="weather-disclaimer">Estimasi cuaca saat ini, bukan prakiraan tanggal perjalanan.</p>
    ${location.note ? `<p class="weather-location-note">${escapeHtml(location.note)}</p>` : ''}
    <p class="weather-source">Sumber: <a href="${WEATHER_DOCUMENTATION}" target="_blank" rel="noopener noreferrer">Open-Meteo</a> · ${sourceLink(location.source, 'Lokasi acuan')}<span>Estimasi model cuaca, bukan pengukuran langsung di lokasi.</span></p>
    <noscript><p class="weather-no-script">Aktifkan JavaScript untuk memuat estimasi cuaca saat ini.</p></noscript>
  </section>`;
}

function parseReading(value: unknown): WeatherReading {
  if (!isRecord(value) || !isRecord(value.current) || !isRecord(value.current_units)) {
    throw new Error('invalid-data');
  }
  const current = value.current;
  const units = value.current_units;
  if (!isFiniteNumber(current.temperature_2m) || !isFiniteNumber(current.apparent_temperature)
    || !isFiniteNumber(current.time) || !Number.isSafeInteger(current.time) || current.time <= 0
    || units.temperature_2m !== '°C' || units.apparent_temperature !== '°C' || units.time !== 'unixtime') {
    throw new Error('invalid-data');
  }
  const validAt = current.time * 1000;
  if (!Number.isFinite(new Date(validAt).getTime())) throw new Error('invalid-data');
  if (validAt - Date.now() > FUTURE_TOLERANCE_MS) throw new Error('future-data');
  return { temperature: current.temperature_2m, feelsLike: current.apparent_temperature, validAt };
}

async function getReading(location: WeatherLocation, force: boolean): Promise<WeatherReading> {
  const pending = requests.get(location.id);
  if (pending) return pending;
  const cached = cache.get(location.id);
  const cacheAge = cached ? Date.now() - cached.fetchedAt : CACHE_TTL_MS;
  if (!force && cached && cacheAge >= 0 && cacheAge < CACHE_TTL_MS) return cached.reading;

  const request = (async () => {
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const url = new URL('https://api.open-meteo.com/v1/forecast');
      url.search = new URLSearchParams({
        latitude: String(location.latitude), longitude: String(location.longitude),
        current: 'temperature_2m,apparent_temperature', temperature_unit: 'celsius',
        timezone: 'Asia/Shanghai', timeformat: 'unixtime', forecast_days: '1',
      }).toString();
      const response = await fetch(url, {
        signal: controller.signal, credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
      });
      if (!response.ok) throw new Error('request-failed');
      const reading = parseReading(await response.json());
      cache.set(location.id, { reading, fetchedAt: Date.now() });
      return reading;
    } catch (error) {
      if (controller.signal.aborted) throw new Error('request-timeout');
      throw error;
    } finally {
      globalThis.clearTimeout(timeout);
    }
  })();

  requests.set(location.id, request);
  try {
    return await request;
  } finally {
    requests.delete(location.id);
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === 'invalid-data') return 'Data cuaca dari penyedia belum lengkap. Coba lagi.';
    if (error.message === 'future-data') return 'Waktu data cuaca belum valid. Coba lagi.';
    if (error.message === 'request-timeout') return 'Penyedia cuaca belum merespons. Coba lagi.';
  }
  return 'Cuaca belum bisa dimuat. Coba lagi.';
}

async function updatePanel(panel: HTMLElement, location: WeatherLocation, force = false): Promise<void> {
  const button = panel.querySelector<HTMLButtonElement>('[data-weather-refresh]');
  const readingElement = panel.querySelector<HTMLElement>('[data-weather-reading]');
  const placeholder = panel.querySelector<HTMLElement>('[data-weather-placeholder]');
  const temperature = panel.querySelector<HTMLElement>('[data-weather-temperature]');
  const feelsLike = panel.querySelector<HTMLElement>('[data-weather-feels-like]');
  const status = panel.querySelector<HTMLElement>('[data-weather-status]');
  const time = panel.querySelector<HTMLTimeElement>('[data-weather-time]');
  if (!button || !readingElement || !placeholder || !temperature || !feelsLike || !status || !time) return;

  panel.dataset.weatherState = 'loading';
  readingElement.hidden = true;
  time.hidden = true;
  placeholder.hidden = false;
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  button.textContent = 'Memuat';
  status.textContent = 'Memuat estimasi cuaca…';

  try {
    const reading = await getReading(location, force);
    if (reading.validAt - Date.now() > FUTURE_TOLERANCE_MS) throw new Error('future-data');
    const stale = Date.now() - reading.validAt > STALE_AFTER_MS;
    panelReadings.set(panel, reading);
    panel.dataset.weatherState = stale ? 'stale' : 'ready';
    temperature.textContent = `${temperatureFormatter.format(reading.temperature)} °C`;
    feelsLike.textContent = `${temperatureFormatter.format(reading.feelsLike)} °C`;
    time.dateTime = new Date(reading.validAt).toISOString();
    time.textContent = `Waktu data: ${timeFormatter.format(reading.validAt)} (UTC+8)`;
    time.hidden = false;
    readingElement.hidden = false;
    button.textContent = 'Perbarui';
    status.textContent = stale
      ? STALE_MESSAGE
      : 'Estimasi cuaca terbaru tersedia.';
  } catch (error) {
    panel.dataset.weatherState = 'error';
    temperature.textContent = '';
    feelsLike.textContent = '';
    time.removeAttribute('datetime');
    time.textContent = '';
    status.textContent = errorMessage(error);
    button.textContent = 'Coba lagi';
  } finally {
    placeholder.hidden = true;
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
}

function updateFreshness(): void {
  for (const panel of document.querySelectorAll<HTMLElement>('[data-weather-state="ready"]')) {
    const reading = panelReadings.get(panel);
    if (!reading || Date.now() - reading.validAt <= STALE_AFTER_MS) continue;
    panel.dataset.weatherState = 'stale';
    const status = panel.querySelector<HTMLElement>('[data-weather-status]');
    if (status) status.textContent = STALE_MESSAGE;
  }
}

export function initializeWeather(root: ParentNode = document): void {
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-weather-location]'));
  if (root instanceof HTMLElement && root.matches('[data-weather-location]')) panels.unshift(root);

  if (panels.length && !freshnessChecksStarted) {
    freshnessChecksStarted = true;
    globalThis.setInterval(updateFreshness, 60_000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) updateFreshness();
    });
  }

  for (const panel of panels) {
    if (initializedPanels.has(panel)) continue;
    const location = findLocation(panel.dataset.weatherLocation ?? '');
    if (!location) continue;
    initializedPanels.add(panel);
    const button = panel.querySelector<HTMLButtonElement>('[data-weather-refresh]');
    button?.addEventListener('click', () => {
      if (!button.disabled) void updatePanel(panel, location, true);
    });
    void updatePanel(panel, location);
  }
}
