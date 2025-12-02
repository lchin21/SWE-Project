import {authenticateFirebaseToken, getUserIDFromFirebaseUID} from "../Validators/firebaseValidators.js";
import express from "express"
import db from "../../Database/models/index.js"
import {validate} from "../Validators/validate.js";
import {planSchema, planIdSchema} from "../Validators/plansValidator.js";

const router = express.Router()

const {sequelize, PlannedMeals, Meals} = db

router.post("/",
    authenticateFirebaseToken,
    getUserIDFromFirebaseUID,
    validate(planSchema, "body"),
    async (req, res) => {
        try {
            const userID = req.userID;

            const meal = await Meals.findOne({
                where: {
                    mealID: req.body.mealID,
                    userID: req.userID
                }
            });

            if (!meal) {
                return res.status(404).json({
                    message: "Meal not found."
                });
            }

            const {day, mealID, mealType} = req.body;

            const existing = await PlannedMeals.findOne({
                where: {userID, day, mealType}
            });

            if (existing) {
                existing.mealID = mealID;
                await existing.save();
                return res.status(200).json({
                    id: existing.ID,
                    updated: true
                });
            }

            const newPlannedMeal = await PlannedMeals.create({
                userID,
                day,
                mealID,
                mealType
            });

            return res.status(201).json({
                id: newPlannedMeal.ID,
                updated: false
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

            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const slots = ["Breakfast", "Lunch", "Dinner", "Snack"];
            const weeklyMeals = {};

            for (const day of days) {
                const meals = await PlannedMeals.findAll({
                    where: {userID, day},
                    include: [{model: Meals, as: "meal"}]
                });

                const dayPlan = slots.reduce((acc, slot) => {
                    acc[slot] = null;
                    return acc;
                }, {});

                meals.forEach(pm => {
                    if (!pm.mealType) return;
                    dayPlan[pm.mealType] = {
                        id: pm.ID,
                        mealID: pm.mealID,
                        mealType: pm.mealType,
                        meal: pm.meal ? {
                            name: pm.meal.name,
                            calories: pm.meal.calories,
                            protein: pm.meal.protein,
                            fat: pm.meal.fat,
                            carbs: pm.meal.carbs
                        } : null
                    };
                });

                weeklyMeals[day] = dayPlan;
            }

            return res.status(200).json(weeklyMeals);
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    }
);

router.delete("/:id",
    authenticateFirebaseToken,
    getUserIDFromFirebaseUID,
    validate(planIdSchema, "params"),
    async (req, res) => {
        try {
            const userID = req.userID;
            const planID = req.params.id

            const plannedMeal = await PlannedMeals.findOne({
                where: {
                    ID: planID
                }
            });

            if (!plannedMeal) {
                return res.status(404).json({
                    message: "Planned meal not found."
                });
            }

            if (plannedMeal.userID !== userID) {
                return res.status(403).json({
                    message: "Planned meal does not belong to user."
                });
            }

            await plannedMeal.destroy();

            return res.status(200).json({
                message: "Plan deleted."
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