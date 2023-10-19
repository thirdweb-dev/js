import type { EmbeddedWalletAdditionalOptions } from "@thirdweb-dev/wallets";

export type OAuthProvider = "google";

export type EmbeddedWalletConfig = Omit<
  EmbeddedWalletAdditionalOptions,
  "chain" | "clientId"
> & {
  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;

  /**
   * Enable or Disable OAuth logins and specify which providers to use for OAuth
   * @default { providers: ["google"] }
   */
  oauthOptions?:
    | {
        providers: OAuthProvider[];
      }
    | false;
};

export type EmbeddedWalletLoginType = { email: string } | { google: true };
