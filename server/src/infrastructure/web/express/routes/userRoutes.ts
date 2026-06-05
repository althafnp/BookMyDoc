import express from "express";
import { container } from "../../../../di/inversify.config";
import { UserProfileController } from "../../../../interface-adapters/controllers/user/UserProfileController";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = express.Router();

router.use(authenticate(["USER"]));

const profileController = container.get(UserProfileController);

router.get('/profile', profileController.getProfile);
router.put('/profile', upload.single("profileImage"), profileController.updateProfile);


export default router;