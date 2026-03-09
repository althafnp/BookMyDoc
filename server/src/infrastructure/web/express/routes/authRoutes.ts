import express from "express"
import { container } from "../../../../di/inversify.config";
import { AuthController } from "../../../../interface-adapters/controllers/AuthController";
import { TYPES } from "../../../../di/types";

const router = express.Router();


// Get controller from DI container
const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/auth/signup', authController.signupUser);
router.get('/auth/verify-email/:token', authController.verifyEmail);
router.post('/auth/login', authController.loginUser);
router.post('/auth/google', authController.googleAuth);

router.post('/auth/logout', authController.logout)
router.post('/auth/refresh', authController.refreshToken)


//Admin
router.post('/admin/auth/login', authController.loginAdmin);

//Doctor
router.post('/doctor/auth/login', authController.loginDoctor);



export default router