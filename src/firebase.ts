// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGawQLDFqogsO2c5-zO3Eh7j62qu1dz58",
  authDomain: "projec-d022e.firebaseapp.com",
  projectId: "projec-d022e",
  storageBucket: "projec-d022e.firebasestorage.app",
  messagingSenderId: "388344564379",
  appId: "1:388344564379:web:cd2c97495ec3e51148d43e",
  measurementId: "G-812VNMYP19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
export default app;