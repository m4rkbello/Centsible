import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useBudgetStore } from '../store/useBudgetStore';

export default function TransactionForm() {
  const addTransaction = useBudgetStore((state) => state.addTransaction);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const handleCreate = async () => {
    if (!title.trim() || !amount.trim()) return;
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    await addTransaction(title, numericAmount, type);
    setTitle('');
    setAmount('');
  };

  return (
    <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 space-y-3">
      <TextInput
        placeholder="What did you spend on?"
        placeholderTextColor="#94a3b8"
        value={title}
        onChangeText={setTitle}
        className="bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 mb-3"
      />
      <View className="flex-row space-x-2 mb-3">
        <TextInput
          placeholder="Amount"
          placeholderTextColor="#94a3b8"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700"
        />
        <View className="flex-row bg-slate-900 rounded-lg border border-slate-700 p-1">
          <TouchableOpacity
            onPress={() => setType('expense')}
            className={`px-3 py-2 rounded-md ${type === 'expense' ? 'bg-rose-500' : ''}`}
          >
            <Text className="text-white text-xs font-bold">Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType('income')}
            className={`px-3 py-2 rounded-md ${type === 'income' ? 'bg-emerald-500' : ''}`}
          >
            <Text className="text-white text-xs font-bold">Income</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={handleCreate} className="bg-indigo-600 py-3 rounded-lg items-center">
        <Text className="text-white font-semibold">Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}