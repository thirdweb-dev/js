import { ApiKeyMetadata } from "../api";

export type AuthorizationResult =
  | {
      authorized: true;
      apiKeyMeta: ApiKeyMetadata | null;
    }
  | {
      authorized: false;
      status: number;
      errorMessage: string;
      errorCode: string;
    };
