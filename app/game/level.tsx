// app/game/level.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useGame, CardItem } from '@/context/GameContext';
import {
  LEVELS,
  POKEMON_TOTAL,
  STARWARS_TOTAL,
  getPokemonImageUrl,
  getStarWarsImageUrl,
  getRandomUniqueIds,
} from '@/constants/themes';
import MemoryCard from '@/components/MemoryCard';

const { width } = Dimensions.get('window');
const PADDING = 20;

function buildCards(imageIds: number[], getUrl: (id: number) => string): CardItem[] {
  const paired = [...imageIds, ...imageIds].map((id, idx) => ({
    id: `card-${id}-${idx}`,
    imageId: id,
    imageUrl: getUrl(id),
    isFlipped: false,
    isMatched: false,
  }));
  // Shuffle
  for (let i = paired.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paired[i], paired[j]] = [paired[j], paired[i]];
  }
  return paired;
}

export default function LevelScreen() {
  const router = useRouter();
  const { level: levelParam } = useLocalSearchParams<{ level: string }>();
  const { theme, themeType } = useTheme();
  const { usedImageIds, addUsedImageIds, setCurrentLevel, setScore, setTotalMoves, score, totalMoves } = useGame();

  const levelNumber = parseInt(levelParam ?? '1', 10);
  const levelConfig = LEVELS.find(l => l.level === levelNumber) ?? LEVELS[0];

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const total = themeType === 'pokemon' ? POKEMON_TOTAL : STARWARS_TOTAL;
  const getUrl = themeType === 'pokemon' ? getPokemonImageUrl : getStarWarsImageUrl;
  const cols = levelConfig.cols;
  const cardSize = Math.floor((width - PADDING * 2 - cols * 8) / cols);

  // Init cards
  useEffect(() => {
    setLoading(true);
    const ids = getRandomUniqueIds(total, levelConfig.pairs, usedImageIds);
    addUsedImageIds(ids);
    const built = buildCards(ids, getUrl);
    setCards(built);
    setLoading(false);
    setFlippedIds([]);
    setMoves(0);
    setMatchedCount(0);
    setTimeElapsed(0);
    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [levelNumber, themeType]);

  // Pulse animation when matched
  useEffect(() => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.05, duration: 150, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [matchedCount]);

  // Check for win
  useEffect(() => {
    if (!loading && matchedCount === levelConfig.pairs && matchedCount > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      // update global score & moves
      setScore(score + matchedCount);
      setTotalMoves(totalMoves + moves);
      // short delay then navigate to complete
      setTimeout(() => {
        router.replace({
          pathname: '/game/complete',
          params: {
            level: String(levelNumber),
            moves: String(moves),
            time: String(timeElapsed),
          },
        });
      }, 800);
    }
  }, [matchedCount, loading]);

  const handleCardPress = useCallback((cardId: string) => {
    if (isChecking) return;
    if (flippedIds.length === 2) return;

    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c));

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);

      const [id1, id2] = newFlipped;
      const card1 = cards.find(c => c.id === id1);
      const card2 = cards.find(c => c.id === id2);

      if (card1 && card2 && card1.imageId === card2.imageId) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === id1 || c.id === id2 ? { ...c, isMatched: true, isFlipped: true } : c
          ));
          setMatchedCount(m => m + 1);
          setFlippedIds([]);
          setIsChecking(false);
        }, 400);
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c
          ));
          setFlippedIds([]);
          setIsChecking(false);
        }, 900);
      }
    }
  }, [flippedIds, cards, isChecking]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleBack = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    router.back();
  };

  const progress = levelConfig.pairs > 0 ? matchedCount / levelConfig.pairs : 0;

  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={[styles.backBtn, { borderColor: theme.border + '60' }]}>
            <Text style={[styles.backText, { color: theme.accent }]}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.levelTitle, { color: theme.accent, fontFamily: 'Orbitron_900Black' }]}>
              {levelConfig.label.toUpperCase()}
            </Text>
            <Text style={[styles.levelDesc, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
              {levelConfig.description}
            </Text>
          </View>

          <View style={[styles.timerBox, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border + '40' }]}>
            <Text style={[styles.timerText, { color: theme.accent, fontFamily: 'PressStart2P_400Regular' }]}>
              {formatTime(timeElapsed)}
            </Text>
          </View>
        </View>

        {/* Stats bar */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border + '30' }]}>
            <Text style={[styles.statNum, { color: theme.accent, fontFamily: 'Orbitron_900Black' }]}>{moves}</Text>
            <Text style={[styles.statLbl, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>JOGADAS</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border + '30' }]}>
            <Text style={[styles.statNum, { color: theme.success, fontFamily: 'Orbitron_900Black' }]}>
              {matchedCount}/{levelConfig.pairs}
            </Text>
            <Text style={[styles.statLbl, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>PARES</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBg, { backgroundColor: theme.border + '25' }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.accent,
                  width: `${progress * 100}%` as any,
                  transform: [{ scaleX: pulseAnim }],
                }
              ]}
            />
          </View>
        </View>

        {/* Game board */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={[styles.loadingText, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
              Carregando imagens...
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.boardContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.board, { paddingHorizontal: PADDING }]}>
              {cards.map((card) => (
                <MemoryCard
                  key={card.id}
                  card={card}
                  onPress={() => handleCardPress(card.id)}
                  disabled={isChecking}
                  cardSize={cardSize}
                />
              ))}
            </View>
            <View style={{ height: 24 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 16,
    letterSpacing: 2,
  },
  levelDesc: {
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 2,
  },
  timerBox: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timerText: {
    fontSize: 11,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    marginBottom: 2,
  },
  statLbl: {
    fontSize: 8,
    letterSpacing: 1,
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 11,
    letterSpacing: 1,
  },
  boardContainer: {
    flexGrow: 1,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
