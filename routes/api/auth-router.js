import { Router } from "express";
import ctrl from '../../controllers/auth-controller.js' 
import validateBody from "../../middlewares/validateBody.js";
import { registerSchema, loginSchema, updateSubscriptionSchema } from "../../models/user.js";

const userRegisterValidate = validateBody(registerSchema);
const userLoginValidate = validateBody(loginSchema);
const userUpdateSubscriptionValidate = validateBody(updateSubscriptionSchema);

const authRouter = Router();

authRouter.post ("/register", userRegisterValidate, ctrl.register);
export default authRouter;

