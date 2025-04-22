// Redis interface compatible with ioredis (Node) and upstash (Cloudflare Workers).
export type IRedis = {
  incrby(key: string, value: number): Promise<number>;
  mget(keys: string[]): Promise<(string | null)[]>;
  expire(key: string, seconds: number): Promise<number>;
};

export type CoreRateLimitResult = {
  rateLimited: boolean;
  requestCount: number;
  rateLimit: number;
};
