import express from 'express';
import type { Request, Response } from 'express';
import 'tsconfig-paths/register'; 
import cors from 'cors';
// import { env } from './config/env';
import authRoute from '@/routes/authRoutes';
import { OK } from "@/constants/http";
import userRoute from '@/routes/userRoutes';
import { loggingMiddleware } from '@/middlewares/logging';
import { errorHandler } from '@/middlewares/errorHandler';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import adminRoute from '@/routes/adminRoute';
import dotenv from "dotenv";
import passport from '@/config/passport';

dotenv.config();
  
const allowsOrigins:string[] = ["http://localhost:3000", process.env.FRONT_END_URL as string]

const app = express();

app.use(passport.initialize());
app.use(loggingMiddleware);
allowsOrigins.forEach(e => console.log(e)
);
app.use(helmet());

app.use(cors({
    origin:allowsOrigins,
    credentials:true
}));

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res: Response) => {
    return res.status(OK).json({
        status: "healthy"
    })
});

app.use('/auth', authRoute);

app.use('/user', userRoute);

app.use('/admin', adminRoute);

app.use(errorHandler);

const PORT: number = Number(process.env.API_PORT) || 5000; // Changed to match Docker port mapping

app.listen(PORT, async() => {
    console.log(`Server running on port ${PORT}`);
    console.log(`DB is at ${process.env.DATABASE_URL}`);
    
});
