import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
// import { firestore, collection, addDoc, serverTimestamp, query, onSnapshot , WORKOUTS } from "../Firebase/Config";
// import { convertFirebaseTimeStampToJS } from "../helpers/Functions";
import { getWorkouts } from "../Firebase/getWorkouts";

// import GetWorkout from "../Components/Workouts/GetWorkout";

export default function HistoryScreen() {


    const workouts = getWorkouts('VlxwyuiQTxRE1w5eii4kcReqhTU2')

    //For debugging
    useEffect(() => {
    console.log('WORKOUTS:: ', workouts);

    workouts.forEach(workout => {
      console.log(workout.steps);
    });
    }, [workouts]);

    useEffect(() => {
      
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.heading}>History</Text>

                {/* {workouts.map((workout) => {
                    <Text>{workout}</Text>
                } )} */}
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