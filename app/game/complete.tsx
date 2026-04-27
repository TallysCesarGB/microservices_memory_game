// app/game/complete.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { LEVELS } from '@/constants/themes';

const { width } = Dimensions.get('window');

const CONFETTI_EMOJIS = ['⭐', '🎉', '✨', '🌟', '💫', '🎊'];

function ConfettiPiece({ delay, x }: { delay: number; x: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const rotAnim = useRef(new Animated.Value(0)).current;
  const emoji = CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)];

  useEffect(() => {
    const startAnimation = () => {
      anim.setValue(0);
      rotAnim.setValue(0);
      Animated.parallel([
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(rotAnim, {
          toValue: 1,
          duration: 2000,
          delay,
          useNativeDriver: true,
        }),
      ]).start(() => startAnimation());
    };
    startAnimation();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-60, 700] });
  const opacity = anim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] });
  const rotate = rotAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] });

  return (
    <Animated.View
      style={[
        styles.confetti,
        { left: x, transform: [{ translateY }, { rotate }], opacity },
      ]}
    >
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
    </Animated.View>
  );
}

export default function CompleteScreen() {
  const router = useRouter();
  const { level, moves, time } = useLocalSearchParams<{ level: string; moves: string; time: string }>();
  const { theme, themeType } = useTheme();
  const { setCurrentLevel, currentLevel } = useGame();

  const levelNumber = parseInt(level ?? '1', 10);
  const movesCount = parseInt(moves ?? '0', 10);
  const timeSeconds = parseInt(time ?? '0', 10);

  const nextLevel = levelNumber + 1;
  const hasNextLevel = nextLevel <= LEVELS.length;
  const isGameComplete = !hasNextLevel;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Update level
    if (levelNumber >= currentLevel) {
      setCurrentLevel(levelNumber + 1);
    }

    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const confettiPieces = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: (width / 14) * i + Math.random() * 20 - 10,
    delay: i * 150,
  }));

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (hasNextLevel) {
      router.replace({
        pathname: '/game/level',
        params: { level: String(nextLevel) },
      });
    } else {
      router.replace('/(tabs)/scores');
    }
  };

  const handleHome = () => {
    router.replace('/(tabs)');
  };

  const levelConfig = LEVELS.find(l => l.level === levelNumber);

  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={styles.container}
    >
      {/* Confetti */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {confettiPieces.map(p => (
          <ConfettiPiece key={p.id} x={p.x} delay={p.delay} />
        ))}
      </View>

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

            {/* Trophy */}
            <View style={[styles.trophyCircle, { borderColor: theme.accent, backgroundColor: theme.accent + '20' }]}>
              <Text style={styles.trophyEmoji}>
                {isGameComplete ? '🏆' : '🎉'}
              </Text>
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: theme.accent, fontFamily: 'Orbitron_900Black' }]}>
              {isGameComplete ? 'JOGO COMPLETO!' : 'NÍVEL COMPLETO!'}
            </Text>

            <Text style={[styles.subtitle, { color: theme.text, fontFamily: 'Orbitron_400Regular' }]}>
              {isGameComplete
                ? 'Você conquistou todos os níveis!'
                : `${levelConfig?.label} concluído com sucesso!`}
            </Text>

            {/* Stats */}
            <View style={[styles.statsBox, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border + '40' }]}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statEmoji}>⏱️</Text>
                  <Text style={[styles.statValue, { color: theme.accent, fontFamily: 'Orbitron_900Black' }]}>
                    {formatTime(timeSeconds)}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
                    TEMPO
                  </Text>
                </View>

                <View style={[styles.statDivider, { backgroundColor: theme.border + '40' }]} />

                <View style={styles.statItem}>
                  <Text style={styles.statEmoji}>👆</Text>
                  <Text style={[styles.statValue, { color: theme.accent, fontFamily: 'Orbitron_900Black' }]}>
                    {movesCount}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
                    JOGADAS
                  </Text>
                </View>

                <View style={[styles.statDivider, { backgroundColor: theme.border + '40' }]} />

                <View style={styles.statItem}>
                  <Text style={styles.statEmoji}>🃏</Text>
                  <Text style={[styles.statValue, { color: theme.success, fontFamily: 'Orbitron_900Black' }]}>
                    {levelConfig?.pairs}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
                    PARES
                  </Text>
                </View>
              </View>
            </View>

            {/* Next level preview */}
            {hasNextLevel && (
              <View style={[styles.nextPreview, { backgroundColor: theme.accent + '15', borderColor: theme.accent + '40' }]}>
                <Text style={[styles.nextLabel, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
                  PRÓXIMO DESAFIO
                </Text>
                <Text style={[styles.nextTitle, { color: theme.accent, fontFamily: 'Orbitron_900Black' }]}>
                  {LEVELS[nextLevel - 1]?.label.toUpperCase()} — {LEVELS[nextLevel - 1]?.description}
                </Text>
                <Text style={[styles.nextDetails, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
                  {LEVELS[nextLevel - 1]?.pairs} pares • Grade {LEVELS[nextLevel - 1]?.cols}×{Math.ceil((LEVELS[nextLevel - 1]?.pairs * 2) / (LEVELS[nextLevel - 1]?.cols ?? 1))}
                </Text>
              </View>
            )}

            {/* Actions */}
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.85}
              style={[styles.primaryBtn, { backgroundColor: theme.accent }]}
            >
              <Text style={[styles.primaryBtnText, { fontFamily: 'Orbitron_900Black' }]}>
                {isGameComplete ? '🏆  VER PLACAR' : `▶  IR PARA ${LEVELS[nextLevel - 1]?.label.toUpperCase()}`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleHome}
              activeOpacity={0.85}
              style={[styles.secondaryBtn, { borderColor: theme.border + '50' }]}
            >
              <Text style={[styles.secondaryBtnText, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
                🏠  VOLTAR AO MENU
              </Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  content: { alignItems: 'center' },
  confetti: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  trophyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  trophyEmoji: { fontSize: 54 },
  title: {
    fontSize: 22,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 28,
    opacity: 0.8,
  },
  statsBox: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statEmoji: { fontSize: 26, marginBottom: 6 },
  statValue: { fontSize: 22, marginBottom: 4 },
  statLabel: { fontSize: 8, letterSpacing: 1 },
  statDivider: { width: 1, height: 60, borderRadius: 1 },
  nextPreview: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  nextLabel: { fontSize: 8, letterSpacing: 2, marginBottom: 6 },
  nextTitle: { fontSize: 14, letterSpacing: 1, marginBottom: 4 },
  nextDetails: { fontSize: 10, letterSpacing: 0.5 },
  primaryBtn: {
    borderRadius: 16,
    paddingVertical: 17,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: {
    fontSize: 11,
    color: '#000',
    letterSpacing: 1,
  },
  secondaryBtn: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 10,
    letterSpacing: 1,
  },
});
