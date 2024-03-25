import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { getWorkouts, saveWorkout } from "../Firebase/workouts";
import { Foundation, FontAwesome5 } from '@expo/vector-icons';
import { Button, List, Divider, IconButton, Colors } from "react-native-paper";
import GradientBackground from "../Components/LinearGradient";

export default function HistoryScreen() {
    const userId = 'VlxwyuiQTxRE1w5eii4kcReqhTU2'; // user id for testing
    const testRouteArray = [[10, 10], [30, 30], [11, 22]] //test array

    const workouts = getWorkouts(userId);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                {/* <Button title="TEST SAVE" onPress={() => saveWorkout(userId,101,201,3000,'running',testRouteArray)}></Button> */}

                <View>

                    {workouts.length > 0 ? (
                        workouts.map((workout, index) => (
                            <WorkoutItem key={index} workout={workout} />
                        ))
                    ) : (
                        <Text>No workouts available</Text>
                    )}
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const WorkoutItem = ({ workout }) => {
    return (
        <View style={styles.workoutItem}>
            <Text><Foundation name="foot" size={24} color="black" />    {workout.steps}</Text>
            <Text><FontAwesome5 name="fire-alt" size={24} color="black" />  {workout.calories}</Text>
            <Text><FontAwesome5 name="clock" size={24} color="black" /> {(workout.duration / 60).toFixed()} MIN</Text>

            <Text>{workout.created_at}</Text>
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
