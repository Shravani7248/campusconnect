import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

dotenv.config();

const setupUser = async () => {
  await connectDB();

  const email = "shravanijoshi2005@gmail.com";
  let user = await User.findOne({ email: email.toLowerCase().trim() });

  const hashedPassword = await bcrypt.hash("password123", 10);

  if (!user) {
    user = await User.create({
      name: "shravani joshi",
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "student",
      isVerified: true,
    });
    console.log("SUCCESS: User created and verified directly.");
  } else {
    user.isVerified = true;
    user.password = hashedPassword;
    user.verificationOTP = { otpHash: null, expiresAt: null, attempts: 0 };
    await user.save();
    console.log("SUCCESS: Existing user account activated & verified directly with password 'password123'.");
  }

  await mongoose.disconnect();
  process.exit(0);
};

setupUser().catch((err) => {
  console.error("Setup Error:", err);
  process.exit(1);
});
