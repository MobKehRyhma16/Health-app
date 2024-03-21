// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc,setDoc, doc, serverTimestamp, query, onSnapshot} from "firebase/firestore";
import { initializeAuth, getReactNativePersistence, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID} from '@env';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:  process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:  process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:  process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};



// Initialize Firebase
const app = initializeApp(FirebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  
const db = getFirestore(app);
const firestore = getFirestore();

const WORKOUTS = 'workouts'

export {
    app,
    firestore,
    auth,
    db,
    doc,
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    WORKOUTS,
    collection,
    addDoc,
    updateDoc,
    setDoc,
    serverTimestamp,
    query,
    onSnapshot,
}; 
