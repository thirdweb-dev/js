import { getClientFetch } from "../../../utils/fetch.js";
import { hexToBigInt, type Hex } from "../../../utils/encoding/hex.js";
import type {
  EstimationResult,
  SmartWalletOptions,
  UserOperation,
} from "../types.js";
import {
  DEBUG,
  ENTRYPOINT_ADDRESS,
  getDefaultBundlerUrl,
} from "./constants.js";
import { hexlifyUserOp } from "./utils.js";
import type { TransactionReceipt } from "../../../transaction/types.js";
import type { ThirdwebClient } from "../../../client/client.js";

/**
 * @internal
 */
export async function bundleUserOp(args: {
  userOp: UserOperation;
  options: SmartWalletOptions & { client: ThirdwebClient };
}): Promise<Hex> {
  return sendBundlerRequest({
    ...args,
    operation: "eth_sendUserOperation",
    params: [
      hexlifyUserOp(args.userOp),
      args.options.overrides?.entrypointAddress ?? ENTRYPOINT_ADDRESS,
    ],
  });
}

/**
 * @internal
 */
export async function estimateUserOpGas(args: {
  userOp: UserOperation;
  options: SmartWalletOptions & { client: ThirdwebClient };
}): Promise<EstimationResult> {
  const res = await sendBundlerRequest({
    ...args,
    operation: "eth_estimateUserOperationGas",
    params: [
      hexlifyUserOp(args.userOp),
      args.options.overrides?.entrypointAddress ?? ENTRYPOINT_ADDRESS,
    ],
  });

  return {
    preVerificationGas: hexToBigInt(res.preVerificationGas),
    verificationGas: hexToBigInt(res.verificationGas),
    verificationGasLimit: hexToBigInt(res.verificationGasLimit),
    callGasLimit: hexToBigInt(res.callGasLimit),
  };
}

/**
 * @internal
 */
export async function getUserOpReceipt(args: {
  userOpHash: Hex;
  options: SmartWalletOptions & { client: ThirdwebClient };
}): Promise<TransactionReceipt | undefined> {
  const res = await sendBundlerRequest({
    ...args,
    operation: "eth_getUserOperationReceipt",
    params: [args.userOpHash],
  });
  // TODO theres more info in res we could be returning here
  return res?.receipt;
}

async function sendBundlerRequest(args: {
  options: SmartWalletOptions & { client: ThirdwebClient };
  operation:
    | "eth_estimateUserOperationGas"
    | "eth_sendUserOperation"
    | "eth_getUserOperationReceipt";
  params: any[];
}) {
  const { options, operation, params } = args;

  if (DEBUG) {
    console.debug(`sending ${operation} with payload:`, params);
  }

  const bundlerUrl =
    options.overrides?.bundlerUrl ?? getDefaultBundlerUrl(options.chain);
  const fetchWithHeaders = getClientFetch(options.client);
  const response = await fetchWithHeaders(bundlerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    console.debug(`${operation} result:`, res);
  }

  return res.result;
}
