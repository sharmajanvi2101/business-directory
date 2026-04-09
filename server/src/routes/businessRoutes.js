import express from 'express';
import {
    getBusinesses,
    getBusinessById,
    getBusinessBySlug,
    createBusiness,
    updateBusiness,
    verifyBusiness,
    deleteBusiness,
    getBusinessesInRadius,
    trackBusinessView
} from '../controllers/businessController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// IMPORTANT: /near must be defined BEFORE /:id to avoid being matched as an ID
router.get('/near', getBusinessesInRadius);

router.post('/:id/view', trackBusinessView);
router.get('/slug/:slug', getBusinessBySlug);

router
    .route('/')
    .get(getBusinesses)
    .post(protect, authorize('owner', 'subadmin', 'admin'), createBusiness);

router
    .route('/:id')
    .get(getBusinessById)
    .put(protect, authorize('owner', 'subadmin', 'admin'), updateBusiness)
    .delete(protect, authorize('owner', 'subadmin', 'admin'), deleteBusiness);

router.put('/:id/verify', protect, authorize('admin', 'subadmin'), verifyBusiness);

export default router;
