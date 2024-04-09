
// https://www.geeksforgeeks.org/create-a-stop-watch-using-react-native/

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";


const DurationContext = createContext();

export default function DurationProvider({children}) {

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
        setStarted(false)
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
        <DurationContext.Provider value={{
            time
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

 