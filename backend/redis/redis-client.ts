import Redis from 'ioredis';
console.log('export redis client1');
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1';
const redisPort = parseInt(process.env.REDIS_PORT, 10) || 6379;
const redisPassword = process.env.REDIS_PASSWORD || '';

let redisClient;
try{
  redisClient = new Redis({
    host: redisUrl,
    port: redisPort,
    password: redisPassword
  });
  
}catch(e){
  console.log('redis client err', e);
}

console.log('export redis client2');
export { redisClient };