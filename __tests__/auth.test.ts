import request from "supertest";
import express from "express";

import authRoutes from "../src/routes/auth.routes";
import { close, connect, db } from "../src/utils/db";
import { hashPassword } from "../src/utils/util";

const app = express();
app.use(express.json());
app.use("/api", authRoutes);

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connect();
});

afterAll(async () => {
  await close();
});

beforeEach(async () => await db.dropDatabase());

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        username: "testuser",
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
    expect(res.body.message).toBe("User registered");
  });

  it("should not register a user with existing mail", async () => {
    await db.collection("users").insertOne({
      username: "existinguser",
      email: "existinguser@test.com",
      password: await hashPassword("password"),
    });

    const res = await request(app)
      .post("/api/register")
      .send({
        username: "existinguser",
        email: "existinguser@test.com",
        password: "password",
      })
      .expect(409);
    expect(res.body.message).toBe("Email already in use.");
  });

  it("should login user with valid credentials", async () => {
    await db.collection("users").insertOne({
      email: "test@test.com",
      password: await hashPassword("password"),
    });

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(200);
    expect(res.body.message).toBe("Login successful");
  });

  it("should not login user with invalid credentials", async () => {
    await db.collection("users").insertOne({
      username: "testuser",
      email: "test@test.com",
      password: await hashPassword("password"),
    });

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "test@test.com",
        password: "badpassword",
      })
      .expect(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
