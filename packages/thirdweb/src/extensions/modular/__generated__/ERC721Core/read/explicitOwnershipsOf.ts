import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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

export const FN_SELECTOR = "0x5bbb2177" as const;
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
 * Checks if the `explicitOwnershipsOf` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `explicitOwnershipsOf` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isExplicitOwnershipsOfSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isExplicitOwnershipsOfSupported(contract);
 * ```
 */
export async function isExplicitOwnershipsOfSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "explicitOwnershipsOf" function.
 * @param options - The options for the explicitOwnershipsOf function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeExplicitOwnershipsOfParams } "thirdweb/extensions/modular";
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
 * Encodes the "explicitOwnershipsOf" function into a Hex string with its parameters.
 * @param options - The options for the explicitOwnershipsOf function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeExplicitOwnershipsOf } "thirdweb/extensions/modular";
 * const result = encodeExplicitOwnershipsOf({
 *  tokenIds: ...,
 * });
 * ```
 */
export function encodeExplicitOwnershipsOf(
  options: ExplicitOwnershipsOfParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeExplicitOwnershipsOfParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the explicitOwnershipsOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeExplicitOwnershipsOfResult } from "thirdweb/extensions/modular";
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { explicitOwnershipsOf } from "thirdweb/extensions/modular";
 *
 * const result = await explicitOwnershipsOf({
 *  contract,
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
