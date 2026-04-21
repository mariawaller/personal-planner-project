// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwiHadlrQDTzxwEC5bj5kyBm-Tu-09zIo",
  authDomain: "personal-planner-final-project.firebaseapp.com",
  projectId: "personal-planner-final-project",
  storageBucket: "personal-planner-final-project.firebasestorage.app",
  messagingSenderId: "908829020240",
  appId: "1:908829020240:web:4dc5be65fdb53c7f6a0155"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);