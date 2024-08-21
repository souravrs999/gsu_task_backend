import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { connect } from "../utils/db";
import { hashPassword, JWT_SECRET } from "../utils/util";
import { loginSchema, registerSchema, User } from "../types/user";

const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const db = connect();
    const users = (await db).collection("users");
    const { username, email, password } = parsed.data;

    const userExists = await users.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPswd = await hashPassword(password);
    const newUser: User = { username, email, password: hashedPswd };
    const result = await users.insertOne(newUser);
    res
      .status(201)
      .json({ message: "User registered", userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: "Error registering user.", err });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const db = connect();
    const users = (await db).collection("users");
    const { email, password } = parsed.data;
    const user = await users.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error loggin in.", err });
  }
};

const controller = {
  login,
  register,
};
export default controller;
