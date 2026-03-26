import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT,
    FRONTEND_URL: process.env.FRONTEND_URL,
    MONGODB: process.env.MONGODB,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    TAVILY_KEY: process.env.TAVILY_KEY,
    PINE_CODE: process.env.PINE_CODE,
}

export default config