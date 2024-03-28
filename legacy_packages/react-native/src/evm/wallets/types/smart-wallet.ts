import type { WalletConfig } from "@thirdweb-dev/react-core";
import {
  SmartWallet,
  SmartWalletConfig as SmartWalletConfigWallets,
} from "@thirdweb-dev/wallets";

export type SmartWalletConfig = Omit<
  SmartWalletConfigWallets,
  "chain" | "clientId" | "secretKey"
>;

export type SmartWalletObj = WalletConfig<SmartWallet>;
