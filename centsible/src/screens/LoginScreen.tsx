import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    const err = await signIn(email, password);
    if (err) setError(err);
  };

  return (
    <View className="flex-1 justify-center px-6 bg-slate-900">
      <Text className="text-3xl font-bold text-white mb-8 text-center">Centsible</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 mb-3"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 mb-3"
      />
      {error && <Text className="text-rose-400 text-sm mb-3">{error}</Text>}
      <TouchableOpacity onPress={handleLogin} className="bg-indigo-600 py-3 rounded-lg items-center mb-4">
        <Text className="text-white font-semibold">Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSwitchToRegister}>
        <Text className="text-slate-400 text-center">Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}