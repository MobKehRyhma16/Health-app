import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Banner, Button, Card, IconButton, Surface } from "react-native-paper";
import DurationProvider, { useDuration } from "../Components/Duration";
import { usePedometer } from "../Components/PedometerSteps";
import { useLocation } from "../Components/Location";
import { getDistance } from "geolib";
import MapView, { Polyline } from "react-native-maps";

const OngoingWorkoutScreen = ({ navigation }) => {
  // Context variables
  const { currentStepCount, onPause, onResume, onReset, subscribe } =
    usePedometer();
  const { time, pauseStopwatch, startStopwatch, resetStopwatch } =
    useDuration();
  const {
    location,
    setLocation,
    locationArray,
    setLocationArray,
    startPolling,
    stopPolling,
    resumePolling,
    quitPolling,
    quitFlag,
    setQuitFlag,
  } = useLocation();
  // Other variables
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [modalVisible, setModalVisible] = useState(true);
  const [workoutIsPaused, setWorkoutIsPaused] = useState(true);
  const [distance, setDistance] = useState();

  useEffect(() => {
    if (locationArray.length > 1) {
      let totalDistance = 0;
      for (let i = 0; i < locationArray.length - 1; i++) {
        const currentLocation = locationArray[i];
        const nextLocation = locationArray[i + 1];
        const distanceBetweenPoints = getDistance(
          {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
          { latitude: nextLocation.latitude, longitude: nextLocation.longitude }
        );
        totalDistance += distanceBetweenPoints;
      }
      setDistance(totalDistance);
    } else {
      setDistance(0);
    }
  }, [locationArray]);

  useEffect(() => {
    console.log("Ongoing workout started");
    if (workoutIsPaused) {
      // setLocation(null)
      // setLocationArray([])
      setQuitFlag(false);
      setWorkoutIsPaused(false);
      startStopwatch();
      subscribe();
      startPolling();
    }
  }, []);

  useEffect(() => {
    console.log("Workoutispaused state:", workoutIsPaused);
  }, [workoutIsPaused]);

  const quitWorkout = () => {
    pauseStopwatch();
    resetStopwatch();
    setWorkoutIsPaused(true);
    onReset();
    quitPolling();
    navigation.navigate("Workout");
  };

  const toggleWorkout = () => {
    console.log("toggle workout!");

    setWorkoutIsPaused(!workoutIsPaused);
    if (workoutIsPaused) {
      console.log("toggle workout - start stopwatch");
      startStopwatch();
      onResume();
      resumePolling();
    } else {
      pauseStopwatch();
      onPause();
      stopPolling();

      console.log("toggle workout - pause stopwatch");
    }
  };

  const toggleVisibility = () => {
    setModalVisible(!modalVisible);
  };

  const BottomActions = () => {
    return (
      <>
        <Button
          labelStyle={{ fontSize: 30, padding: 2 }}
          textColor="red"
          size={50}
          onPress={() => quitWorkout()}
          icon="cancel"
        ></Button>

        {modalVisible ? (
          <Button
            onPress={() => toggleVisibility()}
            labelStyle={{ fontSize: 30, padding: 2 }}
            icon="chevron-down"
          ></Button>
        ) : (
          <Button
            onPress={() => toggleVisibility()}
            labelStyle={{ fontSize: 30, padding: 2 }}
            icon="chevron-up"
          ></Button>
        )}

        {!workoutIsPaused ? (
          <Button
            onPress={() => toggleWorkout()}
            labelStyle={{ fontSize: 30, padding: 2 }}
            icon="pause-circle-outline"
          ></Button>
        ) : (
          <Button
            onPress={() => toggleWorkout()}
            labelStyle={{ fontSize: 30, padding: 2 }}
            icon="play-circle-outline"
          ></Button>
        )}
      </>
    );
  };

  const SurfaceComp = () => {
    // if (modalVisible) {
    return (
      // <TouchableOpacity onPress={() => toggleVisibility()}>
      <Surface style={styles.surface} elevation={4}>
        <View style={styles.cardStyle}>
          <Text style={styles.modalTextStyle}>Distance: {distance}</Text>
          <Text style={styles.modalTextStyle}>
            DURATION: {time ? time : "Time empty"}
          </Text>
        </View>
        <View style={styles.cardStyle}>
          <Text style={styles.modalTextStyle}>CALORIES: {caloriesBurned}</Text>
          <Text style={styles.modalTextStyle}>STEPS: {currentStepCount}</Text>
        </View>
      </Surface>
    );
    // } else {
    //   return null;
    // }
  };

  console.log(locationArray);

  return (
    <View style={styles.container}>
      <View>
        {location && (
        <MapView
          style={styles.mapView} // Add styles for the mapview
          initialRegion={{
            // Set your initial region here
            latitude: 50.5,
            longitude: 50.5,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {locationArray.length > 1 && (
            <Polyline
              coordinates={locationArray}
              strokeColor="#0099cc" // adjust stroke color as desired
              strokeWidth={2}
            />
          )}
        </MapView>
        )}
      </View>

      <View style={styles.actionsContainer}>
        {modalVisible ? <SurfaceComp /> : null}

        <View style={styles.bottomContainer}>
          <BottomActions />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 35,
  },
  btnStyle: {
    flex: 1,
    justifyContent: "center",
  },
  actionsContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalTextStyle: {
    textAlign: "center",
    fontSize: 20,
  },
  mapView: {
    height: 600,
  },

  surface: {
    // marginTop: '150%',
    // minHeight: '40%',
    borderRadius: 15,
    margin: 10,
    opacity: 0.6,
    // padding: 10,
    // fontSize: '30%',
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    minHeight: "auto",
    padding: 30,
  },
  cardStyle: {
    flex: 1,
    flexGrow: 2,
    textAlign: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // alignContent: 'center'
  },
});

export default OngoingWorkoutScreen;