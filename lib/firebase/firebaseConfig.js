import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpmMr8A2Ir1hwYhug7ouheW4nesPnq5oc",
  authDomain: "learnit-512eb.firebaseapp.com",
  projectId: "learnit-512eb",
  storageBucket: "learnit-512eb.appspot.com",
  messagingSenderId: "1077479547223",
  appId: "1:1077479547223:web:5e1c8c56a54309a25d9e12",
  measurementId: "G-NDLZRW4VZ1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }