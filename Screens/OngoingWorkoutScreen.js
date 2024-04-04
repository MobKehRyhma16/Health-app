import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Banner, Button, IconButton } from 'react-native-paper';



const OngoingWorkoutScreen = () => {

  const [visible,setVisible] = useState(true)

    useEffect(() => {
        console.log('In ongoig workoutscreen!')
    }, []);


  const BottomActions = () => {
    return (
      <>
        <Button textColor='red' onPress={() => console.log('Quit button pressed')} icon="cancel">End Workout</Button>
        <IconButton size={30} mode='contained' icon='chevron-up'></IconButton>
        {/* <Button style={styles.expandButton} mode='elevated' icon='chevron-up'></Button> */}
        <Button onPress={() => console.log('Pause button pressed')} icon="pause-circle-outline">Pause Workout </Button>
      </>
      );
  }

  const StatsBanner = () => {
    return (
      <>
      <Banner style={styles.bannerCont} visible={visible}>
        <Text>12 MIN</Text>
        <Text>1200 STEPS</Text>
      </Banner>
      </>
      );
  }
   

   
    

  return (
    <SafeAreaView style={styles.container}>


      {/* <Text style={styles.textCont}>OngoingWorkoutScreen, type:</Text> */}


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

  textCont: {
    flex: 1,
    textAlign: 'center'
  },

  bottomContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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