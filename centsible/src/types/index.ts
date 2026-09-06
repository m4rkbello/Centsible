export interface Transaction {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  created_at: string;
}