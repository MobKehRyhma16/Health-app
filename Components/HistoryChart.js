import React, { useEffect, useState } from 'react';
import { StyleSheet, View,Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ToggleButton } from 'react-native-paper';

const HistoryChart = ({ workouts }) => {
  const [type, setType] = useState('');
  const dataDuration = workouts.map(workout => ({ value: workout.duration / 60 }));
  const dataCalories = workouts.map(workout => ({ value: workout.calories }));
  
  const updateType = inputType => {
    setType(inputType);
  };

  return (
    <View style={styles.chartContainer}>
      <Text>
        {type}
      </Text>
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
          data={dataCalories}
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