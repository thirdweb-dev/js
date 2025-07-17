import type {
  CoreServiceConfig,
  ProjectResponse,
  TeamAndProjectResponse,
  TeamResponse,
} from "./core/api.js";

export const validProjectResponse: ProjectResponse = {
  bundleIds: [],
  createdAt: new Date("2024-06-01").toISOString(),
  domains: ["example.com", "*.example.com"],
  id: "1",
  image: "https://example.com/image.png",
  lastAccessedAt: new Date("2024-06-01").toISOString(),
  name: "test-project",
  publishableKey: "your-api-key",
  secretKeys: [
    {
      createdAt: new Date("2024-06-01").toISOString(),
      hash: "1234567890123456789012345678901234567890123456789012345678901234",
      masked: "foo...lorem",
      updatedAt: new Date("2024-06-01").toISOString(),
    },
  ],
  services: [
    {
      actions: ["read", "write"],
      name: "storage",
    },
    {
      actions: [],
      name: "rpc",
    },
    {
      actions: [],
      allowedChainIds: [1, 2, 3],
      name: "bundler",
    },
  ],
  slug: "test-project",
  teamId: "1",
  updatedAt: new Date("2024-06-01").toISOString(),
  walletAddresses: ["creator-address"],
};

export const validTeamResponse: TeamResponse = {
  billingEmail: "test@example.com",
  billingPlan: "free",
  billingStatus: "noPayment",
  canCreatePublicChains: false,
  capabilities: {
    bundler: {
      enabled: true,
      mainnetEnabled: true,
      rateLimit: 1000,
    },
    embeddedWallets: {
      customAuth: true,
      customBranding: true,
      enabled: true,
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
    insight: {
      enabled: true,
      rateLimit: 1000,
      webhooks: true,
    },
    nebula: {
      enabled: true,
      rateLimit: {
        perSecond: 1000,
        perMinute: 1000,
      },
    },
    pay: {
      enabled: true,
      rateLimit: 1000,
    },
    gateway: {
      enabled: true,
      rateLimit: 1000,
    },
    platform: {
      auditLogs: true,
      ecosystemWallets: true,
      seats: true,
    },
    rpc: {
      enabled: true,
      rateLimit: 1000,
    },
    storage: {
      download: {
        rateLimit: 1000,
      },
      enabled: true,
      upload: {
        rateLimit: 1000,
        totalFileSizeBytesLimit: 1_000_000_000,
      },
    },
  },
  createdAt: new Date("2024-06-01").toISOString(),
  dedicatedSupportChannel: null,
  enabledScopes: ["storage", "rpc", "bundler"],
  id: "1",
  image: "https://example.com/image.png",
  isOnboarded: true,
  name: "test-team",
  planCancellationDate: null,
  slug: "test-team",
  supportPlan: "free",
  unthreadCustomerId: null,
  updatedAt: new Date("2024-06-01").toISOString(),
  verifiedDomain: null,
};

export const validTeamAndProjectResponse: TeamAndProjectResponse = {
  authMethod: "publishableKey",
  project: validProjectResponse,
  team: validTeamResponse,
};

export const validServiceConfig: CoreServiceConfig = {
  apiUrl: "https://api.example.com",
  serviceAction: "read",
  serviceApiKey: "service-api-key",
  serviceScope: "storage",
};

export const validBundlerServiceConfig: CoreServiceConfig = {
  apiUrl: "https://api.example.com",
  serviceApiKey: "service-api-key",
  serviceScope: "bundler",
};
