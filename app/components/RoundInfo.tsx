import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Player } from '../types/game';
import { colors } from '../constants/colors';

interface RoundInfoProps {
  round: number;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  ties?: number;
}

const RoundInfo: React.FC<RoundInfoProps> = ({ round, currentPlayer, winner, ties = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ),
    ]).start();
  }, [round, winner]);

  let message = `RONDA ${round} • TURNO ${currentPlayer}`;
  let messageStyle = styles.defaultText;
  let backgroundColor = 'rgba(0, 217, 255, 0.05)';
  let borderColor = colors.accent;
  let glowColor = colors.accent;

  if (winner === 'draw') {
    message = `🤝 ¡EMPATE! 🤝`;
    messageStyle = styles.drawText;
    backgroundColor = 'rgba(255, 214, 0, 0.05)';
    borderColor = colors.draw;
    glowColor = colors.draw;
  } else if (winner) {
    message = `🎉 ¡JUGADOR ${winner} GANA! 🎉`;
    messageStyle = styles.winnerText;
    backgroundColor = 'rgba(0, 255, 136, 0.1)';
    borderColor = colors.winner;
    glowColor = colors.winner;
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          backgroundColor,
          borderColor,
          shadowColor: glowColor,
        }
      ]}
    >
      <Text style={[styles.message, messageStyle]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  message: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  defaultText: {
    color: colors.accent,
    textShadowColor: colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  drawText: {
    color: colors.draw,
    textShadowColor: colors.draw,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  winnerText: {
    color: colors.winner,
    textShadowColor: colors.winner,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default RoundInfo;