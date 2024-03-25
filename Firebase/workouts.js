import { firestore, collection, query, where, onSnapshot, WORKOUTS, GeoPoint, orderBy } from "./Config";
import { convertFirebaseTimeStampToJS } from "../helpers/Functions";
import { useEffect, useState } from "react";
import { addDoc, doc } from 'firebase/firestore'; // Import the 'doc' function


//saveWorkout(userId,101,201,3000,'running',[[x,x],[x,x],[x,x].....]
export const saveWorkout  = async (userid ,calories, steps, duration, workout_type, routeArray) => {
    
    const geoPointsArray = []

    //Convert to geopoint array from [[xx,xx],[xx,xx]]
    routeArray.forEach(geopoint => {
        geoPointsArray.push(new GeoPoint(geopoint[0],geopoint[1]))
    })

    const userDocRef = doc(firestore, "users", userid);

    try{
        const docRef = await addDoc(collection(firestore,WORKOUTS), {
            calories: calories,
            steps: steps,
            duration: duration,
            created_at: new Date(),
            route: geoPointsArray,
            user_id: userDocRef,
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
                    calories: doc.data().calories,
                    created_at: convertFirebaseTimeStampToJS(doc.data().created_at),
                    duration: doc.data().duration,
                    user_id: doc.data().user_id.id,
                    steps: doc.data().steps,
                    workout_type: doc.data().workout_type,

                    // route: JSON.stringify(routeArray)
                    route: routeArray

                };

                // workoutObject.route.forEach(points => {
                //     console.log('GEOPOINT',points)
                // })


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