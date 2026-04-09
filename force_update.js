import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

async function update() {
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    try {
        await client.connect();
        const db = client.db('business_directory');
        const businesses = db.collection('businesses');

        const mappings = [
            { name: 'Aburaj fruits&vegetables', img: '/uploads/aburaj_fruits.jpg' },
            { name: 'Natraj Fruit Suppliers', img: '/uploads/natraj_fruits.jpg' },
            { name: 'Mahesh Fruit', img: '/uploads/mahesh_fruits.jpg' }
        ];

        for (const map of mappings) {
            const res = await businesses.updateOne(
                { name: map.name },
                { $set: { images: [map.img], coverImage: map.img } }
            );
            console.log(`Update ${map.name}: matched ${res.matchedCount}, modified ${res.modifiedCount}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
        process.exit();
    }
}

update();
