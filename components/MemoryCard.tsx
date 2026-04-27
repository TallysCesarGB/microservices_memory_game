// components/MemoryCard.tsx
import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { CardItem } from '@/context/GameContext';

interface Props {
  card: CardItem;
  onPress: () => void;
  disabled: boolean;
  cardSize: number;
}

export default function MemoryCard({ card, onPress, disabled, cardSize }: Props) {
  const { theme, themeType } = useTheme();
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shouldShow = card.isFlipped || card.isMatched;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: shouldShow ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    if (card.isMatched) {
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.15, useNativeDriver: true, friction: 5 }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
      ]).start();
    }
  }, [shouldShow, card.isMatched]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0.5, 0.51],
    outputRange: [0, 1],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0.5, 0.51],
    outputRange: [1, 0],
  });

  const isPokemon = themeType === 'pokemon';
  const isSvg = isPokemon;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || card.isFlipped || card.isMatched}
      activeOpacity={0.9}
      style={[styles.wrapper, { width: cardSize, height: cardSize }]}
    >
      <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
        {/* Back face */}
        <Animated.View
          style={[
            styles.face,
            styles.backFace,
            {
              width: cardSize,
              height: cardSize,
              backgroundColor: theme.cardBack,
              borderColor: theme.border,
              transform: [{ rotateY: backInterpolate }],
              opacity: backOpacity,
            }
          ]}
        >
          <View style={[styles.backPattern, { borderColor: theme.accent + '40' }]}>
            <Text style={styles.backEmoji}>
              {isPokemon ? '⚡' : '⚔️'}
            </Text>
            {/* Decorative grid */}
            <View style={[styles.backGrid]}>
              {[...Array(9)].map((_, i) => (
                <View
                  key={i}
                  style={[styles.backGridDot, { backgroundColor: theme.accent + '25', borderColor: theme.accent + '15' }]}
                />
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Front face */}
        <Animated.View
          style={[
            styles.face,
            styles.frontFace,
            {
              width: cardSize,
              height: cardSize,
              backgroundColor: theme.cardFront,
              borderColor: card.isMatched ? theme.success : theme.accent,
              borderWidth: card.isMatched ? 2.5 : 1.5,
              transform: [{ rotateY: frontInterpolate }],
              opacity: frontOpacity,
            }
          ]}
        >
          {card.isMatched && (
            <View style={[styles.matchedOverlay, { backgroundColor: theme.success + '15' }]} />
          )}
          <View style={styles.imageContainer}>
            {isSvg ? (
              <SvgUri
                uri={card.imageUrl}
                width={cardSize * 0.72}
                height={cardSize * 0.72}
              />
            ) : (
              <Image
                source={{ uri: card.imageUrl }}
                style={{ width: cardSize * 0.78, height: cardSize * 0.78 }}
                resizeMode="cover"
              />
            )}
          </View>
          {card.isMatched && (
            <View style={styles.matchBadge}>
              <Text style={styles.matchBadgeText}>✓</Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 4,
  },
  cardContainer: {
    flex: 1,
  },
  face: {
    position: 'absolute',
    top: 0, left: 0,
    borderRadius: 12,
    borderWidth: 1.5,
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backFace: {},
  frontFace: {},
  backPattern: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 8,
    margin: 6,
    position: 'relative',
  },
  backEmoji: {
    fontSize: 24,
    marginBottom: 6,
    zIndex: 2,
  },
  backGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 36,
    gap: 2,
  },
  backGridDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    borderWidth: 1,
  },
  matchedOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  matchBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#56d364',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchBadgeText: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
  },
});
