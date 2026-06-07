import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';

interface TimerProps {
  seconds: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ seconds, isActive }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive && seconds <= 5 && seconds > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        { iterations: seconds }
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]),
        { iterations: Math.min(seconds, 3) }
      ).start();
    } else {
      pulseAnim.setValue(1);
      shakeAnim.setValue(0);
    }
  }, [seconds, isActive]);

  const formatTime = (totalSeconds: number) => {
    const secs = totalSeconds % 60;
    return `00:${secs.toString().padStart(2, '0')}`;
  };

  const timerColor = seconds <= 5 ? colors.timerDanger : colors.timerBackground;
  const timerBorder = seconds <= 5 ? colors.timerDanger : colors.accent;
  const glow = seconds <= 5 ? colors.timerDanger : colors.accent;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: timerColor,
          borderColor: timerBorder,
          shadowColor: glow,
          transform: [{ scale: pulseAnim }, { translateX: shakeAnim }],
        },
      ]}
    >
      <Text style={styles.label}>TIEMPO</Text>
      <Text style={[styles.time, { color: glow }]}>{formatTime(seconds)}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  time: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 255, 136, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    fontFamily: 'Courier New',
  },
});

export default Timer;