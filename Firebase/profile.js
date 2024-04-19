import { useState, useEffect } from "react";
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'; // Import necessary Firestore functions
import { firestore } from "./Config"; // Import the firestore instance from your Config.js

export const getUserWorkoutData = (userId) => {
    const [totalWorkoutCount, setTotalWorkoutCount] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);

    useEffect(() => {
        const userDocRef = doc(collection(firestore, 'users'), userId);

        const q = query(
            collection(firestore, 'workouts'),
            where("user_id", "==", userDocRef)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let count = 0;
            let distance = 0;

            querySnapshot.forEach((doc) => {
                const workoutData = doc.data();
                count++; // Increment count for each workout document
                distance += workoutData.distance || 0; // Accumulate distance
            });

            setTotalWorkoutCount(count);
            setTotalDistance(distance / 1000); // Convert distance to kilometers
        });

        return () => {
            unsubscribe();
        };
    }, [userId, firestore]);

    return { totalWorkoutCount, totalDistance };
};