export const accountKeys = {
  all: ["account"] as const,
  wallet: (walletAddress: string) =>
    [...accountKeys.all, walletAddress] as const,
  me: (walletAddress: string) =>
    [...accountKeys.wallet(walletAddress), "me"] as const,
  usage: (walletAddress: string) =>
    [...accountKeys.wallet(walletAddress), "usage"] as const,
  walletStats: (
    walletAddress: string,
    clientId: string,
    from: string,
    to: string,
    period: string,
  ) =>
    [
      ...accountKeys.wallet(walletAddress),
      "wallets",
      clientId,
      from,
      to,
      period,
    ] as const,
  userOpStats: (
    walletAddress: string,
    clientId: string,
    from: string,
    to: string,
    period: string,
  ) =>
    [
      ...accountKeys.wallet(walletAddress),
      "userOps",
      clientId,
      from,
      to,
      period,
    ] as const,
  credits: (walletAddress: string) =>
    [...accountKeys.wallet(walletAddress), "credits"] as const,
  billingSession: (walletAddress: string) =>
    [...accountKeys.wallet(walletAddress), "billing-session"] as const,
};

export const apiKeys = {
  all: ["api"] as const,
  wallet: (walletAddress: string) => [...apiKeys.all, walletAddress] as const,
  keys: (walletAddress: string) =>
    [...apiKeys.wallet(walletAddress), "keys"] as const,
  key: (id: string, walletAddress: string) =>
    [...apiKeys.keys(walletAddress), id] as const,
};

export const authorizedWallets = {
  all: ["authorizedWallets"] as const,
  wallet: (walletAddress: string) =>
    [...authorizedWallets.all, walletAddress] as const,
  authorizedWallets: (walletAddress: string) =>
    [...authorizedWallets.wallet(walletAddress), "authorizedWallets"] as const,
};

export const embeddedWalletsKeys = {
  all: ["embeddedWallets"] as const,
  wallet: (walletAddress: string) =>
    [...embeddedWalletsKeys.all, walletAddress] as const,
  embeddedWallets: (
    walletAddress: string,
    clientId: string | undefined,
    page: number,
  ) => [...embeddedWalletsKeys.wallet(walletAddress), clientId, page] as const,
};

export const engineKeys = {
  all: ["engine"] as const,
  instances: (address: string) =>
    [...engineKeys.all, address, "instances"] as const,
  backendWallets: (instance: string) =>
    [...engineKeys.all, instance, "backendWallets"] as const,
  transactions: (instance: string, params: object) =>
    [...engineKeys.all, instance, "transactions", params] as const,
  permissions: (instance: string) =>
    [...engineKeys.all, instance, "permissions"] as const,
  accessTokens: (instance: string) =>
    [...engineKeys.all, instance, "accessTokens"] as const,
  keypairs: (instance: string) =>
    [...engineKeys.all, instance, "keypairs"] as const,
  relayers: (instance: string) =>
    [...engineKeys.all, instance, "relayers"] as const,
  webhooks: (instance: string) =>
    [...engineKeys.all, instance, "webhooks"] as const,
  webhookEventTypes: (instance: string) =>
    [...engineKeys.all, instance, "webhookEventTypes"] as const,
  walletConfig: (instance: string) =>
    [...engineKeys.all, instance, "walletConfig"] as const,
  backendWallet: (address: string, chainId: number) =>
    ["backendWallet", address, chainId] as const,
  backendWalletBalance: (address: string, chainId: number) =>
    [...engineKeys.backendWallet(address, chainId), "balance"] as const,
  corsUrls: (instance: string) =>
    [...engineKeys.all, instance, "corsUrls"] as const,
  ipAllowlist: (instance: string) =>
    [...engineKeys.all, instance, "ipAllowlist"] as const,
  contractSubscriptions: (instance: string) =>
    [...engineKeys.all, instance, "contractSubscriptions"] as const,
  contractSubscriptionsLastBlock: (instance: string, chainId: number) =>
    [
      ...engineKeys.all,
      instance,
      "contractSubscriptionsLastBlock",
      chainId,
    ] as const,
  health: (instance: string) =>
    [...engineKeys.all, instance, "health"] as const,
  deploymentPublicConfiguration: () =>
    [...engineKeys.all, "deploymentPublicConfiguration"] as const,
  systemMetrics: (engineId: string) =>
    [...engineKeys.all, engineId, "systemMetrics"] as const,
  queueMetrics: (engineId: string) =>
    [...engineKeys.all, engineId, "queueMetrics"] as const,

  alertRules: (engineId: string) =>
    [...engineKeys.all, engineId, "alertRules"] as const,
  alerts: (engineId: string) =>
    [...engineKeys.all, engineId, "alerts"] as const,
  notificationChannels: (engineId: string) =>
    [...engineKeys.all, engineId, "notificationChannels"] as const,
};
