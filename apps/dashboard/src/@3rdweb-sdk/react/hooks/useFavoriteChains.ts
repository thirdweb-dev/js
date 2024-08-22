import { useFavouriteChainIds } from "app/(dashboard)/(chain)/components/client/star-button";
import { useSupportedChains } from "hooks/chains/configureChains";
import { useMemo } from "react";
import type { ChainMetadata } from "thirdweb/chains";

export function useFavoriteChains() {
  const allChains = useSupportedChains();
  const favChainsQuery = useFavouriteChainIds();

  const data = useMemo(() => {
    if (favChainsQuery.data) {
      const _chains: ChainMetadata[] = [];
      // biome-ignore lint/complexity/noForEach: FIXME
      favChainsQuery.data.forEach((chainId) => {
        const chain = allChains.find((c) => String(c.chainId) === chainId);
        if (chain) {
          _chains.push(chain);
        }
      });

      return _chains;
    }

    return [] as ChainMetadata[];
  }, [favChainsQuery.data, allChains]);

  return {
    isLoading: favChainsQuery.isLoading,
    data,
  };
}
