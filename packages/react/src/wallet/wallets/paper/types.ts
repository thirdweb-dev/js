import { PaperWalletAdditionalOptions } from "@thirdweb-dev/wallets";

export type PaperConfig = Omit<
  PaperWalletAdditionalOptions,
  "chain" | "clientId"
> & {
  /**
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export type RecoveryShareManagement = Exclude<
  Exclude<
    PaperWalletAdditionalOptions["advancedOptions"],
    undefined
  >["recoveryShareManagement"],
  undefined
>;

export type PaperLoginType = { email: string } | { google: true };
