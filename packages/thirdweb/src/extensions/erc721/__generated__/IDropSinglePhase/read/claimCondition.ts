import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xd637ed59" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "startTimestamp",
        type: "uint256",
      },
      {
        name: "maxClaimableSupply",
        type: "uint256",
      },
      {
        name: "supplyClaimed",
        type: "uint256",
      },
      {
        name: "quantityLimitPerWallet",
        type: "uint256",
      },
      {
        name: "merkleRoot",
        type: "bytes32",
      },
      {
        name: "pricePerToken",
        type: "uint256",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "metadata",
        type: "string",
      },
    ],
    name: "condition",
    type: "tuple",
  },
] as const;

/**
 * Checks if the `claimCondition` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `claimCondition` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isClaimConditionSupported } from "thirdweb/extensions/erc721";
 * const supported = isClaimConditionSupported(["0x..."]);
 * ```
 */
export function isClaimConditionSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the claimCondition function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeClaimConditionResult } from "thirdweb/extensions/erc721";
 * const result = decodeClaimConditionResultResult("...");
 * ```
 */
export function decodeClaimConditionResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "claimCondition" function on the contract.
 * @param options - The options for the claimCondition function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { claimCondition } from "thirdweb/extensions/erc721";
 *
 * const result = await claimCondition({
 *  contract,
 * });
 *
 * ```
 */
export async function claimCondition(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
