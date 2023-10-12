
import bcrypt from "bcrypt"
import httpError from "../helpers/httpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import User from "../models/user.js";

const register = async (req, res) => {
    const {
      body: { email, password, subscription },
    } = req;
    const user = await User.findOne({ email });
    if (user) throw httpError(409, `Email ${email} in use`);
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashPassword,
      subscription,
    });
    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  };

  export default {
    register: ctrlWrapper(register),
  };