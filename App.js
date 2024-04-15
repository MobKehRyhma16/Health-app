import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth } from './Firebase/Config';
import MyTabs from './Components/BottomTab';
import LoginScreen from './Screens/LoginScreen';
import InfoScreen from './Screens/InfoScreen';
import HomeScreen from './Screens/HomeScreen';
import OngoingWorkoutScreen from './Screens/OngoingWorkoutScreen';
import { UserProvider } from './helpers/UserProvider';
import DurationProvider from './Components/Duration';
import PedometerStepsProvider from './Components/PedometerSteps';
import LocationProvider from './Components/Location';


const Stack = createNativeStackNavigator();

// Define the AuthNavigator component outside of the App component
const AuthNavigator = () => {
  return (
    <UserProvider>
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Info" component={InfoScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
    </UserProvider>

  );
};

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <DurationProvider>
      <LocationProvider>
      <PedometerStepsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen
                name="Main"
                component={MyTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="OngoingWorkout"
                component={OngoingWorkoutScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      </PedometerStepsProvider>
      </LocationProvider>
    </DurationProvider>

  );
};

export default App;