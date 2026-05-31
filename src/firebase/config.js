import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCO8TGr3xA4v82MBANl0LJqOvRgzydgLts",
  authDomain: "amigosdoleozao.firebaseapp.com",
  projectId: "amigosdoleozao",
  storageBucket: "amigosdoleozao.firebasestorage.app",
  messagingSenderId: "838892244916",
  appId: "1:838892244916:web:8bb4b9969f0d8eceecace1",
  measurementId: "G-7H5VWD7KGR"
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Inicializa e exporta os serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

