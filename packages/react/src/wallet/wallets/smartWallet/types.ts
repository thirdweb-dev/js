import { SmartWalletConfig } from "@thirdweb-dev/wallets";

export type SmartWalletConfigOptions = Omit<
  SmartWalletConfig,
  "chain" | "clientId" | "secretKey"
>;
