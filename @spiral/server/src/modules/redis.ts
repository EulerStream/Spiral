import RedisClient, {RedisOptions} from "ioredis";
import {configDotenv} from "dotenv";

configDotenv();

const ConnectOptions: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD
};

export const Redis = new RedisClient(ConnectOptions);
