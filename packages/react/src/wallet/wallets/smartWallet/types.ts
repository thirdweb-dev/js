import { SmartWalletConfig } from "@thirdweb-dev/wallets";

/**
 * @wallet
 */
export type SmartWalletConfigOptions = Omit<
  SmartWalletConfig,
  "chain" | "clientId" | "secretKey"
>;
