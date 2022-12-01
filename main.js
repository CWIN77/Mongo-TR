const { connectDB, setData } = require("./index");
const dotenv = require('dotenv');
dotenv.config();
const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD, MONGODB_URI } = process.env;

const testGoalSchema = ({
  text: {
    type: String,
    required: [true, "please add a text value"]
  }
},
{
  timestamps: true
});

const redisInfo = { password: REDIS_PASSWORD, username: REDIS_USERNAME, port: REDIS_PORT, host: REDIS_HOST };
const mongoInfo = { uri: MONGODB_URI, schema: testGoalSchema, schemaName: "Goal" };


const start = async () => {
  await connectDB(mongoInfo, redisInfo);
  setData();
}
start();