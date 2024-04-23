import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, TextInput, Animated, Alert } from 'react-native';
import ActivityCalculator from './ActivityCalculator';
import { View } from 'react-native';
import { firestore, doc, updateDoc, getDoc, getAuth, db } from '../Firebase/Config';
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import PedometerSteps from './PedometerSteps';
import { getWorkouts } from '../Firebase/workouts';

export default function Activitybar() {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const userId = uid;

    const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
    // console.log("Today's date:", today);
    
    const workouts = getWorkouts(userId);
    
    const todaysWorkouts = workouts.filter(workout => {
        if (workout.created_at && workout.created_at.toDate) {
            const createdAt = workout.created_at.toDate();
            const workoutDate = createdAt.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
            const formattedWorkoutDate = workoutDate.split(' ')[0]; // Take only the date part
            if (formattedWorkoutDate === today) {
                return true;
            }
            return false;
        } else if (workout.created_at) {
            let workoutDate = workout.created_at.split(' ')[0]; // Take only the date part
            // Ensure day part is two digits by padding with leading zeros if necessary
            workoutDate = workoutDate.split('.').map(part => part.padStart(2, '0')).join('.');
            if (workoutDate === today) {
                return true;
            }
            return false;
        }
    });
    
    // console.log("Todays Workouts:", todaysWorkouts);
    
    
    const steps = todaysWorkouts.reduce((totalSteps, workout) => totalSteps + (workout.steps || 0), 0);
    //console.log("Total steps for today:", steps);

    const totalCalories = todaysWorkouts.reduce((totalCalories, workout) => totalCalories + parseFloat(workout.calories || 0), 0);
    const roundedCalories = Math.ceil(totalCalories * 100) / 100; // Round up to two decimal places    console.log("Total calories burned for today:", calories);
    //console.log("Total calories burned for today:", roundedCalories.toFixed(2));

    const DailyGoal = ({ steps }) => {
        const [dailyGoal, setDailyGoal] = useState('');
        const [initialPosition, setInitialPosition] = useState(0); // State to store the initial position
        const iconPositionRef = useRef(new Animated.Value(0));
    
        useEffect(() => {
            fetchUserGoal();
            //console.log("Steps:", steps);
        }, []);
    
        useEffect(() => {
            // Calculate progress towards the daily goal
            const progress = dailyGoal ? Math.min(steps / parseInt(dailyGoal), 1) : 0;
    
            // Animate the icon to the new position
            Animated.timing(iconPositionRef.current, {
                toValue: progress * (280 - 24),
                duration: 500,
                useNativeDriver: true,
                fromValue: initialPosition // Start animation from the initial position
            }).start();
            
            if (steps === parseInt(dailyGoal)) {
                alert('Congratulations! You have reached your daily goal.');
            }
        }, [steps, dailyGoal, initialPosition]);
    
        async function fetchUserGoal() {
            try {
                const user = getAuth().currentUser;
                if (!user) {
                    console.log("No user signed in.");
                    return;
                }
                const uid = user.uid;
                const userDocRef = doc(db, "users", uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setDailyGoal(userData.dailyGoal || '');
                } else {
                    console.log("User document does not exist.");
                }
            } catch (error) {
                console.error("Error fetching user information:", error);
            }
        }
    
        useEffect(() => {
            // Store the initial position when the component mounts
            setInitialPosition(iconPositionRef.current._value);
        }, []);
    
        return (
            <View style={styles.container}>
                <View style={styles.bar}>
                    <View style={styles.box} />
                    <Animated.View style={[styles.iconContainer, { transform: [{ translateX: iconPositionRef.current }] }]}>
                        <FontAwesome6 name="person-running" size={24} color="black" />
                    </Animated.View>
                </View>
                <Text style={styles.progressText}>{steps} / {dailyGoal}</Text>
            </View>
        );
    }

    const activityWindow = () => {
        return (
            <View
                backgroundColor='lightcoral'
                style={styles.container}>
                <Text style={styles.title}>Todays Activity</Text>
                <Text style={styles.values}>Steps: {steps}</Text>
                <Text style={styles.values}>Calories Burned: {roundedCalories}</Text>
            </View>
        );
    }

    return (
        <View>
            {activityWindow()}
            <DailyGoal steps={steps} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 20,
        marginTop: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
        textTransform: 'uppercase',
    },
    values: {
        color: 'white',
    },
    bar: {
        width: 280,
        height: 30,
        borderRadius: 10,
        backgroundColor: '#ffffff', // Set background color of the bar
        position: 'relative',
        overflow: 'hidden', // Ensure the box doesn't overflow the bar
    },
    box: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#ffffff', // Set background color of the box
    },
    iconContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    input: {
        borderColor: '#ffffff',
        borderWidth: 1,
        padding: 5,
        textAlign: 'left',
    },
    iconContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    progressText: {
        marginTop: 10,
    },
});