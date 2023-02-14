import { useUpdateConfiguredChains } from "./configureChains";
import { AllChainsContext } from "contexts/all-chains";
import { StoredChain } from "contexts/configured-chains";
import { useCallback, useContext } from "react";
import invariant from "tiny-invariant";

export function useAllChainsData() {
  const data = useContext(AllChainsContext);
  invariant(data, "useAllChains must be used within AllChainsContext");
  return data;
}

/**
 * provides a function to resolve + auto configure given set of chains using allChainsData.chainIdToChainRecord
 */
export function useAutoConfigureChains() {
  const { chainIdToChainRecord } = useAllChainsData();
  const updateConfiguredChains = useUpdateConfiguredChains();

  return useCallback(
    (chainIdSet: Set<number>) => {
      // instead of configuring one by one, configure all at once to avoid triggering re-rendering entire app multiple times
      const chainsToAutoConfigure: StoredChain[] = [];
      chainIdSet.forEach((chainId) => {
        // if we can resolve the chainId
        if (chainId in chainIdToChainRecord) {
          // auto configure it
          chainsToAutoConfigure.push({
            ...chainIdToChainRecord[chainId],
            isAutoConfigured: true,
          });
        }
      });

      if (chainsToAutoConfigure.length > 0) {
        updateConfiguredChains.add(chainsToAutoConfigure);
      }
    },
    [chainIdToChainRecord, updateConfiguredChains],
  );
}
