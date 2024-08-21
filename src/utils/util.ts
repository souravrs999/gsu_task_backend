import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const TEST_ENV = process.env.NODE_ENV === "test";
export const DB_NAME = process.env.DB_NAME;
export const DB_URI = process.env.MONGODB_ATLAS_URI;
export const APPLICATION_PORT: string = process.env.PORT || "5000";
export const JWT_SECRET: string = process.env.JWT_SECRET || "supersecret";

export const hashPassword = async (passwordStrnging: string) => {
  const hashed = await bcrypt.hash(passwordStrnging, 10);
  return hashed;
};
