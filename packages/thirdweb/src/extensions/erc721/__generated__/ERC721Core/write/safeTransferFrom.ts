import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */

export type SafeTransferFromParams = {
  from: AbiParameterToPrimitiveType<{
    name: "from";
    type: "address";
    internalType: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    name: "to";
    type: "address";
    internalType: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    name: "tokenId";
    type: "uint256";
    internalType: "uint256";
  }>;
};

const FN_SELECTOR = "0x42842e0e" as const;
const FN_INPUTS = [
  {
    name: "from",
    type: "address",
    internalType: "address",
  },
  {
    name: "to",
    type: "address",
    internalType: "address",
  },
  {
    name: "tokenId",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "safeTransferFrom" function.
 * @param options - The options for the safeTransferFrom function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSafeTransferFromParams } "thirdweb/extensions/erc721";
 * const result = encodeSafeTransferFromParams({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeSafeTransferFromParams(options: SafeTransferFromParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.tokenId,
  ]);
}

/**
 * Calls the "safeTransferFrom" function on the contract.
 * @param options - The options for the "safeTransferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { safeTransferFrom } from "thirdweb/extensions/erc721";
 *
 * const transaction = safeTransferFrom({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function safeTransferFrom(
  options: BaseTransactionOptions<
    | SafeTransferFromParams
    | {
        asyncParams: () => Promise<SafeTransferFromParams>;
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
              resolvedParams.tokenId,
            ] as const;
          }
        : [options.from, options.to, options.tokenId],
  });
}
