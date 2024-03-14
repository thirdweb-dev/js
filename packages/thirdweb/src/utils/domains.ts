type DomainOverrides = {
  /**
   * The base URL for the RPC server.
   * @default "rpc.thirdweb.com"
   */
  rpc?: string;
  /**
   * The base URL for the embedded wallet service
   * @default "embedded-wallet.thirdweb.com"
   */
  embeddedWallet?: string;
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
};

let domains: DomainOverrides | undefined;

/**
 * @internal
 */
export const setThirdwebDomainOverride = (DomainOverrides: DomainOverrides) => {
  domains = DomainOverrides;
};

/**
 * @internal
 */
export const getThirdwebDomainOverrides = () => {
  return domains;
};
