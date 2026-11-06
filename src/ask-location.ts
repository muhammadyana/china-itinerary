/** The phone's position, shared with Tanya AI only after the owner taps the location button. Kept in memory, never stored. */
export interface SharedLocation { lat: number; lng: number; accuracy: number; at: number }

const FRESH_MS = 60_000;
const TIMEOUT_MS = 15_000;

const messages: Record<number, string> = {
  1: 'Izin lokasi ditolak. Izinkan lokasi untuk situs ini di pengaturan browser, lalu coba lagi.',
  2: 'Lokasi belum terbaca. Coba di tempat terbuka atau nyalakan GPS.',
  3: 'Lokasi terlalu lama dibaca. Coba lagi.',
};

export class LocationError extends Error {}

export function readLocation(maximumAge = FRESH_MS, timeout = TIMEOUT_MS): Promise<SharedLocation> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new LocationError('Browser ini tidak bisa membaca lokasi.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy),
        at: position.timestamp,
      }),
      error => reject(new LocationError(messages[error.code] ?? 'Lokasi gagal dibaca. Coba lagi.')),
      { enableHighAccuracy: true, timeout, maximumAge },
    );
  });
}
