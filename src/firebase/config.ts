import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRiLUDA_EuLKb4FZrLM8al1y4yx6s4nX4",
  authDomain: "liturgiareformada-3c2cf.firebaseapp.com",
  projectId: "liturgiareformada-3c2cf",
  storageBucket: "liturgiareformada-3c2cf.firebasestorage.app",
  messagingSenderId: "836346100839",
  appId: "1:836346100839:web:98628889da11f8e19668c2",
  measurementId: "G-TDV1W1ZE85"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
