import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "mintTo" function.
 */
export type MintToParams = {
  to: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "to";
    type: "address";
  }>;
  uri: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "uri";
    type: "string";
  }>;
};

/**
 * Calls the mintTo function on the contract.
 * @param options - The options for the mintTo function.
 * @returns A prepared transaction object.
 * @extension ILOYALTYCARD
 * @example
 * ```
 * import { mintTo } from "thirdweb/extensions/ILoyaltyCard";
 *
 * const transaction = mintTo({
 *  to: ...,
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mintTo(options: BaseTransactionOptions<MintToParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x0075a317",
      [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "string",
          name: "uri",
          type: "string",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.to, options.uri],
  });
}
