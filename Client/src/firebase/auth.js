import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "firebase/auth";
import {auth} from "./config.js"
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const createNewUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken(true);

    await axios.post(`${baseURL}/api/v1/users/register`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    return userCredential
}

export const signInUsernamePassword = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken(true);
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

    signInWithPopup(auth, provider)
        .then(async (result) => {
            const token = await result.user.getIdToken(true);


            if (result.user) {
                await axios.post(`${baseURL}/api/v1/users/register`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })

                const idToken = await result.user.getIdToken(true);
            }

        }).catch((error) => {
        console.log(error)
    });
}