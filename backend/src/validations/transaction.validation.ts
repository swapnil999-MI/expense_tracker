import Joi from "joi";

export const createTransactionSchema = Joi.object({
  type: Joi.string().valid("income", "expense").required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().empty("").optional(),
  category: Joi.string().required(),
  date: Joi.date().required(),
});

export const updateTransactionSchema = Joi.object({
  type: Joi.string().valid("income", "expense").optional(),
  amount: Joi.number().positive().optional(),
  description: Joi.string().empty("").optional(),
  category: Joi.string().optional(),
  date: Joi.date().optional(),
});
