import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getContract } from "../../../../contract/contract.js";

type GetTokenInfoOptions = {
  client: ThirdwebClient;
  chain: Chain;
  tokenAddress?: string;
};

type GetTokenInfoResult = {
  name: string;
  symbol: string;
  decimals: number;
};

/**
 * @internal
 */
export function useTokenInfo(options: GetTokenInfoOptions) {
  const { chain, tokenAddress, client } = options;
  return useQuery({
    enabled: !!chain && !!client,
    queryFn: async () => {
      // erc20 case
      if (tokenAddress) {
        const { getCurrencyMetadata } = await import(
          "../../../../extensions/erc20/read/getCurrencyMetadata.js"
        );
        const result: GetTokenInfoResult = await getCurrencyMetadata({
          contract: getContract({ address: tokenAddress, chain, client }),
        });

        return result;
      }

      const { getChainDecimals, getChainNativeCurrencyName, getChainSymbol } =
        await import("../../../../chains/utils.js");

      const [nativeSymbol, nativeDecimals, nativeName] = await Promise.all([
        getChainSymbol(chain),
        getChainDecimals(chain),
        getChainNativeCurrencyName(chain),
      ]);

      const result: GetTokenInfoResult = {
        decimals: nativeDecimals,
        name: nativeName,
        symbol: nativeSymbol,
      };

      return result;
    },
    queryKey: ["tokenInfo", chain?.id || -1, { tokenAddress }] as const,
  });
}
