// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDF5LqDM8zOsSbhs7bck9nS-UiIxxOBv1g",
    authDomain: "mern-project-58110.firebaseapp.com",
    projectId: "mern-project-58110",
    storageBucket: "mern-project-58110.firebasestorage.app",
    messagingSenderId: "407386615367",
    appId: "1:407386615367:web:52ad7172716637e2b94b62",
    measurementId: "G-MS9VHN5MR7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };