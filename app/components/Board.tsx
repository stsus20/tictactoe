import React, { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Animated } from 'react-native';
import Cell from './Cell';
import { BoardState } from '../types/game';
import { colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.floor(width * 0.85);
const CELL_SIZE = BOARD_SIZE / 3;

interface BoardProps {
  board: BoardState;
  onCellPress: (index: number) => void;
  winningLine: number[] | null;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = React.memo(({ board, onCellPress, winningLine, disabled }) => {
  const boardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(boardAnim, {
      toValue: 1,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, []);

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
          cellSize={CELL_SIZE}
        />
      ))}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#0d1b2a',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.neon1,
    shadowColor: colors.neon1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 20,
    overflow: 'hidden',
  },
});

export default Board;