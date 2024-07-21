import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDPQbWVfBesOcJd0dOevCQ1DLSbk_KvqI4",
  authDomain: "gridmaster-f2eb1.firebaseapp.com",
  projectId: "gridmaster-f2eb1",
  storageBucket: "gridmaster-f2eb1.appspot.com",
  messagingSenderId: "279147952459",
  appId: "1:279147952459:web:b3bc712ffc782fe0dbd0ce",
  measurementId: "G-XJCP6BE6NZ",
  databaseURL: "https://gridmaster-f2eb1-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };