import { ObjectId } from "mongodb";
import { z } from "zod";

export interface Task {
  _id: ObjectId;
  title: string;
  description: string;
  userId: ObjectId;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const createSchema = z.object({
  title: z.string().min(3, "Title should be atleast 3 characters."),
  description: z.string().optional(),
  completed: z.boolean().default(false),
});

export const updateSchema = z.object({
  title: z.string().min(3, "Title should be atleast 3 characters.").optional(),
  description: z.string().optional(),
  completed: z.boolean().default(false).optional(),
});
