import {
  prepareTransaction,
  type TxOpts,
} from "../../../transaction/transaction.js";

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
export function setContractURI(options: TxOpts<SetContractURIParams>) {
  return prepareTransaction({
    contract: options.contract,
    method: "function setContractURI(string uri)",
    params: [options.uri],
  });
}
