import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "registerFor" function.
 */

type RegisterForParamsInternal = {
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
  extraStorage: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "extraStorage";
  }>;
};

export type RegisterForParams = Prettify<
  | RegisterForParamsInternal
  | {
      asyncParams: () => Promise<RegisterForParamsInternal>;
    }
>;
/**
 * Calls the "registerFor" function on the contract.
 * @param options - The options for the "registerFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { registerFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = registerFor({
 *  to: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 *  extraStorage: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function registerFor(
  options: BaseTransactionOptions<RegisterForParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa0c7529c",
      [
        {
          type: "address",
          name: "to",
        },
        {
          type: "address",
          name: "recovery",
        },
        {
          type: "uint256",
          name: "deadline",
        },
        {
          type: "bytes",
          name: "sig",
        },
        {
          type: "uint256",
          name: "extraStorage",
        },
      ],
      [
        {
          type: "uint256",
          name: "fid",
        },
        {
          type: "uint256",
          name: "overpayment",
        },
      ],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.to,
              resolvedParams.recovery,
              resolvedParams.deadline,
              resolvedParams.sig,
              resolvedParams.extraStorage,
            ] as const;
          }
        : [
            options.to,
            options.recovery,
            options.deadline,
            options.sig,
            options.extraStorage,
          ],
  });
}
