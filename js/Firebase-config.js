import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgtvLnt1D2REeMwryyJVRxAKYsZ8lQYMU",
  authDomain: "pruebagps-babc2.firebaseapp.com",
  databaseURL: "https://pruebagps-babc2-default-rtdb.firebaseio.com",
  projectId: "pruebagps-babc2",
  storageBucket: "pruebagps-babc2.firebasestorage.app",
  messagingSenderId: "339766852477",
  appId: "1:339766852477:web:3a95e0eaaa151dabcbaa14",
  measurementId: "G-BZ487SQ05Z"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);

export { ref, set, onValue, get };