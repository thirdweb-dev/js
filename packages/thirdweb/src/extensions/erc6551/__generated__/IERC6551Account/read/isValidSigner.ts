import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isValidSigner" function.
 */
export type IsValidSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
  context: AbiParameterToPrimitiveType<{ type: "bytes"; name: "context" }>;
};

const METHOD = [
  "0x523e3260",
  [
    {
      type: "address",
      name: "signer",
    },
    {
      type: "bytes",
      name: "context",
    },
  ],
  [
    {
      type: "bytes4",
      name: "magicValue",
    },
  ],
] as const;

/**
 * Calls the "isValidSigner" function on the contract.
 * @param options - The options for the isValidSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC6551
 * @example
 * ```
 * import { isValidSigner } from "thirdweb/extensions/erc6551";
 *
 * const result = await isValidSigner({
 *  signer: ...,
 *  context: ...,
 * });
 *
 * ```
 */
export async function isValidSigner(
  options: BaseTransactionOptions<IsValidSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.signer, options.context],
  });
}
