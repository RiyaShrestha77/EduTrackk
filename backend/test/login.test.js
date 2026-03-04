const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize } = require("../database/database");

jest.setTimeout(30000);

describe("Login API", () => {
  let email;
  const password = "securepassword123";

  beforeAll(async () => {
    await sequelize.sync();
    const uniqueId = Date.now();
    email = `login_user_${uniqueId}@gmail.com`;

    await request(app).post("/api/users/register").send({
      username: `login_user_${uniqueId}`,
      email,
      password,
      confirmPassword: password,
      phoneNumber: `95${String(uniqueId).slice(-8)}`,
      role: "student",
    });
  });

  it("should login with email", async () => {
    const res = await request(app).post("/api/users/login").send({
      emailOrUsername: email,
      password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app).post("/api/users/login").send({
      emailOrUsername: email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });
});

