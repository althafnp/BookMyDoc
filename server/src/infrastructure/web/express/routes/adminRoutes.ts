import express from 'express';
import { container } from "../../../../di/inversify.config";
import { AdminCategoryController } from "../../../../interface-adapters/controllers/admin/AdminCategoryController";
import { authenticate } from '../middlewares/auth.middleware';
import { AdminDoctorController } from '../../../../interface-adapters/controllers/admin/AdminDoctorController';
import { upload } from '../middlewares/multer.middleware';
import { AdminUserController } from '../../../../interface-adapters/controllers/admin/AdminUserController';

const router = express.Router();

router.use(authenticate(["ADMIN"]));


//Category management
const categoryController = container.get(AdminCategoryController);

router.post('/create-category', categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.put('/categories/:id', categoryController.updateCategory);
router.patch('/categories/:id/toggle-status', categoryController.toggleCategoryStatus);


// Doctor management
const doctorController = container.get(AdminDoctorController);

router.post('/create-doctor', upload.single("profileImage"), doctorController.createDoctor);
router.get('/doctors', doctorController.getAllDoctors);
router.put('/doctors/:id', upload.single("profileImage"), doctorController.updateDoctor);
router.patch('/doctors/:id/toggle-status', doctorController.toggleDoctorStatus);


//User management
const userController = container.get(AdminUserController);

router.get('/users', userController.getAllUsers);
router.patch('/users/:id/toggle-status', userController.toggleUserStatus);



export default router;