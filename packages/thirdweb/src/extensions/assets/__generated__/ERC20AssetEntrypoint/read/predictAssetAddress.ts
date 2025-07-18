import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "predictAssetAddress" function.
 */
export type PredictAssetAddressParams = {
  contractId: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "contractId";
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

export const FN_SELECTOR = "0x8fc23f92" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "contractId",
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
 * Checks if the `predictAssetAddress` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `predictAssetAddress` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isPredictAssetAddressSupported } from "thirdweb/extensions/assets";
 * const supported = isPredictAssetAddressSupported(["0x..."]);
 * ```
 */
export function isPredictAssetAddressSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "predictAssetAddress" function.
 * @param options - The options for the predictAssetAddress function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodePredictAssetAddressParams } from "thirdweb/extensions/assets";
 * const result = encodePredictAssetAddressParams({
 *  contractId: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodePredictAssetAddressParams(
  options: PredictAssetAddressParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.contractId,
    options.creator,
    options.params,
  ]);
}

/**
 * Encodes the "predictAssetAddress" function into a Hex string with its parameters.
 * @param options - The options for the predictAssetAddress function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodePredictAssetAddress } from "thirdweb/extensions/assets";
 * const result = encodePredictAssetAddress({
 *  contractId: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodePredictAssetAddress(options: PredictAssetAddressParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePredictAssetAddressParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the predictAssetAddress function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ASSETS
 * @example
 * ```ts
 * import { decodePredictAssetAddressResult } from "thirdweb/extensions/assets";
 * const result = decodePredictAssetAddressResultResult("...");
 * ```
 */
export function decodePredictAssetAddressResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "predictAssetAddress" function on the contract.
 * @param options - The options for the predictAssetAddress function.
 * @returns The parsed result of the function call.
 * @extension ASSETS
 * @example
 * ```ts
 * import { predictAssetAddress } from "thirdweb/extensions/assets";
 *
 * const result = await predictAssetAddress({
 *  contract,
 *  contractId: ...,
 *  creator: ...,
 *  params: ...,
 * });
 *
 * ```
 */
export async function predictAssetAddress(
  options: BaseTransactionOptions<PredictAssetAddressParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.contractId, options.creator, options.params],
  });
}
