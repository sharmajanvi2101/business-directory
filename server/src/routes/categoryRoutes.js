import express from 'express';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
    .route('/')
    .get(getCategories)
    .post(protect, authorize('admin', 'subadmin'), createCategory);

router
    .route('/:id')
    .put(protect, authorize('admin', 'subadmin'), updateCategory)
    .delete(protect, authorize('admin', 'subadmin'), deleteCategory);

export default router;
