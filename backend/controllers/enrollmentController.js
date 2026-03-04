const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");
const User = require("../models/usermodels");

const getUserId = (user) => user?.user_id || user?.id || null;

const enrollInCourse = async (req, res) => {
  try {
    if (req.user?.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can enroll" });
    }

    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const courseId = req.params.courseId || req.body.course_id || req.body.courseId;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }

    const course = await Course.findByPk(Number(courseId));
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const [enrollment, created] = await Enrollment.findOrCreate({
      where: {
        course_id: Number(courseId),
        student_id: userId,
      },
      defaults: {
        course_id: Number(courseId),
        student_id: userId,
      },
    });

    if (!created) {
      return res.status(409).json({ success: false, message: "Already enrolled" });
    }

    return res.status(201).json({ success: true, message: "Enrolled successfully", enrollment });
  } catch (error) {
    console.error("ENROLL ERROR:", error);
    return res.status(500).json({ success: false, message: "Enrollment failed" });
  }
};

const unenrollFromCourse = async (req, res) => {
  try {
    if (req.user?.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can unenroll" });
    }

    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const courseId = req.params.courseId || req.body.course_id || req.body.courseId;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }

    const deleted = await Enrollment.destroy({
      where: {
        course_id: Number(courseId),
        student_id: userId,
      },
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    return res.json({ success: true, message: "Unenrolled successfully" });
  } catch (error) {
    console.error("UNENROLL ERROR:", error);
    return res.status(500).json({ success: false, message: "Unenrollment failed" });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    if (req.user?.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can view enrollments" });
    }

    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const enrollments = await Enrollment.findAll({
      where: { student_id: userId },
      include: [{ model: Course }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, enrollments });
  } catch (error) {
    console.error("GET ENROLLMENTS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch enrollments" });
  }
};

const getCourseStudents = async (req, res) => {
  try {
    if (req.user?.role !== "instructor") {
      return res.status(403).json({ success: false, message: "Instructors only" });
    }

    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { courseId } = req.params;
    const course = await Course.findByPk(Number(courseId));

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.instructor_id !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const enrollments = await Enrollment.findAll({
      where: { course_id: Number(courseId) },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["id", "username", "email", "phoneNumber"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      students: enrollments.map((e) => e.student).filter(Boolean),
    });
  } catch (error) {
    console.error("GET COURSE STUDENTS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch course students" });
  }
};

module.exports = {
  enrollInCourse,
  unenrollFromCourse,
  getMyEnrollments,
  getCourseStudents,
};
