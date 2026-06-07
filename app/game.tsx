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
      <View style={styles.header}>
        <ScoreBoard scores={scores} currentPlayer={currentPlayer} />
        <Timer seconds={timer} isActive={isGameActive && !isMatchOver} />
      </View>

      <RoundInfo round={round} currentPlayer={currentPlayer} winner={roundWinner} ties={ties} />

      <Animated.View
        style={{
          transform: [{ scale: boardScale }],
          opacity: boardOpacity,
        }}
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
                    outputRange: [1, 1.1],
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
            🎉 ¡Jugador {gameWinner} gana la partida! 🎉
          </Text>
        </Animated.View>
      )}

      <View style={styles.footer}>
        <ButtonPrimary title="Nueva ronda" onPress={nextRound} disabled={!roundWinner && !isMatchOver} />
        <ButtonPrimary title="Reiniciar juego" onPress={resetGame} variant="secondary" />
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
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    gap: 16,
  },
  celebrationBanner: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: colors.winner,
    paddingVertical: 12,
    borderRadius: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  celebrationText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});