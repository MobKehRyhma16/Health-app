
// https://www.geeksforgeeks.org/create-a-stop-watch-using-react-native/

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const DurationContext = createContext();

export default function DurationProvider({ children }) {
//   const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const startStopwatch = () => {
    // setRunning(true);
    startTimeRef.current = Date.now() - time * 1000;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    // setRunning(false);
  };



  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime(0);
  };

  const resumeStopwatch = () => {
    // setRunning(true);
    startTimeRef.current = Date.now() - time * 1000;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

//   const toggleStopwatch = () => {
//     if (running) {
//       pauseStopwatch();
//     } else {
//       resumeStopwatch();
//     }
//   };

  return (
    <DurationContext.Provider
      value={{
        time: formatTime(time),
        startStopwatch,
        pauseStopwatch,
        resetStopwatch,
        resumeStopwatch,
      }}
    >
      {children}
    </DurationContext.Provider>
  );
}

export function useDuration() {
  return useContext(DurationContext);
}
