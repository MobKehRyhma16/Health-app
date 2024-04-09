
// https://www.geeksforgeeks.org/create-a-stop-watch-using-react-native/

import { createContext, useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

const DurationContext = createContext();


const Duration = () => {

    const [started, setStarted] = useState(false)
    const [time, setTime] = useState(0); 
    const intervalRef = useRef(null); 
    const startTimeRef = useRef(0); 
    
    useEffect(() => {
        if (started === false){
            startStopwatch()
            setStarted(false)
        }
    }, []);

    // Function to start the stopwatch 
    const startStopwatch = () => { 
        startTimeRef.current = Date.now() - time * 1000; 
        intervalRef.current = setInterval(() => { 
            setTime(Math.floor((Date.now() -  
            startTimeRef.current) / 1000)); 
        }, 1000); 

    }; 

    // Function to pause the stopwatch 
    const pauseStopwatch = () => { 
        clearInterval(intervalRef.current); 
        setRunning(false); 
    }; 

    // Function to reset the stopwatch 
    const resetStopwatch = () => { 
        clearInterval(intervalRef.current); 
        setTime(0); 

    }; 

    // Function to resume the stopwatch 
    const resumeStopwatch = () => { 
        startTimeRef.current = Date.now() - time * 1000; 
        intervalRef.current = setInterval(() => { 
            setTime(Math.floor( 
                (Date.now() - startTimeRef.current) / 1000)); 
        }, 1000); 

    }; 
  

    return (
        <Text>{time}</Text>

      );
}

const styles = StyleSheet.create({
    container: {

    }
})
 
export default Duration;