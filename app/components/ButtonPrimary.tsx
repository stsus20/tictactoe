import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { colors } from '../constants/colors';

interface ButtonPrimaryProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.93,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    onPress();
  };

  const backgroundColor = variant === 'primary' ? colors.buttonBackground : colors.accent;
  const textColor = variant === 'primary' ? colors.buttonText : '#000000';
  const glowColor = variant === 'primary' ? colors.buttonBackground : colors.accent;
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[styles.button, { 
          backgroundColor,
          borderColor: glowColor,
          shadowColor: glowColor,
        }]}
      >
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
              backgroundColor: glowColor,
            },
          ]}
        />
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
    overflow: 'hidden',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default ButtonPrimary;