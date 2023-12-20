import type {
  ChainOrRpcUrl,
  SmartContract,
  Transaction,
} from "@thirdweb-dev/sdk";
import type {
  BigNumber,
  BigNumberish,
  BytesLike,
  ContractInterface,
  Signer,
  providers,
} from "ethers";
import type { WalletConnectReceiverConfig } from "../../../core/types/walletConnect";
import { EVMWallet } from "../../interfaces";
import { WalletOptions } from "../../wallets/base";
import { UserOperationStruct } from "@account-abstraction/contracts";

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
  ) => Promise<Transaction>;
  getAccountAddress: (factory: SmartContract, owner: string) => Promise<string>;
};

export type PaymasterResult = {
  paymasterAndData: string;
  preVerificationGas?: BigNumber;
  verificationGasLimit?: BigNumber;
  callGasLimit?: BigNumber;
};

/**
 * an API to external a UserOperation with paymaster info
 */
export abstract class PaymasterAPI {
  /**
   * @param userOp - a partially-filled UserOperation (without signature and paymasterAndData
   *  note that the "preVerificationGas" is incomplete: it can't account for the
   *  paymasterAndData value, which will only be returned by this method..
   * @returns the value to put into the PaymasterAndData, undefined to leave it empty
   */
  abstract getPaymasterAndData(
    userOp: Partial<UserOperationStruct>,
  ): Promise<PaymasterResult>;
}

export type BatchData = {
  targets: (string | undefined)[];
  data: BytesLike[];
  values: BigNumberish[];
};

export interface BaseApiParams {
  provider: providers.Provider;
  entryPointAddress: string;
  accountAddress?: string;
  paymasterAPI?: PaymasterAPI;
}

export interface UserOpResult {
  transactionHash: string;
  success: boolean;
}
