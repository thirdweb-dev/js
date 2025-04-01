type DomainOverrides = {
  /**
   * The base URL for the RPC server.
   * @default "rpc.thirdweb.com"
   */
  rpc?: string;
  /**
   * The base URL for the social service.
   * @default "social.thirdweb.com"
   */
  social?: string;
  /**
   * The base URL for the in-app wallet service
   * @default "embedded-wallet.thirdweb.com"
   */
  inAppWallet?: string;
  /**
   * The base URL for the payment server.
   * @default "pay.thirdweb.com"
   */
  pay?: string;
  /**
   * The base URL for the storage server.
   * @default "storage.thirdweb.com"
   */
  storage?: string;
  /**
   * The base URL for the bundler server.
   * @default "bundler.thirdweb.com"
   */
  bundler?: string;
  /**
   * The base URL for the analytics server.
   * @default "c.thirdweb.com"
   */
  analytics?: string;
  /**
   * The base URL for the insight server.
   * @default "insight.thirdweb.com"
   */
  insight?: string;
};

export const DEFAULT_RPC_URL = "rpc.thirdweb.com";
const DEFAULT_SOCIAL_URL = "social.thirdweb.com";
const DEFAULT_IN_APP_WALLET_URL = "embedded-wallet.thirdweb.com";
const DEFAULT_PAY_URL = "pay.thirdweb.com";
const DEFAULT_STORAGE_URL = "storage.thirdweb.com";
const DEFAULT_BUNDLER_URL = "bundler.thirdweb.com";
const DEFAULT_ANALYTICS_URL = "c.thirdweb.com";
const DEFAULT_INSIGHT_URL = "insight.thirdweb.com";
let domains: { [k in keyof DomainOverrides]-?: string } = {
  rpc: DEFAULT_RPC_URL,
  inAppWallet: DEFAULT_IN_APP_WALLET_URL,
  social: DEFAULT_SOCIAL_URL,
  pay: DEFAULT_PAY_URL,
  storage: DEFAULT_STORAGE_URL,
  bundler: DEFAULT_BUNDLER_URL,
  analytics: DEFAULT_ANALYTICS_URL,
  insight: DEFAULT_INSIGHT_URL,
};

/**
 * @internal
 */
export const setThirdwebDomains = (DomainOverrides: DomainOverrides) => {
  domains = {
    rpc: DomainOverrides.rpc ?? DEFAULT_RPC_URL,
    inAppWallet: DomainOverrides.inAppWallet ?? DEFAULT_IN_APP_WALLET_URL,
    social: DomainOverrides.social ?? DEFAULT_SOCIAL_URL,
    pay: DomainOverrides.pay ?? DEFAULT_PAY_URL,
    storage: DomainOverrides.storage ?? DEFAULT_STORAGE_URL,
    bundler: DomainOverrides.bundler ?? DEFAULT_BUNDLER_URL,
    analytics: DomainOverrides.analytics ?? DEFAULT_ANALYTICS_URL,
    insight: DomainOverrides.insight ?? DEFAULT_INSIGHT_URL,
  };
};

/**
 * @internal
 */
export const getThirdwebDomains = () => {
  return domains;
};

/**
 * @internal
 */
export const getThirdwebBaseUrl = (service: keyof DomainOverrides) => {
  const origin = domains[service];
  if (origin.startsWith("localhost")) {
    return `http://${origin}`;
  }
  return `https://${origin}`;
};
