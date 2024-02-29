import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Represents the parameters for transferring an ERC721 token from one address to another.
 */
export type TransferFromParams = {
  from: Address;
  to: Address;
  tokenId: bigint;
};

/**
 * Transfers an ERC721 token from one address to another.
 * @param options - The options for the transferFrom function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { transferFrom } from "thirdweb/extensions/erc721";
 *
 * const transaction = transferFrom({
 *  contract: USDC_CONTRACT,
 *  from: "0x1234...",
 *  to: "0x5678...",
 *  tokenId: 1n,
 * });
 *
 * // Send the transaction
 * ```
 */
export function transferFrom(
  options: BaseTransactionOptions<TransferFromParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: $run$(() =>
      prepareMethod("function transferFrom(address, address, uint256)"),
    ),
    params: [options.from, options.to, options.tokenId],
  });
}
