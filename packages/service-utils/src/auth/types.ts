import { KVNamespace, ExecutionContext } from "@cloudflare/workers-types";
import { IncomingHttpHeaders } from "http";
import { ServiceName } from "../types";

export interface AuthorizeCFWorkerOptions {
  ctx?: ExecutionContext;
  kvStore: KVNamespace<string>;
  headers: Headers;
  clientId: string;
  authOpts: AuthorizationOptions;
  validations?: AuthorizationValidations;
}

export interface AuthorizeNodeServiceOptions {
  clientId: string;
  headers: IncomingHttpHeaders;
  authOpts: AuthorizationOptions;
  validations?: AuthorizationValidations;
}

export interface AuthorizeCFWorkerOptions {
  ctx?: ExecutionContext;
  kvStore: KVNamespace<string>;
  headers: Headers;
  clientId: string;
  authOpts: AuthorizationOptions;
  validations?: AuthorizationValidations;
}

export interface AuthorizationOptions {
  apiUrl: string;
  serviceApiKey: string;
  scope: ServiceName;
  origin?: string;
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
