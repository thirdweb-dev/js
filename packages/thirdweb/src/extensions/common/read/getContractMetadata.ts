import type { TxOpts } from "../../../transaction/transaction.js";
import { fetchContractMetadata } from "../../../utils/contract/fetchContractMetadata.js";
import { contractURI } from "./contractURI.js";
import { name } from "./name.js";
import { symbol } from "./symbol.js";

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
export async function getContractMetadata(options: TxOpts) {
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
