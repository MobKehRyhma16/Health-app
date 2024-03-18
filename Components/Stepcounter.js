import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Caloriecalculator from './Caloriecalculator';

const CALORIES_PER_STEP = 0.05; 

export default function Stepcounter() {
  const [steps, setSteps] = useState(0);
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

  const resetSteps =() => {
    setSteps(0);
  }; //called when pressing reset

  const estimatedCaloriesBurned = steps*CALORIES_PER_STEP;

  return (
    <SafeAreaView style ={StyleSheet.container}>
      <Text style = {StyleSheet.title}>Step Tracker</Text>
      <View style = {styles.infoContainer}>
        <View style = {styles.stepsContainer}>
          <Text style = {styles.stepsText}>{steps}</Text>
          <Text style ={styles.stepsLabel}>Steps</Text>
        </View>
        <View styles = {styles.caloriesContainer}>
        <Caloriecalculator steps={steps} />
        </View>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  infoContainer:{
    alignItems: 'center',
    marginBottom: 20
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  stepsText: {
    fontSize: 36,
    color: '#3498db',
    fontWeight: 'bold',
    marginRight: 8,
  },
  stepsLabel: {
    fontSize: 24,
    color: '#555',
  },
  caloriesContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  caloriesLabel: {
    fontSize: 20,
    color: '#555',
    marginRight: 6,
  },
  caloriesText: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: 'bold',
  }
});
