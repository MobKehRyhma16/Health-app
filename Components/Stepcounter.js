import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Caloriecalculator from './Caloriecalculator';
import ActivityCalculator from './ActivityCalculator';

const CALORIES_PER_STEP = 0.05;

export default function Stepcounter({steps,setSteps}) {
  const [isCounting, setisCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimeStamp, setLastTimeStamp] = useState(0);

  useEffect(() => {
    let subscription;
    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const threshold = 0.1; //sensitivity
          const timestamp = new Date().getTime();

          if (
            Math.abs(y - lastY) > threshold &&
            !isCounting &&
            (timestamp - lastTimeStamp > 500) //delay
          ) {
            setisCounting(true)
            setLastY(y);
            setLastTimeStamp(timestamp);

            setSteps((prevSteps) => prevSteps + 2);

            setTimeout(() => {
              setisCounting(false);
            }, 1200);
          }
        });
      } else {
        console.log('Accelerometer not available on this device')
      }
    });
    return () => {
      if (subscription) {
        subscription.remove(); //for performance
      }
    };
  },
    [isCounting, lastY, lastTimeStamp]
  );

  const resetSteps = () => {
    setSteps(0);
  }; //called when pressing reset

  const estimatedCaloriesBurned = steps * CALORIES_PER_STEP;

  return (
    <SafeAreaView>
      <View>
        <View>
          <Text style= {styles.text}>Steps taken: {steps}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

  text: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
});
