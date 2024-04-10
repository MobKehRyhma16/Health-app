import React, { useState, useEffect, createContext, useContext } from 'react';
import { Pedometer } from 'expo-sensors';

const PedometerContext = createContext();

export default function PedometerStepsProvider({ children }) {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    if (isAvailable && !subscription) {
      const newSubscription = Pedometer.watchStepCount(result => {
        if (!isPaused) {
          setCurrentStepCount(result.steps);
        }
      });

      setSubscription(newSubscription);
    }
  };

  useEffect(() => {
    console.log('Subscribing...');
    if (!isPaused) {
      subscribe();
    }

    return () => {
      console.log('Unsubscribing...');
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
    };
  }, [isPaused]); // Subscribe/unsubscribe when isPaused changes

  const onPause = () => {
    console.log('Pausing...');
    setIsPaused(true);
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  const onResume = () => {
    console.log('Resuming...');
    setIsPaused(false);
    // Subscribe to pedometer again
    subscribe();
  };

  const onReset = () => {
    console.log('Resetting...');
    setCurrentStepCount(0);
  };

  const togglePedometer = () => {
    if (isPaused) {
      onResume();
    } else {
      onPause();
    }
  };

  return (
    <PedometerContext.Provider value={{ currentStepCount, onPause, onResume, onReset, togglePedometer }}>
      {children}
    </PedometerContext.Provider>
  );
}

export function usePedometer() {
  return useContext(PedometerContext);
}