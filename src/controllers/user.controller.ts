import { Request, Response } from "express";
import { ObjectId } from "mongodb";

import userModel from "../models/user.model";

const userDetail = async (req: Request, res: Response) => {
  const userId: string = (req as any).user.userId;

  try {
    const id: ObjectId = new ObjectId(userId);
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user details" });
  }
};
const controller = {
  userDetail,
};
export default controller;
