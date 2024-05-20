import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "explicitOwnershipOf" function.
 */
export type ExplicitOwnershipOfParams = {
  tokenId: AbiParameterToPrimitiveType<{
    name: "tokenId";
    type: "uint256";
    internalType: "uint256";
  }>;
};

const FN_SELECTOR = "0xc23dc68f" as const;
const FN_INPUTS = [
  {
    name: "tokenId",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "ownership",
    type: "tuple",
    internalType: "struct IERC721A.TokenOwnership",
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
 * Encodes the parameters for the "explicitOwnershipOf" function.
 * @param options - The options for the explicitOwnershipOf function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeExplicitOwnershipOfParams } "thirdweb/extensions/erc721";
 * const result = encodeExplicitOwnershipOfParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeExplicitOwnershipOfParams(
  options: ExplicitOwnershipOfParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Decodes the result of the explicitOwnershipOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeExplicitOwnershipOfResult } from "thirdweb/extensions/erc721";
 * const result = decodeExplicitOwnershipOfResult("...");
 * ```
 */
export function decodeExplicitOwnershipOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "explicitOwnershipOf" function on the contract.
 * @param options - The options for the explicitOwnershipOf function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { explicitOwnershipOf } from "thirdweb/extensions/erc721";
 *
 * const result = await explicitOwnershipOf({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function explicitOwnershipOf(
  options: BaseTransactionOptions<ExplicitOwnershipOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
