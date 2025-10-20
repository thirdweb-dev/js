import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { fetchContractMetadata } from "../../../utils/contract/fetchContractMetadata.js";
import { contractURI } from "../__generated__/IContractMetadata/read/contractURI.js";
import { name } from "./name.js";
import { symbol } from "./symbol.js";

export { isContractURISupported as isGetContractMetadataSupported } from "../__generated__/IContractMetadata/read/contractURI.js";

/**
 * Retrieves the contract metadata including name and symbol.
 * @param options The transaction options.
 * @returns A promise that resolves to an object containing the resolved metadata, name, and symbol.
 * @extension COMMON
 * @example
 * ```ts
 * import { getContractMetadata } from "thirdweb/extensions/common";
 * const metadata = await getContractMetadata({ contract });
 * ```
 */
export async function getContractMetadata(
  options: BaseTransactionOptions,
): Promise<{
  name: string | null;
  symbol: string | null;
  [key: string]: unknown;
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
    ...(resolvedMetadata ?? {}),
    name:
      resolvedMetadata?.name && typeof resolvedMetadata.name === "string"
        ? resolvedMetadata.name
        : resolvedName,
    symbol:
      resolvedMetadata?.symbol && typeof resolvedMetadata.symbol === "string"
        ? resolvedMetadata.symbol
        : resolvedSymbol,
  };
}
