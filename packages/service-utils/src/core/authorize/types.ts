import type { TeamAndProjectResponse } from "../api.js";

export type AuthorizationResult =
  | ({
      authorized: true;
    } & TeamAndProjectResponse)
  | {
      authorized: false;
      status: number;
      errorMessage: string;
      errorCode: string;
    };
