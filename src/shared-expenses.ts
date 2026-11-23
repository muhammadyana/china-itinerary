// Shared 50/50 costs for the Yunnan days (17–21 November 2026).
// Figures come from the private settlement sheet, read on 23 November 2026.
// C990 is recorded as paid by Yana. The friend is labeled "Teman" on this public site.

export const sharedExpensesPath = '/places/shared-expenses/';

export type SharedPayer = 'Yana' | 'Teman';
export type SharedExpenseCategory = 'Hotel' | 'Transport' | 'Tur & Tiket Masuk';

export interface SharedExpenseItem {
  no: number;
  date: string;
  category: SharedExpenseCategory;
  label: string;
  /** Yuan amount when known. Approximate room-rate quotes are flagged. */
  cny?: number;
  cnyApproximate?: boolean;
  idr: number;
  paidBy: SharedPayer;
}

export const sharedExpenseItems: SharedExpenseItem[] = [
  { no: 1, date: '2026-11-17', category: 'Hotel', label: 'Lijiang Hemuju Homestay, 1 malam (17–18 Nov), Elegant Queen Room', cny: 70, cnyApproximate: true, idr: 191201, paidBy: 'Teman' },
  { no: 2, date: '2026-11-17', category: 'Transport', label: 'DiDi (滴滴快车), Stasiun Lijiang → Hemuju Homestay, 17 Nov 22.43 (order 16 Nov 17.54)', cny: 26.1, idr: 74327, paidBy: 'Yana' },
  { no: 3, date: '2026-11-18', category: 'Tur & Tiket Masuk', label: 'Tur Shangri-La + Tiger Leaping Gorge (Package E), 2 orang; termasuk tiket, mobil, sopir, makan siang', idr: 918164, paidBy: 'Teman' },
  { no: 4, date: '2026-11-18', category: 'Hotel', label: 'Shangri-la Jianyi light luxury intelligent B&B, Dukezong, 1 malam (18–19 Nov), Sunlit Street View Double Bed Room', cny: 131, cnyApproximate: true, idr: 356684, paidBy: 'Teman' },
  { no: 5, date: '2026-11-18', category: 'Transport', label: 'DiDi (特惠快车), parkiran East Gate → Jianyi Shangri-La, 18 Nov 17.16', cny: 8.31, idr: 23694, paidBy: 'Yana' },
  { no: 6, date: '2026-11-19', category: 'Transport', label: 'Kereta C990 Shangri-La 20.25 → Lijiang 21.51, kelas dua, 2 kursi (termasuk biaya)', idr: 430988, paidBy: 'Yana' },
  { no: 7, date: '2026-11-19', category: 'Hotel', label: '166 Hotel (Lijiang Ancient City), 1 malam (19–20 Nov), Sunshine Wonderful Twin Room', cny: 81, cnyApproximate: true, idr: 220254, paidBy: 'Teman' },
  { no: 8, date: '2026-11-19', category: 'Transport', label: 'Sewa mobil ke Pudacuo (普达措), dibayar 19 Nov 17.36 (termasuk biaya kartu internasional ¥7,20)', cny: 247.2, idr: 704795, paidBy: 'Yana' },
  { no: 9, date: '2026-11-20', category: 'Tur & Tiket Masuk', label: 'Tur Yulong Snow Mountain: sunrise 日照金山, Spruce Meadow, Impression Lijiang, Blue Moon Valley; 2 orang', idr: 2107352, paidBy: 'Teman' },
  { no: 10, date: '2026-11-20', category: 'Transport', label: 'Kereta C374 Lijiang 17.04 → Dali 19.20, kelas dua, 2 kursi (tiket Rp436.842 + biaya Rp54.606)', idr: 491448, paidBy: 'Teman' },
  { no: 11, date: '2026-11-20', category: 'Hotel', label: 'Dali Nanlu · Yinsu 大理南麓·隐宿 (古城南门店), 1 malam (20–21 Nov)', idr: 281374, paidBy: 'Teman' },
  { no: 12, date: '2026-11-20', category: 'Transport', label: 'DiDi (特惠快车), Stasiun Lijiang → 166 Hotel, 20 Nov 15.36 (order 19 Nov 21.54)', cny: 18.2, idr: 51766, paidBy: 'Yana' },
  { no: 13, date: '2026-11-20', category: 'Transport', label: 'DiDi, Xinxin Supermarket → Stasiun Lijiang, 20 Nov 19.16', cny: 14.6, idr: 41526, paidBy: 'Yana' },
  { no: 14, date: '2026-11-20', category: 'Transport', label: 'DiDi, Stasiun Dali → Nanlu Yinsu, 20 Nov 20.09', cny: 29.8, idr: 84759, paidBy: 'Yana' },
  { no: 15, date: '2026-11-21', category: 'Transport', label: 'DiDi, Stasiun Kunming → 南屏街, 21 Nov 14.43', cny: 10.9, idr: 31035, paidBy: 'Yana' },
  { no: 16, date: '2026-11-21', category: 'Transport', label: 'DiDi 南屏街 → Bandara Kunming Changshui, 21 Nov 15.45', cny: 52.6, idr: 149766, paidBy: 'Yana' },
];

export interface SharedExpenseSettlement {
  totalIdr: number;
  perPerson: number;
  paidByYana: number;
  paidByFriend: number;
  yanaShare: number;
  friendShare: number;
  /** Positive means Teman transfers to Yana; negative means Yana transfers to Teman. */
  net: number;
  transferFrom: SharedPayer | null;
  transferTo: SharedPayer | null;
  transferAmount: number;
}

/** Same rule as the settlement sheet: net = 50% of what Yana paid minus 50% of what the friend paid, then rounded. */
export function settleSharedExpenses(items = sharedExpenseItems): SharedExpenseSettlement {
  const totalIdr = items.reduce((sum, item) => sum + item.idr, 0);
  const paidByYana = items.filter(item => item.paidBy === 'Yana').reduce((sum, item) => sum + item.idr, 0);
  const paidByFriend = items.filter(item => item.paidBy === 'Teman').reduce((sum, item) => sum + item.idr, 0);
  const yanaShare = paidByYana * 0.5;
  const friendShare = paidByFriend * 0.5;
  const rawNet = yanaShare - friendShare;
  const transferAmount = Math.round(Math.abs(rawNet));
  const net = rawNet > 0 ? transferAmount : rawNet < 0 ? -transferAmount : 0;
  return {
    totalIdr,
    perPerson: totalIdr * 0.5,
    paidByYana,
    paidByFriend,
    yanaShare,
    friendShare,
    net,
    transferFrom: transferAmount === 0 ? null : net > 0 ? 'Teman' : 'Yana',
    transferTo: transferAmount === 0 ? null : net > 0 ? 'Yana' : 'Teman',
    transferAmount,
  };
}

export const sharedExpenseSettlement = settleSharedExpenses();
