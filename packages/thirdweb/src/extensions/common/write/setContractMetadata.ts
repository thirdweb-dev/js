import { upload } from "../../../storage/upload.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { setContractURI } from "../__generated__/IContractMetadata/write/setContractURI.js";

export { isSetContractURISupported as isSetContractMetadataSupported } from "../__generated__/IContractMetadata/write/setContractURI.js";

/**
 * @extension COMMON
 */
export type SetContractMetadataParams = Record<string, unknown>;

/**
 * Sets the metadata for a contract.
 *
 * @param options - The options for setting the contract metadata.
 * @returns - The prepared transaction to set the contract metadata.
 * @extension COMMON
 * @example
 * ```ts
 * import { setContractMetadata } from '@thirdweb/extensions/common';
 * import { sendTransaction } from 'thirdweb';
 *
 * const transaction = setContractMetadata({
 *  contract,
 *  name: 'My NFT',
 *  symbol: 'NFT',
 * });
 *
 * // Send the transaction
 * await sendTransaction({
 *  transaction,
 *  account,
 * });
 * ```
 */
export function setContractMetadata({
  contract,
  ...restParams
}: BaseTransactionOptions<SetContractMetadataParams>) {
  return setContractURI({
    asyncParams: async () => {
      const uri = await upload({
        client: contract.client,
        files: [restParams],
      });

      return {
        uri,
      };
    },
    contract,
  });
}
