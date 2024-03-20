import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import { firestore, collection, addDoc, serverTimestamp, query, onSnapshot , WORKOUTS } from "../Firebase/Config";
import { convertFirebaseTimeStampToJS } from "../helpers/Functions";

// import GetWorkout from "../Components/Workouts/GetWorkout";

export default function HistoryScreen() {

    const [workouts, setWorkouts] = useState([])

    useEffect(() => {
        const q = query(collection(firestore, WORKOUTS));
      
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const tempWorkouts = [];
      
          querySnapshot.forEach((doc) => {
            // console.log(doc.data())

            const workoutObject = {
              id: doc.id,
              calories: doc.data().calories,
              created: convertFirebaseTimeStampToJS(doc.data().created_at),
              duration: doc.data().duration,
              route: doc.data().route,
              user_id: doc.data().user_id,
              workout_type: doc.data().workout_type
              
            };

            // console.log(workoutObject)
            tempWorkouts.push(workoutObject);

          });
          setWorkouts(tempWorkouts);
          
          console.log('WORKOUTS:: ', workouts)
          console.log('TEMPWORKOUTS:: ', tempWorkouts)
        });
      
        return () => {
          unsubscribe();
        };
      }, []);


    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.heading}>History</Text>

                {workouts.map((workout) => {
                    <Text>{workout}</Text>
                } )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});