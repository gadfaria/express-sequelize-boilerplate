import { Router } from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const userRoutes = Router();
userRoutes.post("/user", userController.add);
userRoutes.post("/user/address", authMiddleware, userController.addAddress);
userRoutes.get("/user", authMiddleware, userController.get);
userRoutes.get("/user/:id", authMiddleware, userController.find);
userRoutes.put("/user", authMiddleware, userController.update);
userRoutes.delete("/user", authMiddleware, userController.delete);

export { userRoutes };
