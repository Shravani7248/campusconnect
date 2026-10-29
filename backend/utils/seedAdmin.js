import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * Seed initial Administrator account from environment variables or default secure credentials
 */
export const seedAdminUser = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@campusconnect.edu").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";
    const adminName = process.env.ADMIN_NAME || "System Administrator";

    let admin = await User.findOne({
      email: { $regex: new RegExp(`^${adminEmail}$`, "i") },
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      try {
        admin = await User.create({
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
          isVerified: true,
        });

        console.log("\n========================================================");
        console.log(`[ADMIN SEED SUCCESS] Created Initial Administrator Account:`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Role: admin`);
        console.log("========================================================\n");
      } catch (createErr) {
        // If duplicate key error occurs during creation, fetch existing user
        admin = await User.findOne({
          email: { $regex: new RegExp(`^${adminEmail}$`, "i") },
        });
      }
    }

    if (admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin.name = adminName;
      admin.password = hashedPassword;
      admin.role = "admin";
      admin.isVerified = true;
      await admin.save();

      console.log("\n========================================================");
      console.log(`[ADMIN SEED READY] Administrator Account Credentials Set:`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Role: admin`);
      console.log("========================================================\n");
    }
  } catch (error) {
    console.error("Failed to seed initial Administrator account:", error.message);
  }
};
