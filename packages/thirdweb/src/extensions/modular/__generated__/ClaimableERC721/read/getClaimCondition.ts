import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x30a63e11" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "claimCondition",
    type: "tuple",
    internalType: "struct ClaimableERC721.ClaimCondition",
    components: [
      {
        name: "availableSupply",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "allowlistMerkleRoot",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "pricePerUnit",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "currency",
        type: "address",
        internalType: "address",
      },
      {
        name: "startTimestamp",
        type: "uint48",
        internalType: "uint48",
      },
      {
        name: "endTimestamp",
        type: "uint48",
        internalType: "uint48",
      },
      {
        name: "auxData",
        type: "string",
        internalType: "string",
      },
    ],
  },
] as const;

/**
 * Checks if the `getClaimCondition` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getClaimCondition` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetClaimConditionSupported } from "thirdweb/extensions/modular";
 *
 * const supported = isGetClaimConditionSupported(["0x..."]);
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetClaimConditionResult } from "thirdweb/extensions/modular";
 * const result = decodeGetClaimConditionResult("...");
 * ```
 */
export function decodeGetClaimConditionResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getClaimCondition" function on the contract.
 * @param options - The options for the getClaimCondition function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getClaimCondition } from "thirdweb/extensions/modular";
 *
 * const result = await getClaimCondition({
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
