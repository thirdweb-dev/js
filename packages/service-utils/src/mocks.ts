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
  createdAt: new Date("2024-06-01"),
  updatedAt: new Date("2024-06-01"),
  name: "test-project",
  slug: "test-project",
  image: "https://example.com/image.png",
};

export const validTeamResponse: TeamResponse = {
  id: "1",
  name: "test-team",
  slug: "test-team",
  image: "https://example.com/image.png",
  createdAt: new Date("2024-06-01"),
  updatedAt: new Date("2024-06-01"),
  billingPlan: "free",
  billingPlanVersion: 1,
  billingEmail: "test@example.com",
  billingStatus: "noPayment",
  growthTrialEligible: false,
  canCreatePublicChains: false,
  enabledScopes: ["storage", "rpc", "bundler"],
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
