// Import the functions you need from the SDKs you need
//import * as firebase from "firebase";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {initializeFirestore} from 'firebase/firestore';
//import { getAnalytics } from "firebase/analytics";
//import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optiona
export const firebaseConfig = {
  apiKey: "AIzaSyAEnJGc5aY_6c7LEPlXNrUlzreF4_Decr0",
  authDomain: "citizen-cfd29.firebaseapp.com",
  projectId: "citizen-cfd29",
  storageBucket: "citizen-cfd29.appspot.com",
  messagingSenderId: "579850414033",
  appId: "1:579850414033:web:593a149e838e98a439e2f0",
  measurementId: "G-0YWZNDLZEB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service

//const db = getFirestore(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
   useFetchStreams: false,
});

export default db;



