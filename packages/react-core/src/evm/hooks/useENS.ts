import { useQuery } from "@tanstack/react-query";
import { getChainProvider } from "@thirdweb-dev/sdk/evm";
import { providers } from "ethers";
import { useAddress, useChainId } from "./wallet";
import { useSupportedChains } from "./useSupportedChains";
import { useWalletContext } from "../../core/providers/thirdweb-wallet-provider";
import { Base } from "@thirdweb-dev/chains";

/**
 *
 * @internal
 */
export function useENS() {
  const address = useAddress();
  const chainId = useChainId();
  const supportedChains = useSupportedChains();
  const { clientId } = useWalletContext();
  let chain = supportedChains.find((chain) => chain.chainId === 1);

  if (chainId === Base.chainId) {
    chain = Base;
  }

  return useQuery({
    queryKey: ["ens", address, chain?.rpc],
    cacheTime: 60 * 60 * 24 * 1000, // 24h
    staleTime: 60 * 60 * 1000, // 1h
    retry: false,
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        return null;
      }

      const provider = getChainProvider(chain?.chainId || 1, {
        clientId,
        supportedChains: chain
          ? [
              {
                chainId: chain.chainId,
                rpc: [...chain.rpc],
                nativeCurrency: chain.nativeCurrency,
                slug: chain.slug,
              },
            ]
          : undefined,
      });

      if (provider instanceof providers.JsonRpcProvider) {
        const [ens, avatarUrl] = await Promise.all([
          provider.lookupAddress(address),
          provider.getAvatar(address),
        ] as const);

        return {
          ens,
          avatarUrl,
        };
      }

      return {
        ens: await provider.lookupAddress(address),
        avatarUrl: null,
      };
    },
  });
}
