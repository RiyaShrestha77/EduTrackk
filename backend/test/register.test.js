const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize } = require("../database/database");

jest.setTimeout(30000);

describe("Register API", () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  it("should register user successfully", async () => {
    const uniqueId = Date.now();
    const res = await request(app).post("/api/users/register").send({
      username: `register_user_${uniqueId}`,
      email: `register_user_${uniqueId}@gmail.com`,
      password: "securepassword123",
      confirmPassword: "securepassword123",
      phoneNumber: `98${String(uniqueId).slice(-8)}`,
      role: "student",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should reject duplicate email", async () => {
    const uniqueId = Date.now();
    const email = `register_dup_${uniqueId}@gmail.com`;

    await request(app).post("/api/users/register").send({
      username: `register_dup_1_${uniqueId}`,
      email,
      password: "securepassword123",
      confirmPassword: "securepassword123",
      phoneNumber: `97${String(uniqueId).slice(-8)}`,
      role: "student",
    });

    const res = await request(app).post("/api/users/register").send({
      username: `register_dup_2_${uniqueId}`,
      email,
      password: "securepassword123",
      confirmPassword: "securepassword123",
      phoneNumber: `96${String(uniqueId).slice(-8)}`,
      role: "student",
    });

    expect(res.statusCode).toBe(409);
  });
});

