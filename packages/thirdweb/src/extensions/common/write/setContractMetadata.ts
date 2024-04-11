import { upload } from "../../../storage/upload.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { setContractURI } from "../__generated__/IContractMetadata/write/setContractURI.js";

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
    contract,
    asyncParams: async () => {
      const uri = await upload({
        client: contract.client,
        files: [restParams],
      });

      return {
        uri,
      };
    },
  });
}
