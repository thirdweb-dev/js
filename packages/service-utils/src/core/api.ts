import type { ServiceName } from "./services";

export type UserOpData = {
  sender: string;
  targets: string[];
  gasLimit: string;
  gasPrice: string;
};

export type PolicyResult = {
  isAllowed: boolean;
  reason: string;
};

export type CoreServiceConfig = {
  enforceAuth?: boolean;
  apiUrl: string;
  serviceScope: ServiceName;
  serviceApiKey: string;
  serviceAction?: string;
  useWalletAuth?: boolean;
  checkPolicy?: boolean;
  policyMetadata?: {
    chainId: number;
    userOp: UserOpData;
  };
};

type Usage = {
  storage?: {
    sumFileSizeBytes: number;
  };
  embeddedWallets?: {
    countWalletAddresses: number;
  };
};

export type ApiKeyMetadata = {
  id: string;
  key: string;
  accountId: string;
  accountStatus: "noCustomer" | "noPayment" | "validPayment" | "invalidPayment";
  accountPlan: "free" | "growth" | "pro" | "enterprise";
  creatorWalletAddress: string;
  secretHash: string;
  walletAddresses: string[];
  domains: string[];
  bundleIds: string[];
  redirectUrls: string[];
  services: {
    name: string;
    targetAddresses: string[];
    actions: string[];
  }[];
  usage?: Usage;
  limits: Partial<Record<ServiceName, number>>;
  rateLimits: Partial<Record<ServiceName, number>>;
  policyResult?: PolicyResult;
};

export type AccountMetadata = {
  id: string;
  name: string;
  creatorWalletAddress: string;
  usage?: Usage;
  limits: Partial<Record<ServiceName, number>>;
  rateLimits: Partial<Record<ServiceName, number>>;
};

export type ApiResponse = {
  data: ApiKeyMetadata | null;
  error: {
    code: string;
    statusCode: number;
    message: string;
  };
};

export type ApiAccountResponse = {
  data: AccountMetadata | null;
  error: {
    code: string;
    statusCode: number;
    message: string;
  };
};

export async function fetchKeyMetadataFromApi(
  clientId: string,
  config: CoreServiceConfig,
): Promise<ApiResponse> {
  const { apiUrl, serviceScope, serviceApiKey, checkPolicy, policyMetadata } =
    config;
  const policyQuery =
    checkPolicy && policyMetadata
      ? `&checkPolicy=true&policyMetadata=${encodeURIComponent(
          JSON.stringify(policyMetadata),
        )}`
      : "";
  const url = `${apiUrl}/v1/keys/use?clientId=${clientId}&scope=${serviceScope}&includeUsage=true${policyQuery}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-service-api-key": serviceApiKey,
      "content-type": "application/json",
    },
  });

  let text = "";
  try {
    text = await response.text();
    return JSON.parse(text);
  } catch (e) {
    throw new Error(
      `Error fetching key metadata from API: ${response.status} - ${text}`,
    );
  }
}

export async function fetchAccountFromApi(
  jwt: string,
  config: CoreServiceConfig,
  useWalletAuth: boolean,
): Promise<ApiAccountResponse> {
  const { apiUrl, serviceApiKey } = config;
  const url = useWalletAuth
    ? `${apiUrl}/v1/wallet/me?includeUsage=true`
    : `${apiUrl}/v1/account/me?includeUsage=true`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-service-api-key": serviceApiKey,
      "content-type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  });

  let text = "";
  try {
    text = await response.text();
    return JSON.parse(text);
  } catch (e) {
    throw new Error(
      `Error fetching account from API: ${response.status} - ${text}`,
    );
  }
}

export async function updateRateLimitedAt(
  apiKeyId: string,
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
      apiKeyId,
      scope,
    }),
  });
}
