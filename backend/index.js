const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./database/database");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/users", require("./routes/userroutes"));
app.use("/api/courses", require("./routes/courseRoute"));
app.use("/api/lessons", require("./routes/lessonRoute"));
app.use("/api/assignments", require("./routes/assigmentRoute"));
app.use("/api/submissions", require("./routes/submissionRoute"));
app.use("/api/notifications", require("./routes/notificationRoute"));
app.use("/api/enrollments", require("./routes/enrollmentRoute"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Home page" });
});

if (process.env.NODE_ENV !== "test") {
  const startServer = async () => {
    await connectDB();
    await sequelize.sync();
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  };

  startServer();
}

module.exports = app;
