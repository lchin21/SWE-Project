import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

// its ok to put the api/info in this file
// because it will be available for the client anyways.
const firebaseConfig = {

  apiKey: "AIzaSyDCMI0FsCUZWSFopWSiFoyBg2GwwMpK3PA",

  authDomain: "swe-project-56bf0.firebaseapp.com",

  projectId: "swe-project-56bf0",

  storageBucket: "swe-project-56bf0.firebasestorage.app",

  messagingSenderId: "50597682919",

  appId: "1:50597682919:web:0a5f14a42ad7ae79330c42",

  measurementId: "G-G45H6YZESV"

};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);