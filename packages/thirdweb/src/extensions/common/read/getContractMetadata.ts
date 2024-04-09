import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { fetchContractMetadata } from "../../../utils/contract/fetchContractMetadata.js";
import { contractURI } from "../__generated__/IContractMetadata/read/contractURI.js";
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
export async function getContractMetadata(
  options: BaseTransactionOptions,
): Promise<{
  name: string;
  symbol: string;
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  [key: string]: any;
}> {
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
    name(options).catch(() => null),
    symbol(options).catch(() => null),
  ]);

  // TODO: basic parsing?
  return {
    ...resolvedMetadata,
    name: resolvedMetadata?.name ?? resolvedName,
    symbol: resolvedMetadata?.symbol ?? resolvedSymbol,
  };
}
