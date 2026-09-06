import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from './src/store/useAuthStore';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  const { session, isLoading, initialize } = useAuthStore();
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!session) {
    return screen === 'login' ? (
      <LoginScreen onSwitchToRegister={() => setScreen('register')} />
    ) : (
      <RegisterScreen onSwitchToLogin={() => setScreen('login')} />
    );
  }

  return <DashboardScreen />;
}