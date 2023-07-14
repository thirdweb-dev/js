import { ApiKeyMetadata } from "../api";

export type AuthorizationResult =
  | {
      authorized: true;
      apiKeyMeta: ApiKeyMetadata;
    }
  | {
      authorized: false;
      status: number;
      errorMessage: string;
      errorCode: string;
    };
