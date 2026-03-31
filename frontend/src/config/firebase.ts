// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmQY3odQFZMwhurs17uA_R3_XWB3XCq-A",
  authDomain: "delivery-optimizer-auth.firebaseapp.com",
  projectId: "delivery-optimizer-auth",
  storageBucket: "delivery-optimizer-auth.firebasestorage.app",
  messagingSenderId: "479734301384",
  appId: "1:479734301384:web:c036910e5e490fc96d9bfd",
  measurementId: "G-4K7MXVEZ57",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export default app;
