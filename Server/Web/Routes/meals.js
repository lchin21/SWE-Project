import {authenticateFirebaseToken, getUserIDFromFirebaseUID} from "../Validators/firebaseValidators.js";
import express from "express"
import db from "../../Database/models/index.js"
import {validate} from "../Validators/validate.js";
import {mealIdSchema, mealSchema} from "../Validators/mealsValidators.js";

const router = express.Router()

const {sequelize, Meals} = db

router.post("/",
    authenticateFirebaseToken,
    getUserIDFromFirebaseUID,
    validate(mealSchema, "body"),
    async (req, res) => {
        try {
            const userID = req.userID;

            const newMeal = await Meals.create({
                userID: userID,
                name: req.body.name,
                calories: req.body.calories,
                protein: req.body.protein,
                fat: req.body.fat,
                carbs: req.body.carbs
            });

            return res.status(200).json({
                mealID: newMeal.mealID
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

            let meals = await Meals.findAll({
                where: {
                    userID: userID
                }
            });

            meals = meals.map(meal => ({
                mealID: meal.mealID,
                name: meal.name,
                calories: meal.calories,
                protein: meal.protein,
                fat: meal.fat,
                carbs: meal.carbs
            }));

            return res.status(200).json({
                meals: meals
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    }
);

router.put("/:mealID",
    authenticateFirebaseToken,
    getUserIDFromFirebaseUID,
    validate(mealIdSchema, "params"),
    validate(mealSchema, "body"),
    async(req, res) => {
        try {
            const userID = req.userID;
            const mealID = req.params.mealID

            const meal = await Meals.findOne({
                where: {
                    mealID: mealID
                }
            });

            if (!meal) {
                return res.status(404).json({
                    message: "Meal not found."
                });
            }

            if (meal.userID !== userID) {
                return res.status(403).json({
                    message: "Meal does not belong to user."
                });
            }

            meal.set(req.body);

            await meal.save();

            return res.status(200).json({
                message: "Meal updated."
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    }
);

router.delete("/:mealID",
    authenticateFirebaseToken,
    getUserIDFromFirebaseUID,
    validate(mealIdSchema, "params"),
    async(req, res) => {
        try {
            const userID = req.userID;
            const mealID = req.params.mealID

            const meal = await Meals.findOne({
                where: {
                    mealID: mealID
                }
            });

            if (!meal) {
                return res.status(404).json({
                    message: "Meal not found."
                });
            }

            if (meal.userID !== userID) {
                return res.status(403).json({
                    message: "Meal does not belong to user."
                });
            }

            await meal.destroy();

            return res.status(200).json({
                message: "Meal deleted."
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