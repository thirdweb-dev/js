import type { EmbeddedWalletAdditionalOptions } from "@thirdweb-dev/wallets";

export type EmbeddedWalletConfig = Omit<
  EmbeddedWalletAdditionalOptions,
  "chain" | "clientId"
> & {
  /**
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export type EmbeddedWalletLoginType = { email: string } | { google: true };
