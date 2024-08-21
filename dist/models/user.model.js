"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../utils/db");
const getUserById = async (id) => {
    try {
        const user = await db_1.db.collection("users").findOne({ _id: id });
        return user;
    }
    catch (err) {
        console.log(err);
    }
};
const model = { getUserById };
exports.default = model;
