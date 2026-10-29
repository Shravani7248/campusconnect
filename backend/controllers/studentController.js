import mongoose from "mongoose";
import Student from "../models/Student.js";

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Private / Public
 */
export const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single student by ID
 * @route   GET /api/students/:id
 * @access  Private / Public
 */
export const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID format",
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student details fetched successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new student
 * @route   POST /api/students
 * @access  Private
 */
export const createStudent = async (req, res, next) => {
  try {
    const { name, email, rollNo, department, year } = req.body;

    if (!name || !email || !rollNo || !department || !year) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, rollNo, department, year) are required",
      });
    }

    const existingEmail = await Student.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    const existingRollNo = await Student.findOne({ rollNo: rollNo.trim() });
    if (existingRollNo) {
      return res.status(400).json({
        success: false,
        message: "Student with this roll number already exists",
      });
    }

    const student = await Student.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      rollNo: rollNo.trim(),
      department: department.trim(),
      year: year.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student details
 * @route   PUT /api/students/:id
 * @access  Private
 */
export const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID format",
      });
    }

    const { name, email, rollNo, department, year } = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student record not found",
      });
    }

    // Check duplicate email if changed
    if (email && email.toLowerCase().trim() !== student.email) {
      const existingEmail = await Student.findOne({ email: email.toLowerCase().trim() });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Another student already exists with this email",
        });
      }
      student.email = email.toLowerCase().trim();
    }

    // Check duplicate roll number if changed
    if (rollNo && rollNo.trim() !== student.rollNo) {
      const existingRoll = await Student.findOne({ rollNo: rollNo.trim() });
      if (existingRoll) {
        return res.status(400).json({
          success: false,
          message: "Another student already exists with this roll number",
        });
      }
      student.rollNo = rollNo.trim();
    }

    if (name) student.name = name.trim();
    if (department) student.department = department.trim();
    if (year) student.year = year.trim();

    const updatedStudent = await student.save();

    res.status(200).json({
      success: true,
      message: "Student details updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete student record
 * @route   DELETE /api/students/:id
 * @access  Private
 */
export const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID format",
      });
    }

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student record deleted successfully",
      data: deletedStudent,
    });
  } catch (error) {
    next(error);
  }
};