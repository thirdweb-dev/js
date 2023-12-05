import { PaperWalletAdditionalOptions } from "@thirdweb-dev/wallets";

export type OAuthProvider = "google";

export type PaperWalletConfigOptions = Omit<
  PaperWalletAdditionalOptions,
  "chain" | "clientId"
> & {
  /**
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
   */
  recommended?: boolean;

  /**
   * Enable or Disable OAuth logins and specify which providers to use for OAuth
   * @defaultValue `{ providers: ["google"] }`
   */
  oauthOptions?:
    | {
        providers: OAuthProvider[];
      }
    | false;
};

export type RecoveryShareManagement = Exclude<
  Exclude<
    PaperWalletAdditionalOptions["advancedOptions"],
    undefined
  >["recoveryShareManagement"],
  undefined
>;

export type PaperLoginType = { email: string } | { google: true };
