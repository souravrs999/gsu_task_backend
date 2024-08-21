"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../utils/db");
const util_1 = require("../utils/util");
const user_1 = require("../types/user");
const register = async (req, res) => {
    try {
        const parsed = user_1.registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }
        const db = (0, db_1.connect)();
        const users = (await db).collection("users");
        const { username, email, password } = parsed.data;
        const userExists = await users.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "Email already in use." });
        }
        const hashedPswd = await (0, util_1.hashPassword)(password);
        const newUser = { username, email, password: hashedPswd };
        const result = await users.insertOne(newUser);
        res
            .status(201)
            .json({ message: "User registered", userId: result.insertedId });
    }
    catch (err) {
        res.status(500).json({ message: "Error registering user.", err });
    }
};
const login = async (req, res) => {
    try {
        const parsed = user_1.loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }
        const db = (0, db_1.connect)();
        const users = (await db).collection("users");
        const { email, password } = parsed.data;
        const user = await users.findOne({ email });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, util_1.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ message: "Login successful", token });
    }
    catch (err) {
        res.status(500).json({ message: "Error loggin in.", err });
    }
};
const controller = {
    login,
    register,
};
exports.default = controller;
