import { useQuery } from "@tanstack/react-query";
import { getChainProvider } from "@thirdweb-dev/sdk/evm";
import { providers } from "ethers";
import { useAddress } from "./wallet";
import { useSupportedChains } from "./useSupportedChains";
import { useWalletContext } from "../../core/providers/thirdweb-wallet-provider";

/**
 *
 * @internal
 */
export function useENS() {
  const address = useAddress();
  const supportedChains = useSupportedChains();
  const { clientId } = useWalletContext();
  const ethereum = supportedChains.find((chain) => chain.chainId === 1);

  return useQuery({
    queryKey: ["ens", address, ethereum?.rpc],
    cacheTime: 60 * 60 * 24 * 1000, // 24h
    staleTime: 60 * 60 * 1000, // 1h
    retry: false,
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        return null;
      }

      const provider = getChainProvider(1, {
        clientId,
        supportedChains: ethereum
          ? [
              {
                chainId: 1,
                rpc: [...ethereum.rpc],
                nativeCurrency: ethereum.nativeCurrency,
                slug: ethereum.slug,
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
