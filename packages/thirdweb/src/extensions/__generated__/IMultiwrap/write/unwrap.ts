import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "unwrap" function.
 */
export type UnwrapParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  recipient: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "recipient";
    type: "address";
  }>;
};

/**
 * Calls the unwrap function on the contract.
 * @param options - The options for the unwrap function.
 * @returns A prepared transaction object.
 * @extension IMULTIWRAP
 * @example
 * ```
 * import { unwrap } from "thirdweb/extensions/IMultiwrap";
 *
 * const transaction = unwrap({
 *  tokenId: ...,
 *  recipient: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function unwrap(options: BaseTransactionOptions<UnwrapParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x7647691d",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.tokenId, options.recipient],
  });
}
