import { firestore, collection, query, where, onSnapshot, WORKOUTS, GeoPoint, orderBy, deleteDoc } from "./Config";
import { convertFirebaseTimeStampToJS } from "../helpers/Functions";
import { useEffect, useState } from "react";
import { addDoc, doc } from 'firebase/firestore'; // Import the 'doc' function
import { useUserId } from "../Components/UserIdContext";


//saveWorkout(userId,101,201,3000,'running',[[x,x],[x,x],[x,x].....]
export const saveWorkout = async (user,calories, steps, duration, distance ,workout_type, routeArray) => {

    
    const geoPointsArray = [];

    // Convert coordinates to the required format and push them into geoPointsArray
    routeArray.forEach(geopoint => {
        const { latitude, longitude } = geopoint;
        const geoPointInstance = new GeoPoint(latitude, longitude);
        geoPointsArray.push(geoPointInstance);
    });

    const userDocRef = doc(firestore, "users", user);

    try {
        const docRef = await addDoc(collection(firestore, WORKOUTS), {
            calories: calories,
            steps: steps,
            duration: duration,
            distance: distance,
            created_at: new Date(),
            route: geoPointsArray,
            user_id: userDocRef,
            workout_type: workout_type
        });
    } catch (error) {
        console.log(error);
    }
};

export const deleteWorkout = async (workoutId) => {
    console.log('Delete workout with id: ', workoutId)
    try {
        // Reference to the document to be deleted
        const workoutDocRef = doc(firestore, 'workouts', workoutId);
        
        // Delete the document
        await deleteDoc(workoutDocRef);
        
        console.log('Workout deleted successfully');
    } catch (error) {
        console.error('Error deleting workout:', error);
    }
};


export const getWorkouts = (userId) => {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        // Create a reference to the users collection and the specific user document
        const usersRef = collection(firestore, 'users');
        const userDocRef = doc(usersRef, userId); // Construct user document reference

        // // Create a query with a filter for the user_id field
        // const q = query(collection(firestore, 'workouts'), where("user_id", "==", userDocRef), orderBy('created_at','desc'));
        const q = query(
            collection(firestore, 'workouts'),
            where("user_id", "==", userDocRef),
            orderBy('created_at', 'desc')
          );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempWorkouts = [];

            querySnapshot.forEach((doc) => {

                const routeArray = []

                doc.data().route.map(points => {

                    routeArray.push([points.latitude,points.longitude])
                })

                const workoutObject = {
                    id: doc.id,
                    calories: doc.data()?.calories ?? 0, // If calories doesn't exist, default to 0
                    created_at: convertFirebaseTimeStampToJS(doc.data()?.created_at),
                    duration: doc.data()?.duration ?? 0, // If duration doesn't exist, default to 0
                    distance: doc.data()?.distance ?? 0, // If distance doesn't exist, default to 0
                    user_id: doc.data()?.user_id?.id, // Safely access nested property
                    steps: doc.data()?.steps ?? 0, // If steps doesn't exist, default to 0
                    workout_type: doc.data()?.workout_type,
                    route: routeArray
                };


                tempWorkouts.push(workoutObject);
            });
            setWorkouts(tempWorkouts);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return workouts;
};