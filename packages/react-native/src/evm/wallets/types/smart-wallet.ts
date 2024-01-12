import { SmartWalletConfig as SmartWalletConfigWallets } from "@thirdweb-dev/wallets";

export type SmartWalletConfig = Omit<
  SmartWalletConfigWallets,
  "chain" | "clientId" | "secretKey"
>;
