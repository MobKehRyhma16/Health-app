import { firestore, collection, query, where, onSnapshot } from "./Config";
import { convertFirebaseTimeStampToJS } from "../helpers/Functions";
import { useEffect, useState } from "react";
import { doc } from 'firebase/firestore'; // Import the 'doc' function

export const getWorkouts = (userId) => {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        // Create a reference to the users collection and the specific user document
        const usersRef = collection(firestore, 'users');
        const userDocRef = doc(usersRef, userId); // Construct user document reference

        // Create a query with a filter for the user_id field
        const q = query(collection(firestore, 'workouts'), where("user_id", "==", userDocRef));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempWorkouts = [];

            querySnapshot.forEach((doc) => {
                // console.log(doc.data())


                const routeArray = []

                doc.data().route.map(points => {
                    console.log(points)
                    // routeArray.push([points.latitude, points.longitude])
                    routeArray.push([points.latitude,points.longitude])
                })

                console.log('Route array ',routeArray)

                const workoutObject = {
                    id: doc.id,
                    calories: doc.data().calories,
                    created: convertFirebaseTimeStampToJS(doc.data().created_at),
                    duration: doc.data().duration,
                    user_id: doc.data().user_id.id,
                    steps: doc.data().steps,
                    workout_type: doc.data().workout_type,

                    // route: JSON.stringify(routeArray)
                    route: routeArray

                };

                workoutObject.route.forEach(points => {
                    console.log('GEOPOINT',points)
                })


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