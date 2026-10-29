import express from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected Read Routes
router.get("/", protect, getStudents);
router.get("/:id", protect, getStudentById);

// Restricted Mutation Routes (Admin & Faculty only)
router.post("/", protect, authorize("admin", "faculty", "administrator"), createStudent);
router.put("/:id", protect, authorize("admin", "faculty", "administrator"), updateStudent);
router.delete("/:id", protect, authorize("admin", "faculty", "administrator"), deleteStudent);

export default router;