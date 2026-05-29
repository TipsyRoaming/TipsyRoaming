import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCpFFGoo_4B7njF21nWf9oooUVgELLLUL0",
    authDomain: "tipsyroaming-c763c.firebaseapp.com",
    databaseURL: "https://tipsyroaming-c763c-default-rtdb.firebaseio.com",
    projectId: "tipsyroaming-c763c",
    storageBucket: "tipsyroaming-c763c.firebasestorage.app",
    messagingSenderId: "499606815652",
    appId: "1:499606815652:web:77d9490f4c4cb63964b731",
    measurementId: "G-DH97F1E33H",
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export {
    database, ref, push, onValue,
    auth, provider, signInWithPopup, onAuthStateChanged, signOut,
    storage, storageRef, uploadBytes, getDownloadURL
};