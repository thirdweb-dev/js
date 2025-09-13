import {
  getContractMetadata as apiGetContractMetadata,
  configure,
} from "@thirdweb-dev/api";
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
  name: string;
  symbol: string;
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  [key: string]: any;
}> {
  // Configure the API client
  configure({
    clientId: options.contract.client.clientId,
    secretKey: options.contract.client.secretKey,
  });

  try {
    // Try to get metadata from the API first
    const response = await apiGetContractMetadata({
      path: {
        chainId: options.contract.chain.id,
        address: options.contract.address,
      },
    });

    if (response.data?.result?.output?.abi) {
      // Extract name and symbol from ABI or devdoc/userdoc
      const abi = response.data.result.output.abi;
      const devdoc = response.data.result.output.devdoc;
      const userdoc = response.data.result.output.userdoc;

      // Try to find name and symbol from ABI functions
      let contractName = "";
      let contractSymbol = "";

      if (Array.isArray(abi)) {
        const nameFunc = abi.find(
          (item: any) =>
            item.type === "function" &&
            item.name === "name" &&
            item.inputs?.length === 0,
        );
        const symbolFunc = abi.find(
          (item: any) =>
            item.type === "function" &&
            item.name === "symbol" &&
            item.inputs?.length === 0,
        );

        if (nameFunc || symbolFunc) {
          // Fall back to RPC if we found name/symbol functions in ABI
          const [resolvedName, resolvedSymbol] = await Promise.all([
            nameFunc ? name(options).catch(() => null) : null,
            symbolFunc ? symbol(options).catch(() => null) : null,
          ]);
          contractName = resolvedName || "";
          contractSymbol = resolvedSymbol || "";
        }
      }

      return {
        name: contractName,
        symbol: contractSymbol,
        abi: abi,
        compiler: response.data.result.compiler,
        language: response.data.result.language,
        devdoc: devdoc,
        userdoc: userdoc,
      };
    }
  } catch (error) {
    // API failed, fall back to original implementation
    console.debug("Contract metadata API failed, falling back to RPC:", error);
  }

  // Fallback to original RPC-based implementation
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

  return {
    ...resolvedMetadata,
    name: resolvedMetadata?.name ?? resolvedName,
    symbol: resolvedMetadata?.symbol ?? resolvedSymbol,
  };
}
