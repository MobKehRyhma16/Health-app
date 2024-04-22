import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, TouchableOpacity, ac } from "react-native";
import Stepcounter from "../Components/Stepcounter";
import GradientBackground from '../Components/LinearGradient';
import Activitybar from "../Components/Activitybar";
import { useUserId } from "../Components/UserIdContext";
import { MapModal, WorkoutItem } from "./HistoryScreen";
import { getLatestWorkout } from "../Firebase/workouts";
import {FontAwesome5} from '@expo/vector-icons';
import { ActivityIndicator } from "react-native-paper";


export default function HomeScreen({navigation}) {

    const { userDocumentId } = useUserId();
    const user = userDocumentId;
    const [workout, setWorkout] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null); // Initialize with null

    const fetchData = async () => {
        if (user && user.length>0) {
        try {
            const latestWorkoutData = await getLatestWorkout(user);
            setWorkout(latestWorkoutData); // Update latestWorkout state
           
        } catch (error) {
            console.log('Error fetching workouts at history');
        }
    }
    };

    useEffect(() => {
        fetchData(); // Call the async function
    }, [user]);

    const refreshHomePage = () => {
        fetchData()
    }

    const handleWorkout = () => {
        setSelectedWorkout(workout.route);
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

                        <View style={latestWorkoutStyles.container}>
                        <View style={latestWorkoutStyles.header}>
                            <View style={latestWorkoutStyles.headerContent}>
                                <Text style={latestWorkoutStyles.headerText}>Latest workout</Text>
                                <TouchableOpacity onPress={refreshHomePage}>
                                    <FontAwesome5 name="sync-alt" size={20} color="lightgreen" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={latestWorkoutStyles.workoutItemContainer} onPress={() => navigation.navigate('History')}>
                            <WorkoutItem workout={workout} handleShowWorkout={handleWorkout} id={workout.id}></WorkoutItem>
                        </TouchableOpacity>
                        </View>
                                                

                       

                    ): (<>
                        {JSON.stringify(workout).length < 0 ? (
                            <View style={latestWorkoutStyles.container}>
                                <Text style={latestWorkoutStyles.headerText}>No workouts yet!</Text>
                            </View>

                        ) : (
                            <View style={latestWorkoutStyles.container}>
                                <ActivityIndicator size="medium" color="white" />
                            </View>

                        )} 

                        
                        </>      
                    )}



                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const latestWorkoutStyles = StyleSheet.create({
    container: {
        marginTop: 50,
        justifyContent: 'space-around',
        textAlign: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white',
        marginRight: 10,
        alignSelf:'center'
    },
    workoutItemContainer: {
        marginTop: 10,
        minWidth: '100%',
    },


})

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