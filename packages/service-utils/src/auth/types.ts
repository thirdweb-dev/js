import { KVNamespace, ExecutionContext } from "@cloudflare/workers-types";
import { ServiceName } from "../types";

export interface AuthOptions {
  clientId: string;
  bundleId?: string;
  origin?: string;
}

export interface AuthorizeCFWorkerOptions {
  ctx: ExecutionContext;
  kvStore: KVNamespace<string>;
  authOptions: AuthOptions;
  serviceConfig: ServiceConfiguration;
  validations?: AuthorizationValidations;
}

export interface AuthorizeNodeServiceOptions {
  authOptions: AuthOptions;
  serviceConfig: ServiceConfiguration;
  validations?: AuthorizationValidations;
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
  serviceActions?: string[];
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
  bundleIds: string[];
  services: [
    {
      name: string;
      targetAddresses: string[];
      actions: string[];
    },
  ];
}
