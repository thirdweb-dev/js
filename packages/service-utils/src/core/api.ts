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
  supportPlan: "free" | "starter" | "growth" | "pro";
  billingPlanVersion: number;
  createdAt: string;
  updatedAt: string | null;
  billingEmail: string | null;
  // noPayment = no payment method on file for customer => expected state for new customers without an active subscription
  // validPayment = payment method on file and valid => good state
  // invalidPayment = payment method not valid (billing failing repeatedly) => error state
  // pastDue = payment method on file but has past due payments => warning state
  billingStatus:
    | "noPayment"
    | "validPayment"
    | "invalidPayment"
    | "pastDue"
    | null;
  growthTrialEligible: false;
  canCreatePublicChains: boolean | null;
  enabledScopes: ServiceName[];
  isOnboarded: boolean;
};

export type ProjectSecretKey = {
  hash: string;
  masked: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectBundlerService = {
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
    headers?: Array<{
      key: string;
      value: string;
    }>;
  } | null;
};

export type ProjectEmbeddedWalletsService = {
  name: "embeddedWallets";
  actions: never[];
  redirectUrls?: string[] | null;
  applicationName?: string | null;
  applicationImageUrl?: string | null;
  recoveryShareManagement?: string | null;
  customAuthentication?: CustomAuthenticationServiceSchema | null;
  customAuthEndpoint?: CustomAuthEndpointServiceSchema | null;
  // list of 2-letter country ISOs that are enabled for SMS for this project
  smsEnabledCountryISOs?: string[] | null;
};

export type ProjectService =
  | {
      name: "pay";
      actions: never[];
      payoutAddress: string | null;
      developerFeeBPS?: number | null;
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
  | ProjectBundlerService
  | ProjectEmbeddedWalletsService;

export type ProjectResponse = {
  id: string;
  teamId: string;
  createdAt: string;
  updatedAt: string | null;
  lastAccessedAt: string | null;
  publishableKey: string;
  name: string;
  slug: string;
  image: string | null;
  domains: string[];
  bundleIds: string[];
  services: ProjectService[];
  walletAddresses: string[];
  secretKeys: ProjectSecretKey[];
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
  const { teamId, clientId } = authData;

  const url = new URL("/v2/keys/use", apiUrl);
  if (clientId) {
    url.searchParams.set("clientId", clientId);
  }
  if (teamId) {
    url.searchParams.set("teamId", teamId);
  }
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
