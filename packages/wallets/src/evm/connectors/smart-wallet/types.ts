import type { PaymasterAPI } from "@account-abstraction/sdk";
import type {
  ChainOrRpcUrl,
  SmartContract,
  Transaction,
} from "@thirdweb-dev/sdk";
import type {
  BigNumber,
  BigNumberish,
  ContractInterface,
  Signer,
} from "ethers";
import { EVMWallet } from "../../interfaces";
import { WalletOptions } from "../../wallets/base";
import { BaseApiParams } from "./lib/base-api";

export type SmartWalletConfig = {
  chain: ChainOrRpcUrl;
  factoryAddress: string;
  thirdwebApiKey: string;
  gasless: boolean;
  bundlerUrl?: string;
  paymasterUrl?: string;
  entryPointAddress?: string;
} & ContractInfoInput;

export type SmartWalletConnectionArgs = {
  personalWallet: EVMWallet;
};
export type SmartWalletOptions = WalletOptions<{}>;

export interface AccountApiParams
  extends Omit<BaseApiParams, "provider">,
    ContractInfo {
  chain: ChainOrRpcUrl;
  localSigner: Signer;
  factoryAddress: string;
  accountAddress?: string;
}

export interface ProviderConfig extends ContractInfo {
  chain: ChainOrRpcUrl;
  localSigner: Signer;
  entryPointAddress: string;
  thirdwebApiKey: string;
  bundlerUrl: string;
  factoryAddress: string;
  accountAddress?: string;
  paymasterAPI?: PaymasterAPI;
}

export type ContractInfoInput = {
  factoryInfo?: FactoryContractInfo;
  accountInfo?: AccountContractInfo;
};

export type ContractInfo = {
  factoryInfo: FactoryContractInfo;
  accountInfo: AccountContractInfo;
};

export type AccountContractInfo = {
  abi?: ContractInterface;
  getNonce: (account: SmartContract) => Promise<BigNumber>;
  execute: (
    account: SmartContract,
    target: string,
    value: BigNumberish,
    data: string,
  ) => Promise<Transaction>;
};

export type FactoryContractInfo = {
  abi?: ContractInterface;
  createAccount: (
    factory: SmartContract,
    owner: string,
  ) => Promise<Transaction>;
  getAccountAddress: (factory: SmartContract, owner: string) => Promise<string>;
};
