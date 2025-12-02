import Joi from "joi"

export const planSchema = Joi.object({
    day: Joi.string()
    .valid(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    )
    .required(),
    mealID: Joi.number().min(0).required(),
    mealType: Joi.string()
      .valid("Breakfast", "Lunch", "Dinner", "Snack")
      .required()
});

export const planIdSchema = Joi.object({
    id: Joi.number().min(0).required()
});


