import { isProd } from "@/constants/env";
import { useAllChainsData } from "hooks/chains/allChains";
import { createContext, useCallback, useEffect, useState } from "react";
import type { ChainMetadata } from "thirdweb/chains";

// extra information on top of Chain interface
// all keys added here must be optional
export interface StoredChain extends ChainMetadata {
  isModified?: boolean;
  isCustom?: boolean;
  isOverwritten?: boolean;
}

const MODIFIED_CHAINS_KEY = "tw-modified-chains";
const RECENTLY_USED_CHAIN_IDS_KEY = "tw-recently-used-chains";

/**
 * holds the "supported chains" array
 * initially it is set to the defaultChains, then it is updated to the "allChains" with "modified chains" overrides
 */
export const SupportedChainsContext = createContext<StoredChain[] | undefined>(
  undefined,
);

/**
 * holds the "modified chains" array
 */
const ModifiedChainsContext = createContext<StoredChain[] | undefined>(
  undefined,
);

/**
 * holds the "modified chains" array
 */
export const RemoveChainModification = createContext<
  ((chainId: number) => void) | undefined
>(undefined);

/**
 * holds the "recently used chain ids" array
 */
export const RecentlyUsedChainIdsContext = createContext<number[] | undefined>(
  undefined,
);

/**
 * holds the function that takes a chainId and adds it to the "recently used chains" and handles its storage
 */
export const AddRecentlyUsedChainIdsContext = createContext<
  ((chainId: number) => void) | undefined
>(undefined);

/**
 * holds the function that takes the "modified chain" object
 * and handles the logic of updating the "supported chains" and "modified chains" and "recently used chains"
 */
export const ModifyChainContext = createContext<
  ((chain: ChainMetadata, remove?: boolean) => void) | undefined
>(undefined);

/**
 * flag indicating if the supported chains is having the final value or not
 * app starts with the defaultChains as supported chains
 * then allChains is dynamically imported or fetched from indexedDB, user modified chains are fetched from localStorage
 * and then the final supported chains is calculated by overriding the modifiedChains on allChains
 */
export const SupportedChainsReadyContext = createContext(false);

/**
 * Flag indicating if the "Network Config" Modal is open or not
 */
export const isNetworkConfigModalOpenCtx = createContext(false);
export const SetIsNetworkConfigModalOpenCtx = createContext<
  ((value: boolean) => void) | undefined
>(undefined);

/**
 * Chain object to be edited in the "Network Config" Modal
 */
export const EditChainContext = createContext<ChainMetadata | undefined>(
  undefined,
);
export const SetEditChainContext = createContext<
  ((chain: ChainMetadata | undefined) => void) | undefined
>(undefined);

const replaceRpcsWithDevUrl = (chains: ChainMetadata[]) => {
  if (isProd) {
    return chains;
  }

  return chains.map((chn) => {
    return {
      ...chn,
      rpc: chn.rpc.map((rpc) =>
        rpc.replace("rpc.thirdweb.com", "rpc.thirdweb-dev.com"),
      ),
    };
  });
};

/**
 * if no networks are configured by the user, return the defaultChains
 */
