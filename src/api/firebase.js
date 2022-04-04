import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYWaaVk6XSUwmX19gPFwHT0UkDfqqnlxQ",

  authDomain: "dutchauction-83348.firebaseapp.com",

  projectId: "dutchauction-83348",

  storageBucket: "dutchauction-83348.appspot.com",

  messagingSenderId: "834439245130",

  appId: "1:834439245130:web:bc448b831ac07d5ece25b3",
};

firebase.initializeApp(firebaseConfig);
// const db = getFirestore();

export default firebase;
