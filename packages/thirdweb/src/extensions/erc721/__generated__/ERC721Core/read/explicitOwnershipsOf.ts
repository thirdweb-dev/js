import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "explicitOwnershipsOf" function.
 */
export type ExplicitOwnershipsOfParams = {
  tokenIds: AbiParameterToPrimitiveType<{
    name: "tokenIds";
    type: "uint256[]";
    internalType: "uint256[]";
  }>;
};

const FN_SELECTOR = "0x5bbb2177" as const;
const FN_INPUTS = [
  {
    name: "tokenIds",
    type: "uint256[]",
    internalType: "uint256[]",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "tuple[]",
    internalType: "struct IERC721A.TokenOwnership[]",
    components: [
      {
        name: "addr",
        type: "address",
        internalType: "address",
      },
      {
        name: "startTimestamp",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "burned",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "extraData",
        type: "uint24",
        internalType: "uint24",
      },
    ],
  },
] as const;

/**
 * Encodes the parameters for the "explicitOwnershipsOf" function.
 * @param options - The options for the explicitOwnershipsOf function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeExplicitOwnershipsOfParams } "thirdweb/extensions/erc721";
 * const result = encodeExplicitOwnershipsOfParams({
 *  tokenIds: ...,
 * });
 * ```
 */
export function encodeExplicitOwnershipsOfParams(
  options: ExplicitOwnershipsOfParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenIds]);
}

/**
 * Decodes the result of the explicitOwnershipsOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeExplicitOwnershipsOfResult } from "thirdweb/extensions/erc721";
 * const result = decodeExplicitOwnershipsOfResult("...");
 * ```
 */
export function decodeExplicitOwnershipsOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "explicitOwnershipsOf" function on the contract.
 * @param options - The options for the explicitOwnershipsOf function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { explicitOwnershipsOf } from "thirdweb/extensions/erc721";
 *
 * const result = await explicitOwnershipsOf({
 *  tokenIds: ...,
 * });
 *
 * ```
 */
export async function explicitOwnershipsOf(
  options: BaseTransactionOptions<ExplicitOwnershipsOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenIds],
  });
}
