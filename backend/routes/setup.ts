import express from 'express';
import { validateSeed, seed } from '../controllers/setupController';
const router = express.Router();

router.post('/seed', validateSeed, seed);

export default router;
