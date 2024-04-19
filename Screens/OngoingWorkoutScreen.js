import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Surface } from "react-native-paper";
import { useDuration } from "../Components/Duration";
import { usePedometer } from "../Components/PedometerSteps";
import { getDistance } from "geolib";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { saveWorkout } from "../Firebase/workouts";
import { useUserId } from "../Components/UserIdContext";


const OngoingWorkoutScreen = ({ navigation, route }) => {

  const {userDocumentId, setUserDocumentId, setUser} = useUserId()

  const { workoutType } = route.params;

  // Context variables
  const { currentStepCount, onPause, onResume, onReset, subscribe } =
    usePedometer();
  const { time, pauseStopwatch, startStopwatch, resetStopwatch } =
    useDuration();

  // Other variables
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [modalVisible, setModalVisible] = useState(true);
  const [savingModalVisible,setSavingModalVisible] = useState(false)
  const [workoutIsPaused, setWorkoutIsPaused] = useState(true);
  const [distance, setDistance] = useState();


  //Watch user location
  const [subscription, setSubscription] = useState(null);
  const [watchLocation, setWatchLocation] = useState(null);
  const [watchLocationArray, setWatchLocationArray] = useState([])


  //Used to center map to user location
  const mapViewRef = useRef(null);
  

  const startWatchingLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setStatusState(status)
      return;
    }

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      location => {

        const { latitude, longitude } = location.coords;
        const locationObject = { latitude, longitude };

        setWatchLocation(locationObject);
      }
    );

    setSubscription(sub);
  };

  useEffect(() => {
    startWatchingLocation();

    // Clean up subscription when component unmounts
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);


  useEffect(() => {

    if (watchLocation && !workoutIsPaused) {
      // Check if the new location is different from the last one
      const lastLocation = watchLocationArray[watchLocationArray.length - 1];
      if (!lastLocation || (lastLocation.latitude !== watchLocation.latitude || lastLocation.longitude !== watchLocation.longitude)) {
        // Add the new location to the array only if it's different
        setWatchLocationArray(prevLocations => [...prevLocations, watchLocation]);
      }
    }
  }, [watchLocation]);


  useEffect(() => {
    if (watchLocationArray.length > 1) {
      let totalDistance = 0;
      for (let i = 0; i < watchLocationArray.length - 1; i++) {
        const currentLocation = watchLocationArray[i];
        const nextLocation = watchLocationArray[i + 1];
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
  }, [watchLocationArray]);



  useEffect(() => {

    if (workoutIsPaused) {
      // setLocation(null)
      // setLocationArray([])
      setWorkoutIsPaused(false);
      startStopwatch();
      subscribe();
    }
  }, []);

  useEffect(() => {

  }, [workoutIsPaused]);

  const quitWorkout = () => {
    pauseStopwatch();
    resetStopwatch();
    setWorkoutIsPaused(true);
    onReset();

    navigation.navigate("Workout");
  };

  const quitAndSave = async () => {
    // const saveWorkout = async (calories, steps, duration, distance, workout_type, routeArray) => {
      pauseStopwatch();
      onPause();
      setWorkoutIsPaused(true);


      await saveWorkout(userDocumentId, caloriesBurned, currentStepCount, time, distance, workoutType, watchLocationArray)
       
      
      onReset();
      resetStopwatch();

      navigation.navigate("Workout");


  }

  const toggleWorkout = () => {

    setWorkoutIsPaused(!workoutIsPaused);
    if (workoutIsPaused) {

      startStopwatch();
      onResume();

    } else {
      pauseStopwatch();
      onPause();


    }
  };

  const toggleVisibility = () => {
    setModalVisible(!modalVisible);
  };

  const showQuitConfirmationAlert = () => {
    Alert.alert(
      'Quit Workout',
      'Are you sure you want to quit the workout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Quit and Save',
          onPress: () => quitAndSave()
        },
        {
          text: 'Quit Without Saving',
          onPress: () => quitWorkout(),
        }

      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (watchLocation) {
      const { latitude, longitude } = watchLocation;
      const delta = 0.01; // Adjust this value as needed for zoom level
      mapViewRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: delta,
        longitudeDelta: delta
      }, 1000);
    }
  }, [watchLocation]);

  const handleCenter = () => {
    if (watchLocation) {
      const { latitude, longitude, latitudeDelta, longitudeDelta } = watchLocation;
      mapViewRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta
      });
    }
  };

  const BottomActions = () => {
    return (
      <>
        <Button
          labelStyle={bottomActionsStyles.buttonLabel}
          textColor="red"
          size={50}
          onPress={() => showQuitConfirmationAlert()}
          icon="cancel"
        ></Button>

        {modalVisible ? (
          <Button
            onPress={() => toggleVisibility()}
            labelStyle={bottomActionsStyles.buttonLabel}
            icon="chevron-down"
          ></Button>
        ) : (
          <Button
            onPress={() => toggleVisibility()}
            labelStyle={bottomActionsStyles.buttonLabel}
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
    return (
      <Surface style={surfaceCompStyles.surface} elevation={4}>
        <View style={surfaceCompStyles.cardStyle}>
          <Text style={surfaceCompStyles.modalTextStyle}>Distance: {distance}</Text>
          <Text style={surfaceCompStyles.modalTextStyle}>Steps: {currentStepCount}</Text>
          <Text style={surfaceCompStyles.modalTextStyle}>Calories Burned: {caloriesBurned}</Text>
        </View>
        <View style={surfaceCompStyles.durationContainer}>
          <Text style={surfaceCompStyles.durationText}>{time}</Text>
        </View>
      </Surface>
    );
  };
  


  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.mapContainer}>
        {watchLocation && (
              <MapView
                ref={mapViewRef}
                style={styles.mapView}
                initialRegion={{
                  latitude: watchLocation.latitude,
                  longitude: watchLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
              }}
            >
            {watchLocationArray.length > 1 && (
              <Polyline
                coordinates={watchLocationArray}
                strokeColor="#0099cc"
                strokeWidth={2}
              />
            )}
            {/* Marker for current location */}
            <Marker
              coordinate={{
                latitude: watchLocation.latitude,
                longitude: watchLocation.longitude,
              }}
              title="Current Location"
              description="This is your current location"
            />
          </MapView>
        )}

      </View>

      <View style={styles.actionsContainer}>
        {modalVisible ? <SurfaceComp /> : null}

        <View style={styles.bottomContainer}>
          <BottomActions />
        </View>
      </View>
    </SafeAreaView>
  );
};

const bottomActionsStyles = StyleSheet.create({
  buttonLabel: {
    fontSize: 30,
    padding: 2
  }

})

const surfaceCompStyles = StyleSheet.create({
  surface: {
    borderRadius: 15,
    margin: 10,
    padding: 15,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '80%',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    opacity: 0.9,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  cardStyle: {
    alignItems: "center",
    marginBottom: 15,
  },
  modalTextStyle: {
    fontSize: 20,
    color: "#333333",
    marginBottom: 10,
    textAlign: "center",
  },
  durationContainer: {
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  durationText: {
    fontSize: 24,
    color: "#333333",
    textAlign: "center",
  },
  timerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 24,
    color: "#333333",
    textAlign: "center",
  },

})

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
    alignItems: 'center'
  },

  mapContainer: {
    flex: 1,
    flexGrow: 2,
    ...StyleSheet.absoluteFillObject
  },

  mapView: {
    ...StyleSheet.absoluteFillObject
  },


  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 20
    // alignContent: 'center'
  },
});

export default OngoingWorkoutScreen;