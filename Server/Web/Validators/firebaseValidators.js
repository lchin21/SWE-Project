import {verifyIdToken} from "../Firebase/firebaseAdmin.js"
import db from "../../database/models/index.js"
const {Users} = db

export const authenticateFirebaseToken = async (req, res, next) => {
    console.log("required firebase")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({error: "Missing or invalid Authorization header"});
    }

    const idToken = authHeader.split(" ")[1];

    try {
        console.log(idToken)

        // Attach decoded token (and uid) to the request object
        req.user = await verifyIdToken(idToken);
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        console.log(error)
        return res.status(401).json({error: "Invalid or expired token"});
    }
};

export const optionalFirebaseTokenUserID = async (req, res, next) => {
    console.log("optional firebase")
    const authHeader = req.headers.authorization;
    console.log("authHeader")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const idToken = authHeader ? authHeader.split(" ")[1] : null;

    if (idToken === "null"){
        console.log("no ID token, next()")
        return next();
    }

    try {

        // Attach decoded token (and uid) to the request object
        req.user = await verifyIdToken(idToken);
        const firebaseUID = req.user.uid

        const usersQuery = await Users.findOne({where: {firebaseUID: firebaseUID}})

        if (!usersQuery) {
            return res.status(401).json({error: "User not registered."})
        }

        req.userID = usersQuery.userID
        next();
    } catch (error) {
        console.log(error);
        next();
    }
};

export const getUserQueryFromFirebaseUID = async (req, res, next) => {
    try {
        const firebaseUID = req.user.uid

        const usersQuery = await Users.findOne({where: {firebaseUID: firebaseUID}})

        if (!usersQuery) {
            return res.status(401).json({error: "User not registered."})
        }

        req.userQuery = usersQuery
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
}


export const getUserIDFromFirebaseUID = async (req, res, next) => {
    try {
        const firebaseUID = req.user.uid

        const usersQuery = await Users.findOne({where: {firebaseUID: firebaseUID}})

        if (!usersQuery) {
            return res.status(401).json({error: "User not registered."})
        }

        req.userID = usersQuery.userID
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
}
