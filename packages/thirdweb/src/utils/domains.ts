type DomainOverrides = {
  /**
   * The base URL for the RPC server.
   * @default "rpc.thirdweb.com"
   */
  rpc?: string;
  /**
   * The base URL for the in-app wallet service
   * @default "embedded-wallet.thirdweb.com"
   */
  inAppWallet?: string;
  /**
   * The base URL for the payment server.
   * @default "interstate.thirdweb.com"
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
};

export const DEFAULT_RPC_URL = "rpc.thirdweb.com";
const DEFAULT_IN_APP_WALLET_URL = "embedded-wallet.thirdweb.com";
const DEFAULT_PAY_URL = "pay.thirdweb.com";
const DEFAULT_STORAGE_URL = "storage.thirdweb.com";
const DEFAULT_BUNDLER_URL = "bundler.thirdweb.com";

let domains: { [k in keyof DomainOverrides]-?: string } = {
  rpc: DEFAULT_RPC_URL,
  inAppWallet: DEFAULT_IN_APP_WALLET_URL,
  pay: DEFAULT_PAY_URL,
  storage: DEFAULT_STORAGE_URL,
  bundler: DEFAULT_BUNDLER_URL,
};

/**
 * @internal
 */
export const setThirdwebDomains = (DomainOverrides: DomainOverrides) => {
  domains = {
    rpc: DomainOverrides.rpc ?? DEFAULT_RPC_URL,
    inAppWallet: DomainOverrides.inAppWallet ?? DEFAULT_IN_APP_WALLET_URL,
    pay: DomainOverrides.pay ?? DEFAULT_PAY_URL,
    storage: DomainOverrides.storage ?? DEFAULT_STORAGE_URL,
    bundler: DomainOverrides.bundler ?? DEFAULT_BUNDLER_URL,
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
