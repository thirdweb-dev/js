import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

const FN_SELECTOR = "0x650fb029" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "info",
    type: "tuple",
    internalType: "struct IHookInfo.HookInfo",
    components: [
      {
        name: "hookFlags",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "hookFallbackFunctions",
        type: "tuple[]",
        internalType: "struct IHookInfo.HookFallbackFunction[]",
        components: [
          {
            name: "functionSelector",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "callType",
            type: "uint8",
            internalType: "enum IHookInfo.CallType",
          },
          {
            name: "permissioned",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
  },
] as const;

/**
 * Decodes the result of the getHookInfo function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeGetHookInfoResult } from "thirdweb/extensions/hooks";
 * const result = decodeGetHookInfoResult("...");
 * ```
 */
export function decodeGetHookInfoResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getHookInfo" function on the contract.
 * @param options - The options for the getHookInfo function.
 * @returns The parsed result of the function call.
 * @extension HOOKS
 * @example
 * ```ts
 * import { getHookInfo } from "thirdweb/extensions/hooks";
 *
 * const result = await getHookInfo();
 *
 * ```
 */
export async function getHookInfo(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
