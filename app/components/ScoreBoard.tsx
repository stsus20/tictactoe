// components/ScoreBoard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '../types/game';
import { colors } from '../constants/colors';

interface ScoreBoardProps {
  scores: { X: number; O: number };
  currentPlayer: Player;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores, currentPlayer }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.card, currentPlayer === 'X' && styles.activeCard]}>
        <Text style={[styles.player, currentPlayer === 'X' && styles.activeText]}>X</Text>
        <Text style={styles.score}>{scores.X}</Text>
      </View>
      <View style={[styles.card, currentPlayer === 'O' && styles.activeCard]}>
        <Text style={[styles.player, currentPlayer === 'O' && styles.activeText]}>O</Text>
        <Text style={styles.score}>{scores.O}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeCard: {
    borderColor: colors.secondary,
    backgroundColor: '#FFF5F5',
    transform: [{ scale: 1.02 }],
  },
  player: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  activeText: {
    color: colors.secondary,
  },
  score: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
});

export default ScoreBoard;