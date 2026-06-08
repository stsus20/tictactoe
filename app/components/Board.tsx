import React, { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Animated } from 'react-native';
import Cell from './Cell';
import { BoardState } from '../types/game';
import { colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.floor(width * 0.75);
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

  // rely on cell borders for internal grid lines; no overlay animations

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
      {board.map((value, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const left = col * CELL_SIZE;
        const top = row * CELL_SIZE;

        return (
          <Animated.View
            key={index}
            style={{ position: 'absolute', left, top, width: CELL_SIZE, height: CELL_SIZE }}
          >
            <Cell
              index={index}
              value={value}
              onPress={() => onCellPress(index)}
              isWinningCell={winningLine?.includes(index) || false}
              disabled={disabled || value !== null}
            />
          </Animated.View>
        );
      })}
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
  // overlay grid styles removed
});

export default Board;