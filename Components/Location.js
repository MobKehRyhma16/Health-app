import React, { createContext, useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as Location from "expo-location";

const LocationContext = createContext();

export default function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [locationArray, setLocationArray] = useState([]);
  const [pollingActive, setPollingActive] = useState(false);
  const [quitFlag, setQuitFlag] = useState(false);

  //Todo expo distance interval instead of time

  useEffect(() => {
    if (!quitFlag) {
      console.log("polling active: ", pollingActive);
      const getLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            console.log("Permission to access location was denied");
            return;
          }

          if (pollingActive) {
            const { coords } = await Location.getCurrentPositionAsync({
              enableHighAccuracy: true,
              accuracy: Location.Accuracy.High,
            });
            if (pollingActive) {
              console.log("Location is", coords);
              setLocation(coords);
              setLocationArray((prevArray) => [
                ...prevArray,
                { latitude: coords.latitude, longitude: coords.longitude },
              ]);
            }
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      };

      getLocation(); // Always fetch location initially

      // Start polling and set interval if polling is active
      let intervalId;
      if (pollingActive) {
        intervalId = setInterval(getLocation, 5000);
      }

      // Clear interval when pollingActive changes to false
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [pollingActive]);

  const startPolling = () => {
    setPollingActive(true);
  };

  useEffect(() => {
    if (quitFlag) {
      setLocationArray([]);
    }
  }, [location]);

  const quitPolling = () => {
    setPollingActive(false);
    setLocationArray([]);
    setLocation(null);
    setQuitFlag(true);
    console.log("quit polling", pollingActive, " ", location);
  };

  const stopPolling = () => {
    setPollingActive(false);
    console.log("(stopPolling)polling active : ", pollingActive);
  };

  const resumePolling = () => {
    setPollingActive(true);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        locationArray,
        startPolling,
        stopPolling,
        resumePolling,
        quitPolling,
        setLocation,
        setLocation,
        quitFlag,
        setQuitFlag,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}

const styles = StyleSheet.create({});
