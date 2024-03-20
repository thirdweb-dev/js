import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "addFor" function.
 */

type AddForParamsInternal = {
  fidOwner: AbiParameterToPrimitiveType<{ type: "address"; name: "fidOwner" }>;
  keyType: AbiParameterToPrimitiveType<{ type: "uint32"; name: "keyType" }>;
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
  metadataType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "metadataType";
  }>;
  metadata: AbiParameterToPrimitiveType<{ type: "bytes"; name: "metadata" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
};

export type AddForParams = Prettify<
  | AddForParamsInternal
  | {
      asyncParams: () => Promise<AddForParamsInternal>;
    }
>;
/**
 * Calls the "addFor" function on the contract.
 * @param options - The options for the "addFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { addFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = addFor({
 *  fidOwner: ...,
 *  keyType: ...,
 *  key: ...,
 *  metadataType: ...,
 *  metadata: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function addFor(options: BaseTransactionOptions<AddForParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa005d3d2",
      [
        {
          type: "address",
          name: "fidOwner",
        },
        {
          type: "uint32",
          name: "keyType",
        },
        {
          type: "bytes",
          name: "key",
        },
        {
          type: "uint8",
          name: "metadataType",
        },
        {
          type: "bytes",
          name: "metadata",
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
              resolvedParams.fidOwner,
              resolvedParams.keyType,
              resolvedParams.key,
              resolvedParams.metadataType,
              resolvedParams.metadata,
              resolvedParams.deadline,
              resolvedParams.sig,
            ] as const;
          }
        : [
            options.fidOwner,
            options.keyType,
            options.key,
            options.metadataType,
            options.metadata,
            options.deadline,
            options.sig,
          ],
  });
}
