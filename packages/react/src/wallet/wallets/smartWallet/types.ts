import { WalletConfig } from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";

export type SmartWalletConfig = {
  factoryAddress: string;
  thirdwebApiKey: string;
  gasless: boolean;
  personalWallets?: WalletConfig<any>[];
};

export type SmartConfiguredWallet = WalletConfig<SmartWallet>;
