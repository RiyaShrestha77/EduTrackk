const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize } = require("../database/database");

jest.setTimeout(30000);

describe("Course API", () => {
  let instructorToken;
  let courseId;

  beforeAll(async () => {
    await sequelize.sync();
    const uniqueId = Date.now();
    const instructorEmail = `course_instructor_${uniqueId}@gmail.com`;

    await request(app).post("/api/users/register").send({
      username: `course_instructor_${uniqueId}`,
      email: instructorEmail,
      password: "securepassword123",
      confirmPassword: "securepassword123",
      phoneNumber: `94${String(uniqueId).slice(-8)}`,
      role: "instructor",
    });

    const loginRes = await request(app).post("/api/users/login").send({
      emailOrUsername: instructorEmail,
      password: "securepassword123",
    });

    instructorToken = loginRes.body.token;
  });

  it("should create course", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: "Course Test",
        description: "Course description",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.course).toHaveProperty("course_id");
    courseId = res.body.course.course_id;
  });

  it("should get courses", async () => {
    const res = await request(app)
      .get("/api/courses")
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.courses)).toBe(true);
  });

  it("should update course", async () => {
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: "Course Test Updated",
        description: "Updated description",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should delete course", async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

