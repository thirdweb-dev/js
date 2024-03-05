import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isActiveSigner" function.
 */
export type IsActiveSignerParams = {
  signer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "signer";
    type: "address";
  }>;
};

/**
 * Calls the isActiveSigner function on the contract.
 * @param options - The options for the isActiveSigner function.
 * @returns The parsed result of the function call.
 * @extension IACCOUNTCORE
 * @example
 * ```
 * import { isActiveSigner } from "thirdweb/extensions/IAccountCore";
 *
 * const result = await isActiveSigner({
 *  signer: ...,
 * });
 *
 * ```
 */
export async function isActiveSigner(
  options: BaseTransactionOptions<IsActiveSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x7dff5a79",
      [
        {
          internalType: "address",
          name: "signer",
          type: "address",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.signer],
  });
}
