import { ApiKeyMetadata, CoreServiceConfig } from "./core/api";

export const validApiKeyMeta: ApiKeyMetadata = {
  id: "1",
  key: "your-api-key",
  creatorWalletAddress: "creator-address",
  secretHash: "secret-hash",
  walletAddresses: [],
  domains: ["example.com", "*.example.com"],
  bundleIds: [],
  accountId: "test-account-id",
  accountStatus: "noCustomer",
  accountPlan: "free",
  services: [
    {
      name: "storage",
      targetAddresses: ["target1", "target2"],
      actions: ["action1", "action2"],
    },
    {
      name: "service2",
      targetAddresses: ["target3"],
      actions: ["action3"],
    },
    {
      name: "bundler",
      targetAddresses: ["*"],
      actions: ["action3"],
    },
  ],
  limits: {
    storage: 100,
  },
  rateLimits: {
    rpc: 25,
  },
};

export const validServiceConfig: CoreServiceConfig = {
  apiUrl: "https://api.example.com",
  serviceScope: "storage",
  serviceApiKey: "service-api-key",
  serviceAction: "action1",
  enforceAuth: true,
};

export const validBundlerServiceConfig: CoreServiceConfig = {
  apiUrl: "https://api.example.com",
  serviceScope: "bundler",
  serviceApiKey: "service-api-key",
  enforceAuth: true,
};
