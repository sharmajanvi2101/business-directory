import express from 'express';
import {
    getCities,
    createCity,
    updateCity,
    deleteCity
} from '../controllers/cityController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
    .route('/')
    .get(getCities)
    .post(protect, authorize('admin', 'subadmin'), createCity);

router
    .route('/:id')
    .put(protect, authorize('admin', 'subadmin'), updateCity)
    .delete(protect, authorize('admin', 'subadmin'), deleteCity);

export default router;
