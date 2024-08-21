import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import taskController from "../controllers/task.controller";

const router = Router();
router.get("/tasks", authMiddleware, taskController.listAllTask);
router.post("/tasks", authMiddleware, taskController.createTask);
router.put("/tasks/:id", authMiddleware, taskController.updateTask);
router.delete("/tasks/:id", authMiddleware, taskController.deleteTask);

export default router;
