import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Banner, Button, Card, IconButton, Surface } from 'react-native-paper';
import DurationProvider, { useDuration } from '../Components/Duration';


const OngoingWorkoutScreen = ({navigation}) => {

  const {time} = useDuration()
  const [speed,setSpeed] = useState(0)
  const [steps,setSteps] = useState(0)
  const [caloriesBurned, setCaloriesBurned] = useState(0)


  const [modalVisible,setModalVisible] = useState(false)



  const toggleVisibility = () => {
    setModalVisible(!modalVisible)
  }

  

  const BottomActions = () => {
    return (
      <>

        <Button textColor='red' size={50} onPress={() => navigation.navigate('Workout')} icon="cancel"></Button>


        {/* {modalVisible===false && ( */}
          <TouchableOpacity>
            <IconButton onPress={() => toggleVisibility()} size={35} mode='contained' icon='chevron-up'></IconButton>
          </TouchableOpacity>

        {/* )} */}


        
        <Button onPress={() => console.log('Pause workout!')} size={50}  icon="pause-circle-outline"></Button>

      </>
      );
  }


    const SurfaceComp = () => {
      return (


            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              // presentationStyle={'pageSheet'}
              onRequestClose={() =>{
                setModalVisible(!modalVisible)
              }}
            style={styles.modalStyle}>
              <TouchableOpacity onPress={() => toggleVisibility()}>
                  <Surface style={styles.surface} elevation={5}>

                    <View style={styles.cardStyle}>
                      <Text style={styles.modalTextStyle}>SPEED: {speed}</Text>
                      <Text style={styles.modalTextStyle}>DURATION: {toString(time).length > 0 ? (<>{time}</>) : (<>time empty</>)} </Text> 
                      {/* <Text style={styles.modalTextStyle}>DURATION: <Duration time={time} setTime={setTime}/> </Text>  */}

                    </View>

                    <View style={styles.cardStyle}>
                      <Text style={styles.modalTextStyle}>CALORIES: {caloriesBurned}</Text>
                      <Text style={styles.modalTextStyle}>STEPS: {steps}</Text>
                    </View>

                  

                      {/* <Button onPress={() => toggleVisibility()}>close</Button> */}
                  </Surface>
                </TouchableOpacity>

            </Modal>



      );
    }
    
   
    

  return (

    <SafeAreaView style={styles.container}>


      <SurfaceComp></SurfaceComp>

      <View style={styles.bottomContainer}>
        <BottomActions/>
      </View>


    </SafeAreaView>


  )
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'flex-end'
      
      
  },


  testCont: {
    height: '10%',
    flex: 1
  },

  modalTextStyle: {
    // fontSize: '25%'
    textAlign: 'center',
    fontSize: 20
  },

  surface: {
    marginTop: '150%',
    minHeight: '40%',
    borderRadius: 15,
    margin: 10,
    opacity: 0.4,
    padding: 10,
    fontSize: '30%',
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-around'
  },

  cardStyle: {
    flex: 1,
    flexGrow: 2,
    textAlign: 'center'
  },

  textCont: {
    flex: 1,
    textAlign: 'center'
  },

  bottomContainer: {
    // flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

  },
  bannerCont: {

    flex: 1

  },
  bannerTextColumn: {
    flex: 1
  }
  

});

export default OngoingWorkoutScreen