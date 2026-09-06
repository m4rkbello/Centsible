import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

export default function RegisterScreen({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const signUp = useAuthStore((state) => state.signUp);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError(null);
    const err = await signUp(email, password);
    if (err) setError(err);
    else setSuccess(true);
  };

  return (
    <View className="flex-1 justify-center px-6 bg-slate-900">
      <Text className="text-3xl font-bold text-white mb-8 text-center">Create Account</Text>
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
      {success && (
        <Text className="text-emerald-400 text-sm mb-3">
          Check your email to confirm your account.
        </Text>
      )}
      <TouchableOpacity onPress={handleRegister} className="bg-indigo-600 py-3 rounded-lg items-center mb-4">
        <Text className="text-white font-semibold">Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSwitchToLogin}>
        <Text className="text-slate-400 text-center">Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}