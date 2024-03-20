import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "onSignerRemoved" function.
 */

type OnSignerRemovedParamsInternal = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
  creatorAdmin: AbiParameterToPrimitiveType<{
    type: "address";
    name: "creatorAdmin";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export type OnSignerRemovedParams = Prettify<
  | OnSignerRemovedParamsInternal
  | {
      asyncParams: () => Promise<OnSignerRemovedParamsInternal>;
    }
>;
const METHOD = [
  "0x0db33003",
  [
    {
      type: "address",
      name: "signer",
    },
    {
      type: "address",
      name: "creatorAdmin",
    },
    {
      type: "bytes",
      name: "data",
    },
  ],
  [],
] as const;

/**
 * Calls the "onSignerRemoved" function on the contract.
 * @param options - The options for the "onSignerRemoved" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { onSignerRemoved } from "thirdweb/extensions/erc4337";
 *
 * const transaction = onSignerRemoved({
 *  signer: ...,
 *  creatorAdmin: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function onSignerRemoved(
  options: BaseTransactionOptions<OnSignerRemovedParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.signer,
              resolvedParams.creatorAdmin,
              resolvedParams.data,
            ] as const;
          }
        : [options.signer, options.creatorAdmin, options.data],
  });
}
