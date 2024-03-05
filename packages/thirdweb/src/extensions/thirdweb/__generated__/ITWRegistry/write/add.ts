import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "add" function.
 */
export type AddParams = {
  deployer: AbiParameterToPrimitiveType<{ type: "address"; name: "_deployer" }>;
  deployment: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_deployment";
  }>;
  chainId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_chainId" }>;
};

/**
 * Calls the "add" function on the contract.
 * @param options - The options for the "add" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { add } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = add({
 *  deployer: ...,
 *  deployment: ...,
 *  chainId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function add(options: BaseTransactionOptions<AddParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x551f8e2a",
      [
        {
          type: "address",
          name: "_deployer",
        },
        {
          type: "address",
          name: "_deployment",
        },
        {
          type: "uint256",
          name: "_chainId",
        },
      ],
      [],
    ],
    params: [options.deployer, options.deployment, options.chainId],
  });
}
