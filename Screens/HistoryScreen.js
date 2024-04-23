import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Modal, Alert, TouchableOpacity} from "react-native";
import { deleteWorkout, getWorkouts, saveWorkout } from "../Firebase/workouts";
import { Foundation, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Button, List, Divider, IconButton, Colors, Card} from "react-native-paper";
import GradientBackground from "../Components/LinearGradient";
import HistoryChart from '../Components/HistoryChart'
import { WORKOUTS } from "../Firebase/Config";
import { useUserId } from "../Components/UserIdContext";
import { parseArrayToCoordinates, parseDurationToSeconds } from "../helpers/Functions";
import MapView, { Marker, Polyline } from "react-native-maps";



export default function HistoryScreen() {

    const {userDocumentId } = useUserId()
    const user = userDocumentId
    let workouts = null
    
    try{
        workouts = getWorkouts(user)
    } catch (error){
        console.log('Error fetching workouts at history')
    }
    

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
                <GradientBackground>
                    {workouts && workouts.length > 0 ? (
                        workouts.map((workout, index) => (
                            <WorkoutItem  key={index} workout={workout} setModalVisible={setModalVisible} handleShowWorkout={handleWorkout} id={workout.id} historyFlag={true} />
                        ))
                    ) : (
                        <Text style={styles.noWorkoutsText}>No workouts available</Text>
                    )}
                                </GradientBackground>
                </ScrollView>

            <MapModal modalVisible={modalVisible} setModalVisible={setModalVisible} selectedWorkout={selectedWorkout} handleCloseModal={handleCloseModal}></MapModal>
            
         </SafeAreaView>
         

    );
}

export const MapModal = ({ modalVisible, setModalVisible, selectedWorkout, handleCloseModal }) => {
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

export const WorkoutItem = ({ workout, handleShowWorkout, id, historyFlag}) => {

    const showDeleteAndRoute = historyFlag

    const velocityKMH = (workout.distance/parseDurationToSeconds(workout.duration))*3.6

    const handleDelete = async (id) => {
        Alert.alert(
            'Delete workout',
            'Do you want to delete this workout?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete',
                onPress: async () => await deleteWorkout(id)
              }
            ],
            { cancelable: false }
          );
        
    }

    return (

        <View style={workoutItemStyles.container}>
            <View style={workoutItemStyles.header}>
                <View style={{flexDirection: 'row', flex:1, gap: 15}}>
                    <Text style={workoutItemStyles.timestamp}>{workout.created_at}</Text>
                    
                    {workout.workout_type === 'running' && (
                        <FontAwesome6 name="person-running" size={18} color="black" />
                    )}
                    {workout.workout_type === 'walking' && (
                        <FontAwesome6 name="person-walking" size={18} color="black" />
                    )}
                    {workout.workout_type === 'cycling' && (
                        <FontAwesome6 name="bicycle" size={18} color="black" />
                    )}
                </View>

                {historyFlag === true && (
                    <TouchableOpacity onPress={()=> handleDelete(id)}>
                        <FontAwesome5 name="trash" size={20} color="black" />
                    </TouchableOpacity>

                ) }

                

            </View>
            <View style={workoutItemStyles.details}>
                <View style={workoutItemStyles.leftColumn}>
                    {(workout.workout_type === 'running' || workout.workout_type === 'walking') && (
                        <View style={workoutItemStyles.row}>
                            <FontAwesome5 name="shoe-prints" size={20} color="black" />
                            <Text style={workoutItemStyles.detailText}>{workout.steps}</Text>
                            <Text> steps</Text>
                        </View>
                    )}
                    <View style={workoutItemStyles.row}>
                        <FontAwesome5 name="fire-alt" size={20} color="black" />
                        <Text style={workoutItemStyles.detailText}>{workout.calories}</Text>
                        <Text> cal</Text>
                    </View>

                    <View style={workoutItemStyles.row}>
                        <FontAwesome5 name="tachometer-alt" size={20} color="black" />
                        <Text style={workoutItemStyles.detailText}>{velocityKMH.toFixed(1)}</Text> 
                        <Text> km / h</Text>
                    </View>


                    
                </View>
                <View style={workoutItemStyles.rightColumn}>
                    <View style={workoutItemStyles.row}>
                        {/* <FontAwesome5 name="ruler" size={20} color="black" /> */}
                        <Text style={workoutItemStyles.detailText}>{workout.distance / 1000}</Text> 
                        <Text> km</Text>
                    </View>

                    
                    <View style={workoutItemStyles.durationContainer}>
                        <FontAwesome5 name="clock" size={20} color="black" />
                        <Text style={[workoutItemStyles.detailText, workoutItemStyles.duration]}>{workout.duration}</Text>
                    </View>
                    {historyFlag === true && (
                    <Button icon="map-marker-distance" mode="contained" onPress={() => handleShowWorkout(workout)} buttonColor="lightcoral">
                            ROUTE
                    </Button>

                    )} 

                </View>
            </View>
            <View style={workoutItemStyles.footer}>

                

            </View>
        </View>

    );
};

const workoutItemStyles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 19,
        marginBottom: 15,
        elevation: 3,
        gap: 0,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'lightgrey', // Example background color
        borderRadius: 5, // Example border radius
        padding: 5, // Example padding
        marginBottom: 5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    timestamp: {
        fontSize: 12,
        fontStyle: 'italic',
        alignSelf: 'center',
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        justifyContent:'space-between',
        maxWidth: '70%'
    },
    leftColumn: {
        flex: 1,
        gap: 15,
        justifyContent: 'center',
        marginTop: '5%',

    },
    rightColumn: {
        marginTop: '5%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    detailText: {
        marginLeft: 12,
        fontSize: 22,
    },
    typeText: {
        fontSize: 12
    },
    duration: {
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    
})

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
        backgroundColor: '#F5F5F5',
        

    },
    workoutsContainer: {
        flex: 1,
        height: 15,
        borderRadius: 5
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
        marginBottom: 15,
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

