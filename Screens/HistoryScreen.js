import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Button } from "react-native";
import { getWorkouts, saveWorkout } from "../Firebase/workouts";

export default function HistoryScreen() {
    const userId = 'VlxwyuiQTxRE1w5eii4kcReqhTU2'; // user id for testing
    const testRouteArray = [[10,10],[30,30],[11,22]] //test array

    const workouts = getWorkouts(userId);

    useEffect(() => {
        console.log('WORKOUTS FOR USER_ID ' + userId + ': ', workouts);

        workouts.forEach(workout => {
            console.log(workout.steps);
        });
    }, [workouts]);

    return (
        <SafeAreaView style={styles.container}>               
          <Button title="TEST SAVE" onPress={() => saveWorkout(userId,101,201,3000,'running',testRouteArray)}></Button>

            <View>
                <Text style={styles.heading}>History</Text>
                {workouts.length > 0 ? (
                    workouts.map((workout, index) => (
                        <WorkoutItem key={index} workout={workout} />
                    ))
                ) : (
                    <Text>No workouts available</Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const WorkoutItem = ({ workout }) => {
    return (
        <View style={styles.workoutItem}>
            <Text>Steps: {workout.steps}</Text>
            <Text>Calories: {workout.calories}</Text>
            <Text>Duration: {(workout.duration / 60).toFixed()} minutes</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    workoutItem: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
});
