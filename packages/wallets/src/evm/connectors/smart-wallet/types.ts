import { ChainOrRpcUrl } from "@thirdweb-dev/sdk";
import { EVMWallet } from "../../interfaces";
import { WalletOptions } from "../../wallets/base";

// re-export the connection args for convenience
export type SmartWalletConfig = {
  chain: ChainOrRpcUrl;
  factoryAddress: string;
  apiKey: string;
  gasless: boolean;
  bundlerUrl?: string;
  paymasterUrl?: string;
  factoryAbi?: string;
  accountAbi?: string;
  entryPointAddress?: string;
};

export type SmartWalletConnectionArgs = {
  personalWallet: EVMWallet;
  accountId?: string;
};
export type SmartWalletOptions = WalletOptions<{}>;
