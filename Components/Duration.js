
// https://www.geeksforgeeks.org/create-a-stop-watch-using-react-native/

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";


const DurationContext = createContext();

export default function DurationProvider({children}) {

    const [running, setRunning] = useState(false)
    const [time, setTime] = useState(0); 
    const intervalRef = useRef(null); 
    const startTimeRef = useRef(0); 
    
    // useEffect(() => {
    //     if (started === false){
    //         startStopwatch()
    //         setStarted(true)
    //     }
    // }, []);

    // Function to start the stopwatch 
    const startStopwatch = () => {
        console.log('Start stopwatch function')
        setRunning(true)
        startTimeRef.current = Date.now() - time * 1000; 
        intervalRef.current = setInterval(() => { 
            setTime(Math.floor((Date.now() -  
            startTimeRef.current) / 1000)); 
        }, 1000); 

    }; 

    // Function to pause the stopwatch 
    const pauseStopwatch = () => {
        console.log('Pause stopwatch function')
        clearInterval(intervalRef.current);
        setRunning(false)
    }; 

    // Function to reset the stopwatch 
    const resetStopwatch = () => { 
        clearInterval(intervalRef.current); 
        setTime(0); 

    }; 

    // Function to resume the stopwatch 
    const resumeStopwatch = () => {
        console.log('Resume stopwatch function')
        setRunning(true)
        startTimeRef.current = Date.now() - time * 1000; 
        intervalRef.current = setInterval(() => { 
            setTime(Math.floor( 
                (Date.now() - startTimeRef.current) / 1000)); 
        }, 1000); 

    };

    const toggleStopwatch = () => {
        if (running){
            pauseStopwatch()
        } else{
            resumeStopwatch()
        }
    }
  

    return (
        <DurationContext.Provider value={{
            time, startStopwatch ,pauseStopwatch, resetStopwatch, resumeStopwatch, toggleStopwatch
            }}>

                {children}
        </DurationContext.Provider>

      );
}

export function useDuration() {
    return useContext(DurationContext);
  }



const styles = StyleSheet.create({
    container: {

    }
})

 