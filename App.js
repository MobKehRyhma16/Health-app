<<<<<<< HEAD
import { StyleSheet, Text, View } from 'react-native';
import StartWorkoutScreen from './screens/StartWorkout';
=======
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth } from './Firebase/Config';
import MyTabs from './Components/BottomTab';
import LoginScreen from './Screens/LoginScreen';
>>>>>>> ba0a0dfd2409ade7c5f3ba3c32cf9786729ec7fe

const Stack = createNativeStackNavigator();

// Define the AuthNavigator component outside of the App component
const AuthNavigator = () => {
  return (
<<<<<<< HEAD
    <View style={styles.container}>
      <StartWorkoutScreen />
    </View>
=======
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
>>>>>>> ba0a0dfd2409ade7c5f3ba3c32cf9786729ec7fe
  );
};

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
=======
const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Get the authentication instance from your config
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  if (initializing) {
    return null; // Render nothing while initializing
  }

  return (
    <NavigationContainer>
      {user ? <MyTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default App;
>>>>>>> ba0a0dfd2409ade7c5f3ba3c32cf9786729ec7fe
