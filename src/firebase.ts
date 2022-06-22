import { initializeApp } from "firebase/app";

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