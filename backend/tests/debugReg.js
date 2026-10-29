import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import { registerUser } from "../controllers/authController.js";
import mongoose from "mongoose";

dotenv.config();

const debugReg = async () => {
  await connectDB();

  const req = {
    body: {
      name: "shravani joshi",
      email: "shravanijoshi2005@gmail.com",
      password: "password123",
      role: "student",
    },
  };

  let resData = null;
  let resCode = 200;

  const res = {
    status(c) {
      resCode = c;
      return this;
    },
    json(d) {
      resData = d;
      return this;
    },
  };

  const next = (err) => {
    console.error("EXPLICIT ERROR IN REGISTRATION:", err);
  };

  await registerUser(req, res, next);

  console.log("RESPONSE CODE:", resCode);
  console.log("RESPONSE DATA:", resData);

  await mongoose.disconnect();
  process.exit(0);
};

debugReg().catch((err) => {
  console.error("FATAL ERROR IN DEBUG REG:", err);
  process.exit(1);
});
