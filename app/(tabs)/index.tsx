// app/(tabs)/index.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { LEVELS } from '@/constants/themes';

const { width } = Dimensions.get('window');

const STARS = ['⭐', '⭐⭐', '⭐⭐⭐'];
const LEVEL_ICONS = ['🥉', '🥈', '🥇'];

export default function HomeTab() {
  const router = useRouter();
  const { theme, themeType } = useTheme();
  const { currentLevel, resetGame } = useGame();

  const handlePlayLevel = (level: number) => {
    router.push({ pathname: '/game/level', params: { level: String(level) } });
  };

  const handleNewGame = () => {
    resetGame();
  };

  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.themeEmoji]}>
              {themeType === 'pokemon' ? '⚡' : '⚔️'}
            </Text>
            <Text style={[styles.title, { color: theme.text, fontFamily: 'Orbitron_900Black' }]}>
              MEMORY GAME
            </Text>
            <Text style={[styles.themeName, { color: theme.accent }]}>
              {themeType === 'pokemon' ? 'Pokémon Edition' : 'Star Wars Edition'}
            </Text>
          </View>

          {/* Level progress */}
          <View style={[styles.progressBox, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border + '40' }]}>
            <Text style={[styles.progressLabel, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
              PROGRESSO ATUAL
            </Text>
            <View style={styles.progressBar}>
              {LEVELS.map((lvl) => (
                <View
                  key={lvl.level}
                  style={[
                    styles.progressSegment,
                    {
                      backgroundColor: lvl.level <= currentLevel
                        ? theme.accent
                        : theme.border + '30',
                      borderColor: theme.border + '50',
                    }
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.progressText, { color: theme.textSecondary, fontFamily: 'Orbitron_700Bold' }]}>
              Nível {currentLevel} de {LEVELS.length}
            </Text>
          </View>

          {/* Level Cards */}
          <Text style={[styles.sectionTitle, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
            SELECIONE O NÍVEL
          </Text>

          {LEVELS.map((lvl) => {
            const isUnlocked = lvl.level <= currentLevel;
            const isCompleted = lvl.level < currentLevel;
            const isCurrent = lvl.level === currentLevel;

            return (
              <TouchableOpacity
                key={lvl.level}
                onPress={() => isUnlocked && handlePlayLevel(lvl.level)}
                activeOpacity={isUnlocked ? 0.8 : 1}
                style={[
                  styles.levelCard,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: isCurrent
                      ? theme.accent
                      : isCompleted
                      ? theme.success + '60'
                      : theme.border + '30',
                    borderWidth: isCurrent ? 2 : 1,
                    opacity: isUnlocked ? 1 : 0.4,
                  }
                ]}
              >
                {/* Glow for current */}
                {isCurrent && (
                  <View style={[styles.cardGlow, { backgroundColor: theme.accent + '10' }]} />
                )}

                <View style={styles.levelLeft}>
                  <Text style={styles.levelMedal}>{LEVEL_ICONS[lvl.level - 1]}</Text>
                  <View>
                    <Text style={[styles.levelLabel, { color: theme.accent, fontFamily: 'Orbitron_900Black' }]}>
                      {lvl.label.toUpperCase()}
                    </Text>
                    <Text style={[styles.levelDescription, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
                      {lvl.description}
                    </Text>
                  </View>
                </View>

                <View style={styles.levelRight}>
                  <View style={[styles.pairsTag, { backgroundColor: theme.accent + '20', borderColor: theme.accent + '40' }]}>
                    <Text style={[styles.pairsText, { color: theme.accent, fontFamily: 'Orbitron_700Bold' }]}>
                      {lvl.pairs} pares
                    </Text>
                  </View>
                  <Text style={styles.levelStars}>{STARS[lvl.level - 1]}</Text>
                  {isCompleted && (
                    <Text style={{ fontSize: 20 }}>✅</Text>
                  )}
                  {!isUnlocked && (
                    <Text style={{ fontSize: 20 }}>🔒</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* New game button */}
          <TouchableOpacity
            onPress={handleNewGame}
            activeOpacity={0.8}
            style={[styles.newGameBtn, { borderColor: theme.border + '50' }]}
          >
            <Text style={[styles.newGameText, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
              🔄  REINICIAR DO NÍVEL 1
            </Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 12,
  },
  themeEmoji: {
    fontSize: 42,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    letterSpacing: 2,
    marginBottom: 6,
  },
  themeName: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 12,
    letterSpacing: 1,
  },
  progressBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 10,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  progressSegment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  progressText: {
    fontSize: 11,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 3,
    marginBottom: 12,
  },
  levelCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  levelMedal: {
    fontSize: 32,
  },
  levelLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  levelRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  pairsTag: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pairsText: {
    fontSize: 9,
    letterSpacing: 0.5,
  },
  levelStars: {
    fontSize: 12,
  },
  newGameBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  newGameText: {
    fontSize: 10,
    letterSpacing: 1,
  },
});
