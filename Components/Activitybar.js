import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, TextInput, Animated, Alert } from 'react-native';
import ActivityCalculator from './ActivityCalculator';
import Stepcounter from './Stepcounter';
import { View } from 'react-native';
import { firestore, doc, updateDoc, getDoc, getAuth, db } from '../Firebase/Config';
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import PedometerSteps from './PedometerSteps';

export default function Activitybar() {
    const [steps, setSteps] = useState(0);
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user ? user.uid : null; // Check if user is defined

    const DailyGoal = ({ steps }) => {
        const [dailyGoal, setDailyGoal] = useState('');
        const [initialPosition, setInitialPosition] = useState(0); // State to store the initial position
        const iconPositionRef = useRef(new Animated.Value(0));
    
        useEffect(() => {
            fetchUserGoal();
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
            <LinearGradient
                colors={['#00FF00', '#FF0000']}
                style={styles.container}>
                <Text style={styles.title}>Todays Activity</Text>
                <PedometerSteps/>
                <ActivityCalculator />
            </LinearGradient>
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