
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PedometerSteps() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState(null); // State for the subscription

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const newSubscription = Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
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

  return (
      <Text>{currentStepCount}</Text>
  );
}
