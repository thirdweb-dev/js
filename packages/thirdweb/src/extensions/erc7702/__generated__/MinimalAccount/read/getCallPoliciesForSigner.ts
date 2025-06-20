import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getCallPoliciesForSigner" function.
 */
export type GetCallPoliciesForSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0x7103acbb" as const;
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
        name: "target",
        type: "address",
      },
      {
        name: "selector",
        type: "bytes4",
      },
      {
        name: "maxValuePerUse",
        type: "uint256",
      },
      {
        components: [
          {
            name: "limitType",
            type: "uint8",
          },
          {
            name: "limit",
            type: "uint256",
          },
          {
            name: "period",
            type: "uint256",
          },
        ],
        name: "valueLimit",
        type: "tuple",
      },
      {
        components: [
          {
            name: "condition",
            type: "uint8",
          },
          {
            name: "index",
            type: "uint64",
          },
          {
            name: "refValue",
            type: "bytes32",
          },
          {
            components: [
              {
                name: "limitType",
                type: "uint8",
              },
              {
                name: "limit",
                type: "uint256",
              },
              {
                name: "period",
                type: "uint256",
              },
            ],
            name: "limit",
            type: "tuple",
          },
        ],
        name: "constraints",
        type: "tuple[]",
      },
    ],
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `getCallPoliciesForSigner` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getCallPoliciesForSigner` method is supported.
 * @extension ERC7702
 * @example
 * ```ts
 * import { isGetCallPoliciesForSignerSupported } from "thirdweb/extensions/erc7702";
 * const supported = isGetCallPoliciesForSignerSupported(["0x..."]);
 * ```
 */
export function isGetCallPoliciesForSignerSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getCallPoliciesForSigner" function.
 * @param options - The options for the getCallPoliciesForSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeGetCallPoliciesForSignerParams } from "thirdweb/extensions/erc7702";
 * const result = encodeGetCallPoliciesForSignerParams({
 *  signer: ...,
 * });
 * ```
 */
export function encodeGetCallPoliciesForSignerParams(
  options: GetCallPoliciesForSignerParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.signer]);
}

/**
 * Encodes the "getCallPoliciesForSigner" function into a Hex string with its parameters.
 * @param options - The options for the getCallPoliciesForSigner function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeGetCallPoliciesForSigner } from "thirdweb/extensions/erc7702";
 * const result = encodeGetCallPoliciesForSigner({
 *  signer: ...,
 * });
 * ```
 */
export function encodeGetCallPoliciesForSigner(
  options: GetCallPoliciesForSignerParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetCallPoliciesForSignerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getCallPoliciesForSigner function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7702
 * @example
 * ```ts
 * import { decodeGetCallPoliciesForSignerResult } from "thirdweb/extensions/erc7702";
 * const result = decodeGetCallPoliciesForSignerResultResult("...");
 * ```
 */
export function decodeGetCallPoliciesForSignerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getCallPoliciesForSigner" function on the contract.
 * @param options - The options for the getCallPoliciesForSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC7702
 * @example
 * ```ts
 * import { getCallPoliciesForSigner } from "thirdweb/extensions/erc7702";
 *
 * const result = await getCallPoliciesForSigner({
 *  contract,
 *  signer: ...,
 * });
 *
 * ```
 */
export async function getCallPoliciesForSigner(
  options: BaseTransactionOptions<GetCallPoliciesForSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer],
  });
}
