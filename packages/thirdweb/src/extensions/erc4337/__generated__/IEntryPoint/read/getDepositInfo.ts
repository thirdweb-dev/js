import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getDepositInfo" function.
 */
export type GetDepositInfoParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x5287ce12" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "account",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    name: "info",
    components: [
      {
        type: "uint112",
        name: "deposit",
      },
      {
        type: "bool",
        name: "staked",
      },
      {
        type: "uint112",
        name: "stake",
      },
      {
        type: "uint32",
        name: "unstakeDelaySec",
      },
      {
        type: "uint48",
        name: "withdrawTime",
      },
    ],
  },
] as const;

/**
 * Checks if the `getDepositInfo` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getDepositInfo` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetDepositInfoSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isGetDepositInfoSupported(contract);
 * ```
 */
export async function isGetDepositInfoSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
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
 * import { encodeGetDepositInfoParams } "thirdweb/extensions/erc4337";
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
 * import { encodeGetDepositInfo } "thirdweb/extensions/erc4337";
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
 * const result = decodeGetDepositInfoResult("...");
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
