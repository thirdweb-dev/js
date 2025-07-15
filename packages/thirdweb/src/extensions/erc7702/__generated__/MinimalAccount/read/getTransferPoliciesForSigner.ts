import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getTransferPoliciesForSigner" function.
 */
export type GetTransferPoliciesForSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0xed6ed279" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "signer",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    components: [
      {
        type: "address",
        name: "target",
      },
      {
        type: "uint256",
        name: "maxValuePerUse",
      },
      {
        type: "tuple",
        name: "valueLimit",
        components: [
          {
            type: "uint8",
            name: "limitType",
          },
          {
            type: "uint256",
            name: "limit",
          },
          {
            type: "uint256",
            name: "period",
          },
        ],
      },
    ],
  },
] as const;

/**
 * Checks if the `getTransferPoliciesForSigner` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getTransferPoliciesForSigner` method is supported.
 * @extension ERC7702
 * @example
 * ```ts
 * import { isGetTransferPoliciesForSignerSupported } from "thirdweb/extensions/erc7702";
 * const supported = isGetTransferPoliciesForSignerSupported(["0x..."]);
 * ```
 */
export function isGetTransferPoliciesForSignerSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getTransferPoliciesForSigner" function.
 * @param options - The options for the getTransferPoliciesForSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeGetTransferPoliciesForSignerParams } from "thirdweb/extensions/erc7702";
 * const result = encodeGetTransferPoliciesForSignerParams({
 *  signer: ...,
 * });
 * ```
 */
export function encodeGetTransferPoliciesForSignerParams(
  options: GetTransferPoliciesForSignerParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.signer]);
}

/**
 * Encodes the "getTransferPoliciesForSigner" function into a Hex string with its parameters.
 * @param options - The options for the getTransferPoliciesForSigner function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeGetTransferPoliciesForSigner } from "thirdweb/extensions/erc7702";
 * const result = encodeGetTransferPoliciesForSigner({
 *  signer: ...,
 * });
 * ```
 */
export function encodeGetTransferPoliciesForSigner(
  options: GetTransferPoliciesForSignerParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetTransferPoliciesForSignerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getTransferPoliciesForSigner function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7702
 * @example
 * ```ts
 * import { decodeGetTransferPoliciesForSignerResult } from "thirdweb/extensions/erc7702";
 * const result = decodeGetTransferPoliciesForSignerResultResult("...");
 * ```
 */
export function decodeGetTransferPoliciesForSignerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getTransferPoliciesForSigner" function on the contract.
 * @param options - The options for the getTransferPoliciesForSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC7702
 * @example
 * ```ts
 * import { getTransferPoliciesForSigner } from "thirdweb/extensions/erc7702";
 *
 * const result = await getTransferPoliciesForSigner({
 *  contract,
 *  signer: ...,
 * });
 *
 * ```
 */
export async function getTransferPoliciesForSigner(
  options: BaseTransactionOptions<GetTransferPoliciesForSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer],
  });
}
