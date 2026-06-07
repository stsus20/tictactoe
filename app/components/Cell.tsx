import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { CellValue } from '../types/game';
import { colors } from '../constants/colors';

interface CellProps {
  value: CellValue;
  onPress: () => void;
  isWinningCell: boolean;
  disabled: boolean;
  size: number;
}

const Cell: React.FC<CellProps> = React.memo(({ value, onPress, isWinningCell, disabled, size }) => {
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
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: false,
            }),
          ])
        ),
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

  const cellStyle = [
    styles.cell,
    { width: size, height: size },
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
    borderWidth: 2,
    borderColor: colors.cellBorder,
    backgroundColor: colors.cellBackground,
    shadowColor: colors.cellBorder,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  winningCell: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
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