import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import mongoose from "mongoose";

dotenv.config();

const checkUser = async () => {
  await connectDB();

  const email = "shravanijoshi2005@gmail.com";
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    console.log(`USER_NOT_FOUND: No account exists for email "${email}". User needs to Register first.`);
  } else {
    console.log("USER_FOUND:", {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      hasPassword: !!user.password,
      role: user.role,
      createdAt: user.createdAt,
    });
  }

  await mongoose.disconnect();
  process.exit(0);
};

checkUser().catch((err) => {
  console.error("DB Check Error:", err);
  process.exit(1);
});
