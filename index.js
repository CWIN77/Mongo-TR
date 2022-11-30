const mongoose = require("mongoose");
const redis = require('redis');

const connected = { mongodb: 0, redis: 0 };

const connectDB = async (mongodbURI, redisInfo) => {
  if (connected.mongodb !== 1) {
    try {
      const db = await mongoose.connect(mongodbURI);
      connected.mongodb = db.connections[0].readyState;
      console.log(`MongoDB Connected: ${db.connection.host}`);
    } catch (err) {
      console.error("DB 연결 오류", err);
      connected.mongodb = 0;
      return err;
    }
  }

  if (connected.redis !== 1) {
    const redisClient = redis.createClient({
      url: `redis://${redisInfo.username}:${redisInfo.password}@${redisInfo.host}:${redisInfo.port}/0`,
      legacyMode: true,
    });
    redisClient.on('connect', () => {
      console.info('Redis connected!');
      connected.redis = 1;
    });
    redisClient.on('error', (err) => {
      connected.redis = 0;
      console.error('Redis Client Error', err);
    });
    await redisClient.connect().then();
    const redisCli = redisClient.v4;
  }
}



module.exports = { connectDB }