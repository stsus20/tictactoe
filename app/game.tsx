import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Animated, Text } from 'react-native';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import Timer from './components/Timer';
import RoundInfo from './components/RoundInfo';
import WinnerModal from './components/WinnerModal';
import ButtonPrimary from './components/ButtonPrimary';
import { useGame } from './hooks/useGame';
import { colors } from './constants/colors';

export default function GameScreen() {
  const {
    board,
    currentPlayer,
    roundWinner,
    gameWinner,
    scores,
    round,
    ties,
    timer,
    winningLine,
    isGameActive,
    isMatchOver,
    makeMove,
    nextRound,
    resetGame,
  } = useGame();

  const boardScale = useRef(new Animated.Value(0.8)).current;
  const boardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(boardScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(boardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [round]);

  const celebrationAnim = useRef(new Animated.Value(0)).current;
  
  // Auto-advance de ronda después de que alguien gana
  useEffect(() => {
    if (roundWinner && !gameWinner) {
      const timer = setTimeout(() => {
        nextRound();
      }, 3000); // Espera 3 segundos antes de avanzar
      return () => clearTimeout(timer);
    }
  }, [roundWinner, gameWinner, nextRound]);

  useEffect(() => {
    if (gameWinner) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(celebrationAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(celebrationAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();
    } else {
      celebrationAnim.setValue(0);
    }
  }, [gameWinner]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ScoreBoard scores={scores} currentPlayer={currentPlayer} />
          <Timer seconds={timer} isActive={isGameActive && !isMatchOver} />
        </View>

        <RoundInfo round={round} currentPlayer={currentPlayer} winner={roundWinner} ties={ties} />

        <Animated.View
          style={[
            styles.boardWrapper,
            {
              transform: [{ scale: boardScale }],
              opacity: boardOpacity,
            },
          ]}
        >
          <Board
            board={board}
            onCellPress={makeMove}
            winningLine={winningLine}
            disabled={!isGameActive || isMatchOver}
          />
        </Animated.View>

        {gameWinner && (
          <Animated.View
            style={[
              styles.celebrationBanner,
              {
                transform: [
                  {
                    scale: celebrationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.15],
                    }),
                  },
                ],
                opacity: celebrationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ]}
          >
            <Text style={styles.celebrationText}>
              ★ ¡JUGADOR {gameWinner} GANA! ★
            </Text>
          </Animated.View>
        )}

        <View style={styles.footer}>
          <ButtonPrimary title="Nueva ronda" onPress={nextRound} disabled={!roundWinner && !isMatchOver} />
          <ButtonPrimary title="Reiniciar" onPress={resetGame} variant="secondary" />
        </View>
      </View>

      <WinnerModal
        visible={!!gameWinner}
        winner={gameWinner as 'X' | 'O'}
        onClose={resetGame}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  boardWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%',
  },
  celebrationBanner: {
    marginVertical: 12,
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },
  celebrationText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});