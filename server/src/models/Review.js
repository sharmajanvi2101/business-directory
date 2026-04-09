import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 and 5'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment'],
        trim: true
    },
    images: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

// Calculate average rating when review is added
reviewSchema.statics.getAverageRating = async function (businessId) {
    const stats = await this.aggregate([
        { $match: { business: businessId } },
        {
            $group: {
                _id: '$business',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    try {
        if (stats.length > 0) {
            await mongoose.model('Business').findByIdAndUpdate(businessId, {
                averageRating: stats[0].averageRating.toFixed(1),
                reviewCount: stats[0].reviewCount
            });
        } else {
            await mongoose.model('Business').findByIdAndUpdate(businessId, {
                averageRating: 0,
                reviewCount: 0
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.business);
});

// Call getAverageRating before remove
reviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.business);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
