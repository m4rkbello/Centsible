import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useBudgetStore } from '../store/useBudgetStore';
import BalanceCard from '../components/BalanceCard';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

export default function DashboardScreen() {
  const signOut = useAuthStore((state) => state.signOut);
  const { fetchTransactions, subscribeToRealtime, unsubscribeFromRealtime, reset } = useBudgetStore();

  useEffect(() => {
    fetchTransactions();
    subscribeToRealtime();
    return () => {
      unsubscribeFromRealtime();
    };
  }, []);

  const handleSignOut = async () => {
    reset();
    await signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 px-4 pt-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-white">Centsible</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Text className="text-slate-400 text-sm">Log Out</Text>
          </TouchableOpacity>
        </View>
        <BalanceCard />
        <TransactionForm />
        <TransactionList />
      </View>
    </SafeAreaView>
  );
}