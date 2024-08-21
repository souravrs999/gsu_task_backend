"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_model_1 = __importDefault(require("../models/tasks.model"));
const tasks_1 = require("../types/tasks");
const mongodb_1 = require("mongodb");
const listAllTask = async (req, res) => {
    try {
        const userId = req.user.userId;
        const search = req.query.search;
        const filter = { userId: new mongodb_1.ObjectId(userId) };
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        const tasks = await tasks_model_1.default.listAllTask(filter);
        return res.status(200).json(tasks);
    }
    catch (err) {
        res.status(500).json({ message: "Error updating task", err });
    }
};
const createTask = async (req, res) => {
    try {
        const parsed = tasks_1.createSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }
        const userId = req.user.userId;
        const { title, description, completed } = parsed.data;
        const newTask = {
            title,
            description,
            completed,
            userId: new mongodb_1.ObjectId(userId),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const taskId = await tasks_model_1.default.createTask(newTask);
        res.status(201).json({ message: "Task created", taskId });
    }
    catch (err) {
        return res.status(500).json({ message: "Error creating task", err });
    }
};
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }
        const parsed = tasks_1.updateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.format() });
        }
        const updated = {
            ...parsed.data,
            updatedAt: new Date(),
        };
        const mId = new mongodb_1.ObjectId(id);
        const exists = await tasks_model_1.default.getTaskById(mId);
        if (!exists) {
            return res.status(404).json({ message: "Task not found" });
        }
        await tasks_model_1.default.updateTask(mId, updated);
        return res.status(200).json({ message: "Task updated" });
    }
    catch (err) {
        res.status(500).json({ message: "Error updating task", err });
    }
};
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }
        const mId = new mongodb_1.ObjectId(id);
        const exists = await tasks_model_1.default.getTaskById(mId);
        if (!exists) {
            return res.status(404).json({ message: "Task not found" });
        }
        await tasks_model_1.default.deleteTask(mId);
        return res.status(200).json({ message: "Task deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Error updating task", err });
    }
};
const controller = {
    listAllTask,
    createTask,
    updateTask,
    deleteTask,
};
exports.default = controller;
