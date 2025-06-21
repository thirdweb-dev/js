import type * as ox__Address from "ox/Address";
import type * as ox__TypedData from "ox/TypedData";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import type { AccountPermissions } from "../../extensions/erc4337/account/types.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../transaction/types.js";
import type { Hex } from "../../utils/encoding/hex.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { SignableMessage } from "../../utils/types.js";
import type { Account, SendTransactionOption } from "../interfaces/wallet.js";

export type TokenPaymasterConfig = {
  chainId: number;
  paymasterAddress: string;
  tokenAddress: string;
  balanceStorageSlot: bigint;
};

export type SmartWalletOptions = Prettify<
  {
    chain: Chain; // TODO consider making default chain optional
    factoryAddress?: string;
    sessionKey?: {
      address: string;
      permissions: AccountPermissions;
    };
    overrides?: {
      bundlerUrl?: string;
      accountAddress?: string;
      accountSalt?: string;
      entrypointAddress?: string;
      tokenPaymaster?: TokenPaymasterConfig;
      paymaster?: (
        userOp: UserOperationV06 | UserOperationV07,
      ) => Promise<PaymasterResult>;
      predictAddress?: (
        factoryContract: ThirdwebContract,
        admin: string,
      ) => Promise<string>;
      createAccount?: (
        factoryContract: ThirdwebContract,
        admin: string,
      ) => PreparedTransaction;
      execute?: (
        accountContract: ThirdwebContract,
        transaction: SendTransactionOption,
      ) => PreparedTransaction;
      executeBatch?: (
        accountContract: ThirdwebContract,
        transactions: SendTransactionOption[],
      ) => PreparedTransaction;
      getAccountNonce?: (accountContract: ThirdwebContract) => Promise<bigint>;
      signMessage?: (options: {
        adminAccount: Account;
        accountContract: ThirdwebContract;
        factoryContract: ThirdwebContract;
        message: SignableMessage;
      }) => Promise<Hex>;
      signTypedData?: <
        const typedData extends
          | ox__TypedData.TypedData
          | Record<string, unknown>,
        primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
      >(options: {
        adminAccount: Account;
        accountContract: ThirdwebContract;
        factoryContract: ThirdwebContract;
        typedData: ox__TypedData.Definition<typedData, primaryType>;
      }) => Promise<Hex>;
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

export type BundlerOptions = {
  bundlerUrl?: string;
  entrypointAddress?: string;
  chain: Chain;
  client: ThirdwebClient;
};

export type SmartWalletConnectionOptions = {
  personalAccount: Account;
  client: ThirdwebClient;
  chain?: Chain;
};

export type UserOperationV06 = {
  sender: ox__Address.Address;
  nonce: bigint;
  initCode: Hex;
  callData: Hex;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: Hex;
  signature: Hex;
};

export type UserOperationV07 = {
  sender: string; // address
  nonce: bigint; // uint256
  factory: string | undefined; // address
  factoryData: Hex; // bytes
  callData: Hex; // bytes
  callGasLimit: bigint; // uint256
  verificationGasLimit: bigint; // uint256
  preVerificationGas: bigint; // uint256
  maxFeePerGas: bigint; // uint256
  maxPriorityFeePerGas: bigint; // uint256
  paymaster: string | undefined; // address
  paymasterData: Hex; // bytes
  paymasterVerificationGasLimit: bigint; // uint256
  paymasterPostOpGasLimit: bigint; // uint256
  signature: Hex; // bytes
};

export type PackedUserOperation = {
  sender: string; // address
  nonce: bigint; // uint256
  initCode: Hex; // bytes
  callData: Hex; // bytes
  accountGasLimits: Hex; // bytes32
  preVerificationGas: bigint; // uint256
  gasFees: Hex; // bytes32
  paymasterAndData: Hex; // bytes
  signature: Hex; // bytes
};

export type UserOperationV06Hexed = {
  sender: ox__Address.Address;
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

export type UserOperationV07Hexed = {
  sender: Hex;
  nonce: Hex;
  factory: Hex;
  factoryData: Hex;
  callData: Hex;
  callGasLimit: Hex;
  verificationGasLimit: Hex;
  preVerificationGas: Hex;
  maxFeePerGas: Hex;
  maxPriorityFeePerGas: Hex;
  paymaster: Hex;
  paymasterVerificationGasLimit: Hex;
  paymasterPostOpGasLimit: Hex;
  paymasterData: Hex;
  signature: Hex;
};

export type PaymasterResult = {
  preVerificationGas?: bigint;
  verificationGasLimit?: bigint;
  callGasLimit?: bigint;
} & (
  | {
      // v0.6 types
      paymasterAndData: string;
    }
  | {
      // v0.7 types
      paymaster: string;
      paymasterData: string;
      paymasterVerificationGasLimit?: bigint;
      paymasterPostOpGasLimit?: bigint;
    }
);

export type EstimationResult = {
  preVerificationGas: bigint;
  verificationGas?: bigint;
  verificationGasLimit: bigint;
  callGasLimit: bigint;
  // v0.7 types
  paymasterVerificationGasLimit?: bigint;
  paymasterPostOpGasLimit?: bigint;
};

export type GasPriceResult = {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
};

export type PmTransactionData = {
  paymaster: ox__Address.Address;
  paymasterInput: Hex;
};

export type UserOperationReceipt = {
  receipt: TransactionReceipt;
  logs: TransactionReceipt["logs"];
  userOpHash: Hex;
  entryPoint: ox__Address.Address;
  sender: ox__Address.Address;
  nonce: bigint;
  paymaster: ox__Address.Address;
  actualGasUsed: bigint;
  actualGasCost: bigint;
  success: boolean;
};

export function formatUserOperationReceipt(
  userOpReceiptRaw: UserOperationReceipt,
) {
  const { receipt: transactionReceipt } = userOpReceiptRaw;

  const receipt = {
    ...transactionReceipt,
    blockNumber: transactionReceipt.blockNumber
      ? BigInt(transactionReceipt.blockNumber)
      : null,
    contractAddress: transactionReceipt.contractAddress
      ? transactionReceipt.contractAddress
      : null,
    cumulativeGasUsed: transactionReceipt.cumulativeGasUsed
      ? BigInt(transactionReceipt.cumulativeGasUsed)
      : null,
    effectiveGasPrice: transactionReceipt.effectiveGasPrice
      ? BigInt(transactionReceipt.effectiveGasPrice)
      : null,
    gasUsed: transactionReceipt.gasUsed
      ? BigInt(transactionReceipt.gasUsed)
      : null,
    logs: transactionReceipt.logs,
    status: transactionReceipt.status,
    to: transactionReceipt.to ? transactionReceipt.to : null,
    transactionHash: transactionReceipt.transactionHash,
    transactionIndex: transactionReceipt.transactionIndex,
    type: transactionReceipt.type,
  } as TransactionReceipt;

  if (transactionReceipt.blobGasPrice)
    receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
  if (transactionReceipt.blobGasUsed)
    receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);

  const userOpReceipt = {
    ...userOpReceiptRaw,
    actualGasCost: BigInt(userOpReceiptRaw.actualGasCost),
    actualGasUsed: BigInt(userOpReceiptRaw.actualGasUsed),
    nonce: BigInt(userOpReceiptRaw.nonce),
    receipt,
    userOpHash: userOpReceiptRaw.userOpHash,
  } as UserOperationReceipt;
  return userOpReceipt;
}
