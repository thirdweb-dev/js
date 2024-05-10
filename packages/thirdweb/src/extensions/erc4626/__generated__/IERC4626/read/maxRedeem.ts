import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "maxRedeem" function.
 */
export type MaxRedeemParams = {
  owner: AbiParameterToPrimitiveType<{
    name: "owner";
    type: "address";
    internalType: "address";
  }>;
};

export const FN_SELECTOR = "0xd905777e" as const;
const FN_INPUTS = [
  {
    name: "owner",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "maxShares",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `maxRedeem` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `maxRedeem` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isMaxRedeemSupported } from "thirdweb/extensions/erc4626";
 *
 * const supported = await isMaxRedeemSupported(contract);
 * ```
 */
export async function isMaxRedeemSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "maxRedeem" function.
 * @param options - The options for the maxRedeem function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeMaxRedeemParams } "thirdweb/extensions/erc4626";
 * const result = encodeMaxRedeemParams({
 *  owner: ...,
 * });
 * ```
 */
export function encodeMaxRedeemParams(options: MaxRedeemParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owner]);
}

/**
 * Encodes the "maxRedeem" function into a Hex string with its parameters.
 * @param options - The options for the maxRedeem function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeMaxRedeem } "thirdweb/extensions/erc4626";
 * const result = encodeMaxRedeem({
 *  owner: ...,
 * });
 * ```
 */
export function encodeMaxRedeem(options: MaxRedeemParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeMaxRedeemParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the maxRedeem function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodeMaxRedeemResult } from "thirdweb/extensions/erc4626";
 * const result = decodeMaxRedeemResult("...");
 * ```
 */
export function decodeMaxRedeemResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "maxRedeem" function on the contract.
 * @param options - The options for the maxRedeem function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { maxRedeem } from "thirdweb/extensions/erc4626";
 *
 * const result = await maxRedeem({
 *  contract,
 *  owner: ...,
 * });
 *
 * ```
 */
export async function maxRedeem(
  options: BaseTransactionOptions<MaxRedeemParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner],
  });
}
