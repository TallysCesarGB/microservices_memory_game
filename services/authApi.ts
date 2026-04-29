import { Platform } from 'react-native';

type AuthResponse = {
  success: boolean;
  token: string;
  message: string;
};

const DEFAULT_GATEWAY_URL = Platform.select({
  android: 'http://10.0.2.2:8081',
  ios: 'http://localhost:8081',
  default: 'http://localhost:8081',
});

const GATEWAY_URL = process.env.EXPO_PUBLIC_AUTH_GATEWAY_URL ?? DEFAULT_GATEWAY_URL;

async function postAuth(path: string, username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${GATEWAY_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = (await response.json()) as AuthResponse;

  if (!response.ok) {
    return {
      success: false,
      token: '',
      message: data?.message ?? 'Falha na autenticação',
    };
  }

  return data;
}

export const authApi = {
  login(username: string, password: string) {
    return postAuth('/api/auth/login', username, password);
  },
  register(username: string, password: string) {
    return postAuth('/api/auth/register', username, password);
  },
};