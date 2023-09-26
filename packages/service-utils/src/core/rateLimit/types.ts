export type RateLimitResult =
  | {
      requestCount: number;
      rateLimited: false;
    }
  | {
      requestCount: number;
      rateLimited: true;
      status: number;
      errorMessage: string;
      errorCode: string;
    };
