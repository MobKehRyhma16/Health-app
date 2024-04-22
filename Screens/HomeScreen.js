import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import Stepcounter from "../Components/Stepcounter";
import GradientBackground from '../Components/LinearGradient';
import Activitybar from "../Components/Activitybar";
import { useUserId } from "../Components/UserIdContext";
import { MapModal, WorkoutItem } from "./HistoryScreen";
import { getLatestWorkout } from "../Firebase/workouts";

export default function HomeScreen() {

    const { userDocumentId } = useUserId();
    const user = userDocumentId;
    const [workout, setWorkout] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null); // Initialize with null


    useEffect(() => {

            const fetchData = async () => {
                if (user.length>0) {
                try {
                    const latestWorkoutData = await getLatestWorkout(user);
                    setWorkout(latestWorkoutData); // Update latestWorkout state
                    console.log('Homescreen workout: ', JSON.stringify(latestWorkoutData));
                   
                } catch (error) {
                    console.log('Error fetching workouts at history');
                }
            }
            };

        

            
        fetchData(); // Call the async function
    }, [user]);

    const handleWorkout = () => {
        setSelectedWorkout(latestWorkout.route);
        setModalVisible(true);
      };
    
      const handleCloseModal = () => {
        setSelectedWorkout(null);
        setModalVisible(false);
      };



    // export const WorkoutItem = ({ workout, handleShowWorkout, id})
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View>
                    <Activitybar />
                    
                    {workout && JSON.stringify(workout).length > 0 ? (
                        <View>
                            <Text>Your latest workout</Text>
                            <WorkoutItem workout={workout} handleShowWorkout={handleWorkout} id={workout.id}></WorkoutItem>
                        </View>

                       

                    ): (
                        <Text>No workouts yet!</Text>

                    )}

                  


                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'top',
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});