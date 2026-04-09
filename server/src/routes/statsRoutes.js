import express from 'express';
import { getPlatformStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/', getPlatformStats);

export default router;
