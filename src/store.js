import { create } from "zustand";
import { supabase } from "./supabase";

export const useStore = create((set, get) => ({
  user: null,
  session: null,
  authLoading: true,
  transactions: [],
  loading: false,

  checkUser: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user || null, authLoading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user || null });
      if (session) get().fetchTransactions();
    });
  },

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ transactions: [], user: null, session: null });
  },

  getCalculations: () => {
    const txs = get().transactions;
    let income = 0,
      expenses = 0,
      savings = 0;

    txs.forEach((tx) => {
      if (tx.type === "income") income += Number(tx.amount);
      if (tx.type === "expense") expenses += Number(tx.amount);
      if (tx.type === "savings") savings += Number(tx.amount);
    });

    return {
      balance: income - expenses - savings,
      totalSavings: savings,
      totalExpenses: expenses,
      totalIncome: income,
    };
  },

  fetchTransactions: async () => {
    const user = get().user;
    if (!user) return;
    set({ loading: true });

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) set({ transactions: data });
    set({ loading: false });
  },

  addTransaction: async (title, amount, type) => {
    const user = get().user;
    if (!user) return;

    const newTx = { user_id: user.id, title, amount: parseFloat(amount), type };
    const { data, error } = await supabase
      .from("transactions")
      .insert([newTx])
      .select();

    if (error) alert(error.message);
    else set((state) => ({ transactions: [data[0], ...state.transactions] }));
  },
}));
