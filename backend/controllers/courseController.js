const Course = require("../models/courseModel");
const Notification = require("../models/notificationModel");
const User = require("../models/usermodels");

const path = require("path");
const fs = require("fs");

const getUserId = (user) => user?.user_id || user?.id || null;
const getEntityId = (entity, keys) => {
  for (const key of keys) {
    if (entity && entity[key] !== undefined && entity[key] !== null) return entity[key];
  }
  return null;
};

const safeDeleteFile = (relativePath) => {
  if (!relativePath) return;

  // Convert "/uploads/..." to project-local path.
  const sanitized = relativePath.replace(/^[/\\]+/, "");
  const absolutePath = path.join(__dirname, "..", sanitized);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

const notifyStudents = async (message, type = "course") => {
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
      };
    })
    .filter(Boolean);

  if (notifications.length > 0) {
    await Notification.bulkCreate(notifications);
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const thumbnailPath = req.file ? `/uploads/courses/${req.file.filename}` : null;

    const course = await Course.create({
      title,
      description,
      thumbnail: thumbnailPath,
      instructor_id: userId,
    });

    await notifyStudents(`New Course Alert: \"${title}\" is now available!`, "course");

    return res.status(201).json({ success: true, course });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    return res.status(500).json({ success: false, message: "Course creation failed" });
  }
};

const getCourses = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    const where = req.user?.role === "instructor" ? { instructor_id: userId } : {};

    const courses = await Course.findAll({ where });
    return res.json({ success: true, courses });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const userId = getUserId(req.user);
    const isAdmin = req.user?.role === "admin";
    if (!isAdmin && course.instructor_id !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { title, description } = req.body;
    let thumbnailPath = course.thumbnail;

    if (req.file) {
      safeDeleteFile(course.thumbnail);
      thumbnailPath = `/uploads/courses/${req.file.filename}`;
    }

    await course.update({
      title: title ?? course.title,
      description: description ?? course.description,
      thumbnail: thumbnailPath,
    });

    await notifyStudents(`Update: The course \"${course.title}\" has been updated with new content.`, "course");

    return res.json({ success: true, course });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    return res.status(500).json({ success: false, message: "Course update failed" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const userId = getUserId(req.user);
    const isAdmin = req.user?.role === "admin";
    if (!isAdmin && course.instructor_id !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    safeDeleteFile(course.thumbnail);
    await course.destroy();

    return res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    return res.status(500).json({ success: false, message: "Course deletion failed" });
  }
};

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
};
