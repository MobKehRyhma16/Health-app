import React, { useEffect, useState } from 'react';
import { StyleSheet, View,Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ToggleButton } from 'react-native-paper';
import { parseDurationToSeconds } from '../helpers/Functions';

export const HistoryChart = ({ workouts }) => {
  const [type, setType] = useState('distance');

  const dataDistance = workouts.map(workout => ({ value: workout.distance }));
  const dataDuration = workouts.map(workout => ({ value: parseDurationToSeconds(workout.duration)/60 }));
  
  const updateType = inputType => {
    setType(inputType);
  };

  const DurationChart = () => {

    return (
      <BarChart
          style={styles.chart}
          barWidth={50}
          noOfSections={3}
          barBorderRadius={4}
          frontColor="lightcoral"
          data={dataDuration}
          yAxisThickness={0}
          xAxisThickness={0}


    />
    );
  }

  const DistanceChart = () => {

    return (
      <BarChart
          style={styles.chart}
          barWidth={50}
          noOfSections={3}
          barBorderRadius={4}
          frontColor="lightcoral"
          data={dataDistance}
          yAxisThickness={0}
          xAxisThickness={0}
    />
    );
  }
   


  return (
    <View style={styles.chartContainer}>
      <ToggleSwitch updateType={updateType} />
      {type === 'duration' ? (
        <DurationChart></DurationChart>
      ) : (
        <DistanceChart></DistanceChart>
      )}
    </View>
  );
};

const ToggleSwitch = ({ updateType }) => {
  const [value, setValue] = React.useState('distance'); // Initialize value

  useEffect(() => {
    updateType(value);
  }, [value]);


  return (
    <ToggleButton.Row onValueChange={value => setValue(value)} value={value}>
      <ToggleButton onValueChange='' icon="clock" value="duration" />
      <ToggleButton  icon="ruler" value="distance" />
    </ToggleButton.Row>
  );
};

export default HistoryChart;

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    flexGrow: 2
  },
  chart: {
    width: '100%',
    flexGrow: 2
  }
});