import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { CellValue } from '../types/game';
import { colors } from '../constants/colors';

interface CellProps {
  index: number;
  value: CellValue;
  onPress: () => void;
  isWinningCell: boolean;
  disabled: boolean;
}

const Cell: React.FC<CellProps> = React.memo(({ index, value, onPress, isWinningCell, disabled }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (value) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    }
  }, [value]);

  const handlePress = () => {
    if (!disabled && !value) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.85,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      onPress();
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 20],
  });

  const isRightColumn = index % 3 === 2;
  const isBottomRow = index >= 6;

  const cellStyle = [
    styles.cell,
    isRightColumn && styles.noRightBorder,
    isBottomRow && styles.noBottomBorder,
    isWinningCell && styles.winningCell,
  ];

  return (
    <TouchableOpacity
      style={cellStyle}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <Animated.Text style={[
        styles.text,
        {
          transform: [
            { scale: scaleAnim },
            { rotateZ: rotation }
          ],
          textShadowRadius: glowRadius,
          textShadowColor: value === 'X' ? colors.neon2 : colors.neon3,
        },
        isWinningCell && styles.winningText
      ]}>
        {value}
      </Animated.Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: '33.333%',
    aspectRatio: 1,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.cellBorder,
    backgroundColor: colors.cellBackground,
    shadowColor: colors.cellBorder,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  noRightBorder: {
    borderRightWidth: 0,
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  winningCell: {
    backgroundColor: 'rgba(0, 255, 136, 0.12)',
    borderColor: colors.winner,
    shadowColor: colors.winner,
    shadowOpacity: 1,
  },
  text: {
    fontSize: 52,
    fontWeight: '900',
    color: colors.textPrimary,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    fontFamily: 'Courier New',
  },
  winningText: {
    color: colors.winner,
    textShadowColor: colors.winner,
    textShadowRadius: 15,
  },
});

export default Cell;