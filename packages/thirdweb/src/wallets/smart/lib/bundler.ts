import { decodeErrorResult } from "viem";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { userOperationRevertReasonEvent } from "../../../extensions/erc4337/__generated__/IEntryPoint/events/UserOperationRevertReason.js";
import { postOpRevertReasonEvent } from "../../../extensions/erc4337/__generated__/IEntryPoint_v07/events/PostOpRevertReason.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import type { SerializableTransaction } from "../../../transaction/serialize-transaction.js";
import type { TransactionReceipt } from "../../../transaction/types.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { type Hex, hexToBigInt } from "../../../utils/encoding/hex.js";
import { getClientFetch } from "../../../utils/fetch.js";
import { stringify } from "../../../utils/json.js";
import { toEther } from "../../../utils/units.js";
import type { Account } from "../../interfaces/wallet.js";
import { getEntrypointFromFactory } from "../index.js";
import {
  type BundlerOptions,
  type EstimationResult,
  type GasPriceResult,
  type PmTransactionData,
  type SmartWalletOptions,
  type UserOperationReceipt,
  type UserOperationV06,
  type UserOperationV07,
  formatUserOperationReceipt,
} from "../types.js";
import { predictSmartAccountAddress } from "./calls.js";
import {
  ENTRYPOINT_ADDRESS_v0_6,
  MANAGED_ACCOUNT_GAS_BUFFER,
  getDefaultBundlerUrl,
} from "./constants.js";
import { prepareUserOp } from "./userop.js";
import { hexlifyUserOp } from "./utils.js";

/**
 * Bundle a user operation.
 * @param args - The options for bundling a user operation.
 * @returns The bundle hash of the user operation.
 * @example
 * ```ts
 * import { bundleUserOp } from "thirdweb/wallets/smart";
 *
 * const userOpHash = await bundleUserOp({
 *  userOp,
 *  options,
 * });
 * ```
 * @walletUtils
 */
export async function bundleUserOp(args: {
  userOp: UserOperationV06 | UserOperationV07;
  options: BundlerOptions;
}): Promise<Hex> {
  return sendBundlerRequest({
    ...args,
    operation: "eth_sendUserOperation",
    params: [
      hexlifyUserOp(args.userOp),
      args.options.entrypointAddress ?? ENTRYPOINT_ADDRESS_v0_6,
    ],
  });
}

/**
 * Estimate the gas cost of a user operation.
 * @param args - The options for estimating the gas cost of a user operation.
 * @returns The estimated gas cost of the user operation.
 * @example
 * ```ts
 * import { estimateUserOpGas } from "thirdweb/wallets/smart";
 *
 * const gasCost = await estimateUserOpGas({
 *  userOp,
 *  options,
 * });
 * ```
 * @walletUtils
 */
export async function estimateUserOpGas(
  args: {
    userOp: UserOperationV06 | UserOperationV07;
    options: BundlerOptions;
  },
  stateOverrides?: {
    [x: string]: {
      stateDiff: {
        [x: string]: `0x${string}`;
      };
    };
  },
): Promise<EstimationResult> {
  const res = await sendBundlerRequest({
    ...args,
    operation: "eth_estimateUserOperationGas",
    params: [
      hexlifyUserOp(args.userOp),
      args.options.entrypointAddress ?? ENTRYPOINT_ADDRESS_v0_6,
      stateOverrides ?? {},
    ],
  });

  // add gas buffer for managed account factory delegate calls
  return {
    preVerificationGas: hexToBigInt(res.preVerificationGas),
    verificationGas:
      res.verificationGas !== undefined
        ? hexToBigInt(res.verificationGas)
        : undefined,
    verificationGasLimit: hexToBigInt(res.verificationGasLimit),
    callGasLimit: hexToBigInt(res.callGasLimit) + MANAGED_ACCOUNT_GAS_BUFFER,
    paymasterVerificationGasLimit:
      res.paymasterVerificationGasLimit !== undefined
        ? hexToBigInt(res.paymasterVerificationGasLimit)
        : undefined,
    paymasterPostOpGasLimit:
      res.paymasterPostOpGasLimit !== undefined
        ? hexToBigInt(res.paymasterPostOpGasLimit)
        : undefined,
  };
}

