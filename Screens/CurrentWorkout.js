import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from "expo-location";


const WorkoutScreen = () => {
  const [workoutData, setWorkoutData] = useState(null);
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({enableHighAccuracy: true, accuracy: Location.Accuracy.Highest});
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      Location.watchPositionAsync({}, (location) => {
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <Marker coordinate={region} />
      </MapView>
      <View style={styles.workoutDataContainer}>
        <Text>Speed: {workoutData?.coords?.speed} m/s</Text>
        <Text>Distance: (calculate based on coords)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: Dimensions.get('window').height * 0.5,
  },
  workoutDataContainer: {
    flex: 0.5,
    padding: 10,
  },
});

export default WorkoutScreen;
