import React, { useState, useEffect, createContext, useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createIconSet } from 'react-native-vector-icons';

const PedometerContext = createContext()

export default function PedometerStepsProvider({children}) {

  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState(null); // State for the subscription
  const [isPaused, setIsPaused] = useState(false);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const newSubscription = Pedometer.watchStepCount(result => {
        if (!isPaused) {
          setCurrentStepCount(result.steps);
        }
      });

      setSubscription(newSubscription); // Store the subscription in state
    }
  };

  useEffect(() => {
    subscribe();

    // Cleanup function to remove the subscription
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const onPause = () => {
    setIsPaused(true);
  };

  const onResume = () => {
    setIsPaused(false);
  };

  const onReset = () => {
    setCurrentStepCount(0);
  };

    return (
        <PedometerContext.Provider value={{
            currentStepCount, onPause , onResume, onReset
            }}>

                {children}
        </PedometerContext.Provider>

      );
}

export function usePedometer() {
  return useContext(PedometerContext);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsText: {
    fontSize: 20,
    marginBottom: 20,
  },
});






