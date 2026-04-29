import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type AuthFormProps = {
  title: string;
  subtitle: string;
  actionLabel: string;
  onSubmit: (username: string, password: string) => Promise<void>;
};

export function AuthForm({ title, subtitle, actionLabel, onSubmit }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await onSubmit(username.trim(), password);
    } catch {
      setError('Não foi possível concluir a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Usuário"
        placeholderTextColor="#7b7b7b"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Senha"
        placeholderTextColor="#7b7b7b"
        secureTextEntry
        style={styles.input}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSubmit}
        disabled={loading || !username || !password}
        style={[styles.button, { opacity: loading || !username || !password ? 0.5 : 1 }]}
      >
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>{actionLabel}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(22, 27, 34, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    color: '#fff',
    fontFamily: 'Orbitron_900Black',
    fontSize: 18,
  },
  subtitle: {
    color: '#9aa4b2',
    fontFamily: 'Orbitron_400Regular',
    fontSize: 11,
    lineHeight: 16,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#0d1117',
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    fontFamily: 'Orbitron_400Regular',
  },
  button: {
    marginTop: 4,
    backgroundColor: '#FFCB05',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Orbitron_900Black',
    fontSize: 12,
  },
  error: {
    color: '#ff7676',
    fontFamily: 'Orbitron_400Regular',
    fontSize: 10,
  },
});