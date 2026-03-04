const express = require("express").Router();
const authGuard = require("../helpers/authGuard");
const isInstructor = require("../helpers/isInstructor");
const {
  createAssignment,
  getAssignmentsByCourse,
  getSingleAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assigmentController");

express.post("/", authGuard, isInstructor, createAssignment);
express.get("/course/:courseId", authGuard, getAssignmentsByCourse);
express.get("/:id", authGuard, getSingleAssignment);
express.put("/:id", authGuard, isInstructor, updateAssignment);
express.delete("/:id", authGuard, isInstructor, deleteAssignment);

module.exports = express;
