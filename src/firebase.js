// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
} from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrOBc4p_h9PFHN36x7hw-aaCp3VDIx5aQ",
  authDomain: "bentopm-2022.firebaseapp.com",
  projectId: "bentopm-2022",
  storageBucket: "bentopm-2022.appspot.com",
  messagingSenderId: "36157972154",
  appId: "1:36157972154:web:a1313f636a675c50b82c83",
  measurementId: "G-PWKPY0K3CM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics conditionally
let analytics = null;
isSupported().then((yes) => (yes ? (analytics = getAnalytics(app)) : null));

// Auth providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");
googleProvider.setCustomParameters({
  prompt: "select_account",
});

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");
facebookProvider.addScope("public_profile");

// Export the Firestore instance
const gbt = collection(db, "gbt");

// export utils/refs
export default {
  auth,
  gbt,
  analytics,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  facebookProvider,
  signOut,
};
