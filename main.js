const { connectDB } = require("./index");
const dotenv = require('dotenv');
dotenv.config();
const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } = process.env;
const redisInfo = { password: REDIS_PASSWORD, username: REDIS_USERNAME, port: REDIS_PORT, host: REDIS_HOST };

connectDB(process.env.MONGODB_URI, redisInfo);
