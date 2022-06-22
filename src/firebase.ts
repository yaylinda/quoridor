// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDc2AXp9vsDW7P12YsfbqFo6QtTHKhjqNY",
  authDomain: "react-web-games.firebaseapp.com",
  projectId: "react-web-games",
  storageBucket: "react-web-games.appspot.com",
  messagingSenderId: "1002377720141",
  appId: "1:1002377720141:web:ab6cf01fdbf4a60067c704",
  measurementId: "G-PL9RNZESYD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);