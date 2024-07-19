import "server-only";
import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "";

const _redis = new Redis(REDIS_URL);

export const cacheSet = async (
  key: string,
  value: string,
  ttlSeconds: number,
) => await _redis.setex(key, ttlSeconds, value);

export const cacheGet = async (key: string) => await _redis.get(key);

export const cacheExists = async (key: string) => await _redis.exists(key);

export const cacheTtl = async (key: string) => await _redis.ttl(key);

export const cacheDeleteKey = async (key: string) => await _redis.del(key);
