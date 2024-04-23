import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Modal } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome6, Ionicons, AntDesign } from "@expo/vector-icons";

const StartWorkoutScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const mapRef = useRef(null);
  const [subscription, setSubscription] = useState(null);

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

        setLocation(locationObject);
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

  const startWorkout = (workoutType) => {
    // Navigate to OngoingWorkoutScreen and pass workoutType as a parameter
    setModalVisible(false);
    navigation.navigate("OngoingWorkout", { workoutType: workoutType });
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          ref={mapRef}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsCompass={true}
          userInterfaceStyle="light"
          showsUserLocation={true}
        >
          {/* <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            image={require("../assets/red_marker128.png")}
          ></Marker> */}
        </MapView>
      )}
      <View style={styles.overlayTopContainer}>
        <View style={styles.topBox}>
          <TouchableOpacity
            onPress={() => {
              if (location) {
                const region = {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                };
                mapRef.current.animateToRegion(region);
              }
            }}
          >
            <View style={{ backgroundColor: "red", borderRadius: 30}}>
              <Ionicons
                name="compass"
                size={48}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.overlayBottomContainer}>
        <View style={styles.bottomBox}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => startWorkout("running")}
            >
              <FontAwesome6 name="person-running" size={24} color="white" />
              <Text style={styles.modalText}>Running</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => startWorkout("cycling")}
            >
              <Ionicons name="bicycle" size={24} color="white" />
              <Text style={styles.modalText}>Cycling</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => startWorkout("walking")}
            >
              <FontAwesome6 name="person-walking" size={24} color="white" />
              <Text style={styles.modalText}>Walking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <AntDesign name="closecircle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlayBottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlayTopContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bottomBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    position: "absolute",
    bottom: 40,
  },
  topBox: {
    paddingTop: 50,
    right: "40%",
  },
  button: {
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: "red",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  modalText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10,
  },
  markerImage: {
    width: 35,
    height: 35,
  },
});

export default StartWorkoutScreen;
