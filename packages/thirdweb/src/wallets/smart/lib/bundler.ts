import { type TransactionSerializable, decodeErrorResult } from "viem";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { userOperationRevertReasonEvent } from "../../../extensions/erc4337/__generated__/IEntryPoint/events/UserOperationRevertReason.js";
import type { TransactionReceipt } from "../../../transaction/types.js";
import { type Hex, hexToBigInt } from "../../../utils/encoding/hex.js";
import { getClientFetch } from "../../../utils/fetch.js";
import { stringify } from "../../../utils/json.js";
import type {
  BundlerOptions,
  EstimationResult,
  GasPriceResult,
  PmTransactionData,
  UserOperation,
} from "../types.js";
import {
  DEBUG,
  ENTRYPOINT_ADDRESS_v0_6,
  MANAGED_ACCOUNT_GAS_BUFFER,
  getDefaultBundlerUrl,
} from "./constants.js";
import { hexlifyUserOp } from "./utils.js";

/**
 * @internal
 */
export async function bundleUserOp(args: {
  userOp: UserOperation;
  options: BundlerOptions;
}): Promise<Hex> {
  return sendBundlerRequest({
    ...args,
    operation: "eth_sendUserOperation",
    params: [
      hexlifyUserOp(args.userOp),
      args.options.overrides?.entrypointAddress ?? ENTRYPOINT_ADDRESS_v0_6,
    ],
  });
}

/**
 * @internal
 */
export async function estimateUserOpGas(args: {
  userOp: UserOperation;
  options: BundlerOptions;
}): Promise<EstimationResult> {
  const res = await sendBundlerRequest({
    ...args,
    operation: "eth_estimateUserOperationGas",
    params: [
      hexlifyUserOp(args.userOp),
      args.options.overrides?.entrypointAddress ?? ENTRYPOINT_ADDRESS_v0_6,
    ],
  });

  // add gas buffer for managed account factory delegate calls
  return {
    preVerificationGas: hexToBigInt(res.preVerificationGas),
    verificationGas: hexToBigInt(res.verificationGas),
    verificationGasLimit: hexToBigInt(res.verificationGasLimit),
    callGasLimit: hexToBigInt(res.callGasLimit) + MANAGED_ACCOUNT_GAS_BUFFER,
  };
}

/**
 * @internal
 */
export async function getUserOpGasPrice(args: {
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
 * @internal
 */
export async function getUserOpReceipt(args: {
  userOpHash: Hex;
  options: BundlerOptions;
}): Promise<TransactionReceipt | undefined> {
  const res = await sendBundlerRequest({
    ...args,
    operation: "eth_getUserOperationReceipt",
    params: [args.userOpHash],
  });
  if (!res) {
    return undefined;
  }
  if (res.success === false) {
    // parse revert reason
    const logs = parseEventLogs({
      events: [userOperationRevertReasonEvent()],
      logs: res.logs,
    });
    const revertReason = logs[0]?.args?.revertReason;
    if (!revertReason) {
      throw new Error(`UserOp failed at txHash: ${res.transactionHash}`);
    }
    const revertMsg = decodeErrorResult({
      data: revertReason,
    });
    throw new Error(
      `UserOp failed with reason: '${revertMsg.args.join(",")}' at txHash: ${
        res.transactionHash
      }`,
    );
  }
  return res.receipt;
}

/**
 * @internal
 */
export async function getZkPaymasterData(args: {
  options: BundlerOptions;
  transaction: TransactionSerializable;
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
  transaction: TransactionSerializable;
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

  if (DEBUG) {
    console.debug(`>>> sending ${operation} with payload:`, params);
  }

  const bundlerUrl =
    options.overrides?.bundlerUrl ?? getDefaultBundlerUrl(options.chain);
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
      error = JSON.stringify(error);
    }
    const code = res.code || "UNKNOWN";

    throw new Error(
      `${operation} error: ${error}
Status: ${response.status}
Code: ${code}`,
    );
  }

  if (DEBUG) {
    console.debug(`<<< ${operation} result:`, res);
  }

  return res.result;
}
