import express, { Router } from 'express';
import { auth } from '@/middlewares/auth';
import { OK, UNAUTHORIZED } from '@/constants/http';
import { requireRole } from '@/middlewares/auth';
import { UserRepo } from '@/repos/user.repo';
import { sendprofile } from '@/controller/user.controller';

const userRoute = Router();

userRoute.get('/profile', auth, sendprofile);

// userRoute.get('/admin-only', auth, requireRole('admin'), (req, res) => {
//     return res.status(OK).json({ ok: true });
//   });

export default userRoute;