import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "mintTo" function.
 */

type MintToParamsInternal = {
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "uri" }>;
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
};

export type MintToParams = Prettify<
  | MintToParamsInternal
  | {
      asyncParams: () => Promise<MintToParamsInternal>;
    }
>;
/**
 * Calls the "mintTo" function on the contract.
 * @param options - The options for the "mintTo" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { mintTo } from "thirdweb/extensions/erc1155";
 *
 * const transaction = mintTo({
 *  to: ...,
 *  tokenId: ...,
 *  uri: ...,
 *  amount: ...,
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
    method: [
      "0xb03f4528",
      [
        {
          type: "address",
          name: "to",
        },
        {
          type: "uint256",
          name: "tokenId",
        },
        {
          type: "string",
          name: "uri",
        },
        {
          type: "uint256",
          name: "amount",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.to,
          resolvedParams.tokenId,
          resolvedParams.uri,
          resolvedParams.amount,
        ] as const;
      }

      return [
        options.to,
        options.tokenId,
        options.uri,
        options.amount,
      ] as const;
    },
  });
}
