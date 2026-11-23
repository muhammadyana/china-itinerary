// One-time seed for a new store. The friend is always labeled "Teman".
export interface SeedItem {
  id: string;
  date: string;
  category: string;
  label: string;
  cny?: number;
  cnyApproximate?: boolean;
  idr: number;
  paidBy: 'Yana' | 'Teman' | null;
}

export const seedItems: SeedItem[] = [
  { id: 'seed-01', date: '2026-11-17', category: 'Hotel', label: 'Lijiang Hemuju Homestay, 1 malam (17–18 Nov), Elegant Queen Room', cny: 70, cnyApproximate: true, idr: 191201, paidBy: 'Teman' },
  { id: 'seed-02', date: '2026-11-17', category: 'Transport', label: 'DiDi (滴滴快车), Stasiun Lijiang → Hemuju Homestay, 17 Nov 22.43 (order 16 Nov 17.54)', cny: 26.1, idr: 74327, paidBy: 'Yana' },
  { id: 'seed-03', date: '2026-11-18', category: 'Tur & Tiket Masuk', label: 'Lift Tiger Leaping Gorge, 18 Nov 09.16', cny: 160, idr: 456208, paidBy: 'Yana' },
  { id: 'seed-04', date: '2026-11-18', category: 'Tur & Tiket Masuk', label: 'Tur Shangri-La + Tiger Leaping Gorge (Package E), 2 orang; termasuk tiket, mobil, sopir, makan siang', idr: 918164, paidBy: 'Teman' },
  { id: 'seed-05', date: '2026-11-18', category: 'Hotel', label: 'Shangri-la Jianyi light luxury intelligent B&B, Dukezong, 1 malam (18–19 Nov), Sunlit Street View Double Bed Room', cny: 131, cnyApproximate: true, idr: 356684, paidBy: 'Teman' },
  { id: 'seed-06', date: '2026-11-18', category: 'Transport', label: 'DiDi (特惠快车), parkiran East Gate → Jianyi Shangri-La, 18 Nov 17.16', cny: 8.31, idr: 23694, paidBy: 'Yana' },
  { id: 'seed-07', date: '2026-11-19', category: 'Transport', label: 'Kereta C990 Shangri-La 20.25 → Lijiang 21.51, kelas dua, 2 kursi (termasuk biaya)', idr: 430988, paidBy: 'Yana' },
  { id: 'seed-08', date: '2026-11-19', category: 'Hotel', label: '166 Hotel (Lijiang Ancient City), 1 malam (19–20 Nov), Sunshine Wonderful Twin Room', cny: 81, cnyApproximate: true, idr: 220254, paidBy: 'Teman' },
  { id: 'seed-09', date: '2026-11-19', category: 'Transport', label: 'Sewa mobil ke Pudacuo (普达措), dibayar 19 Nov 17.36 (termasuk biaya kartu internasional ¥7,20)', cny: 247.2, idr: 704795, paidBy: 'Yana' },
  { id: 'seed-10', date: '2026-11-20', category: 'Tur & Tiket Masuk', label: 'Tur Yulong Snow Mountain: sunrise 日照金山, Spruce Meadow, Impression Lijiang, Blue Moon Valley; 2 orang', idr: 2107352, paidBy: 'Teman' },
  { id: 'seed-11', date: '2026-11-20', category: 'Transport', label: 'Kereta C374 Lijiang 17.04 → Dali 19.20, kelas dua, 2 kursi (tiket Rp436.842 + biaya Rp54.606)', idr: 491448, paidBy: 'Teman' },
  { id: 'seed-12', date: '2026-11-20', category: 'Hotel', label: 'Dali Nanlu · Yinsu 大理南麓·隐宿 (古城南门店), 1 malam (20–21 Nov)', idr: 281374, paidBy: 'Teman' },
  { id: 'seed-13', date: '2026-11-20', category: 'Transport', label: 'DiDi (特惠快车), Stasiun Lijiang → 166 Hotel, 20 Nov 15.36 (order 19 Nov 21.54)', cny: 18.2, idr: 51766, paidBy: 'Yana' },
  { id: 'seed-14', date: '2026-11-20', category: 'Transport', label: 'DiDi, Xinxin Supermarket → Stasiun Lijiang, 20 Nov 19.16', cny: 14.6, idr: 41526, paidBy: 'Yana' },
  { id: 'seed-15', date: '2026-11-20', category: 'Transport', label: 'DiDi, Stasiun Dali → Nanlu Yinsu, 20 Nov 20.09', cny: 29.8, idr: 84759, paidBy: 'Yana' },
  { id: 'seed-16', date: '2026-11-21', category: 'Transport', label: 'DiDi, Stasiun Kunming → 南屏街, 21 Nov 14.43', cny: 10.9, idr: 31035, paidBy: 'Yana' },
  { id: 'seed-17', date: '2026-11-21', category: 'Transport', label: 'DiDi 南屏街 → Bandara Kunming Changshui, 21 Nov 15.45', cny: 52.6, idr: 149766, paidBy: 'Yana' },
];
