import type { AuthorizationInput } from "./authorize/index.js";
import type { ServiceName } from "./services.js";

export type UserOpData = {
  sender: string;
  targets: string[];
  gasLimit: string;
  gasPrice: string;
};

export type PolicyResult = {
  policyId: string | null;
  isAllowed: boolean;
  reason: string;
};

export type CoreServiceConfig = {
  apiUrl: string;
  // if EXPLICITLY set to null, service will not be checked for authorization
  // this is meant for services that are not possible to be turned off by users, such as "social" and "analytics"
  serviceScope: ServiceName | null;
  serviceApiKey: string;
  serviceAction?: string;
  useWalletAuth?: boolean;
};

export type TeamAndProjectResponse = {
  authMethod: "secretKey" | "publishableKey" | "jwt" | "teamId";
  team: TeamResponse;
  project?: ProjectResponse | null;
};

export type ApiResponse = {
  data: TeamAndProjectResponse | null;
  error: {
    code: string;
    statusCode: number;
    message: string;
  };
};

export type TeamResponse = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  billingPlan: "free" | "starter" | "growth" | "pro";
  createdAt: Date;
  updatedAt: Date | null;
  billingEmail: string | null;
  billingStatus: "noPayment" | "validPayment" | "invalidPayment" | null;
  growthTrialEligible: boolean | null;
  enabledScopes: ServiceName[];
};

export type ProjectResponse = {
  id: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date | null;
  publishableKey: string;
  name: string;
  slug: string;
  image: string | null;
  domains: string[];
  bundleIds: string[];
  services: (
    | {
        name: "pay";
        actions: never[];
        payoutAddress: string | null;
      }
    | {
        name: "storage";
        actions: ("read" | "write")[];
      }
    | {
        name: "rpc";
        actions: never[];
      }
    | {
        name: "insight";
        actions: never[];
      }
    | {
        name: "nebula";
        actions: never[];
      }
    | {
        name: "bundler";
        actions: never[];
        allowedChainIds?: number[] | null;
        allowedContractAddresses?: string[] | null;
        allowedWallets?: string[] | null;
        blockedWallets?: string[] | null;
        bypassWallets?: string[] | null;
        limits?: {
          global?: {
            maxSpend: string;
            maxSpendUnit: "usd" | "native";
          } | null;
        } | null;
        serverVerifier?: {
          url: string;
          headers?: {
            key: string;
            value: string;
          }[];
        } | null;
      }
    | {
        name: "embeddedWallets";
        actions: never[];
        redirectUrls?: string[] | null;
        applicationName?: string | null;
        applicationImageUrl?: string | null;
        recoveryShareManagement?: string | null;
        customAuthentication?: CustomAuthenticationServiceSchema | null;
        customAuthEndpoint?: CustomAuthEndpointServiceSchema | null;
      }
  )[];
  walletAddresses: string[];
};

type CustomAuthenticationServiceSchema = {
  jwksUri: string;
  aud: string;
};

type CustomAuthEndpointServiceSchema = {
  authEndpoint: string;
  customHeaders: {
    key: string;
    value: string;
  }[];
};

export async function fetchTeamAndProject(
  authData: AuthorizationInput,
  config: CoreServiceConfig,
): Promise<ApiResponse> {
  const { apiUrl, serviceApiKey } = config;

  const clientId = authData.clientId;
  const url = `${apiUrl}/v2/keys/use${clientId ? `?clientId=${clientId}` : ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...(authData.secretKey ? { "x-secret-key": authData.secretKey } : {}),
      ...(authData.jwt ? { Authorization: `Bearer ${authData.jwt}` } : {}),
      "x-service-api-key": serviceApiKey,
      "content-type": "application/json",
    },
  });

  let text = "";
  try {
    text = await response.text();
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Error fetching key metadata from API: ${response.status} - ${text}`,
    );
  }
}

export async function updateRateLimitedAt(
  projectId: string,
  config: CoreServiceConfig,
): Promise<void> {
  const { apiUrl, serviceScope: scope, serviceApiKey } = config;

  const url = `${apiUrl}/usage/rateLimit`;

  await fetch(url, {
    method: "PUT",
    headers: {
      "x-service-api-key": serviceApiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      apiKeyId: projectId, // projectId is the apiKeyId
      scope,
    }),
  });
}
