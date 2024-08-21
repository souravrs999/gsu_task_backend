"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const task_controller_1 = __importDefault(require("../controllers/task.controller"));
const router = (0, express_1.Router)();
router.get("/tasks", auth_1.authMiddleware, task_controller_1.default.listAllTask);
router.post("/tasks", auth_1.authMiddleware, task_controller_1.default.createTask);
router.put("/tasks/:id", auth_1.authMiddleware, task_controller_1.default.updateTask);
router.delete("/tasks/:id", auth_1.authMiddleware, task_controller_1.default.deleteTask);
exports.default = router;
