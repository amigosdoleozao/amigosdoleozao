import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDklKb54g0y6f7QMvfvruICxryn19CwQ1M",
  authDomain: "fir-yt-dcc5a.firebaseapp.com",
  projectId: "fir-yt-dcc5a",
  storageBucket: "fir-yt-dcc5a.firebasestorage.app",
  messagingSenderId: "386046673181",
  appId: "1:386046673181:web:008fcd06df2fa4dcc1a1f4"
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Inicializa e exporta os serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
