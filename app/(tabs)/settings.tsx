// app/(tabs)/settings.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { ThemeType, THEMES } from '@/constants/themes';

const OPTIONS: { id: ThemeType; icon: string }[] = [
  { id: 'pokemon', icon: '⚡' },
  { id: 'starwars', icon: '⚔️' },
];

export default function SettingsTab() {
  const router = useRouter();
  const { theme, themeType, setTheme } = useTheme();
  const { resetGame } = useGame();

  const handleChangeTheme = (id: ThemeType) => {
    if (id === themeType) return;
    setTheme(id);
    resetGame();
  };

  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🎨</Text>
            <Text style={[styles.title, { color: theme.text, fontFamily: 'Orbitron_900Black' }]}>
              CONFIGURAÇÕES
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
            TEMA ATUAL
          </Text>

          {OPTIONS.map((opt) => {
            const t = THEMES[opt.id];
            const isActive = themeType === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleChangeTheme(opt.id)}
                activeOpacity={0.8}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: isActive ? t.accent : theme.border + '30',
                    borderWidth: isActive ? 2 : 1,
                  }
                ]}
              >
                {isActive && (
                  <View style={[styles.activeGlow, { backgroundColor: t.accent + '10' }]} />
                )}
                <Text style={styles.themeIcon}>{opt.icon}</Text>
                <View style={styles.themeInfo}>
                  <Text style={[styles.themeName, { color: isActive ? t.accent : theme.text, fontFamily: 'Orbitron_900Black' }]}>
                    {t.name}
                  </Text>
                  <Text style={[styles.themeSubtitle, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
                    {t.subtitle}
                  </Text>
                </View>
                {isActive && (
                  <View style={[styles.activeBadge, { backgroundColor: t.accent }]}>
                    <Text style={styles.activeBadgeText}>ATIVO</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          <View style={[styles.infoBox, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border + '30' }]}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={[styles.infoText, { color: theme.textMuted, fontFamily: 'Orbitron_400Regular' }]}>
              Trocar o tema reinicia o progresso do jogo e as imagens serão recarregadas.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleGoHome}
            activeOpacity={0.8}
            style={[styles.homeBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.homeBtnText, { fontFamily: 'Orbitron_900Black' }]}>
              🏠  IR PARA INÍCIO
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
    marginBottom: 28,
    paddingTop: 12,
  },
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 22, letterSpacing: 2 },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 3,
    marginBottom: 12,
  },
  themeCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  activeGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  themeIcon: { fontSize: 36 },
  themeInfo: { flex: 1 },
  themeName: { fontSize: 14, marginBottom: 4 },
  themeSubtitle: { fontSize: 9, letterSpacing: 0.5 },
  activeBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  activeBadgeText: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 9,
    color: '#000',
    letterSpacing: 1,
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 8,
  },
  infoIcon: { fontSize: 18 },
  infoText: { flex: 1, fontSize: 10, lineHeight: 16, letterSpacing: 0.3 },
  homeBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeBtnText: {
    fontSize: 12,
    color: '#000',
    letterSpacing: 1,
  },
});
