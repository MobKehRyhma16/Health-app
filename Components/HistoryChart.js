import React, { useEffect, useState } from 'react';
import { StyleSheet, View,Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ToggleButton } from 'react-native-paper';
import { parseDurationToSeconds } from '../helpers/Functions';

const HistoryChart = ({ workouts }) => {
  const [type, setType] = useState('duration');

  const dataDistance = workouts.map(workout => ({ value: workout.distance }));
  const dataDuration = workouts.map(workout => ({ value: parseDurationToSeconds(workout.duration) }));
  
  const updateType = inputType => {
    setType(inputType);
  };

  return (
    <View style={styles.chartContainer}>
      <ToggleSwitch updateType={updateType} />
      {type === 'duration' ? (
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
      ) : (
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
      )}
    </View>
  );
};

const ToggleSwitch = ({ updateType }) => {
  const [value, setValue] = React.useState('duration');

  useEffect(() => {
    updateType(value);
  }, [value]);

  return (
    <ToggleButton.Row onValueChange={value => setValue(value)} value={value}>
      <ToggleButton onValueChange='' icon="clock" value="duration" />
      <ToggleButton  icon="fire" value="calories" />
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