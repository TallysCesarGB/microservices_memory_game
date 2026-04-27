// constants/themes.ts

export type ThemeType = 'pokemon' | 'starwars';

export interface Theme {
  id: ThemeType;
  name: string;
  subtitle: string;
  emoji: string;
  // Colors
  background: string;
  backgroundSecondary: string;
  cardBack: string;
  cardBackSecondary: string;
  cardFront: string;
  accent: string;
  accentSecondary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  border: string;
  borderGlow: string;
  // Tab bar
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  // Gradient
  gradientStart: string;
  gradientEnd: string;
  // Card pattern
  cardPattern: string;
}

export const POKEMON_THEME: Theme = {
  id: 'pokemon',
  name: 'Pokémon',
  subtitle: 'Gotta catch \'em all!',
  emoji: '⚡',
  background: '#0d1117',
  backgroundSecondary: '#161b22',
  cardBack: '#1c2a3a',
  cardBackSecondary: '#243447',
  cardFront: '#1a2332',
  accent: '#FFCB05',
  accentSecondary: '#3D7DCA',
  text: '#FFFFFF',
  textSecondary: '#FFCB05',
  textMuted: '#8b949e',
  success: '#56d364',
  border: '#3D7DCA',
  borderGlow: '#FFCB05',
  tabBarBackground: '#0d1117',
  tabBarActive: '#FFCB05',
  tabBarInactive: '#484f58',
  gradientStart: '#0d1117',
  gradientEnd: '#1c2a3a',
  cardPattern: '#3D7DCA',
};

export const STARWARS_THEME: Theme = {
  id: 'starwars',
  name: 'Star Wars',
  subtitle: 'May the Force be with you',
  emoji: '⚔️',
  background: '#0a0a0a',
  backgroundSecondary: '#111111',
  cardBack: '#1a1a0f',
  cardBackSecondary: '#222211',
  cardFront: '#111108',
  accent: '#FFE81F',
  accentSecondary: '#C0A030',
  text: '#FFFFFF',
  textSecondary: '#FFE81F',
  textMuted: '#666655',
  success: '#00FF41',
  border: '#C0A030',
  borderGlow: '#FFE81F',
  tabBarBackground: '#0a0a0a',
  tabBarActive: '#FFE81F',
  tabBarInactive: '#444433',
  gradientStart: '#0a0a0a',
  gradientEnd: '#1a1a0f',
  cardPattern: '#C0A030',
};

export const THEMES: Record<ThemeType, Theme> = {
  pokemon: POKEMON_THEME,
  starwars: STARWARS_THEME,
};

// Image helpers
export const POKEMON_TOTAL = 1025;
export const STARWARS_TOTAL = 88;

export function getPokemonImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
}

export function getStarWarsImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/vieraboschkova/swapi-gallery/main/static/assets/img/people/${id}.jpg`;
}

export function getRandomUniqueIds(total: number, count: number, exclude: number[] = []): number[] {
  const available: number[] = [];
  for (let i = 1; i <= total; i++) {
    if (!exclude.includes(i)) available.push(i);
  }
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Level configs
export interface LevelConfig {
  level: number;
  pairs: number;
  label: string;
  description: string;
  cols: number;
}

export const LEVELS: LevelConfig[] = [
  { level: 1, pairs: 6,  label: 'Nível 1', description: 'Iniciante',    cols: 3 },
  { level: 2, pairs: 10, label: 'Nível 2', description: 'Intermediário', cols: 4 },
  { level: 3, pairs: 15, label: 'Nível 3', description: 'Expert',        cols: 5 },
];
