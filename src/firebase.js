import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfbTT9_jue0gmmGChrV4x2nJ-KnDVsOSw",
  authDomain: "ezgu-95ab1.firebaseapp.com",
  projectId: "ezgu-95ab1",
  storageBucket: "ezgu-95ab1.appspot.com",
  messagingSenderId: "862121084233",
  appId: "1:862121084233:web:266b457313694de6efc698",
  measurementId: "G-P92K0WVC76",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
