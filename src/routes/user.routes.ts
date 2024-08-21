import { Router } from "express";

import { authMiddleware } from "../middlewares/auth";
import userController from "../controllers/user.controller";

const router = Router();
router.get("/user", authMiddleware, userController.userDetail);

export default router;
