import express from'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes'
import { errorMiddleware } from './middlewares/error.middleware';
import { env } from '../../config/env';

const app = express();

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', authRoutes)




app.use(errorMiddleware);

export default app;