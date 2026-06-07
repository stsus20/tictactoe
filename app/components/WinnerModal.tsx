
import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { Player } from '../types/game';
import { colors } from '../constants/colors';
import ButtonPrimary from './ButtonPrimary';

interface WinnerModalProps {
  visible: boolean;
  winner: Player;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ visible, winner, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      bounceAnim.setValue(0);
      floatAnim.setValue(0);
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const float = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[
              styles.modal, 
              { 
                transform: [
                  { scale: scaleAnim },
                  { translateY: bounce }
                ] 
              }
            ]}>
              <Animated.Text style={[
                styles.confetti, 
                { transform: [{ rotate: spin }] }
              ]}>
                ✨🎮✨
              </Animated.Text>
              <Animated.Text style={[
                styles.title,
                { transform: [{ translateY: float }] }
              ]}>
                🏆 ¡CAMPEÓN! 🏆
              </Animated.Text>
              <Text style={styles.winnerText}>JUGADOR {winner}</Text>
              <Text style={styles.subText}>★ HAS GANADO LA PARTIDA ★</Text>
              <ButtonPrimary title="Continuar" onPress={onClose} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.cellBackground,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '90%',
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  confetti: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  winnerText: {
    fontSize: 52,
    fontWeight: '900',
    color: colors.accent,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subText: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 28,
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});

export default WinnerModal;