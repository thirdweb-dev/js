import { ConfiguredWallet } from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";

export type SmartWalletConfig = {
  factoryAddress: string;
  thirdwebApiKey: string;
  gasless: boolean;
  personalWallets?: ConfiguredWallet<any, any>[];
};

export type SmartConfiguredWallet = ConfiguredWallet<
  SmartWallet,
  SmartWalletConfig
>;
