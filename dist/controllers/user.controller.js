"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const user_model_1 = __importDefault(require("../models/user.model"));
const userDetail = async (req, res) => {
    const userId = req.user.userId;
    try {
        const id = new mongodb_1.ObjectId(userId);
        const user = await user_model_1.default.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching user details" });
    }
};
const controller = {
    userDetail,
};
exports.default = controller;
