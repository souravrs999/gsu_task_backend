import { ObjectId } from "mongodb";
import { Task } from "../types/tasks";
import { db } from "../utils/db";

const listAllTask = async (filter: any) => {
  try {
    const result = await db.collection("tasks").find(filter).toArray();
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getTaskById = async (id: ObjectId) => {
  try {
    const task = await db.collection("tasks").findOne({ _id: id });
    return task;
  } catch (err) {
    console.log(err);
  }
};

const createTask = async (task: Partial<Task>) => {
  try {
    const result = await db.collection("tasks").insertOne(task);
    return result.insertedId;
  } catch (err) {
    console.log(err);
  }
};

const updateTask = async (id: ObjectId, task: Partial<Task>) => {
  try {
    await db.collection("tasks").updateOne({ _id: id }, { $set: task });
    return true;
  } catch (err) {
    console.log(err);
  }
};

const deleteTask = async (id: ObjectId) => {
  try {
    await db.collection("tasks").deleteOne({ _id: id });
    return true;
  } catch (err) {
    console.log(err);
  }
};

const model = { listAllTask, getTaskById, createTask, updateTask, deleteTask };
export default model;
