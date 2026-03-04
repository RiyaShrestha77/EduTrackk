const Lesson = require("../models/lessonModel");
const Notification = require("../models/notificationModel");
const Course = require("../models/courseModel");
const User = require("../models/usermodels");

const getEntityId = (entity, keys) => {
  for (const key of keys) {
    if (entity && entity[key] !== undefined && entity[key] !== null) return entity[key];
  }
  return null;
};

const notifyStudents = async (message, type = "lesson") => {
  const students = await User.findAll({ where: { role: "student" } });
  if (!Array.isArray(students) || students.length === 0) return;

  const notifications = students
    .map((student) => {
      const studentId = getEntityId(student, ["user_id", "id"]);
      if (!studentId) return null;
      return {
        user_id: studentId,
        message,
        type,
        is_read: false,
      };
    })
    .filter(Boolean);

  if (notifications.length > 0) {
    await Notification.bulkCreate(notifications);
  }
};

const createLesson = async (req, res) => {
  try {
    const { title, content, courseId } = req.body;
    if (!title || !content || !courseId) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const lesson = await Lesson.create({
      title,
      content,
      course_id: Number(courseId),
    });

    const course = await Course.findByPk(Number(courseId));

    await notifyStudents(
      `New Lesson: \"${title}\" added to ${course ? course.title : "a course"}`,
      "lesson"
    );

    return res.status(201).json({ success: true, message: "Lesson created successfully", lesson });
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);
    return res.status(500).json({ success: false, message: "Lesson creation failed" });
  }
};

const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.findAll({ where: { course_id: Number(courseId) } });
    return res.json({ success: true, lessons });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch lessons" });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    await lesson.update({
      title: title ?? lesson.title,
      content: content ?? lesson.content,
    });

    return res.json({ success: true, lesson });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lesson update failed" });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    await lesson.destroy();
    return res.json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lesson deletion failed" });
  }
};

module.exports = {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
};
