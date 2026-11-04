// Hour-by-hour plan per itinerary day, in China time (UTC+8). Shown in the day panel, the PDF and the trains page.
export type TimelineStep = [time: string, text: string];

export const dayTimelines: Record<string, TimelineStep[]> = {
  '2026-11-08': [
    ['08.50', 'Juneyao HO1119 dari Pudong ke Chengdu Tianfu.'],
    ['12.20', 'Mendarat di Tianfu (TFU). Penerbangan domestik, jadi tinggal ambil bagasi.'],
    ['±14.00–15.30', 'DiDi atau taksi ke hotel di Chunxi Road, sekitar satu jam lebih.'],
    ['Sore–malam', 'Jalan santai di Chunxi Road dan Taikoo Li, makan malam halal. Beli bekal berlabel 清真 untuk 9–12 November, lalu tidur cepat.'],
  ],
  '2026-11-09': [
    ['05.15', 'DiDi dari hotel ke Chengdu East, sekitar 30 menit. Datang 30–45 menit sebelum kereta untuk pemeriksaan paspor.'],
    ['06.14 / 06.45', 'Kereta C5746 atau C5782 ke Huanglongjiuzhai.'],
    ['07.53 / 08.30', 'Tiba di Huanglongjiuzhai, lalu shuttle sekitar 2 jam ke gerbang Jiuzhaigou.'],
    ['±10.00–10.45', 'Masuk taman dengan slot 10:00–12:00.'],
    ['10.45–17.30', 'Bus taman ke Five Flower Lake, lalu turun lewat Shuzheng. Taman tutup 18.00.'],
    ['±18.00', 'Check-in hotel dekat gerbang, Pengfeng atau Goukou.'],
  ],
  '2026-11-10': [
    ['06.20', 'Shuttle dari 九寨沟口长途客运站 ke Stasiun Huanglongjiuzhai, CNY 51, sekitar 2 jam.'],
    ['09.04', 'Kereta C5784 ke Chengdu East, tiba 10.45.'],
    ['±11.00–13.00', 'MRT atau DiDi ke terminal Chadianzi; makan siang halal di Chengdu.'],
    ['13.30', 'Bus ke 理县旅游客运中心, CNY 75, sekitar 3 jam. Cadangan 15.30 dan 16.30.'],
    ['±16.30–17.00', 'Check-in hotel di kota Lixian; besok pagi mobil tumpangan ke gerbang Bipenggou.'],
  ],
};
