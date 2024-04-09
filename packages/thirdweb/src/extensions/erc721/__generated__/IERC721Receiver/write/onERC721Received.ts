import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "onERC721Received" function.
 */

export type OnERC721ReceivedParams = {
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "operator" }>;
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export const FN_SELECTOR = "0x150b7a02" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "operator",
  },
  {
    type: "address",
    name: "from",
  },
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes4",
  },
] as const;

/**
 * Encodes the parameters for the "onERC721Received" function.
 * @param options - The options for the onERC721Received function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeOnERC721ReceivedParams } "thirdweb/extensions/erc721";
 * const result = encodeOnERC721ReceivedParams({
 *  operator: ...,
 *  from: ...,
 *  tokenId: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnERC721ReceivedParams(options: OnERC721ReceivedParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.operator,
    options.from,
    options.tokenId,
    options.data,
  ]);
}

/**
 * Calls the "onERC721Received" function on the contract.
 * @param options - The options for the "onERC721Received" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { onERC721Received } from "thirdweb/extensions/erc721";
 *
 * const transaction = onERC721Received({
 *  contract,
 *  operator: ...,
 *  from: ...,
 *  tokenId: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function onERC721Received(
  options: BaseTransactionOptions<
    | OnERC721ReceivedParams
    | {
        asyncParams: () => Promise<OnERC721ReceivedParams>;
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
              resolvedParams.operator,
              resolvedParams.from,
              resolvedParams.tokenId,
              resolvedParams.data,
            ] as const;
          }
        : [options.operator, options.from, options.tokenId, options.data],
  });
}
