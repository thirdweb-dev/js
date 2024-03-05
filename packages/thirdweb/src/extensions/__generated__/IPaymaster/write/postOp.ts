import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "postOp" function.
 */
export type PostOpParams = {
  mode: AbiParameterToPrimitiveType<{
    internalType: "enum IPaymaster.PostOpMode";
    name: "mode";
    type: "uint8";
  }>;
  context: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "context";
    type: "bytes";
  }>;
  actualGasCost: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "actualGasCost";
    type: "uint256";
  }>;
};

/**
 * Calls the postOp function on the contract.
 * @param options - The options for the postOp function.
 * @returns A prepared transaction object.
 * @extension IPAYMASTER
 * @example
 * ```
 * import { postOp } from "thirdweb/extensions/IPaymaster";
 *
 * const transaction = postOp({
 *  mode: ...,
 *  context: ...,
 *  actualGasCost: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function postOp(options: BaseTransactionOptions<PostOpParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa9a23409",
      [
        {
          internalType: "enum IPaymaster.PostOpMode",
          name: "mode",
          type: "uint8",
        },
        {
          internalType: "bytes",
          name: "context",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "actualGasCost",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.mode, options.context, options.actualGasCost],
  });
}
