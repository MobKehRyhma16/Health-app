import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Banner, Button, Card, IconButton, Surface } from 'react-native-paper';
import DurationProvider, { useDuration } from '../Components/Duration';
import { usePedometer } from '../Components/PedometerSteps';

const OngoingWorkoutScreen = ({ navigation }) => {
  // Context variables
  const { currentStepCount, onPause, onResume, onReset, togglePedometer, pedoRunning, setPedoRunning } = usePedometer();
  const { time, pauseStopwatch, startStopwatch, toggleStopwatch, resetStopwatch, running, setRunning } = useDuration();

  // Other variables
  const [speed, setSpeed] = useState(0);
  const [steps, setSteps] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [modalVisible, setModalVisible] = useState(true);
  const [workoutIsPaused, setWorkoutIsPaused] = useState(false)

  useEffect(() => {
    console.log('Ongoing workout started');
    startStopwatch();
    setPedoRunning(true)
  }, []);

  const quitWorkout = () => {
    pauseStopwatch();
    resetStopwatch();
    onReset()
    navigation.navigate('Workout');
  };

  const toggleWorkout = () => {
    if (running && pedoRunning) {
      console.log('Main toggle workout')
      pauseStopwatch()
      onPause()
    } else{
      startStopwatch()
      onResume()
    }
  };

  const toggleVisibility = () => {
    setModalVisible(!modalVisible);
  };

  const BottomActions = () => {
    return (
      <>
          <Button labelStyle={{fontSize: 30, padding: 5}} textColor='red' size={50} onPress={() => quitWorkout()} icon="cancel"></Button>
          <TouchableOpacity>
            <IconButton onPress={() => toggleVisibility()} size={35} mode='contained' icon='chevron-up'></IconButton>
          </TouchableOpacity>
          
          {running ? (
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
                  <Text style={styles.modalTextStyle}>SPEED: {speed}</Text>
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
