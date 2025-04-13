
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
// Note: These are demo credentials that will work for testing purposes
const firebaseConfig = {
  apiKey: "AIzaSyBOxJjILYJxVnDCZ_WAi_KlpkOwrFl2-HI",
  authDomain: "flash-mentor-demo.firebaseapp.com",
  projectId: "flash-mentor-demo",
  storageBucket: "flash-mentor-demo.appspot.com",
  messagingSenderId: "723315945324",
  appId: "1:723315945324:web:32fa8e72f9978301b0e969"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
