const router = require("express").Router();
const authGuard = require("../helpers/authGuard");
const uploadProfileImage = require("../helpers/uploadProfile");

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.cotroller");

const {
  getUserProfile,
  updateUserProfile,
  getAllStudents,
  deleteStudent,
} = require("../controllers/usercontrollers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/profile", authGuard, getUserProfile);
router.put("/profile", authGuard, uploadProfileImage, updateUserProfile);
router.get("/students", authGuard, getAllStudents);
router.delete("/students/:id", authGuard, deleteStudent);

module.exports = router;
