import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getHookFallbackFunctionCall" function.
 */
export type GetHookFallbackFunctionCallParams = {
  selector: AbiParameterToPrimitiveType<{
    name: "_selector";
    type: "bytes4";
    internalType: "bytes4";
  }>;
};

const FN_SELECTOR = "0x45e56ce0" as const;
const FN_INPUTS = [
  {
    name: "_selector",
    type: "bytes4",
    internalType: "bytes4",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "tuple",
    internalType: "struct IHookInstaller.HookFallbackFunctionCall",
    components: [
      {
        name: "target",
        type: "address",
        internalType: "address",
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
] as const;

/**
 * Encodes the parameters for the "getHookFallbackFunctionCall" function.
 * @param options - The options for the getHookFallbackFunctionCall function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeGetHookFallbackFunctionCallParams } "thirdweb/extensions/erc721";
 * const result = encodeGetHookFallbackFunctionCallParams({
 *  selector: ...,
 * });
 * ```
 */
export function encodeGetHookFallbackFunctionCallParams(
  options: GetHookFallbackFunctionCallParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.selector]);
}

/**
 * Decodes the result of the getHookFallbackFunctionCall function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeGetHookFallbackFunctionCallResult } from "thirdweb/extensions/erc721";
 * const result = decodeGetHookFallbackFunctionCallResult("...");
 * ```
 */
export function decodeGetHookFallbackFunctionCallResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getHookFallbackFunctionCall" function on the contract.
 * @param options - The options for the getHookFallbackFunctionCall function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { getHookFallbackFunctionCall } from "thirdweb/extensions/erc721";
 *
 * const result = await getHookFallbackFunctionCall({
 *  selector: ...,
 * });
 *
 * ```
 */
export async function getHookFallbackFunctionCall(
  options: BaseTransactionOptions<GetHookFallbackFunctionCallParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.selector],
  });
}
