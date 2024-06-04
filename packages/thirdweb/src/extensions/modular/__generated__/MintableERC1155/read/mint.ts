import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "mint" function.
 */
export type MintParams = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      {
        type: "tuple";
        name: "request";
        components: [
          { type: "uint48"; name: "startTimestamp" },
          { type: "uint48"; name: "endTimestamp" },
          { type: "address"; name: "recipient" },
          { type: "uint256"; name: "quantity" },
          { type: "address"; name: "currency" },
          { type: "uint256"; name: "pricePerUnit" },
          { type: "string"; name: "metadataURI" },
          { type: "bytes32"; name: "uid" },
        ];
      },
      { type: "bytes"; name: "signature" },
      { type: "string"; name: "metadataURI" },
    ];
  }>;
};

export const FN_SELECTOR = "0xee6d6e23" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "params",
    components: [
      {
        type: "tuple",
        name: "request",
        components: [
          {
            type: "uint48",
            name: "startTimestamp",
          },
          {
            type: "uint48",
            name: "endTimestamp",
          },
          {
            type: "address",
            name: "recipient",
          },
          {
            type: "uint256",
            name: "quantity",
          },
          {
            type: "address",
            name: "currency",
          },
          {
            type: "uint256",
            name: "pricePerUnit",
          },
          {
            type: "string",
            name: "metadataURI",
          },
          {
            type: "bytes32",
            name: "uid",
          },
        ],
      },
      {
        type: "bytes",
        name: "signature",
      },
      {
        type: "string",
        name: "metadataURI",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `mint` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `mint` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isMintSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isMintSupported(contract);
 * ```
 */
export async function isMintSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "mint" function.
 * @param options - The options for the mint function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeMintParams } "thirdweb/extensions/modular";
 * const result = encodeMintParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeMintParams(options: MintParams) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Encodes the "mint" function into a Hex string with its parameters.
 * @param options - The options for the mint function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeMint } "thirdweb/extensions/modular";
 * const result = encodeMint({
 *  params: ...,
 * });
 * ```
 */
export function encodeMint(options: MintParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeMintParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Calls the "mint" function on the contract.
 * @param options - The options for the mint function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { mint } from "thirdweb/extensions/modular";
 *
 * const result = await mint({
 *  contract,
 *  params: ...,
 * });
 *
 * ```
 */
export async function mint(options: BaseTransactionOptions<MintParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.params],
  });
}
