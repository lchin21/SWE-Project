import Joi from "joi"

export const mealIdSchema = Joi.object({
    mealID: Joi.number().integer().positive().required()
});


export const mealSchema = Joi.object({
    name: Joi.string().required().max(255),
    calories: Joi.number().integer().min(0).required(),
    protein: Joi.number().integer().min(0).required(),
    fat: Joi.number().integer().min(0).required(),
    carbs: Joi.number().integer().min(0).required(),
});

