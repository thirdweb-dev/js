import { WalletConfig } from "@thirdweb-dev/react-core";
import {
  SmartWallet,
  SmartWalletConfig as SmartWalletConfig_,
} from "@thirdweb-dev/wallets";

export type SmartWalletConfigOptions = Omit<
  SmartWalletConfig_,
  "chain" | "clientId"
> & {
  personalWallets?: WalletConfig<any>[];
};

export type SmartWalletConfig = WalletConfig<SmartWallet>;
