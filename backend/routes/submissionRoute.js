const router = require("express").Router();
const authGuard = require("../helpers/authGuard");
const isInstructor = require("../helpers/isInstructor");
const { submitWork, getSubmissionsByAssignment, gradeSubmission } = require("../controllers/sumbissionController");

router.post("/", authGuard, submitWork);
router.get("/assignment/:assignmentId", authGuard, isInstructor, getSubmissionsByAssignment);
router.put("/:id/grade", authGuard, isInstructor, gradeSubmission);

module.exports = router;
