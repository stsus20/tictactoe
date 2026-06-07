import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import GameScreen from './app/game';
import { colors } from './app/constants/colors';

export default function App() {
  return (
    <View style={styles.container}>
      <GameScreen />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
