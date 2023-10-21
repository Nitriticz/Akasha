import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDz3EKQjI2beLbyq0hjRqlDARKDTwq0vy8",
  authDomain: "akasha-f52f8.firebaseapp.com",
  projectId: "akasha-f52f8",
  storageBucket: "akasha-f52f8.appspot.com",
  messagingSenderId: "728990198858",
  appId: "1:728990198858:web:ab46468614ebbc7e12cab3",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
