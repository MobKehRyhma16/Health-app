import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const WorkoutScreen = () => {
  const [workoutData, setWorkoutData] = useState(null);

  // Simulate getting workout data (replace with your actual logic)
  useEffect(() => {
    const simulatedData = {
      coords: {
        speed: 0,
        longitude: 25.4729862,
        latitude: 65.013785,
        accuracy: 14322.987367868594,
        heading: 0,
        altitude: 0,
        altitudeAccuracy: -1,
      },
      timestamp: 1.7109288342964048E12,
    };
    setWorkoutData(simulatedData);
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{
        latitude: workoutData?.coords?.latitude || 0,
        longitude: workoutData?.coords?.longitude || 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}>
        {workoutData && <Marker coordinate={workoutData.coords} />}
      </MapView>
      <View style={styles.workoutDataContainer}>
        {/* Display your workout data here */}
        <Text>Speed: {workoutData?.coords?.speed} m/s</Text>
        <Text>Distance: (calculate based on coords)</Text>
        {/* Add more data as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: Dimensions.get('window').height * 0.5, // 50% of screen height
  },
  workoutDataContainer: {
    flex: 0.5, // Remaining 50% of screen height
    padding: 10,
  },
});

export default WorkoutScreen;
