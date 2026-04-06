import express from 'express';
import { container } from "../../../../di/inversify.config";
import { CategoryController } from "../../../../interface-adapters/controllers/CategoryController";
import { authenticate } from '../middlewares/auth.middleware';
import { DoctorController } from '../../../../interface-adapters/controllers/DoctorController';
import { upload } from '../middlewares/multer.middleware';

const router = express.Router();

router.use(authenticate(["ADMIN"]));


//Category management
const categoryController = container.get(CategoryController);

router.post('/create-category', categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.put('/categories/:id', categoryController.updateCategory);
router.patch('/categories/:id/toggle-status', categoryController.toggleCategoryStatus);


// Doctor management
const doctorController = container.get(DoctorController);

router.post('/create-doctor', upload.single("profileImage"), doctorController.createDoctor);
router.get('/doctors', doctorController.getAllDoctors);
router.put('/doctors/:id', upload.single("profileImage"), doctorController.updateDoctor);
router.patch('/doctors/:id/toggle-status', doctorController.toggleDoctorStatus);



export default router;