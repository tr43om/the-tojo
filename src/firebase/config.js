// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfuqz-_6IwJGDaZQNqBwQboYHQhF9xD6k",
  authDomain: "thetojo-da410.firebaseapp.com",
  projectId: "thetojo-da410",
  storageBucket: "thetojo-da410.appspot.com",
  messagingSenderId: "962698081430",
  appId: "1:962698081430:web:cf52e70fea190e4394feb7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service

export const auth = getAuth(app);

// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage(app);
