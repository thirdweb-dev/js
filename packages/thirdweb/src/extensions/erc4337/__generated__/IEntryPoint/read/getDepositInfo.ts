import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
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
