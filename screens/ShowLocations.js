import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useLocationRecorder from '../functions/Location/LocationRecorder'; // Assuming you have the useLocationRecorder hook in useLocationRecorder.js

const RecordLocationScreen = () => {
  const { locationList, startRecording, stopRecording } = useLocationRecorder();
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = () => {
    startRecording();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    stopRecording();
    setIsRecording(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record Location</Text>
      <Button title={isRecording ? 'Stop Recording' : 'Start Recording'} onPress={isRecording ? handleStopRecording : handleStartRecording} />

      {locationList.length > 0 && (
        <View style={styles.locationListContainer}>
          <Text style={styles.subtitle}>Recorded Locations:</Text>
          {locationList.map((location, index) => (
            <View key={index} style={styles.locationItem}>
              {location && location.coords && (
                <>
                  <Text>Latitude: {location.coords.latitude}</Text>
                  <Text>Longitude: {location.coords.longitude}</Text>
                  {location.coords.altitude !== undefined && <Text>Altitude: {location.coords.altitude}</Text>}
                  {location.coords.speed !== undefined && <Text>Speed: {location.coords.speed}</Text>}
                </>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0', // Light gray background color
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      marginTop: 20,
      marginBottom: 10,
    },
    locationListContainer: {
      marginTop: 20,
    },
    locationItem: {
      marginBottom: 10,
      color: '#000', // Black text color
    },
  });

export default RecordLocationScreen;
