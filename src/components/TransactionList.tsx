import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useBudgetStore } from '../store/useBudgetStore';

export default function TransactionList() {
  const { transactions, isLoading, deleteTransaction } = useBudgetStore();

  if (isLoading) return <ActivityIndicator size="large" color="#6366f1" className="mt-8" />;

  return (
    <View className="flex-1">
      <Text className="text-white font-bold text-lg mb-3">Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-slate-500 text-center py-8">No transactions yet.</Text>
        }
        renderItem={({ item }) => (
          <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-2 flex-row justify-between items-center">
            <View>
              <Text className="text-white font-medium text-base">{item.title}</Text>
              <Text className="text-slate-400 text-xs">
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row items-center space-x-3">
              <Text className={`font-bold text-base ${item.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.type === 'income' ? '+' : '-'}${Number(item.amount).toFixed(2)}
              </Text>
              <TouchableOpacity onPress={() => deleteTransaction(item.id)} className="bg-rose-500/10 px-2 py-1 rounded">
                <Text className="text-rose-400 font-bold text-xs">✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}