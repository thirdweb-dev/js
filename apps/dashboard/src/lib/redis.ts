import "server-only";
import { REDIS_URL } from "@/constants/server-envs";
import Redis from "ioredis";

// wrapped in a function to avoid calling this during build
let redis_: Redis;
function getRedis() {
  if (redis_) {
    return redis_;
  }

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
