import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyBRiLUDA_EuLKb4FZrLM8al1y4yx6s4nX4",
  authDomain: "liturgiareformada-3c2cf.firebaseapp.com",
  projectId: "liturgiareformada-3c2cf",
  storageBucket: "liturgiareformada-3c2cf.firebasestorage.app",
  messagingSenderId: "836346100839",
  appId: "1:836346100839:web:98628889da11f8e19668c2",
  measurementId: "G-TDV1W1ZE85"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o App Check com reCAPTCHA V3 (substitua <SUA_SITE_KEY> pela chave obtida no Firebase Console)
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LecneoqAAAAAIsq8mHOLiGuawzJYyuhdO4t3aaQ"),
  // Habilita a renovação automática dos tokens
  isTokenAutoRefreshEnabled: true
});

const db = getFirestore(app);

export { db };
