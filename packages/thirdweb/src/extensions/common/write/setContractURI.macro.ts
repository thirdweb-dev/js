import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Represents the parameters for setting the contract URI.
 */
export type SetContractURIParams = {
  uri: string;
};

/**
 * Sets the contract URI for a given contract.
 * @param options - The options for setting the contract URI.
 * @returns A prepared transaction object.
 * @extension
 * @example
 * ```ts
 * import { setContractURI } from "thirdweb/extensions/common";
 *
 * const transaction = setContractURI({
 *  contract: USDC_CONTRACT,
 *  uri: "ipfs://...",
 * });
 * ```
 */
export function setContractURI(
  options: BaseTransactionOptions<SetContractURIParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: $run$(() => prepareMethod("function setContractURI(string uri)")),
    params: [options.uri],
  });
}
