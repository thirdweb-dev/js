import type { EmbeddedWalletAdditionalOptions } from "@thirdweb-dev/wallets";

export type AuthProvider = "google" | "email";

export type EmbeddedWalletConfig = Omit<
  EmbeddedWalletAdditionalOptions,
  "chain" | "clientId"
> & {
  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;

  /**
   * Choose which auth providers to show in the wallet connection UI
   * @default { providers: ["email", "google"] }
   */
  authOptions?: {
    providers: AuthProvider[];
  };
};

export type EmbeddedWalletLoginType = { email: string } | { google: true };
