import dotenv from "dotenv";
import connectDB from "./config/db.js";
import mongoose from "mongoose";

dotenv.config();

console.log("Testing db.js connection...");
try {
  await connectDB();
  console.log("SUCCESS: MongoDB connected.");
  await mongoose.disconnect();
  console.log("Disconnected cleanly.");
  process.exit(0);
} catch (err) {
  console.error("FAIL: MongoDB connection failed.");
  process.exit(1);
}
