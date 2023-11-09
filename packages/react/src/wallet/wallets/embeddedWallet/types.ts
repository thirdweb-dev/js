import type {
  EmbeddedWalletAdditionalOptions,
  EmbeddedWalletOauthOptions,
} from "@thirdweb-dev/wallets";

export type AuthOption = EmbeddedWalletOauthOptions | "email";

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
   * @default { providers: ["email", "google", "facebook", "apple"] }
   */
  auth?: {
    options: AuthOption[];
  };
};

export type EmbeddedWalletLoginType =
  | { email: string }
  | { google: true }
  | { apple: true }
  | { facebook: true };
