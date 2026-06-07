
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

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
              <Animated.Text style={[styles.confetti, { transform: [{ rotate: spin }] }]}>
                🎉✨🎊
              </Animated.Text>
              <Text style={styles.title}>🏆 ¡CAMPEÓN! 🏆</Text>
              <Text style={styles.winnerText}>Jugador {winner}</Text>
              <Text style={styles.subText}>Has ganado la partida</Text>
              <ButtonPrimary title="Jugar de nuevo" onPress={onClose} />
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 48,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 15,
  },
  confetti: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  winnerText: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 28,
    textAlign: 'center',
  },
});

export default WinnerModal;