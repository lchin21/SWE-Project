import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "firebase/auth";
import {auth} from "./config.js"
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const registerUserWithToken = async (token) => {
    try {
        await axios.post(`${baseURL}/api/v1/users/register`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    } catch (e) {
        console.error("Registration error", e?.response?.data || e.message);
    }
}

export const createNewUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken(true);
    await registerUserWithToken(token);
    localStorage.setItem('idToken', token);
    return token;
}

export const signInUsernamePassword = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken(true);
    await registerUserWithToken(idToken);
    localStorage.setItem('idToken', idToken);
    return idToken;
}

export const signOutUser = async () => {
    await signOut(auth).then(() => {
    }).catch((error) => {
        console.log(error.message)
    });
}

export const googleLogIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken(true);
        await registerUserWithToken(token);
        localStorage.setItem('idToken', token);
        return token;
    } catch (error) {
        console.error(error);
        throw error;
    }
}