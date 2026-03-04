const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize } = require("../database/database");

jest.setTimeout(30000);

describe("Notification API", () => {
  let studentToken;
  let instructorToken;
  let notificationId;

  beforeAll(async () => {
    await sequelize.sync();
    const uniqueId = Date.now();
    const studentEmail = `notify_student_${uniqueId}@gmail.com`;
    const instructorEmail = `notify_instructor_${uniqueId}@gmail.com`;

    await request(app).post("/api/users/register").send({
      username: `notify_student_${uniqueId}`,
      email: studentEmail,
      password: "securepassword123",
      confirmPassword: "securepassword123",
      phoneNumber: `90${String(uniqueId).slice(-8)}`,
      role: "student",
    });

    await request(app).post("/api/users/register").send({
      username: `notify_instructor_${uniqueId}`,
      email: instructorEmail,
      password: "securepassword123",
      confirmPassword: "securepassword123",
      phoneNumber: `89${String(uniqueId).slice(-8)}`,
      role: "instructor",
    });

    const studentLogin = await request(app).post("/api/users/login").send({
      emailOrUsername: studentEmail,
      password: "securepassword123",
    });
    studentToken = studentLogin.body.token;

    const instructorLogin = await request(app).post("/api/users/login").send({
      emailOrUsername: instructorEmail,
      password: "securepassword123",
    });
    instructorToken = instructorLogin.body.token;

    // Creating a course triggers a notification for students.
    await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: `Notification Course ${uniqueId}`,
        description: "Course for notification testing",
      });
  });

  it("should fetch notifications for current student", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.notifications)).toBe(true);

    if (res.body.notifications.length > 0) {
      notificationId = res.body.notifications[0].notification_id;
    }
  });

  it("should mark one notification as read", async () => {
    if (!notificationId) {
      return;
    }

    const res = await request(app)
      .put(`/api/notifications/read/${notificationId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should mark all notifications as read", async () => {
    const res = await request(app)
      .put("/api/notifications/read-all")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

