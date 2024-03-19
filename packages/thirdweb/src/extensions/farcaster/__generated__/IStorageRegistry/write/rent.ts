import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "rent" function.
 */
export type RentParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  units: AbiParameterToPrimitiveType<{ type: "uint256"; name: "units" }>;
};

/**
 * Calls the "rent" function on the contract.
 * @param options - The options for the "rent" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { rent } from "thirdweb/extensions/farcaster";
 *
 * const transaction = rent({
 *  fid: ...,
 *  units: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function rent(options: BaseTransactionOptions<RentParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x783a112b",
      [
        {
          type: "uint256",
          name: "fid",
        },
        {
          type: "uint256",
          name: "units",
        },
      ],
      [
        {
          type: "uint256",
          name: "overpayment",
        },
      ],
    ],
    params: [options.fid, options.units],
  });
}
