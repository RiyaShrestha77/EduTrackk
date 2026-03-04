const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize } = require("../database/database");

jest.setTimeout(30000);

describe("Assignment API", () => {
  let instructorToken;
  let courseId;
  let assignmentId;

  beforeAll(async () => {
    await sequelize.sync();
    const uniqueId = Date.now();
    const instructorEmail = `assignment_instructor_${uniqueId}@gmail.com`;

    await request(app).post("/api/users/register").send({
      username: `assignment_instructor_${uniqueId}`,
      email: instructorEmail,
      password: "securepassword123",
      confirmPassword: "securepassword123",
      phoneNumber: `93${String(uniqueId).slice(-8)}`,
      role: "instructor",
    });

    const loginRes = await request(app).post("/api/users/login").send({
      emailOrUsername: instructorEmail,
      password: "securepassword123",
    });

    instructorToken = loginRes.body.token;

    const courseRes = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: `Assignment Course ${uniqueId}`,
        description: "Course for assignment testing",
      });

    courseId = courseRes.body.course.course_id;
  });

  it("should create assignment", async () => {
    const res = await request(app)
      .post("/api/assignments")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: "Test Assignment",
        description: "Assignment description",
        dueDate: "2027-01-01",
        courseId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.assignment).toHaveProperty("assignment_id");
    assignmentId = res.body.assignment.assignment_id;
  });

  it("should fetch single assignment", async () => {
    const res = await request(app)
      .get(`/api/assignments/${assignmentId}`)
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.assignment.assignment_id).toBe(assignmentId);
  });

  it("should update assignment", async () => {
    const res = await request(app)
      .put(`/api/assignments/${assignmentId}`)
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: "Updated Assignment",
        description: "Updated assignment description",
        dueDate: "2027-02-01",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Updated");
  });

  it("should delete assignment", async () => {
    const res = await request(app)
      .delete(`/api/assignments/${assignmentId}`)
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Deleted");
  });
});
