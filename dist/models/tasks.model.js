"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../utils/db");
const listAllTask = async (filter) => {
    try {
        const result = await db_1.db.collection("tasks").find(filter).toArray();
        return result;
    }
    catch (err) {
        console.log(err);
    }
};
const getTaskById = async (id) => {
    try {
        const task = await db_1.db.collection("tasks").findOne({ _id: id });
        return task;
    }
    catch (err) {
        console.log(err);
    }
};
const createTask = async (task) => {
    try {
        const result = await db_1.db.collection("tasks").insertOne(task);
        return result.insertedId;
    }
    catch (err) {
        console.log(err);
    }
};
const updateTask = async (id, task) => {
    try {
        await db_1.db.collection("tasks").updateOne({ _id: id }, { $set: task });
        return true;
    }
    catch (err) {
        console.log(err);
    }
};
const deleteTask = async (id) => {
    try {
        await db_1.db.collection("tasks").deleteOne({ _id: id });
        return true;
    }
    catch (err) {
        console.log(err);
    }
};
const model = { listAllTask, getTaskById, createTask, updateTask, deleteTask };
exports.default = model;
