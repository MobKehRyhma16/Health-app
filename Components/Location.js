import React, { createContext, useContext, useEffect, useState } from 'react';
import { Location } from 'expo';

const LocationContext = createContext();

export default function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [locationArray, setLocationArray] = useState([]);
  const [pollingActive, setPollingActive] = useState(false);

  useEffect(() => {
    // Function to fetch location every 5 seconds
    const getLocation = async () => {
      try {
        const { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);
        // Add current location to the array
        setLocationArray(prevArray => [...prevArray, [coords.latitude, coords.longitude]]);
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    if (pollingActive) {
      // Fetch location initially and then set interval to fetch every 5 seconds
      getLocation();
      const intervalId = setInterval(getLocation, 5000);

      // Cleanup function to clear interval
      return () => clearInterval(intervalId);
    }
  }, [pollingActive]);

  const startPolling = () => {
    setPollingActive(true);
  };

  const stopPolling = () => {
    setPollingActive(false);
  };

  const resumePolling = () => {
    setPollingActive(true);
  };

  return (
    <LocationContext.Provider value={{ location, locationArray, startPolling, stopPolling, resumePolling }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}

const styles = StyleSheet.create({})