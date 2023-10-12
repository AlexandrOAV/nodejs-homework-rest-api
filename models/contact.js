import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError, runValidationAtUpdate } from "./hooks.js";

const validationEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
const validationPhone = /^[0-9\s\-()+.]+$/;
const errorValidationPhone ='Phone is not valid format';
const errorValidationEmail = 'Email is not valid format'

const contactSchema = new Schema(  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
      min:2,
      max:25,
    },
    email: {
      type: String,
      match: [validationEmail, errorValidationEmail ]
    },
    phone: {
      type: String,
      match: [validationPhone, errorValidationPhone ]
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  }, 
  { versionKey: false })

contactSchema.post('save', handleMongooseError)
contactSchema.pre('findOneAndUpdate', runValidationAtUpdate)
contactSchema.post('findOneAndUpdate', handleMongooseError)

const Contact = model("contact", contactSchema);

export const addSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(25)
    .required()
    .messages({
      "string.min": "The minimum length is 2 characters",
      "string.max": "The maximum is 25 characters",
      "any.required": "Missing required name field",
    }),
  email: Joi.string()
    .email()
    .pattern(validationEmail)
    .required()
    .messages({
      "string.email": errorValidationEmail,
      "any.required": "Missing required email field",
    }),
  phone: Joi.string()
    .pattern(validationPhone)
    .required()
    .messages({
      "string.pattern.base": errorValidationPhone,
      "any.required": "Missing required phone field",
    }),
    favorite: Joi.boolean().messages({
      "any.required": "Missing required favorite field",
    }),
});

 export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});



export default Contact;