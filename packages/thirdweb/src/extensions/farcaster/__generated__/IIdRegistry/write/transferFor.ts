import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "transferFor" function.
 */

export type TransferForParams = {
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

export const FN_SELECTOR = "0x16f72842" as const;
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
 * Encodes the parameters for the "transferFor" function.
 * @param options - The options for the transferFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeTransferForParams } "thirdweb/extensions/farcaster";
 * const result = encodeTransferForParams({
 *  from: ...,
 *  to: ...,
 *  fromDeadline: ...,
 *  fromSig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 * ```
 */
export function encodeTransferForParams(options: TransferForParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.fromDeadline,
    options.fromSig,
    options.toDeadline,
    options.toSig,
  ]);
}

/**
 * Calls the "transferFor" function on the contract.
 * @param options - The options for the "transferFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { transferFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = transferFor({
 *  contract,
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
  options: BaseTransactionOptions<
    | TransferForParams
    | {
        asyncParams: () => Promise<TransferForParams>;
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
