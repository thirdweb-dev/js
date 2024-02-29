import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
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
    method: [
  "0x938e3d7b",
  [
    {
      "type": "string",
      "name": "uri"
    }
  ],
  []
],
    params: [options.uri],
  });
}
