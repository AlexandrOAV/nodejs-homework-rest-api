import bcrypt from "bcrypt";
import fs from 'fs/promises';
import httpError from "../helpers/httpError.js";
import sendEmail from "../helpers/sendEmail.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar'
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import 'dotenv/config';


const { JWT_SECRET, BASE_URL } = process.env;

const register = async (req, res) => {
    const {
      body: { email, password, subscription },
    } = req;
    const user = await User.findOne({ email });
    if (user) throw httpError(409, `Email ${email} in use`);
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, {
    s:'250',
    r:'g',
    d:'wavatar'
    });
    const verificationToken = nanoid();

    const newUser = await User.create({
      email,
      password: hashPassword,
      subscription,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target='_blank' >Verify email</a>`,
    }
    await sendEmail(verifyEmail);

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
  if (!user.verify) {
    throw httpError(401, "Email is not verified");
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
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) throw httpError(400, "User not found. Invalid verification code");
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) =>{
 const {email} = req.body;
 const user = await User.findOne({ email });
 
if (!user){ 
  throw httpError (404, "missing required field email")
};
if (user.verify){
  throw httpError (400, "Verification has already been passed")
};

const verifyEmail = {
  to: email,
  subject: "Verify email",
  html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target='_blank' >Verify email</a>`,
}

await sendEmail(verifyEmail);
res.json ({massage: "Verification email sent"});
}

const getCurrentUser = (req, res) => {
  const { user: { email, subscription }, } = req;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { user: { _id }, } = req;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription: newSubscription } = req.body;
  const { email, subscription } = await User.findByIdAndUpdate(
    _id,
    {
      subscription: newSubscription,
    },
    { new: true }
  );
  res.json({
    email,
    subscription,
  });
};

const updateAvatar = async (req, res, next) => {;
  const avatarsPath = path.join("public", "avatars");
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsPath, filename);
  const image = await Jimp.read(tempUpload);
  image.resize(250, 250).write(tempUpload);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};
export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  verifyEmail:ctrlWrapper(verifyEmail),
  resendVerifyEmail:ctrlWrapper(resendVerifyEmail),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  
};
