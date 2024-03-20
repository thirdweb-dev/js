import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "openPack" function.
 */

type OpenPackParamsInternal = {
  packId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "packId" }>;
  amountToOpen: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "amountToOpen";
  }>;
};

export type OpenPackParams = Prettify<
  | OpenPackParamsInternal
  | {
      asyncParams: () => Promise<OpenPackParamsInternal>;
    }
>;
const METHOD = [
  "0x914e126a",
  [
    {
      type: "uint256",
      name: "packId",
    },
    {
      type: "uint256",
      name: "amountToOpen",
    },
  ],
  [
    {
      type: "tuple[]",
      components: [
        {
          type: "address",
          name: "assetContract",
        },
        {
          type: "uint8",
          name: "tokenType",
        },
        {
          type: "uint256",
          name: "tokenId",
        },
        {
          type: "uint256",
          name: "totalAmount",
        },
      ],
    },
  ],
] as const;

/**
 * Calls the "openPack" function on the contract.
 * @param options - The options for the "openPack" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { openPack } from "thirdweb/extensions/erc1155";
 *
 * const transaction = openPack({
 *  packId: ...,
 *  amountToOpen: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function openPack(options: BaseTransactionOptions<OpenPackParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.packId,
              resolvedParams.amountToOpen,
            ] as const;
          }
        : [options.packId, options.amountToOpen],
  });
}
