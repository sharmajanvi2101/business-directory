import asyncHandler from 'express-async-handler';
import Business from '../models/Business.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import City from '../models/City.js';
import Review from '../models/Review.js';

// @desc    Get counts for platform stats
// @route   GET /api/stats
// @access  Public
const getPlatformStats = asyncHandler(async (req, res) => {
    const { city } = req.query;
    
    // Always fetch global customer count to show "real/total" scale
    const [totalUsers, totalReviews, globalCities, globalCategories] = await Promise.all([
        User.countDocuments({ role: 'customer' }),
        Review.countDocuments(),
        City.countDocuments(),
        Category.countDocuments()
    ]);
    
    // Calculate REAL global happy customers (Users + Reviews + a small base offset)
    const realGlobalCustomers = totalUsers + totalReviews + 50;

    if (city) {
        // Localized Business Stats
        let cityId = city;
        let matchedCityRecord = null;
        
        if (city.match(/^[0-9a-fA-F]{24}$/)) {
            matchedCityRecord = await City.findById(city);
            cityId = city;
        } else {
            matchedCityRecord = await City.findOne({ name: { $regex: new RegExp(`^${city}$`, 'i') } });
            if (matchedCityRecord) cityId = matchedCityRecord._id;
        }

        const businessesInCity = await Business.find({ 
            $or: [{ city: cityId }, { cityName: city }], 
            isVerified: true 
        }).select('_id category');
        
        const categoryIds = [...new Set(businessesInCity.map(b => b.category?.toString()))];

        return res.status(200).json({
            businesses: businessesInCity.length,
            customers: realGlobalCustomers, // Always show real global total for trust
            cities: matchedCityRecord ? 1 : 0,
            categories: categoryIds.filter(Boolean).length
        });
    }

    // Global Stats
    const totalVerifiedBusinesses = await Business.countDocuments({ isVerified: true });

    res.status(200).json({
        businesses: totalVerifiedBusinesses,
        customers: realGlobalCustomers,
        cities: globalCities,
        categories: globalCategories
    });
});

export { getPlatformStats };
