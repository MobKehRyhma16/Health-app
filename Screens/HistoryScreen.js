import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Modal} from "react-native";
import { getWorkouts, saveWorkout } from "../Firebase/workouts";
import { Foundation, FontAwesome5 } from '@expo/vector-icons';
import { Button, List, Divider, IconButton, Colors, Card} from "react-native-paper";
import GradientBackground from "../Components/LinearGradient";
import HistoryChart from '../Components/HistoryChart'
import { WORKOUTS } from "../Firebase/Config";
import { useUserId } from "../Components/UserIdContext";
import { parseArrayToCoordinates } from "../helpers/Functions";
import MapView, { Marker, Polyline } from "react-native-maps";


export default function HistoryScreen() {

    const {userDocumentId } = useUserId()
    const user = userDocumentId
    const workouts = getWorkouts(user)

    const [modalVisible, setModalVisible] = useState(false)

    const [selectedWorkout, setSelectedWorkout] = useState({})




    const handleWorkout = (workout) => {
        setSelectedWorkout(workout.route);
        setModalVisible(true);
      };
    
      const handleCloseModal = () => {
        setSelectedWorkout(null);
        setModalVisible(false);
      };

  

    return (
        <SafeAreaView style={styles.container}>               
            {/* <Button mode="contained" onPress={() => saveWorkout(userId, 400, 200, 2000, 'walking', testRouteArray)}>TEST SAVE</Button> */}

            <View style={styles.graphContainer}>

                    {workouts.length > 0 && (
                        <HistoryChart workouts={workouts}></HistoryChart>
                    )}

            </View>
            <ScrollView style={styles.workoutsContainer}>

                {workouts && workouts.length > 0 ? (
                    workouts.map((workout, index) => (
                        <WorkoutItem key={index} workout={workout} setModalVisible={setModalVisible} handleShowWorkout={handleWorkout}  />
                    ))
                ) : (
                    <Text style={styles.noWorkoutsText}>No workouts available</Text>
                )}
            </ScrollView>

            <MapModal modalVisible={modalVisible} setModalVisible={setModalVisible} selectedWorkout={selectedWorkout} handleCloseModal={handleCloseModal}></MapModal>
            
         </SafeAreaView>
    );
}

const MapModal = ({ modalVisible, setModalVisible, selectedWorkout, handleCloseModal }) => {
    const [finalRouteObject, setFinalRouteObject] = useState([]);

    useEffect(() => {
        const fetchRoute = async () => {
            if (selectedWorkout) {
                let parsedRouteArray = await parseArrayToCoordinates(selectedWorkout);
                if (parsedRouteArray && parsedRouteArray.length > 0) {
                    setFinalRouteObject(parsedRouteArray);
                }
            }
        };
        fetchRoute();
    }, [modalVisible, selectedWorkout]); // Update when modalVisible or selectedWorkout changes

    // Update initialRegion whenever finalRouteObject changes
    const initialRegion = useMemo(() => {
        if (finalRouteObject.length > 0) {
            const lastCoordinate = finalRouteObject[finalRouteObject.length - 1];
            return {
                latitude: lastCoordinate.latitude,
                longitude: lastCoordinate.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
        }
        return null;
    }, [finalRouteObject]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.mapContainer}>
                    {finalRouteObject.length > 0 && (
                        <MapView
                            style={styles.map}
                            initialRegion={initialRegion}
                        >
                            {finalRouteObject.length > 1 && (
                                <Polyline
                                    coordinates={finalRouteObject}
                                    strokeColor="#0099cc"
                                    strokeWidth={2}
                                />
                            )}
                            {/* Marker for current location */}
                            <Marker
                                coordinate={{
                                    latitude: finalRouteObject[finalRouteObject.length - 1].latitude,
                                    longitude: finalRouteObject[finalRouteObject.length - 1].longitude,
                                }}
                                title="Current Location"
                                description="This is your current location"
                            />
                        </MapView>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        onPress={() => (
                        handleCloseModal(),
                        setFinalRouteObject([])
                        
                        )}

                        style={styles.closeButton}
                        labelStyle={styles.closeButtonText}
                    >
                        CLOSE
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

export const WorkoutItem = ({ workout, handleShowWorkout}) => {

    const workoutObj = workout

    return (
        <View style={styles.workoutItem}>

            <View style={styles.nextTo}>
                <View style={styles.onTop}>
                {(workout.workout_type === 'running' || workout.workout_type === 'walking') && (
                    <View style={styles.row}>
                        <Foundation name="foot" size={35} color="black" />
                        <Text style={styles.largeText}>{workout.steps}</Text>
                    </View>
                    )}

                    <View style={styles.row}>
                        <FontAwesome5 name="fire-alt" size={35} color="black" />
                        <Text style={styles.largeText}>{workout.calories}</Text>
                    </View>
                </View>

                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{workout.duration}</Text>
                    <Text>{workout.distance} m</Text>
                    <Text >{workout.workout_type}</Text>
                </View>

            </View>

            <Text style={styles.createdAtText}>{workout.created_at}</Text>
            <Button icon="map-marker-distance" mode="contained" onPress={() => handleShowWorkout(workoutObj)} buttonColor="lightcoral">
                ROUTE
            </Button>

            {/* <Button> <FontAwesome5 name="route" size={24} color="black" /> </Button> */}
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      mapContainer: {
        width: '90%',
        height: '60%',
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
      },
      map: {
        flex: 1,
      },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#FF5733', // Set your desired color
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    onTop: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 15
    },
    nextTo: {
        flex: 1,
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0',
        

    },
    workoutsContainer: {
        flex: 1,
        height: 15,
    },
    iconButtonContainer:{
        alignItems:'center',
        flex: 1,
        borderWidth: 1,
        width:'30%',
        borderRadius: 5,
        justifyContent: 'center'
    },
    graphContainer: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // height: '35%',
        // borderWidth: 1,
        // borderColor: "#ccc",
        // borderRadius: 8,
        // padding: 16,
        // marginBottom: 12,
        // backgroundColor: 'grey',
        // marginRight: 10,
        // marginLeft: 10
        // backgroundColor:'lightblue',
        flexDirection: 'column',

        margin: 15
    },
    noWorkoutsText: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
    },
    workoutItem: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        backgroundColor: 'white',
        marginRight: 10,
        marginLeft: 10

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    largeText: {
        fontSize: 20,
        marginLeft: 8,
    },
    timeText: {
        fontSize: 30
    },
    timeContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: 15,
        alignItems: 'center'
    },
    createdAtText: {
        marginTop: 8,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

