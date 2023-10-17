import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError, runValidationAtUpdate } from "./hooks.js";

const emailRegexp = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
const errorEmailRegexp = 'Email is not valid format';
const passwordRegexp = /[a-zA-Z\d]{8,}$/;
const errorPasswordRegexp = 'Please, enter validation password'
const subscriptionOptions = ["starter", "pro", "business"];

const userShema = new Schema ({
    password: {
        type: String,
        required: [true, 'Set password for user'],
        match: [passwordRegexp, errorPasswordRegexp],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [emailRegexp, errorEmailRegexp ],
      },
      subscription: {
        type: String,
        enum: subscriptionOptions,
        default: subscriptionOptions[0],
      },
      token: {
        type: String,
        default: null,
      },
},  { versionKey: false });

userShema.post('save', handleMongooseError)
userShema.pre('findOneAndUpdate', runValidationAtUpdate)
userShema.post('findOneAndUpdate', handleMongooseError)

export const registerSchema = Joi.object({
    password: Joi.string().pattern(passwordRegexp).required().messages({
      "string.pattern.base": errorPasswordRegexp,
      "any.required": "Missing required password field",
    }),
    email: Joi.string().pattern(emailRegexp).required().messages({
      "string.email": errorEmailRegexp,
      "any.required": "Missing required email field",
    }),
    subscription: Joi.string()
    .valid(...subscriptionOptions)
      .default(subscriptionOptions[0])
      .messages({ "any.only": "Invalid subscription" }),
  });
  
  export const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().messages({
      "string.email": errorEmailRegexp,
      "any.required": "Missing required email field",
    }),
    password: Joi.string().pattern(passwordRegexp).required().messages({
      "string.pattern.base": errorPasswordRegexp,
      "any.required": "Missing required password field",
    }),
  });
  
  export const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string()
      .valid(...subscriptionOptions)
      .default(subscriptionOptions[0])
      .required()
      .messages({
        "any.only": `Subscription must be one of ${subscriptionOptions.join(", ")}.`,
      }),
  });

  const User = model("user", userShema);
  
  export default User;
