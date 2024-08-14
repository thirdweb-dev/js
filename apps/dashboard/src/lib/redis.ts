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

export function cacheSet(key: string, value: string, ttlSeconds: number) {
  return getRedis().set(key, value, "EX", ttlSeconds);
}

export function cacheGet(key: string) {
  return getRedis().get(key);
}

export function cacheTtl(key: string) {
  return getRedis().ttl(key);
}

export function cacheDeleteKey(key: string) {
  return getRedis().del(key);
}
