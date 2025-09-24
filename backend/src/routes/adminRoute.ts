import { Router } from 'express';
import { auth } from '@/middlewares/auth';
import { OK, UNAUTHORIZED } from '@/constants/http';
import { requireRole } from '@/middlewares/auth';
import { UserRepo } from '@/repos/user.repo';
import { createAdmin, createUser, getAlluser, getprofile } from '@/controller/user.controller';

const adminRoute = Router();

// adminRoute.use(auth, requireRole("admin"));

adminRoute.get('/profile', auth, requireRole("admin"), getprofile);

adminRoute.get('/users', auth, requireRole("admin"), getAlluser);

adminRoute.post('/user', auth, requireRole("admin"), createUser);

adminRoute.post('/create',createAdmin);
// adminRoute.delete('/user',);

export default adminRoute;