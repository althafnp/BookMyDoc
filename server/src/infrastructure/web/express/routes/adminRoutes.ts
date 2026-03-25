import express from 'express'
import { container } from "../../../../di/inversify.config";
import { CategoryController } from "../../../../interface-adapters/controllers/CategoryController";
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authenticate(["ADMIN"]));


//Category management
const categoryController = container.get(CategoryController);

router.post('/create-category', categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.put('/categories/:id', categoryController.updateCategory);
router.patch('/categories/:id/toggle-status', categoryController.toggleCategoryStatus);



export default router;