import type { Photo } from './itinerary.ts';

// Sourced photographs and PDF derivatives preserve their original attribution.
// The Caicun image is explicitly labeled as an Erhai reference, not a verified pier photograph.
export const northernGuidePhotos: Record<string, Photo> = {
  "guide-n-moshi": {
    "id": "guide-n-moshi",
    "width": 740,
    "height": 493,
    "sizes": [
      480,
      740
    ],
    "author": "PDF perjalanan pengguna",
    "source": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=10",
    "license": "Dokumen pengguna",
    "licenseUrl": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=10",
    "origin": "PDF",
    "photoNote": "Formasi batu abu-abu di Moshi Park, sesuai PDF perjalanan. Tanggal pengambilan mengikuti sumber PDF; bukan konfirmasi kondisi saat kunjungan."
  },
  "guide-n-muya": {
    "id": "guide-n-muya",
    "width": 640,
    "height": 480,
    "sizes": [
      480,
      640
    ],
    "author": "PDF perjalanan pengguna",
    "source": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=11",
    "license": "Dokumen pengguna",
    "licenseUrl": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=11",
    "origin": "PDF",
    "photoNote": "Kompleks Muya Monastery dengan latar pegunungan, sesuai PDF perjalanan. Tanggal pengambilan mengikuti sumber PDF; bukan konfirmasi kondisi saat kunjungan."
  },
  "guide-n-sifangjie": {
    "id": "guide-n-sifangjie",
    "width": 700,
    "height": 400,
    "sizes": [
      480,
      700
    ],
    "author": "PDF perjalanan pengguna",
    "source": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=22",
    "license": "Dokumen pengguna",
    "licenseUrl": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=22",
    "origin": "PDF",
    "photoNote": "Bangunan di alun-alun Sifangjie, Kota Tua Lijiang. Tanggal pengambilan mengikuti sumber PDF; bukan konfirmasi kondisi saat kunjungan."
  },
  "guide-n-wuhua": {
    "id": "guide-n-wuhua",
    "width": 740,
    "height": 555,
    "sizes": [
      480,
      740
    ],
    "author": "PDF perjalanan pengguna",
    "source": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=25",
    "license": "Dokumen pengguna",
    "licenseUrl": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=25",
    "origin": "PDF",
    "photoNote": "Pemandangan Kota Tua Dali dari Menara Wuhua, sesuai keterangan PDF. Tanggal pengambilan mengikuti sumber PDF; bukan konfirmasi kondisi saat kunjungan."
  },
  "guide-n-caicun": {
    "id": "guide-n-caicun",
    "width": 740,
    "height": 555,
    "sizes": [
      480,
      740
    ],
    "author": "PDF perjalanan pengguna",
    "source": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=25",
    "license": "Dokumen pengguna",
    "licenseUrl": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=25",
    "origin": "PDF",
    "photoNote": "Referensi pemandangan Danau Erhai dari PDF; foto ini tidak memastikan tampilan Dermaga Caicun. Tanggal pengambilan mengikuti sumber PDF; bukan konfirmasi kondisi saat kunjungan."
  },
  "guide-n-nancheng": {
    "id": "guide-n-nancheng",
    "width": 740,
    "height": 380,
    "sizes": [
      480,
      740
    ],
    "author": "PDF perjalanan pengguna",
    "source": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=26",
    "license": "Dokumen pengguna",
    "licenseUrl": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=26",
    "origin": "PDF",
    "photoNote": "Gerbang Masjid Nancheng di Kunming. Tanggal pengambilan mengikuti sumber PDF; bukan konfirmasi kondisi saat kunjungan."
  },
  "guide-n-shuncheng": {
    "id": "guide-n-shuncheng",
    "width": 740,
    "height": 493,
    "sizes": [
      480,
      740
    ],
    "author": "PDF perjalanan pengguna",
    "source": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=26",
    "license": "Dokumen pengguna",
    "licenseUrl": "https://china.muhammadyana.me/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf#page=26",
    "origin": "PDF",
    "photoNote": "Gerbang Masjid Shuncheng di kawasan Hui, Kunming. Tanggal pengambilan mengikuti sumber PDF; bukan konfirmasi kondisi saat kunjungan."
  }
};

export const northernPlacePhotoIds: Record<string, string> = {
  "moshi": "guide-n-moshi",
  "muya": "guide-n-muya",
  "sifangjie": "guide-n-sifangjie",
  "wuhua": "guide-n-wuhua",
  "caicun": "guide-n-caicun",
  "nancheng": "guide-n-nancheng",
  "shuncheng": "guide-n-shuncheng"
};

export const northernPhotoDescriptions: Record<string, string> = {
  "guide-n-moshi": "Formasi batu abu-abu di Moshi Park, sesuai PDF perjalanan.",
  "guide-n-muya": "Kompleks Muya Monastery dengan latar pegunungan, sesuai PDF perjalanan.",
  "guide-n-sifangjie": "Bangunan di alun-alun Sifangjie, Kota Tua Lijiang.",
  "guide-n-wuhua": "Pemandangan Kota Tua Dali dari Menara Wuhua, sesuai keterangan PDF.",
  "guide-n-caicun": "Referensi pemandangan Danau Erhai dari PDF; foto ini tidak memastikan tampilan Dermaga Caicun.",
  "guide-n-nancheng": "Gerbang Masjid Nancheng di Kunming.",
  "guide-n-shuncheng": "Gerbang Masjid Shuncheng di kawasan Hui, Kunming."
};
