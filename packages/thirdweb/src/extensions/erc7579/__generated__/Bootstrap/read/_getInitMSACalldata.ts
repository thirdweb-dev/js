import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "_getInitMSACalldata" function.
 */
export type _getInitMSACalldataParams = {
  $valdiators: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "$valdiators";
    components: [
      { type: "address"; name: "module" },
      { type: "bytes"; name: "data" },
    ];
  }>;
  $executors: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "$executors";
    components: [
      { type: "address"; name: "module" },
      { type: "bytes"; name: "data" },
    ];
  }>;
  hook: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_hook";
    components: [
      { type: "address"; name: "module" },
      { type: "bytes"; name: "data" },
    ];
  }>;
  fallbacks: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "_fallbacks";
    components: [
      { type: "address"; name: "module" },
      { type: "bytes"; name: "data" },
    ];
  }>;
};

export const FN_SELECTOR = "0x5e87556d" as const;
const FN_INPUTS = [
  {
    type: "tuple[]",
    name: "$valdiators",
    components: [
      {
        type: "address",
        name: "module",
      },
      {
        type: "bytes",
        name: "data",
      },
    ],
  },
  {
    type: "tuple[]",
    name: "$executors",
    components: [
      {
        type: "address",
        name: "module",
      },
      {
        type: "bytes",
        name: "data",
      },
    ],
  },
  {
    type: "tuple",
    name: "_hook",
    components: [
      {
        type: "address",
        name: "module",
      },
      {
        type: "bytes",
        name: "data",
      },
    ],
  },
  {
    type: "tuple[]",
    name: "_fallbacks",
    components: [
      {
        type: "address",
        name: "module",
      },
      {
        type: "bytes",
        name: "data",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes",
    name: "init",
  },
] as const;

/**
 * Checks if the `_getInitMSACalldata` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `_getInitMSACalldata` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { is_getInitMSACalldataSupported } from "thirdweb/extensions/erc7579";
 * const supported = is_getInitMSACalldataSupported(["0x..."]);
 * ```
 */
export function is_getInitMSACalldataSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "_getInitMSACalldata" function.
 * @param options - The options for the _getInitMSACalldata function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encode_getInitMSACalldataParams } from "thirdweb/extensions/erc7579";
 * const result = encode_getInitMSACalldataParams({
 *  $valdiators: ...,
 *  $executors: ...,
 *  hook: ...,
 *  fallbacks: ...,
 * });
 * ```
 */
export function encode_getInitMSACalldataParams(
  options: _getInitMSACalldataParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.$valdiators,
    options.$executors,
    options.hook,
    options.fallbacks,
  ]);
}

/**
 * Encodes the "_getInitMSACalldata" function into a Hex string with its parameters.
 * @param options - The options for the _getInitMSACalldata function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encode_getInitMSACalldata } from "thirdweb/extensions/erc7579";
 * const result = encode_getInitMSACalldata({
 *  $valdiators: ...,
 *  $executors: ...,
 *  hook: ...,
 *  fallbacks: ...,
 * });
 * ```
 */
export function encode_getInitMSACalldata(options: _getInitMSACalldataParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encode_getInitMSACalldataParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the _getInitMSACalldata function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decode_getInitMSACalldataResult } from "thirdweb/extensions/erc7579";
 * const result = decode_getInitMSACalldataResultResult("...");
 * ```
 */
export function decode_getInitMSACalldataResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "_getInitMSACalldata" function on the contract.
 * @param options - The options for the _getInitMSACalldata function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { _getInitMSACalldata } from "thirdweb/extensions/erc7579";
 *
 * const result = await _getInitMSACalldata({
 *  contract,
 *  $valdiators: ...,
 *  $executors: ...,
 *  hook: ...,
 *  fallbacks: ...,
 * });
 *
 * ```
 */
export async function _getInitMSACalldata(
  options: BaseTransactionOptions<_getInitMSACalldataParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [
      options.$valdiators,
      options.$executors,
      options.hook,
      options.fallbacks,
    ],
  });
}
