import React, { useState, useEffect, createContext, useContext } from 'react';
import { Pedometer } from 'expo-sensors';

const PedometerContext = createContext();

export default function PedometerStepsProvider({ children }) {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [pedoRunning, setPedoRunning] = useState(false);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    if (isAvailable && !subscription && pedoRunning) { // Ensure pedoRunning is true and subscription doesn't exist
      const newSubscription = Pedometer.watchStepCount(result => {
        if (pedoRunning) {
          setCurrentStepCount(result.steps);
        }
      });
      setSubscription(newSubscription);
    }
  };

  useEffect(() => {
    console.log(pedoRunning)
  }, [pedoRunning]);

  useEffect(() => {
    console.log('Subscribing...');
    if (pedoRunning) {
      subscribe();
    }

    return () => {
      console.log('Unsubscribing...');
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
    };
  }, [pedoRunning]); // Subscribe/unsubscribe when isPaused changes

  const onPause = () => {
    console.log('Pausing...');
    setPedoRunning(false);
    if (subscription) {
      subscription.remove(); // Remove subscription if it exists
      setSubscription(null);
    }
  };

  const onResume = () => {
    console.log('Resuming...');
    setPedoRunning(true);
    // Subscribe to pedometer again
    subscribe();
  };

  const onReset = () => {
    console.log('Resetting...');
    setCurrentStepCount(0);
  };

  const togglePedometer = () => {
    if (!pedoRunning) {
      onResume();
    } else {
      onPause();
    }
  };

  return (
    <PedometerContext.Provider value={{
       currentStepCount,
          onPause,
          onResume,
          onReset,
          togglePedometer,
          pedoRunning,
          setPedoRunning
        }}>
      {children}
    </PedometerContext.Provider>
  );
}

export function usePedometer() {
  return useContext(PedometerContext);
}