import { useMemo } from "react";
import type { Chain } from "@thirdweb-dev/chains";
import { useFavouriteChainIds } from "../../../app/(dashboard)/(chain)/components/client/star-button";
import { useSupportedChains } from "@thirdweb-dev/react";

export function useFavoriteChains() {
  const allChains = useSupportedChains();
  const favChainsQuery = useFavouriteChainIds();

  const data = useMemo(() => {
    if (favChainsQuery.data) {
      const _chains: Chain[] = [];
      favChainsQuery.data.forEach((chainId) => {
        const chain = allChains.find((c) => String(c.chainId) === chainId);
        if (chain) {
          _chains.push(chain);
        }
      });

      return _chains;
    }

    return [] as Chain[];
  }, [favChainsQuery.data, allChains]);

  return {
    isLoading: favChainsQuery.isLoading,
    data,
  };
}
