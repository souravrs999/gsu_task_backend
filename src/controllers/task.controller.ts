import { Request, Response } from "express";

import TaskModel from "../models/tasks.model";
import { createSchema, Task, updateSchema } from "../types/tasks";
import { ObjectId } from "mongodb";

const listAllTask = async (req: Request, res: Response) => {
  try {
    const userId: string = (req as any).user.userId;
    const search = req.query.search as string;

    const filter: any = { userId: new ObjectId(userId) };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await TaskModel.listAllTask(filter);
    return res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", err });
  }
};

const createTask = async (req: Request, res: Response) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const userId: string = (req as any).user.userId;
    const { title, description, completed } = parsed.data;
    const newTask: Partial<Task> = {
      title,
      description,
      completed,
      userId: new ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const taskId = await TaskModel.createTask(newTask);
    res.status(201).json({ message: "Task created", taskId });
  } catch (err) {
    return res.status(500).json({ message: "Error creating task", err });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.format() });
    }

    const updated: Partial<Task> = {
      ...parsed.data,
      updatedAt: new Date(),
    };
    const mId = new ObjectId(id);
    const exists = await TaskModel.getTaskById(mId);
    if (!exists) {
      return res.status(404).json({ message: "Task not found" });
    }
    await TaskModel.updateTask(mId, updated);
    return res.status(200).json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", err });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const mId = new ObjectId(id);
    const exists = await TaskModel.getTaskById(mId);
    if (!exists) {
      return res.status(404).json({ message: "Task not found" });
    }
    await TaskModel.deleteTask(mId);
    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", err });
  }
};

const controller = {
  listAllTask,
  createTask,
  updateTask,
  deleteTask,
};
export default controller;
