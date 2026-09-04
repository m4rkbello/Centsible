import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Transaction } from '../types';

interface BudgetState {
  transactions: Transaction[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  addTransaction: (title: string, amount: number, type: 'income' | 'expense') => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  subscribeToRealtime: () => () => void;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  transactions: [],
  isLoading: false,

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
    await supabase.from('transactions').insert([{ title, amount, type }]);
  },

  deleteTransaction: async (id) => {
    await supabase.from('transactions').delete().eq('id', id);
  },

  subscribeToRealtime: () => {
    const channel: RealtimeChannel = supabase
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

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));