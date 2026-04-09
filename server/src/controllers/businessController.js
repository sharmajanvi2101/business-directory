import asyncHandler from 'express-async-handler';
import Business from '../models/Business.js';
import Review from '../models/Review.js';

// @desc    Get all businesses
// @route   GET /api/businesses
// @access  Public
const getBusinesses = asyncHandler(async (req, res) => {
    const { city, category, search, isVerified, owner } = req.query;
    let query = {};

    if (city) query.city = city;
    if (category) query.category = category;
    if (owner) query.owner = owner;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const businesses = await Business.find(query)
        .populate('category', 'name icon')
        .populate('city', 'name state')
        .sort('-createdAt');

    res.status(200).json({
        count: businesses.length,
        data: businesses
    });
});

// @desc    Get single business
// @route   GET /api/businesses/:id
// @access  Public
const getBusinessById = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.params.id)
        .populate('category', 'name icon')
        .populate('city', 'name state')
        .populate('owner', 'name email phone');

    if (business) {
        res.status(200).json(business);
    } else {
        res.status(404);
        throw new Error('Business not found');
    }
});

// @desc    Get business by slug
// @route   GET /api/businesses/slug/:slug
// @access  Public
const getBusinessBySlug = asyncHandler(async (req, res) => {
    const business = await Business.findOne({ slug: req.params.slug })
        .populate('category', 'name icon')
        .populate('city', 'name state')
        .populate('owner', 'name email phone');

    if (business) {
        res.status(200).json(business);
    } else {
        res.status(404);
        throw new Error('Business not found');
    }
});

// @desc    Create business profile
// @route   POST /api/businesses
// @access  Private/Owner
const createBusiness = asyncHandler(async (req, res) => {
    const { name, description, category, city, address, phone, email, website, workingHours, lat, lng } = req.body;
    const businessData = {
        name,
        description,
        category,
        city,
        address,
        phone,
        owner: req.user._id,
        slug: name.toLowerCase().split(' ').join('-') + '-' + Math.floor(Math.random() * 1000),
        location: {
            type: 'Point',
            coordinates: [
                lng ? parseFloat(lng) : 0,
                lat ? parseFloat(lat) : 0
            ]
        }
    };

    //add validation

    if (email) businessData.email = email;
    if (website) businessData.website = website;
    if (workingHours) businessData.workingHours = workingHours;
    if (req.body.logo) businessData.logo = req.body.logo;
    if (req.body.coverImage) businessData.coverImage = req.body.coverImage;
    if (req.body.portfolio) businessData.portfolio = req.body.portfolio;
    if (req.body.announcements) businessData.announcements = req.body.announcements;

    const business = await Business.create(businessData);

    res.status(201).json(business);
});

// @desc    Update business profile
// @route   PUT /api/businesses/:id
// @access  Private/Owner/Admin
const updateBusiness = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.params.id);

    if (business) {
        // Only owner, admin, or subadmin can update
        if (business.owner.toString() !== req.user._id.toString() && !['admin', 'subadmin'].includes(req.user.role)) {
            res.status(401);
            throw new Error('Not authorized to update this business');
        }

        business.name = req.body.name || business.name;
        business.description = req.body.description || business.description;
        business.category = req.body.category || business.category;
        business.city = req.body.city || business.city;
        business.address = req.body.address || business.address;
        business.phone = req.body.phone || business.phone;
        business.email = req.body.email || business.email;
        business.website = req.body.website || business.website;
        business.workingHours = req.body.workingHours || business.workingHours;
        business.logo = req.body.logo || business.logo;
        business.coverImage = req.body.coverImage || business.coverImage;
        business.portfolio = req.body.portfolio || business.portfolio;
        business.announcements = req.body.announcements || business.announcements;

        if (req.body.lat !== undefined && req.body.lng !== undefined) {
            business.location = {
                type: 'Point',
                coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
            };
        }

        const updatedBusiness = await business.save();
        res.status(200).json(updatedBusiness);
    } else {
        res.status(404);
        throw new Error('Business not found');
    }
});

// @desc    Verify business (Admin/Subadmin)
// @route   PUT /api/businesses/:id/verify
// @access  Private/Admin
const verifyBusiness = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.params.id);

    if (business) {
        business.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : true;
        await business.save();
        res.status(200).json({ message: 'Business verification updated', isVerified: business.isVerified });
    } else {
        res.status(404);
        throw new Error('Business not found');
    }
});

// @desc    Delete business
// @route   DELETE /api/businesses/:id
// @access  Private/Owner/Admin
const deleteBusiness = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.params.id);

    if (business) {
        // Only owner, admin, or subadmin can delete
        if (business.owner.toString() !== req.user._id.toString() && !['admin', 'subadmin'].includes(req.user.role)) {
            res.status(401);
            throw new Error('Not authorized to delete this business');
        }

        await business.deleteOne();
        res.status(200).json({ message: 'Business removed' });
    } else {
        res.status(404);
        throw new Error('Business not found');
    }
});

// @desc    Get businesses near a lat/lng location
// @route   GET /api/businesses/near?lat=&lng=&distance=20
// @access  Public
const getBusinessesInRadius = asyncHandler(async (req, res) => {
    const { lat, lng, distance = 20 } = req.query; // distance in km

    if (!lat || !lng) {
        res.status(400);
        throw new Error('Please provide lat and lng query parameters');
    }

    const maxDistanceMeters = parseFloat(distance) * 1000; // convert km → metres

    const businesses = await Business.find({
        isVerified: true,
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: maxDistanceMeters
            }
        }
    })
        .populate('category', 'name icon')
        .populate('city', 'name state')
        .limit(20);

    res.status(200).json({
        count: businesses.length,
        data: businesses
    });
});

// @desc    Track business view
// @route   POST /api/businesses/:id/view
// @access  Public
const trackBusinessView = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.params.id);

    if (business) {
        business.views += 1;
        await business.save();
        res.status(200).json({ views: business.views });
    } else {
        res.status(404);
        throw new Error('Business not found');
    }
});

export {
    getBusinesses,
    getBusinessById,
    getBusinessBySlug,
    createBusiness,
    updateBusiness,
    verifyBusiness,
    deleteBusiness,
    getBusinessesInRadius,
    trackBusinessView
};
