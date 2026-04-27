// app/index.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { ThemeType, THEMES } from '@/constants/themes';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const THEME_OPTIONS: { id: ThemeType; bgTop: string; bgBottom: string; cardBg: string; accentColor: string; borderColor: string; icon: string; description: string }[] = [
  {
    id: 'pokemon',
    bgTop: '#0d1117',
    bgBottom: '#1c2a3a',
    accentColor: '#FFCB05',
    borderColor: '#3D7DCA',
    cardBg: '#1c2a3a',
    icon: '⚡',
    description: 'Encontre os pares de Pokémons',
  },
  {
    id: 'starwars',
    bgTop: '#0a0a0a',
    bgBottom: '#1a1a0f',
    accentColor: '#FFE81F',
    borderColor: '#C0A030',
    cardBg: '#1a1a0f',
    icon: '⚔️',
    description: 'Encontre os pares de personagens',
  },
];

export default function ThemeSelectScreen() {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { resetGame } = useGame();
  const [selected, setSelected] = useState<ThemeType | null>(null);

  const scaleAnims = useRef(
    THEME_OPTIONS.map(() => new Animated.Value(1))
  ).current;
  const glowAnims = useRef(
    THEME_OPTIONS.map(() => new Animated.Value(0))
  ).current;

  const handleSelect = (id: ThemeType, index: number) => {
    setSelected(id);
    THEME_OPTIONS.forEach((_, i) => {
      Animated.spring(scaleAnims[i], {
        toValue: i === index ? 1.03 : 0.97,
        useNativeDriver: true,
      }).start();
      Animated.timing(glowAnims[i], {
        toValue: i === index ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  const handleConfirm = () => {
    if (!selected) return;
    setTheme(selected);
    resetGame();
    router.replace('/(tabs)');
  };

  const currentOption = selected ? THEME_OPTIONS.find(t => t.id === selected) : THEME_OPTIONS[0];
  const gradTop = currentOption?.bgTop ?? '#0d1117';
  const gradBottom = currentOption?.bgBottom ?? '#1c2a3a';

  return (
    <LinearGradient
      colors={[gradTop, gradBottom]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.superTitle}>🃏 MEMORY GAME</Text>
            <Text style={styles.title}>Escolha{'\n'}seu Universo</Text>
            <View style={styles.divider} />
            <Text style={styles.subtitle}>Selecione o tema para começar a jogar</Text>
          </View>

          {/* Theme Cards */}
          <View style={styles.cardsRow}>
            {THEME_OPTIONS.map((option, index) => {
              const isSelected = selected === option.id;
              const t = THEMES[option.id];
              return (
                <Animated.View
                  key={option.id}
                  style={[
                    styles.cardWrapper,
                    { transform: [{ scale: scaleAnims[index] }] },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleSelect(option.id, index)}
                    style={[
                      styles.card,
                      {
                        backgroundColor: option.cardBg,
                        borderColor: isSelected ? option.accentColor : option.borderColor + '55',
                        borderWidth: isSelected ? 2.5 : 1,
                      },
                    ]}
                  >
                    {/* Glow overlay */}
                    {isSelected && (
                      <View style={[styles.glowOverlay, { backgroundColor: option.accentColor + '15' }]} />
                    )}

                    {/* Check badge */}
                    {isSelected && (
                      <View style={[styles.checkBadge, { backgroundColor: option.accentColor }]}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}

                    {/* Icon */}
                    <View style={[styles.iconCircle, { borderColor: option.accentColor + '60', backgroundColor: option.accentColor + '20' }]}>
                      <Text style={styles.iconEmoji}>{option.icon}</Text>
                    </View>

                    {/* Name */}
                    <Text style={[styles.cardTitle, { color: option.accentColor, fontFamily: 'Orbitron_900Black' }]}>
                      {t.name}
                    </Text>

                    {/* Subtitle */}
                    <Text style={[styles.cardSubtitle, { color: t.textMuted }]}>
                      {t.subtitle}
                    </Text>

                    {/* Description */}
                    <View style={[styles.cardDescBox, { borderColor: option.borderColor + '40', backgroundColor: option.borderColor + '10' }]}>
                      <Text style={[styles.cardDesc, { color: t.textSecondary }]}>
                        {option.description}
                      </Text>
                    </View>

                    {/* Preview dots */}
                    <View style={styles.previewGrid}>
                      {[0,1,2,3,4,5].map(i => (
                        <View
                          key={i}
                          style={[
                            styles.previewDot,
                            {
                              backgroundColor: isSelected ? option.accentColor + '60' : option.borderColor + '30',
                              borderColor: isSelected ? option.accentColor + '80' : option.borderColor + '20',
                            }
                          ]}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Confirm button */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!selected}
            activeOpacity={0.8}
            style={[
              styles.confirmBtn,
              {
                backgroundColor: selected
                  ? (THEMES[selected]?.accent ?? '#FFCB05')
                  : '#333',
                opacity: selected ? 1 : 0.4,
              }
            ]}
          >
            <Text style={[
              styles.confirmText,
              { color: selected ? '#000' : '#666', fontFamily: 'Orbitron_900Black' }
            ]}>
              {selected ? `JOGAR ${THEMES[selected]?.name.toUpperCase()}` : 'SELECIONE UM TEMA'}
            </Text>
          </TouchableOpacity>

          {/* Bottom spacer */}
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  superTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#888',
    letterSpacing: 3,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 34,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 12,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#555',
    borderRadius: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 28,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 280,
    justifyContent: 'center',
    position: 'relative',
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconEmoji: {
    fontSize: 30,
  },
  cardTitle: {
    fontSize: 15,
    marginBottom: 6,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 9,
    fontFamily: 'Orbitron_400Regular',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  cardDescBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    width: '100%',
  },
  cardDesc: {
    fontSize: 10,
    fontFamily: 'Orbitron_400Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'center',
    width: 60,
  },
  previewDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
  },
  confirmBtn: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  confirmText: {
    fontSize: 12,
    letterSpacing: 1,
  },
});
