import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Category from '../models/Category.js';
import City from '../models/City.js';
import Business from '../models/Business.js';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding...');

        // 1. Clear existing data (Optional - handle with care)
        // await User.deleteMany();
        // await Category.deleteMany();
        // await City.deleteMany();
        // await Business.deleteMany();

        // 2. Create Dummy Owner
        let owner = await User.findOne({ email: 'owner@example.com' });
        if (!owner) {
            owner = await User.create({
                name: 'Gujarat Business Owner',
                email: 'owner@example.com',
                password: 'password123',
                phone: '9876543210',
                role: 'owner',
                isVerified: true
            });
        }

        // 3. Create Categories
        const categories = [
            { name: 'Restaurants', icon: 'Utensils' },
            { name: 'Retail', icon: 'ShoppingBag' },
            { name: 'Electrician', icon: 'Zap' },
            { name: 'Plumber', icon: 'Droplets' },
            { name: 'Doctor', icon: 'Stethoscope' },
            { name: 'Gym', icon: 'Dumbbell' }
        ];

        const createdCategories = [];
        for (const cat of categories) {
            let existing = await Category.findOne({ name: cat.name });
            if (!existing) {
                existing = await Category.create(cat);
            }
            createdCategories.push(existing);
        }

        // 4. Create Cities in Gujarat
        const citiesList = [
            { name: 'Ahmedabad', state: 'Gujarat' },
            { name: 'Palanpur', state: 'Gujarat' }
        ];

        const createdCities = [];
        for (const city of citiesList) {
            let existing = await City.findOne({ name: city.name });
            if (!existing) {
                existing = await City.create(city);
            }
            createdCities.push(existing);
        }

        // 5. Create Businesses
        const businesses = [
            {
                name: 'Ahmedabad Spice Villa',
                description: 'Authentic Gujarati and Punjabi fine dining.',
                category: createdCategories[0]._id, // Restaurants
                city: createdCities[0]._id,
                address: 'S.G. Highway, Ahmedabad',
                location: { type: 'Point', coordinates: [72.5020, 23.0150] },
                phone: '0791002003',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.7
            },
            {
                name: 'Local Chai Point',
                description: 'Famous cutting chai and local snacks for daily commuters.',
                category: createdCategories[0]._id, // Restaurants
                city: createdCities[0]._id,
                address: 'C.G. Road, Ahmedabad',
                location: { type: 'Point', coordinates: [72.5590, 23.0250] },
                phone: '0795566778',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.5
            },
            {
                name: 'The Fashion Square',
                description: 'Modern clothing and accessories retail store.',
                category: createdCategories[1]._id, // Retail
                city: createdCities[0]._id,
                address: 'Prahlad Nagar, Ahmedabad',
                location: { type: 'Point', coordinates: [72.5070, 23.0120] },
                phone: '0794455667',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.3
            },
            {
                name: 'Corner Grocery Store',
                description: 'Your neighborhood daily essentials and fresh vegetables.',
                category: createdCategories[1]._id, // Retail
                city: createdCities[3]._id,
                address: 'University Road, Rajkot',
                location: { type: 'Point', coordinates: [70.7748, 22.2913] },
                phone: '0281990011',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.0
            },
            {
                name: 'Sparkly Electrical Solutions',
                description: 'Expert residential and commercial electrical services.',
                category: createdCategories[2]._id, // Electrician
                city: createdCities[1]._id,
                address: 'Adajan, Surat',
                location: { type: 'Point', coordinates: [72.7989, 21.1963] },
                phone: '0261334455',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.9
            },
            {
                name: 'Quick Fix Electric',
                description: 'Fast and reliable local electrician for home repairs.',
                category: createdCategories[2]._id, // Electrician
                city: createdCities[2]._id,
                address: 'Alkapuri, Vadodara',
                location: { type: 'Point', coordinates: [73.1700, 22.3100] },
                phone: '0265445566',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.6
            },
            {
                name: 'Surat Water Fixers',
                description: 'Reliable plumbing services for all your leakage needs.',
                category: createdCategories[3]._id, // Plumber
                city: createdCities[1]._id,
                address: 'Vesu, Surat',
                location: { type: 'Point', coordinates: [72.7758, 21.1415] },
                phone: '0261778899',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.5
            },
            {
                name: '24/7 Plumber Rajkot',
                description: 'Emergency plumbing services available day and night.',
                category: createdCategories[3]._id, // Plumber
                city: createdCities[3]._id,
                address: 'Gondal Road, Rajkot',
                location: { type: 'Point', coordinates: [70.7900, 22.2700] },
                phone: '0281556677',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.2
            },
            {
                name: 'City Care Multispeciality',
                description: 'Experienced doctors and modern medical care.',
                category: createdCategories[4]._id, // Doctor
                city: createdCities[2]._id,
                address: 'Sayajigunj, Vadodara',
                location: { type: 'Point', coordinates: [73.1868, 22.3113] },
                phone: '0265667788',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.8
            },
            {
                name: 'Family Clinic',
                description: 'Primary healthcare and pediatrician services.',
                category: createdCategories[4]._id, // Doctor
                city: createdCities[0]._id,
                address: 'Bodakdev, Ahmedabad',
                location: { type: 'Point', coordinates: [72.5100, 23.0400] },
                phone: '0798899001',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.7
            },
            {
                name: 'Iron Muscle Fitness',
                description: 'Best-in-class gym equipment and personal trainers.',
                category: createdCategories[5]._id, // Gym
                city: createdCities[3]._id,
                address: 'Kalavad Road, Rajkot',
                location: { type: 'Point', coordinates: [70.7694, 22.2858] },
                phone: '0281223344',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.6
            },
            {
                name: 'Fit Life Studio',
                description: 'Yoga, Zumba and Cardio specialty fitness center.',
                category: createdCategories[5]._id, // Gym
                city: createdCities[1]._id,
                address: 'Piplod, Surat',
                location: { type: 'Point', coordinates: [72.7600, 21.1500] },
                phone: '0261445500',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.4
            },


            {
                name: 'Palanpur Rasoi',
                description: 'A beloved family-run restaurant serving authentic Gujarati thali, dal baati churma, and local Banaskantha specialties since 1998. Known for their homemade pickles and fresh buttermilk.',
                category: createdCategories[0]._id, // Restaurants
                city: createdCities[4]._id,
                address: 'Station Road, Near Palanpur Railway Station, Palanpur',
                location: { type: 'Point', coordinates: [72.4321, 24.1716] },
                phone: '02742220011',
                email: 'palanpurrasoi@gmail.com',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.8
            },
            {
                name: 'Banaskantha Dhaba',
                description: 'Highway dhaba famous for hot puris, sabzi, and tandoori roti. A favorite stop for truckers and travelers on National Highway 68. Open 24 hours on weekends.',
                category: createdCategories[0]._id, // Restaurants
                city: createdCities[4]._id,
                address: 'NH-68, Ambaji Road, Palanpur',
                location: { type: 'Point', coordinates: [72.4450, 24.1800] },
                phone: '02742230045',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.4
            },
            {
                name: 'Shree Ganesh Sweet House',
                description: "Palanpur's most loved mithai shop, famous for pure ghee mohanthal, kaju katli, and special namkeen gifting boxes. Serving the community for over 30 years.",
                category: createdCategories[0]._id, // Restaurants
                city: createdCities[4]._id,
                address: 'Nana Bazaar, Palanpur',
                location: { type: 'Point', coordinates: [72.4280, 24.1750] },
                phone: '02742215566',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.9
            },
            {
                name: 'Diamond Fashion Mall',
                description: "Palanpur's premier retail destination for ethnic wear, western clothing, and accessories. Official stockist of branded sarees, kurtas, and party wear for all occasions.",
                category: createdCategories[1]._id, // Retail
                city: createdCities[4]._id,
                address: 'Raj Mahal Road, Palanpur',
                location: { type: 'Point', coordinates: [72.4350, 24.1680] },
                phone: '02742244001',
                email: 'diamondfashion@gmail.com',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.5
            },
            {
                name: 'Kiran Electronics & Mobile',
                description: 'Authorized service center and retail outlet for Samsung, MI, and Realme phones. Also stocks home appliances, data cables, earphones, and smart TV accessories.',
                category: createdCategories[1]._id, // Retail
                city: createdCities[4]._id,
                address: 'College Road, Palanpur',
                location: { type: 'Point', coordinates: [72.4360, 24.1660] },
                phone: '02742255002',
                email: 'kiranelectronics.plp@gmail.com',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.3
            },
            {
                name: 'Bhavani Electrical Works',
                description: 'Licensed electrical contractor providing wiring, MCB panel installation, CCTV wiring, inverter setup, and industrial electrical maintenance across Palanpur and Disa.',
                category: createdCategories[2]._id, // Electrician
                city: createdCities[4]._id,
                address: 'GIDC Area, Palanpur',
                location: { type: 'Point', coordinates: [72.4400, 24.1730] },
                phone: '9825001122',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.7
            },
            {
                name: 'Sai Power Solutions',
                description: 'Solar panel installation, power backup systems, and complete home electrical solutions. Trusted by 200+ homes in Banaskantha district for energy-efficient wiring.',
                category: createdCategories[2]._id, // Electrician
                city: createdCities[4]._id,
                address: 'Near Bus Stand, Palanpur',
                location: { type: 'Point', coordinates: [72.4310, 24.1700] },
                phone: '9898776655',
                website: 'https://saipowergujarat.com',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.6
            },
            {
                name: 'Jal Sewa Plumbing Services',
                description: 'Professional plumbing and drainage specialists for residential and commercial properties in Palanpur. Specializes in bathroom fittings, pipe repairs, water tank cleaning, and motor pump installation.',
                category: createdCategories[3]._id, // Plumber
                city: createdCities[4]._id,
                address: 'Shankar Nagar, Palanpur',
                location: { type: 'Point', coordinates: [72.4290, 24.1740] },
                phone: '9726333445',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.5
            },
            {
                name: 'Quick Plumb Fix',
                description: 'Same-day emergency plumber service in Palanpur. Available 24/7 for burst pipes, toilet blockages, and drainage problems. Affordable rates with genuine spare parts.',
                category: createdCategories[3]._id, // Plumber
                city: createdCities[4]._id,
                address: 'Hira Baug Society, Palanpur',
                location: { type: 'Point', coordinates: [72.4470, 24.1680] },
                phone: '9624112233',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.2
            },
            {
                name: 'Arogya Hospital & Clinic',
                description: 'Multispeciality hospital with departments for general medicine, orthopaedics, gynaecology, and paediatrics. Home to 10+ experienced doctors and a state-of-the-art diagnostic lab.',
                category: createdCategories[4]._id, // Doctor
                city: createdCities[4]._id,
                address: 'Ambaji Highway, Near Palanpur Checkpost',
                location: { type: 'Point', coordinates: [72.4250, 24.1770] },
                phone: '02742260077',
                email: 'arogyahospital.plp@gmail.com',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.8
            },
            {
                name: "Medipolic",
                description: 'Dr. Ramesh Prajapati is a trusted and experienced healthcare professional dedicated to providing high-quality medical care to patients of all ages. With expertise in diagnosing and treating a wide range of health conditions, the clinic focuses on patient-centered care, ensuring comfort, safety, and personalized treatment. The clinic offers services such as general consultation, diagnosis, preventive care, and basic treatments. Equipped with modern medical facilities and a clean, hygienic environment, Dr. Ramesh Prajapati aims to deliver reliable and effective healthcare solutions. Conveniently located in Palanpur, the clinic is committed to serving the local community with compassion, professionalism, and timely medical support.',
                category: createdCategories[4]._id, // Doctor
                city: createdCities[4]._id,
                address: 'Raj Mahal Chowk, Palanpur',
                location: { type: 'Point', coordinates: [72.4330, 24.1710] },
                phone: '02742271188',
                email: 'medipoilc@gmail.com',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.9
            },
            {
                name: 'PowerZone Fitness Club',
                description: "Palanpur's most equipped fitness center with 5000 sq ft floor, air-conditioned weight room, cardio zone, steam room, and certified personal trainers. Monthly and annual memberships available.",
                category: createdCategories[5]._id, // Gym
                city: createdCities[4]._id,
                address: 'Tipu Sultan Chowk, Palanpur',
                location: { type: 'Point', coordinates: [72.4380, 24.1720] },
                phone: '9558844221',
                email: 'powerzone.plp@gmail.com',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.7
            },
            {
                name: 'Fit India Yoga & Gym',
                description: 'A holistic wellness centre offering morning yoga sessions, zumba classes, and full gym access. Special packages for women and senior citizens. Government-certified yoga trainer.',
                category: createdCategories[5]._id, // Gym
                city: createdCities[4]._id,
                address: 'Sardar Patel Colony, Palanpur',
                location: { type: 'Point', coordinates: [72.4270, 24.1760] },
                phone: '9429112344',
                owner: owner._id,
                isVerified: true,
                averageRating: 4.5
            },
            {
                name: 'Aburaj fruits&vegetables',
                description: 'Aburaj Fruits & Vegetables is a trusted local shop offering fresh, high-quality fruits and vegetables daily. The store focuses on providing naturally fresh and hygienic produce sourced from reliable suppliers. Known for its customer-friendly service and affordable pricing, it serves households with a wide variety of seasonal and exotic fruits.',
                category: createdCategories[1]._id, // Fruit Shop (Checking index in utils/seeder below)
                city: createdCities[4]._id,
                address: 'Bank Colony, Palanpur',
                location: { type: 'Point', coordinates: [72.4330, 24.1720] },
                phone: '9876543220',
                owner: owner._id,
                isVerified: true,
                images: ['/uploads/aburaj_fruits.jpg'],
                coverImage: '/uploads/aburaj_fruits.jpg',
                averageRating: 5.0
            },
            {
                name: 'Natraj Fruit Suppliers',
                description: 'Natraj Fruit Suppliers specializes in bulk supply of fresh fruits for retailers, events, and daily customers. The shop ensures consistent quality by sourcing fruits directly from farms and wholesale markets. It is known for reliability, freshness, and fast service.',
                category: createdCategories[1]._id,
                city: createdCities[4]._id,
                address: 'Ambaji Highway, Palanpur',
                location: { type: 'Point', coordinates: [72.4450, 24.1800] },
                phone: '9876543221',
                owner: owner._id,
                isVerified: true,
                images: ['/uploads/natraj_fruits.jpg'],
                coverImage: '/uploads/natraj_fruits.jpg',
                averageRating: 4.5
            },
            {
                name: 'Mahesh Fruit',
                description: 'Mahesh Fruit is a local fruit shop known for providing fresh and seasonal fruits at affordable prices. The shop focuses on maintaining quality and customer satisfaction, making it a convenient choice for daily fruit shopping in the area.',
                category: createdCategories[1]._id,
                city: createdCities[4]._id,
                address: 'Ambika Society, Palanpur',
                location: { type: 'Point', coordinates: [72.4270, 24.1750] },
                phone: '9876543222',
                owner: owner._id,
                isVerified: true,
                images: ['/uploads/mahesh_fruits.jpg'],
                coverImage: '/uploads/mahesh_fruits.jpg',
                averageRating: 4.0
            }
        ];

        for (const biz of businesses) {
            let existing = await Business.findOne({ name: biz.name });
            if (!existing) {
                await Business.create(biz);
                console.log(`Created: ${biz.name}`);
            }
        }

        console.log('Seeding Completed Successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
