import type { ServiceName } from "./services";

export type CoreServiceConfig = {
  enforceAuth: boolean;
  apiUrl: string;
  serviceScope: ServiceName;
  serviceApiKey: string;
  serviceAction?: string;
};

export type ApiKeyMetadata = {
  id: string;
  key: string;
  accountId: string;
  creatorWalletAddress: string;
  secretHash: string;
  walletAddresses: string[];
  domains: string[];
  bundleIds: string[];
  services: {
    name: string;
    targetAddresses: string[];
    actions: string[];
  }[];
};

export type AccountMetadata = {
  id: string;
  name: string;
  creatorWalletAddress: string;
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
  const { apiUrl, serviceScope, serviceApiKey } = config;
  const url = `${apiUrl}/v1/keys/use?clientId=${clientId}&scope=${serviceScope}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-service-api-key": serviceApiKey,
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(
      `Error fetching key metadata from API: ${response.statusText}`,
    );
  }
  return (await response.json()) as ApiResponse;
}

export async function fetchAccountFromApi(
  jwt: string,
  config: CoreServiceConfig,
): Promise<ApiAccountResponse> {
  const { apiUrl, serviceApiKey } = config;
  const url = `${apiUrl}/v1/account/me`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-service-api-key": serviceApiKey,
      "content-type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  });
  let json: ApiAccountResponse
  try {
    json = await response.json();
  } catch (e) {
    throw new Error(`Error fetching account from API: ${response.status} - ${response.statusText} - ${await response.text()}`);
  }
  return json;
}
