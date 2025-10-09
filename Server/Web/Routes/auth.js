import express from "express"
import {verifyIdToken} from "../Firebase/firebaseAdmin.js";
const router = express.Router()
// import {getCustomToken, verifyIdToken} from "../firebase/firebaseAdmin.js"


router.post("/exchange_token", async (req, res) => {
    try {
        const idToken = req.body.idToken;
        if (!idToken) {
            return res.status(400).json({error: 'ID token is missing in the request body.'});
        }
        console.log("idToken: ", idToken)

        const decodedToken = await verifyIdToken(idToken);
        console.log("decodedToken: ", decodedToken)
        const uid = decodedToken.uid;
        console.log("uid: ", uid)

        const customToken = await getCustomToken(uid)
        console.log("customToken:", customToken)
        return res.status(200).json({ customToken: customToken });
    } catch (e) {
        console.log(e)
        if (e.code === 'auth/argument-error' || e.code === 'auth/invalid-token' || e.code === 'auth/id-token-expired') {
             return res.status(401).json({ error: 'Invalid or expired ID token.' });
        }
        return res.status(500).json("Internal server error.")
    }
})

export default router