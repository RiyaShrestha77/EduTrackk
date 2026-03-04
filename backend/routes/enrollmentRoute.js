const router = require("express").Router();
const authGuard = require("../helpers/authGuard");
const {
  enrollInCourse,
  unenrollFromCourse,
  getMyEnrollments,
  getCourseStudents,
} = require("../controllers/enrollmentController");

router.post("/", authGuard, enrollInCourse);
router.delete("/course/:courseId", authGuard, unenrollFromCourse);
router.get("/my", authGuard, getMyEnrollments);
router.get("/course/:courseId/students", authGuard, getCourseStudents);

module.exports = router;
