import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "recoverFor" function.
 */

export type RecoverForParams = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  recoveryDeadline: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "recoveryDeadline";
  }>;
  recoverySig: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "recoverySig";
  }>;
  toDeadline: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "toDeadline";
  }>;
  toSig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "toSig" }>;
};

export const FN_SELECTOR = "0xba656434" as const;
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
    name: "recoveryDeadline",
  },
  {
    type: "bytes",
    name: "recoverySig",
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
 * Encodes the parameters for the "recoverFor" function.
 * @param options - The options for the recoverFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRecoverForParams } "thirdweb/extensions/farcaster";
 * const result = encodeRecoverForParams({
 *  from: ...,
 *  to: ...,
 *  recoveryDeadline: ...,
 *  recoverySig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 * ```
 */
export function encodeRecoverForParams(options: RecoverForParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.recoveryDeadline,
    options.recoverySig,
    options.toDeadline,
    options.toSig,
  ]);
}

/**
 * Calls the "recoverFor" function on the contract.
 * @param options - The options for the "recoverFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { recoverFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = recoverFor({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  recoveryDeadline: ...,
 *  recoverySig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function recoverFor(
  options: BaseTransactionOptions<
    | RecoverForParams
    | {
        asyncParams: () => Promise<RecoverForParams>;
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
              resolvedParams.recoveryDeadline,
              resolvedParams.recoverySig,
              resolvedParams.toDeadline,
              resolvedParams.toSig,
            ] as const;
          }
        : [
            options.from,
            options.to,
            options.recoveryDeadline,
            options.recoverySig,
            options.toDeadline,
            options.toSig,
          ],
  });
}
