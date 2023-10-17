import { Router } from "express";
import ctrl from '../../controllers/auth-controller.js' 
import validateBody from "../../middlewares/validateBody.js";
import { registerSchema, loginSchema, updateSubscriptionSchema } from "../../models/user.js";
import authenticate from "../../middlewares/authenticate.js";

const userRegisterValidate = validateBody(registerSchema);
const userLoginValidate = validateBody(loginSchema);
const userUpdateSubscriptionValidate = validateBody(updateSubscriptionSchema);

const authRouter = Router();

authRouter.post ("/register", userRegisterValidate, ctrl.register);
authRouter.post("/login", userLoginValidate, ctrl.login);

authRouter.get("/current", authenticate, ctrl.getCurrentUser);

authRouter.post("/logout", authenticate, ctrl.logout);

authRouter.patch("/", authenticate, userUpdateSubscriptionValidate, ctrl.updateSubscription);


export default authRouter;

