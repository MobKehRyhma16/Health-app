import { useState, useEffect } from "react";
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'; // Import necessary Firestore functions
import { firestore } from "./Config"; // Import the firestore instance from your Config.js

export const getUserWorkoutTypes = (userId) => {
    const [workoutTypes, setWorkoutTypes] = useState([]);
    const [totalWorkoutTypes, setTotalWorkoutTypes] = useState(0); // State to store total count of workout types

    useEffect(() => {
        const userDocRef = doc(collection(firestore, 'users'), userId); // Construct user document reference

        const q = query(
            collection(firestore, 'workouts'),
            where("user_id", "==", userDocRef)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempWorkoutTypes = new Set();

            querySnapshot.forEach((doc) => {
                const workoutData = doc.data();
                const workoutType = workoutData.workout_type;
                tempWorkoutTypes.add(workoutType);
            });
            

            setWorkoutTypes(Array.from(tempWorkoutTypes)); // Convert Set to Array
            setTotalWorkoutTypes(tempWorkoutTypes.size); // Set total count of workout types
        });

        return () => {
            unsubscribe();
        };
    }, [userId, firestore]);

    return { totalWorkoutTypes }; // Return both workout types and total count
};