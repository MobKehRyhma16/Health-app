import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";

const LocationView = () => {
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const trackLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMessage("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      setErrorMessage("Error getting location: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Get Location" onPress={trackLocation} />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      {location && (
        <View style={styles.locationContainer}>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          {location.coords.altitude !== null && (
            <Text>Altitude: {location.coords.altitude}</Text>
          )}
          {location.coords.speed !== null && (
            <Text>Speed: {location.coords.speed}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  locationContainer: {
    marginTop: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default LocationView;
