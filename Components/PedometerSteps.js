import React, { useState, useEffect, createContext, useContext } from 'react';
import { Pedometer } from 'expo-sensors';

const PedometerContext = createContext();

export default function PedometerStepsProvider({ children }) {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState(null);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    if (isAvailable && !subscription) { // Ensure pedoRunning is true and subscription doesn't exist
      const newSubscription = Pedometer.watchStepCount(result => {
          setCurrentStepCount(result.steps);
      });
      setSubscription(newSubscription);
    }
  };

  useEffect(() => {
    console.log('Subscription state: ', subscription)
  }, [subscription]);

  // useEffect(() => {
  //   console.log('Subscribing...');
  //   if (pedoRunning) {
  //     subscribe();
  //   }

  //   return () => {
  //     console.log('Unsubscribing...');
  //     if (subscription) {
  //       subscription.remove();
  //       setSubscription(null);
  //     }
  //   };
  // }, [pedoRunning]); // Subscribe/unsubscribe when isPaused changes

  const onPause = () => {
    console.log('Pausing...');
    if (subscription) {
      subscription.remove(); // Remove subscription if it exists
      setSubscription(null);
    }
  };

  const onResume = () => {
    console.log('Resuming...');
    subscribe();
  };

  const onReset = () => {
    console.log('Resetting...');
    setCurrentStepCount(0);
  };

  return (
    <PedometerContext.Provider value={{
       currentStepCount,
          onPause,
          onResume,
          onReset,
          subscribe
        }}>
      {children}
    </PedometerContext.Provider>
  );
}

export function usePedometer() {
  return useContext(PedometerContext);
}