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

  const timerColor = seconds <= 5 ? colors.secondary : colors.timerBackground;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: timerColor,
          transform: [{ scale: pulseAnim }, { translateX: shakeAnim }],
        },
      ]}
    >
      <Text style={styles.label}>Tiempo</Text>
      <Text style={styles.time}>{formatTime(seconds)}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
});

export default Timer;