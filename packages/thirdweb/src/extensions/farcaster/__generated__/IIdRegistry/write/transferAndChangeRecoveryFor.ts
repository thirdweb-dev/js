import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "transferAndChangeRecoveryFor" function.
 */

type TransferAndChangeRecoveryForParamsInternal = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
  fromDeadline: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "fromDeadline";
  }>;
  fromSig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "fromSig" }>;
  toDeadline: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "toDeadline";
  }>;
  toSig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "toSig" }>;
};

export type TransferAndChangeRecoveryForParams = Prettify<
  | TransferAndChangeRecoveryForParamsInternal
  | {
      asyncParams: () => Promise<TransferAndChangeRecoveryForParamsInternal>;
    }
>;
/**
 * Calls the "transferAndChangeRecoveryFor" function on the contract.
 * @param options - The options for the "transferAndChangeRecoveryFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { transferAndChangeRecoveryFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = transferAndChangeRecoveryFor({
 *  from: ...,
 *  to: ...,
 *  recovery: ...,
 *  fromDeadline: ...,
 *  fromSig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferAndChangeRecoveryFor(
  options: BaseTransactionOptions<TransferAndChangeRecoveryForParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x4c5cbb34",
      [
        {
          type: "address",
          name: "from",
        },
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
          name: "fromDeadline",
        },
        {
          type: "bytes",
          name: "fromSig",
        },
        {
          type: "uint256",
          name: "toDeadline",
        },
        {
          type: "bytes",
          name: "toSig",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.from,
          resolvedParams.to,
          resolvedParams.recovery,
          resolvedParams.fromDeadline,
          resolvedParams.fromSig,
          resolvedParams.toDeadline,
          resolvedParams.toSig,
        ] as const;
      }

      return [
        options.from,
        options.to,
        options.recovery,
        options.fromDeadline,
        options.fromSig,
        options.toDeadline,
        options.toSig,
      ] as const;
    },
  });
}
