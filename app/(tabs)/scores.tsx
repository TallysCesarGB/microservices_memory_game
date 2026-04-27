// app/(tabs)/scores.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { LEVELS } from '@/constants/themes';

export default function ScoresTab() {
  const { theme, themeType } = useTheme();
  const { currentLevel, score, totalMoves } = useGame();

  const completedLevels = currentLevel - 1;
  const accuracy = totalMoves > 0 ? Math.round((score / totalMoves) * 100) : 0;

  const stats = [
    { label: 'Níveis Completos', value: String(completedLevels), icon: '🎯' },
    { label: 'Pares Encontrados', value: String(score), icon: '🃏' },
    { label: 'Total de Jogadas', value: String(totalMoves), icon: '👆' },
    { label: 'Precisão', value: `${accuracy}%`, icon: '🎖️' },
  ];

  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🏆</Text>
            <Text style={[styles.title, { color: theme.text, fontFamily: 'Orbitron_900Black' }]}>
              PLACAR
            </Text>
            <Text style={[styles.subtitle, { color: theme.accent, fontFamily: 'Orbitron_400Regular' }]}>
              {themeType === 'pokemon' ? 'Pokémon Edition' : 'Star Wars Edition'}
            </Text>
          </View>

          {/* Stats grid */}
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View
                key={stat.label}
                style={[styles.statCard, {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border + '40',
                }]}
              >
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={[styles.statValue, { color: theme.accent, fontFamily: 'Orbitron_900Black' }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Level breakdown */}
          <Text style={[styles.sectionTitle, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
            PROGRESSO POR NÍVEL
          </Text>

          {LEVELS.map((lvl) => {
            const done = lvl.level < currentLevel;
            const current = lvl.level === currentLevel;
            const locked = lvl.level > currentLevel;
            return (
              <View
                key={lvl.level}
                style={[styles.levelRow, {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: done ? theme.success + '60' : current ? theme.accent + '60' : theme.border + '20',
                  borderWidth: current ? 1.5 : 1,
                }]}
              >
                <Text style={[styles.levelRowLabel, { color: done ? theme.success : current ? theme.accent : theme.textMuted, fontFamily: 'Orbitron_700Bold' }]}>
                  {lvl.label}
                </Text>
                <Text style={[styles.levelRowDesc, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
                  {lvl.description} • {lvl.pairs} pares
                </Text>
                <Text style={styles.levelRowStatus}>
                  {done ? '✅' : current ? '▶️' : '🔒'}
                </Text>
              </View>
            );
          })}

          {/* Trophy if completed all */}
          {currentLevel > LEVELS.length && (
            <View style={[styles.completedBox, { backgroundColor: theme.accent + '20', borderColor: theme.accent }]}>
              <Text style={styles.completedEmoji}>🏆🏆🏆</Text>
              <Text style={[styles.completedText, { color: theme.accent, fontFamily: 'Orbitron_900Black' }]}>
                JOGO COMPLETO!
              </Text>
              <Text style={[styles.completedSub, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
                Você completou todos os níveis!
              </Text>
            </View>
          )}

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
    marginBottom: 28,
    paddingTop: 12,
  },
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 22, letterSpacing: 2, marginBottom: 6 },
  subtitle: { fontSize: 11, letterSpacing: 1 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    width: '47%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statValue: { fontSize: 28, marginBottom: 4 },
  statLabel: { fontSize: 9, letterSpacing: 0.5, textAlign: 'center' },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 3,
    marginBottom: 12,
  },
  levelRow: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelRowLabel: { fontSize: 12, minWidth: 60 },
  levelRowDesc: { flex: 1, fontSize: 9, letterSpacing: 0.3 },
  levelRowStatus: { fontSize: 22 },
  completedBox: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  completedEmoji: { fontSize: 40, marginBottom: 10 },
  completedText: { fontSize: 16, letterSpacing: 2, marginBottom: 8 },
  completedSub: { fontSize: 10, letterSpacing: 0.5, textAlign: 'center' },
});
