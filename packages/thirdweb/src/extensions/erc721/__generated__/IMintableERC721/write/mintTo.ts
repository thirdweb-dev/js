import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "mintTo" function.
 */

type MintToParamsInternal = {
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "uri" }>;
};

export type MintToParams = Prettify<
  | MintToParamsInternal
  | {
      asyncParams: () => Promise<MintToParamsInternal>;
    }
>;
const METHOD = [
  "0x0075a317",
  [
    {
      type: "address",
      name: "to",
    },
    {
      type: "string",
      name: "uri",
    },
  ],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "mintTo" function on the contract.
 * @param options - The options for the "mintTo" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { mintTo } from "thirdweb/extensions/erc721";
 *
 * const transaction = mintTo({
 *  to: ...,
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mintTo(options: BaseTransactionOptions<MintToParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.to, resolvedParams.uri] as const;
          }
        : [options.to, options.uri],
  });
}
