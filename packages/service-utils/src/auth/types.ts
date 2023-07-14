import type { KVNamespace, ExecutionContext } from "@cloudflare/workers-types";
import type { ServiceName } from "../services";

export interface AuthOptions {
  clientId: string;
  secretHash?: string;
  bundleId?: string;
  origin?: string;
}

export interface AuthorizeCFWorkerOptions {
  ctx: ExecutionContext;
  kvStore: KVNamespace<string>;
  authOptions: AuthOptions;
  serviceConfig: ServiceConfiguration;
  validations: AuthorizationValidations;
}

export interface AuthorizeNodeServiceOptions {
  authOptions: AuthOptions;
  serviceConfig: ServiceConfiguration;
  validations: AuthorizationValidations;
}

export interface ServiceConfiguration {
  apiUrl: string;
  scope: ServiceName;
  serviceKey: string;
  cachedKey?: ApiKey;
  cacheTtl?: number;
  onRefetchComplete?: (key: ApiKey) => void;
}

export interface AuthorizationValidations {
  serviceTargetAddresses?: string[];
  serviceAction?: string;
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
  secretHash: string;
  walletAddresses: string[];
  domains: string[];
  bundleIds: string[];
  services: {
    name: string;
    targetAddresses: string[];
    actions: string[];
  }[];
}
