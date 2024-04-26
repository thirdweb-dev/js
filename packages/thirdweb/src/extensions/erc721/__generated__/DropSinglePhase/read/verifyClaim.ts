import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "verifyClaim" function.
 */
export type VerifyClaimParams = {
  claimer: AbiParameterToPrimitiveType<{
    name: "_claimer";
    type: "address";
    internalType: "address";
  }>;
  quantity: AbiParameterToPrimitiveType<{
    name: "_quantity";
    type: "uint256";
    internalType: "uint256";
  }>;
  currency: AbiParameterToPrimitiveType<{
    name: "_currency";
    type: "address";
    internalType: "address";
  }>;
  pricePerToken: AbiParameterToPrimitiveType<{
    name: "_pricePerToken";
    type: "uint256";
    internalType: "uint256";
  }>;
  allowlistProof: AbiParameterToPrimitiveType<{
    name: "_allowlistProof";
    type: "tuple";
    internalType: "struct IDropSinglePhase.AllowlistProof";
    components: [
      { name: "proof"; type: "bytes32[]"; internalType: "bytes32[]" },
      {
        name: "quantityLimitPerWallet";
        type: "uint256";
        internalType: "uint256";
      },
      { name: "pricePerToken"; type: "uint256"; internalType: "uint256" },
      { name: "currency"; type: "address"; internalType: "address" },
    ];
  }>;
};

export const FN_SELECTOR = "0xeec8897c" as const;
const FN_INPUTS = [
  {
    name: "_claimer",
    type: "address",
    internalType: "address",
  },
  {
    name: "_quantity",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "_currency",
    type: "address",
    internalType: "address",
  },
  {
    name: "_pricePerToken",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "_allowlistProof",
    type: "tuple",
    internalType: "struct IDropSinglePhase.AllowlistProof",
    components: [
      {
        name: "proof",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "quantityLimitPerWallet",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "pricePerToken",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "currency",
        type: "address",
        internalType: "address",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "isOverride",
    type: "bool",
    internalType: "bool",
  },
] as const;

/**
 * Checks if the `verifyClaim` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `verifyClaim` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isVerifyClaimSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isVerifyClaimSupported(contract);
 * ```
 */
export async function isVerifyClaimSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "verifyClaim" function.
 * @param options - The options for the verifyClaim function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeVerifyClaimParams } "thirdweb/extensions/erc721";
 * const result = encodeVerifyClaimParams({
 *  claimer: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 * });
 * ```
 */
export function encodeVerifyClaimParams(options: VerifyClaimParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.claimer,
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
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeVerifyClaim } "thirdweb/extensions/erc721";
 * const result = encodeVerifyClaim({
 *  claimer: ...,
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
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeVerifyClaimResult } from "thirdweb/extensions/erc721";
 * const result = decodeVerifyClaimResult("...");
 * ```
 */
export function decodeVerifyClaimResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "verifyClaim" function on the contract.
 * @param options - The options for the verifyClaim function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { verifyClaim } from "thirdweb/extensions/erc721";
 *
 * const result = await verifyClaim({
 *  claimer: ...,
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
      options.claimer,
      options.quantity,
      options.currency,
      options.pricePerToken,
      options.allowlistProof,
    ],
  });
}
