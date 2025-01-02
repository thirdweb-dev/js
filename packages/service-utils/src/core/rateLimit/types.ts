export type RateLimitResult =
  | {
      rateLimited: false;
      requestCount: number;
      rateLimit: number;
    }
  | {
      rateLimited: true;
      requestCount: number;
      rateLimit: number;
      status: number;
      errorMessage: string;
      errorCode: string;
    };
