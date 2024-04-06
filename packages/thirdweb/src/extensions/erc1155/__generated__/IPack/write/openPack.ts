import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "openPack" function.
 */

export type OpenPackParams = {
  packId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "packId" }>;
  amountToOpen: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "amountToOpen";
  }>;
};

export const FN_SELECTOR = "0x914e126a" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "packId",
  },
  {
    type: "uint256",
    name: "amountToOpen",
  },
] as const;
const FN_OUTPUTS = [
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
] as const;

/**
 * Encodes the parameters for the "openPack" function.
 * @param options - The options for the openPack function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeOpenPackParams } "thirdweb/extensions/erc1155";
 * const result = encodeOpenPackParams({
 *  packId: ...,
 *  amountToOpen: ...,
 * });
 * ```
 */
export function encodeOpenPackParams(options: OpenPackParams) {
  return encodeAbiParameters(FN_INPUTS, [options.packId, options.amountToOpen]);
}

/**
 * Calls the "openPack" function on the contract.
 * @param options - The options for the "openPack" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { openPack } from "thirdweb/extensions/erc1155";
 *
 * const transaction = openPack({
 *  contract,
 *  packId: ...,
 *  amountToOpen: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function openPack(
  options: BaseTransactionOptions<
    | OpenPackParams
    | {
        asyncParams: () => Promise<OpenPackParams>;
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
              resolvedParams.packId,
              resolvedParams.amountToOpen,
            ] as const;
          }
        : [options.packId, options.amountToOpen],
  });
}
