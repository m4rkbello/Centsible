import React from 'react';
import { View, Text } from 'react-native';
import { useBudgetStore } from '../store/useBudgetStore';

export default function BalanceCard() {
  const transactions = useBudgetStore((state) => state.transactions);

  const incomeTotal = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expenseTotal = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = incomeTotal - expenseTotal;

  return (
    <View className="bg-slate-800 p-5 rounded-2xl border border-slate-700 mb-6 shadow-sm">
      <Text className="text-slate-400 text-sm font-medium">Total Balance</Text>
      <Text className={`text-3xl font-extrabold my-2 ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
        ${balance.toFixed(2)}
      </Text>
      <View className="flex-row justify-between border-t border-slate-700/60 pt-3 mt-1">
        <View>
          <Text className="text-slate-400 text-xs">Income</Text>
          <Text className="text-emerald-400 font-semibold text-base">+${incomeTotal.toFixed(2)}</Text>
        </View>
        <View>
          <Text className="text-slate-400 text-xs">Expenses</Text>
          <Text className="text-rose-400 font-semibold text-base">-${expenseTotal.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}