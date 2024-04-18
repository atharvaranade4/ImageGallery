// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// let api =  process.env.FIREBASE_API_KEY

// console.log(api)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "image-gallery-b9a99.firebaseapp.com",
  projectId: "image-gallery-b9a99",
  storageBucket: "image-gallery-b9a99.appspot.com",
  messagingSenderId: "931868223019",
  appId: "1:931868223019:web:a1b3792854e0c76732ec6e",
  measurementId: "G-SDDQ3FF2VD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;