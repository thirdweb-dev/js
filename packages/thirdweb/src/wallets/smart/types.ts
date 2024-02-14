import type { Chain } from "../../chain/index.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { PreparedTransaction } from "../../index.js";
import type { Account } from "../interfaces/wallet.js";
import type { Address, Hex } from "viem";

export type SmartWalletOptions = {
  client: ThirdwebClient;
  personalAccount: Account;
  chain: Chain;
  gasless: boolean;
  factoryAddress: string; // TODO make this optional
  accountExtraData?: string;
  accountAddress?: string;
  entrypointAddress?: string;
  bundlerUrl?: string;
  predictAddressOverride?: () => Promise<string>;
  createAccountOverride?: () => PreparedTransaction;
  executeOverride?: (
    target: string,
    value: bigint,
    data: string,
  ) => PreparedTransaction;
};

export type UserOperationStruct = {
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

export type PaymasterResult = {
  paymasterAndData: Hex;
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
