import bcrypt from "bcrypt";
import httpError from "../helpers/httpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRET } = process.env;

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


const login = async(req, res)=>{
  const {
    body: { email, password },
  } = req;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw httpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  const responseUser = {
    email: user.email,
    subscription: user.subscription,
  };
  res.json({
    token,
    user: responseUser,
  });
}

  export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
  };