export function ChainsProvider(props: { children: React.ReactNode }) {
  const [supportedChains, setSupportedChains] = useState<StoredChain[]>([]);
  const [modifiedChains, setModifiedChains] = useState<StoredChain[]>([]);
  const [isSupportedChainsReady, setIsSupportedChainsReady] = useState(false);
  const [recentlyUsedChainIds, setRecentlyUsedChainIds] = useState<number[]>(
    [],
  );
  const [isNetworkConfigModalOpen, setIsNetworkConfigModalOpen] =
    useState(false);
  const [editChain, setEditChain] = useState<ChainMetadata | undefined>(
    undefined,
  );

  const addRecentlyUsedChainId = useCallback((chainId: number) => {
    setRecentlyUsedChainIds((_recentlyUsedChainIds) => {
      const newRecentlyUsedChains = _recentlyUsedChainIds.filter(
        (c) => c !== chainId,
      );

      // add to the front of the array
      newRecentlyUsedChains.unshift(chainId);

      // only keep the first 5
      newRecentlyUsedChains.splice(5);

      return newRecentlyUsedChains;
    });
  }, []);

  // save recently used chains to storage
  // FIXME: probably want to move this to backend (similar to favorites)
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    try {
      localStorage.setItem(
        RECENTLY_USED_CHAIN_IDS_KEY,
        JSON.stringify(recentlyUsedChainIds),
      );
    } catch {
      localStorage.clear();
      localStorage.setItem(
        RECENTLY_USED_CHAIN_IDS_KEY,
        JSON.stringify(recentlyUsedChainIds),
      );
    }
  }, [recentlyUsedChainIds]);

  const { allChains, chainIdToIndexRecord } = useAllChainsData();

  // get recently used chains from stroage
  // FIXME: probably want to move this to backend (similar to favorites)
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!isSupportedChainsReady) {
      return;
    }
    const _recentlyUsedChainsStr = localStorage.getItem(
      RECENTLY_USED_CHAIN_IDS_KEY,
    );
    if (!_recentlyUsedChainsStr) {
      return;
    }

    try {
      const _recentlyUsedChainIds = JSON.parse(
        _recentlyUsedChainsStr,
      ) as number[];

      setRecentlyUsedChainIds(_recentlyUsedChainIds);
    } catch {
      localStorage.removeItem(RECENTLY_USED_CHAIN_IDS_KEY);
    }
  }, [isSupportedChainsReady]);

  const applyOverrides = useCallback(
    (target: StoredChain[], overrides: StoredChain[]) => {
      const result = [...target];

      // biome-ignore lint/complexity/noForEach: FIXME
      overrides.forEach((modifiedChain) => {
        // if this chain is already in the supported chains, update it
        if (modifiedChain.chainId in chainIdToIndexRecord) {
          const i = chainIdToIndexRecord[modifiedChain.chainId];
          if (!result[i]) {
            throw new Error("invalid attempt to overide");
          }

          result[i] = modifiedChain;
        } else {
          result.push(modifiedChain);
        }
      });

      return result;
    },
    [chainIdToIndexRecord],
  );

  const applyModificationsToSupportedChains = useCallback(
    (newModifiedChains: ChainMetadata[]) => {
      setSupportedChains((_supportedChains) => {
        return applyOverrides(_supportedChains, newModifiedChains);
      });
    },
    [applyOverrides],
  );

  // create supported chains and modified chains on mount
  // FIXME: this should be computed not via setState
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (allChains.length === 0) {
      return;
    }

    if (isSupportedChainsReady) {
      return;
    }

    const allChainsReplaced = replaceRpcsWithDevUrl(allChains);

    const _modifiedChains = chainStorage.get(MODIFIED_CHAINS_KEY);

    if (_modifiedChains.length === 0) {
      setSupportedChains(allChainsReplaced);
      setIsSupportedChainsReady(true);
      return;
    }

    const newSupportedChains = applyOverrides(
      allChainsReplaced,
      _modifiedChains,
    );
    setSupportedChains(newSupportedChains);
    setModifiedChains(_modifiedChains);
    setIsSupportedChainsReady(true);
  }, [allChains, isSupportedChainsReady, applyOverrides]);

  const modifyChain = useCallback(
    (chain: StoredChain) => {
      setModifiedChains((_modifiedChains) => {
        const i = _modifiedChains.findIndex((c) => c.chainId === chain.chainId);
        let newModifiedChains: StoredChain[];
        if (i !== -1) {
          // if this chain is already in the modified chains, update it
          newModifiedChains = [..._modifiedChains];
          newModifiedChains[i] = chain as StoredChain;
        } else {
          // else add it to the modified chains
          newModifiedChains = [..._modifiedChains, chain as StoredChain];
        }

        applyModificationsToSupportedChains(newModifiedChains);
        chainStorage.set(MODIFIED_CHAINS_KEY, newModifiedChains);

        return newModifiedChains;
      });
    },
    [applyModificationsToSupportedChains],
  );

  const removeChainModification = useCallback(
    (chainId: number) => {
      setModifiedChains((_modifiedChains) => {
        const newModifiedChains = _modifiedChains.filter(
          (c) => c.chainId !== chainId,
        );

        applyModificationsToSupportedChains(newModifiedChains);
        chainStorage.set(MODIFIED_CHAINS_KEY, newModifiedChains);

        // also remove from recently used chains
        setRecentlyUsedChainIds((prevIds) => {
          return prevIds.filter((id) => id !== chainId);
        });
        return newModifiedChains;
      });
    },
    [applyModificationsToSupportedChains],
  );

  return (
    <SupportedChainsContext.Provider
      // always run this again
      value={replaceRpcsWithDevUrl(supportedChains)}
    >
      <SupportedChainsReadyContext.Provider value={isSupportedChainsReady}>
        <ModifiedChainsContext.Provider value={modifiedChains}>
          <ModifyChainContext.Provider value={modifyChain}>
            <RemoveChainModification.Provider value={removeChainModification}>
              <RecentlyUsedChainIdsContext.Provider
                value={recentlyUsedChainIds}
              >
                <AddRecentlyUsedChainIdsContext.Provider
                  value={addRecentlyUsedChainId}
                >
                  <EditChainContext.Provider value={editChain}>
                    <SetEditChainContext.Provider value={setEditChain}>
                      <isNetworkConfigModalOpenCtx.Provider
                        value={isNetworkConfigModalOpen}
                      >
                        <SetIsNetworkConfigModalOpenCtx.Provider
                          value={setIsNetworkConfigModalOpen}
                        >
                          {props.children}
                        </SetIsNetworkConfigModalOpenCtx.Provider>
                      </isNetworkConfigModalOpenCtx.Provider>
                    </SetEditChainContext.Provider>
                  </EditChainContext.Provider>
                </AddRecentlyUsedChainIdsContext.Provider>
              </RecentlyUsedChainIdsContext.Provider>
            </RemoveChainModification.Provider>
          </ModifyChainContext.Provider>
        </ModifiedChainsContext.Provider>
      </SupportedChainsReadyContext.Provider>
    </SupportedChainsContext.Provider>
  );
}

// storage  --------------------------------------------

const chainStorage = {
  get(key: string): ChainMetadata[] {
    try {
      const networkListStr = localStorage.getItem(key);
      return networkListStr ? JSON.parse(networkListStr) : [];
    } catch {
      // if parsing error, clear dirty storage
      localStorage.removeItem(key);
    }

    return [];
  },

  set(key: string, networkList: ChainMetadata[]) {
    const value = JSON.stringify(networkList);
    try {
      localStorage.setItem(key, value);
    } catch {
      // if storage limit exceed
      // clear entire local storage and then try again
      localStorage.clear();
      localStorage.setItem(key, value);
    }
  },
};
