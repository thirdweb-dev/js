import type { AccountMetadata, ApiKeyMetadata } from "../api";

export type AuthorizationResult =
  | {
      authorized: true;
      apiKeyMeta: ApiKeyMetadata | null;
      accountMeta: AccountMetadata | null;
    }
  | {
      authorized: false;
      status: number;
      errorMessage: string;
      errorCode: string;
    };
