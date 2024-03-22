import { firestore, collection, query, where, onSnapshot, WORKOUTS, GeoPoint } from "./Config";
import { convertFirebaseTimeStampToJS } from "../helpers/Functions";
import { useEffect, useState } from "react";
import { addDoc, doc } from 'firebase/firestore'; // Import the 'doc' function

export const saveWorkout  = async (userid ,calories, steps, duration, workout_type, routeArray) => {
    
    const geoPointsArray = []

    //Convert to geopoint array from [[xx,xx],[xx,xx]]
    routeArray.forEach(geopoint => {
        geoPointsArray.push(new GeoPoint(geopoint[0],geopoint[1]))
    })

    try{
        const docRef = await addDoc(collection(firestore,WORKOUTS), {
            calories: calories,
            steps: steps,
            duration: duration,
            created_at: new Date(),
            route: geoPointsArray,
            user_id: `/users/${userid}`,
            workout_type: workout_type
    })
    } catch(error){
        console.log(error)
    }
}
 


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