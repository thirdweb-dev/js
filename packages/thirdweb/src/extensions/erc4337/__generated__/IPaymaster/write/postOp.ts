import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "postOp" function.
 */

export type PostOpParams = {
  mode: AbiParameterToPrimitiveType<{ type: "uint8"; name: "mode" }>;
  context: AbiParameterToPrimitiveType<{ type: "bytes"; name: "context" }>;
  actualGasCost: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "actualGasCost";
  }>;
};

export const FN_SELECTOR = "0xa9a23409" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "postOp" function.
 * @param options - The options for the postOp function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodePostOpParams } "thirdweb/extensions/erc4337";
 * const result = encodePostOpParams({
 *  mode: ...,
 *  context: ...,
 *  actualGasCost: ...,
 * });
 * ```
 */
export function encodePostOpParams(options: PostOpParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.mode,
    options.context,
    options.actualGasCost,
  ]);
}

/**
 * Calls the "postOp" function on the contract.
 * @param options - The options for the "postOp" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { postOp } from "thirdweb/extensions/erc4337";
 *
 * const transaction = postOp({
 *  contract,
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
export function postOp(
  options: BaseTransactionOptions<
    | PostOpParams
    | {
        asyncParams: () => Promise<PostOpParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
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
