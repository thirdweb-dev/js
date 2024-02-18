import type { Chain } from "../../chains/index.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { SendTransactionOption, Wallet } from "../interfaces/wallet.js";
import type { Address, Hex } from "viem";
import type { WalletMetadata } from "../types.js";
import type { ThirdwebContract } from "../../contract/index.js";
import type { PreparedTransaction } from "../../transaction/index.js";

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
