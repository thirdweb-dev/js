import type { ThirdwebClient } from "../../client/client.js";
import type { SendTransactionOption, Wallet } from "../interfaces/wallet.js";
import type { Hex } from "viem";
import type { WalletMetadata } from "../types.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import type { Chain } from "../../chains/types.js";
import type { Address } from "abitype";
import type { AsyncStorage } from "../storage/AsyncStorage.js";

export type SmartWalletOptions = {
  client: ThirdwebClient;
  chain: Chain;
  gasless: boolean;
  factoryAddress: string; // TODO make this optional
  overrides?: {
    bundlerUrl?: string;
    accountAddress?: string;
    accountSalt?: string;
    entrypointAddress?: string;
    paymaster?: (userOp: UserOperation) => Promise<PaymasterResult>;
    predictAddress?: (factoryContract: ThirdwebContract) => Promise<string>;
    createAccount?: (factoryContract: ThirdwebContract) => PreparedTransaction;
    execute?: (
      accountContract: ThirdwebContract,
      transaction: SendTransactionOption,
    ) => PreparedTransaction;
    executeBatch?: (
      accountContract: ThirdwebContract,
      transactions: SendTransactionOption[],
    ) => PreparedTransaction;
  };
  metadata?: WalletMetadata;
  /**
   * Storage interface of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage) to save connected wallet data to the storage for auto-connect.
   * If not provided, no wallet data will be saved to the storage by thirdweb SDK
   */
  storage?: AsyncStorage;
};

export type SmartWalletConnectionOptions = {
  personalWallet: Wallet;
};

export type UserOperation = {
  sender: Address;
  nonce: bigint;
  initCode: Hex | Uint8Array;
  callData: Hex | Uint8Array;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: Hex | Uint8Array;
  signature: Hex | Uint8Array;
};

export type UserOperationHexed = {
  sender: Address;
  nonce: Hex;
  initCode: Hex;
  callData: Hex;
  callGasLimit: Hex;
  verificationGasLimit: Hex;
  preVerificationGas: Hex;
  maxFeePerGas: Hex;
  maxPriorityFeePerGas: Hex;
  paymasterAndData: Hex;
  signature: Hex;
};

export type PaymasterResult = {
  paymasterAndData: string;
  preVerificationGas?: bigint;
  verificationGasLimit?: bigint;
  callGasLimit?: bigint;
};

export type EstimationResult = {
  preVerificationGas: bigint;
  verificationGas: bigint;
  verificationGasLimit: bigint;
  callGasLimit: bigint;
};
