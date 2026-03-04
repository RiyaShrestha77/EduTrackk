const Submission = require("../models/submissionModel");
const User = require("../models/usermodels");
const Notification = require("../models/notificationModel");
const Assignment = require("../models/assigmentModel");
const Course = require("../models/courseModel");

const getUserId = (user) => user?.user_id || user?.id || null;

exports.submitWork = async (req, res) => {
  try {
    const { assignment_id, submission_text } = req.body;
    const student_id = getUserId(req.user);

    if (!assignment_id || !submission_text) {
      return res.status(400).json({ success: false, message: "assignment_id and submission_text are required" });
    }

    if (!student_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let submission = await Submission.findOne({
      where: { assignment_id: Number(assignment_id), student_id },
    });

    let created = false;
    if (submission) {
      await submission.update({ content: submission_text });
    } else {
      submission = await Submission.create({
        assignment_id: Number(assignment_id),
        student_id,
        content: submission_text,
      });
      created = true;
    }

    const assignment = await Assignment.findByPk(Number(assignment_id), {
      include: [{ model: Course }],
    });

    const instructorId = assignment?.Course?.instructor_id;
    if (instructorId) {
      await Notification.create({
        user_id: instructorId,
        message: `Student ${req.user?.username || "User"} submitted work for \"${assignment.title}\"`,
        type: "assignment",
      });
    }

    return res.json({
      success: true,
      message: created ? "Work submitted!" : "Submission updated!",
      submission,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await Submission.findAll({
      where: { assignment_id: Number(assignmentId) },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["username", "email"],
        },
      ],
    });

    return res.json({ success: true, submissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    const submission = await Submission.findByPk(id, {
      include: [{ model: Assignment }],
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    await submission.update({ grade, feedback });

    await Notification.create({
      user_id: submission.student_id,
      message: `Your assignment \"${submission.Assignment?.title || "Assignment"}\" has been graded. Grade: ${grade}`,
      type: "grade",
    });

    return res.json({ success: true, message: "Grade updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
