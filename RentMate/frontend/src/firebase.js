// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrP7nJA0yC8UH977R8PRYUkorNh3m2o14",
  authDomain: "ssd-project-b886b.firebaseapp.com",
  projectId: "ssd-project-b886b",
  storageBucket: "ssd-project-b886b.appspot.com",
  messagingSenderId: "666936096294",
  appId: "1:666936096294:web:3fa715060ee949f2d2d8e7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

// Export Firebase functions
export { auth, provider, signInWithPopup, storage };
