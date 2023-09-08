import { PaperWalletAdditionalOptions } from "@thirdweb-dev/wallets";

export type PaperConfig = Omit<
  PaperWalletAdditionalOptions,
  "chain" | "chains"
> & {
  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export type RecoveryShareManagement = Exclude<
  PaperWalletAdditionalOptions["advancedOptions"],
  undefined
>["recoveryShareManagement"];
