import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
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
import { Foundation, FontAwesome5 } from "@expo/vector-icons";
import CaloriinaCalculator from "../Components/Caloriina";
import { parseDurationToSeconds } from "../helpers/Functions";

const OngoingWorkoutScreen = ({ navigation, route }) => {
  const { userDocumentId, setUserDocumentId, setUser } = useUserId();

  const { workoutType } = route.params;

  // Context variables
  const { currentStepCount, onPause, onResume, onReset, subscribe } =
    usePedometer();
  const { time, pauseStopwatch, startStopwatch, resetStopwatch } =
    useDuration();

  // Other variables
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [modalVisible, setModalVisible] = useState(true);
  const [savingModalVisible, setSavingModalVisible] = useState(false);
  const [workoutIsPaused, setWorkoutIsPaused] = useState(true);
  const [distance, setDistance] = useState();

  const [velocity, setVelocity] = useState(0)

  //Watch user location
  const [subscription, setSubscription] = useState(null);
  const [watchLocation, setWatchLocation] = useState(null);
  const [watchLocationArray, setWatchLocationArray] = useState([]);


  const [calories, setCalories] = useState();

  useEffect(() => {
    const burnedCalories = CaloriinaCalculator({ workoutType, time, distance });

    if (burnedCalories.length > 0) {
      setCalories(burnedCalories);
    }
  }, [distance]);

  useEffect(() => {
    const timeInSeconds = parseDurationToSeconds(time)
    const speed = distance/timeInSeconds
    setVelocity(speed*3.6)

  }, [distance]);

  //Used to center map to user location
  const mapViewRef = useRef(null);

  const startWatchingLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setStatusState(status);
      return;
    }

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
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
      if (
        !lastLocation ||
        lastLocation.latitude !== watchLocation.latitude ||
        lastLocation.longitude !== watchLocation.longitude
      ) {
        // Add the new location to the array only if it's different
        setWatchLocationArray((prevLocations) => [
          ...prevLocations,
          watchLocation,
        ]);
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

  useEffect(() => {}, [workoutIsPaused]);

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

    await saveWorkout(
      userDocumentId,
      calories,
      currentStepCount,
      time,
      distance,
      workoutType,
      watchLocationArray
    );

    onReset();
    resetStopwatch();

    navigation.navigate("Workout");
  };

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
      "Quit Workout",
      "Are you sure you want to quit the workout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Quit and Save",
          onPress: () => quitAndSave(),
        },
        {
          text: "Quit Without Saving",
          onPress: () => quitWorkout(),
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (watchLocation) {
      const { latitude, longitude } = watchLocation;
      const delta = 0.01; // Adjust this value as needed for zoom level
      mapViewRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: delta,
          longitudeDelta: delta,
        },
        1000
      );
    }
  }, [watchLocation]);

  const handleCenter = () => {
    if (watchLocation) {
      const { latitude, longitude, latitudeDelta, longitudeDelta } =
        watchLocation;
      mapViewRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
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
      <TouchableOpacity
        style={surfaceCompStyles.surface}
        elevation={4}
        onPress={() => toggleVisibility()}
      >
        <View style={surfaceCompStyles.cardContainer}>
          <View style={surfaceCompStyles.rowContainer}>
            <View style={surfaceCompStyles.labelContainer}>
              <FontAwesome5
                name="ruler"
                size={20}
                color="darkblue"
                style={surfaceCompStyles.iconStyle}
              />
              <Text style={surfaceCompStyles.labelTextStyle}>Distance</Text>
            </View>
            <View style={surfaceCompStyles.valueContainer}>
              <Text style={surfaceCompStyles.valueTextStyle}>
                {distance / 1000} km
              </Text>
            </View>
          </View>
          <View style={surfaceCompStyles.rowContainer}>
            <View style={surfaceCompStyles.labelContainer}>
              <FontAwesome5
                name="shoe-prints"
                size={20}
                color="darkgreen"
                style={surfaceCompStyles.iconStyle}
              />
              <Text style={surfaceCompStyles.labelTextStyle}>Steps</Text>
            </View>
            <View style={surfaceCompStyles.valueContainer}>
              <Text style={surfaceCompStyles.valueTextStyle}>
                {currentStepCount}
              </Text>
            </View>
          </View>
          <View style={surfaceCompStyles.rowContainer}>

              <View style={surfaceCompStyles.labelContainer}>
                <FontAwesome5
                  name="fire-alt"
                  size={20}
                  color="red"
                  style={surfaceCompStyles.iconStyle}
                />
                <Text style={surfaceCompStyles.labelTextStyle}>Calories</Text>
              </View>
              <View style={surfaceCompStyles.valueContainer}>
                <Text style={surfaceCompStyles.valueTextStyle}>
                  {calories} cal
                </Text>
              </View>
    
          </View>
          {/* <View style={surfaceCompStyles.rowContainer}>

          <View style={surfaceCompStyles.labelContainer}>
            <FontAwesome5
              name="tachometer-alt"
              size={20}
              color="purple"
              style={surfaceCompStyles.iconStyle}
            />
            <Text style={surfaceCompStyles.labelTextStyle}>AVG Speed</Text>
          </View>
          <View style={surfaceCompStyles.valueContainer}>
            <Text style={surfaceCompStyles.valueTextStyle}>
              {velocity > 0 ? (
                <>{velocity.toFixed(1)} km/h</>
              ): (
                <>{0} km/h</>
              )}
              
            </Text>
          </View>

          </View> */}
        </View>

        <View style={surfaceCompStyles.durationContainer}>
          <Text style={surfaceCompStyles.durationText}>{time}</Text>
        </View>
        <Text style={{ fontSize: 9 }}>tap to close</Text>
      </TouchableOpacity>
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
            showsUserLocation={true}
          >
            {watchLocationArray.length > 1 && (
              <Polyline
                coordinates={watchLocationArray}
                strokeColor="#0099cc"
                strokeWidth={6}
              />
            )}
            {/* Marker for current location */}
            {/* <Marker
              coordinate={{
                latitude: watchLocation.latitude,
                longitude: watchLocation.longitude,
              }}
              title="Your Location"
            >
              <Image
                source={require("../assets/red_marker128.png")}
                style={{ width: 32, height: 32}} // Adjust the width and height as needed
                resizeMode="center"
                resizeMethod="resize"
              />
            </Marker> */}
            
                
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
    padding: 2,
  },
});

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
    width: "85%",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    opacity: 0.9,
    flexDirection: "column",
    alignItems: "center",
  },
  cardContainer: {
    marginBottom: 15,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F0F0", // Add background color to the row container
    borderRadius: 10, // Add border radius to round the corners
    paddingHorizontal: 15, // Add horizontal padding for spacing
    marginBottom: 15, // Adjust margin bottom as needed
    width: "100%",
  },
  labelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  labelTextStyle: {
    fontSize: 20,
    color: "#333333",
    textAlign: "center",
    marginLeft: 5, // Add spacing between icon and text
  },
  valueContainer: {
    flex: 1,
    marginLeft: 8,
    padding: 5,
  },
  valueTextStyle: {
    fontSize: 20,
    color: "#333333",
    textAlign: "right",
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
  iconStyle: {
    marginRight: 5, // Add spacing between icon and text
  },
});

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
    alignItems: "center",
    position: "absolute",
    bottom: 60, // Adjust the bottom position as needed
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2, // Set a higher zIndex to ensure the buttons are rendered above the map
  },

  mapContainer: {
    flex: 1,
    flexGrow: 2,
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, // Add a zIndex to ensure the map is rendered above other elements
  },

  mapView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, // Add a zIndex to ensure the map is rendered above other elements
  },

  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 20,
    // alignContent: 'center'
  },
});

export default OngoingWorkoutScreen;
