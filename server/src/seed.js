import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Category from './models/Category.js';
import City from './models/City.js';
import Business from './models/Business.js';
import User from './models/User.js';
import Review from './models/Review.js';

dotenv.config();

const categories = [
    { name: 'Kirana / Grocery Store', icon: 'ShoppingBag', description: 'Daily essentials and grocery items' },
    { name: 'Tea Stall (Chai Shop)', icon: 'Coffee', description: 'Local tea, coffee and snacks' },
    { name: 'Bakery Shop', icon: 'Utensils', description: 'Cakes, pastries, and bread' },
    { name: 'Medical Store / Pharmacy', icon: 'Stethoscope', description: 'Medicines and healthcare products' },
    { name: 'Vegetable Shop', icon: 'Leaf', description: 'Fresh vegetables' },
    { name: 'Fruit Shop', icon: 'Apple', description: 'Fresh seasonal fruits' },
    { name: 'Mobile Repair Shop', icon: 'Smartphone', description: 'Mobile repairing and accessories' },
    { name: 'Barber Shop / Hair Salon', icon: 'Scissors', description: 'Hair cutting and grooming services' },
    { name: 'Tailor Shop', icon: 'Pocket', description: 'Stitching and garment alteration' },
    { name: 'Stationery Shop', icon: 'Book', description: 'Books, pens, and office supplies' },
    { name: 'Clothing Shop', icon: 'Shirt', description: 'Ready-made garments and fabrics' },
    { name: 'Footwear Shop', icon: 'Footprints', description: 'Shoes, sandals and boots' },
    { name: 'Hardware Shop', icon: 'Hammer', description: 'Tools and building materials' },
    { name: 'Electronics Repair Shop', icon: 'Zap', description: 'Repairing home appliances and gadgets' },
    { name: 'Dairy / Milk Shop', icon: 'Droplets', description: 'Milk, curd, and dairy products' },
    { name: 'Sweet Shop (Mithai Shop)', icon: 'Cookie', description: 'Traditional sweets and desserts' },
    { name: 'Pan Shop', icon: 'Wind', description: 'Betel leaves and tobacco products' },
    { name: 'Auto Repair / Bike Garage', icon: 'Wrench', description: 'Vehicle servicing and repairs' },
    { name: 'Gift Shop', icon: 'Gift', description: 'Gifts and decorative items' },
    { name: 'Flower Shop', icon: 'Flower2', description: 'Fresh flowers and bouquets' },
    { name: 'Restaurants', icon: 'Utensils', description: 'Quality food and dining experiences' },
    { name: 'Doctor', icon: 'Stethoscope', description: 'Medical clinics and healthcare services' },
    { name: 'Gym', icon: 'Dumbbell', description: 'Fitness centers and health clubs' },
    { name: 'Electrician', icon: 'Zap', description: 'Electrical repairs and installations' }
];

const categoryImages = {
    'Kirana / Grocery Store': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80&v=2',
    'Tea Stall (Chai Shop)': 'https://images.unsplash.com/photo-1571934811356-5cc5c1a6121c?auto=format&fit=crop&w=1200&q=80&v=3',
    'Bakery Shop': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80&v=2',
    'Medical Store / Pharmacy': 'https://images.unsplash.com/photo-1631549916768-4119cb8e0f72?auto=format&fit=crop&w=1200&q=80&v=2',
    'Vegetable Shop': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1200&q=80&v=2',
    'Fruit Shop': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80&v=2',
    'Mobile Repair Shop': 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80&v=2',
    'Barber Shop / Hair Salon': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80&v=2',
    'Tailor Shop': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80&v=2',
    'Stationery Shop': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80&v=2',
    'Clothing Shop': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80&v=2',
    'Footwear Shop': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80&v=2',
    'Hardware Shop': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80&v=2',
    'Electronics Repair Shop': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80&v=2',
    'Dairy / Milk Shop': 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=1200&q=80&v=2',
    'Sweet Shop (Mithai Shop)': 'https://images.unsplash.com/photo-1589114126524-214df83c92ce?auto=format&fit=crop&w=1200&q=80&v=2',
    'Pan Shop': 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=1200&q=80&v=2',
    'Auto Repair / Bike Garage': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80&v=2',
    'Gift Shop': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80&v=2',
    'Flower Shop': 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80&v=2',
    'Restaurants': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80&v=2',
    'Doctor': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80&v=2',
    'Gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000',
    'Electrician': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80&v=2'
};

