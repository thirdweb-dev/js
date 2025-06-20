import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "verifyClaim" function.
 */
export type VerifyClaimParams = {
  conditionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_conditionId";
  }>;
  claimer: AbiParameterToPrimitiveType<{ type: "address"; name: "_claimer" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  pricePerToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_pricePerToken";
  }>;
  allowlistProof: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_allowlistProof";
    components: [
      { type: "bytes32[]"; name: "proof" },
      { type: "uint256"; name: "quantityLimitPerWallet" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "address"; name: "currency" },
    ];
  }>;
};

export const FN_SELECTOR = "0xea1def9c" as const;
const FN_INPUTS = [
  {
    name: "_conditionId",
    type: "uint256",
  },
  {
    name: "_claimer",
    type: "address",
  },
  {
    name: "_tokenId",
    type: "uint256",
  },
  {
    name: "_quantity",
    type: "uint256",
  },
  {
    name: "_currency",
    type: "address",
  },
  {
    name: "_pricePerToken",
    type: "uint256",
  },
  {
    components: [
      {
        name: "proof",
        type: "bytes32[]",
      },
      {
        name: "quantityLimitPerWallet",
        type: "uint256",
      },
      {
        name: "pricePerToken",
        type: "uint256",
      },
      {
        name: "currency",
        type: "address",
      },
    ],
    name: "_allowlistProof",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "isOverride",
    type: "bool",
  },
] as const;

/**
 * Checks if the `verifyClaim` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `verifyClaim` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isVerifyClaimSupported } from "thirdweb/extensions/erc1155";
 * const supported = isVerifyClaimSupported(["0x..."]);
 * ```
 */
export function isVerifyClaimSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "verifyClaim" function.
 * @param options - The options for the verifyClaim function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeVerifyClaimParams } from "thirdweb/extensions/erc1155";
 * const result = encodeVerifyClaimParams({
 *  conditionId: ...,
 *  claimer: ...,
 *  tokenId: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 * });
 * ```
 */
export function encodeVerifyClaimParams(options: VerifyClaimParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.conditionId,
    options.claimer,
    options.tokenId,
    options.quantity,
    options.currency,
    options.pricePerToken,
    options.allowlistProof,
  ]);
}

/**
 * Encodes the "verifyClaim" function into a Hex string with its parameters.
 * @param options - The options for the verifyClaim function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeVerifyClaim } from "thirdweb/extensions/erc1155";
 * const result = encodeVerifyClaim({
 *  conditionId: ...,
 *  claimer: ...,
 *  tokenId: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 * });
 * ```
 */
export function encodeVerifyClaim(options: VerifyClaimParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeVerifyClaimParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the verifyClaim function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeVerifyClaimResult } from "thirdweb/extensions/erc1155";
 * const result = decodeVerifyClaimResultResult("...");
 * ```
 */
export function decodeVerifyClaimResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "verifyClaim" function on the contract.
 * @param options - The options for the verifyClaim function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { verifyClaim } from "thirdweb/extensions/erc1155";
 *
 * const result = await verifyClaim({
 *  contract,
 *  conditionId: ...,
 *  claimer: ...,
 *  tokenId: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 * });
 *
 * ```
 */
export async function verifyClaim(
  options: BaseTransactionOptions<VerifyClaimParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [
      options.conditionId,
      options.claimer,
      options.tokenId,
      options.quantity,
      options.currency,
      options.pricePerToken,
      options.allowlistProof,
    ],
  });
}
