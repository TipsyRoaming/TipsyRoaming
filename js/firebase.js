import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCpFFGoo_4B7njF21nWf9oooUVgELLLUL0",
    authDomain: "tipsyroaming-c763c.firebaseapp.com",
    databaseURL: "https://tipsyroaming-c763c-default-rtdb.firebaseio.com", 
    projectId: "tipsyroaming-c763c",
    storageBucket: "tipsyroaming-c763c.firebasestorage.app",
    messagingSenderId: "499606815652",
    appId: "1:499606815652:web:77d9490f4c4cb63964b731",
    measurementId: "G-DH97F1E33H"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

// 建立一個 Promise 讓其他模組知道什麼時候登入完成 (解決 Race Condition)
export const authReady = signInAnonymously(auth);

// 匯出需要的操作函式供 reviews.js 使用
export { ref, push, onValue };