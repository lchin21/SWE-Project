import Joi from "joi";

export const goalSchema = Joi.object({
    calories: Joi.number().integer().min(0).required(),
    protein: Joi.number().integer().min(0).required(),
    fat: Joi.number().integer().min(0).required(),
    carbs: Joi.number().integer().min(0).required(),
});