const cities = [
    { name: 'Palanpur', state: 'Gujarat', country: 'India', lat: 24.1722, lng: 72.4333 },
    { name: 'Ahmedabad', state: 'Gujarat', country: 'India', lat: 23.0225, lng: 72.5714 }
];

const fakeReviewComments = [
    "Amazing service and very professional!",
    "One of the best in the city. Highly recommended.",
    "Quality is top-notch. Worth every penny.",
    "Responsive staff and great atmosphere.",
    "Good experience overall, will visit again.",
    "Fair pricing and honest work.",
    "I was impressed by their attention to detail.",
    "Reliable and trustworthy. Five stars!",
    "Bit expensive but the quality justifies it.",
    "Friendly owners and very helpful staff."
];

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️ Clearing old data...');
        await Business.deleteMany({});
        await Category.deleteMany({});
        await City.deleteMany({});
        await Review.deleteMany({});

        // Get an owner user
        let owner = await User.findOne({ role: { $in: ['admin', 'owner'] } });
        if (!owner) {
            console.log('👤 Creating temporary owner user...');
            owner = await User.create({
                name: 'System Admin',
                email: 'admin@bizdirect.com',
                password: 'password123',
                phone: '9999999999',
                role: 'admin',
                isVerified: true
            });
        }

        // Create some reviewer users if they don't exist
        console.log('👥 Ensuring reviewer users exist...');
        const reviewerEmails = ['rahul@gmail.com', 'priya@gmail.com', 'amit@gmail.com', 'sneha@gmail.com'];
        const reviewers = [];
        for (let i = 0; i < reviewerEmails.length; i++) {
            const email = reviewerEmails[i];
            let u = await User.findOne({ email });
            if (!u) {
                u = await User.create({
                    name: email.split('@')[0],
                    email,
                    password: 'password123',
                    phone: `888888888${i}`,
                    role: 'customer',
                    isVerified: true
                });
            }
            reviewers.push(u);
        }

        // Seed Categories
        console.log('🌱 Seeding categories...');
        const createdCategories = await Category.insertMany(categories);

        // Seed Cities
        console.log('🌆 Seeding cities...');
        const createdCities = await City.insertMany(cities);

        // Seed Businesses
        console.log('🏪 Generating local businesses...');
        const businesses = [];

        // Add spotlight businesses specifically for Palanpur
        const palanpur = createdCities.find(c => c.name === 'Palanpur');
        const restaurantCat = createdCategories.find(c => c.name === 'Restaurants');
        const doctorCat = createdCategories.find(c => c.name === 'Doctor');
        const gymCat = createdCategories.find(c => c.name === 'Gym');
        const electricianCat = createdCategories.find(c => c.name === 'Electrician');

        if (palanpur) {
            // Existing ones
            businesses.push({
                name: 'Palanpur Rasoi',
                description: 'Authentic Gujarati and North Indian cuisine. Best thali in town!',
                category: restaurantCat?._id,
                city: palanpur._id,
                slug: 'palanpur-rasoi',
                address: 'Highway Cross Road, Palanpur',
                phone: '+91 9876543210',
                email: 'info@palanpurrasoi.com',
                website: 'https://palanpurrasoi.com',
                owner: owner._id,
                isVerified: true,
                images: [categoryImages['Restaurants']],
                coverImage: categoryImages['Restaurants'],
                location: { type: 'Point', coordinates: [72.4333, 24.1722] }
            });

            businesses.push({
                name: 'Medipolic',
                description: 'Dr. Ramesh Prajapati is a trusted and experienced healthcare professional dedicated to providing high-quality medical care to patients of all ages. With expertise in diagnosing and treating a wide range of health conditions, the clinic focuses on patient-centered care, ensuring comfort, safety, and personalized treatment. The clinic offers services such as general consultation, diagnosis, preventive care, and basic treatments. Equipped with modern medical facilities and a clean, hygienic environment, Dr. Ramesh Prajapati aims to deliver reliable and effective healthcare solutions. Conveniently located in Palanpur, the clinic is committed to serving the local community with compassion, professionalism, and timely medical support.',
                category: doctorCat?._id,
                city: palanpur._id,
                slug: 'medipolic',
                address: 'Near Railway Station, Palanpur',
                phone: '+91 9876543211',
                email: 'medipoilc@gmail.com',
                website: 'https://medipolic.com',
                owner: owner._id,
                isVerified: true,
                images: [categoryImages['Doctor']],
                coverImage: categoryImages['Doctor'],
                location: { type: 'Point', coordinates: [72.4350, 24.1750] }
            });

            businesses.push({
                name: 'PowerZone Fitness',
                description: 'Modern gym with latest equipment and personal training.',
                category: gymCat?._id,
                city: palanpur._id,
                slug: 'powerzone-fitness',
                address: 'Suraj Plaza, 3rd Floor, Palanpur',
                phone: '+91 9876543212',
                email: 'gym@powerzone.com',
                owner: owner._id,
                isVerified: true,
                images: [categoryImages['Gym']],
                coverImage: categoryImages['Gym'],
                location: { type: 'Point', coordinates: [72.4300, 24.1700] }
            });

            // New ones for other categories
            const groceryCat = createdCategories.find(c => c.name.includes('Grocery'));
            businesses.push({
                name: 'Krishna Kirana Store',
                description: 'Complete range of groceries, spices, and daily household needs.',
                category: groceryCat?._id,
                city: palanpur._id,
                slug: 'krishna-kirana-store',
                address: 'Main Bazaar, Palanpur',
                phone: '+91 9876543214',
                owner: owner._id,
                isVerified: true,
                images: [categoryImages['Kirana / Grocery Store']],
                coverImage: categoryImages['Kirana / Grocery Store'],
                location: { type: 'Point', coordinates: [72.4340, 24.1730] }
            });

            const teaCat = createdCategories.find(c => c.name.includes('Tea Stall'));
            businesses.push({
                name: 'Janta Tea Post',
                description: 'Famous ginger tea and maska bun. Best spot for evening snacks.',
                category: teaCat?._id,
                city: palanpur._id,
                slug: 'janta-tea-post',
                address: 'Station Road, Palanpur',
                phone: '+91 9876543215',
                owner: owner._id,
                isVerified: true,
                images: [categoryImages['Tea Stall (Chai Shop)']],
                coverImage: categoryImages['Tea Stall (Chai Shop)'],
                location: { type: 'Point', coordinates: [72.4360, 24.1760] }
            });

            const bakeryCat = createdCategories.find(c => c.name.includes('Bakery'));
            businesses.push({
                name: 'Modern Bakery',
                description: 'Freshly baked cakes, cookies, and local bakery items since 1995.',
                category: bakeryCat?._id,
                city: palanpur._id,
                slug: 'modern-bakery-palanpur',
                address: 'Vidyamandir Road, Palanpur',
                phone: '+91 9876543216',
                owner: owner._id,
                isVerified: true,
                images: [categoryImages['Bakery Shop']],
                coverImage: categoryImages['Bakery Shop'],
                location: { type: 'Point', coordinates: [72.4320, 24.1710] }
            });

            const pharmacyCat = createdCategories.find(c => c.name.includes('Pharmacy'));
            businesses.push({
                name: 'City Medical Store',
                description: '24-hour pharmacy with wide availability of all general medicines.',
                category: pharmacyCat?._id,
                city: palanpur._id,
                slug: 'city-medical-store',
                address: 'Civil Hospital Road, Palanpur',
                phone: '+91 9876543217',
                owner: owner._id,
                isVerified: true,
                images: [categoryImages['Medical Store / Pharmacy']],
                coverImage: categoryImages['Medical Store / Pharmacy'],
                location: { type: 'Point', coordinates: [72.4370, 24.1770] }
            });

            const dairyCat = createdCategories.find(c => c.name.includes('Dairy'));
            businesses.push({
                name: 'Umiya Dairy Parlour',
                description: 'Fresh milk, curd, paneer, and authentic Amul products.',
                category: dairyCat?._id,
                city: palanpur._id,
                slug: 'umiya-dairy-parlour',
                address: 'Gathaman Gate, Palanpur',
                phone: '+91 9876543218',
                owner: owner._id,
                isVerified: true,
                images: [categoryImages['Dairy / Milk Shop']],
                coverImage: categoryImages['Dairy / Milk Shop'],
                location: { type: 'Point', coordinates: [72.4310, 24.1740] }
            });

            const mobileCat = createdCategories.find(c => c.name.includes('Mobile'));
            businesses.push({
                name: 'Royal Mobile Care',
                description: 'Expert smartphone repairs and latest mobile accessories.',
                category: mobileCat?._id,
                city: palanpur._id,
                slug: 'royal-mobile-care',
                address: 'Suraj Plaza, Ground Floor, Palanpur',
                phone: '+91 9876543219',
                owner: owner._id,
                isVerified: true,
                images: [categoryImages['Mobile Repair Shop']],
                coverImage: categoryImages['Mobile Repair Shop'],
                location: { type: 'Point', coordinates: [72.4305, 24.1705] }
            });

            businesses.push({
                name: 'Bhavani Electricals',
                description: 'Expert electrical repairs and all types of wiring services.',
                category: electricianCat?._id,
                city: palanpur._id,
                slug: 'bhavani-electricals',
                address: 'Market Yard Road, Palanpur',
                phone: '+91 9876543213',
                owner: owner._id,
                isVerified: true,
                images: [categoryImages['Electrician']],
                coverImage: categoryImages['Electrician'],
                location: { type: 'Point', coordinates: [72.4400, 24.1800] }
            });

            const fruitCat = createdCategories.find(c => c.name.includes('Fruit Shop'));
            businesses.push({
                name: 'Aburaj fruits&vegetables',
                description: 'Aburaj Fruits & Vegetables is a trusted local shop offering fresh, high-quality fruits and vegetables daily. The store focuses on providing naturally fresh and hygienic produce sourced from reliable suppliers. Known for its customer-friendly service and affordable pricing, it serves households with a wide variety of seasonal and exotic fruits.',
                category: fruitCat?._id,
                city: palanpur._id,
                slug: 'aburaj-fruits-vegetables',
                address: 'Bank Colony, Palanpur',
                phone: '+91 9876543220',
                owner: owner._id,
                isVerified: true,
                images: ['/uploads/aburaj_fruits.jpg'],
                coverImage: '/uploads/aburaj_fruits.jpg',
                location: { type: 'Point', coordinates: [72.4330, 24.1720] }
            });

            businesses.push({
                name: 'Natraj Fruit Suppliers',
                description: 'Natraj Fruit Suppliers specializes in bulk supply of fresh fruits for retailers, events, and daily customers. The shop ensures consistent quality by sourcing fruits directly from farms and wholesale markets. It is known for reliability, freshness, and fast service.',
                category: fruitCat?._id,
                city: palanpur._id,
                slug: 'natraj-fruit-suppliers',
                address: 'Ambaji Highway, Palanpur',
                phone: '+91 9876543221',
                owner: owner._id,
                isVerified: true,
                images: ['/uploads/natraj_fruits.jpg'],
                coverImage: '/uploads/natraj_fruits.jpg',
                location: { type: 'Point', coordinates: [72.4450, 24.1800] }
            });

            businesses.push({
                name: 'Mahesh Fruit',
                description: 'Mahesh Fruit is a local fruit shop known for providing fresh and seasonal fruits at affordable prices. The shop focuses on maintaining quality and customer satisfaction, making it a convenient choice for daily fruit shopping in the area.',
                category: fruitCat?._id,
                city: palanpur._id,
                slug: 'mahesh-fruit-palanpur',
                address: 'Ambika Society, Palanpur',
                phone: '+91 9876543222',
                owner: owner._id,
                isVerified: true,
                images: ['/uploads/mahesh_fruits.jpg'],
                coverImage: '/uploads/mahesh_fruits.jpg',
                location: { type: 'Point', coordinates: [72.4270, 24.1750] }
            });
        }

        for (const city of createdCities) {
            for (const category of createdCategories) {
                const count = Math.floor(Math.random() * 3) + 2;
                for (let i = 1; i <= count; i++) {
                    businesses.push({
                        name: `${city.name} ${category.name.split('/')[0].trim()} ${i > 1 ? '#' + i : ''}`,
                        description: `Best ${category.name} in ${city.name}. We provide high-quality items and excellent service.`,
                        category: category._id,
                        city: city._id,
                        slug: `${city.name.toLowerCase()}-${category.name.split('/')[0].trim().toLowerCase()}-${city._id.toString().slice(-4)}-${i}`.replace(/\s+/g, '-'),
                        address: `${i * 10}, Main Market area, ${city.name}`,
                        phone: `+91 ${Math.floor(7000000000 + Math.random() * 2000000000)}`,
                        email: `${category.name.split(' ')[0].toLowerCase()}${i}@${city.name.toLowerCase()}.com`,
                        website: `https://www.${category.name.split(' ')[0].toLowerCase()}${city.name.toLowerCase()}.com`,
                        owner: owner._id,
                        isVerified: true,
                        images: categoryImages[category.name] ? [categoryImages[category.name]] : [],
                        coverImage: categoryImages[category.name] || '',
                        location: {
                            type: 'Point',
                            coordinates: [
                                city.lng + (Math.random() - 0.5) * 0.01,
                                city.lat + (Math.random() - 0.5) * 0.01
                            ]
                        }
                    });
                }
            }
        }

        console.log('🏁 Bulk inserting businesses...');
        const savedBusinesses = await Business.insertMany(businesses);

        // Seed Reviews
        console.log('⭐ Generating reviews for all businesses...');
        const reviews = [];
        for (const biz of savedBusinesses) {
            const reviewCount = Math.floor(Math.random() * 5) + 3; // 3-7 reviews per business
            for (let i = 0; i < reviewCount; i++) {
                const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
                reviews.push({
                    user: reviewer._id,
                    business: biz._id,
                    rating: Math.floor(Math.random() * 2) + 4, // Mostly 4-5 stars for "premium" feel
                    comment: fakeReviewComments[Math.floor(Math.random() * fakeReviewComments.length)]
                });
            }
        }

        console.log('📥 Inserting reviews...');
        await Review.insertMany(reviews);

        // Update Business stats manually since insertMany doesn't trigger hooks
        console.log('📊 Updating business reputation stats...');
        for (const biz of savedBusinesses) {
            const bizReviews = reviews.filter(r => r.business.toString() === biz._id.toString());
            const avg = bizReviews.reduce((acc, curr) => acc + curr.rating, 0) / bizReviews.length;
            await Business.findByIdAndUpdate(biz._id, {
                averageRating: avg.toFixed(1),
                reviewCount: bizReviews.length
            });
        }

        console.log('✅ Data Seeding Completed Successfully!');
        console.log(`- Categories: ${createdCategories.length}`);
        console.log(`- Cities: ${createdCities.length}`);
        console.log(`- Businesses: ${savedBusinesses.length}`);
        console.log(`- Reviews: ${reviews.length}`);

        process.exit();
    } catch (error) {
        console.error(`❌ Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
