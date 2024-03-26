import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BarChart } from 'react-native-gifted-charts';


const HistoryChart = () => {
  // const data=[ {value:33}, {value:50}, {value:37}, {value:70} ]
  const data=[ {value:33}, {value:50}, {value:37}, {value:70} ]
    return (
      <View style={styles.chartContainer}>
            <BarChart
                style={styles.chart}
                barWidth={50}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightcoral"
                
                data={data}
                yAxisThickness={0}
                xAxisThickness={0}

            />
      </View>
    );
  };

export default HistoryChart

const styles = StyleSheet.create({
  chartContainer: {
    // alignItems: 'center',
    // alignSelf: 'center',
    // flex: 1,
    // flexDirection: 'column'

  },
  chart: {
    width: '100%'


  }
})