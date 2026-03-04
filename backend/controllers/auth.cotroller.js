const User = require("../models/usermodels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

let sendEmail = null;
try {
  ({ sendEmail } = require("../helpers/emailHelper"));
} catch (_err) {
  sendEmail = null;
}

const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, address, phoneNumber, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
      role: role || "student",
    });

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, email, username, password } = req.body;
    const credential = emailOrUsername || email || username;

    if (!credential || !password) {
      return res.status(400).json({ message: "Credentials and password are required" });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: credential }, { username: credential }],
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Some schemas have is_active; default to active when field doesn't exist.
    if (user.is_active === false) {
      return res.status(403).json({ message: "Account disabled" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        user_id: user.id,
        role: user.role || "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || "student",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({
        success: true,
        message: "If this email exists, a reset link has been sent",
      });
    }

    const resetToken = jwt.sign({ id: user.id, type: "reset" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    if (typeof sendEmail === "function") {
      await sendEmail(
        user.email,
        "Reset your password",
        `Click the link below to reset your password:\n\n${resetLink}`
      );
    } else {
      // Fallback for local dev when mailer is not wired.
      console.log("RESET LINK:", resetLink);
    }

    return res.json({
      success: true,
      message: "If this email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Email sending failed" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "reset") {
      return res.status(400).json({ message: "Invalid token" });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });

    return res.json({ success: true, message: "Password reset successful" });
  } catch (_error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
