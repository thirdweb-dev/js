import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "transferFor" function.
 */

type TransferForParamsInternal = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
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

export type TransferForParams = Prettify<
  | TransferForParamsInternal
  | {
      asyncParams: () => Promise<TransferForParamsInternal>;
    }
>;
/**
 * Calls the "transferFor" function on the contract.
 * @param options - The options for the "transferFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { transferFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = transferFor({
 *  from: ...,
 *  to: ...,
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
export function transferFor(
  options: BaseTransactionOptions<TransferForParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x16f72842",
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
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.from,
              resolvedParams.to,
              resolvedParams.fromDeadline,
              resolvedParams.fromSig,
              resolvedParams.toDeadline,
              resolvedParams.toSig,
            ] as const;
          }
        : [
            options.from,
            options.to,
            options.fromDeadline,
            options.fromSig,
            options.toDeadline,
            options.toSig,
          ],
  });
}
