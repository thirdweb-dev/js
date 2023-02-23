export type ThirdwebProviderConfig = {
  domain: string;
  authOptions?: {
    statement?: string;
    uri?: string;
    version?: string;
    chainId?: string;
    resources?: string[];
    validateNonce?:
      | ((nonce: string) => void)
      | ((nonce: string) => Promise<void>);
  };
};
