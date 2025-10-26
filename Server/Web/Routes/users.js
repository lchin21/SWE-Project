import {authenticateFirebaseToken, getUserQueryFromFirebaseUID, getUserIDFromFirebaseUID} from "../Validators/firebaseValidators.js";
import express from "express"
import db from "../../Database/models/index.js"

const router = express.Router()

const {sequelize, Users} = db

router.get("/current",
    authenticateFirebaseToken,
    getUserQueryFromFirebaseUID,
    async (req, res) => {
        const userQuery = req.userQuery;
        return res.status(200).json({
            userID: userQuery.userID,
            username: userQuery.username
        });
    }
);

router.post("/register",
    authenticateFirebaseToken,
    async (req, res) => {
        try {
            const firebaseUID = req.user.uid;

            const existingUser = await Users.findOne({where: {firebaseUID: firebaseUID}})

            if (existingUser) {
                return res.status(200).json({message: "User already exists", user: existingUser});
            }

            await Users.create({
                firebaseUID: firebaseUID,
            });

            return res.status(201).json({message: "User registered"});
        } catch (e) {
            console.error("Error verifying token or saving user:", e);
            return res.status(401).json({error: "Unauthorized"});
        }
    }
);



export default router