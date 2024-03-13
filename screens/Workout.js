import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
import { firebaseConfig } from '../firebase/config'; // Adjust the path accordingly

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const LocationTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    let interval;

    const startTracking = async () => {
      try {
        await Location.requestForegroundPermissionsAsync();
        setIsTracking(true);
        interval = setInterval(getLocation, 5000); // Update location every 5 seconds
      } catch (error) {
        console.error('Failed to start tracking:', error);
      }
    };

    const getLocation = async () => {
      try {
        const { coords } = await Location.getCurrentPositionAsync({});
        setLocationData(prevData => [...prevData, { latitude: coords.latitude, longitude: coords.longitude }]);
        storeLocationToFirestore(coords.latitude, coords.longitude);
      } catch (error) {
        console.error('Failed to get location:', error);
      }
    };

    if (isTracking) {
      startTracking();
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTracking]);

  const pauseTracking = () => {
    setIsTracking(false);
  };

  const storeLocationToFirestore = async (latitude, longitude) => {
    try {
      await addDoc(collection(db, 'locations'), {
        latitude,
        longitude,
        timestamp: serverTimestamp(),
      });
      console.log('Location stored in Firestore');
    } catch (error) {
      console.error('Error storing location in Firestore:', error);
    }
  };

  const saveAndQuit = () => {
    // Perform any cleanup or navigation
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{isTracking ? 'Tracking enabled' : 'Tracking paused'}</Text>
      <Button title={isTracking ? 'Pause Tracking' : 'Start Tracking'} onPress={() => setIsTracking(prev => !prev)} />
      <Button title="Save and Quit" onPress={saveAndQuit} disabled={!isTracking} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginBottom: 20,
  },
});

export default LocationTracker;
