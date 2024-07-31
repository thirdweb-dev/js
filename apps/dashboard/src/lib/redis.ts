import "server-only";
import Redis from "ioredis";

// wrapped in a function to avoid calling this during build
let redis_: Redis;
function getRedis() {
  if (redis_) {
    return redis_;
  }
  const REDIS_URL = process.env.REDIS_URL || "";

  redis_ = new Redis(REDIS_URL);
  return redis_;
}

export async function cacheSet(key: string, value: string, ttlSeconds: number) {
  return await getRedis().setex(key, ttlSeconds, value);
}

export async function cacheGet(key: string) {
  return await getRedis().get(key);
}

export async function cacheExists(key: string) {
  return await getRedis().exists(key);
}

export async function cacheTtl(key: string) {
  return await getRedis().ttl(key);
}

export async function cacheDeleteKey(key: string) {
  return await getRedis().del(key);
}
