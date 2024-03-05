import { fetchContractMetadata } from "../../../utils/contract/fetchContractMetadata.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { contractURI } from "../__generated__/IContractMetadata/read/contractURI.js";
import { symbol } from "../../erc20/__generated__/IERC20Metadata/read/symbol.js";
import { name } from "../../erc20/__generated__/IERC20Metadata/read/name.js";

/**
 * Retrieves the contract metadata including name and symbol.
 * @param options The transaction options.
 * @returns A promise that resolves to an object containing the resolved metadata, name, and symbol.
 * @extension
 * @example
 * ```ts
 * import { getContractMetadata } from "thirdweb/extensions/common";
 * const metadata = await getContractMetadata({ contract });
 * ```
 */
export async function getContractMetadata(options: BaseTransactionOptions) {
  const [resolvedMetadata, resolvedName, resolvedSymbol] = await Promise.all([
    contractURI(options)
      .then((uri) => {
        if (uri) {
          return fetchContractMetadata({
            client: options.contract.client,
            uri,
          });
        }
        return null;
      })
      .catch(() => null),
    name(options),
    symbol(options),
  ]);

  // TODO: basic parsing?
  return {
    ...resolvedMetadata,
    name: resolvedName,
    symbol: resolvedSymbol,
  };
}
