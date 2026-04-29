import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const handleRegister = async (username: string, password: string) => {
    const response = await signUp(username, password);
    if (response.success) {
      router.replace('/');
    }
  };

  return (
    <LinearGradient colors={['#0d1117', '#1a1a0f']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <AuthForm
            title="Registrar"
            subtitle="Crie sua conta e comece a jogar."
            actionLabel="Criar conta"
            onSubmit={handleRegister}
          />

          <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.linkButton}>
            <Text style={styles.linkText}>Já tem conta? Entrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  linkButton: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: '#FFE81F',
    fontFamily: 'Orbitron_700Bold',
    fontSize: 11,
  },
});