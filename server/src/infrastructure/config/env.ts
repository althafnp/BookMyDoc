import dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT: process.env.PORT!,
    MONGO_URI: process.env.MONGO_URI!,
    JWT_AUTH_ACCESS_SECRET: process.env.JWT_AUTH_ACCESS_SECRET!,
    JWT_AUTH_REFRESH_SECRET: process.env.JWT_AUTH_REFRESH_SECRET!,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    JWT_EMAIL_SECRET: process.env.JWT_EMAIL_SECRET!,
    JWT_PASSWORD_SECRET: process.env.JWT_PASSWORD_SECRET!,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    AWS_REGION: process.env.AWS_REGION!,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME!,
    EMAIL_USER: process.env.EMAIL_USER!,
    EMAIL_PASS: process.env.EMAIL_PASS!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    NODE_ENV: process.env.NODE_ENV,
    MAX_AGE: Number(process.env.MAX_AGE || 7) * 24 * 60 * 60 * 1000
};