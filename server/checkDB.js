import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Business from './src/models/Business.js';
import User from './src/models/User.js';
import City from './src/models/City.js';
import Category from './src/models/Category.js';

dotenv.config();

const checkCounts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const [businesses, customers, cities, categories] = await Promise.all([
            Business.countDocuments({ isVerified: true }),
            User.countDocuments({ role: 'customer' }),
            City.countDocuments(),
            Category.countDocuments()
        ]);
        console.log('--- DB COUNTS ---');
        console.log('Verified Businesses:', businesses);
        console.log('Customers:', customers);
        console.log('Cities:', cities);
        console.log('Categories:', categories);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkCounts();
