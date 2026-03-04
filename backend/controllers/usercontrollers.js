const User = require("../models/usermodels.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hasRoleField = Boolean(User.rawAttributes && User.rawAttributes.role);

const getSafeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: hasRoleField ? user.role : "student",
  phoneNumber: user.phoneNumber || null,
  address: user.address || null,
  profilePicture: user.profilePicture || null,
  createdAt: user.createdAt,
});

const addUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User added successfully",
      user: getSafeUser(newUser),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error adding user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValidUser = await bcrypt.compare(password, user.password);
    if (!isValidUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: hasRoleField ? user.role : "student",
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: getSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(getSafeUser(user));
  } catch (err) {
    console.error("PROFILE ERROR:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username } = req.body;

    if (username) {
      const usernameExists = await User.findOne({ where: { username } });
      if (usernameExists && usernameExists.id !== user.id) {
        return res.status(409).json({ message: "Username is already taken" });
      }
      user.username = username;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: getSafeUser(user),
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllStudents = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "instructor" && req.user.role !== "admin")) {
      return res.status(403).json({ message: "Access denied" });
    }

    const where = hasRoleField ? { role: "student" } : {};
    const students = await User.findAll({
      where,
      attributes: ["id", "username", "email", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, students });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch students" });
  }
};

const deleteStudent = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "instructor" && req.user.role !== "admin")) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const student = await User.findByPk(id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (hasRoleField && student.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    await student.destroy();

    return res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to delete student" });
  }
};

module.exports = {
  addUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllStudents,
  deleteStudent,
};
