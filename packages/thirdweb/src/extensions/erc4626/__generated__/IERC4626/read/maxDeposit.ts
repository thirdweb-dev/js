import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "maxDeposit" function.
 */
export type MaxDepositParams = {
  receiver: AbiParameterToPrimitiveType<{
    name: "receiver";
    type: "address";
    internalType: "address";
  }>;
};

export const FN_SELECTOR = "0x402d267d" as const;
const FN_INPUTS = [
  {
    name: "receiver",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "maxAssets",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `maxDeposit` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `maxDeposit` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isMaxDepositSupported } from "thirdweb/extensions/erc4626";
 *
 * const supported = await isMaxDepositSupported(contract);
 * ```
 */
export async function isMaxDepositSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "maxDeposit" function.
 * @param options - The options for the maxDeposit function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeMaxDepositParams } "thirdweb/extensions/erc4626";
 * const result = encodeMaxDepositParams({
 *  receiver: ...,
 * });
 * ```
 */
export function encodeMaxDepositParams(options: MaxDepositParams) {
  return encodeAbiParameters(FN_INPUTS, [options.receiver]);
}

/**
 * Encodes the "maxDeposit" function into a Hex string with its parameters.
 * @param options - The options for the maxDeposit function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeMaxDeposit } "thirdweb/extensions/erc4626";
 * const result = encodeMaxDeposit({
 *  receiver: ...,
 * });
 * ```
 */
export function encodeMaxDeposit(options: MaxDepositParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeMaxDepositParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the maxDeposit function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodeMaxDepositResult } from "thirdweb/extensions/erc4626";
 * const result = decodeMaxDepositResult("...");
 * ```
 */
export function decodeMaxDepositResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "maxDeposit" function on the contract.
 * @param options - The options for the maxDeposit function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { maxDeposit } from "thirdweb/extensions/erc4626";
 *
 * const result = await maxDeposit({
 *  contract,
 *  receiver: ...,
 * });
 *
 * ```
 */
export async function maxDeposit(
  options: BaseTransactionOptions<MaxDepositParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.receiver],
  });
}
