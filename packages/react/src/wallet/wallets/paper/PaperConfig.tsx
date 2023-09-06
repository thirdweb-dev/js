import { PaperWalletAdditionalOptions } from "@thirdweb-dev/wallets";

export type PaperConfig = Omit<
  PaperWalletAdditionalOptions,
  "chain" | "chains"
>;

export type RecoveryShareManagement = Exclude<
  PaperWalletAdditionalOptions["advancedOptions"],
  undefined
>["recoveryShareManagement"];
