import express from 'express'
import { signUp } from '../controller/authcontroller.ts';
import logger from '../middleware/auth.ts';

const router = express.Router();

router.post("/signup", logger, signUp);

export default router
