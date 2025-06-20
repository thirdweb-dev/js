import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getSessionStateForSigner" function.
 */
export type GetSessionStateForSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0x74e25eb2" as const;
const FN_INPUTS = [
  {
    name: "signer",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        components: [
          {
            name: "remaining",
            type: "uint256",
          },
          {
            name: "target",
            type: "address",
          },
          {
            name: "selector",
            type: "bytes4",
          },
          {
            name: "index",
            type: "uint256",
          },
        ],
        name: "transferValue",
        type: "tuple[]",
      },
      {
        components: [
          {
            name: "remaining",
            type: "uint256",
          },
          {
            name: "target",
            type: "address",
          },
          {
            name: "selector",
            type: "bytes4",
          },
          {
            name: "index",
            type: "uint256",
          },
        ],
        name: "callValue",
        type: "tuple[]",
      },
      {
        components: [
          {
            name: "remaining",
            type: "uint256",
          },
          {
            name: "target",
            type: "address",
          },
          {
            name: "selector",
            type: "bytes4",
          },
          {
            name: "index",
            type: "uint256",
          },
        ],
        name: "callParams",
        type: "tuple[]",
      },
    ],
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getSessionStateForSigner` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getSessionStateForSigner` method is supported.
 * @extension ERC7702
 * @example
 * ```ts
 * import { isGetSessionStateForSignerSupported } from "thirdweb/extensions/erc7702";
 * const supported = isGetSessionStateForSignerSupported(["0x..."]);
 * ```
 */
export function isGetSessionStateForSignerSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getSessionStateForSigner" function.
 * @param options - The options for the getSessionStateForSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeGetSessionStateForSignerParams } from "thirdweb/extensions/erc7702";
 * const result = encodeGetSessionStateForSignerParams({
 *  signer: ...,
 * });
 * ```
 */
export function encodeGetSessionStateForSignerParams(
  options: GetSessionStateForSignerParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.signer]);
}

/**
 * Encodes the "getSessionStateForSigner" function into a Hex string with its parameters.
 * @param options - The options for the getSessionStateForSigner function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeGetSessionStateForSigner } from "thirdweb/extensions/erc7702";
 * const result = encodeGetSessionStateForSigner({
 *  signer: ...,
 * });
 * ```
 */
export function encodeGetSessionStateForSigner(
  options: GetSessionStateForSignerParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetSessionStateForSignerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getSessionStateForSigner function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7702
 * @example
 * ```ts
 * import { decodeGetSessionStateForSignerResult } from "thirdweb/extensions/erc7702";
 * const result = decodeGetSessionStateForSignerResultResult("...");
 * ```
 */
export function decodeGetSessionStateForSignerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getSessionStateForSigner" function on the contract.
 * @param options - The options for the getSessionStateForSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC7702
 * @example
 * ```ts
 * import { getSessionStateForSigner } from "thirdweb/extensions/erc7702";
 *
 * const result = await getSessionStateForSigner({
 *  contract,
 *  signer: ...,
 * });
 *
 * ```
 */
export async function getSessionStateForSigner(
  options: BaseTransactionOptions<GetSessionStateForSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer],
  });
}
