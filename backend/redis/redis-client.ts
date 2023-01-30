import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1';
const redisPort = parseInt(process.env.REDIS_PORT, 10) || 6379;
const redisPassword = process.env.REDIS_PASSWORD || '';

const redisClient = new Redis({
  host: redisUrl,
  port: redisPort,
  password: redisPassword
});
export { redisClient };
