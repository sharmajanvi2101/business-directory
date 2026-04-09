import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Business from '../models/Business.js';

// @desc    Get reviews for a business
// @route   GET /api/reviews/business/:businessId
// @access  Public
const getBusinessReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ business: req.params.businessId })
        .populate('user', 'name')
        .sort('-createdAt');

    res.status(200).json({
        count: reviews.length,
        data: reviews
    });
});

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
    const { businessId, rating, comment } = req.body;

    // Check if business exists
    const business = await Business.findById(businessId);

    if (!business) {
        res.status(404);
        throw new Error('Business not found');
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
        user: req.user._id,
        business: businessId
    });

    if (alreadyReviewed) {
        res.status(400);
        throw new Error('You have already reviewed this business');
    }

    const review = await Review.create({
        user: req.user._id,
        business: businessId,
        rating,
        comment
    });

    res.status(201).json(review);
});

export {
    getBusinessReviews,
    addReview
};
