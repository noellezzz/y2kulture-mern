// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBXnR73IcpKcGM5vGHGW0VnOp_vhoe_gkY",
  authDomain: "y2kulture-17f2d.firebaseapp.com",
  projectId: "y2kulture-17f2d",
  storageBucket: "y2kulture-17f2d.firebasestorage.app",
  messagingSenderId: "247310474637",
  appId: "1:247310474637:web:f97baf333d4ba154de31c4",
  measurementId: "G-N09ZM8MYJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };