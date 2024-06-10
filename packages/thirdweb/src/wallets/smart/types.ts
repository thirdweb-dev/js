import type { Address } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import type { Hex } from "../../utils/encoding/hex.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { Account, SendTransactionOption } from "../interfaces/wallet.js";

export type SmartWalletOptions = Prettify<
  {
    chain: Chain; // TODO consider making default chain optional
    factoryAddress?: string;
    overrides?: {
      bundlerUrl?: string;
      accountAddress?: string;
      accountSalt?: string;
      entrypointAddress?: string;
      paymaster?: (userOp: UserOperation) => Promise<PaymasterResult>;
      predictAddress?: (factoryContract: ThirdwebContract) => Promise<string>;
      createAccount?: (
        factoryContract: ThirdwebContract,
      ) => PreparedTransaction;
      execute?: (
        accountContract: ThirdwebContract,
        transaction: SendTransactionOption,
      ) => PreparedTransaction;
      executeBatch?: (
        accountContract: ThirdwebContract,
        transactions: SendTransactionOption[],
      ) => PreparedTransaction;
    };
  } & (
    | {
        /**
         * @deprecated use 'sponsorGas' instead
         */
        gasless: boolean;
      }
    | {
        sponsorGas: boolean;
      }
  )
>;

// internal type
export type SmartAccountOptions = Prettify<
  Omit<SmartWalletOptions, "chain" | "gasless" | "sponsorGas"> & {
    chain: Chain;
    sponsorGas: boolean;
    personalAccount: Account;
    factoryContract: ThirdwebContract;
    accountContract: ThirdwebContract;
    client: ThirdwebClient;
  }
>;

export type BundlerOptions = Prettify<
  Omit<SmartWalletOptions, "chain" | "gasless" | "sponsorGas"> & {
    chain: Chain;
    client: ThirdwebClient;
  }
>;

export type SmartWalletConnectionOptions = {
  personalAccount: Account;
  client: ThirdwebClient;
  chain?: Chain;
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

export type GasPriceResult = {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
};

export type PmTransactionData = {
  paymaster: Address;
  paymasterInput: Hex;
};
