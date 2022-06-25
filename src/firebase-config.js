import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYWaaVk6XSUwmX19gPFwHT0UkDfqqnlxQ",
  authDomain: "dutchauction-83348.firebaseapp.com",
  projectId: "dutchauction-83348",
  storageBucket: "dutchauction-83348.appspot.com",
  messagingSenderId: "834439245130",
  appId: "1:834439245130:web:bc448b831ac07d5ece25b3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
