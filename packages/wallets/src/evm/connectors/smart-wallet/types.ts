import { ChainOrRpcUrl } from "@thirdweb-dev/sdk";
import { EVMWallet } from "../../interfaces";
import { WalletOptions } from "../../wallets/base";

export type SmartWalletConfig = {
  chain: ChainOrRpcUrl;
  factoryAddress: string;
  thirdwebApiKey: string;
  gasless: boolean;
  bundlerUrl?: string;
  paymasterUrl?: string;
  factoryAbi?: string;
  accountAbi?: string;
  entryPointAddress?: string;
};

export type SmartWalletConnectionArgs = {
  personalWallet: EVMWallet;
  accountId: string;
};
export type SmartWalletOptions = WalletOptions<{}>;
