
import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-realstate-app.firebaseapp.com",
    projectId: "mern-realstate-app",
    storageBucket: "mern-realstate-app.appspot.com",
    messagingSenderId: "233175818421",
    appId: "1:233175818421:web:17915a266f64db654a5efc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);