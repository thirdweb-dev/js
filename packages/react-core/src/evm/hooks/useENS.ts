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

      let provider = null;
      if (chainId == 8453) {
        // if the active chain is Base, then establish a provider using Base Name Service to resolve addresses and avatars
        provider = new providers.JsonRpcProvider("https://mainnet.base.org/", {
          name: "base",
          chainId: chainId,
          ensAddress: "0xeCBaE6E54bAA669005b93342E5650d5886D54fc7",
        });
      } else {
        provider = getChainProvider(1, {
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
      }

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
