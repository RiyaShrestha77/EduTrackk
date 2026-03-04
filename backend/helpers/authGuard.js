const jwt = require("jsonwebtoken");
const User = require("../models/usermodels");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const userId = decoded.user_id || decoded.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authGuard;
