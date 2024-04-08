import React, {useEffect} from 'react';
import { Text, StyleSheet } from 'react-native';
import { getAuth, doc, getFirestore, db } from '../Firebase/Config';

const ActivityCalculator = ({ activityType, speed, time, }) => {
  //tää on ihan paska -->
  /*const [weight, setWeight] = useState(null);
  useEffect(() => {
    const fetchWeight = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const weightRef = doc(db, 'users', user.uid);
          const weightSnapshot = await weightRef.get(weight);

          if (weightSnapshot.exists()) {
            setWeight(weightSnapshot.data().weight);
          }
        }
      } catch (error) {
        console.error('Error fetching weight:', error);
      }
    };

    fetchWeight();
  }, []); // Run once on component mount

  // Determine MET (Metabolic Equivalent of Task) based on activity type and speed
  const determineMET = (activityType, speed) => {
    switch (activityType) {
      case 'running':
        if (speed < 8) {
          return 8;
        } else if (speed < 11) {
          return 12;
        } else {
          return 16;
        }
      case 'walking':
        if (speed < 3) {
          return 2;
        } else if (speed > 5) {
          return 4;
        }
      case 'cycling':
        if (speed < 16) {
          return 4;
        } else if (speed < 19) {
          return 8;
        } else if (speed < 22) {
          return 10;
        } else if (speed < 25) {
          return 12;
        } else {
          return 14;
        }
    }
  };
*/


  // Calculate calories burned
  const calculateCaloriesBurned = () => {
    //const MET = determineMET(activityType, speed);
    const MET = 10;
    const weight = 80;
    const time = 10;
    //kovakoodattu hetkeksi :)

    const caloriesBurned = time * 60 * MET * 3.5 * weight / 200;
    return caloriesBurned;
  };

  const estimatedCaloriesBurned = calculateCaloriesBurned();

  return (
    <React.Fragment>
      <Text style = {styles.text}>Calories Burned: {estimatedCaloriesBurned.toFixed(2)}</Text>
      <Text>
      
      </Text>
    </React.Fragment>
  );
};
export default ActivityCalculator;

const styles = StyleSheet.create({

  text: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
});
