import express from 'express';
import {
    getBusinessReviews,
    addReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/business/:businessId', getBusinessReviews);
router.post('/', protect, addReview);

export default router;
