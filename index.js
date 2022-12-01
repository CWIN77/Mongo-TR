const mongoose = require("mongoose");
const redis = require('redis');

const connected = { mongo: null, redis: null };

const connectDB = async (mongoInfo, redisInfo) => {
  if (!connected.mongo) {
    try {
      await mongoose.connect(mongoInfo.uri);
      connected.mongo = mongoose;
      console.info('MongoDB Connected!');
    } catch (err) {
      connected.mongo = null;
      console.error('MongoDB Error');
    }
  }

  if (!connected.redis) {
    const redisClient = redis.createClient({
      url: `redis://${redisInfo.username}:${redisInfo.password}@${redisInfo.host}:${redisInfo.port}/0`,
      legacyMode: true,
    });
    redisClient.on('connect', () => {
      connected.redis = redisClient;
      console.info('Redis connected!');
    });
    redisClient.on('error', (err) => {
      connected.redis = null;
      console.error('Redis Client Error');
    });
    await redisClient.connect().then();
    redisClient.v4;
  }
}

const setData = async (data) => {
  if (connected.mongo && connected.redis) {
    const redisCli = connected.redis.v4;
    const redisData = await redisCli.get('data');
    const { data } = JSON.parse(redisData);
    data.push({ text: req.body.text });
    await redisCli.set('data', JSON.stringify({ data }));
  } else console.error("connectDB");
}


module.exports = { connectDB, setData }