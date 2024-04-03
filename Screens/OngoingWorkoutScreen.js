import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'


const OngoingWorkoutScreen = () => {

    useEffect(() => {
        console.log('In ongoig workoutscreen!')
    }, []);

    

  return (
    <SafeAreaView>
      <Text>OngoingWorkoutScreen, type:</Text>

    </SafeAreaView>
  )
}

export default OngoingWorkoutScreen