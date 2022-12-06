const mongoose = require("mongoose");
const redis = require('redis');

const connected = { mongo: null, redis: null };
const schemas = {};

const connectDB = async (mongoInfo, redisInfo) => {
  if (!connected.mongo) {
    try {
      await mongoose.connect(mongoInfo.uri);
      connected.mongo = mongoose;
      console.info('MongoDB Connected!');
    } catch (err) {
      connected.mongo = null;
      console.error('MongoDB Connect Error : ' + err);
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
      console.error('Redis Connect Error : ' + err);
    });
    await redisClient.connect().then();
    redisClient.v4;
  }

  return connected;
}

const createData = async (addData, dataName, limit = 1000) => {
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

const createSchema = async () => {

}

const updateOne = async (_id, changeData, dataName) => {
  if (connected.mongo && connected.redis) {
    const redisCli = connected.redis.v4;
    const redisData = await JSON.parse(redisCli.get(dataName));
    let isChange = false;
    redisData.forEach((data, key) => {
      if (data[_id] === _id) {
        redisData[key] = changeData;
        isChange = true;
      }
    });
    if (!isChange) {
      await schemas[dataName].updateOne({ _id }, changeData);
    }
  }
}

const updateMany = async (findKey, findValue, changeData, dataName) => {
  if (connected.mongo && connected.redis) {
    const redisCli = connected.redis.v4;
    const redisData = await JSON.parse(redisCli.get(dataName));
    const regex = new RegExp(findValue);
    redisData.forEach((data, key) => {
      if (regex.test(data[findKey])) {
        redisData[key] = changeData;
      }
    });
    await schemas[dataName].updateMany({ findKey: findValue }, changeData);
  }
}

const findMany = async () => {
  if (connected.mongo && connected.redis) {
    const redisCli = connected.redis.v4;
    const redisData = await JSON.parse(redisCli.get(dataName));
    redisData
  }
}

module.exports = { connectDB, createData, updateOne, updateMany }
