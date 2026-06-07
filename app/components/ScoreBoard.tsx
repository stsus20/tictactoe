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
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.cellBackground,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    marginRight: 16,
  },
  activeCard: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    shadowColor: colors.primary,
    shadowOpacity: 1,
  },
  player: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: 1,
    textShadowColor: colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  activeText: {
    color: colors.primary,
    textShadowColor: colors.primary,
  },
  score: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 4,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});

export default ScoreBoard;