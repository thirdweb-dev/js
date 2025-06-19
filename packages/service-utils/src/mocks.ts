import type {
  CoreServiceConfig,
  ProjectResponse,
  TeamAndProjectResponse,
  TeamResponse,
} from "./core/api.js";

export const validProjectResponse: ProjectResponse = {
  id: "1",
  publishableKey: "your-api-key",
  walletAddresses: ["creator-address"],
  domains: ["example.com", "*.example.com"],
  bundleIds: [],
  services: [
    {
      name: "storage",
      actions: ["read", "write"],
    },
    {
      name: "rpc",
      actions: [],
    },
    {
      name: "bundler",
      actions: [],
      allowedChainIds: [1, 2, 3],
    },
  ],
  teamId: "1",
  createdAt: new Date("2024-06-01").toISOString(),
  updatedAt: new Date("2024-06-01").toISOString(),
  lastAccessedAt: new Date("2024-06-01").toISOString(),
  name: "test-project",
  slug: "test-project",
  image: "https://example.com/image.png",
  secretKeys: [
    {
      hash: "1234567890123456789012345678901234567890123456789012345678901234",
      masked: "foo...lorem",
      createdAt: new Date("2024-06-01").toISOString(),
      updatedAt: new Date("2024-06-01").toISOString(),
    },
  ],
};

export const validTeamResponse: TeamResponse = {
  id: "1",
  name: "test-team",
  slug: "test-team",
  image: "https://example.com/image.png",
  createdAt: new Date("2024-06-01").toISOString(),
  updatedAt: new Date("2024-06-01").toISOString(),
  billingPlan: "free",
  supportPlan: "free",
  billingEmail: "test@example.com",
  billingStatus: "noPayment",
  canCreatePublicChains: false,
  enabledScopes: ["storage", "rpc", "bundler"],
  isOnboarded: true,
  verifiedDomain: null,
  capabilities: {
    rpc: {
      enabled: true,
      rateLimit: 1000,
    },
    insight: {
      enabled: true,
      rateLimit: 1000,
      webhooks: true,
    },
    storage: {
      enabled: true,
      download: {
        rateLimit: 1000,
      },
      upload: {
        totalFileSizeBytesLimit: 1_000_000_000,
        rateLimit: 1000,
      },
    },
    nebula: {
      enabled: true,
      rateLimit: 1000,
    },
    bundler: {
      enabled: true,
      mainnetEnabled: true,
      rateLimit: 1000,
    },
    embeddedWallets: {
      enabled: true,
      customAuth: true,
      customBranding: true,
      sms: {
        domestic: true,
        international: true,
      },
    },
    engineCloud: {
      enabled: true,
      mainnetEnabled: true,
      rateLimit: 100,
    },
    pay: {
      enabled: true,
      rateLimit: 1000,
    },
    platform: {
      auditLogs: true,
      ecosystemWallets: true,
      seats: true,
    },
  },
  planCancellationDate: null,
  unthreadCustomerId: null,
  dedicatedSupportChannel: null,
};

export const validTeamAndProjectResponse: TeamAndProjectResponse = {
  team: validTeamResponse,
  project: validProjectResponse,
  authMethod: "publishableKey",
};

export const validServiceConfig: CoreServiceConfig = {
  apiUrl: "https://api.example.com",
  serviceScope: "storage",
  serviceApiKey: "service-api-key",
  serviceAction: "read",
};

export const validBundlerServiceConfig: CoreServiceConfig = {
  apiUrl: "https://api.example.com",
  serviceScope: "bundler",
  serviceApiKey: "service-api-key",
};
