import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

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
const FN_SELECTOR = "0x3ab8465d" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "transferAndChangeRecovery" function.
 * @param options - The options for the transferAndChangeRecovery function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```
 * import { encodeTransferAndChangeRecoveryParams } "thirdweb/extensions/farcaster";
 * const result = encodeTransferAndChangeRecoveryParams({
 *  to: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeTransferAndChangeRecoveryParams(
  options: TransferAndChangeRecoveryParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.recovery,
    options.deadline,
    options.sig,
  ]);
}

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
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
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
