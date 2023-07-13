import { ServiceName } from "../types";

export interface AuthorizationOptions {
  apiUrl: string;
  serviceAPIKey: string;
  scope: ServiceName;
  origin?: string;
  cachedKey?: ApiKey;
  cacheTtl?: number;
  onRefetchComplete?: (key: ApiKey) => void;
}

export interface AuthorizationValidations {
  serviceTargetAddresses?: string[];
  serviceActions?: string[];
  domains: string[];
  bundleIds: string[];
}

export interface AuthorizationResponse {
  authorized: boolean;
  errorMessage?: string;
  errorCode?: string;
  statusCode?: number;
  data?: ApiKey;
}

export interface ApiResponse {
  data: ApiKey | null;
  error: {
    code: string;
    statusCode: number;
    message: string;
  };
}

export interface ApiKey {
  id: string;
  key: string;
  walletAddresses: string[];
  domains: string[];
  services?: [
    {
      name: string;
      targetAddresses: string[];
      actions: string[];
    },
  ];
}
