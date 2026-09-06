import { create } from 'zustand';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

interface BudgetState {
  transactions: Transaction[];
  isLoading: boolean;
  channel: RealtimeChannel | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (title: string, amount: number, type: 'income' | 'expense') => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;
  reset: () => void;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  transactions: [],
  isLoading: false,
  channel: null,

  fetchTransactions: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) set({ transactions: data as Transaction[] });
    set({ isLoading: false });
  },

  addTransaction: async (title, amount, type) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    await supabase
      .from('transactions')
      .insert([{ title, amount, type, user_id: userData.user.id }]);
  },

  deleteTransaction: async (id) => {
    await supabase.from('transactions').delete().eq('id', id);
  },

  subscribeToRealtime: () => {
    if (get().channel) return; // already subscribed

    const channel = supabase
      .channel('public:transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          const current = get().transactions;
          if (payload.eventType === 'INSERT') {
            set({ transactions: [payload.new as Transaction, ...current] });
          } else if (payload.eventType === 'DELETE') {
            set({ transactions: current.filter((t) => t.id !== payload.old.id) });
          }
        }
      )
      .subscribe();

    set({ channel });
  },

  unsubscribeFromRealtime: () => {
    const channel = get().channel;
    if (channel) {
      supabase.removeChannel(channel);
      set({ channel: null });
    }
  },

  reset: () => {
    get().unsubscribeFromRealtime();
    set({ transactions: [], isLoading: false });
  },
}));