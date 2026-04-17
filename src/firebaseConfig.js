import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAaFSPKG6PedRVfca8BvP3YvV3-6E-80iI",
  authDomain: "trinetr-pro-90ba3.firebaseapp.com",
  projectId: "trinetr-pro-90ba3",
  storageBucket: "trinetr-pro-90ba3.appspot.com",
  messagingSenderId: "90389254119",
  appId: "1:90389254119:web:f971812839994998463870",
  databaseURL: "https://trinetr-pro-90ba3-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
