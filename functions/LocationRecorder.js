import { useState, useEffect } from 'react';
import trackLocation from './getLocation';

const useLocationRecorder = () => {
  const [locationList, setLocationList] = useState([]);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    startRecording(); // Start recording when component mounts
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const startRecording = () => {
    // Clear any existing interval
    clearInterval(intervalId);

    // Start a new interval to track location every 3 seconds
    const id = setInterval(() => {
      trackLocation()
        .then(location => {
          setLocationList(prevList => [...prevList, location]);
        })
        .catch(error => {
          console.error('Error recording location:', error);
        });
    }, 3000);

    setIntervalId(id);
  };

  const stopRecording = () => {
    clearInterval(intervalId);
  };

  return { locationList, startRecording, stopRecording };
};

export default useLocationRecorder;
