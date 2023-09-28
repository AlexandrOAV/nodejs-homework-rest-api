import Joi from "joi";

const addSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(25)
    .required()
    .messages({
      "string.min": "The minimum length is 2 characters",
      "string.max": "The maximum is 25 characters",
      "any.required": "missing required name field",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "missing required email field",
    }),
  phone: Joi.string()
    .pattern(/^[+]\d{1,4}-\d{1,3}-\d{1,4}-\d{1,4}-\d{1,9}$/)
    .required()
    .messages({
      "string.pattern.base": "The correct number format should be: +xx-xxx-xxx-xx-xx",
      "any.required": "missing required phone field",
    }),
});

export default addSchema;