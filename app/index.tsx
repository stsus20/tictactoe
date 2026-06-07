import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ButtonPrimary from '../components/ButtonPrimary';
import { colors } from '../constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/game');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tic Tac Toe</Text>
        <Text style={styles.subtitle}>3 en raya</Text>
        <View style={styles.buttonWrapper}>
          <ButtonPrimary title="Iniciar partida" onPress={handleStart} variant="primary" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 52,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
    letterSpacing: 0.5,
  },
  buttonWrapper: {
    width: '100%',
    minWidth: 220,
  },
});