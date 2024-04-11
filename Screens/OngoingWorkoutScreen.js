import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Banner, Button, Card, IconButton, Surface } from 'react-native-paper';
import DurationProvider, { useDuration } from '../Components/Duration';
import { usePedometer } from '../Components/PedometerSteps';
import { useLocation } from '../Components/Location';

const OngoingWorkoutScreen = ({ navigation }) => {
  // Context variables
  const { currentStepCount, onPause, onResume, onReset, subscribe } = usePedometer();
  const { time, pauseStopwatch, startStopwatch, resetStopwatch } = useDuration();
  const { location, locationArray, startPolling, stopPolling, resumePolling } = useLocation();
  // Other variables
  const [speed, setSpeed] = useState(0);
  const [steps, setSteps] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [modalVisible, setModalVisible] = useState(true);
  const [workoutIsPaused, setWorkoutIsPaused] = useState(true)

  useEffect(() => {
    console.log('Ongoing workout started');
    if(workoutIsPaused){
      setWorkoutIsPaused(false)
      startStopwatch()
      subscribe()
    }
  }, []);

  useEffect(() => {
    console.log('Workoutispaused state:',workoutIsPaused)
  }, [workoutIsPaused]);


  const quitWorkout = () => {
    pauseStopwatch();
    resetStopwatch();
    setWorkoutIsPaused(true)
    onReset()
    navigation.navigate('Workout');
  };

  const toggleWorkout = () => {
    console.log('toggle workout!')

      setWorkoutIsPaused(!workoutIsPaused)
      if (workoutIsPaused){
        console.log('toggle workout - start stopwatch')
        startStopwatch()
        onResume()
      } else {
        pauseStopwatch()
        onPause()
        console.log('toggle workout - pause stopwatch')
    }
  };

  const toggleVisibility = () => {
    setModalVisible(!modalVisible);
  };

  const BottomActions = () => {
    return (
      <>
          <Button labelStyle={{fontSize: 30, padding: 5}} textColor='red' size={50} onPress={() => quitWorkout()} icon="cancel"></Button>

          <IconButton labelStyle={{padding: 10}} onPress={() => toggleVisibility()} size={35} mode='contained' icon='chevron-up'></IconButton>

          {!workoutIsPaused ? (
            <Button onPress={() => toggleWorkout()} labelStyle={{fontSize: 30, padding: 5}} icon="pause-circle-outline"></Button>
          ) : (
            <Button onPress={() => toggleWorkout()} labelStyle={{fontSize: 30, padding: 5}} icon="play-circle-outline"></Button>
          )}
    </>


    );
  };

  const SurfaceComp = () => {
    // if (modalVisible) {
      return (
        // <TouchableOpacity onPress={() => toggleVisibility()}>
          <Surface style={styles.surface} elevation={4}>
                <View style={styles.cardStyle}>
                  <Text style={styles.modalTextStyle}>SPEED: {location}</Text>
                  <Text style={styles.modalTextStyle}>DURATION: {time ? time : 'Time empty'}</Text>
                </View>
                <View style={styles.cardStyle}>
                  <Text style={styles.modalTextStyle}>CALORIES: {caloriesBurned}</Text>
                  <Text style={styles.modalTextStyle}>STEPS: {currentStepCount}</Text>
                </View>
          </Surface>

      );
    // } else {
    //   return null;
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.actionsContainer}>
        {modalVisible ? (<SurfaceComp />


        ) : (null)}
        
        <View style={styles.bottomContainer}>
          <BottomActions />
        </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  actionsContainer:{
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalTextStyle: {
    textAlign: 'center',
    fontSize: 20
  },

  surface: {
    // marginTop: '150%',
    // minHeight: '40%',
    borderRadius: 15,
    margin: 10,
    opacity: 0.6,
    // padding: 10,
    // fontSize: '30%',
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: 'auto',
    padding: 30
  },
  cardStyle: {
    flex: 1,
    flexGrow: 2,
    textAlign: 'center'
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // alignContent: 'center'
  }
});

export default OngoingWorkoutScreen;
