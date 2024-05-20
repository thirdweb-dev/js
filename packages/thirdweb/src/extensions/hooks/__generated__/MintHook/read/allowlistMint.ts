import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "allowlistMint" function.
 */
export type AllowlistMintParams = {
  params: AbiParameterToPrimitiveType<{
    name: "_params";
    type: "tuple";
    internalType: "struct MintHook.ClaimParams";
    components: [
      { name: "allowlistProof"; type: "bytes32[]"; internalType: "bytes32[]" },
      {
        name: "expectedPricePerUnit";
        type: "uint256";
        internalType: "uint256";
      },
      { name: "expectedCurrency"; type: "address"; internalType: "address" },
    ];
  }>;
};

const FN_SELECTOR = "0x911e0191" as const;
const FN_INPUTS = [
  {
    name: "_params",
    type: "tuple",
    internalType: "struct MintHook.ClaimParams",
    components: [
      {
        name: "allowlistProof",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "expectedPricePerUnit",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "expectedCurrency",
        type: "address",
        internalType: "address",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "bytes",
    internalType: "bytes",
  },
] as const;

/**
 * Encodes the parameters for the "allowlistMint" function.
 * @param options - The options for the allowlistMint function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeAllowlistMintParams } "thirdweb/extensions/hooks";
 * const result = encodeAllowlistMintParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeAllowlistMintParams(options: AllowlistMintParams) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Decodes the result of the allowlistMint function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeAllowlistMintResult } from "thirdweb/extensions/hooks";
 * const result = decodeAllowlistMintResult("...");
 * ```
 */
export function decodeAllowlistMintResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "allowlistMint" function on the contract.
 * @param options - The options for the allowlistMint function.
 * @returns The parsed result of the function call.
 * @extension HOOKS
 * @example
 * ```ts
 * import { allowlistMint } from "thirdweb/extensions/hooks";
 *
 * const result = await allowlistMint({
 *  params: ...,
 * });
 *
 * ```
 */
export async function allowlistMint(
  options: BaseTransactionOptions<AllowlistMintParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.params],
  });
}
