import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

const CALORIES_PER_STEP = 0.05;

const Caloriecalculator = ({ steps }) => {
    const [age] = useState(20);
    const [weight] = useState(80);
    const [height] = useState(170);
    const [sex] = useState('male');
    //using fixed values for testing

  /*const [age, setAge] = useState(null);
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [sex, setSex] = useState(null);
    
  useEffect(() => {
    // Fetch data from Firebase
    // Replace the placeholders with your Firebase logic
    const fetchUserData = async () => {
      try {
        // Example Firebase fetch
        const userData = await fetchUserDataFromFirebase();

        // Update state with fetched data
        setAge(userData.age);
        setWeight(userData.weight);
        setHeight(userData.height);
        setSex(userData.sex);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this effect runs only once
*/

  // Calculate Basal Metabolic Rate using appropriate formula based on sex
  const calculateBMR = () => {
    if (age === null || weight === null || height === null || sex === null) {
      return null; // Return null if parameters missing
    }

    let bmr;
    if (sex === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161; //for women
    }
    return bmr;
  };

  // Calculate calories burned based on BMR and steps
  const calculateCaloriesBurned = () => {
    const bmr = calculateBMR();
    if (bmr === null) {
      return null;
    }

    const caloriesBurned = bmr / 24 / 60 * steps * CALORIES_PER_STEP;
    return caloriesBurned;
  };

  const estimatedCaloriesBurned = calculateCaloriesBurned();

  return (
    <React.Fragment>
      {estimatedCaloriesBurned !== null && (
        <>
          <Text style={styles.caloriesLabel}>Estimated Calories Burned:</Text>
          <Text style={styles.caloriesText}>
            {estimatedCaloriesBurned.toFixed(2)} calories 
          </Text>
        </>
      )}
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
    caloriesLabel: {
      fontSize: 20,
      color: '#555',
      marginRight: 6,
    },
    caloriesText: {
      fontSize: 18,
      color: '#e74c3c',
      fontWeight: 'bold',
    },
  });

export default Caloriecalculator;
