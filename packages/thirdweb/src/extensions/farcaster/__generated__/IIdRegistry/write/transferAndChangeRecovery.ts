import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "transferAndChangeRecovery" function.
 */

type TransferAndChangeRecoveryParamsInternal = {
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
};

export type TransferAndChangeRecoveryParams = Prettify<
  | TransferAndChangeRecoveryParamsInternal
  | {
      asyncParams: () => Promise<TransferAndChangeRecoveryParamsInternal>;
    }
>;
/**
 * Calls the "transferAndChangeRecovery" function on the contract.
 * @param options - The options for the "transferAndChangeRecovery" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { transferAndChangeRecovery } from "thirdweb/extensions/farcaster";
 *
 * const transaction = transferAndChangeRecovery({
 *  to: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferAndChangeRecovery(
  options: BaseTransactionOptions<TransferAndChangeRecoveryParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x3ab8465d",
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
      ],
      [],
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
            ] as const;
          }
        : [options.to, options.recovery, options.deadline, options.sig],
  });
}
