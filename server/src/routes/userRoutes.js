import express from 'express';
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getFavoriteBusinesses,
    toggleFavoriteBusiness
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
    .route('/')
    .get(protect, authorize('admin', 'subadmin'), getUsers);

router.get('/favorites', protect, getFavoriteBusinesses);
router.post('/favorites/:businessId', protect, toggleFavoriteBusiness);

router
    .route('/:id')
    .get(protect, authorize('admin', 'subadmin'), getUserById)
    .put(protect, authorize('admin', 'subadmin'), updateUser)
    .delete(protect, authorize('admin'), deleteUser); // Keep delete for admin only

export default router;
