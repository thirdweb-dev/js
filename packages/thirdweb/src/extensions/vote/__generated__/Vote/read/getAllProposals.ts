import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xcceb68f5" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "proposalId",
        type: "uint256",
      },
      {
        name: "proposer",
        type: "address",
      },
      {
        name: "targets",
        type: "address[]",
      },
      {
        name: "values",
        type: "uint256[]",
      },
      {
        name: "signatures",
        type: "string[]",
      },
      {
        name: "calldatas",
        type: "bytes[]",
      },
      {
        name: "startBlock",
        type: "uint256",
      },
      {
        name: "endBlock",
        type: "uint256",
      },
      {
        name: "description",
        type: "string",
      },
    ],
    name: "allProposals",
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `getAllProposals` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAllProposals` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isGetAllProposalsSupported } from "thirdweb/extensions/vote";
 * const supported = isGetAllProposalsSupported(["0x..."]);
 * ```
 */
export function isGetAllProposalsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getAllProposals function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeGetAllProposalsResult } from "thirdweb/extensions/vote";
 * const result = decodeGetAllProposalsResultResult("...");
 * ```
 */
export function decodeGetAllProposalsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllProposals" function on the contract.
 * @param options - The options for the getAllProposals function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { getAllProposals } from "thirdweb/extensions/vote";
 *
 * const result = await getAllProposals({
 *  contract,
 * });
 *
 * ```
 */
export async function getAllProposals(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
