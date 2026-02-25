import express from "express"
import { container } from "../../../../di/inversify.config";
import { AuthController } from "../../../../interface-adapters/controllers/AuthController";
import { TYPES } from "../../../../di/types";

const router = express.Router();


// Get controller from DI container
const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/auth/signup', authController.signupUser);


export default router