import { Router } from "express";
import addressController from "../controllers/address.controller";
import authMiddleware from "../middlewares/auth.middleware";

const addressRoutes = Router();
addressRoutes.post("/address", authMiddleware, addressController.add);

export { addressRoutes };
