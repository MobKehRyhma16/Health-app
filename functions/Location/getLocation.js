import * as Location from 'expo-location';

const trackLocation = async () => {
  try {
    // Request permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    // Subscribe to location updates
    Location.watchPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, timeInterval: 3000 }, locationUpdateCallback);
  } catch (error) {
    console.error('Error tracking location:', error);
  }
};

const locationUpdateCallback = (location) => {
  // Extract relevant data from location object
  const { coords, timestamp } = location;
  const { latitude, longitude, altitude, speed } = coords;

  // Log location data
  console.log('Location:', { latitude, longitude, altitude, speed, timestamp });
};

export default trackLocation;
