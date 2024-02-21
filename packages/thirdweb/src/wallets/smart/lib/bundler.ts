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

/**
 * @internal
 */
export async function bundleUserOp(args: {
  userOp: UserOperation;
  options: SmartWalletOptions;
}): Promise<Hex> {
  return sendBundlerRequest({
    ...args,
    operation: "eth_sendUserOperation",
  });
}

/**
 * @internal
 */
export async function estimateUserOpGas(args: {
  userOp: UserOperation;
  options: SmartWalletOptions;
}): Promise<EstimationResult> {
  const res = await sendBundlerRequest({
    ...args,
    operation: "eth_estimateUserOperationGas",
  });

  return {
    preVerificationGas: hexToBigInt(res.preVerificationGas),
    verificationGas: hexToBigInt(res.verificationGas),
    verificationGasLimit: hexToBigInt(res.verificationGasLimit),
    callGasLimit: hexToBigInt(res.callGasLimit),
  };
}

async function sendBundlerRequest(args: {
  userOp: UserOperation;
  options: SmartWalletOptions;
  operation: "eth_estimateUserOperationGas" | "eth_sendUserOperation";
}) {
  const { userOp, options, operation } = args;

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
      params: [
        hexlifyUserOp(userOp),
        options.overrides?.entrypointAddress ?? ENTRYPOINT_ADDRESS,
      ],
    }),
  });
  const res = await response.json();

  if (!response.ok || !res.result) {
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
