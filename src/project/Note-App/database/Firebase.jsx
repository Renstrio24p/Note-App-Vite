
// Firebase DB Configuration

import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAanmgV8rAcYFLFxAydE54F2oXk1Ja1d4o",
  authDomain: "note-app-be876.firebaseapp.com",
  projectId: "note-app-be876",
  storageBucket: "note-app-be876.appspot.com",
  messagingSenderId: "928336226991",
  appId: "1:928336226991:web:1bf0b9a94679ad5af3825a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FirebaseDB = getFirestore(app)
export const NoteCollection = collection(FirebaseDB,'Notes')