import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "postOp" function.
 */

type PostOpParamsInternal = {
  mode: AbiParameterToPrimitiveType<{ type: "uint8"; name: "mode" }>;
  context: AbiParameterToPrimitiveType<{ type: "bytes"; name: "context" }>;
  actualGasCost: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "actualGasCost";
  }>;
};

export type PostOpParams = Prettify<
  | PostOpParamsInternal
  | {
      asyncParams: () => Promise<PostOpParamsInternal>;
    }
>;
/**
 * Calls the "postOp" function on the contract.
 * @param options - The options for the "postOp" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { postOp } from "thirdweb/extensions/erc4337";
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
          type: "uint8",
          name: "mode",
        },
        {
          type: "bytes",
          name: "context",
        },
        {
          type: "uint256",
          name: "actualGasCost",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.mode,
              resolvedParams.context,
              resolvedParams.actualGasCost,
            ] as const;
          }
        : [options.mode, options.context, options.actualGasCost],
  });
}
