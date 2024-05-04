import { hexToBigInt } from "../../../utils/encoding/hex.js";
import { getClientFetch } from "../../../utils/fetch.js";
import type {
  PaymasterResult,
  SmartAccountOptions,
  UserOperation,
} from "../types.js";
import {
  DEBUG,
  ENTRYPOINT_ADDRESS_v0_6,
  getDefaultPaymasterUrl,
} from "./constants.js";
import { hexlifyUserOp } from "./utils.js";

/**
 * TODO Docs
 * @internal
 */
export async function getPaymasterAndData(args: {
  userOp: UserOperation;
  options: SmartAccountOptions;
}): Promise<PaymasterResult> {
  const { userOp, options } = args;

  if (options.overrides?.paymaster) {
    return options.overrides?.paymaster(userOp);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const client = options.client;
  const paymasterUrl = getDefaultPaymasterUrl(options.chain);
  const entrypoint =
    options.overrides?.entrypointAddress ?? ENTRYPOINT_ADDRESS_v0_6;

  // Ask the paymaster to sign the transaction and return a valid paymasterAndData value.
  const fetchWithHeaders = getClientFetch(client);
  const response = await fetchWithHeaders(paymasterUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "pm_sponsorUserOperation",
      params: [hexlifyUserOp(userOp), entrypoint],
    }),
  });
  const res = await response.json();

  if (!response.ok) {
    const error = res.error || response.statusText;
    const code = res.code || "UNKNOWN";

    throw new Error(
      `Paymaster error: ${error}
Status: ${response.status}
Code: ${code}`,
    );
  }

  if (DEBUG) {
    console.debug("Paymaster result:", res);
  }

  if (res.result) {
    // some paymasters return a string, some return an object with more data
    if (typeof res.result === "string") {
      return {
        paymasterAndData: res.result,
      };
    }
    return {
      paymasterAndData: res.result.paymasterAndData,
      verificationGasLimit: res.result.verificationGasLimit
        ? hexToBigInt(res.result.verificationGasLimit)
        : undefined,
      preVerificationGas: res.result.preVerificationGas
        ? hexToBigInt(res.result.preVerificationGas)
        : undefined,
      callGasLimit: res.result.callGasLimit
        ? hexToBigInt(res.result.callGasLimit)
        : undefined,
    };
  }
  const error =
    res.error?.message || res.error || response.statusText || "unknown error";
  throw new Error(`Paymaster error from ${paymasterUrl}: ${error}`);
}
