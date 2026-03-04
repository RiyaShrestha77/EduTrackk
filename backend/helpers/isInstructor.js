const isInstructor = (req, res, next) => {
  const role = req.user?.role;
  if (role === "instructor" || role === "admin") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Instructor access required" });
};

module.exports = isInstructor;
