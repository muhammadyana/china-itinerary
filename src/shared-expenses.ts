// Shared 50/50 costs for the Yunnan days (17–21 November 2026).
// Item data lives on the server (ops/expenses) and is only loaded after login.
// The friend is labeled "Teman" in the authenticated UI.

export const sharedExpensesPath = '/places/shared-expenses/';
export const sharedExpensesApi = '/api/shared-expenses';

export type SharedPayer = 'Yana' | 'Teman';
export type SharedExpenseCategory = 'Hotel' | 'Transport' | 'Tur & Tiket Masuk' | 'Makanan';

export const sharedExpenseCategories: SharedExpenseCategory[] = [
  'Hotel',
  'Transport',
  'Tur & Tiket Masuk',
  'Makanan',
];

export interface SharedExpenseItem {
  id: string;
  no: number;
  date: string;
  category: string;
  label: string;
  /** Yuan amount when known. Approximate room-rate quotes are flagged. */
  cny?: number;
  cnyApproximate?: boolean;
  idr: number;
  /** Null when the row has no payer yet; those rows are left out of the settlement. */
  paidBy: SharedPayer | null;
}

export interface SharedExpenseInput {
  date: string;
  category: string;
  label: string;
  cny?: number;
  cnyApproximate?: boolean;
  idr: number;
  paidBy: SharedPayer | null;
}

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

/** Same rule as the earlier settlement sheet: net = 50% of what Yana paid minus 50% of what the friend paid, then rounded. */
export function settleSharedExpenses(items: SharedExpenseItem[]): SharedExpenseSettlement {
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
