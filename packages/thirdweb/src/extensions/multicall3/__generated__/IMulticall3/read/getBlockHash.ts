import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getBlockHash" function.
 */
export type GetBlockHashParams = {
  blockNumber: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "blockNumber";
    type: "uint256";
  }>;
};

export const FN_SELECTOR = "0xee82ac5e" as const;
const FN_INPUTS = [
  {
    internalType: "uint256",
    name: "blockNumber",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    internalType: "bytes32",
    name: "blockHash",
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `getBlockHash` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getBlockHash` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isGetBlockHashSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isGetBlockHashSupported(contract);
 * ```
 */
export async function isGetBlockHashSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getBlockHash" function.
 * @param options - The options for the getBlockHash function.
 * @returns The encoded ABI parameters.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeGetBlockHashParams } "thirdweb/extensions/multicall3";
 * const result = encodeGetBlockHashParams({
 *  blockNumber: ...,
 * });
 * ```
 */
export function encodeGetBlockHashParams(options: GetBlockHashParams) {
  return encodeAbiParameters(FN_INPUTS, [options.blockNumber]);
}

/**
 * Encodes the "getBlockHash" function into a Hex string with its parameters.
 * @param options - The options for the getBlockHash function.
 * @returns The encoded hexadecimal string.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeGetBlockHash } "thirdweb/extensions/multicall3";
 * const result = encodeGetBlockHash({
 *  blockNumber: ...,
 * });
 * ```
 */
export function encodeGetBlockHash(options: GetBlockHashParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetBlockHashParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getBlockHash function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { decodeGetBlockHashResult } from "thirdweb/extensions/multicall3";
 * const result = decodeGetBlockHashResult("...");
 * ```
 */
export function decodeGetBlockHashResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getBlockHash" function on the contract.
 * @param options - The options for the getBlockHash function.
 * @returns The parsed result of the function call.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { getBlockHash } from "thirdweb/extensions/multicall3";
 *
 * const result = await getBlockHash({
 *  contract,
 *  blockNumber: ...,
 * });
 *
 * ```
 */
export async function getBlockHash(
  options: BaseTransactionOptions<GetBlockHashParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.blockNumber],
  });
}
