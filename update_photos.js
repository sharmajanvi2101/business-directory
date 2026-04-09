import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

import Business from './server/src/models/Business.js';
import City from './server/src/models/City.js';

async function updateFruitPhotos() {
    try {
        const uri = 'mongodb://127.0.0.1:27017/business_directory';
        console.log("Connecting to:", uri);
        await mongoose.connect(uri);
        console.log("CONNECTED");

        const palanpur = await City.findOne({ name: 'Palanpur' });
        if (!palanpur) { console.log("Palanpur not found"); return; }

        const mappings = [
            { name: 'Aburaj fruits&vegetables', img: '/uploads/aburaj_fruits.jpg' },
            { name: 'Natraj Fruit Suppliers', img: '/uploads/natraj_fruits.jpg' },
            { name: 'Mahesh Fruit', img: '/uploads/mahesh_fruits.jpg' }
        ];

        for (const map of mappings) {
            const biz = await Business.findOne({ name: map.name, city: palanpur._id });
            if (biz) {
                biz.images = [map.img];
                biz.coverImage = map.img;
                await biz.save();
                console.log(`UPDATED: ${biz.name} with ${map.img}`);
            } else {
                console.log(`NOT FOUND: ${map.name}`);
            }
        }
    } catch (err) {
        console.error("ERROR:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
        process.exit();
    }
}

updateFruitPhotos();
