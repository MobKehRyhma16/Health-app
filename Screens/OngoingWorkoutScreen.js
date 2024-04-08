import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Banner, Button, Card, IconButton, Surface } from 'react-native-paper';



const OngoingWorkoutScreen = () => {

  const [duration,setDuration] = useState(0)
  const [speed,setSpeed] = useState(0)
  const [steps,setSteps] = useState(0)
  const [caloriesBurned, setCaloriesBurned] = useState(0)


  const [modalVisible,setModalVisible] = useState(false)


  // https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
  const toggleVisibility = () => {
    console.log('toggle visibility')
    setModalVisible(!modalVisible)
  }

  

  const BottomActions = () => {
    return (
      <>

        <Button textColor='red' size={50} onPress={() => console.log('Quit button pressed')} icon="cancel"></Button>


        {/* {modalVisible===false && ( */}
          <TouchableOpacity>
            <IconButton onPress={() => toggleVisibility()} size={35} mode='contained' icon='chevron-up'></IconButton>
          </TouchableOpacity>

        {/* )} */}


        
        <Button onPress={() => console.log('Pause workout!')} size={50}  icon="pause-circle-outline"></Button>

      </>
      );
  }

  // const StatsBanner = () => {
  //   return (
  //     <>
  //     <Banner style={styles.bannerCont} visible={visible}>
  //       <Text>12 MIN</Text>
  //       <Text>1200 STEPS</Text>
  //     </Banner>
  //     </>
  //     );
  // }



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
                      <Text style={styles.modalTextStyle}>DURATION: {duration}</Text>

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


      {/* <Text style={styles.textCont}>OngoingWorkoutScreen, type:</Text> */}

      {/* {visible === true && (
          <SurfaceComp></SurfaceComp>
      )} */}
      
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