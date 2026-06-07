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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [round, winner]);

  let message = `Ronda ${round} • Turno de ${currentPlayer}`;
  let messageStyle = styles.defaultText;

  if (winner === 'draw') {
    message = `🤝 ¡Empate! (Empates: ${ties})`;
    messageStyle = styles.drawText;
  } else if (winner) {
    message = `🎉 ¡Jugador ${winner} gana la ronda! 🎉`;
    messageStyle = styles.winnerText;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={[styles.message, messageStyle]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  defaultText: {
    color: colors.textPrimary,
  },
  drawText: {
    color: colors.draw,
  },
  winnerText: {
    color: colors.winner,
    fontWeight: '800',
  },
});

export default RoundInfo;