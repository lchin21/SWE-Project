import {authenticateFirebaseToken, getUserIDFromFirebaseUID} from "../Validators/firebaseValidators.js";
import express from "express"
import db from "../../Database/models/index.js"
import {validate} from "../Validators/validate.js";
import {goalSchema} from "../Validators/goalsValidators.js";

const router = express.Router()

const {sequelize, DailyGoals} = db

router.post("/",
    authenticateFirebaseToken,
    getUserIDFromFirebaseUID,
    validate(goalSchema, "body"),
    async (req, res) => {
        try {
            const userID = req.userID;

            const existingGoal = await DailyGoals.findOne({
                where: {
                    userID: userID
                }
            });

            if (existingGoal) {
                return res.status(400).json({
                    message: "Goal already created."
                });
            }

            await DailyGoals.create({
                userID: userID,
                calories: req.body.calories,
                protein: req.body.protein,
                fat: req.body.fat,
                carbs: req.body.carbs
            });

            return res.status(200).json({
                message: "Goal created."
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    }
);

router.get("/",
    authenticateFirebaseToken,
    getUserIDFromFirebaseUID,
    async (req, res) => {
        try {
            const userID = req.userID;

            const goal = await DailyGoals.findOne({
                where: {
                    userID: userID
                }
            });

            if (!goal) {
                return res.status(404).json({
                    message: "No goal found."
                });
            }

            return res.status(200).json({
                calories: goal.calories,
                protein: goal.protein,
                fat: goal.fat,
                carbs: goal.carbs
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    }
);

router.put("/",
    authenticateFirebaseToken,
    getUserIDFromFirebaseUID,
    validate(goalSchema, "body"),
    async(req, res) => {
        try {
            const userID = req.userID;

            const goal = await DailyGoals.findOne({
                where: {
                    userID: userID
                }
            });

            if (!goal) {
                return res.status(404).json({
                    message: "Goal does not exist."
                });
            }

            goal.set(req.body);

            await goal.save();

            return res.status(200).json({
                message: "Goal updated."
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    }
);


export default router