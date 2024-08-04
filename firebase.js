// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6LEgKOKuil5GsQlgPeNtDJpCdL2PDD4s",
  authDomain: "inventory-management-4a270.firebaseapp.com",
  projectId: "inventory-management-4a270",
  storageBucket: "inventory-management-4a270.appspot.com",
  messagingSenderId: "1006551312454",
  appId: "1:1006551312454:web:d1838684f0c84fc1ab4247",
  measurementId: "G-5DF32K9MEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};