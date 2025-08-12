import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xcea943ee" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "primarySaleRecipient",
    type: "address",
  },
] as const;

/**
 * Checks if the `getSaleConfig` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getSaleConfig` method is supported.
 * @modules MintableERC1155
 * @example
 * ```ts
 * import { MintableERC1155 } from "thirdweb/modules";
 * const supported = MintableERC1155.isGetSaleConfigSupported(["0x..."]);
 * ```
 */
export function isGetSaleConfigSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getSaleConfig function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @modules MintableERC1155
 * @example
 * ```ts
 * import { MintableERC1155 } from "thirdweb/modules";
 * const result = MintableERC1155.decodeGetSaleConfigResultResult("...");
 * ```
 */
export function decodeGetSaleConfigResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getSaleConfig" function on the contract.
 * @param options - The options for the getSaleConfig function.
 * @returns The parsed result of the function call.
 * @modules MintableERC1155
 * @example
 * ```ts
 * import { MintableERC1155 } from "thirdweb/modules";
 *
 * const result = await MintableERC1155.getSaleConfig({
 *  contract,
 * });
 *
 * ```
 */
export async function getSaleConfig(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
