import { WalletConfig } from "@thirdweb-dev/react-core";
import {
  SmartWallet,
  SmartWalletConfig as SmartWalletConfig_,
} from "@thirdweb-dev/wallets";

export type SmartWalletConfig = SmartWalletConfig_ & {
  personalWallets: WalletConfig<any, any>[];
};

export type SmartConfiguredWallet = WalletConfig<
  SmartWallet,
  SmartWalletConfig
>;
