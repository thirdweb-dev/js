import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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

export const FN_SELECTOR = "0xc23dc68f" as const;
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
 * Checks if the `explicitOwnershipOf` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `explicitOwnershipOf` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isExplicitOwnershipOfSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isExplicitOwnershipOfSupported(contract);
 * ```
 */
export async function isExplicitOwnershipOfSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "explicitOwnershipOf" function.
 * @param options - The options for the explicitOwnershipOf function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeExplicitOwnershipOfParams } "thirdweb/extensions/modular";
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
 * Encodes the "explicitOwnershipOf" function into a Hex string with its parameters.
 * @param options - The options for the explicitOwnershipOf function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeExplicitOwnershipOf } "thirdweb/extensions/modular";
 * const result = encodeExplicitOwnershipOf({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeExplicitOwnershipOf(options: ExplicitOwnershipOfParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeExplicitOwnershipOfParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the explicitOwnershipOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeExplicitOwnershipOfResult } from "thirdweb/extensions/modular";
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { explicitOwnershipOf } from "thirdweb/extensions/modular";
 *
 * const result = await explicitOwnershipOf({
 *  contract,
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
