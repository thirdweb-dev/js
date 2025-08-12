import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getDepositInfo" function.
 */
export type GetDepositInfoParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x5287ce12" as const;
const FN_INPUTS = [
  {
    name: "account",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "deposit",
        type: "uint112",
      },
      {
        name: "staked",
        type: "bool",
      },
      {
        name: "stake",
        type: "uint112",
      },
      {
        name: "unstakeDelaySec",
        type: "uint32",
      },
      {
        name: "withdrawTime",
        type: "uint48",
      },
    ],
    name: "info",
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getDepositInfo` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getDepositInfo` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetDepositInfoSupported } from "thirdweb/extensions/erc4337";
 * const supported = isGetDepositInfoSupported(["0x..."]);
 * ```
 */
export function isGetDepositInfoSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getDepositInfo" function.
 * @param options - The options for the getDepositInfo function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetDepositInfoParams } from "thirdweb/extensions/erc4337";
 * const result = encodeGetDepositInfoParams({
 *  account: ...,
 * });
 * ```
 */
export function encodeGetDepositInfoParams(options: GetDepositInfoParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account]);
}

/**
 * Encodes the "getDepositInfo" function into a Hex string with its parameters.
 * @param options - The options for the getDepositInfo function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetDepositInfo } from "thirdweb/extensions/erc4337";
 * const result = encodeGetDepositInfo({
 *  account: ...,
 * });
 * ```
 */
export function encodeGetDepositInfo(options: GetDepositInfoParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetDepositInfoParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getDepositInfo function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeGetDepositInfoResult } from "thirdweb/extensions/erc4337";
 * const result = decodeGetDepositInfoResultResult("...");
 * ```
 */
export function decodeGetDepositInfoResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getDepositInfo" function on the contract.
 * @param options - The options for the getDepositInfo function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getDepositInfo } from "thirdweb/extensions/erc4337";
 *
 * const result = await getDepositInfo({
 *  contract,
 *  account: ...,
 * });
 *
 * ```
 */
export async function getDepositInfo(
  options: BaseTransactionOptions<GetDepositInfoParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.account],
  });
}
