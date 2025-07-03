import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "your_key",
    authDomain: "reactlinks-ff9a1.firebaseapp.com",
    projectId: "reactlinks-ff9a1",
    storageBucket: "reactlinks-ff9a1.firebasestorage.app",
    messagingSenderId: "975430922525",
    appId: "1:975430922525:web:b8b26183d70912a75df1f4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };