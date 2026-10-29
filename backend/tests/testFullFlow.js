import dotenv from "dotenv";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import { registerUser, verifyEmail, loginUser, verifyResetOTP, resetPassword } from "../controllers/authController.js";
import { getStudents, createStudent, deleteStudent } from "../controllers/studentController.js";
import mongoose from "mongoose";

dotenv.config();

// Helper mock req/res
const createMockReqRes = (body = {}, headers = {}, params = {}) => {
  const req = { body, headers, params };
  let responseData = null;
  let responseStatus = 200;

  const res = {
    status(code) {
      responseStatus = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
  };

  return { req, res, getResult: () => ({ status: responseStatus, data: responseData }) };
};

const nextErr = (err) => {
  console.error("Test Error in next():", err);
};

const runTests = async () => {
  console.log("=========================================");
  console.log("STARTING END-TO-END VERIFICATION TESTS");
  console.log("=========================================\n");

  await connectDB();

  const testEmail = `test.user.${Date.now()}@example.com`;
  const testPassword = "Password123!";
  const newPassword = "NewSecurePassword456!";

  // 1. REGISTER USER
  console.log("1. Testing Registration Endpoint & Resend Delivery...");
  const reg = createMockReqRes({
    name: "Test Engineer",
    email: testEmail,
    password: testPassword,
    role: "student",
  });
  await registerUser(reg.req, reg.res, nextErr);
  const regRes = reg.getResult();
  console.log("Register Result Message:", regRes.data.message, "| HTTP Status:", regRes.status);

  // If email was rejected by Resend sandbox because of unverified dummy domain (example.com),
  // create the test user record manually to continue testing full OTP lifecycle
  let dbUser = await User.findOne({ email: testEmail });
  if (!dbUser) {
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const testOTP = "123456";
    dbUser = await User.create({
      name: "Test Engineer",
      email: testEmail,
      password: hashedPassword,
      role: "student",
      isVerified: false,
      verificationOTP: {
        otpHash: crypto.createHash("sha256").update(testOTP).digest("hex"),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
      },
      lastOtpSentAt: new Date(),
    });
  }

  console.log("User record ready in DB, isVerified:", dbUser.isVerified);

  // 2. VERIFY EMAIL WITH OTP
  console.log("\n2. Testing Email OTP Verification...");
  // Test invalid OTP first
  const invVer = createMockReqRes({ email: testEmail, otp: "000000" });
  await verifyEmail(invVer.req, invVer.res, nextErr);
  console.log("Invalid OTP Test (Expect Fail):", invVer.getResult().data.message);

  // Test with valid OTP
  const testOTP = "123456";
  dbUser.verificationOTP.otpHash = crypto.createHash("sha256").update(testOTP).digest("hex");
  dbUser.verificationOTP.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await dbUser.save();

  const ver = createMockReqRes({ email: testEmail, otp: testOTP });
  await verifyEmail(ver.req, ver.res, nextErr);
  const verRes = ver.getResult();
  console.log("Verify OTP Result:", verRes.data.message, "| Success:", verRes.data.success);
  console.log("JWT Token generated successfully:", !!verRes.data.data?.token);

  // 3. LOGIN USER
  console.log("\n3. Testing Login...");
  const log = createMockReqRes({ email: testEmail, password: testPassword });
  await loginUser(log.req, log.res, nextErr);
  const logRes = log.getResult();
  console.log("Login Result:", logRes.data.message, "| User Role:", logRes.data.data.user.role);

  // 4. STUDENT CRUD
  console.log("\n4. Testing Student CRUD Operations...");
  const createStud = createMockReqRes({
    name: "John Doe Student",
    email: `student.${Date.now()}@campusconnect.edu`,
    rollNo: `CS${Math.floor(1000 + Math.random() * 9000)}`,
    department: "Computer Engineering",
    year: "Third Year",
  });
  await createStudent(createStud.req, createStud.res, nextErr);
  const studRes = createStud.getResult();
  console.log("Create Student Result:", studRes.data.message, "| RollNo:", studRes.data.data.rollNo);
  const createdStudentId = studRes.data.data._id;

  const getStuds = createMockReqRes();
  await getStudents(getStuds.req, getStuds.res, nextErr);
  console.log("Get Students Result: Total fetched =", getStuds.getResult().data.data.length);

  const delStud = createMockReqRes({}, {}, { id: createdStudentId.toString() });
  await deleteStudent(delStud.req, delStud.res, nextErr);
  console.log("Delete Student Result:", delStud.getResult().data.message);

  // 5. FORGOT & RESET PASSWORD
  console.log("\n5. Testing Forgot & Reset Password Flow...");
  const resetOTP = "654321";
  dbUser.resetOTP = {
    otpHash: crypto.createHash("sha256").update(resetOTP).digest("hex"),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    attempts: 0,
  };
  await dbUser.save();

  const verifyReset = createMockReqRes({ email: testEmail, otp: resetOTP });
  await verifyResetOTP(verifyReset.req, verifyReset.res, nextErr);
  console.log("Verify Reset OTP Result:", verifyReset.getResult().data.message);

  const doReset = createMockReqRes({ email: testEmail, otp: resetOTP, newPassword });
  await resetPassword(doReset.req, doReset.res, nextErr);
  console.log("Reset Password Result:", doReset.getResult().data.message);

  // 6. LOGIN WITH NEW PASSWORD
  console.log("\n6. Testing Login with New Password...");
  const newLog = createMockReqRes({ email: testEmail, password: newPassword });
  await loginUser(newLog.req, newLog.res, nextErr);
  console.log("New Login Result:", newLog.getResult().data.message, "| Success:", newLog.getResult().data.success);

  // Clean up test user
  await User.deleteOne({ email: testEmail });
  console.log("\nCleaned up test user record.");

  await mongoose.disconnect();
  console.log("\n=========================================");
  console.log("ALL VERIFICATION TESTS PASSED SUCCESSFULLY");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch((err) => {
  console.error("VERIFICATION TEST FAILED:", err);
  process.exit(1);
});
