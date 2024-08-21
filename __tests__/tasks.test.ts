import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";

import taskRoutes from "../src/routes/task.routes";
import { close, connect, db } from "../src/utils/db";
import { JWT_SECRET } from "../src/utils/util";

const app = express();
app.use(express.json());
app.use("/api", taskRoutes);

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connect();
});

afterAll(async () => {
  await close();
});

beforeEach(async () => await db.dropDatabase());

describe("Task API", () => {
  const token = jwt.sign({ userId: 10004 }, JWT_SECRET, {
    expiresIn: "1h",
  });

  it("should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test task",
        description: "This is a test task",
        completed: false,
      })
      .expect(201);
    expect(res.body).toHaveProperty("taskId");
  });

  it("should list all tasks of user", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should update a task", async () => {
    const task = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test task",
        description: "This is a test task",
        completed: false,
      });

    const res = await request(app)
      .put(`/api/tasks/${task.body.taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated title",
      })
      .expect(200);
    expect(res.body.message).toBe("Task updated");
  });

  it("should delete a task", async () => {
    const task = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test task",
        description: "This is a test task",
        completed: false,
      });

    const res = await request(app)
      .delete(`/api/tasks/${task.body.taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.message).toBe("Task deleted");
  });
});
