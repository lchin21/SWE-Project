import {initializeApp, cert} from "firebase-admin/app"
import {getAuth} from "firebase-admin/auth"

const base64EncodedServiceAccount = process.env.BASE_64_ENCODED_SERVICE_ACCOUNT;
const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf-8');
const credentials = JSON.parse(decodedServiceAccount);

export const firebaseAdmin = initializeApp({
    credential: cert(credentials),
});

export async function verifyIdToken(idToken) {
    try {
        return await getAuth().verifyIdToken(idToken);
    } catch (error) {
        console.error("error verifying token", error);
        throw error;
    }
}
