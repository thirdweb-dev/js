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
    id: 1,
    jsonrpc: "2.0",
    method: "pm_sponsorUserOperation",
    params: [hexlifyUserOp(userOp), entrypoint],
  };

  // Ask the paymaster to sign the transaction and return a valid paymasterAndData value.
  const fetchWithHeaders = getClientFetch(client);
  const response = await fetchWithHeaders(paymasterUrl, {
    body: stringify(body),
    headers,
    method: "POST",
  });

  if (!response.ok) {
    const error = (await response.text()) || response.statusText;

    throw new Error(`Paymaster error: ${response.status} - ${error}`);
  }

  const res = await response.json();

  if (res.result) {
    // some paymasters return a string, some return an object with more data
    if (typeof res.result === "string") {
      return {
        paymasterAndData: res.result,
      };
    }
    // check for policy errors
    if (res.result.reason) {
      console.warn(
        `Paymaster policy rejected this transaction with reason: ${res.result.reason} ${res.result.policyId ? `(policyId: ${res.result.policyId})` : ""}`,
      );
    }

    return {
      callGasLimit: res.result.callGasLimit
        ? hexToBigInt(res.result.callGasLimit)
        : undefined,
      paymaster: res.result.paymaster,
      paymasterAndData: res.result.paymasterAndData,
      paymasterData: res.result.paymasterData,
      paymasterPostOpGasLimit: res.result.paymasterPostOpGasLimit
        ? hexToBigInt(res.result.paymasterPostOpGasLimit)
        : undefined,
      paymasterVerificationGasLimit: res.result.paymasterVerificationGasLimit
        ? hexToBigInt(res.result.paymasterVerificationGasLimit)
        : undefined,
      preVerificationGas: res.result.preVerificationGas
        ? hexToBigInt(res.result.preVerificationGas)
        : undefined,
      verificationGasLimit: res.result.verificationGasLimit
        ? hexToBigInt(res.result.verificationGasLimit)
        : undefined,
    };
  }
  const error =
    res.error?.message || res.error || response.statusText || "unknown error";
  throw new Error(`Paymaster error from ${paymasterUrl}: ${error}`);
}