/**
 * Estimate the gas cost of a user operation.
 * @param args - The options for estimating the gas cost of a user operation.
 * @returns The estimated gas cost of the user operation.
 * @example
 * ```ts
 * import { estimateUserOpGasCost } from "thirdweb/wallets/smart";
 *
 * const gasCost = await estimateUserOpGasCost({
 *  transactions,
 *  adminAccount,
 *  client,
 *  smartWalletOptions,
 * });
 * ```
 * @walletUtils
 */
export async function estimateUserOpGasCost(args: {
  transactions: PreparedTransaction[];
  adminAccount: Account;
  client: ThirdwebClient;
  smartWalletOptions: SmartWalletOptions;
}) {
  // if factory is passed, but no entrypoint, try to resolve entrypoint from factory
  if (
    args.smartWalletOptions.factoryAddress &&
    !args.smartWalletOptions.overrides?.entrypointAddress
  ) {
    const entrypointAddress = await getEntrypointFromFactory(
      args.smartWalletOptions.factoryAddress,
      args.client,
      args.smartWalletOptions.chain,
    );
    if (entrypointAddress) {
      args.smartWalletOptions.overrides = {
        ...args.smartWalletOptions.overrides,
        entrypointAddress,
      };
    }
  }

  const userOp = await prepareUserOp({
    transactions: args.transactions,
    adminAccount: args.adminAccount,
    client: args.client,
    smartWalletOptions: args.smartWalletOptions,
    isDeployedOverride: await isContractDeployed(
      getContract({
        address: await predictSmartAccountAddress({
          adminAddress: args.adminAccount.address,
          factoryAddress: args.smartWalletOptions.factoryAddress,
          chain: args.smartWalletOptions.chain,
          client: args.client,
        }),
        chain: args.smartWalletOptions.chain,
        client: args.client,
      }),
    ),
    waitForDeployment: false,
  });

  let gasLimit = 0n;
  if ("paymasterVerificationGasLimit" in userOp) {
    // v0.7
    gasLimit =
      BigInt(userOp.paymasterVerificationGasLimit ?? 0) +
      BigInt(userOp.paymasterPostOpGasLimit ?? 0) +
      BigInt(userOp.verificationGasLimit ?? 0) +
      BigInt(userOp.preVerificationGas ?? 0) +
      BigInt(userOp.callGasLimit ?? 0);
  } else {
    // v0.6
    gasLimit =
      BigInt(userOp.verificationGasLimit ?? 0) +
      BigInt(userOp.preVerificationGas ?? 0) +
      BigInt(userOp.callGasLimit ?? 0);
  }

  const gasCost = gasLimit * (userOp.maxFeePerGas ?? 0n);

  return {
    ether: toEther(gasCost),
    wei: gasCost,
  };
}

/**
 * Get the gas fees of a user operation.
 * @param args - The options for getting the gas price of a user operation.
 * @returns The gas price of the user operation.
 * @example
 * ```ts
 * import { getUserOpGasPrice } from "thirdweb/wallets/smart";
 *
 * const fees = await getUserOpGasPrice({
 *  options,
 * });
 * ```
 * @walletUtils
 */
export async function getUserOpGasFees(args: {
  options: BundlerOptions;
}): Promise<GasPriceResult> {
  const res = await sendBundlerRequest({
    ...args,
    operation: "thirdweb_getUserOperationGasPrice",
    params: [],
  });

  return {
    maxPriorityFeePerGas: hexToBigInt(res.maxPriorityFeePerGas),
    maxFeePerGas: hexToBigInt(res.maxFeePerGas),
  };
}

