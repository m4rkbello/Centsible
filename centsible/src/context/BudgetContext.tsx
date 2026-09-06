import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';
import { useAuth } from './AuthContext';

interface BudgetContextValue {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (title: string, amount: number, type: 'income' | 'expense') => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextValue | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setTransactions(data as Transaction[]);
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    if (!session) {
      setTransactions([]);
      return;
    }

    fetchTransactions();

    const channel: RealtimeChannel = supabase
      .channel('public:transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTransactions((current) => [payload.new as Transaction, ...current]);
          } else if (payload.eventType === 'DELETE') {
            setTransactions((current) => current.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, fetchTransactions]);

  const addTransaction = async (title: string, amount: number, type: 'income' | 'expense') => {
    if (!session) return;
    await supabase.from('transactions').insert([{ title, amount, type, user_id: session.user.id }]);
  };

  const deleteTransaction = async (id: string) => {
    await supabase.from('transactions').delete().eq('id', id);
  };

  return (
    <BudgetContext.Provider value={{ transactions, isLoading, addTransaction, deleteTransaction }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider');
  return ctx;
}