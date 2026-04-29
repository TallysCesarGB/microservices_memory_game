import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    const response = await signIn(username, password);
    if (response.success) {
      router.replace('/');
    }
  };

  return (
    <LinearGradient colors={['#0a0a0a', '#1c2a3a']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <AuthForm
            title="Entrar"
            subtitle="Use suas credenciais para acessar."
            actionLabel="Fazer login"
            onSubmit={handleLogin}
          />

          <TouchableOpacity onPress={() => router.push('/auth/register')} style={styles.linkButton}>
            <Text style={styles.linkText}>Ainda não tem conta? Registrar</Text>
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
    color: '#FFCB05',
    fontFamily: 'Orbitron_700Bold',
    fontSize: 11,
  },
});