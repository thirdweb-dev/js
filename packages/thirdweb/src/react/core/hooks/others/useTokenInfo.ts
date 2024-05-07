import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../chains/types.js";
import {
  getChainDecimals,
  getChainNativeCurrencyName,
  getChainSymbol,
} from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getContract } from "../../../../contract/contract.js";

export type GetTokenInfoOptions = {
  client: ThirdwebClient;
  chain: Chain;
  /**
   * (Optional) The address of the token to retrieve the balance for. If not provided, the balance of the native token will be retrieved.
   */
  tokenAddress?: string;
};

export type GetTokenInfoResult = {
  name: string;
  symbol: string;
  decimals: number;
};

/**
 * @internal
 */
export function useTokenInfo(options: Partial<GetTokenInfoOptions>) {
  const { chain, tokenAddress, client } = options;
  return useQuery({
    queryKey: ["tokenInfo", chain?.id || -1, { tokenAddress }] as const,
    queryFn: async () => {
      if (!chain) {
        throw new Error("chain is required");
      }
      if (!client) {
        throw new Error("client is required");
      }

      // erc20 case
      if (tokenAddress) {
        const { getCurrencyMetadata } = await import(
          "../../../../extensions/erc20/read/getCurrencyMetadata.js"
        );
        const result: GetTokenInfoResult = await getCurrencyMetadata({
          contract: getContract({ client, chain, address: tokenAddress }),
        });

        return result;
      }

      const [nativeSymbol, nativeDecimals, nativeName] = await Promise.all([
        getChainSymbol(chain),
        getChainDecimals(chain),
        getChainNativeCurrencyName(chain),
      ]);

      const result: GetTokenInfoResult = {
        decimals: nativeDecimals,
        symbol: nativeSymbol,
        name: nativeName,
      };

      return result;
    },
    enabled: !!chain && !!client,
  });
}
