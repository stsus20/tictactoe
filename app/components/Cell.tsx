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
  const innerShadow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (value) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [value]);

  const handlePress = () => {
    if (!disabled && !value) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 70,
          useNativeDriver: true,
        }),
      ]).start();
      onPress();
    }
  };

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
      activeOpacity={0.8}
    >
      <Animated.Text style={[styles.text, { transform: [{ scale: scaleAnim }] }, isWinningCell && styles.winningText]}>
        {value}
      </Animated.Text>
      {!value && <View style={styles.emptyShadow} />}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cellBorder,
    backgroundColor: colors.cellBackground,
    position: 'relative',
  },
  winningCell: {
    backgroundColor: colors.winner,
  },
  text: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.textPrimary,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  winningText: {
    color: colors.buttonText,
  },
  emptyShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
});

export default Cell;