import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { hexToBigInt } from "../../../utils/encoding/hex.js";
import { getClientFetch } from "../../../utils/fetch.js";
import { stringify } from "../../../utils/json.js";
import type {
  PaymasterResult,
  UserOperationV06,
  UserOperationV07,
} from "../types.js";
import { ENTRYPOINT_ADDRESS_v0_6, getDefaultBundlerUrl } from "./constants.js";
import { hexlifyUserOp } from "./utils.js";

/**
 * Get paymaster and data details for a user operation.
 * @param args - The userOp and options
 * @returns - The paymaster and data details for the user operation.
 * @example
 * ```ts
 * import { getPaymasterAndData } from "thirdweb/wallets/smart";
 *
 * const userOp = createUnsignedUserOp(...);
 *
 * const paymasterAndData = await getPaymasterAndData({
 *  userOp,
 *  client,
 *  chain,
 * });
 * ```
 * @walletUtils
 */
export async function getPaymasterAndData(args: {
  userOp: UserOperationV06 | UserOperationV07;
  client: ThirdwebClient;
  chain: Chain;
  entrypointAddress?: string;
  paymasterOverride?: (
    userOp: UserOperationV06 | UserOperationV07,
  ) => Promise<PaymasterResult>;
}): Promise<PaymasterResult> {
  const { userOp, paymasterOverride, client, chain, entrypointAddress } = args;

  if (paymasterOverride) {
    return paymasterOverride(userOp);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const entrypoint = entrypointAddress ?? ENTRYPOINT_ADDRESS_v0_6;
  const paymasterUrl = getDefaultBundlerUrl(chain);

  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: "pm_sponsorUserOperation",
    params: [hexlifyUserOp(userOp), entrypoint],
  };

  // Ask the paymaster to sign the transaction and return a valid paymasterAndData value.
  const fetchWithHeaders = getClientFetch(client);
  const response = await fetchWithHeaders(paymasterUrl, {
    method: "POST",
    headers,
    body: stringify(body),
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

  if (res.result) {
    // some paymasters return a string, some return an object with more data
    if (typeof res.result === "string") {
      return {
        paymasterAndData: res.result,
      };
    }
    // check for policy errors
    if (res.result.policyId && res.result.reason) {
      console.warn(
        `Paymaster policy rejected this transaction with reason: ${res.result.reason} (policyId: ${res.result.policyId})`,
      );
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
      paymaster: res.result.paymaster,
      paymasterData: res.result.paymasterData,
      paymasterVerificationGasLimit: res.result.paymasterVerificationGasLimit
        ? hexToBigInt(res.result.paymasterVerificationGasLimit)
        : undefined,
      paymasterPostOpGasLimit: res.result.paymasterPostOpGasLimit
        ? hexToBigInt(res.result.paymasterPostOpGasLimit)
        : undefined,
    };
  }
  const error =
    res.error?.message || res.error || response.statusText || "unknown error";
  throw new Error(`Paymaster error from ${paymasterUrl}: ${error}`);
}
