import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from './lib/passport';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import rbacRouter from './routes/rbac';
import setupRouter from './routes/setup';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/rbac', rbacRouter);
app.use('/api/setup', setupRouter);

export default app;
