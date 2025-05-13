// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzRLf6tTuHQu0g_Gq-iPPxOgce-7cx5Rk",
  authDomain: "project-utn-class.firebaseapp.com",
  projectId: "project-utn-class",
  storageBucket: "project-utn-class.firebasestorage.app",
  messagingSenderId: "301009935667",
  appId: "1:301009935667:web:7b20b971569d3c6173b246",
  measurementId: "G-J7THHG7G7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);