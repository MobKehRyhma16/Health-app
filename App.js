import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, Text, SafeAreaView, View} from 'react-native';
import Login from './Components/Login';

export default function App() {

  const [logged, setLogged] = useState(false);

  if(logged){
  return (
    <SafeAreaView style={styles.container}>
      <View>
      <Text>You have logged in</Text>
      </View>
    </SafeAreaView>
  );
} else {
  return (
    <Login setLogin={setLogged} />
  );
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  }
});
