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
      console.error('MongoDB Error : ' + err);
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
      console.error('Redis Error : ' + err);
    });
    await redisClient.connect().then();
    redisClient.v4;
  }

  return connected;
}

const createData = async (addData, dataName, limit) => {
  if (connected.mongo && connected.redis) {
    const redisCli = connected.redis.v4;
    const redisData = await redisCli.get(dataName);
    const { data } = JSON.parse(redisData);
    if (data) {
      data.push(addData);
      if (data.length >= limit) {
        await schemas[dataName].create(addData);
      } else await redisCli.set(dataName, JSON.stringify({ data }));
    } else console.error("Schema has not been created.");
  } else console.error("Please Connect database.");
}


module.exports = { connectDB, createData }
