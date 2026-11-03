import type { Photo } from './itinerary.ts';

// Real Commons photographs retain capture dates, attribution, and source licenses.
export const chengduGuidePhotos: Record<string, Photo> = {
  "chengdu-chunxi": {
    "id": "chengdu-chunxi",
    "width": 8313,
    "height": 8316,
    "sizes": [
      480,
      960,
      1440
    ],
    "author": "Daniel Lu (Dllu)",
    "source": "https://commons.wikimedia.org/wiki/File:Chunxi_Road_gold_building_Chengdu_2026_dllu.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "origin": "Wikimedia Commons",
    "photoNote": "Chunxi Road, dipotret pada 23 Januari 2026. Foto referensi, bukan kondisi saat perjalanan November."
  },
  "chengdu-taikoo": {
    "id": "chengdu-taikoo",
    "width": 3024,
    "height": 4032,
    "sizes": [
      480,
      960,
      1440
    ],
    "author": "Eftetf",
    "source": "https://commons.wikimedia.org/wiki/File:Taikoo_Li_Chengdu_%26_Daci_Temple_at_Night.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "origin": "Wikimedia Commons",
    "photoNote": "Taikoo Li pada malam hari, dipotret pada 20 Juli 2024. Foto arsip sebagai gambaran kawasan."
  }
};
