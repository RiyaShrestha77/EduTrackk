const Assignment = require("../models/assigmentModel");
const Submission = require("../models/submissionModel");
const Notification = require("../models/notificationModel");
const Course = require("../models/courseModel");
const User = require("../models/usermodels");

const getUserId = (user) => user?.user_id || user?.id || null;
const getEntityId = (entity, keys) => {
  for (const key of keys) {
    if (entity && entity[key] !== undefined && entity[key] !== null) return entity[key];
  }
  return null;
};

const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, courseId } = req.body;

    if (!title || !dueDate || !courseId) {
      return res.status(400).json({ success: false, message: "title, dueDate and courseId are required" });
    }

    const assignment = await Assignment.create({
      title,
      description: description || "",
      due_date: dueDate,
      course_id: Number(courseId),
    });

    const course = await Course.findByPk(Number(courseId));

    const students = await User.findAll({ where: { role: "student" } });
    if (Array.isArray(students) && students.length > 0) {
      const notifications = students
        .map((student) => {
          const studentId = getEntityId(student, ["user_id", "id"]);
          if (!studentId) return null;
          return {
            user_id: studentId,
            message: `New Assignment: \"${title}\" in ${course ? course.title : "Course"}. Due: ${dueDate}`,
            type: "assignment",
            is_read: false,
          };
        })
        .filter(Boolean);

      if (notifications.length > 0) {
        await Notification.bulkCreate(notifications);
      }
    }

    return res.status(201).json({ success: true, message: "Assignment created!", assignment });
  } catch (error) {
    console.error("Assignment Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    return res.json({ success: true, assignment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const [updatedCount] = await Assignment.update(
      { title, description, due_date: dueDate },
      { where: { assignment_id: req.params.id } }
    );

    if (!updatedCount) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    return res.json({ success: true, message: "Updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = getUserId(req.user);

    const assignments = await Assignment.findAll({
      where: { course_id: Number(courseId) },
      include: [
        {
          model: Submission,
          where: userId ? { student_id: userId } : undefined,
          required: false,
        },
      ],
      order: [["due_date", "ASC"]],
    });

    return res.json({ success: true, assignments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const deletedCount = await Assignment.destroy({ where: { assignment_id: req.params.id } });

    if (!deletedCount) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    return res.json({ success: true, message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};

module.exports = {
  createAssignment,
  getAssignmentsByCourse,
  getSingleAssignment,
  updateAssignment,
  deleteAssignment,
};
