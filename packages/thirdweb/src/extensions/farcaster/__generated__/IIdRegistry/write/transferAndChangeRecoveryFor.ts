import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "transferAndChangeRecoveryFor" function.
 */

export type TransferAndChangeRecoveryForParams = {
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

export const FN_SELECTOR = "0x4c5cbb34" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "transferAndChangeRecoveryFor" function.
 * @param options - The options for the transferAndChangeRecoveryFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeTransferAndChangeRecoveryForParams } "thirdweb/extensions/farcaster";
 * const result = encodeTransferAndChangeRecoveryForParams({
 *  from: ...,
 *  to: ...,
 *  recovery: ...,
 *  fromDeadline: ...,
 *  fromSig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 * ```
 */
export function encodeTransferAndChangeRecoveryForParams(
  options: TransferAndChangeRecoveryForParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.recovery,
    options.fromDeadline,
    options.fromSig,
    options.toDeadline,
    options.toSig,
  ]);
}

/**
 * Calls the "transferAndChangeRecoveryFor" function on the contract.
 * @param options - The options for the "transferAndChangeRecoveryFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { transferAndChangeRecoveryFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = transferAndChangeRecoveryFor({
 *  contract,
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
  options: BaseTransactionOptions<
    | TransferAndChangeRecoveryForParams
    | {
        asyncParams: () => Promise<TransferAndChangeRecoveryForParams>;
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
              resolvedParams.from,
              resolvedParams.to,
              resolvedParams.recovery,
              resolvedParams.fromDeadline,
              resolvedParams.fromSig,
              resolvedParams.toDeadline,
              resolvedParams.toSig,
            ] as const;
          }
        : [
            options.from,
            options.to,
            options.recovery,
            options.fromDeadline,
            options.fromSig,
            options.toDeadline,
            options.toSig,
          ],
  });
}
