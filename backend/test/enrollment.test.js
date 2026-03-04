const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize } = require("../database/database");

jest.setTimeout(30000);

describe("Enrollment API", () => {
  let studentToken;
  let instructorToken;
  let courseId;

  beforeAll(async () => {
    await sequelize.sync();
    const uniqueId = Date.now();
    const studentEmail = `enroll_student_${uniqueId}@gmail.com`;
    const instructorEmail = `enroll_instructor_${uniqueId}@gmail.com`;

    await request(app).post("/api/users/register").send({
      username: `enroll_student_${uniqueId}`,
      email: studentEmail,
      password: "securepassword123",
      confirmPassword: "securepassword123",
      phoneNumber: `92${String(uniqueId).slice(-8)}`,
      role: "student",
    });

    await request(app).post("/api/users/register").send({
      username: `enroll_instructor_${uniqueId}`,
      email: instructorEmail,
      password: "securepassword123",
      confirmPassword: "securepassword123",
      phoneNumber: `91${String(uniqueId).slice(-8)}`,
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

    const courseRes = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: `Enrollment Course ${uniqueId}`,
        description: "Course for enrollment testing",
      });
    courseId = courseRes.body.course.course_id;
  });

  it("should enroll student in course", async () => {
    const res = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ course_id: courseId });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should get my enrollments", async () => {
    const res = await request(app)
      .get("/api/enrollments/my")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.enrollments)).toBe(true);
  });

  it("should unenroll student from course", async () => {
    const res = await request(app)
      .delete(`/api/enrollments/course/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

