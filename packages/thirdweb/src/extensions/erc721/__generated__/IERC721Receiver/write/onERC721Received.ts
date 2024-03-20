import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "onERC721Received" function.
 */

type OnERC721ReceivedParamsInternal = {
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "operator" }>;
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export type OnERC721ReceivedParams = Prettify<
  | OnERC721ReceivedParamsInternal
  | {
      asyncParams: () => Promise<OnERC721ReceivedParamsInternal>;
    }
>;
const FN_SELECTOR = "0x150b7a02" as const;
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
 * ```
 * import { encodeOnERC721ReceivedParams } "thirdweb/extensions/erc721";
 * const result = encodeOnERC721ReceivedParams({
 *  operator: ...,
 *  from: ...,
 *  tokenId: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnERC721ReceivedParams(
  options: OnERC721ReceivedParamsInternal,
) {
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
 * ```
 * import { onERC721Received } from "thirdweb/extensions/erc721";
 *
 * const transaction = onERC721Received({
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
  options: BaseTransactionOptions<OnERC721ReceivedParams>,
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
