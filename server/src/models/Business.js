import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a business name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Business must belong to a category']
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: [true, 'Business must belong to a city']
    },
    address: {
        type: String,
        required: [true, 'Please add a full address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    phone: {
        type: String,
        required: [true, 'Please add a contact phone number']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    slug: {
        type: String,
        unique: true,
        trim: true
    },
    logo: String,
    coverImage: String,
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    images: {
        type: [String],
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5']
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationDocuments: {
        type: [String],
        default: []
    },
    workingHours: {
        type: Map,
        of: String, // format: "09:00 - 18:00"
        default: {}
    },
    views: {
        type: Number,
        default: 0
    },
    // Premium Comparison & Differentiation Features
    attributes: {
        isWomenOwned: { type: Boolean, default: false },
        isEcoFriendly: { type: Boolean, default: false },
        hasParking: { type: Boolean, default: false },
        isWifiAvailable: { type: Boolean, default: false }
    },
    deals: [{
        title: { type: String, required: true },
        description: { type: String },
        discountCode: { type: String },
        expiryDate: { type: Date }
    }],
    services: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        duration: { type: String }, // e.g. "45 mins"
        description: { type: String }
    }],
    portfolio: [{
        image: { type: String, required: true },
        title: { type: String },
        description: { type: String }
    }],
    announcements: [{
        title: { type: String, required: true },
        content: { type: String, required: true },
        discountCode: { type: String },
        expiryDate: { type: Date },
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

// Proper 2dsphere index on the GeoJSON location field (required for $near queries)
businessSchema.index({ location: '2dsphere' });

const Business = mongoose.model('Business', businessSchema);

export default Business;
