import express from'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes'
import { createErrorMiddleware } from './middlewares/error.middleware';
import { env } from '../../config/env';
import { container } from '../../../di/inversify.config';
import { ILogger } from '../../../application/interfaces/ILogger';
import { TYPES } from '../../../di/types';


const app = express();

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes)



const logger = container.get<ILogger>(TYPES.ILogger);
app.use(createErrorMiddleware(logger));

export default app;