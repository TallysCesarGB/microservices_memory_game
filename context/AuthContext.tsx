import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

import { authApi } from '@/services/authApi';

interface AuthContextType {
  token: string | null;
  username: string | null;
  isReady: boolean;
  signIn: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
}

const TOKEN_KEY = 'memory_game_auth_token';
const USERNAME_KEY = 'memory_game_username';

const AuthContext = createContext<AuthContextType>({
  token: null,
  username: null,
  isReady: false,
  signIn: async () => ({ success: false, message: 'Auth context not ready' }),
  signUp: async () => ({ success: false, message: 'Auth context not ready' }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUsername = await SecureStore.getItemAsync(USERNAME_KEY);
        if (mounted) {
          setToken(storedToken || null);
          setUsername(storedUsername || null);
          setIsReady(true);
        }
      } catch {
        if (mounted) {
          setIsReady(true);
        }
      }
    };

    loadToken();

    return () => {
      mounted = false;
    };
  }, []);

  const persistToken = async (nextToken: string, nextUsername: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, nextToken);
      await SecureStore.setItemAsync(USERNAME_KEY, nextUsername);
      setToken(nextToken);
      setUsername(nextUsername);
    } catch (error) {
      console.error('Erro ao salvar token no SecureStore:', error);
    }
  };

  const signIn = async (username: string, password: string) => {
    const response = await authApi.login(username, password);
    if (response.success && response.token) {
      await persistToken(response.token, username);
    }
    return response;
  };

  const signUp = async (username: string, password: string) => {
    const response = await authApi.register(username, password);
    if (response.success) {
      // Fazer login automático após registro bem-sucedido
      const loginResponse = await authApi.login(username, password);
      if (loginResponse.success && loginResponse.token) {
        await persistToken(loginResponse.token, username);
        return loginResponse;
      }
    }
    return response;
  };

  const signOut = async () => {
    setToken(null);
    setUsername(null);
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USERNAME_KEY);
    } catch (error) {
      console.error('Erro ao deletar token do SecureStore:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, username, isReady, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}