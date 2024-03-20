import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isValidSignature" function.
 */
export type IsValidSignatureParams = {
  hash: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "hash" }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
};

const METHOD = [
  "0x1626ba7e",
  [
    {
      type: "bytes32",
      name: "hash",
    },
    {
      type: "bytes",
      name: "signature",
    },
  ],
  [
    {
      type: "bytes4",
    },
  ],
] as const;

/**
 * Calls the "isValidSignature" function on the contract.
 * @param options - The options for the isValidSignature function.
 * @returns The parsed result of the function call.
 * @extension ERC1271
 * @example
 * ```
 * import { isValidSignature } from "thirdweb/extensions/erc1271";
 *
 * const result = await isValidSignature({
 *  hash: ...,
 *  signature: ...,
 * });
 *
 * ```
 */
export async function isValidSignature(
  options: BaseTransactionOptions<IsValidSignatureParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.hash, options.signature],
  });
}
