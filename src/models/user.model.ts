import { ObjectId } from "mongodb";
import { db } from "../utils/db";

const getUserById = async (id: ObjectId) => {
  try {
    const user = await db.collection("users").findOne({ _id: id });
    return user;
  } catch (err) {
    console.log(err);
  }
};

const model = { getUserById };
export default model;