/**
 * Get the receipt of a user operation.
 * @param args - The options for getting the receipt of a user operation.
 * @returns The receipt of the user operation.
 * @example
 * ```ts
 * import { getUserOpReceipt } from "thirdweb/wallets/smart";
 *
 * const receipt = await getUserOpReceipt({
 *  client,
 *  chain,
 *  userOpHash,
 * });
 * ```
 * @walletUtils
 */
export async function getUserOpReceipt(
  args: BundlerOptions & {
    userOpHash: Hex;
  },
): Promise<TransactionReceipt | undefined> {
  const res = await getUserOpReceiptRaw(args);

  if (!res) {
    return undefined;
  }

  if (res.success === false) {
    // parse revert reason
    const logs = parseEventLogs({
      events: [userOperationRevertReasonEvent(), postOpRevertReasonEvent()],
      logs: res.logs,
    });
    const revertReason = logs[0]?.args?.revertReason;
    if (!revertReason) {
      throw new Error(
        `UserOp failed at txHash: ${res.receipt.transactionHash}`,
      );
    }
    const revertMsg = decodeErrorResult({
      data: revertReason,
    });
    throw new Error(
      `UserOp failed with reason: '${revertMsg.args.join(",")}' at txHash: ${
        res.receipt.transactionHash
      }`,
    );
  }
  return res.receipt;
}

/**
 * Get the receipt of a user operation.
 * @param args - The options for getting the receipt of a user operation.
 * @returns The raw receipt of the user operation.
 * @example
 * ```ts
 * import { getUserOpReceiptRaw } from "thirdweb/wallets/smart";
 *
 * const receipt = await getUserOpReceiptRaw({
 *  client,
 *  chain,
 *  userOpHash,
 * });
 * ```
 * @walletUtils
 */
export async function getUserOpReceiptRaw(
  args: BundlerOptions & {
    userOpHash: Hex;
  },
): Promise<UserOperationReceipt | undefined> {
  const res = await sendBundlerRequest({
    options: args,
    operation: "eth_getUserOperationReceipt",
    params: [args.userOpHash],
  });
  if (!res) {
    return undefined;
  }
  return formatUserOperationReceipt(res as UserOperationReceipt);
}

/**
 * @internal
 */
export async function getZkPaymasterData(args: {
  options: BundlerOptions;
  transaction: SerializableTransaction;
}): Promise<PmTransactionData> {
  const res = await sendBundlerRequest({
    options: args.options,
    operation: "zk_paymasterData",
    params: [args.transaction],
  });

  return {
    paymaster: res.paymaster,
    paymasterInput: res.paymasterInput,
  };
}

export async function broadcastZkTransaction(args: {
  options: BundlerOptions;
  transaction: SerializableTransaction;
  signedTransaction: Hex;
}): Promise<{ transactionHash: Hex }> {
  const res = await sendBundlerRequest({
    options: args.options,
    operation: "zk_broadcastTransaction",
    params: [
      {
        ...args.transaction,
        signedTransaction: args.signedTransaction,
      },
    ],
  });

  return {
    transactionHash: res.transactionHash,
  };
}

async function sendBundlerRequest(args: {
  options: BundlerOptions;
  operation:
    | "eth_estimateUserOperationGas"
    | "eth_sendUserOperation"
    | "eth_getUserOperationReceipt"
    | "thirdweb_getUserOperationGasPrice"
    | "zk_paymasterData"
    | "zk_broadcastTransaction";
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  params: any[];
}) {
  const { options, operation, params } = args;

  const bundlerUrl = options.bundlerUrl ?? getDefaultBundlerUrl(options.chain);
  const fetchWithHeaders = getClientFetch(options.client);
  const response = await fetchWithHeaders(bundlerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: stringify({
      jsonrpc: "2.0",
      id: 1,
      method: operation,
      params,
    }),
  });
  const res = await response.json();

  if (!response.ok || res.error) {
    let error = res.error || response.statusText;
    if (typeof error === "object") {
      error = stringify(error);
    }
    const code = res.code || "UNKNOWN";

    throw new Error(
      `${operation} error: ${error}
Status: ${response.status}
Code: ${code}`,
    );
  }

  return res.result;
}
