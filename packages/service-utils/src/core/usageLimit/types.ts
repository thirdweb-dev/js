export type UsageLimitResult =
  | {
      usageLimited: false;
    }
  | {
      usageLimited: true;
      status: number;
      errorMessage: string;
      errorCode: string;
    };
