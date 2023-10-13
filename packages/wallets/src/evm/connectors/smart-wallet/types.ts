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
import type { WalletConnectReceiverConfig } from "../../../core/types/walletConnect";
import { EVMWallet } from "../../interfaces";
import { WalletOptions } from "../../wallets/base";
import { BaseApiParams } from "./lib/base-api";

export type SmartWalletConfig = {
  chain: ChainOrRpcUrl;
  factoryAddress: string;
  clientId?: string;
  secretKey?: string;
  gasless: boolean;
  bundlerUrl?: string;
  paymasterUrl?: string;
  paymasterAPI?: PaymasterAPI;
  entryPointAddress?: string;
} & ContractInfoInput &
  WalletConnectReceiverConfig;

export type SmartWalletConnectionArgs = {
  personalWallet: EVMWallet;
  accountAddress?: string;
};
export type SmartWalletOptions = WalletOptions;

export interface AccountApiParams
  extends Omit<BaseApiParams, "provider">,
  ContractInfo {
  chain: ChainOrRpcUrl;
  localSigner: Signer;
  factoryAddress: string;
  accountAddress?: string;
  clientId?: string;
  secretKey?: string;
}

export interface ProviderConfig extends ContractInfo {
  chain: ChainOrRpcUrl;
  localSigner: Signer;
  entryPointAddress: string;
  clientId?: string;
  secretKey?: string;
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
    optionalParam?: any
  ) => Promise<Transaction>;
  getAccountAddress: (factory: SmartContract, owner: string, optionalParam?: any) => Promise<string>;
};
