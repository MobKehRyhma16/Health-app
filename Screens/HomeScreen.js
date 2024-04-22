import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import Stepcounter from "../Components/Stepcounter";
import GradientBackground from '../Components/LinearGradient';
import Activitybar from "../Components/Activitybar";
import { useUserId } from "../Components/UserIdContext";
import { MapModal, WorkoutItem } from "./HistoryScreen";
import { getLatestWorkout } from "../Firebase/workouts";

export default function HomeScreen() {

    const {userDocumentId } = useUserId()
    const user = userDocumentId
    let latestWorkout = null

    const [modalVisible, setModalVisible] = useState(false)
    const [selectedWorkout, setSelectedWorkout] = useState({})
    

    const fetchLatest = async() => {
        try{
            if(user && user.length>0){
                latestWorkout = await getLatestWorkout(user)
                console.log('Latest workout fetched: ', JSON.stringify(latestWorkout))
            }
        } catch (error){
            console.log('Error fetching workouts at history')
        }
    }

    useEffect(() => {
        fetchLatest()
    }, []);
     



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

                        {latestWorkout.length > 0 && (
                            <WorkoutItem workout={latestWorkout} handleShowWorkout={handleWorkout} id={userDocumentId}/>
                        )}
                        <WorkoutItem workout={latestWorkout} handleShowWorkout={handleWorkout} id={userDocumentId}/>
      
                    <MapModal modalVisible={modalVisible} setModalVisible={setModalVisible} selectedWorkout={selectedWorkout} handleCloseModal={handleCloseModal}></MapModal>
                
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