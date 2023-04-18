import { ChainOrRpcUrl } from "@thirdweb-dev/sdk";
import { EVMWallet } from "../../interfaces";
import { WalletOptions } from "../../wallets/base";

// re-export the connection args for convenience
export type SmartWalletConfig = {
  apiKey: string;
  gasless: boolean;
  chain: ChainOrRpcUrl;
  factoryAddress: string;
  factoryAbi?: string;
  accountAbi?: string;
  entryPointAddress?: string;
};

export type SmartWalletConnectionArgs = {
  personalWallet: EVMWallet;
  accountId?: string;
};
export type SmartWalletOptions = WalletOptions<{}>;
