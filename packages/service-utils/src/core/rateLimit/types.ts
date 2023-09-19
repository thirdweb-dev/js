export type RateLimitResult =
  | {
      rateLimited: false;
    }
  | {
      rateLimited: true;
      status: number;
      errorMessage: string;
      errorCode: string;
    };
