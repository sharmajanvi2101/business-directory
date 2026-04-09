import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

import Business from './server/src/models/Business.js';

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const list = await Business.find({ name: /Aburaj|Natraj|Mahesh/i }).select('name images coverImage');
        fs.writeFileSync('db_status.json', JSON.stringify(list, null, 2));
        console.log("Check complete. See db_status.json");
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

check();
