import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";

import userRoutes from "../src/routes/user.routes";
import { connect, close, db } from "../src/utils/db";
import { hashPassword, JWT_SECRET } from "../src/utils/util";
import { ObjectId } from "mongodb";

const app = express();
app.use(express.json());
app.use("/api", userRoutes);

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connect();
});

afterAll(async () => {
  await close();
});

beforeEach(async () => await db.dropDatabase());

describe("User API", () => {
  it("should return 403 if no authorization token", async () => {
    const res = await request(app).get("/api/user").expect(403);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should return 404 if no user found", async () => {
    const token = jwt.sign({ userId: new ObjectId().toString() }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const res = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should return user details if authenticated", async () => {
    const inserted = await db.collection("users").insertOne({
      username: "testuser",
      email: "test@test.com",
      password: await hashPassword("password"),
    });

    const token = jwt.sign(
      { userId: inserted.insertedId.toString() },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const res = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("email", "test@test.com");
    expect(res.body).toHaveProperty("username", "testuser");
  });
});
