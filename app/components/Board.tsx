import React, { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Animated } from 'react-native';
import Cell from './Cell';
import { BoardState } from '../types/game';
import { colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.floor(width * 0.85);

interface BoardProps {
  board: BoardState;
  onCellPress: (index: number) => void;
  winningLine: number[] | null;
  disabled: boolean;
  currentPlayer: 'X' | 'O';
}

const Board: React.FC<BoardProps> = React.memo(({ board, onCellPress, winningLine, disabled, currentPlayer }) => {
  const boardAnim = useRef(new Animated.Value(0)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(boardAnim, {
      toValue: 1,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(lineAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(lineAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [board]);

  const activeLineColor = currentPlayer === 'X' ? colors.neon2 : colors.neon3;
  const lineColor = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.neon1, activeLineColor],
  });

  return (
    <Animated.View
      style={[
        styles.board,
        {
          width: BOARD_SIZE,
          height: BOARD_SIZE,
          transform: [{ scale: boardAnim }],
        },
      ]}
    >
      {board.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          onPress={() => onCellPress(index)}
          isWinningCell={winningLine?.includes(index) || false}
          disabled={disabled || value !== null}
        />
      ))}

      <Animated.View style={[styles.gridLine, styles.verticalLine, { backgroundColor: lineColor }]} />
      <Animated.View style={[styles.gridLine, styles.verticalLineSecondary, { backgroundColor: lineColor }]} />
      <Animated.View style={[styles.gridLine, styles.horizontalLine, { backgroundColor: lineColor }]} />
      <Animated.View style={[styles.gridLine, styles.horizontalLineSecondary, { backgroundColor: lineColor }]} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#081026',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.neon1,
    shadowColor: colors.neon1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    opacity: 0.9,
  },
  verticalLine: {
    left: '33.3333%',
  },
  verticalLineSecondary: {
    left: '66.6667%',
  },
  horizontalLine: {
    top: '33.3333%',
    width: '100%',
    height: 2,
    left: 0,
  },
  horizontalLineSecondary: {
    top: '66.6667%',
    width: '100%',
    height: 2,
    left: 0,
  },
});

export default Board;