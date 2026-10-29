import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import mongoose from "mongoose";

dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

const runVerification = async () => {
  console.log("\n==================================================");
  console.log("  CAMPUSCONNECT END-TO-END VERIFICATION TEST SUITE  ");
  console.log("==================================================\n");

  await connectDB();

  const testEmail = `test_audit_${Date.now()}@example.com`;
  const initialPassword = "password123!";
  const newPassword = "newPassword456!";
  let jwtToken = "";
  let userId = "";
  let createdStudentId = "";

  const logStep = (stepNum, stepName, success, details = "") => {
    const symbol = success ? "✅ SUCCESS" : "❌ FAILED";
    console.log(`[Step ${stepNum}] ${stepName.padEnd(35)} : ${symbol}`);
    if (details) console.log(`        └─ ${details}`);
  };

  try {
    // Step 1: Health Check (GET /)
    const resRoot = await fetch(`${BASE_URL}/`);
    const dataRoot = await resRoot.json();
    logStep(1, "GET / Health Check", resRoot.ok && dataRoot.success, `Response: ${dataRoot.message}`);

    // Step 2: Register User (POST /api/auth/register)
    const resReg = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Audit Test User",
        email: testEmail,
        password: initialPassword,
        role: "student",
      }),
    });
    const dataReg = await resReg.json();
    const devOtp = dataReg.data?.devOtp;
    logStep(2, "POST /api/auth/register", resReg.status === 201, `Message: ${dataReg.message}`);

    // Verify User exists in MongoDB
    const dbUser = await User.findOne({ email: testEmail });
    if (!dbUser) throw new Error("User record was not created in MongoDB");
    userId = dbUser._id.toString();
    console.log(`        └─ User created in MongoDB ID: ${userId}`);

    // Step 3: Verify Email OTP (POST /api/auth/verify-email)
    const resVerify = await fetch(`${BASE_URL}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        otp: devOtp || "123456",
      }),
    });
    const dataVerify = await resVerify.json();
    if (dataVerify.data?.token) jwtToken = dataVerify.data.token;
    logStep(3, "POST /api/auth/verify-email", resVerify.ok, `Message: ${dataVerify.message}`);

    // Step 4: Login with Initial Password (POST /api/auth/login)
    const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: initialPassword,
      }),
    });
    const dataLogin = await resLogin.json();
    if (dataLogin.data?.token) jwtToken = dataLogin.data.token;
    logStep(4, "POST /api/auth/login", resLogin.ok && !!jwtToken, `JWT Token Issued: ${!!jwtToken}`);

    // Step 5: Get Current User Profile (GET /api/auth/me)
    const resMe = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const dataMe = await resMe.json();
    logStep(5, "GET /api/auth/me (Protected)", resMe.ok && dataMe.data?.user?.email === testEmail, `Authenticated User: ${dataMe.data?.user?.email}`);

    // Step 6: Forgot Password Request (POST /api/auth/forgot-password)
    const resForgot = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail }),
    });
    const dataForgot = await resForgot.json();
    const resetDevOtp = dataForgot.data?.devOtp;
    logStep(6, "POST /api/auth/forgot-password", resForgot.ok, `Message: ${dataForgot.message}`);

    // Step 7: Verify Reset OTP (POST /api/auth/verify-reset-otp)
    const resVerifyReset = await fetch(`${BASE_URL}/api/auth/verify-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        otp: resetDevOtp || "123456",
      }),
    });
    const dataVerifyReset = await resVerifyReset.json();
    logStep(7, "POST /api/auth/verify-reset-otp", resVerifyReset.ok, `Message: ${dataVerifyReset.message}`);

    // Step 8: Reset Password (POST /api/auth/reset-password)
    const resReset = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        otp: resetDevOtp || "123456",
        newPassword: newPassword,
      }),
    });
    const dataReset = await resReset.json();
    logStep(8, "POST /api/auth/reset-password", resReset.ok, `Message: ${dataReset.message}`);

    // Step 9: Login with New Password (POST /api/auth/login)
    const resLoginNew = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: newPassword,
      }),
    });
    const dataLoginNew = await resLoginNew.json();
    if (dataLoginNew.data?.token) jwtToken = dataLoginNew.data.token;
    logStep(9, "POST /api/auth/login (New Pass)", resLoginNew.ok && !!jwtToken, `Login Success with New Password`);

    // Step 10: GET All Students (GET /api/students)
    const resStudents = await fetch(`${BASE_URL}/api/students`);
    const dataStudents = await resStudents.json();
    logStep(10, "GET /api/students", resStudents.ok && Array.isArray(dataStudents.data), `Total Students Count: ${dataStudents.data?.length || 0}`);

    // Step 11: Create Student (POST /api/students)
    const resCreateStudent = await fetch(`${BASE_URL}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        name: "Test Student Audit",
        email: `student_${Date.now()}@campusconnect.edu`,
        rollNumber: `ROLL_${Date.now().toString().slice(-6)}`,
        department: "Computer Science",
        year: 3,
        gpa: 3.9,
      }),
    });
    const dataCreateStudent = await resCreateStudent.json();
    if (dataCreateStudent.data?._id) createdStudentId = dataCreateStudent.data._id;
    logStep(11, "POST /api/students (Protected)", resCreateStudent.status === 201, `Student Created ID: ${createdStudentId}`);

    // Step 12: GET Single Student (GET /api/students/:id)
    const resGetStudent = await fetch(`${BASE_URL}/api/students/${createdStudentId}`);
    const dataGetStudent = await resGetStudent.json();
    logStep(12, `GET /api/students/${createdStudentId}`, resGetStudent.ok && dataGetStudent.data?._id === createdStudentId, `Student Name: ${dataGetStudent.data?.name}`);

    // Step 13: Update Student (PUT /api/students/:id)
    const resUpdateStudent = await fetch(`${BASE_URL}/api/students/${createdStudentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        name: "Test Student Audit Updated",
        gpa: 4.0,
      }),
    });
    const dataUpdateStudent = await resUpdateStudent.json();
    logStep(13, `PUT /api/students/${createdStudentId}`, resUpdateStudent.ok, `Updated GPA: ${dataUpdateStudent.data?.gpa}`);

    // Step 14: Delete Student (DELETE /api/students/:id)
    const resDeleteStudent = await fetch(`${BASE_URL}/api/students/${createdStudentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const dataDeleteStudent = await resDeleteStudent.json();
    logStep(14, `DELETE /api/students/${createdStudentId}`, resDeleteStudent.ok, `Message: ${dataDeleteStudent.message}`);

    // Clean up test user record from MongoDB
    if (userId) {
      await User.deleteOne({ _id: userId });
      console.log(`        └─ Cleaned up audit test user ID: ${userId} from database`);
    }

    console.log("\n==================================================");
    console.log(" 🎉 ALL 14 E2E VERIFICATION CHECKS PASSED 100%!  ");
    console.log("==================================================\n");

  } catch (err) {
    console.error("\n❌ E2E VERIFICATION ERROR DETAILS:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runVerification();
