import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x30a63e11" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "availableSupply",
        type: "uint256",
      },
      {
        name: "allowlistMerkleRoot",
        type: "bytes32",
      },
      {
        name: "pricePerUnit",
        type: "uint256",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "maxMintPerWallet",
        type: "uint256",
      },
      {
        name: "startTimestamp",
        type: "uint48",
      },
      {
        name: "endTimestamp",
        type: "uint48",
      },
      {
        name: "auxData",
        type: "string",
      },
    ],
    name: "claimCondition",
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getClaimCondition` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getClaimCondition` method is supported.
 * @modules ClaimableERC721
 * @example
 * ```ts
 * import { ClaimableERC721 } from "thirdweb/modules";
 * const supported = ClaimableERC721.isGetClaimConditionSupported(["0x..."]);
 * ```
 */
export function isGetClaimConditionSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getClaimCondition function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @modules ClaimableERC721
 * @example
 * ```ts
 * import { ClaimableERC721 } from "thirdweb/modules";
 * const result = ClaimableERC721.decodeGetClaimConditionResultResult("...");
 * ```
 */
export function decodeGetClaimConditionResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getClaimCondition" function on the contract.
 * @param options - The options for the getClaimCondition function.
 * @returns The parsed result of the function call.
 * @modules ClaimableERC721
 * @example
 * ```ts
 * import { ClaimableERC721 } from "thirdweb/modules";
 *
 * const result = await ClaimableERC721.getClaimCondition({
 *  contract,
 * });
 *
 * ```
 */
export async function getClaimCondition(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
