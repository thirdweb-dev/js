import type {
  EmbeddedWalletAdditionalOptions,
  EmbeddedWalletOauthStrategy,
} from "@thirdweb-dev/wallets";

export type AuthOption = EmbeddedWalletOauthStrategy | "email";

/**
 * @wallet
 */
export type EmbeddedWalletConfigOptions = Omit<
  EmbeddedWalletAdditionalOptions,
  "chain" | "clientId"
> & {
  /**
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
   */
  recommended?: boolean;

  /**
   * Choose which auth providers to show in the wallet connection UI
   *
   * By default, all auth methods are enabled, which is equivalent to setting the following:
   *
   * ```ts
   * {
   *  options: ["email", "google", "apple", "facebook"]
   * }
   * ```
   */
  auth?: {
    options: AuthOption[];
  };
};

export type EmbeddedWalletLoginType =
  | { email: string }
  | EmbeddedWalletOauthStrategy;
