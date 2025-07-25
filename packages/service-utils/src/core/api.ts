import type { AuthorizationInput } from "./authorize/index.js";
import { getAuthHeaders } from "./get-auth-headers.js";
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
  /**
   * The number of times to retry the auth request. Default = 3.
   */
  retryCount?: number;
  /**
   * Allow staff members to read data from this service for troubleshooting purposes. Default = false.
   */
  allowImpersonation?: boolean;
};

export type TeamAndProjectResponse = {
  authMethod: "secretKey" | "publishableKey" | "jwt" | "teamId";
  team: TeamResponse;
  project?: ProjectResponse;
  impersonatedBy?: {
    id: string;
    email: string;
    // Omitting the full account details
  };
};

export type ApiResponse = {
  data: TeamAndProjectResponse | null;
  error: {
    code: string;
    statusCode: number;
    message: string;
  };
};

/**
 * Stores service-specific capabilities.
 * This type should match the schema from API server.
 */
type TeamCapabilities = {
  platform: {
    auditLogs: boolean;
    ecosystemWallets: boolean;
    seats: boolean;
  };
  rpc: {
    enabled: boolean;
    rateLimit: number;
  };
  insight: {
    enabled: boolean;
    rateLimit: number;
    webhooks: boolean;
  };
  storage: {
    enabled: boolean;
    download: {
      rateLimit: number;
    };
    upload: {
      totalFileSizeBytesLimit: number;
      rateLimit: number;
    };
  };
  nebula: {
    enabled: boolean;
    rateLimit: {
      perSecond: number;
      perMinute: number;
    };
  };
  bundler: {
    enabled: boolean;
    mainnetEnabled: boolean;
    rateLimit: number;
  };
  embeddedWallets: {
    enabled: boolean;
    customAuth: boolean;
    customBranding: boolean;
    sms: {
      domestic: boolean;
      international: boolean;
    };
  };
  engineCloud: {
    enabled: boolean;
    mainnetEnabled: boolean;
    rateLimit: number;
  };
  pay: {
    enabled: boolean;
    rateLimit: number;
  };
  mcp: {
    enabled: boolean;
    rateLimit: number;
  };
  gateway: {
    enabled: boolean;
    rateLimit: number;
  };
};

type TeamPlan =
  | "free"
  | "starter"
  | "growth_legacy"
  | "growth"
  | "accelerate"
  | "scale"
  | "pro";

export type TeamResponse = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  billingPlan: TeamPlan;
  supportPlan: TeamPlan;
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
  canCreatePublicChains: boolean | null;
  enabledScopes: ServiceName[];
  isOnboarded: boolean;
  capabilities: TeamCapabilities;
  unthreadCustomerId: string | null;
  planCancellationDate: string | null;
  verifiedDomain: string | null;
  dedicatedSupportChannel: {
    type: "slack" | "telegram";
    name: string;
    link: string | null;
  } | null;
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
  | {
      name: "engineCloud";
      actions: never[];
      maskedAdminKey?: string | null;
      managementAccessToken?: string | null;
      rotationCode?: string | null;
      encryptedAdminKey?: string | null;
      encryptedWalletAccessToken?: string | null;
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
  const { apiUrl, serviceApiKey, allowImpersonation } = config;
  const { teamId, clientId } = authData;

  const url = new URL("/v2/keys/use", apiUrl);
  if (clientId) {
    url.searchParams.set("clientId", clientId);
  }
  if (teamId) {
    url.searchParams.set("teamId", teamId);
  }
  if (allowImpersonation) {
    url.searchParams.set("allowImpersonation", "true");
  }

  // compute the appropriate auth headers based on the auth data
  const authHeaders = getAuthHeaders(authData, serviceApiKey);

  const retryCount = config.retryCount ?? 3;
  let error: unknown | undefined;
  for (let i = 0; i < retryCount; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          ...authHeaders,
          "content-type": "application/json",
        },
        method: "GET",
      });

      // TODO: if the response is a well understood status code (401, 402, etc), we should skip retry logic

      let text = "";
      try {
        text = await response.text();
        return JSON.parse(text);
      } catch {
        throw new Error(
          `Error fetching key metadata from API: ${response.status} - ${text}`,
        );
      }
    } catch (err: unknown) {
      error = err;
      if (i < retryCount - 1) {
        // Add a single retry with a delay between 20ms and 400ms.
        await sleepRandomMs(20, 400);
      }
    }
  }
  throw error;
}

/**
 * Sleeps for a random amount of time between min and max, in milliseconds.
 */
function sleepRandomMs(min: number, max: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.random() * (max - min) + min),
  );
}
