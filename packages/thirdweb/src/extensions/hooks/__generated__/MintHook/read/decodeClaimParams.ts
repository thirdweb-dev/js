import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "decodeClaimParams" function.
 */
export type DecodeClaimParamsParams = {
  data: AbiParameterToPrimitiveType<{
    name: "_data";
    type: "bytes";
    internalType: "bytes";
  }>;
};

const FN_SELECTOR = "0x3d94bee5" as const;
const FN_INPUTS = [
  {
    name: "_data",
    type: "bytes",
    internalType: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "tuple",
    internalType: "struct MintHook.ClaimParams",
    components: [
      {
        name: "allowlistProof",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "expectedPricePerUnit",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "expectedCurrency",
        type: "address",
        internalType: "address",
      },
    ],
  },
] as const;

/**
 * Encodes the parameters for the "decodeClaimParams" function.
 * @param options - The options for the decodeClaimParams function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeDecodeClaimParamsParams } "thirdweb/extensions/hooks";
 * const result = encodeDecodeClaimParamsParams({
 *  data: ...,
 * });
 * ```
 */
export function encodeDecodeClaimParamsParams(
  options: DecodeClaimParamsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.data]);
}

/**
 * Decodes the result of the decodeClaimParams function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeDecodeClaimParamsResult } from "thirdweb/extensions/hooks";
 * const result = decodeDecodeClaimParamsResult("...");
 * ```
 */
export function decodeDecodeClaimParamsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "decodeClaimParams" function on the contract.
 * @param options - The options for the decodeClaimParams function.
 * @returns The parsed result of the function call.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeClaimParams } from "thirdweb/extensions/hooks";
 *
 * const result = await decodeClaimParams({
 *  data: ...,
 * });
 *
 * ```
 */
export async function decodeClaimParams(
  options: BaseTransactionOptions<DecodeClaimParamsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.data],
  });
}
