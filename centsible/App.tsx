import React, { useEffect } from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import { useBudgetStore } from "./src/store/useBudgetStore";
import BalanceCard from "./src/components/BalanceCard";
import TransactionForm from "./src/components/TransactionForm";
import TransactionList from "./src/components/TransactionList";

export default function App() {
  const { fetchTransactions, subscribeToRealtime } = useBudgetStore();

  useEffect(() => {
    fetchTransactions();
    const unsubscribe = subscribeToRealtime();
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 px-4 pt-6">
        <Text className="text-2xl font-bold text-white mb-4">Centsible</Text>
        <BalanceCard />
        <TransactionForm />
        <TransactionList />
      </View>
    </SafeAreaView>
  );
}