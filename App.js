import { StyleSheet, Text, View } from 'react-native';
import LocationView from './screens/ShowLocation';
import RecordLocationScreen from './screens/ShowLocations';

export default function App() {
  return (
    <View style={styles.container}>
      <RecordLocationScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
