import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "predictAssetAddressByConfig" function.
 */
export type PredictAssetAddressByConfigParams = {
  config: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "config";
    components: [
      { type: "bytes32"; name: "contractId" },
      { type: "address"; name: "implementation" },
      { type: "uint8"; name: "implementationType" },
      { type: "uint8"; name: "createHook" },
      { type: "bytes"; name: "createHookData" },
    ];
  }>;
  creator: AbiParameterToPrimitiveType<{ type: "address"; name: "creator" }>;
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "uint256"; name: "amount" },
      { type: "address"; name: "referrer" },
      { type: "bytes32"; name: "salt" },
      { type: "bytes"; name: "data" },
      { type: "bytes"; name: "hookData" },
    ];
  }>;
};

export const FN_SELECTOR = "0x3e49076d" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "config",
    components: [
      {
        type: "bytes32",
        name: "contractId",
      },
      {
        type: "address",
        name: "implementation",
      },
      {
        type: "uint8",
        name: "implementationType",
      },
      {
        type: "uint8",
        name: "createHook",
      },
      {
        type: "bytes",
        name: "createHookData",
      },
    ],
  },
  {
    type: "address",
    name: "creator",
  },
  {
    type: "tuple",
    name: "params",
    components: [
      {
        type: "uint256",
        name: "amount",
      },
      {
        type: "address",
        name: "referrer",
      },
      {
        type: "bytes32",
        name: "salt",
      },
      {
        type: "bytes",
        name: "data",
      },
      {
        type: "bytes",
        name: "hookData",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "predicted",
  },
] as const;

/**
 * Checks if the `predictAssetAddressByConfig` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `predictAssetAddressByConfig` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isPredictAssetAddressByConfigSupported } from "thirdweb/extensions/assets";
 * const supported = isPredictAssetAddressByConfigSupported(["0x..."]);
 * ```
 */
export function isPredictAssetAddressByConfigSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "predictAssetAddressByConfig" function.
 * @param options - The options for the predictAssetAddressByConfig function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodePredictAssetAddressByConfigParams } from "thirdweb/extensions/assets";
 * const result = encodePredictAssetAddressByConfigParams({
 *  config: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodePredictAssetAddressByConfigParams(
  options: PredictAssetAddressByConfigParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.config,
    options.creator,
    options.params,
  ]);
}

/**
 * Encodes the "predictAssetAddressByConfig" function into a Hex string with its parameters.
 * @param options - The options for the predictAssetAddressByConfig function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodePredictAssetAddressByConfig } from "thirdweb/extensions/assets";
 * const result = encodePredictAssetAddressByConfig({
 *  config: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodePredictAssetAddressByConfig(
  options: PredictAssetAddressByConfigParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePredictAssetAddressByConfigParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the predictAssetAddressByConfig function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ASSETS
 * @example
 * ```ts
 * import { decodePredictAssetAddressByConfigResult } from "thirdweb/extensions/assets";
 * const result = decodePredictAssetAddressByConfigResultResult("...");
 * ```
 */
export function decodePredictAssetAddressByConfigResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "predictAssetAddressByConfig" function on the contract.
 * @param options - The options for the predictAssetAddressByConfig function.
 * @returns The parsed result of the function call.
 * @extension ASSETS
 * @example
 * ```ts
 * import { predictAssetAddressByConfig } from "thirdweb/extensions/assets";
 *
 * const result = await predictAssetAddressByConfig({
 *  contract,
 *  config: ...,
 *  creator: ...,
 *  params: ...,
 * });
 *
 * ```
 */
export async function predictAssetAddressByConfig(
  options: BaseTransactionOptions<PredictAssetAddressByConfigParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.config, options.creator, options.params],
  });
}
