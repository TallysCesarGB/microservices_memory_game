// context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, ThemeType, THEMES, POKEMON_THEME } from '@/constants/themes';

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  setTheme: (type: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: POKEMON_THEME,
  themeType: 'pokemon',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeType, setThemeType] = useState<ThemeType>('pokemon');

  const setTheme = (type: ThemeType) => {
    setThemeType(type);
  };

  return (
    <ThemeContext.Provider value={{ theme: THEMES[themeType], themeType, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
