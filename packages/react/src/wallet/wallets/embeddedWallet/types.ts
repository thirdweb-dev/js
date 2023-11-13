import type {
  EmbeddedWalletAdditionalOptions,
  EmbeddedWalletOauthStrategy,
} from "@thirdweb-dev/wallets";

export type AuthOption = EmbeddedWalletOauthStrategy | "email";

export type EmbeddedWalletConfig = Omit<
  EmbeddedWalletAdditionalOptions,
  "chain" | "clientId"
> & {
  /**
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
   */
  recommended?: boolean;

  /**
   * Choose which auth providers to show in the wallet connection UI
   * @default { options: ["email", "google", "apple"] }
   */
  auth?: {
    options: AuthOption[];
  };
};

export type EmbeddedWalletLoginType =
  | { email: string }
  | EmbeddedWalletOauthStrategy;
