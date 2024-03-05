import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isValidSigner" function.
 */
export type IsValidSignerParams = {
  signer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "signer";
    type: "address";
  }>;
  context: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "context";
    type: "bytes";
  }>;
};

/**
 * Calls the isValidSigner function on the contract.
 * @param options - The options for the isValidSigner function.
 * @returns The parsed result of the function call.
 * @extension IERC6551ACCOUNT
 * @example
 * ```
 * import { isValidSigner } from "thirdweb/extensions/IERC6551Account";
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
    method: [
      "0x523e3260",
      [
        {
          internalType: "address",
          name: "signer",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "context",
          type: "bytes",
        },
      ],
      [
        {
          internalType: "bytes4",
          name: "magicValue",
          type: "bytes4",
        },
      ],
    ],
    params: [options.signer, options.context],
  });
}
