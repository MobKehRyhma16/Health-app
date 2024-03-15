import { StyleSheet, Text, View } from 'react-native';
import StartWorkoutScreen from './screens/StartWorkout';

export default function App() {
  return (
    <View style={styles.container}>
      <StartWorkoutScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
