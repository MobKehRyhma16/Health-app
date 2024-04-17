import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Banner, Button, Card, IconButton, Surface } from "react-native-paper";
import DurationProvider, { useDuration } from "../Components/Duration";
import { usePedometer } from "../Components/PedometerSteps";
import { getDistance } from "geolib";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { set } from "firebase/database";

const OngoingWorkoutScreen = ({ navigation }) => {


  // Context variables
  const { currentStepCount, onPause, onResume, onReset, subscribe } =
    usePedometer();
  const { time, pauseStopwatch, startStopwatch, resetStopwatch } =
    useDuration();

  // Other variables
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [modalVisible, setModalVisible] = useState(true);
  const [workoutIsPaused, setWorkoutIsPaused] = useState(true);
  const [distance, setDistance] = useState();


  //Watch user location
  const [location, setLocation] = useState(null)
  const [locationArray, setLocationArray] = useState([])
  const [statusState, setStatusState] = useState('')


  const [subscription, setSubscription] = useState(null);
  const [watchLocation, setWatchLocation] = useState(null);
  const [watchLocationArray, setWatchLocationArray] = useState([])

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
        console.log('Whole location object: ', JSON.stringify(location.coords))
        console.log('Got location:', locationObject);
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
    console.log('watch location array:');
    watchLocationArray.forEach((location, index) => {
      console.log(`Location ${index + 1}: Latitude ${location.latitude}, Longitude ${location.longitude}`);
    });
  }, [watchLocationArray]);

  useEffect(() => {
    console.log('watch location is now', watchLocation);
    if (watchLocation) {
      // Check if the new location is different from the last one
      const lastLocation = watchLocationArray[watchLocationArray.length - 1];
      if (!lastLocation || (lastLocation.latitude !== watchLocation.latitude || lastLocation.longitude !== watchLocation.longitude)) {
        // Add the new location to the array only if it's different
        setWatchLocationArray(prevLocations => [...prevLocations, watchLocation]);
      }
    }
  }, [watchLocation]);

  // useEffect(() => {
  //   (() => {
  //     Location.watchPositionAsync({
  //       accuracy: "high",
  //       distanceInterval: 100,
  //       timeInterval: 10000
  //     }, ({coords}) => {
  //       console.log({coords})
  //       setLocation(coords);
  //     }).then((locationWatcher) => {
  //       setWatcher(locationWatcher);
  //     }).catch((err) => {
  //       console.log(err)
  //     })
  //   })()
  // }, [])





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
    console.log("Ongoing workout started");
    if (workoutIsPaused) {
      // setLocation(null)
      // setLocationArray([])
      setWorkoutIsPaused(false);
      startStopwatch();
      subscribe();
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

    navigation.navigate("Workout");
  };

  const toggleWorkout = () => {
    console.log("toggle workout!");

    setWorkoutIsPaused(!workoutIsPaused);
    if (workoutIsPaused) {
      console.log("toggle workout - start stopwatch");
      startStopwatch();
      onResume();

    } else {
      pauseStopwatch();
      onPause();


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


  return (
    <SafeAreaView style={styles.container}>

      <View style={{ flex: 1, flexGrow: 2 }}>
        {watchLocation && (
          <MapView
            style={{ flex: 1 }} // Add styles for the mapview
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

        {/* {watchLocationArray.map((loc, index) => (
          <Text key={index}>{loc.latitude}, {loc.longitude}</Text>
        ))} */}

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